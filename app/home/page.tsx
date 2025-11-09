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
  const { student, signOut } = useAuth();
  const { colorScheme, accentColor } = useTheme();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const colors = ThemeColors[colorScheme];

  // ⚡ Live Tile Flip Animation (estilo Windows Phone)
  useEffect(() => {
    const flipInterval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 5000); // Flip a cada 5 segundos

    return () => clearInterval(flipInterval);
  }, []);

  useEffect(() => {
    if (!student) {
      router.push('/login');
      return;
    }
    loadWorkouts();
  }, [student, router]);

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

  if (isLoading) {
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
            {/* Live Tile de Boas-Vindas com Flip (estilo Windows Phone) */}
            <div className="col-span-2" style={{ perspective: '1000px' }}>
              <div
                className="relative transition-transform duration-700 ease-in-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
                }}
              >
                {/* Frente: "Olá, [Nome]" */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <MetroTile color={accentColor} size="wide">
                    <div>
                      <h1 className="font-segoe text-3xl font-light lowercase text-white md:text-4xl">
                        olá, {student?.name.split(' ')[0]}
                      </h1>
                      <p className="mt-2 font-segoe text-sm text-white opacity-80">
                        pronto para treinar hoje?
                      </p>
                    </div>
                    <div className="text-right font-segoe text-7xl font-light text-white opacity-20 md:text-8xl">
                      👋
                    </div>
                  </MetroTile>
                </div>

                {/* Verso: "O que vamos treinar hoje?" */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateX(180deg)',
                  }}
                >
                  <MetroTile color={accentColor} size="wide">
                    <div>
                      <h2 className="font-segoe text-2xl font-light lowercase text-white md:text-3xl">
                        o que vamos treinar hoje?
                      </h2>
                      <p className="mt-2 font-segoe text-sm text-white opacity-80">
                        {workouts.length} treino{workouts.length > 1 ? 's' : ''} disponíve{workouts.length > 1 ? 'is' : 'l'}
                      </p>
                    </div>
                    <div className="text-right font-segoe text-7xl font-light text-white opacity-20 md:text-8xl">
                      💪
                    </div>
                  </MetroTile>
                </div>
              </div>
            </div>

            {/* Tiles de Treino */}
            {workouts.map((workout, index) => (
              <Link key={workout.id} href={`/treino/${workout.id}`}>
                <MetroTile color={accentColor} size="medium" hoverable>
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
              <MetroTile color={accentColor} size="medium" hoverable>
                <div>
                  <h2
                    className="font-segoe text-xl font-semibold lowercase text-white"
                  >
                    perfil
                  </h2>
                  <p
                    className="mt-1 font-segoe text-xs opacity-60 text-white"
                  >
                    configurações e temas
                  </p>
                </div>

                <div
                  className="text-right font-segoe text-6xl font-light opacity-10 text-white"
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
