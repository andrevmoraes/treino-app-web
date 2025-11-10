'use client';

/**
 * 🏠 HOME DO ALUNO - METRO UI
 * Dashboard de treinos com design Windows Phone
 */

import { MetroTile } from '@/components/metro-ui';
import { ThemeColors } from '@/constants/metro-design-system';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import type { Workout } from '@/types/database';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { student } = useAuth();
  const { colorScheme, accentColor } = useTheme();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState(0); // Rotação contínua ao invés de flip boolean
  const [showConfigTitle, setShowConfigTitle] = useState(false); // Controla slide do título
  const [mounted, setMounted] = useState(false); // Controla hidratação
  const [configCycle, setConfigCycle] = useState(0); // Contador para ciclo da tile

  const colors = ThemeColors[colorScheme];

  // ⚡ Marca como montado após hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  // ⚡ Live Tile Flip Animation (estilo Windows Phone - sempre de cima pra baixo)
  useEffect(() => {
    const flipInterval = setInterval(() => {
      setRotation((prev) => prev + 180); // Sempre adiciona 180° (sempre mesma direção)
    }, 8000); // Flip a cada 8 segundos (estilo Windows Phone)

    return () => clearInterval(flipInterval);
  }, []);

  // ⚡ Config Tile Slide Animation (timing independente - mais tempo com texto)
  useEffect(() => {
    // Incrementa o contador a cada 1 segundo
    const interval = setInterval(() => {
      setConfigCycle((prev) => (prev + 1) % 9); // Ciclo de 9 segundos
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Controla quando mostrar o título baseado no ciclo
  useEffect(() => {
    // Foto no topo (texto visível) entre 0s e 6s (6 segundos)
    // Foto cobrindo (texto escondido) entre 6s e 9s (3 segundos)
    setShowConfigTitle(configCycle < 6);
  }, [configCycle]);

  useEffect(() => {
    if (!student) {
      router.replace('/login');
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

  // Durante SSR e antes da hidratação, sempre mostra skeleton
  // Depois da hidratação, verifica student e isLoading
  const showSkeleton = !mounted || !student || isLoading;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Container com safe area para notch e alcançabilidade 
          pt-safe: padding-top para iOS notch/Dynamic Island
          pb-safe: padding-bottom para gesture bar iOS
          px: espaçamento lateral confortável
      */}
      <div className="mx-auto max-w-7xl px-3 pt-safe pb-safe sm:px-4 md:px-6">
        {/* Performance Bar (estilo Windows Phone) - Loading indicator discreto */}
        {showSkeleton && (
          <div className="mb-4 h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <div 
              className="h-full animate-pulse bg-gradient-to-r from-transparent via-current to-transparent"
              style={{ color: accentColor, width: '30%' }}
            />
          </div>
        )}

        {/* Grid de Tiles (Windows Phone Layout Responsivo) */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6">
          {showSkeleton ? (
            // SKELETON LOADING (Windows Phone style)
            <>
              {/* Live Tile Skeleton */}
              <div className="col-span-2 aspect-[2/1] animate-pulse rounded-sm bg-gray-200 dark:bg-gray-800" />
              
              {/* Tiles Skeleton (6 tiles para preencher) */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="col-span-1 aspect-square animate-pulse rounded-sm bg-gray-200 dark:bg-gray-800"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </>
          ) : workouts.length > 0 ? (
            // CONTEÚDO REAL
            <>
            {/* Live Tile 4x2 com Flip (estilo Windows Phone) */}
            <div className="col-span-2" style={{ perspective: '1000px' }}>
              <div
                className="relative transition-transform duration-700 ease-in-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${rotation}deg)`,
                }}
              >
                {/* Frente: "Olá, [Nome]" */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <MetroTile color={accentColor} size="wide" hoverable={false}>
                    <div>
                      <h2 className="font-segoe text-base font-semibold lowercase text-white sm:text-lg md:text-xl">
                        olá, {student?.name.split(' ')[0]}
                      </h2>
                      <p className="mt-1 font-segoe text-xs text-white opacity-90">
                        pronto para treinar hoje?
                      </p>
                    </div>
                  </MetroTile>
                </div>

                {/* Verso: Informações de progresso */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateX(180deg)',
                  }}
                >
                  <MetroTile color={accentColor} size="wide" hoverable={false}>
                    <div>
                      <h2 className="font-segoe text-base font-semibold lowercase text-white sm:text-lg md:text-xl">
                        seus treinos
                      </h2>
                      <p className="mt-1 font-segoe text-xs text-white opacity-90">
                        {workouts.length} treino{workouts.length > 1 ? 's' : ''} disponíve{workouts.length > 1 ? 'is' : 'l'}
                      </p>
                    </div>
                  </MetroTile>
                </div>
              </div>
            </div>

            {/* Tiles de Treino 2x2 (medium) */}
            {workouts.map((workout, index) => (
              <Link key={workout.id} href={`/treino/${workout.id}`} className="col-span-1">
                <MetroTile color={accentColor} size="medium">
                  {/* Conteúdo do Tile */}
                  <div>
                    <h2 className="font-segoe text-base font-semibold lowercase text-white sm:text-lg md:text-xl">
                      {workout.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 font-segoe text-xs text-white opacity-90">
                      {workout.description}
                    </p>
                  </div>

                  {/* Letra decorativa (A, B, C, D) */}
                  <div className="text-right font-segoe text-4xl font-light text-white opacity-20 sm:text-5xl md:text-6xl">
                    {String.fromCharCode(65 + index)}
                  </div>
                </MetroTile>
              </Link>
            ))}

            {/* Tile de Configurações 2x2 (medium) - Animada com foto */}
            <Link href="/configuracoes" className="col-span-1">
              {student?.avatar_url ? (
                // Versão com foto - texto fixo atrás + foto que sobe/desce
                <div className="aspect-square w-full overflow-hidden" style={{ backgroundColor: accentColor }}>
                  <div className="relative h-full w-full">
                    {/* Texto fixo no topo (fica atrás da foto) */}
                    <div className="absolute left-0 right-0 top-0 flex flex-col justify-start px-4 pt-4">
                      <h2 className="font-segoe text-base font-semibold lowercase text-white sm:text-lg md:text-xl">
                        configurações
                      </h2>
                      <p className="mt-1 font-segoe text-xs text-white opacity-90">
                        tema e preferências
                      </p>
                    </div>
                    
                    {/* Foto que sobe e desce cobrindo/revelando o texto */}
                    <div
                      className="absolute left-0 right-0 transition-all duration-700 ease-in-out"
                      style={{
                        top: showConfigTitle ? '50%' : 0,
                        height: '100%',
                      }}
                    >
                      <img
                        src={student.avatar_url}
                        alt="Perfil"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Versão sem foto - estática
                <MetroTile color={accentColor} size="medium">
                  <div>
                    <h2 className="font-segoe text-base font-semibold lowercase text-white sm:text-lg md:text-xl">
                      configurações
                    </h2>
                    <p className="mt-1 font-segoe text-xs text-white opacity-90">
                      tema e preferências
                    </p>
                  </div>
                </MetroTile>
              )}
            </Link>
            </>
          ) : (
            // Empty State Metro
            <div 
              className="col-span-2 mt-16 border-2 border-dashed p-12 text-center"
              style={{ borderColor: colors.border }}
            >
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
    </div>
  );
}
