import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThemedView } from '../components/themed-view';
import { METRO_FONT_FAMILY, METRO_SPACING } from '../constants/metro-styles';
import { ACCENT_COLORS, useTheme, type AccentColorId, type ThemeMode } from '../contexts/theme-context';

// Cores disponíveis no estilo Windows Phone
const COLOR_OPTIONS = [
  { id: 'blue' as AccentColorId, name: 'azul', color: ACCENT_COLORS.blue, description: 'azul cobalto' },
  { id: 'purple' as AccentColorId, name: 'roxo', color: ACCENT_COLORS.purple, description: 'roxo violeta' },
  { id: 'orange' as AccentColorId, name: 'laranja', color: ACCENT_COLORS.orange, description: 'laranja intenso' },
  { id: 'emerald' as AccentColorId, name: 'esmeralda', color: ACCENT_COLORS.emerald, description: 'verde esmeralda' },
  { id: 'crimson' as AccentColorId, name: 'carmesim', color: ACCENT_COLORS.crimson, description: 'vermelho vibrante' },
  { id: 'magenta' as AccentColorId, name: 'magenta', color: ACCENT_COLORS.magenta, description: 'rosa vibrante' },
  { id: 'lime' as AccentColorId, name: 'limão', color: ACCENT_COLORS.lime, description: 'verde limão' },
  { id: 'teal' as AccentColorId, name: 'ciano', color: ACCENT_COLORS.teal, description: 'azul ciano' },
];

const THEME_OPTIONS = [
  { id: 'light' as ThemeMode, name: 'claro', icon: 'sunny-outline' as const, description: 'tema claro' },
  { id: 'dark' as ThemeMode, name: 'escuro', icon: 'moon-outline' as const, description: 'tema escuro' },
  { id: 'system' as ThemeMode, name: 'sistema', icon: 'phone-portrait-outline' as const, description: 'seguir dispositivo' },
];

export default function Settings() {
  const { 
    accentColor, 
    accentColorId, 
    setAccentColorId, 
    setCustomColor, 
    customColor,
    themeMode,
    setThemeMode,
    colors,
  } = useTheme();
  const [customHex, setCustomHex] = useState(customColor || '');
  const [hexError, setHexError] = useState('');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  console.log('⚙️ [Settings] Renderizando tela de configurações');
  console.log('🎨 [Settings] Cor atual:', accentColorId, accentColor);
  console.log('🌓 [Settings] Tema atual:', themeMode);

  const handleColorSelect = async (colorId: AccentColorId) => {
    console.log('🎨 [Settings] Selecionando cor:', colorId);
    await setAccentColorId(colorId);
    setHexError('');
  };

  const validateAndApplyCustomColor = async () => {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const normalizedHex = customHex.startsWith('#') ? customHex : `#${customHex}`;
    
    if (!hexPattern.test(normalizedHex)) {
      setHexError('Formato inválido. Use: #RRGGBB');
      return;
    }

    console.log('🎨 [Settings] Aplicando cor personalizada:', normalizedHex);
    await setCustomColor(normalizedHex);
    setHexError('');
  };

  const handleThemeModeSelect = async (mode: ThemeMode) => {
    console.log('🌓 [Settings] Selecionando modo de tema:', mode);
    await setThemeMode(mode);
    setIsThemeDropdownOpen(false); // Fecha o dropdown após selecionar
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>configurações</Text>
        </View>

        <View style={styles.mainContent}>
          {/* Theme Section */}
          <View style={styles.settingGroup}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>tema</Text>
            <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
              Mude o plano de fundo e a <Text style={{ color: accentColor }}>cor de destaque</Text> do seu aplicativo para se adequar ao seu humor hoje, esta semana ou o mês inteiro.
            </Text>
          </View>

          {/* Background Selector */}
          <View style={styles.settingGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Plano de fundo</Text>
            
            {/* Selected Value */}
            <Pressable 
              style={[styles.selector, { borderColor: colors.text }]}
              onPress={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            >
              <Text style={[styles.selectorText, { color: colors.text }]}>
                {themeMode === 'dark' ? 'escuro' : themeMode === 'light' ? 'claro' : 'sistema'}
              </Text>
              <Ionicons 
                name={isThemeDropdownOpen ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={colors.text} 
              />
            </Pressable>

            {/* Dropdown Options */}
            {isThemeDropdownOpen && (
              <View style={[styles.dropdownContainer, { borderColor: colors.text }]}>
                {THEME_OPTIONS.map((option) => (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.dropdownOption,
                      themeMode === option.id && { backgroundColor: accentColor }
                    ]}
                    onPress={() => handleThemeModeSelect(option.id)}
                  >
                    <Text 
                      style={[
                        styles.dropdownOptionText, 
                        { color: themeMode === option.id ? '#FFFFFF' : colors.text }
                      ]}
                    >
                      {option.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Accent Colour Grid */}
          <View style={styles.settingGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Cor de destaque</Text>
            <View style={styles.accentGrid}>
              {COLOR_OPTIONS.map((colorOption) => {
                const isSelected = accentColorId === colorOption.id;
                
                return (
                  <View key={colorOption.id} style={styles.accentTileContainer}>
                    <Pressable
                      style={[
                        styles.accentTile,
                        { backgroundColor: colorOption.color },
                        isSelected && styles.accentTileSelected
                      ]}
                      onPress={() => handleColorSelect(colorOption.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Cor ${colorOption.name}`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                      )}
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Custom Color */}
          <View style={styles.settingGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Cor personalizada</Text>
            <View style={styles.customColorRow}>
              <TextInput
                style={[
                  styles.hexInput,
                  { 
                    borderColor: colors.text,
                    color: colors.text,
                  }
                ]}
                value={customHex}
                onChangeText={(text) => {
                  setCustomHex(text);
                  setHexError('');
                }}
                placeholder="#000000"
                placeholderTextColor={colors.textSecondary}
                maxLength={7}
                autoCapitalize="characters"
              />
              <Pressable
                style={[
                  styles.applyButton,
                  { backgroundColor: accentColor }
                ]}
                onPress={validateAndApplyCustomColor}
                accessibilityRole="button"
                accessibilityLabel="Aplicar cor personalizada"
              >
                <Text style={styles.applyButtonText}>aplicar</Text>
              </Pressable>
            </View>
            {hexError ? (
              <Text style={styles.errorText}>{hexError}</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: METRO_SPACING.xxl * 2,
  },
  
  // Header - Windows Phone style
  header: {
    paddingHorizontal: METRO_SPACING.lg,
    paddingTop: 48,
    paddingBottom: METRO_SPACING.xl,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '200',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
  },

  // Main Content
  mainContent: {
    paddingHorizontal: METRO_SPACING.lg,
  },

  // Setting Groups
  settingGroup: {
    marginBottom: 32,
  },
  settingLabel: {
    fontSize: 32,
    fontWeight: '300',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 15,
    fontWeight: '300',
    fontFamily: METRO_FONT_FAMILY,
    lineHeight: 22,
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: METRO_FONT_FAMILY,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Background/Theme Selector (like Windows Phone dropdown)
  selector: {
    height: 56,
    borderWidth: 2,
    paddingHorizontal: METRO_SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
  },
  dropdownContainer: {
    borderWidth: 2,
    borderTopWidth: 0,
    marginTop: -2, // Conecta com o selector
  },
  dropdownOption: {
    height: 56,
    paddingHorizontal: METRO_SPACING.lg,
    justifyContent: 'center',
  },
  dropdownOptionText: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
  },

  // Accent Grid (4 columns like Windows Phone)
  accentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6, // Compensa o gap lateral
  },
  accentTileContainer: {
    width: '25%', // 4 colunas
    aspectRatio: 1,
    padding: 6, // Espaçamento maior entre as tiles
  },
  accentTile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accentTileSelected: {
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },

  // Custom Color Input
  customColorRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  hexInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    paddingHorizontal: METRO_SPACING.lg,
    fontSize: 18,
    fontWeight: '400',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'uppercase',
  },
  applyButton: {
    height: 56,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '300',
    color: '#E74C3C',
    fontFamily: METRO_FONT_FAMILY,
    marginTop: METRO_SPACING.sm,
  },
});
