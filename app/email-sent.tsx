import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemedView } from '../components/themed-view';
import { METRO_FONT_FAMILY, METRO_SPACING } from '../constants/metro-styles';
import { useTheme } from '../contexts/theme-context';

export default function EmailSent() {
  const { accentColor, colors } = useTheme();

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.icon, { color: accentColor }]}>✓</Text>
        <Text style={[styles.title, { color: colors.text }]}>email enviado</Text>
        
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          Enviamos um link de confirmação para seu email.
        </Text>
        
        <Text style={[styles.submessage, { color: colors.textSecondary }]}>
          Verifique sua caixa de entrada (e spam) e clique no link para ativar sua conta.
        </Text>

        <Pressable
          style={[styles.button, { backgroundColor: accentColor }]}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.buttonText}>ir para login</Text>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: METRO_SPACING.lg,
    paddingTop: 100,
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    fontWeight: '300',
    marginBottom: METRO_SPACING.xl,
  },
  title: {
    fontSize: 42,
    fontFamily: METRO_FONT_FAMILY,
    fontWeight: '300',
    marginBottom: METRO_SPACING.xl,
    textAlign: 'center',
  },
  message: {
    fontSize: 20,
    fontFamily: METRO_FONT_FAMILY,
    textAlign: 'center',
    marginBottom: METRO_SPACING.md,
    lineHeight: 28,
  },
  submessage: {
    fontSize: 16,
    fontFamily: METRO_FONT_FAMILY,
    textAlign: 'center',
    marginBottom: METRO_SPACING.xl * 2,
    lineHeight: 24,
    opacity: 0.7,
  },
  button: {
    width: '100%',
    paddingVertical: METRO_SPACING.md,
    paddingHorizontal: METRO_SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: METRO_FONT_FAMILY,
    fontWeight: '600',
    textTransform: 'lowercase',
  },
});
