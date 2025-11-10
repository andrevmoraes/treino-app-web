'use client';

import { MetroButton, MetroInput } from '@/components/metro-ui';
import { ThemeColors } from '@/constants/metro-design-system';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInWithEmailPassword } = useAdminAuth();
  const { accentColor, colorScheme } = useTheme();
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

  const themeColors = ThemeColors[colorScheme];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6" style={{ backgroundColor: themeColors.background }}>
      <div className="w-full max-w-md">
        {/* Header - Windows Phone Style */}
        <div className="mb-12">
          <h1 className="mb-2 font-segoe text-6xl font-extralight lowercase" style={{ color: themeColors.text }}>
            professor
          </h1>
          <div 
            className="mt-1 h-1 w-24"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block font-segoe text-xs uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
              email
            </label>
            <MetroInput
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="seu.email@exemplo.com"
              disabled={isLoading}
              accentColor={accentColor}
              bgColor={themeColors.surface}
              textColor={themeColors.text}
              fullWidth
            />
          </div>

          <div>
            <label className="mb-2 block font-segoe text-xs uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
              senha
            </label>
            <MetroInput
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              disabled={isLoading}
              accentColor={accentColor}
              bgColor={themeColors.surface}
              textColor={themeColors.text}
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
            disabled={isLoading || !email || !password}
            variant="primary"
            accentColor={accentColor}
            fullWidth
            size="lg"
          >
            {isLoading ? 'entrando...' : 'entrar'}
          </MetroButton>
        </form>

        <div className="mt-8">
          <a 
            href="/login"
            className="font-segoe text-xs uppercase tracking-wider opacity-40 transition-opacity hover:opacity-100"
            style={{ color: themeColors.textSecondary }}
          >
            área do aluno
          </a>
        </div>
      </div>
    </div>
  );
}
