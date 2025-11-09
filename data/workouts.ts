import { Exercise } from '@/types/exercise';

export interface WorkoutData {
  id: string;
  name: string;
  description: string;
  color: string;
  exercises: Omit<Exercise, 'video' | 'tip'>[];
}

export const WORKOUTS: Record<string, WorkoutData> = {
  'treino-a': {
    id: 'treino-a',
    name: 'Treino A',
    description: 'Costas e Tríceps',
    color: 'var(--metro-blue)',
    exercises: [
      { id: 1, title: 'Barra fixa', sets: 4, reps: 12, rest: '90s' },
      { id: 2, title: 'Remada curvada', sets: 4, reps: 12, rest: '90s' },
      { id: 3, title: 'Pulldown', sets: 3, reps: 15, rest: '60s' },
      { id: 4, title: 'Remada unilateral', sets: 3, reps: 12, rest: '60s' },
      { id: 5, title: 'Tríceps testa', sets: 3, reps: 12, rest: '60s' },
      { id: 6, title: 'Tríceps corda', sets: 3, reps: 15, rest: '60s' },
    ],
  },
  'treino-b': {
    id: 'treino-b',
    name: 'Treino B',
    description: 'Ombros',
    color: 'var(--metro-cyan)',
    exercises: [
      { id: 1, title: 'Desenvolvimento', sets: 4, reps: 12, rest: '90s' },
      { id: 2, title: 'Elevação lateral', sets: 4, reps: 15, rest: '60s' },
      { id: 3, title: 'Elevação frontal', sets: 3, reps: 15, rest: '60s' },
    ],
  },
  'treino-c': {
    id: 'treino-c',
    name: 'Treino C',
    description: 'Peito e Bíceps',
    color: 'var(--metro-red)',
    exercises: [
      { id: 1, title: 'Supino reto', sets: 4, reps: 12, rest: '90s' },
      { id: 2, title: 'Supino inclinado', sets: 4, reps: 12, rest: '90s' },
      { id: 3, title: 'Crucifixo', sets: 3, reps: 15, rest: '60s' },
      { id: 4, title: 'Rosca direta', sets: 4, reps: 12, rest: '90s' },
    ],
  },
  'treino-d': {
    id: 'treino-d',
    name: 'Treino D',
    description: 'Pernas e Core',
    color: 'var(--metro-green)',
    exercises: [
      { id: 1, title: 'Agachamento', sets: 4, reps: 12, rest: '2min' },
      { id: 2, title: 'Leg press', sets: 4, reps: 12, rest: '90s' },
      { id: 3, title: 'Cadeira extensora', sets: 3, reps: 15, rest: '60s' },
      { id: 4, title: 'Flexora', sets: 3, reps: 15, rest: '60s' },
    ],
  },
};

export function getWorkout(id: string): WorkoutData | undefined {
  return WORKOUTS[id];
}

export function getAllWorkouts(): WorkoutData[] {
  return Object.values(WORKOUTS);
}
