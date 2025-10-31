import React from 'react';
import { WorkoutLayout } from '../../components/workout-layout';
import type { Exercise } from '../../types/exercise';

const EXERCISES: Exercise[] = [
  {
    id: 1,
    title: 'SUPINO 45° COM HALTERES',
    sets: 5,
    reps: 12,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/fq_HfbTjL2Q?si=Aq3nIYB7dos4QNOU',
    tip: null
  },
  {
    id: 2,
    title: 'FLEXÃO',
    sets: 5,
    reps: 0,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/XZIejzKdAjo?si=HCCxHsEro2l_yYYI',
    tip: '💡 Fazer até a falha'
  },
  {
    id: 3,
    title: 'ROSCA DIRETA NO CROSS',
    sets: 5,
    reps: 10,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/Ksk2Khk7iEw?si=zoDukYCOhqrQx0Ux',
    tip: null
  },
  {
    id: 4,
    title: 'ROSCA MARTELO',
    sets: 5,
    reps: 10,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/vPZe359uMH0?si=vxHmSUnfnwtbSfGu',
    tip: null
  },
  {
    id: 5,
    title: 'ABDOMINAL SUPRA CURTO',
    sets: 6,
    reps: 30,
    rest: "1'30\"",
    video: 'https://youtube.com/shorts/WIwTarXu6Yk?si=4zVFH-g9nGXopFkJ',
    tip: '💡 Manter o abdomen contraído'
  }
];

export default function TreinoC() {
  console.log('💪 [TreinoC] Componente renderizado');
  return <WorkoutLayout exercises={EXERCISES} />;
}