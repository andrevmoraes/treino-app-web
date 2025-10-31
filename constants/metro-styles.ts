import { Platform } from 'react-native';

/**
 * Fonte padrão Windows Phone/Metro UI
 */
export const METRO_FONT_FAMILY = Platform.select({
  web: '"Segoe UI Light", system-ui, Roboto, Arial, sans-serif',
  ios: 'System',
  android: 'sans-serif-light',
  default: 'System',
});

/**
 * Cores do tema Metro/Windows Phone
 */
export const METRO_COLORS = {
  background: '#000000',
  accent: '#0078D7',
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textTertiary: 'rgba(255, 255, 255, 0.35)',
  cardBackground: '#1F1F1F',
  border: 'rgba(255, 255, 255, 0.1)',
} as const;

/**
 * Espaçamentos consistentes
 */
export const METRO_SPACING = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;
