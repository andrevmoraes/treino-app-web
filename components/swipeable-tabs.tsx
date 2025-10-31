import { useRouter } from 'expo-router';
import React, { PropsWithChildren, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';

const SWIPE_THRESHOLD = 50;

interface Props extends PropsWithChildren {
  tabs: string[];
  currentTab: string;
}

export function SwipeableTabs({ children, tabs, currentTab }: Props) {
  const router = useRouter();
  const currentIndex = tabs.indexOf(currentTab);

  const handleSwipeLeft = useCallback(() => {
    if (currentIndex < tabs.length - 1) {
      router.replace(`/(tabs)/${tabs[currentIndex + 1]}` as any);
    }
  }, [currentIndex, tabs, router]);

  const handleSwipeRight = useCallback(() => {
    if (currentIndex > 0) {
      router.replace(`/(tabs)/${tabs[currentIndex - 1]}` as any);
    }
  }, [currentIndex, tabs, router]);

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onEnd((event) => {
      if (Math.abs(event.velocityX) < 10) return;
      
      if (event.translationX < -SWIPE_THRESHOLD && event.velocityX < 0) {
        handleSwipeLeft();
      } else if (event.translationX > SWIPE_THRESHOLD && event.velocityX > 0) {
        handleSwipeRight();
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View 
        style={styles.container}
        entering={FadeIn}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});