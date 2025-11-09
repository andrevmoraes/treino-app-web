'use client';

/**
 * 🏠 HOME DO ALUNO - METRO UI
 * Dashboard de treinos com design Windows Phone
 */

import { MetroHeader, MetroLoading, MetroTile } from '@/components/metro-ui';
import { ThemeColors } from '@/constants/metro-design-system';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import type { Workout } from '@/types/database';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { student, signOut, isLoading: authLoading } = useAuth();
  const { colorScheme, accentColor } = useTheme();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const colors = ThemeColors[colorScheme];

  useEffect(() => {
    if (authLoading) return;
    
    if (!student) {
      router.push('/login');
      return;
    }
    loadWorkouts();
  }, [student, authLoading, router]);

  const loadWorkouts = async () => {
    try {
      const response = await fetch(`/api/workouts/list?student_id=${student?.id}`);
      const result = await response.json();

      if (response.ok && result.data) {
        setWorkouts(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (isLoading || authLoading) {
    return (
      <MetroLoading
        fullScreen
        color={accentColor}
        text="carregando treinos..."
      />
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: colors.background }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header Metro */}
        <MetroHeader
          title="treinos"
          subtitle={student?.name}
          textColor={colors.text}
          accentColor={accentColor}
          action={
            <button
              onClick={handleLogout}
              className="font-segoe text-sm uppercase tracking-wide transition-opacity hover:opacity-80"
              style={{ color: accentColor }}
            >
              sair
            </button>
          }
        />

        {/* Grid de Treinos (Tiles Metro) */}
        {workouts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {workouts.map((workout, index) => (
              <Link key={workout.id} href={`/treino/${workout.id}`}>
                <MetroTile color={workout.color} size="medium" hoverable>
                  {/* Conteúdo do Tile */}
                  <div>
                    <h2 className="font-segoe text-xl font-semibold lowercase text-white">
                      {workout.name}
                    </h2>
                    <p className="mt-1 font-segoe text-xs text-white opacity-90 line-clamp-2">
                      {workout.description}
                    </p>
                  </div>

                  {/* Letra decorativa (A, B, C, D) */}
                  <div className="text-right font-segoe text-6xl font-light text-white opacity-20">
                    {String.fromCharCode(65 + index)}
                  </div>
                </MetroTile>
              </Link>
            ))}

            {/* Tile de Perfil */}
            <Link href="/perfil">
              <MetroTile color={colors.surfaceElevated} size="medium" hoverable>
                <div>
                  <h2
                    className="font-segoe text-xl font-semibold lowercase"
                    style={{ color: accentColor }}
                  >
                    perfil
                  </h2>
                  <p
                    className="mt-1 font-segoe text-xs opacity-60"
                    style={{ color: colors.textSecondary }}
                  >
                    configurações e temas
                  </p>
                </div>

                <div
                  className="text-right font-segoe text-6xl font-light opacity-10"
                  style={{ color: accentColor }}
                >
                  ⚙
                </div>
              </MetroTile>
            </Link>
          </div>
        ) : (
          // Empty State Metro
          <div
            className="mt-16 border-2 border-dashed p-12 text-center"
            style={{ borderColor: colors.border }}
          >
            <div
              className="mb-4 text-6xl font-light opacity-20"
              style={{ color: colors.textTertiary }}
            >
              📋
            </div>
            <h3
              className="mb-2 font-segoe text-xl font-light lowercase"
              style={{ color: colors.text }}
            >
              nenhum treino disponível
            </h3>
            <p
              className="font-segoe text-sm"
              style={{ color: colors.textSecondary }}
            >
              Entre em contato com seu professor para criar seus treinos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
