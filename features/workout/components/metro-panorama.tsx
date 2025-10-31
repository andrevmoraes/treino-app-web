import { useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../../../components/themed-text';
import { ThemedView } from '../../../components/themed-view';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TITLE_MARGIN = 32;
const TITLE_WIDTH = SCREEN_WIDTH - TITLE_MARGIN * 2;

interface Tab {
  id: string;
  title: string;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
}

const TabButton = memo(({ 
  tab, 
  isActive, 
  onPress 
}: { 
  tab: Tab; 
  isActive: boolean; 
  onPress: (id: string) => void;
}) => (
  <Pressable
    key={tab.id}
    onPress={() => onPress(tab.id)}
    accessible
    accessibilityRole="tab"
    accessibilityLabel={`Aba ${tab.title}`}
    accessibilityState={{ selected: isActive }}
    style={({ pressed }) => [
      styles.tabContainer,
      isActive && styles.activeTab,
      { opacity: pressed ? 0.7 : 1 }
    ]}
  >
    <ThemedText 
      style={[
        styles.tabTitle,
        isActive && styles.activeTabTitle
      ]}
      accessibilityLiveRegion="polite"
    >
      {tab.title}
    </ThemedText>
  </Pressable>
));

TabButton.displayName = 'TabButton';

export const MetroPanorama = memo(({ tabs, activeTab }: Props) => {
  const router = useRouter();
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleTabPress = useCallback((tabId: string) => {
    router.replace(`/(tabs)/${tabId}` as any);
  }, [router]);

  // Scroll to active tab on mount and when activeTab changes
  React.useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (activeIndex !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: (TITLE_WIDTH + TITLE_MARGIN) * activeIndex,
        animated: true
      });
    }
  }, [activeTab, tabs]);

  return (
    <ThemedView 
      style={styles.container}
      accessibilityRole="tablist"
      accessibilityLabel="Lista de treinos"
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={TITLE_WIDTH + TITLE_MARGIN}
        accessibilityElementsHidden={false}
        importantForAccessibility="yes"
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTab}
            onPress={handleTabPress}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
});

MetroPanorama.displayName = 'MetroPanorama';

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    paddingBottom: 16,
    backgroundColor: '#000000',
    height: 210,
  },
  scrollContent: {
    paddingHorizontal: TITLE_MARGIN,
  },
  tabContainer: {
    width: TITLE_WIDTH,
    marginRight: TITLE_MARGIN,
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  activeTab: {
    opacity: 1,
  },
  tabTitle: {
    fontSize: 64,
    fontFamily: Platform.select({
      web: '"Segoe UI Light", system-ui, Roboto, Arial, sans-serif',
      ios: 'System',
      android: 'sans-serif-light',
      default: 'System',
    }),
    fontWeight: '200',
    color: '#FFFFFF',
    opacity: 0.35,
    lineHeight: 68,
    letterSpacing: -1.5,
    textTransform: 'lowercase',
  },
  activeTabTitle: {
    opacity: 1,
  },
});