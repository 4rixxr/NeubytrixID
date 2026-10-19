import { useState, useEffect, useCallback, useRef } from 'react';
import { User } from 'firebase/auth';
import { auth, onAuthUserChanged, saveDocumentToFirestore, getDocumentsFromFirestore, deleteDocumentFromFirestore, StoredDocument } from '../services/firebase';
import { extractTextFromFile } from '../utils/documentParser';
import { readJson, writeJson } from '../utils/storage';
import { UserProfile } from '../types';
export function useFirebaseData(userCode: string, _initialProfile?: UserProfile) {
  const [authUser, setAuthUser] = useState<User | null>(auth?.currentUser || null);
  const firebaseUser = authUser && userCode === `NBT-G-${authUser.uid}` ? authUser : null;
  const effectiveUserId = firebaseUser?.uid || `local_${userCode}`;
  const key = `neubytrix_docs_${effectiveUserId}`;
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const mounted = useRef(true);
  const generation = useRef(0);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => onAuthUserChanged(setAuthUser), []);
  const refreshDocuments = useCallback(async () => {
    const ticket = ++generation.current;
    const raw = readJson<StoredDocument[]>(key, []);
    const local = Array.isArray(raw) ? raw : [];
    setDocuments(local);
    if (!firebaseUser) return;
    try {
      const remote = await getDocumentsFromFirestore(firebaseUser.uid);
      if (!mounted.current || ticket !== generation.current) return;
      const fresh = readJson<StoredDocument[]>(key, local);
      const unsynced = fresh.filter(d => d.syncStatus !== 'synced' && !remote.some(r => r.id === d.id));
      const merged = [...unsynced, ...remote]; writeJson(key, merged); setDocuments(merged);
    } catch { /* Keep local data; no fake cloud-connected status. */ }
  }, [key, firebaseUser?.uid]);
  useEffect(() => { void refreshDocuments(); return () => { generation.current++; }; }, [refreshDocuments]);
  const uploadAndSaveDocument = async (file: File, subject = 'Dokumen Chat'): Promise<StoredDocument> => {
    setIsUploadingDoc(true); setUploadError(null);
    try {
      const parsed = await extractTextFromFile(file), now = new Date().toISOString();
      let document: StoredDocument = { id: crypto.randomUUID(), userId: effectiveUserId, title: file.name.replace(/\.[^.]+$/, ''), subject, fileName: file.name, fileType: file.name.split('.').pop()?.toUpperCase() || 'TXT', fileSize: file.size, rawText: parsed.text, summary: parsed.summary, createdAt: now, updatedAt: now, syncStatus: 'local' };
      if (firebaseUser) { try { document = await saveDocumentToFirestore(firebaseUser.uid, document); } catch { /* Honest local-only status is kept. */ } }
      const existing = readJson<StoredDocument[]>(key, []);
      const next = [document, ...(Array.isArray(existing) ? existing : []).filter(d => d.id !== document.id)];
      writeJson(key, next); if (mounted.current) setDocuments(next);
      return document;
    } catch (e) { if (mounted.current) setUploadError(e instanceof Error ? e.message : 'Dokumen gagal diproses.'); throw e; }
    finally { if (mounted.current) setIsUploadingDoc(false); }
  };
  const removeDocument = async (id: string) => {
    const document = documents.find(d => d.id === id);
    if (document?.syncStatus === 'synced' && firebaseUser) await deleteDocumentFromFirestore(firebaseUser.uid, id);
    const updated = readJson<StoredDocument[]>(key, []).filter(d => d.id !== id); writeJson(key, updated); setDocuments(updated);
  };
  return { firebaseUser, isGoogleUser: !!firebaseUser, effectiveUserId, documents, isUploadingDoc, uploadError, refreshDocuments, uploadAndSaveDocument, removeDocument };
}
