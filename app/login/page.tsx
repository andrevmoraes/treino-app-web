'use client';

import { MetroButton, MetroInput } from '@/components/metro-ui';
import { ThemeColors } from '@/constants/metro-design-system';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signInWithPhone } = useAuth();
  const { accentColor, colorScheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    setError('');

    const { error: signInError } = await signInWithPhone(phone);

    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Erro ao fazer login');
      return;
    }

    router.push('/home');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const themeColors = ThemeColors[colorScheme];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6" style={{ backgroundColor: themeColors.background }}>
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <div 
            className="mx-auto mb-4 h-20 w-20 rounded-sm"
            style={{ backgroundColor: accentColor }}
          />
          <h1 className="mb-2 font-segoe text-5xl font-light lowercase" style={{ color: themeColors.text }}>
            treino
          </h1>
          <h2 className="font-segoe text-xl lowercase" style={{ color: themeColors.textSecondary }}>
            app de treinos
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block font-segoe text-sm uppercase tracking-wide" style={{ color: themeColors.textSecondary }}>
              📱 TELEFONE
            </label>
            <MetroInput
              type="tel"
              value={phone}
              onChange={(value) => setPhone(formatPhone(value))}
              placeholder="(11) 99999-9999"
              disabled={loading}
              accentColor={accentColor}
              bgColor={themeColors.surface}
              textColor={themeColors.text}
              fullWidth
            />
          </div>

          {error && (
            <div className="rounded-sm border-2 border-red-500 bg-red-50 p-3 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          <MetroButton
            type="submit"
            disabled={loading || !phone}
            variant="primary"
            accentColor={accentColor}
            fullWidth
            size="lg"
          >
            {loading ? '⏳ entrando...' : '→ entrar'}
          </MetroButton>
        </form>

        <p className="mt-8 text-center font-segoe text-sm" style={{ color: themeColors.textSecondary }}>
          💡 Aluno não cadastrado? Entre em contato com seu professor
        </p>
      </div>
    </div>
  );
}
