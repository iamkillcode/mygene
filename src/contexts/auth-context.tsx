'use client';

import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (userData: User, country?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('mygene-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('mygene-user');
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, country?: string) => {
    localStorage.setItem('mygene-user', JSON.stringify(userData));
    setUser(userData);
    if (country) {
      // Example: redirect to /gh/dashboard based on country
      // This logic can be expanded.
      router.push(`/${country.toLowerCase()}/dashboard`);
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('mygene-user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
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
