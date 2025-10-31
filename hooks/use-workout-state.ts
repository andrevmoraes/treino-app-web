import { useCallback, useMemo, useState } from 'react';
import type { CompletedSets, Exercise } from '../types/exercise';

export interface WorkoutProgress {
  completedExercises: number;
  totalSets: number;
  doneSets: number;
}

/**
 * Hook customizado para gerenciar o estado de um treino
 * Elimina código duplicado presente em todos os arquivos de treino
 */
export function useWorkoutState(exercises: Exercise[]) {
  console.log('💪 [useWorkoutState] Inicializando hook com', exercises.length, 'exercícios');
  
  const [completedSets, setCompletedSets] = useState<CompletedSets>({});

  const toggleSet = useCallback((exerciseId: number, setIndex: number) => {
    const key = `${exerciseId}-${setIndex}`;
    console.log('✅ [useWorkoutState] Toggle set:', key);
    setCompletedSets(prev => {
      const newValue = !prev[key];
      console.log(`   -> Mudando de ${prev[key] || false} para ${newValue}`);
      return {
        ...prev,
        [key]: newValue
      };
    });
  }, []);

  const isSetComplete = useCallback((exerciseId: number, setIndex: number) => {
    return completedSets[`${exerciseId}-${setIndex}`] || false;
  }, [completedSets]);

  const isExerciseComplete = useCallback((exercise: Exercise) => {
    for (let i = 0; i < exercise.sets; i++) {
      if (!isSetComplete(exercise.id, i)) return false;
    }
    return true;
  }, [isSetComplete]);

  const progress = useMemo((): WorkoutProgress => {
    let completedExercises = 0;
    let totalSets = 0;
    let doneSets = 0;

    exercises.forEach(ex => {
      totalSets += ex.sets;
      if (isExerciseComplete(ex)) completedExercises++;
      
      for (let i = 0; i < ex.sets; i++) {
        if (isSetComplete(ex.id, i)) doneSets++;
      }
    });

    console.log('📈 [useWorkoutState] Progresso calculado:', {
      completedExercises,
      totalSets,
      doneSets,
      percentage: totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0
    });

    return { completedExercises, totalSets, doneSets };
  }, [exercises, isExerciseComplete, isSetComplete]);

  const getCompletedSets = useCallback((exerciseId: number, totalSets: number): boolean[] => {
    return Array.from({ length: totalSets }, (_, i) => isSetComplete(exerciseId, i));
  }, [isSetComplete]);

  return {
    toggleSet,
    isSetComplete,
    isExerciseComplete,
    progress,
    getCompletedSets,
  };
}
