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

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

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

  const themeColors = ThemeColors[colorScheme];

  return (
    <div 
      className="flex h-screen flex-col items-center justify-center overflow-hidden p-6" 
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="w-full max-w-md">
        {/* Header - Windows Phone Style */}
        <div className="mb-12">
          <h1 className="mb-2 font-segoe text-6xl font-extralight lowercase" style={{ color: themeColors.text }}>
            treino
          </h1>
          <div 
            className="mt-1 h-1 w-24"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block font-segoe text-xs uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
              telefone
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
              autoComplete="tel"
              fullWidth
            />
          </div>

          {error && (
            <div 
              className="border-l-4 p-4 font-segoe text-sm lowercase"
              style={{ 
                borderColor: '#e74856',
                backgroundColor: colorScheme === 'dark' ? 'rgba(231, 72, 86, 0.1)' : 'rgba(231, 72, 86, 0.05)',
                color: '#e74856'
              }}
            >
              {error}
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
            {loading ? 'entrando...' : 'entrar'}
          </MetroButton>
        </form>

        <div className="mt-8">
          <a 
            href="/admin/login"
            className="font-segoe text-xs uppercase tracking-wider opacity-40 transition-opacity hover:opacity-100"
            style={{ color: themeColors.textSecondary }}
          >
            área do professor
          </a>
        </div>
      </div>
    </div>
  );
}
