import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { METRO_FONT_FAMILY } from '../constants/metro-styles';

interface CalendarTileProps {
  accentColor: string;
  customText?: string;
}

const MOTIVATIONAL_PHRASES = [
  'vamos treinar!',
  'bora malhar!',
  'hora do treino!',
  'foco total!',
  'é hoje!',
  'sem desculpas!',
  'stronger!',
];

export function CalendarTile({ accentColor, customText = 'Calendar' }: CalendarTileProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [motivationalPhrase, setMotivationalPhrase] = useState(MOTIVATIONAL_PHRASES[0]);
  const flipRotation = useSharedValue(0);

  useEffect(() => {
    // Atualiza a data a cada minuto
    const dateInterval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    // Flip a cada 8 segundos
    const flipInterval = setInterval(() => {
      // Anima o flip adicionando 180 graus
      flipRotation.value = withTiming(flipRotation.value + 180, { 
        duration: 600, 
        easing: Easing.inOut(Easing.cubic) 
      });
      
      // Troca a frase no meio da animação (300ms = metade de 600ms)
      setTimeout(() => {
        const randomPhrase = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
        setMotivationalPhrase(randomPhrase);
      }, 300);
    }, 8000);

    return () => {
      clearInterval(dateInterval);
      clearInterval(flipInterval);
    };
  }, [flipRotation]);

  const dayOfWeek = currentDate.toLocaleDateString('pt-BR', { weekday: 'short' });
  const dayOfMonth = currentDate.getDate();

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateX = flipRotation.value;
    const rotation = rotateX % 360;
    const isVisible = rotation < 90 || rotation > 270;
    
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX}deg` }
      ],
      opacity: isVisible ? 1 : 0,
      zIndex: isVisible ? 1 : 0,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    // Começa 180 graus atrás da frente
    const rotateX = flipRotation.value + 180;
    const rotation = rotateX % 360;
    const isVisible = rotation < 90 || rotation > 270;
    
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX}deg` },
      ],
      opacity: isVisible ? 1 : 0,
      zIndex: isVisible ? 1 : 0,
    };
  });

  return (
    <View style={styles.container}>
      {/* Front side - Calendário */}
      <Animated.View style={[styles.side, frontAnimatedStyle]}>
        <View style={[styles.sideBackground, { backgroundColor: accentColor }]}>
          <Text style={styles.topText}>{customText}</Text>
          <Text style={styles.dayNumber}>{dayOfMonth}</Text>
          <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        </View>
      </Animated.View>

      {/* Back side - Motivação */}
      <Animated.View style={[styles.side, styles.backSide, backAnimatedStyle]}>
        <View style={[styles.sideBackground, { backgroundColor: accentColor }]}>
          <View style={styles.motivationContainer}>
            <Text style={styles.motivationText}>{motivationalPhrase}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'visible',
  },
  side: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  sideBackground: {
    width: '100%',
    height: '100%',
    padding: 12,
    justifyContent: 'space-between',
  },
  backSide: {
    transform: [{ rotateY: '180deg' }],
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  topText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
  },
  dayNumber: {
    fontSize: 72,
    fontWeight: '200',
    color: '#FFFFFF',
    fontFamily: METRO_FONT_FAMILY,
    position: 'absolute',
    right: 12,
    bottom: 12,
    lineHeight: 72,
  },
  dayOfWeek: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'capitalize',
    alignSelf: 'flex-start',
  },
  motivationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    fontFamily: METRO_FONT_FAMILY,
    textTransform: 'lowercase',
    textAlign: 'center',
  },
});
