import { Tabs, usePathname, useRouter, type Href } from 'expo-router';
import React from 'react';
import { PanResponder, StyleSheet } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { WORKOUT_CONFIG } from '../constants/workouts';
import { useTheme } from '../contexts/theme-context';
import { MetroPanorama } from './metro-panorama';
import { ThemedView } from './themed-view';

export default function MetroTabLayout() {
  const pathname = usePathname();
  const currentTab = pathname.split('/').pop() || WORKOUT_CONFIG[0].id;
  const router = useRouter();
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const isTransitioning = React.useRef(false);
  
  console.log('🔄 [MetroTabLayout] Pathname:', pathname);
  console.log('📍 [MetroTabLayout] Tab atual:', currentTab);
  
  const activeIndex = React.useMemo(() => {
    const index = WORKOUT_CONFIG.findIndex(tab => tab.id === currentTab);
    console.log('📊 [MetroTabLayout] Índice ativo calculado:', index);
    return index;
  }, [currentTab]);

  const finishTransition = React.useCallback(() => {
    isTransitioning.current = false;
  }, []);

  const navigateToIndex = React.useCallback((index: number) => {
    console.log('🔀 [MetroTabLayout] Tentando navegar para índice:', index);
    if (index < 0 || index >= WORKOUT_CONFIG.length) {
      console.log('⚠️ [MetroTabLayout] Índice inválido, abortando');
      translateX.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) });
      return;
    }
    if (isTransitioning.current) {
      console.log('⚠️ [MetroTabLayout] Transição em andamento, ignorando');
      return;
    }
    
    isTransitioning.current = true;
    const target = WORKOUT_CONFIG[index];
    const direction = index > activeIndex ? -1 : 1;
    console.log('✅ [MetroTabLayout] Navegando para:', target.id, 'Direção:', direction);
    
    // Anima para fora e navega
    translateX.value = withTiming(
      direction * 400,
      { 
        duration: 250, 
        easing: Easing.out(Easing.cubic) 
      },
      (finished) => {
        if (finished) {
          runOnJS(router.replace)(`/(tabs)/${target.id}` as Href);
          translateX.value = -direction * 400;
          translateX.value = withTiming(0, { 
            duration: 250, 
            easing: Easing.out(Easing.cubic) 
          }, (finished) => {
            if (finished) {
              runOnJS(finishTransition)();
            }
          });
        }
      }
    );
  }, [router, activeIndex, translateX, finishTransition]);

  const panResponder = React.useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_evt, gestureState) => {
      const { dx, dy } = gestureState;
      const shouldHandle = Math.abs(dx) > 18 && Math.abs(dx) > Math.abs(dy);
      if (shouldHandle) {
        console.log('👆 [MetroTabLayout] Gesto de swipe detectado, dx:', dx);
      }
      return shouldHandle;
    },
    onPanResponderMove: (_evt, gestureState) => {
      if (!isTransitioning.current) {
        translateX.value = gestureState.dx * 0.6; // Efeito de arrasto com resistência
      }
    },
    onPanResponderRelease: (_evt, gestureState) => {
      if (activeIndex === -1) {
        console.log('⚠️ [MetroTabLayout] activeIndex inválido (-1)');
        translateX.value = withTiming(0, { duration: 200 });
        return;
      }
      const { dx, vx } = gestureState;
      console.log('📤 [MetroTabLayout] Swipe finalizado - dx:', dx, 'vx:', vx);
      
      if (Math.abs(dx) < 48 && Math.abs(vx) < 0.3) {
        console.log('⚠️ [MetroTabLayout] Swipe muito fraco, voltando ao normal');
        translateX.value = withTiming(0, { duration: 200 });
        return;
      }

      const targetIndex = dx < 0 ? activeIndex + 1 : activeIndex - 1;
      console.log('➡️ [MetroTabLayout] Direção do swipe:', dx < 0 ? 'esquerda (próximo)' : 'direita (anterior)');
      navigateToIndex(targetIndex);
    },
  }), [activeIndex, navigateToIndex, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <ThemedView style={styles.container} {...panResponder.panHandlers}>
      <MetroPanorama tabs={WORKOUT_CONFIG} activeTab={currentTab} />
      <Animated.View style={[styles.contentContainer, { backgroundColor: colors.background }, animatedStyle]}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
            animation: 'none', // Desabilita animação padrão
          }}>
          {WORKOUT_CONFIG.map(workout => (
            <Tabs.Screen 
              key={workout.id}
              name={workout.id} 
              options={{ title: workout.title }} 
            />
          ))}
        </Tabs>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
