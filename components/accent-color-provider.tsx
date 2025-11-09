'use client';

import { useTheme } from '@/contexts/theme-context';
import { useEffect } from 'react';

/**
 * 🎨 ACCENT COLOR PROVIDER
 * Injeta a cor de destaque (accentColor) como CSS variable global
 * Permite que a cor seja usada em todo o sistema via var(--accent-color)
 * Estilo Windows Phone: cor de destaque unificada em todo o UI
 */
export function AccentColorProvider() {
  const { accentColor } = useTheme();

  useEffect(() => {
    // Injeta --accent-color no :root para uso global
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);

  return null; // Não renderiza nada, apenas injeta CSS
}
