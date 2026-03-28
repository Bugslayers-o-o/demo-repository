import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'user' | 'doctor' | 'therapist' | 'psychiatrist';

export interface AuthUser extends User {
  role?: UserRole;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  userRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const ROLE_KEY = 'ms_role';

  const safeGetRole = async (uid: string): Promise<UserRole> => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      return (userDoc.data()?.role || 'user') as UserRole;
    } catch (err) {
      console.warn('Role fetch failed, defaulting to user:', err);
      return 'user';
    }
  };

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            const cachedRole = (localStorage.getItem(ROLE_KEY) as UserRole | null) || 'user';
            // Set immediately from cache to avoid perceived delay
            setCurrentUser({ ...user, role: cachedRole });
            setUserRole(cachedRole);
            setLoading(false);

            // Verify in background
            const freshRole = await safeGetRole(user.uid);
            if (freshRole !== cachedRole) {
              localStorage.setItem(ROLE_KEY, freshRole);
              setCurrentUser({ ...user, role: freshRole });
              setUserRole(freshRole);
            }
          } else {
            setCurrentUser(null);
            setUserRole(null);
            localStorage.removeItem(ROLE_KEY);
            setLoading(false);
          }
        } catch (err) {
          console.error('Auth state error:', err);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Auth init error:', err);
      setLoading(false);
    }

    return () => unsubscribe && unsubscribe();
  }, []);

  const signup = async (email: string, password: string, role: UserRole) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store role in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        role: role,
        createdAt: new Date(),
      });

      setCurrentUser({ ...user, role });
      setUserRole(role);
      localStorage.setItem(ROLE_KEY, role);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch role from Firestore (fallback to user when offline)
      const role = await safeGetRole(user.uid);

      setCurrentUser({ ...user, role });
      setUserRole(role);
      localStorage.setItem(ROLE_KEY, role);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      localStorage.removeItem(ROLE_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    userRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
          Warming up your space...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
