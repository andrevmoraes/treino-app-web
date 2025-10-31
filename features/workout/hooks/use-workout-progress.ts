import { useCallback, useState } from 'react';
import type { CompletedSets } from '../../../types/exercise';

export function useWorkoutProgress() {
  const [completedSets, setCompletedSets] = useState<CompletedSets>({});

  const toggleSet = useCallback((exerciseId: number, setIndex: number) => {
    const key = `${exerciseId}-${setIndex}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const isSetComplete = useCallback((exerciseId: number, setIndex: number) => {
    return completedSets[`${exerciseId}-${setIndex}`] || false;
  }, [completedSets]);

  const resetProgress = useCallback(() => {
    setCompletedSets({});
  }, []);

  return {
    completedSets,
    toggleSet,
    isSetComplete,
    resetProgress,
  };
}