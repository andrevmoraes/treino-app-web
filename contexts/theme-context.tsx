'use client';

import { Colors, ColorScheme, ThemeMode } from '@/constants/theme';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  colors: typeof Colors.light;
  accentColor: string;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ACCENT_COLORS = ['#0078D7', '#00B7C3', '#E81123', '#107C10'];

// ⚡ OTIMIZAÇÃO: Carrega preferências INSTANTANEAMENTE do localStorage
const getInitialTheme = (): { mode: ThemeMode; accent: string } => {
  if (typeof window === 'undefined') return { mode: 'system', accent: ACCENT_COLORS[0] };
  
  const savedMode = localStorage.getItem('themeMode') as ThemeMode;
  
  // Carrega cor de destaque específica do usuário logado
  const studentData = localStorage.getItem('student');
  const userId = studentData ? JSON.parse(studentData).id : 'guest';
  const userAccentKey = `accentColor_${userId}`;
  const savedAccent = localStorage.getItem(userAccentKey);
  
  return {
    mode: savedMode || 'system',
    accent: savedAccent && ACCENT_COLORS.includes(savedAccent) ? savedAccent : ACCENT_COLORS[0],
  };
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const initialTheme = getInitialTheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialTheme.mode);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [accentColor, setAccentColorState] = useState(initialTheme.accent);

  useEffect(() => {
    const getSystemTheme = (): ColorScheme => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (mode: ThemeMode) => {
      const effectiveScheme: ColorScheme = mode === 'system' ? getSystemTheme() : mode;
      setColorScheme(effectiveScheme);
      if (effectiveScheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme(themeMode);
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
    
    // Salva cor de destaque específica para o usuário logado
    const studentData = localStorage.getItem('student');
    const userId = studentData ? JSON.parse(studentData).id : 'guest';
    const userAccentKey = `accentColor_${userId}`;
    localStorage.setItem(userAccentKey, color);
  };

  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ themeMode, colorScheme, colors, accentColor, setThemeMode, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
