import React from 'react';
import { WorkoutLayout } from '../../components/workout-layout';
import type { Exercise } from '../../types/exercise';

const EXERCISES: Exercise[] = [
  {
    id: 1,
    title: 'AGACHAMENTO PESO CORPORAL',
    sets: 1,
    reps: 150,
    rest: "30\"",
    video: 'https://youtube.com/shorts/YECXftS7Hyc?si=rh004wPQEBuodeLB',
    tip: '💡 Descanso de 30" a cada falha'
  },
  {
    id: 2,
    title: 'AFUNDO',
    sets: 5,
    reps: 10,
    rest: "1'",
    video: 'https://youtube.com/shorts/WyWnS79bFRI?si=6M5brbTPE0TK7d28',
    tip: null
  },
  {
    id: 3,
    title: 'CADEIRA EXTENSORA',
    sets: 6,
    reps: 12,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/AIrlZ9s520w?si=u8ChmVhpKyr_ZyEu',
    tip: null
  },
  {
    id: 4,
    title: 'PRANCHA ISOMÉTRICA',
    sets: 6,
    reps: 0,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/ITXwX9bqWVg?si=Ra3rfBUc23EugFIg',
    tip: "💡 Manter por 1'"
  },
  {
    id: 5,
    title: 'ESCADA',
    sets: 1,
    reps: 0,
    rest: "-",
    video: '',
    tip: '💡 15 a 20 minutos'
  }
];

export default function TreinoD() {
  console.log('💪 [TreinoD] Componente renderizado');
  return <WorkoutLayout exercises={EXERCISES} />;
}