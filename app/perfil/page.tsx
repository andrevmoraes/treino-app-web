'use client';

import { MetroButton, MetroHeader, MetroTile } from '@/components/metro-ui';
import { MetroColors, ThemeColors } from '@/constants/metro-design-system';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ConfiguracoesPage() {
  const { student, signOut } = useAuth();
  const { accentColor, themeMode, setThemeMode, setAccentColor, colorScheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!student) {
      router.replace('/login');
    }
  }, [student, router]);

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const themeColors = ThemeColors[colorScheme];

  // Aguarda verificação de autenticação
  if (!student) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: themeColors.background }}>
      <div className="mx-auto max-w-2xl">
        <MetroHeader
          title="configurações"
          onBack={() => router.push('/home')}
        />

        <div className="space-y-4">
          {/* Informações do Usuário */}
          <div className="rounded-sm border p-6" style={{ 
            borderColor: themeColors.border,
            backgroundColor: themeColors.surface 
          }}>
            <h2 className="mb-4 font-segoe text-sm uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
              informações
            </h2>
            <div className="space-y-3">
              <div>
                <p className="mb-1 font-segoe text-xs uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
                  nome
                </p>
                <p className="font-segoe text-base" style={{ color: themeColors.text }}>
                  {student?.name || 'Não informado'}
                </p>
              </div>
              <div>
                <p className="mb-1 font-segoe text-xs uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
                  telefone
                </p>
                <p className="font-segoe text-base" style={{ color: themeColors.text }}>
                  {student?.phone || 'Não informado'}
                </p>
              </div>
            </div>
          </div>

          {/* Tema */}
          <div className="rounded-sm border p-6" style={{ 
            borderColor: themeColors.border,
            backgroundColor: themeColors.surface 
          }}>
            <h2 className="mb-4 font-segoe text-sm uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
              aparência
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <MetroTile
                size="small"
                color={themeMode === 'light' ? accentColor : themeColors.surface}
                hoverable
                onClick={() => setThemeMode('light')}
              >
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <span 
                    className="font-segoe text-sm uppercase tracking-wider"
                    style={{ 
                      color: themeMode === 'light' ? '#FFFFFF' : themeColors.textSecondary 
                    }}
                  >
                    claro
                  </span>
                </div>
              </MetroTile>

              <MetroTile
                size="small"
                color={themeMode === 'dark' ? accentColor : themeColors.surface}
                hoverable
                onClick={() => setThemeMode('dark')}
              >
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <span 
                    className="font-segoe text-sm uppercase tracking-wider"
                    style={{ 
                      color: themeMode === 'dark' ? '#FFFFFF' : themeColors.textSecondary 
                    }}
                  >
                    escuro
                  </span>
                </div>
              </MetroTile>

              <MetroTile
                size="small"
                color={themeMode === 'system' ? accentColor : themeColors.surface}
                hoverable
                onClick={() => setThemeMode('system')}
              >
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <span 
                    className="font-segoe text-sm uppercase tracking-wider"
                    style={{ 
                      color: themeMode === 'system' ? '#FFFFFF' : themeColors.textSecondary 
                    }}
                  >
                    sistema
                  </span>
                </div>
              </MetroTile>
            </div>
          </div>

          {/* Cores de Acento */}
          <div className="rounded-sm border p-6" style={{ 
            borderColor: themeColors.border,
            backgroundColor: themeColors.surface 
          }}>
            <h2 className="mb-4 font-segoe text-sm uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
              cor de destaque
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { name: 'blue', color: MetroColors.blue },
                { name: 'teal', color: MetroColors.teal },
                { name: 'green', color: MetroColors.green },
                { name: 'orange', color: MetroColors.orange },
                { name: 'purple', color: MetroColors.purple },
                { name: 'pink', color: MetroColors.pink },
                { name: 'red', color: MetroColors.red },
                { name: 'lime', color: MetroColors.lime },
              ].map(({ name, color }) => (
                <MetroTile
                  key={name}
                  size="small"
                  color={color}
                  hoverable
                  onClick={() => setAccentColor(color)}
                >
                  <div className="flex items-center justify-center h-full">
                    {accentColor === color && (
                      <span className="font-segoe text-2xl text-white">✓</span>
                    )}
                  </div>
                </MetroTile>
              ))}
            </div>
          </div>

          {/* Logout */}
          <MetroButton
            onClick={handleLogout}
            variant="primary"
            accentColor={MetroColors.red}
            fullWidth
            size="lg"
          >
            sair
          </MetroButton>
        </div>
      </div>
    </div>
  );
}
