import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/theme-context';

export function BackButton() {
  const { colors } = useTheme();
  
  const handlePress = () => {
    console.log('🔙 [BackButton] Voltando para tela inicial');
    router.push('/');
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button, 
        { borderColor: colors.text },
        pressed && { backgroundColor: colors.backgroundSecondary }
      ]}
      onPress={handlePress}
    >
      <Ionicons name="arrow-back" size={22} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginTop: 48,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
});