import React from 'react';
import { WorkoutLayout } from '../../components/workout-layout';
import type { Exercise } from '../../types/exercise';

const EXERCISES: Exercise[] = [
  {
    id: 1,
    title: 'ELEVAÇÃO LATERAL',
    sets: 5,
    reps: 15,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/7r0zGcnb1oI?si=C1A2H_pxN-lgF77K',
    tip: ' 2x15 + 3x8 - Ajustar a carga de acordo com a quantidade'
  },
  {
    id: 2,
    title: 'ELEVAÇÃO FRONTAL PEGADA PRONADA',
    sets: 5,
    reps: 15,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/owmd9zhkPco?si=8TuOemGEuh265RdA',
    tip: ' 2x15 + 3x8 - Ajustar a carga de acordo com a quantidade'
  },
  {
    id: 3,
    title: 'DESENVOLVIMENTO COM HALTERES',
    sets: 5,
    reps: 10,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/WjIEqeynQQU?si=LKU6hA0ZnKQrtc7h',
    tip: null
  },
  {
    id: 4,
    title: 'CADEIRA ABDUTORA TRADICIONAL',
    sets: 6,
    reps: 15,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/MW7O01AnYu8?si=8SYbJvn7Djy7tcpT',
    tip: null
  },
  {
    id: 5,
    title: 'CADEIRA FLEXORA',
    sets: 6,
    reps: 12,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/a2TYK_mTW-I?si=JkWrC0NdMbkbIEWF',
    tip: null
  },
  {
    id: 6,
    title: 'PANTURRILHA NA MÁQUINA',
    sets: 5,
    reps: 15,
    rest: "1'30\"",
    video: '',
    tip: null
  }
];

export default function TreinoB() {
  console.log('💪 [TreinoB] Componente renderizado');
  return <WorkoutLayout exercises={EXERCISES} />;
}
