/**
 * Configuração centralizada dos treinos
 */
export const WORKOUT_CONFIG = [
  { id: 'treino-a', title: 'Costas', subtitle: 'Costas e Tríceps' },
  { id: 'treino-b', title: 'Ombros', subtitle: 'Ombros' },
  { id: 'treino-c', title: 'Peito', subtitle: 'Peito e Bíceps' },
  { id: 'treino-d', title: 'Pernas', subtitle: 'Pernas e Core' },
] as const;

export type WorkoutId = typeof WORKOUT_CONFIG[number]['id'];
