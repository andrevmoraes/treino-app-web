import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/theme-context';

const HEADER_HORIZONTAL_PADDING = 20;
const HEADER_VERTICAL_PADDING = 14;
const VALUE_LINE_HEIGHT = 48;
const LABEL_LINE_HEIGHT = 18;
export const WORKOUT_HEADER_HEIGHT = HEADER_VERTICAL_PADDING * 2 + VALUE_LINE_HEIGHT + LABEL_LINE_HEIGHT;

interface Props {
  exercisesCount: number;
  setsCount: number;
  totalExercises: number;
  totalSets: number;
}

export function WorkoutHeader({ exercisesCount, setsCount, totalExercises, totalSets }: Props) {
  const { accentColor } = useTheme();
  
  return (
    <View style={[styles.header, { backgroundColor: accentColor }]}>
      <View style={styles.progressInfo}>
        <View style={styles.progressItem}>
          <View style={styles.counterContainer}>
            <Text style={styles.progressValue}>{exercisesCount}</Text>
            <Text style={styles.progressTotal}>/{totalExercises}</Text>
          </View>
          <Text style={styles.progressLabel}>exercícios</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.progressItem}>
          <View style={styles.counterContainer}>
            <Text style={styles.progressValue}>{setsCount}</Text>
            <Text style={styles.progressTotal}>/{totalSets}</Text>
          </View>
          <Text style={styles.progressLabel}>séries</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: HEADER_HORIZONTAL_PADDING,
    paddingVertical: HEADER_VERTICAL_PADDING,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  progressItem: {
    flex: 1,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  progressValue: {
    fontSize: 40,
    fontWeight: '300',
    color: '#FFFFFF',
    lineHeight: VALUE_LINE_HEIGHT,
  },
  progressTotal: {
    fontSize: 20,
    fontWeight: '200',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: VALUE_LINE_HEIGHT,
    marginLeft: 2,
  },
  progressLabel: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textTransform: 'lowercase',
    lineHeight: LABEL_LINE_HEIGHT,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 18,
  },
});