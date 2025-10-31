import React, { useCallback } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { METRO_SPACING } from '../constants/metro-styles';
import { useTheme } from '../contexts/theme-context';
import { useWorkoutState } from '../hooks/use-workout-state';
import type { Exercise } from '../types/exercise';
import ExerciseCard from './exercise-card';
import { WorkoutHeader } from './workout-header';

interface WorkoutLayoutProps {
  exercises: Exercise[];
}

/**
 * Layout compartilhado para todas as telas de treino
 * Elimina duplicação de código entre treino-a, treino-b, treino-c, treino-d
 */
export function WorkoutLayout({ exercises }: WorkoutLayoutProps) {
  console.log('🏋️ [WorkoutLayout] Renderizando layout com', exercises.length, 'exercícios');
  
  const { colors } = useTheme();
  const {
    toggleSet,
    isExerciseComplete,
    progress,
    getCompletedSets,
  } = useWorkoutState(exercises);

  const openVideo = useCallback((url: string) => {
    console.log('🎥 [WorkoutLayout] Abrindo vídeo:', url);
    Linking.openURL(url);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerContainer}>
          <WorkoutHeader 
            exercisesCount={progress.completedExercises}
            setsCount={progress.doneSets}
            totalExercises={exercises.length}
            totalSets={progress.totalSets}
          />
        </View>

        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isComplete={isExerciseComplete(exercise)}
            onToggleSet={(setIndex: number) => toggleSet(exercise.id, setIndex)}
            onVideoPress={() => openVideo(exercise.video)}
            completedSets={getCompletedSets(exercise.id, exercise.sets)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: METRO_SPACING.lg,
    paddingTop: METRO_SPACING.xxl,
    paddingBottom: METRO_SPACING.xxl * 2, // Mais espaço no final
  },
  headerContainer: {
    marginBottom: METRO_SPACING.xxl,
  },
});
