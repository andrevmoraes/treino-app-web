import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThemedView } from '../components/themed-view';
import { METRO_FONT_FAMILY, METRO_SPACING } from '../constants/metro-styles';
import { useAuth } from '../contexts/auth-context';
import { useTheme } from '../contexts/theme-context';

export default function SignUp() {
  const { signUp } = useAuth();
  const { accentColor, colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Erro ao criar conta', error.message);
    } else {
      (router as any).replace('/email-sent');
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>criar conta</Text>
        
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>E-MAIL</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.text, color: colors.text }]}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>SENHA</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.text, color: colors.text }]}
            value={password}
            onChangeText={setPassword}
            placeholder="mínimo 6 caracteres"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            editable={!loading}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>CONFIRMAR SENHA</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.text, color: colors.text }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="repita sua senha"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            editable={!loading}
          />

          <Pressable
            style={[styles.button, { backgroundColor: accentColor }]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'criando...' : 'criar conta'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.linkButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={[styles.linkText, { color: accentColor }]}>
              já tenho conta
            </Text>
          </Pressable>
        </View>
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
    paddingTop: 80,
  },
  title: {
    fontSize: 48,
    fontWeight: '200',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 2,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: METRO_FONT_FAMILY,
  },
  button: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
  },
  linkButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
  },
});
