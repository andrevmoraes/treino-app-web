'use client';

import { Colors, ColorScheme, ThemeMode } from '@/constants/theme';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  colors: typeof Colors.light;
  accentColor: string;
  setThemeMode: (mode: ThemeMode) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ACCENT_COLORS = ['#0078D7', '#00B7C3', '#E81123', '#107C10'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    const savedAccent = localStorage.getItem('accentColor');
    if (savedMode) setThemeModeState(savedMode);
    if (savedAccent && ACCENT_COLORS.includes(savedAccent)) setAccentColor(savedAccent);
    setIsLoading(false);
  }, []);

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

  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ themeMode, colorScheme, colors, accentColor, setThemeMode, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
