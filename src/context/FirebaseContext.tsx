import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  deleteDoc, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

export interface ScanRecord {
  id: string;
  documentName: string;
  hostApp: string;
  missingCount: number;
  scannedAt: Date;
}

export interface ChatRecord {
  id: string;
  role: 'user' | 'model';
  content: string;
  createdAt: Date;
}

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  systemFonts: string[];
  scanHistory: ScanRecord[];
  chatHistory: ChatRecord[];
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  syncInstalledFont: (fontFamily: string) => Promise<void>;
  syncScan: (documentName: string, hostApp: string, missingCount: number) => Promise<void>;
  syncChatMessage: (role: 'user' | 'model', content: string) => Promise<void>;
  clearChatHistory: () => Promise<void>;
  setSystemFonts: React.Dispatch<React.SetStateAction<string[]>>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children, initialSystemFonts }: { children: React.ReactNode, initialSystemFonts: string[] }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [systemFonts, setSystemFontsState] = useState<string[]>(initialSystemFonts);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatRecord[]>([]);

  // Wrap setSystemFontsState to log or allow direct manipulation
  const setSystemFonts = (value: React.SetStateAction<string[]>) => {
    setSystemFontsState(value);
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load data from Firestore for this user
        await loadUserData(currentUser.uid);
      } else {
        // Reset states to default or offline simulations
        setScanHistory([]);
        setChatHistory([]);
        setSystemFontsState(initialSystemFonts);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [initialSystemFonts]);

  const loadUserData = async (uid: string) => {
    try {
      // 1. Load installed fonts
      const fontsPath = `users/${uid}/installedFonts`;
      let querySnapshot;
      try {
        querySnapshot = await getDocs(collection(db, fontsPath));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, fontsPath);
        return;
      }
      
      const loadedFonts = querySnapshot.docs.map(doc => doc.data().fontFamily as string);
      if (loadedFonts.length > 0) {
        // Merge with initial system fonts
        setSystemFontsState(prev => {
          const merged = [...prev];
          loadedFonts.forEach(font => {
            if (!merged.includes(font)) {
              merged.push(font);
            }
          });
          return merged;
        });
      }

      // 2. Load scan history
      const scansPath = `users/${uid}/scans`;
      let scansSnapshot;
      try {
        scansSnapshot = await getDocs(query(collection(db, scansPath), orderBy('scannedAt', 'desc'), limit(20)));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, scansPath);
        return;
      }

      const loadedScans = scansSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          documentName: data.documentName,
          hostApp: data.hostApp,
          missingCount: data.missingCount,
          scannedAt: data.scannedAt?.toDate() || new Date(),
        };
      });
      setScanHistory(loadedScans);

      // 3. Load chat log history
      const chatsPath = `users/${uid}/chats`;
      let chatsSnapshot;
      try {
        chatsSnapshot = await getDocs(query(collection(db, chatsPath), orderBy('createdAt', 'asc')));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, chatsPath);
        return;
      }

      const loadedChats = chatsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          role: data.role as 'user' | 'model',
          content: data.content,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
      setChatHistory(loadedChats);

    } catch (e) {
      console.error("Error loading profile data from Firestore:", e);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Authentication popup failed:", e);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Failed to sign out:", e);
    }
  };

  const syncInstalledFont = async (fontFamily: string) => {
    if (!user) {
      // Offline mode: just update client state (handled in component)
      return;
    }
    const path = `users/${user.uid}/installedFonts`;
    const docId = fontFamily.replace(/[^a-zA-Z0-9_\-]/g, '_');
    try {
      await setDoc(doc(db, path, docId), {
        userId: user.uid,
        fontFamily,
        installedAt: serverTimestamp(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${path}/${docId}`);
    }
  };

  const syncScan = async (documentName: string, hostApp: string, missingCount: number) => {
    if (!user) return;
    const path = `users/${user.uid}/scans`;
    try {
      const docRef = await addDoc(collection(db, path), {
        userId: user.uid,
        documentName,
        hostApp,
        missingCount,
        scannedAt: serverTimestamp(),
      });
      // Append key locally safely to update list instantly
      setScanHistory(prev => [
        {
          id: docRef.id,
          documentName,
          hostApp,
          missingCount,
          scannedAt: new Date(),
        },
        ...prev
      ].slice(0, 20));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const syncChatMessage = async (role: 'user' | 'model', content: string) => {
    if (!user) {
      // Offline chat history handled locally in GeminiFontConsultant state
      return;
    }
    const path = `users/${user.uid}/chats`;
    try {
      const docRef = await addDoc(collection(db, path), {
        userId: user.uid,
        role,
        content,
        createdAt: serverTimestamp(),
      });
      setChatHistory(prev => [
        ...prev,
        {
          id: docRef.id,
          role,
          content,
          createdAt: new Date(),
        }
      ]);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const clearChatHistory = async () => {
    if (!user) {
      setChatHistory([]);
      return;
    }
    const path = `users/${user.uid}/chats`;
    try {
      const snapshot = await getDocs(collection(db, path));
      const promises = snapshot.docs.map(docRef => deleteDoc(doc(db, path, docRef.id)));
      await Promise.all(promises);
      setChatHistory([]);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  };

  return (
    <FirebaseContext.Provider value={{
      user,
      loading,
      systemFonts,
      scanHistory,
      chatHistory,
      loginWithGoogle,
      logout,
      syncInstalledFont,
      syncScan,
      syncChatMessage,
      clearChatHistory,
      setSystemFonts,
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
