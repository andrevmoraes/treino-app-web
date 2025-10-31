import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemedView } from '../components/themed-view';
import { METRO_FONT_FAMILY, METRO_SPACING } from '../constants/metro-styles';
import { useTheme } from '../contexts/theme-context';

export default function Profile() {
  const { colors } = useTheme();

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>perfil</Text>
      </View>

      <View style={styles.mainContent}>
        <Text style={[styles.constructionText, { color: colors.textSecondary }]}>
          Em construção...
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Esta funcionalidade estará disponível em breve.
        </Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: METRO_SPACING.xl,
  },
  constructionText: {
    fontSize: 32,
    fontWeight: '300',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
    marginBottom: METRO_SPACING.lg,
  },
  description: {
    fontSize: 15,
    fontWeight: '300',
    fontFamily: METRO_FONT_FAMILY,
    textAlign: 'center',
    lineHeight: 22,
  },
});
