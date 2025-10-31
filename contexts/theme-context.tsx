import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

// Cores disponíveis
export const ACCENT_COLORS = {
  blue: '#0078D4',
  purple: '#8E44AD',
  orange: '#E67E22',
  emerald: '#16A085',
  crimson: '#E74C3C',
  magenta: '#E91E63',
  lime: '#8BC34A',
  teal: '#00BCD4',
  custom: '#0078D4', // Placeholder, será substituída pela cor personalizada
} as const;

export type AccentColorId = keyof typeof ACCENT_COLORS;
export type ThemeMode = 'light' | 'dark' | 'system';

// Cores do tema - Estilo Windows Phone
export const THEME_COLORS = {
  light: {
    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F2',
    text: '#000000',
    textSecondary: '#767676',
    border: '#D6D6D6',
    cardBackground: '#F8F8F8', // Cards com contraste sutil
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    background: '#000000',
    backgroundSecondary: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#333333',
    cardBackground: '#1F1F1F', // Cards com mais contraste no escuro
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
};

interface ThemeContextType {
  accentColor: string;
  accentColorId: AccentColorId | 'custom';
  setAccentColorId: (colorId: AccentColorId | 'custom') => Promise<void>;
  setCustomColor: (hexColor: string) => Promise<void>;
  customColor: string | null;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  isDark: boolean;
  colors: typeof THEME_COLORS.light | typeof THEME_COLORS.dark;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = '@maddaloni_personal:accent_color';
const CUSTOM_COLOR_KEY = '@maddaloni_personal:custom_color';
const THEME_MODE_KEY = '@maddaloni_personal:theme_mode';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accentColorId, setAccentColorIdState] = useState<AccentColorId | 'custom'>('blue');
  const [customColor, setCustomColorState] = useState<string | null>(null);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [isLoading, setIsLoading] = useState(true);

  // Determina se o tema atual é escuro
  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  // Cores do tema atual
  const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

  // Carrega configurações salvas ao iniciar
  useEffect(() => {
    loadSettings();
  }, []);

  // Listener para mudanças no tema do sistema
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('🎨 [ThemeProvider] Tema do sistema mudou para:', colorScheme);
      setSystemColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('🎨 [ThemeProvider] Carregando configurações...');
      
      const [savedColorId, savedCustomColor, savedThemeMode] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(CUSTOM_COLOR_KEY),
        AsyncStorage.getItem(THEME_MODE_KEY),
      ]);
      
      if (savedCustomColor) {
        console.log('✅ [ThemeProvider] Cor personalizada carregada:', savedCustomColor);
        setCustomColorState(savedCustomColor);
      }

      if (savedColorId && (savedColorId in ACCENT_COLORS || savedColorId === 'custom')) {
        console.log('✅ [ThemeProvider] Cor carregada:', savedColorId);
        setAccentColorIdState(savedColorId as AccentColorId | 'custom');
      } else {
        console.log('ℹ️ [ThemeProvider] Usando cor padrão: blue');
      }

      if (savedThemeMode && ['light', 'dark', 'system'].includes(savedThemeMode)) {
        console.log('✅ [ThemeProvider] Modo de tema carregado:', savedThemeMode);
        setThemeModeState(savedThemeMode as ThemeMode);
      } else {
        console.log('ℹ️ [ThemeProvider] Usando modo padrão: system');
      }
    } catch (error) {
      console.error('❌ [ThemeProvider] Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAccentColor = async () => {
    try {
      console.log('🎨 [ThemeProvider] Carregando cor salva...');
      const savedColorId = await AsyncStorage.getItem(STORAGE_KEY);
      const savedCustomColor = await AsyncStorage.getItem(CUSTOM_COLOR_KEY);
      
      if (savedCustomColor) {
        console.log('✅ [ThemeProvider] Cor personalizada carregada:', savedCustomColor);
        setCustomColorState(savedCustomColor);
      }

      if (savedColorId && (savedColorId in ACCENT_COLORS || savedColorId === 'custom')) {
        console.log('✅ [ThemeProvider] Cor carregada:', savedColorId);
        setAccentColorIdState(savedColorId as AccentColorId | 'custom');
      } else {
        console.log('ℹ️ [ThemeProvider] Usando cor padrão: blue');
      }
    } catch (error) {
      console.error('❌ [ThemeProvider] Erro ao carregar cor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAccentColorId = async (colorId: AccentColorId | 'custom') => {
    try {
      console.log('💾 [ThemeProvider] Salvando cor:', colorId);
      await AsyncStorage.setItem(STORAGE_KEY, colorId);
      setAccentColorIdState(colorId);
      console.log('✅ [ThemeProvider] Cor salva com sucesso!');
    } catch (error) {
      console.error('❌ [ThemeProvider] Erro ao salvar cor:', error);
    }
  };

  const setCustomColor = async (hexColor: string) => {
    try {
      console.log('💾 [ThemeProvider] Salvando cor personalizada:', hexColor);
      await AsyncStorage.setItem(CUSTOM_COLOR_KEY, hexColor);
      setCustomColorState(hexColor);
      await setAccentColorId('custom');
      console.log('✅ [ThemeProvider] Cor personalizada salva com sucesso!');
    } catch (error) {
      console.error('❌ [ThemeProvider] Erro ao salvar cor personalizada:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      console.log('💾 [ThemeProvider] Salvando modo de tema:', mode);
      await AsyncStorage.setItem(THEME_MODE_KEY, mode);
      setThemeModeState(mode);
      console.log('✅ [ThemeProvider] Modo de tema salvo com sucesso!');
    } catch (error) {
      console.error('❌ [ThemeProvider] Erro ao salvar modo de tema:', error);
    }
  };

  const accentColor = accentColorId === 'custom' && customColor 
    ? customColor 
    : ACCENT_COLORS[accentColorId as AccentColorId] || ACCENT_COLORS.blue;

  return (
    <ThemeContext.Provider value={{ 
      accentColor, 
      accentColorId, 
      setAccentColorId, 
      setCustomColor, 
      customColor,
      themeMode,
      setThemeMode,
      isDark,
      colors,
      isLoading 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
