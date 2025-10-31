import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useThemeColor } from "../hooks/use-theme-color";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

type WorkoutTileProps = {
  title: string;
  subtitle: string;
  href: "/(tabs)/treino-a" | "/(tabs)/treino-b" | "/(tabs)/treino-c" | "/(tabs)/treino-d";
  size?: "large" | "medium";
  color?: string;
};

export function WorkoutTile({ 
  title, 
  subtitle, 
  href, 
  size = "medium",
  color: customColor 
}: WorkoutTileProps) {
  const tileBackground = useThemeColor({}, "tint");
  const color = customColor || tileBackground;

  return (
    <Link href={href} asChild>
      <Pressable>
        <ThemedView
          style={[
            styles.tile,
            size === "large" ? styles.tileLarge : styles.tileMedium,
            { backgroundColor: color }
          ]}
        >
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  tile: {
    padding: 20,
    margin: 4,
    borderRadius: 4,
  },
  tileMedium: {
    width: 160,
    height: 160,
  },
  tileLarge: {
    width: 328,
    height: 160,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
});