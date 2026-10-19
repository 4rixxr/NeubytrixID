import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  auth,
  onAuthUserChanged,
  signInWithGoogle,
  logOutFromFirebase,
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  saveDocumentToFirestore,
  getDocumentsFromFirestore,
  deleteDocumentFromFirestore,
  StoredDocument,
} from '../services/firebase';
import { extractTextFromFile } from '../utils/documentParser';
import { UserProfile } from '../types';

export function useFirebaseData(userCode: string = 'NBT-2026-0001', initialProfile?: UserProfile) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(auth.currentUser);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Derive effective user ID: Firebase UID if signed in, otherwise code-based ID
  const effectiveUserId = firebaseUser?.uid || `local_${userCode.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}`;

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthUserChanged((user) => {
      setFirebaseUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch documents from Firestore (and localStorage fallback)
  const refreshDocuments = useCallback(async () => {
    if (!effectiveUserId) return;
    try {
      // 1. Try fetching from Firestore
      const firestoreDocs = await getDocumentsFromFirestore(effectiveUserId);
      if (firestoreDocs && firestoreDocs.length > 0) {
        setDocuments(firestoreDocs);
        // Backup to localStorage
        localStorage.setItem(`neubytrix_docs_${effectiveUserId}`, JSON.stringify(firestoreDocs));
        return;
      }
    } catch (err) {
      console.warn('Could not fetch documents from Firestore:', err);
    }

    // 2. Fallback to localStorage
    const saved = localStorage.getItem(`neubytrix_docs_${effectiveUserId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setDocuments(parsed);
          return;
        }
      } catch (e) {}
    }

    // 3. Fallback to default demo documents if none exist
    const defaultDoc: StoredDocument = {
      id: 'doc-biologi-sel',
      userId: effectiveUserId,
      userEmail: firebaseUser?.email || undefined,
      title: 'Struktur & Fungsi Organel Sel Eukariotik',
      subject: 'Biologi SMA',
      fileName: 'materi-biologi-sel-lengkap.pdf',
      fileType: 'PDF',
      fileSize: 245000,
      rawText: `BAB 1: STRUKTUR DAN FUNGSI ORGANEL SEL
Sel adalah unit struktural dan fungsional terkecil dari makhluk hidup.
1. Membran Plasma: Bersifat selektif permeabel, tersusun atas fosfolipid bilayer dengan protein integral dan perifer. Mengatur keluar-masuknya zat melalui transpor aktif dan pasif.
2. Nukleus (Inti Sel): Mengandung materi genetik (DNA/kromosom) dan nukleolus tempat sintesis ribosom.
3. Mitokondria: "The powerhouse of cell", tempat berlangsungnya respirasi selular untuk menghasilkan ATP melalui glikolisis, dekarboksilasi oksidatif, siklus Krebs, dan rantai transpor elektron.
4. Retikulum Endoplasma (RE):
   - RE Kasar: Ditempeli ribosom, berperan dalam sintesis dan modifikasi protein.
   - RE Halus: Tidak beribosom, sintesis lipid, metabolisme karbohidrat, dan detoksifikasi racun.
5. Badan Golgi (Aparatus Golgi): Memodifikasi, menyortir, dan mengemas protein untuk disekresikan keluar sel atau digunakan dalam lisosom.
6. Ribosom: Tempat translasi sintesis protein, dapat bebas di sitoplasma atau menempel pada RE Kasar.
7. Lisosom: Berisi enzim hidrolitik untuk pencernaan intraselular, autofagi, dan autolisis.`,
      summary: 'Ringkasan komprehensif organel sel eukariotik, fungsi membran sel, mitokondria, dan retikulum endoplasma.',
      keyTerms: [
        { term: 'Fosfolipid Bilayer', definition: 'Lapisan ganda fosfolipid penyusun membran sel.' },
        { term: 'Mitokondria', definition: 'Organel penghasil energi ATP melalui respirasi sel.' },
        { term: 'Badan Golgi', definition: 'Organel pemroses dan penyortir molekul sekresi.' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments([defaultDoc]);
    try {
      localStorage.setItem(`neubytrix_docs_${effectiveUserId}`, JSON.stringify([defaultDoc]));
    } catch {}
  }, [effectiveUserId, firebaseUser]);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  // Sync profile when user logs in with Google
  useEffect(() => {
    if (firebaseUser && initialProfile) {
      saveUserProfileToFirestore(firebaseUser.uid, {
        name: firebaseUser.displayName || initialProfile.name,
        email: firebaseUser.email || initialProfile.email,
        schoolLevel: initialProfile.schoolLevel,
        grade: initialProfile.grade,
        userCode,
        xp: initialProfile.xp,
        level: initialProfile.level,
        streakDays: initialProfile.streakDays,
        onboardingCompleted: initialProfile.onboardingCompleted ?? true,
        targets: initialProfile.targets,
        learningStyles: initialProfile.learningStyles,
        dailyStudyTime: initialProfile.dailyStudyTime,
      });
    }
  }, [firebaseUser, initialProfile, userCode]);

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      setFirebaseUser(user);
      return user;
    } catch (err: any) {
      console.error('Google Login Error:', err);
      throw err;
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logOutFromFirebase();
      setFirebaseUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Upload and save document to Firestore Database
  const uploadAndSaveDocument = async (
    file: File,
    subject: string = 'Materi Pilihan'
  ): Promise<StoredDocument> => {
    setIsUploadingDoc(true);
    setUploadError(null);

    try {
      // 1. Extract text from the file
      const parsed = await extractTextFromFile(file);

      const docId = `doc-${Date.now()}`;
      const ext = file.name.split('.').pop()?.toUpperCase() || 'DOC';
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

      const newDocData = {
        id: docId,
        title: cleanTitle,
        subject,
        fileName: file.name,
        fileType: ext,
        fileSize: file.size,
        rawText: parsed.text,
        summary: parsed.summary,
        keyTerms: [
          { term: cleanTitle, definition: `Topik utama dari dokumen ${file.name}` },
          { term: 'Kata Kunci', definition: `Dokumen memuat ${parsed.wordCount} kata yang tersimpan di Firestore.` },
        ],
      };

      // 2. Save directly to Firestore database
      let savedDoc: StoredDocument;
      try {
        savedDoc = await saveDocumentToFirestore(effectiveUserId, newDocData);
      } catch (firestoreErr) {
        console.warn('Firestore write warning, fallback to local cache:', firestoreErr);
        savedDoc = {
          ...newDocData,
          userId: effectiveUserId,
          userEmail: firebaseUser?.email || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      // 3. Update local state & localStorage
      setDocuments((prev) => {
        const updated = [savedDoc, ...prev.filter((d) => d.id !== savedDoc.id)];
        try {
          localStorage.setItem(`neubytrix_docs_${effectiveUserId}`, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      return savedDoc;
    } catch (err: any) {
      const msg = err?.message || 'Gagal memproses dan menyimpan dokumen';
      setUploadError(msg);
      throw err;
    } finally {
      setIsUploadingDoc(false);
    }
  };

  // Delete Document
  const removeDocument = async (documentId: string) => {
    try {
      await deleteDocumentFromFirestore(effectiveUserId, documentId);
    } catch (err) {
      console.warn('Could not delete document from Firestore:', err);
    }

    setDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== documentId);
      try {
        localStorage.setItem(`neubytrix_docs_${effectiveUserId}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return {
    firebaseUser,
    isGoogleUser: Boolean(firebaseUser && !firebaseUser.isAnonymous),
    isAuthLoading,
    effectiveUserId,
    documents,
    isUploadingDoc,
    uploadError,
    refreshDocuments,
    handleGoogleLogin,
    handleLogout,
    uploadAndSaveDocument,
    removeDocument,
  };
}
