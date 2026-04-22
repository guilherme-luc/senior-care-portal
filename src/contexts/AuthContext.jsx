import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Timeout helper para evitar que o Firebase trave a tela se o Firestore não estiver ativado
const withTimeout = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('firebase_timeout')), ms))
  ]);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const demoUser = localStorage.getItem('demo_user');
    return demoUser ? JSON.parse(demoUser) : null;
  });
  const [userProfile, setUserProfile] = useState(() => {
    const demoProfile = localStorage.getItem('demo_profile');
    return demoProfile ? JSON.parse(demoProfile) : null;
  });
  const [loading, setLoading] = useState(true);

  // Utilizamos um modo demonstração caso as chaves do Firebase não tenham sido trocadas.
  const [isDemoMode, setIsDemoMode] = useState(() => !!localStorage.getItem('demo_user'));

  function login(email, password) {
    if (auth.app.options.apiKey.includes('DummyKey')) {
      const user = { email, uid: 'demo-user-123', displayName: 'Usuário Demo' };
      const profile = { role: 'admin', familyId: 'FAM-DUMMY-123', name: 'Usuário Demo' };
      
      setIsDemoMode(true);
      setCurrentUser(user);
      setUserProfile(profile);
      
      localStorage.setItem('demo_user', JSON.stringify(user));
      localStorage.setItem('demo_profile', JSON.stringify(profile));
      return Promise.resolve();
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signup(email, password, name, role, familyId) {
    const generatedFamilyId = role === 'admin' 
      ? `FAM-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}` 
      : familyId;
      
    if (auth.app.options.apiKey.includes('DummyKey')) {
      setIsDemoMode(true);
      const profile = { name, email, role, familyId: generatedFamilyId };
      const user = { email, uid: 'demo-user-123', displayName: name };
      
      setCurrentUser(user);
      setUserProfile(profile);
      
      localStorage.setItem('demo_user', JSON.stringify(user));
      localStorage.setItem('demo_profile', JSON.stringify(profile));
      return Promise.resolve();
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    const profile = { name, email, role, familyId: generatedFamilyId };
    
    try {
      await withTimeout(setDoc(doc(db, 'users', userCredential.user.uid), profile), 8000);
    } catch (err) {
      console.warn('Aviso: Firestore não respondeu a tempo. O banco de dados pode não estar criado no console do Firebase.', err);
      // Se falhar no Firestore, prosseguimos localmente para não travar a UI
    }
    
    setCurrentUser({ ...userCredential.user, displayName: name });
    setUserProfile(profile);
    return userCredential;
  }

  function logout() {
    setUserProfile(null);
    if (isDemoMode) {
      setCurrentUser(null);
      setIsDemoMode(false);
      localStorage.removeItem('demo_user');
      localStorage.removeItem('demo_profile');
      return Promise.resolve();
    }
    return signOut(auth);
  }

  useEffect(() => {
    if (auth.app.options.apiKey.includes('DummyKey')) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await withTimeout(getDoc(docRef), 5000);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            setUserProfile({ role: 'admin', familyId: 'FAM-PENDING', name: user.displayName || 'Usuário' });
          }
        } catch (error) {
          console.error("Erro ao buscar perfil do usuário (Firestore timeout ou erro de regras):", error);
          // Em caso de falha de conexão com Firestore, usar perfil fallback
          setUserProfile({ role: 'admin', familyId: 'FAM-ERROR', name: user.displayName || 'Usuário' });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
