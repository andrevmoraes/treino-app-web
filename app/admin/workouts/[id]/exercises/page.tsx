'use client';

import ExerciseModal from '@/components/exercise-modal';
import { MetroButton, MetroHeader, MetroLoading } from '@/components/metro-ui';
import { MetroColors, ThemeColors } from '@/constants/metro-design-system';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Exercise {
  id: string;
  title: string;
  sets: number;
  reps: number;
  rest: string;
  order_index: number;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  color: string;
  student_id: string;
}

export default function ManageExercisesPage() {
  const router = useRouter();
  const params = useParams();
  const workoutId = params.id as string;
  const { professor } = useAdminAuth();
  const { colorScheme } = useTheme();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (!professor) {
      router.push('/admin/login');
      return;
    }

    loadWorkoutData();
  }, [professor, workoutId, router]);

  const loadWorkoutData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar dados do workout com exercícios
      const response = await fetch(`/api/workouts/details?workout_id=${workoutId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao carregar treino');
      }

      setWorkout(result.data);
      setExercises(result.data.exercises || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateExercise = () => {
    setSelectedExercise(null);
    setShowExerciseModal(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseModal(true);
  };

  const handleDeleteExercise = async (exerciseId: string, exerciseTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${exerciseTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/exercises/delete?exercise_id=${exerciseId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao deletar exercício');
      }

      await loadWorkoutData();
    } catch (err) {
      console.error('Erro ao deletar exercício:', err);
      alert(`Erro ao deletar exercício: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newExercises = [...exercises];
    [newExercises[index], newExercises[index - 1]] = [newExercises[index - 1], newExercises[index]];

    // Atualização otimista - atualiza UI imediatamente
    setExercises(newExercises);

    // Envia para servidor em background
    await reorderExercises(newExercises);
  };

  const handleMoveDown = async (index: number) => {
    if (index === exercises.length - 1) return;

    const newExercises = [...exercises];
    [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];

    // Atualização otimista - atualiza UI imediatamente
    setExercises(newExercises);

    // Envia para servidor em background
    await reorderExercises(newExercises);
  };

  const reorderExercises = async (newExercises: Exercise[]) => {
    const previousExercises = exercises; // Guardar estado anterior para rollback
    
    try {
      const exercisesWithNewOrder = newExercises.map((ex, idx) => ({
        id: ex.id,
        order_index: idx,
      }));

      const response = await fetch('/api/exercises/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercises: exercisesWithNewOrder }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao reordenar exercícios');
      }

      // Sucesso - não precisa fazer nada, UI já está atualizada
    } catch (err) {
      console.error('Erro ao reordenar exercícios:', err);
      // Rollback - reverte para estado anterior
      setExercises(previousExercises);
      alert(`Erro ao reordenar: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  const themeColors = ThemeColors[colorScheme];

  if (isLoading) {
    return <MetroLoading fullScreen />;
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4" style={{ backgroundColor: themeColors.background }}>
        <span className="text-6xl">❌</span>
        <p className="font-segoe text-lg" style={{ color: themeColors.text }}>
          {error || 'Treino não encontrado'}
        </p>
        <MetroButton
          onClick={() => router.back()}
          variant="primary"
          accentColor={MetroColors.blue}
        >
          ← voltar
        </MetroButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      {/* Header */}
      <MetroHeader
        title={workout.name}
        subtitle={workout.description}
        onBack={() => router.back()}
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workout Header */}
        <div className="rounded-sm border p-6 mb-8" style={{ 
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border 
        }}>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-sm flex-shrink-0"
              style={{ backgroundColor: workout.color }}
            />
            <div className="flex-1">
              <h2 className="font-segoe text-2xl font-light lowercase mb-1" style={{ color: themeColors.text }}>
                {workout.name}
              </h2>
              <p className="font-segoe text-sm" style={{ color: themeColors.textSecondary }}>
                {workout.description}
              </p>
            </div>
          </div>
        </div>

        {/* Exercises Section */}
        <div className="rounded-sm border" style={{ 
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border 
        }}>
          <div className="p-6 border-b" style={{ borderColor: themeColors.border }}>
            <div className="flex items-center justify-between">
              <h2 className="font-segoe text-xl lowercase" style={{ color: themeColors.text }}>
                📋 exercícios
              </h2>
              <MetroButton
                onClick={handleCreateExercise}
                variant="primary"
                accentColor={MetroColors.green}
              >
                ➕ novo exercício
              </MetroButton>
            </div>
          </div>

          <div className="p-6">
            {exercises.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📭</span>
                <p className="font-segoe text-lg mb-6 lowercase" style={{ color: themeColors.textSecondary }}>
                  nenhum exercício cadastrado
                </p>
                <MetroButton
                  onClick={handleCreateExercise}
                  variant="primary"
                  accentColor={MetroColors.blue}
                >
                  criar primeiro exercício
                </MetroButton>
              </div>
            ) : (
              <div className="space-y-3">
                {exercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="border-2 rounded-sm p-4 hover:opacity-80 transition-opacity"
                    style={{ borderColor: themeColors.border }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Order Controls */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="w-8 h-8 flex items-center justify-center rounded-sm hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-opacity"
                          style={{ backgroundColor: themeColors.surface, color: themeColors.text, border: `1px solid ${themeColors.border}` }}
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === exercises.length - 1}
                          className="w-8 h-8 flex items-center justify-center rounded-sm hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-opacity"
                          style={{ backgroundColor: themeColors.surface, color: themeColors.text, border: `1px solid ${themeColors.border}` }}
                        >
                          ▼
                        </button>
                      </div>

                      {/* Exercise Info */}
                      <div className="flex-1">
                        <h3 className="font-segoe text-lg font-semibold mb-2" style={{ color: themeColors.text }}>
                          {index + 1}. {exercise.title}
                        </h3>
                        <div className="flex gap-4 font-segoe text-sm" style={{ color: themeColors.textSecondary }}>
                          <span>📊 {exercise.sets} séries</span>
                          <span>🔁 {exercise.reps} reps</span>
                          <span>⏱️ {exercise.rest}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <MetroButton
                          onClick={() => handleEditExercise(exercise)}
                          variant="secondary"
                          size="sm"
                        >
                          ✏️ editar
                        </MetroButton>
                        <MetroButton
                          onClick={() => handleDeleteExercise(exercise.id, exercise.title)}
                          variant="danger"
                          size="sm"
                        >
                          🗑️
                        </MetroButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Exercise Modal */}
      <ExerciseModal
        isOpen={showExerciseModal}
        onClose={() => {
          setShowExerciseModal(false);
          setSelectedExercise(null);
        }}
        onSuccess={async () => {
          setShowExerciseModal(false);
          setSelectedExercise(null);
          await loadWorkoutData();
        }}
        workoutId={workoutId}
        professorId={professor?.id || ''}
        exercise={selectedExercise}
      />
    </div>
  );
}
