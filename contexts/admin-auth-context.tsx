'use client';

import { getProfessorByEmail } from '@/lib/database';
import type { Professor } from '@/types/database';
import { createContext, ReactNode, useContext, useState } from 'react';

interface AdminAuthContextType {
  professor: Professor | null;
  signInWithEmailPassword: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// ⚡ OTIMIZAÇÃO: Carrega professor INSTANTANEAMENTE do localStorage
const getInitialProfessor = (): Professor | null => {
  if (typeof window === 'undefined') return null;
  
  const savedProfessor = localStorage.getItem('professor');
  if (!savedProfessor) return null;
  
  try {
    return JSON.parse(savedProfessor);
  } catch {
    return null;
  }
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [professor, setProfessor] = useState<Professor | null>(getInitialProfessor());

  const signInWithEmailPassword = async (email: string, password: string) => {
    try {
      // Busca professor no banco
      const { data: professorData, error: fetchError } = await getProfessorByEmail(email);

      if (fetchError) {
        return { error: fetchError };
      }

      if (!professorData) {
        return { error: new Error('Professor não encontrado') };
      }

      // Verifica senha usando bcrypt (via API route para segurança)
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          hash: professorData.password_hash,
        }),
      });

      const { isValid } = await response.json();

      if (!isValid) {
        return { error: new Error('Senha incorreta') };
      }

      // Remove password_hash antes de salvar no estado
      const { password_hash, ...professorWithoutPassword } = professorData;

      setProfessor(professorWithoutPassword as Professor);
      localStorage.setItem('professor', JSON.stringify(professorWithoutPassword));

      return { error: null };
    } catch (error) {
      console.error('Erro no login do professor:', error);
      return { error };
    }
  };

  const signOut = async () => {
    setProfessor(null);
    localStorage.removeItem('professor');
  };

  return (
    <AdminAuthContext.Provider value={{ professor, signInWithEmailPassword, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
