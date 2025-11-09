'use client';

import { ExerciseCard } from '@/components/exercise-card';
import { MetroHeader } from '@/components/metro-ui';
import { ThemeColors } from '@/constants/metro-design-system';
import { useTheme } from '@/contexts/theme-context';
import { Exercise } from '@/types/exercise';
import { useRouter } from 'next/navigation';

interface WorkoutPageLayoutProps {
  workoutName: string;
  workoutDescription: string;
  workoutColor: string;
  exercises: Exercise[];
  studentId?: string; // ID do aluno logado
}

export function WorkoutPageLayout({
  workoutName,
  workoutDescription,
  workoutColor,
  exercises,
  studentId,
}: WorkoutPageLayoutProps) {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const themeColors = ThemeColors[colorScheme];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: themeColors.background }}>
      <div className="mx-auto max-w-3xl">
        <MetroHeader
          title={workoutName}
          subtitle={workoutDescription}
          onBack={() => router.push('/home')}
        />

        {/* Workout Color Indicator */}
        <div className="mb-6 flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-sm"
            style={{ backgroundColor: workoutColor }}
          />
          <div 
            className="h-1 flex-1 rounded-sm"
            style={{ backgroundColor: workoutColor }}
          />
        </div>

        <div className="space-y-3">
          {exercises.map((exercise) => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise}
              studentId={studentId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
