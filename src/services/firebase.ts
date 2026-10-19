import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, Material } from '../types';

// Initialize Firebase App singleton
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firestore with custom database ID from config
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connectivity check as required by Firebase skill
export async function verifyFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('Firestore offline notice:', error.message);
      return false;
    }
    // Expected PERMISSION_DENIED or not found is normal for test doc and proves network reachability
    return true;
  }
}

// Google Sign In
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// Sign Out
export async function logOutFromFirebase(): Promise<void> {
  await signOut(auth);
}

// Auth State Listener
export function onAuthUserChanged(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// User Document Interface for Firestore persistence
export interface StoredDocument {
  id: string;
  userId: string;
  userEmail?: string;
  title: string;
  subject: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  rawText: string;
  summary?: string;
  keyTerms?: Array<{ term: string; definition: string }>;
  flashcards?: any[];
  quizQuestions?: any[];
  createdAt: string;
  updatedAt: string;
}

// Helper to clean key for Firestore document ID
export function cleanDocId(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 100);
}

// Firestore Operations: Save User Profile
export async function saveUserProfileToFirestore(
  userId: string,
  profile: Partial<UserProfile> & { email?: string; userCode?: string; onboardingCompleted?: boolean }
): Promise<void> {
  if (!userId) return;
  try {
    const payload: Record<string, any> = {
      uid: userId,
      fullName: profile.name || '',
      name: profile.name || '',
      email: profile.email || '',
      schoolLevel: profile.schoolLevel || 'SMA',
      grade: profile.grade || 'Kelas 11',
      userCode: profile.userCode || '',
      xp: profile.xp ?? 0,
      level: profile.level ?? 1,
      levelTitle: profile.levelTitle || 'Pemula (Siswa Baru)',
      streakDays: profile.streakDays ?? 0,
      onboardingCompleted: profile.onboardingCompleted ?? true,
      targets: profile.targets || [],
      learningStyles: profile.learningStyles || [],
      dailyStudyTime: profile.dailyStudyTime || '30 menit',
      totalStudyMinutes: profile.totalStudyMinutes ?? 0,
      quizzesCompleted: profile.quizzesCompleted ?? 0,
      materialsLearned: profile.materialsLearned ?? 0,
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to primary user doc
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, payload, { merge: true });

    // 2. Also save to email index if email provided (enables cross-session login by email)
    if (profile.email) {
      const emailDocId = `email_${cleanDocId(profile.email)}`;
      const emailRef = doc(db, 'users', emailDocId);
      await setDoc(emailRef, payload, { merge: true });
    }

    // 3. Also save to code index if code provided (enables login by user code)
    if (profile.userCode) {
      const codeDocId = `code_${cleanDocId(profile.userCode)}`;
      const codeRef = doc(db, 'users', codeDocId);
      await setDoc(codeRef, payload, { merge: true });
    }
  } catch (err) {
    console.warn('Failed to save user profile to Firestore:', err);
  }
}

// Firestore Operations: Get User Profile
export async function getUserProfileFromFirestore(userId: string): Promise<any | null> {
  if (!userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('Failed to fetch user profile from Firestore:', err);
    return null;
  }
}

// Firestore Operations: Find User Profile by any identifier (UID, Email, or Code)
export async function findUserProfileInFirestore(lookup: {
  uid?: string;
  email?: string;
  code?: string;
}): Promise<any | null> {
  // 1. Check by UID
  if (lookup.uid) {
    const byUid = await getUserProfileFromFirestore(lookup.uid);
    if (byUid) return byUid;
  }

  // 2. Check by Email
  if (lookup.email) {
    const emailDocId = `email_${cleanDocId(lookup.email)}`;
    const byEmail = await getUserProfileFromFirestore(emailDocId);
    if (byEmail) return byEmail;
  }

  // 3. Check by Code
  if (lookup.code) {
    const codeDocId = `code_${cleanDocId(lookup.code)}`;
    const byCode = await getUserProfileFromFirestore(codeDocId);
    if (byCode) return byCode;
  }

  return null;
}

// Firestore Operations: Save Uploaded Study Document
export async function saveDocumentToFirestore(
  userId: string,
  docData: Omit<StoredDocument, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<StoredDocument> {
  if (!userId) throw new Error('User ID is required to save document to database');

  const now = new Date().toISOString();
  const documentToSave: StoredDocument = {
    ...docData,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = doc(db, 'users', userId, 'documents', docData.id);
  await setDoc(docRef, documentToSave);
  return documentToSave;
}

// Firestore Operations: Get All Uploaded Documents for User
export async function getDocumentsFromFirestore(userId: string): Promise<StoredDocument[]> {
  if (!userId) return [];
  try {
    const docsColl = collection(db, 'users', userId, 'documents');
    const snap = await getDocs(docsColl);
    const docs: StoredDocument[] = [];
    snap.forEach((d) => {
      docs.push(d.data() as StoredDocument);
    });
    // Sort newest first
    return docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('Failed to fetch documents from Firestore:', err);
    return [];
  }
}

// Firestore Operations: Delete Document
export async function deleteDocumentFromFirestore(userId: string, documentId: string): Promise<void> {
  if (!userId || !documentId) return;
  try {
    const docRef = doc(db, 'users', userId, 'documents', documentId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete document from Firestore:', err);
  }
}

// Convert Material to StoredDocument helper
export function materialToStoredDoc(userId: string, mat: Material, userEmail?: string): StoredDocument {
  const now = new Date().toISOString();
  return {
    id: mat.id,
    userId,
    userEmail,
    title: mat.title,
    subject: mat.subject,
    fileName: mat.originalFileName || `${mat.title}.${mat.fileType.toLowerCase()}`,
    fileType: mat.fileType,
    rawText: mat.rawText || (mat.summary?.bulletPoints?.join('\n') ?? '') || mat.title,
    summary: mat.summary?.simpleOverview || '',
    keyTerms: mat.summary?.keyTerms || [],
    flashcards: mat.flashcards || [],
    quizQuestions: mat.quizQuestions || [],
    createdAt: now,
    updatedAt: now,
  };
}

// Convert StoredDocument to Material helper
export function storedDocToMaterial(doc: StoredDocument): Material {
  return {
    id: doc.id,
    title: doc.title,
    subject: doc.subject || 'Materi Umum',
    schoolLevel: 'SMA',
    grade: 'Kelas 11',
    fileType: doc.fileType || 'DOC',
    originalFileName: doc.fileName,
    uploadDate: new Date(doc.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    pagesOrSlides: 12,
    mainConceptsCount: doc.keyTerms?.length || 4,
    keyTermsCount: doc.keyTerms?.length || 6,
    rawText: doc.rawText,
    summary: {
      simpleOverview: doc.summary || 'Dokumen yang disimpan dalam Firestore Database.',
      bulletPoints: doc.rawText
        ? doc.rawText.split('\n').filter((l) => l.trim().length > 10).slice(0, 5)
        : ['Dokumen tersimpan di database Cloud Firestore.'],
      keyTerms: doc.keyTerms || [{ term: doc.title, definition: 'Materi tersimpan dari database.' }],
    },
    flashcards: doc.flashcards || [],
    quizQuestions: doc.quizQuestions || [],
    conceptMap: [],
    aiExplanation: 'Dokumen berhasil diambil dari Firestore Database.',
    mastered: false,
  };
}
