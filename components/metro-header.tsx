import { Link, usePathname } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/use-theme-color';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

const TABS = [
  { name: 'treino-a', title: 'Treino A' },
  { name: 'treino-b', title: 'Treino B' },
  { name: 'treino-c', title: 'Treino C' },
  { name: 'treino-d', title: 'Treino D' }
] as const;

export function MetroHeader() {
  const pathname = usePathname();
  const activeColor = useThemeColor({}, "tint");

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.header}
        contentContainerStyle={styles.headerContent}
        scrollEventThrottle={16}
      >
        {TABS.map((tab) => {
          const isActive = pathname.includes(tab.name);
          return (
            <Link 
              key={tab.name} 
              href={`/(tabs)/${tab.name}`} 
              asChild
            >
              <Pressable style={styles.tabContainer}>
                <ThemedText style={[
                  styles.tabText,
                  isActive && { color: activeColor }
                ]} numberOfLines={1}>
                  {tab.title}
                </ThemedText>
                {isActive && (
                  <ThemedView 
                    style={[
                      styles.indicator,
                      { backgroundColor: activeColor }
                    ]} 
                  />
                )}
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    backgroundColor: '#000000',
  },
  header: {
    flexGrow: 0,
    minHeight: 120,
  },
  headerContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tabContainer: {
    flexDirection: 'column',
    marginRight: 30,
    minWidth: 250,
  },
  tabText: {
    fontSize: 42,
    fontWeight: '200',
    textTransform: 'uppercase',
  },
  indicator: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 2,
  },
});