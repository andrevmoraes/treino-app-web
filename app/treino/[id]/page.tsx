'use client';

import { MetroButton, MetroLoading } from '@/components/metro-ui';
import { WorkoutPageLayout } from '@/components/workout-page-layout';
import { MetroColors, ThemeColors } from '@/constants/metro-design-system';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Exercise {
  id: number;
  title: string;
  sets: number;
  reps: number;
  rest: string;
  order_index: number;
}

interface Workout {
  id: number;
  name: string;
  description: string;
  color: string;
  exercises: Exercise[];
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { student } = useAuth();
  const { colorScheme } = useTheme();
  const workoutId = params.id as string;
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkout() {
      try {
        setLoading(true);
        const response = await fetch(`/api/workouts/details?workout_id=${workoutId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao carregar treino');
        }

        setWorkout(result.data);
      } catch (err) {
        console.error('Erro ao carregar treino:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar treino');
      } finally {
        setLoading(false);
      }
    }

    if (workoutId) {
      loadWorkout();
    }
  }, [workoutId]);

  const themeColors = ThemeColors[colorScheme];

  if (loading) {
    return <MetroLoading fullScreen />;
  }

  if (error || !workout) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4" style={{ backgroundColor: themeColors.background }}>
        <div className="text-6xl">❌</div>
        <div className="font-segoe text-lg" style={{ color: themeColors.text }}>
          {error || 'Treino não encontrado'}
        </div>
        <MetroButton
          onClick={() => router.push('/home')}
          variant="primary"
          accentColor={MetroColors.blue}
        >
          voltar para home
        </MetroButton>
      </div>
    );
  }

  return (
    <WorkoutPageLayout
      workoutName={workout.name}
      workoutDescription={workout.description}
      workoutColor={workout.color}
      studentId={student?.id}
      exercises={workout.exercises.map((ex: any) => ({
        id: ex.id,
        title: ex.title,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        video: ex.video || '',
        tip: ex.tip || null,
      }))}
    />
  );
}
