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

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Utilizamos um modo demonstração caso as chaves do Firebase não tenham sido trocadas.
  // Assim a interface pode ser testada sem quebrar.
  const [isDemoMode, setIsDemoMode] = useState(false);

  function login(email, password) {
    if (auth.app.options.apiKey.includes('DummyKey')) {
      setIsDemoMode(true);
      setCurrentUser({ email, uid: 'demo-user-123' });
      // Mantendo o admin para o mock funcionar completo
      setUserProfile({ role: 'admin', familyId: 'FAM-DUMMY-123', name: 'Usuário Demo' });
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
      setCurrentUser({ email, uid: 'demo-user-123', displayName: name });
      setUserProfile(profile);
      return Promise.resolve();
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    const profile = { name, email, role, familyId: generatedFamilyId };
    await setDoc(doc(db, 'users', userCredential.user.uid), profile);
    
    setCurrentUser({ ...userCredential.user, displayName: name });
    setUserProfile(profile);
    return userCredential;
  }

  function logout() {
    setUserProfile(null);
    if (isDemoMode) {
      setCurrentUser(null);
      setIsDemoMode(false);
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
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          }
        } catch (error) {
          console.error("Erro ao buscar perfil do usuário", error);
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
