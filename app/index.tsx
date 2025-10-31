import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { CalendarTile } from '../components/calendar-tile';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { METRO_COLORS, METRO_FONT_FAMILY, METRO_SPACING } from '../constants/metro-styles';
import { WORKOUT_CONFIG } from '../constants/workouts';
import { useTheme } from '../contexts/theme-context';

// Import CSS para web (hover effects)
if (Platform.OS === 'web') {
  require('./index.css');
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Constantes para diferentes layouts
const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;

// Tamanhos base dos tiles para desktop (Windows 8.1)
const DESKTOP_TILE_SIZE = 150;
const DESKTOP_TILE_SPACING = 8;

const WORKOUTS = [
  { ...WORKOUT_CONFIG[0], size: 'large' as const },
  { ...WORKOUT_CONFIG[1], size: 'medium' as const },
  { ...WORKOUT_CONFIG[2], size: 'medium' as const },
  { ...WORKOUT_CONFIG[3], size: 'large' as const },
];

export default function Index() {
  const { width } = useWindowDimensions();
  const { accentColor, colors, isLoading } = useTheme();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkLayout = () => {
      setIsDesktop(width >= BREAKPOINT_DESKTOP);
      setIsTablet(width >= BREAKPOINT_TABLET && width < BREAKPOINT_DESKTOP);
    };
    
    checkLayout();
  }, [width]);

  // Intercepta o botão voltar do dispositivo na tela inicial
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Retorna true para prevenir o comportamento padrão (voltar)
        // Na tela inicial, não deve voltar para lugar nenhum
        return true;
      };

      // Adiciona listener apenas no Android
      if (Platform.OS === 'android') {
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        
        return () => subscription.remove();
      }

      return () => {};
    }, [])
  );

  console.log('📱 [Index] Renderizando tela inicial');
  console.log('📋 [Index] Largura:', width, 'Desktop:', isDesktop, 'Tablet:', isTablet);

  const handleTilePress = (workoutId: string) => {
    console.log(`🎯 [Index] Navegando para treino: ${workoutId}`);
    router.push(`/(tabs)/${workoutId}` as any);
  };

  const handleSettingsPress = () => {
    console.log('⚙️ [Index] Navegando para configurações');
    router.push('/settings');
  };

  const handleProfilePress = () => {
    console.log('👤 [Index] Navegando para perfil');
    router.push('/profile');
  };

  // Calcula tamanhos dos tiles baseado no layout
  const getTileStyle = (size: 'large' | 'medium') => {
    if (isDesktop) {
      // Windows 8.1 style - tiles fixos
      return {
        width: size === 'large' ? DESKTOP_TILE_SIZE * 2 + DESKTOP_TILE_SPACING : DESKTOP_TILE_SIZE,
        height: DESKTOP_TILE_SIZE,
      };
    } else if (isTablet) {
      // Tablet - 3 colunas
      const tileWidth = (width - METRO_SPACING.xl * 4) / 3;
      return {
        width: size === 'large' ? tileWidth * 2 + METRO_SPACING.sm : tileWidth,
        height: tileWidth,
      };
    } else {
      // Mobile - Windows Phone style
      const GRID_MARGIN = METRO_SPACING.sm;
      const TILE_MARGIN = GRID_MARGIN * 2;
      const GRID_WIDTH = width - (GRID_MARGIN * 2);
      const MEDIUM_TILE_BASE = GRID_WIDTH / 2 - TILE_MARGIN;
      
      return {
        width: size === 'large' ? GRID_WIDTH - TILE_MARGIN : MEDIUM_TILE_BASE,
        height: MEDIUM_TILE_BASE,
      };
    }
  };

  // Aguarda o carregamento do tema antes de renderizar
  if (isLoading) {
    return null; // Ou um loading spinner se preferir
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop
        ]}
        showsVerticalScrollIndicator={isDesktop}
      >
        <ThemedView style={[
          styles.grid,
          isDesktop && styles.gridDesktop,
          isTablet && styles.gridTablet
        ]}>
          {/* Card de Calendário - 4x2 */}
          <AnimatedPressable
            entering={FadeIn.delay(0)}
            style={[
              styles.tile,
              styles.tileNoPadding, // Remove padding para o calendário ocupar todo o espaço
              getTileStyle('large'),
              isDesktop && styles.tileDesktop,
            ]}
            onPress={handleSettingsPress}
            accessibilityRole="button"
            accessibilityLabel="Calendário"
            accessibilityHint="Mostra a data atual"
            {...(Platform.OS === 'web' && isDesktop ? { 'data-tile': 'true' } : {})}
          >
            <CalendarTile accentColor={accentColor} customText="calendar" />
          </AnimatedPressable>

          {WORKOUTS.map((workout, index) => (
            <AnimatedPressable
              key={workout.id}
              entering={FadeIn.delay((index + 1) * 100)}
              style={[
                styles.tile,
                { backgroundColor: accentColor },
                getTileStyle(workout.size),
                isDesktop && styles.tileDesktop,
              ]}
              onPress={() => handleTilePress(workout.id)}
              accessibilityRole="button"
              accessibilityLabel={`Treino ${workout.subtitle}`}
              accessibilityHint="Toque para iniciar o treino"
              {...(Platform.OS === 'web' && isDesktop ? { 'data-tile': 'true' } : {})}
            >
              {/* Ícone no centro */}
              <View style={styles.tileIconContainer}>
                <Ionicons name="barbell-outline" size={48} color="rgba(255, 255, 255, 0.6)" />
              </View>
              
              {/* Texto no canto inferior esquerdo */}
              <ThemedText style={styles.tileTitle}>
                {workout.subtitle}
              </ThemedText>
            </AnimatedPressable>
          ))}

          {/* Card de Configurações */}
          <AnimatedPressable
            entering={FadeIn.delay((WORKOUTS.length + 1) * 100)}
            style={[
              styles.tile,
              { backgroundColor: accentColor },
              getTileStyle('medium'),
              isDesktop && styles.tileDesktop,
            ]}
            onPress={handleSettingsPress}
            accessibilityRole="button"
            accessibilityLabel="Configurações"
            accessibilityHint="Toque para abrir as configurações"
            {...(Platform.OS === 'web' && isDesktop ? { 'data-tile': 'true' } : {})}
          >
            {/* Ícone no centro */}
            <View style={styles.tileIconContainer}>
              <Ionicons name="settings-outline" size={48} color="rgba(255, 255, 255, 0.6)" />
            </View>
            
            {/* Texto no canto inferior esquerdo */}
            <ThemedText style={styles.tileTitle}>
              configurações
            </ThemedText>
          </AnimatedPressable>

          {/* Card de Perfil */}
          <AnimatedPressable
            entering={FadeIn.delay((WORKOUTS.length + 2) * 100)}
            style={[
              styles.tile,
              { backgroundColor: accentColor },
              getTileStyle('medium'),
              isDesktop && styles.tileDesktop,
            ]}
            onPress={handleProfilePress}
            accessibilityRole="button"
            accessibilityLabel="Perfil"
            accessibilityHint="Toque para abrir o perfil"
            {...(Platform.OS === 'web' && isDesktop ? { 'data-tile': 'true' } : {})}
          >
            {/* Ícone no centro */}
            <View style={styles.tileIconContainer}>
              <Ionicons name="person-outline" size={48} color="rgba(255, 255, 255, 0.6)" />
            </View>
            
            {/* Texto no canto inferior esquerdo */}
            <ThemedText style={styles.tileTitle}>
              perfil
            </ThemedText>
          </AnimatedPressable>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: METRO_COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentDesktop: {
    alignItems: 'center',
    paddingVertical: METRO_SPACING.xxl,
  },
  
  // Grid styles
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: METRO_SPACING.sm,
    paddingTop: 60, // Espaço superior para Dynamic Island e alcançabilidade
  },
  gridDesktop: {
    maxWidth: 800,
    justifyContent: 'center',
    padding: METRO_SPACING.lg,
    gap: DESKTOP_TILE_SPACING,
  },
  gridTablet: {
    justifyContent: 'center',
    padding: METRO_SPACING.lg,
  },
  
  // Tile styles
  tile: {
    margin: METRO_SPACING.sm,
    padding: METRO_SPACING.md,
    justifyContent: 'space-between',
    overflow: 'visible',
    position: 'relative',
  },
  tileNoPadding: {
    padding: 0,
  },
  tileDesktop: {
    margin: 0,
  },
  tileIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Text styles
  tileTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
    letterSpacing: 0,
    alignSelf: 'flex-start',
  },
  tileTitleDesktop: {
    fontSize: 20,
    fontWeight: '300',
  },
  tileSubtitle: {
    fontSize: 14,
    fontWeight: '200',
    color: METRO_COLORS.textSecondary,
    fontFamily: METRO_FONT_FAMILY,
    marginTop: METRO_SPACING.xs,
    textTransform: 'lowercase',
  },
});