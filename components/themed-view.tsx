import { View, type ViewProps } from 'react-native';
import { useTheme } from '../contexts/theme-context';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, pointerEvents, ...otherProps }: ThemedViewProps) {
  const { colors } = useTheme();
  const backgroundColor = colors.background;

  return (
    <View
      style={[{ backgroundColor }, style]}
      pointerEvents={pointerEvents}
      {...otherProps}
    />
  );
}
