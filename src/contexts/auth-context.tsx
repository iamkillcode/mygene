
'use client';

import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (country?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const countryPreference = localStorage.getItem('mygene-country-preference');
        setFirebaseUser(currentUser);
        setUser({
          id: currentUser.uid,
          email: currentUser.email!,
          name: currentUser.displayName,
          countryPreference: countryPreference || undefined,
        });
      } else {
        setFirebaseUser(null);
        setUser(null);
        localStorage.removeItem('mygene-country-preference');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const login = (country?: string) => {
    if (country) {
      localStorage.setItem('mygene-country-preference', country);
      router.push(`/${country.toLowerCase()}/dashboard`);
    } else {
      localStorage.removeItem('mygene-country-preference');
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
