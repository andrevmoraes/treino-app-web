import { usePathname } from 'expo-router';

const WORKOUT_TITLES = {
  'treino-a': 'costas',
  'treino-b': 'ombros',
  'treino-c': 'peito',
  'treino-d': 'pernas'
};

export function useWorkoutTitle() {
  const pathname = usePathname();
  const currentTab = pathname.split('/').pop() || 'treino-a';
  
  return WORKOUT_TITLES[currentTab as keyof typeof WORKOUT_TITLES] || WORKOUT_TITLES['treino-a'];
}