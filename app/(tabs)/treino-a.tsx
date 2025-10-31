import React from 'react';
import { WorkoutLayout } from '../../components/workout-layout';
import type { Exercise } from '../../types/exercise';

const EXERCISES: Exercise[] = [
  {
    id: 1,
    title: 'PUXADA MÁQUINA PEGADA PRONADA',
    sets: 6,
    reps: 10,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/6rxOh10Iukc?si=49oiYovL-9p3Kl_c',
    tip: null
  },
  {
    id: 2,
    title: 'REMADA MÁQUINA PEGADA SUPINADA',
    sets: 6,
    reps: 10,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/M8HNHkdDMjY?si=aLhq10OSCL60aGwn',
    tip: null
  },
  {
    id: 3,
    title: 'PUXADA MÁQUINA PEGADA NEUTRA',
    sets: 6,
    reps: 10,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/KblYMAmYKx0?si=4DHc1A_v81yjS_Tg',
    tip: null
  },
  {
    id: 4,
    title: 'TRÍCEPS POLIA PEGADA PRONADA',
    sets: 5,
    reps: 12,
    rest: "1'",
    video: 'https://youtube.com/shorts/Ckab-LPz8SA?si=NYq2Od8To8khRP4T',
    tip: '💡 Manter os cotovelos em posição fixa'
  },
  {
    id: 5,
    title: 'TRÍCEPS TESTA COM 2 HALTERES',
    sets: 5,
    reps: 12,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/nR6sPpg0wRU?si=KcXM1B_yKKpIMHl4',
    tip: null
  },
  {
    id: 6,
    title: 'ABDOMINAL SUPRA CURTO',
    sets: 6,
    reps: 30,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/WIwTarXu6Yk?si=7pWuREX5SUtTQh0Z',
    tip: '💡 Manter o abdomen contraído'
  }
];

export default function TreinoA() {
  console.log('💪 [TreinoA] Componente renderizado');
  return <WorkoutLayout exercises={EXERCISES} />;
}