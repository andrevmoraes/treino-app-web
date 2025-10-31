import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { ErrorBoundary } from '../components/error-boundary';
import { ThemeProvider as CustomThemeProvider } from '../contexts/theme-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContent: {
    flex: 1,
  },
});

export default function RootLayout() {
  console.log('🚀 [RootLayout] Inicializando aplicação');
  console.log('🎨 [RootLayout] Tema: DarkTheme');

  return (
    <View style={styles.container}>
      <ErrorBoundary>
        <CustomThemeProvider>
          <GestureHandlerRootView style={styles.container}>
            <ThemeProvider value={DarkTheme}>
            <Stack
              screenOptions={{
                contentStyle: styles.stackContent
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </GestureHandlerRootView>
        </CustomThemeProvider>
      </ErrorBoundary>
    </View>
  );
}