import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ThemedView style={styles.container}>
          <View style={styles.content}>
            <ThemedText style={styles.title}>Ops, algo deu errado</ThemedText>
            <ThemedText style={styles.message}>
              Desculpe pelo inconveniente. Por favor, tente novamente.
            </ThemedText>
          </View>
        </ThemedView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '200',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});