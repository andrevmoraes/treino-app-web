import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemedView } from '../components/themed-view';
import { METRO_FONT_FAMILY, METRO_SPACING } from '../constants/metro-styles';
import { useAuth } from '../contexts/auth-context';
import { useTheme } from '../contexts/theme-context';

export default function Profile() {
  const { colors, accentColor } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    (router as any).replace('/login');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>perfil</Text>
      </View>

      <View style={styles.mainContent}>
        {user ? (
          <>
            <View style={styles.infoSection}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>E-MAIL</Text>
              <Text style={[styles.value, { color: colors.text }]}>{user.email}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>ID DO USUÁRIO</Text>
              <Text style={[styles.valueSmall, { color: colors.textSecondary }]}>{user.id}</Text>
            </View>

            <Pressable
              style={[styles.button, { backgroundColor: accentColor }]}
              onPress={handleSignOut}
            >
              <Text style={styles.buttonText}>sair</Text>
            </Pressable>
          </>
        ) : (
          <Text style={[styles.constructionText, { color: colors.textSecondary }]}>
            Nenhum usuário conectado
          </Text>
        )}
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
    paddingHorizontal: METRO_SPACING.lg,
    paddingTop: METRO_SPACING.xl,
  },
  infoSection: {
    marginBottom: METRO_SPACING.xl,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: METRO_FONT_FAMILY,
    marginBottom: METRO_SPACING.xs,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 24,
    fontWeight: '300',
    fontFamily: METRO_FONT_FAMILY,
  },
  valueSmall: {
    fontSize: 14,
    fontWeight: '300',
    fontFamily: METRO_FONT_FAMILY,
  },
  button: {
    width: '100%',
    paddingVertical: METRO_SPACING.md,
    paddingHorizontal: METRO_SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: METRO_SPACING.xl,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: METRO_FONT_FAMILY,
    fontWeight: '600',
    textTransform: 'lowercase',
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
