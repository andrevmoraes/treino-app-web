'use client';

import { MetroButton, MetroInput } from '@/components/metro-ui';
import { MetroColors } from '@/constants/metro-design-system';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInWithEmailPassword } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: signInError } = await signInWithEmailPassword(email, password);

    if (signInError) {
      setError(signInError.message || 'Erro ao fazer login');
      setIsLoading(false);
      return;
    }

    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ 
      background: `linear-gradient(135deg, ${MetroColors.blue} 0%, ${MetroColors.purple} 50%, ${MetroColors.pink} 100%)` 
    }}>
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-sm shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="w-20 h-20 rounded-sm mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: MetroColors.blue }}
            >
              <span className="text-4xl">👨‍🏫</span>
            </div>
            <h1 className="font-segoe text-3xl font-light lowercase text-gray-900">
              área do professor
            </h1>
            <p className="font-segoe text-sm text-gray-600 mt-2">
              gerencie seus alunos e treinos
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block font-segoe text-sm uppercase tracking-wide text-gray-700 mb-2">
                📧 EMAIL
              </label>
              <MetroInput
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="seu.email@exemplo.com"
                disabled={isLoading}
                accentColor={MetroColors.blue}
                bgColor="#F5F5F5"
                textColor="#1A1A1A"
                fullWidth
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block font-segoe text-sm uppercase tracking-wide text-gray-700 mb-2">
                🔒 SENHA
              </label>
              <MetroInput
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                disabled={isLoading}
                accentColor={MetroColors.blue}
                bgColor="#F5F5F5"
                textColor="#1A1A1A"
                fullWidth
              />
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-sm font-segoe text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Botão de Login */}
            <MetroButton
              type="submit"
              disabled={isLoading}
              variant="primary"
              accentColor={MetroColors.blue}
              fullWidth
              size="lg"
            >
              {isLoading ? '🔄 entrando...' : '🚀 entrar'}
            </MetroButton>
          </form>

          {/* Link para Login de Aluno */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="font-segoe text-sm text-gray-600">
              É aluno?{' '}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: MetroColors.blue }}>
                Entre aqui
              </Link>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-white font-segoe text-sm">
          <p className="opacity-90">🔒 Acesso restrito a professores</p>
        </div>
      </div>
    </div>
  );
}
