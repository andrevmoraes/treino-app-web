import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/theme-context';
import type { Exercise } from '../types/exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  isComplete: boolean;
  onToggleSet: (setIndex: number) => void;
  onVideoPress: () => void;
  completedSets: boolean[];
}

const ExerciseCard = ({ 
  exercise, 
  isComplete, 
  onToggleSet, 
  onVideoPress,
  completedSets
}: ExerciseCardProps) => {
  const { accentColor, colors } = useTheme();
  const hasVideo = Boolean(exercise.video && exercise.video.trim());

  console.log(`🏃 [ExerciseCard] Renderizando: ${exercise.title}, completo: ${isComplete}, tem vídeo: ${hasVideo}`);

  return (
    <View 
      style={[
        styles.exerciseCard,
        { backgroundColor: colors.cardBackground },
        isComplete && styles.exerciseCardCompleted
      ]}
    >
      {/* Accent Bar - Estilo Windows */}
      <View style={[
        styles.accentBar,
        { backgroundColor: isComplete ? '#107C10' : accentColor }
      ]} />

      <View style={styles.exerciseContent}>
        <View style={styles.exerciseHeader}>
          <Text style={[styles.exerciseTitle, { color: colors.text }]}>{exercise.title.toLowerCase()}</Text>
          <TouchableOpacity 
            style={[
              styles.videoButton, 
              hasVideo && { backgroundColor: accentColor },
              !hasVideo && styles.videoButtonDisabled
            ]}
            onPress={hasVideo ? onVideoPress : undefined}
            activeOpacity={hasVideo ? 0.8 : 1}
            disabled={!hasVideo}
          >
            <Text style={[styles.videoButtonText, !hasVideo && styles.videoButtonTextDisabled]}>▶</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.exerciseInfo}>
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>séries</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{exercise.sets}x{exercise.reps}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>descanso</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{exercise.rest}</Text>
          </View>
        </View>

        {exercise.tip && (
          <View style={[styles.tipContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.tip, { color: colors.textSecondary }]}>{exercise.tip}</Text>
          </View>
        )}

        {/* Sets - Estilo Metro Grid */}
        <View style={styles.setsContainer}>
          {Array.from({ length: exercise.sets }).map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.setButton,
                { 
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border 
                },
                completedSets[index] && { 
                  backgroundColor: accentColor,
                  borderColor: accentColor 
                }
              ]}
              onPress={() => onToggleSet(index)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.setButtonText,
                { color: colors.textSecondary },
                completedSets[index] && styles.setButtonTextDone
              ]}>
                {index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default memo(ExerciseCard);

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: '#1F1F1F',
    marginBottom: 8,
    flexDirection: 'row',
  },
  exerciseCardCompleted: {
    opacity: 0.6,
  },
  accentBar: {
    width: 4,
    backgroundColor: '#0078D4',
  },
  exerciseContent: {
    flex: 1,
    padding: 20,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
    textTransform: 'lowercase',
    letterSpacing: 0.3,
  },
  videoButton: {
    width: 40,
    height: 40,
    backgroundColor: '#0078D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  videoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  videoButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.35)',
  },
  exerciseInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'lowercase',
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  tipContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    marginBottom: 16,
  },
  tip: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  setsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4, // Mais espaçamento entre botões
  },
  setButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5, // Border mais visível
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  setButtonDone: {
    backgroundColor: '#0078D4',
    borderColor: '#0078D4',
  },
  setButtonText: {
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
  },
  setButtonTextDone: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});