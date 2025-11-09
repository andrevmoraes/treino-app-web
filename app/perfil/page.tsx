'use client';

import { MetroButton, MetroHeader, MetroLoading, MetroTile } from '@/components/metro-ui';
import { MetroColors, ThemeColors } from '@/constants/metro-design-system';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PerfilPage() {
  const { student, signOut, isLoading: authLoading } = useAuth();
  const { accentColor, themeMode, setThemeMode, colorScheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return; // Espera carregar do localStorage
    
    if (!student) {
      router.push('/login');
      return;
    }
  }, [student, authLoading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const themeColors = ThemeColors[colorScheme];

  if (authLoading) {
    return <MetroLoading fullScreen />;
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: themeColors.background }}>
      <div className="mx-auto max-w-2xl">
        <MetroHeader
          title="perfil"
          onBack={() => router.push('/home')}
        />

        <div className="space-y-4">
          {/* Informações do Usuário */}
          <div className="rounded-sm border p-6" style={{ 
            borderColor: themeColors.border,
            backgroundColor: themeColors.surface 
          }}>
            <h2 className="mb-4 font-segoe text-xl lowercase" style={{ color: themeColors.text }}>
              📱 informações
            </h2>
            <div className="flex items-center gap-3">
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-sm text-2xl"
                style={{ backgroundColor: accentColor }}
              >
                👤
              </div>
              <p className="font-segoe text-lg" style={{ color: themeColors.text }}>
                {student?.name || 'Não informado'}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-sm text-2xl"
                style={{ backgroundColor: MetroColors.green }}
              >
                �
              </div>
              <p className="font-segoe text-lg" style={{ color: themeColors.text }}>
                {student?.phone || 'Não informado'}
              </p>
            </div>
          </div>

          {/* Tema */}
          <div className="rounded-sm border p-6" style={{ 
            borderColor: themeColors.border,
            backgroundColor: themeColors.surface 
          }}>
            <h2 className="mb-4 font-segoe text-xl lowercase" style={{ color: themeColors.text }}>
              🎨 aparência
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <MetroTile
                size="small"
                color={themeMode === 'light' ? accentColor : themeColors.surface}
                hoverable
                onClick={() => setThemeMode('light')}
              >
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <span className="text-3xl">☀️</span>
                  <span 
                    className="font-segoe text-xs uppercase"
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
                  <span className="text-3xl">🌙</span>
                  <span 
                    className="font-segoe text-xs uppercase"
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
                  <span className="text-3xl">⚙️</span>
                  <span 
                    className="font-segoe text-xs uppercase"
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
            <h2 className="mb-4 font-segoe text-xl lowercase" style={{ color: themeColors.text }}>
              🎨 cor de destaque
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
                  onClick={() => {
                    // Função para alterar cor de acento seria implementada no ThemeContext
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <span className="font-segoe text-xs uppercase text-white opacity-60">
                      {name}
                    </span>
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
            🚪 sair
          </MetroButton>
        </div>
      </div>
    </div>
  );
}
