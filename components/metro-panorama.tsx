import { useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/theme-context';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TITLE_MARGIN = 28;
const BASE_FONT_SIZE = Math.max(60, Math.min(96, SCREEN_WIDTH * 0.22));
const PANORAMA_TOP_PADDING = 40;
const PANORAMA_BOTTOM_PADDING = 12;
const TAB_HEIGHT = BASE_FONT_SIZE + 20;
export const METRO_PANORAMA_HEIGHT = PANORAMA_TOP_PADDING + TAB_HEIGHT + PANORAMA_BOTTOM_PADDING;

interface Tab {
  id: string;
  title: string;
  subtitle?: string;
}

interface Props {
  tabs: readonly Tab[];
  activeTab: string;
}

const TabButton = memo(({ tab, isActive, onPress, textColor }: { tab: Tab; isActive: boolean; onPress: (id: string) => void; textColor: string }) => (
  <Pressable
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
        { color: textColor },
        isActive && styles.activeTabTitle
      ]}
    >
      {tab.title}
    </ThemedText>
  </Pressable>
));

TabButton.displayName = 'TabButton';

export function MetroPanorama({ tabs, activeTab }: Props) {
  const router = useRouter();
  const { colors } = useTheme();
  const scrollViewRef = React.useRef<ScrollView>(null);

  console.log('🎭 [MetroPanorama] Renderizando com tab ativa:', activeTab);
  console.log('📑 [MetroPanorama] Total de tabs:', tabs.length);

  const handleTabPress = useCallback((tabId: string) => {
    console.log('🖱️ [MetroPanorama] Tab clicada:', tabId);
    router.replace(`/(tabs)/${tabId}` as any);
  }, [router]);

  const tabRefs = React.useRef<{ [key: string]: View | null }>({});

  const scrollToActiveTab = useCallback(() => {
    const activeTabRef = tabRefs.current[activeTab];
    if (!activeTabRef || !scrollViewRef.current) {
      return;
    }

    activeTabRef.measureLayout(
      scrollViewRef.current as any,
      (x) => {
        // Scroll para posicionar a aba ativa na margem esquerda
        scrollViewRef.current?.scrollTo({ x: x - TITLE_MARGIN, animated: false });
      },
      () => console.log('⚠️ [MetroPanorama] Erro ao medir layout')
    );
  }, [activeTab]);

  React.useEffect(() => {
    console.log('⚡ [MetroPanorama] useEffect disparado - activeTab:', activeTab);
    
    // Espera o layout estar completo
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToActiveTab();
      });
    });
  }, [activeTab, scrollToActiveTab]);

  return (
    <ThemedView style={styles.container} accessibilityRole="tablist" accessibilityLabel="Lista de treinos">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        scrollEnabled={false}
        scrollEventThrottle={16}
      >
        {tabs.map((tab, index) => (
          <View 
            key={tab.id} 
            ref={(ref) => { tabRefs.current[tab.id] = ref; }}
            style={styles.tabWrapper}
          >
            <TabButton
              tab={tab}
              isActive={tab.id === activeTab}
              onPress={handleTabPress}
              textColor={colors.text}
            />
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: PANORAMA_TOP_PADDING,
    paddingBottom: PANORAMA_BOTTOM_PADDING,
    height: METRO_PANORAMA_HEIGHT,
  },
  scrollContent: {
    paddingLeft: TITLE_MARGIN,
    paddingRight: TITLE_MARGIN,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16, // Espaçamento entre as abas (como um espaço)
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 0,
  },
  tabWrapper: {
    // Sem largura fixa - cada aba tem seu tamanho natural baseado no texto
  },
  tabContainer: {
    height: TAB_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  activeTab: {
    opacity: 1,
  },
  tabTitle: {
    fontSize: BASE_FONT_SIZE,
    fontFamily: Platform.select({
      web: '"Segoe UI Light", system-ui, Roboto, Arial, sans-serif',
      ios: 'System',
      android: 'sans-serif-light',
      default: 'System',
    }),
    fontWeight: '200',
    opacity: 0.35,
    lineHeight: BASE_FONT_SIZE + 4,
    letterSpacing: -2,
    textTransform: 'lowercase',
  },
  activeTabTitle: {
    opacity: 1,
  },
});
