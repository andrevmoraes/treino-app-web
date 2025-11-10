'use client';

import type { Student } from '@/types/database';
import { Session, User } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  student: Student | null;
  session: Session | null;
  signInWithPhone: (phone: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateStudent: (updatedData: Partial<Student>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ⚡ OTIMIZAÇÃO: Carrega localStorage INSTANTANEAMENTE (síncrono)
const getInitialAuth = (): { user: User | null; student: Student | null } => {
  if (typeof window === 'undefined') return { user: null, student: null };
  
  const savedStudent = localStorage.getItem('student');
  if (!savedStudent) return { user: null, student: null };
  
  try {
    const studentData = JSON.parse(savedStudent);
    const user: User = {
      id: studentData.id,
      user_metadata: { phone: studentData.phone },
      app_metadata: {},
      aud: 'authenticated',
      created_at: studentData.created_at,
    } as User;
    
    return { user, student: studentData };
  } catch {
    return { user: null, student: null };
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialAuth = getInitialAuth();
  const [user, setUser] = useState<User | null>(initialAuth.user);
  const [student, setStudent] = useState<Student | null>(initialAuth.student);
  const [session, setSession] = useState<Session | null>(null);

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

  const updateStudent = (updatedData: Partial<Student>) => {
    if (!student) return;
    
    const updatedStudent = { ...student, ...updatedData };
    setStudent(updatedStudent);
    
    // Atualiza user também se necessário
    if (updatedData.name || updatedData.phone) {
      setUser({
        ...user,
        user_metadata: { 
          ...(user?.user_metadata || {}), 
          name: updatedData.name || student.name,
          phone: updatedData.phone || student.phone 
        },
      } as User);
    }
    
    localStorage.setItem('student', JSON.stringify(updatedStudent));
  };

  return (
    <AuthContext.Provider value={{ user, student, session, signInWithPhone, signOut, updateStudent }}>
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
