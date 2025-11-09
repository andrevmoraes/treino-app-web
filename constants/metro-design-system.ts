/**
 * 🎨 METRO DESIGN SYSTEM
 * Sistema de design inspirado no Windows Phone / Metro UI
 * Mantém suporte total a temas claro e escuro
 */

// ============================================
// CORES PRIMÁRIAS (Metro Colors)
// ============================================

export const MetroColors = {
  // Cores de acento (inspiradas no Windows Phone)
  blue: '#0078D7',      // Azul Microsoft
  teal: '#00B7C3',      // Ciano vibrante
  red: '#E81123',       // Vermelho energia
  green: '#107C10',     // Verde sucesso
  orange: '#F09609',    // Laranja atenção
  purple: '#8E5AA5',    // Roxo criativo
  pink: '#E3008C',      // Rosa destaque
  lime: '#8CBD18',      // Lima fresco
  
  // Cores de treino (já existentes, vibrantes)
  workout: {
    blue: '#0066FF',
    purple: '#6B46C1',
    green: '#059669',
    orange: '#EA580C',
    pink: '#DB2777',
    teal: '#0891B2',
  },
} as const;

// ============================================
// PALETA DE CORES POR TEMA
// ============================================

export const ThemeColors = {
  light: {
    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    backgroundTertiary: '#E8E8E8',
    
    // Superfícies
    surface: '#FFFFFF',
    surfaceElevated: '#FAFAFA',
    
    // Texto
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textInverted: '#FFFFFF',
    
    // Bordas
    border: '#E0E0E0',
    borderStrong: '#CCCCCC',
    divider: '#F0F0F0',
    
    // Estados
    hover: '#F5F5F5',
    active: '#EBEBEB',
    disabled: '#CCCCCC',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  
  dark: {
    // Backgrounds
    background: '#000000',
    backgroundSecondary: '#111111',
    backgroundTertiary: '#1A1A1A',
    
    // Superfícies
    surface: '#0A0A0A',
    surfaceElevated: '#151515',
    
    // Texto
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textTertiary: '#808080',
    textInverted: '#000000',
    
    // Bordas
    border: '#2A2A2A',
    borderStrong: '#404040',
    divider: '#1A1A1A',
    
    // Estados
    hover: '#1A1A1A',
    active: '#262626',
    disabled: '#404040',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

// ============================================
// TIPOGRAFIA (Metro Typography)
// ============================================

export const Typography = {
  // Font Family
  fontFamily: {
    primary: '"Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    mono: '"Consolas", "Courier New", monospace',
  },
  
  // Font Sizes (escala Metro)
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '42px',
    '5xl': '56px',
    '6xl': '72px',
  },
  
  // Font Weights (Metro usa light e bold)
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
  },
} as const;

// ============================================
// ESPAÇAMENTO (Metro Spacing)
// ============================================

export const Spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

// ============================================
// BORDER RADIUS (Minimalista)
// ============================================

export const BorderRadius = {
  none: '0',
  sm: '2px',    // Muito sutil
  base: '4px',  // Padrão Metro
  lg: '6px',    // Raramente usado
  full: '9999px', // Círculos
} as const;

// ============================================
// SOMBRAS (Sutis, estilo Metro)
// ============================================

export const Shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 2px 4px rgba(0, 0, 0, 0.08)',
  md: '0 4px 8px rgba(0, 0, 0, 0.12)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
  xl: '0 12px 24px rgba(0, 0, 0, 0.18)',
} as const;

// ============================================
// TRANSIÇÕES (Suaves e rápidas)
// ============================================

export const Transitions = {
  duration: {
    fast: '100ms',
    base: '200ms',
    slow: '300ms',
  },
  timing: {
    ease: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
    easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    linear: 'linear',
  },
} as const;

// ============================================
// Z-INDEX (Camadas)
// ============================================

export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
} as const;

// ============================================
// BREAKPOINTS (Responsive)
// ============================================

export const Breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// COMPONENTES - TOKENS
// ============================================

export const ComponentTokens = {
  // Botões
  button: {
    height: {
      sm: '32px',
      base: '40px',
      lg: '48px',
    },
    padding: {
      sm: '0 12px',
      base: '0 20px',
      lg: '0 28px',
    },
  },
  
  // Inputs
  input: {
    height: {
      sm: '32px',
      base: '40px',
      lg: '48px',
    },
    padding: '0 12px',
  },
  
  // Cards/Tiles
  card: {
    padding: {
      sm: Spacing[4],
      base: Spacing[6],
      lg: Spacing[8],
    },
  },
  
  // Espaçamento de seção
  section: {
    paddingY: {
      sm: Spacing[8],
      base: Spacing[12],
      lg: Spacing[16],
    },
  },
} as const;

// ============================================
// ANIMAÇÕES METRO
// ============================================

export const MetroAnimations = {
  // Slide in da direita (entrada de página)
  slideInRight: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  
  // Fade in (modais)
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Scale (botões, tiles)
  scale: {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  },
  
  // Tile flip (cards)
  tileFlip: {
    initial: { rotateY: 0 },
    animate: { rotateY: 180 },
  },
} as const;

// ============================================
// UTILITÁRIOS
// ============================================

export const getThemeColors = (isDark: boolean) => 
  isDark ? ThemeColors.dark : ThemeColors.light;

export const getAccentColor = (color: keyof typeof MetroColors) => 
  MetroColors[color];

// ============================================
// EXPORT TYPE-SAFE
// ============================================

export type MetroColorKey = keyof typeof MetroColors;
export type ThemeColorKey = keyof typeof ThemeColors.light;
export type TypographySizeKey = keyof typeof Typography.fontSize;
export type SpacingKey = keyof typeof Spacing;
