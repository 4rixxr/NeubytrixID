import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { UserProfile, Material } from '../types';

const env = import.meta.env;
export const isFirebaseConfigured = Boolean(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID && env.VITE_FIREBASE_AUTH_DOMAIN);
const app = isFirebaseConfigured ? (getApps().length ? getApp() : initializeApp({ apiKey: env.VITE_FIREBASE_API_KEY, projectId: env.VITE_FIREBASE_PROJECT_ID, authDomain: env.VITE_FIREBASE_AUTH_DOMAIN, appId: env.VITE_FIREBASE_APP_ID })) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app, env.VITE_FIRESTORE_DATABASE_ID || '(default)') : null;
export async function signInWithGoogle(): Promise<User> {
  if (!auth) throw new Error('Login Google belum dikonfigurasi.');
  const provider = new GoogleAuthProvider(); provider.setCustomParameters({ prompt: 'select_account' });
  return (await signInWithPopup(auth, provider)).user;
}
export async function logOutFromFirebase() { if (auth) await signOut(auth); }
export function onAuthUserChanged(callback: (user: User | null) => void): () => void {
  if (!auth) { callback(null); return () => {}; }
  return onAuthStateChanged(auth, callback);
}
function ownedDatabase(userId: string) {
  if (!db || !auth?.currentUser || auth.currentUser.uid !== userId) throw new Error('Masuk dengan akun Google pemilik dokumen untuk mengakses penyimpanan cloud.');
  return db;
}
export async function withCloudTimeout<T>(task: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  try { return await Promise.race([task, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Koneksi cloud melewati batas waktu. Data tetap tersedia di perangkat.')), 8000); })]); }
  finally { clearTimeout(timer!); }
}
export interface StoredDocument {
  id: string; userId: string; userEmail?: string; title: string; subject: string; fileName: string; fileType: string; fileSize?: number;
  rawText: string; summary?: string; keyTerms?: Array<{ term: string; definition: string }>; flashcards?: Material['flashcards']; quizQuestions?: Material['quizQuestions'];
  createdAt: string; updatedAt: string; syncStatus?: 'local' | 'synced'; schoolLevel?: Material['schoolLevel']; grade?: string;
}
export function cleanDocId(raw: string) { return raw.trim().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128); }
export async function saveUserProfileToFirestore(userId: string, profile: Partial<UserProfile> & { userCode?: string }) {
  const database = ownedDatabase(userId);
  await withCloudTimeout(setDoc(doc(database, 'users', userId), JSON.parse(JSON.stringify({ ...profile, uid: userId, updatedAt: new Date().toISOString() })), { merge: true }));
}
export async function getUserProfileFromFirestore(userId: string) {
  const snap = await withCloudTimeout(getDoc(doc(ownedDatabase(userId), 'users', userId)));
  return snap.exists() ? snap.data() : null;
}
export async function findUserProfileInFirestore(lookup: { uid?: string; email?: string; code?: string }) {
  return lookup.uid && lookup.uid === auth?.currentUser?.uid ? getUserProfileFromFirestore(lookup.uid) : null;
}
export async function saveDocumentToFirestore(userId: string, data: Omit<StoredDocument, 'userId' | 'createdAt' | 'updatedAt'>): Promise<StoredDocument> {
  const database = ownedDatabase(userId);
  const now = new Date().toISOString();
  const document: StoredDocument = { ...data, userId, createdAt: now, updatedAt: now, syncStatus: 'synced' };
  await withCloudTimeout(setDoc(doc(database, 'users', userId, 'documents', data.id), JSON.parse(JSON.stringify(document))));
  return document;
}
export async function getDocumentsFromFirestore(userId: string): Promise<StoredDocument[]> {
  const snap = await withCloudTimeout(getDocs(collection(ownedDatabase(userId), 'users', userId, 'documents')));
  return snap.docs.map(d => d.data() as StoredDocument).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function deleteDocumentFromFirestore(userId: string, documentId: string) {
  await withCloudTimeout(deleteDoc(doc(ownedDatabase(userId), 'users', userId, 'documents', documentId)));
}
export function materialToStoredDoc(userId: string, mat: Material, userEmail?: string): StoredDocument {
  const now = new Date().toISOString();
  return { id: mat.id, userId, userEmail, title: mat.title, subject: mat.subject, fileName: mat.originalFileName, fileType: mat.fileType, rawText: mat.rawText, summary: mat.summary.simpleOverview, keyTerms: mat.summary.keyTerms, flashcards: mat.flashcards, quizQuestions: mat.quizQuestions, schoolLevel: mat.schoolLevel, grade: mat.grade, createdAt: now, updatedAt: now, syncStatus: 'local' };
}
export function storedDocToMaterial(document: StoredDocument): Material {
  return { id: document.id, title: document.title, subject: document.subject, schoolLevel: document.schoolLevel || 'SMA', grade: document.grade || 'Kelas 10', fileType: document.fileType, originalFileName: document.fileName, uploadDate: document.createdAt, pagesOrSlides: Math.max(1, Math.ceil(document.rawText.split(/\s+/).length / 250)), mainConceptsCount: 0, keyTermsCount: document.keyTerms?.length || 0, rawText: document.rawText, summary: { simpleOverview: document.summary || '', bulletPoints: [], keyTerms: document.keyTerms || [] }, flashcards: document.flashcards || [], quizQuestions: document.quizQuestions || [], conceptMap: [], aiExplanation: '', mastered: false };
}
