'use client';

import type { Student } from '@/types/database';
import { Session, User } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  student: Student | null;
  session: Session | null;
  isLoading: boolean;
  signInWithPhone: (phone: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há estudante salvo no localStorage
    const savedStudent = localStorage.getItem('student');
    if (savedStudent) {
      const studentData = JSON.parse(savedStudent);
      setStudent(studentData);
      // Criar User compatível com o formato antigo
      setUser({
        id: studentData.id,
        user_metadata: { phone: studentData.phone },
        app_metadata: {},
        aud: 'authenticated',
        created_at: studentData.created_at,
      } as User);
    }
    setIsLoading(false);
  }, []);

  const signInWithPhone = async (phone: string) => {
    try {
      // Buscar aluno via API (bypass RLS)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        return { error: new Error(result.error || 'Erro ao fazer login') };
      }

      const studentData = result.data;

      // Verifica se está ativo
      if (!studentData.active) {
        return { error: new Error('Sua conta está desativada. Entre em contato com seu professor.') };
      }

      // Salva no estado
      setStudent(studentData);
      setUser({
        id: studentData.id,
        user_metadata: { phone: studentData.phone, name: studentData.name },
        app_metadata: {},
        aud: 'authenticated',
        created_at: studentData.created_at,
      } as User);

      localStorage.setItem('student', JSON.stringify(studentData));
      return { error: null };
    } catch (error) {
      console.error('Erro no login:', error);
      return { error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setStudent(null);
    setSession(null);
    localStorage.removeItem('student');
    localStorage.removeItem('user'); // Backward compatibility
  };

  return (
    <AuthContext.Provider value={{ user, student, session, isLoading, signInWithPhone, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
