require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Usar Service Role Key para bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Dados hardcoded para migrar
const WORKOUTS_DATA = {
  'treino-a': {
    name: 'Treino A',
    description: 'Costas e Tríceps',
    color: '#0078D7', // Metro Blue
    order_index: 0,
    exercises: [
      { title: 'Barra fixa', sets: 4, reps: 12, rest: '90s', order_index: 0 },
      { title: 'Remada curvada', sets: 4, reps: 12, rest: '90s', order_index: 1 },
      { title: 'Pulldown', sets: 3, reps: 15, rest: '60s', order_index: 2 },
      { title: 'Remada unilateral', sets: 3, reps: 12, rest: '60s', order_index: 3 },
      { title: 'Tríceps testa', sets: 3, reps: 12, rest: '60s', order_index: 4 },
      { title: 'Tríceps corda', sets: 3, reps: 15, rest: '60s', order_index: 5 },
    ],
  },
  'treino-b': {
    name: 'Treino B',
    description: 'Ombros',
    color: '#00B7C3', // Metro Cyan
    order_index: 1,
    exercises: [
      { title: 'Desenvolvimento', sets: 4, reps: 12, rest: '90s', order_index: 0 },
      { title: 'Elevação lateral', sets: 4, reps: 15, rest: '60s', order_index: 1 },
      { title: 'Elevação frontal', sets: 3, reps: 15, rest: '60s', order_index: 2 },
    ],
  },
  'treino-c': {
    name: 'Treino C',
    description: 'Peito e Bíceps',
    color: '#E74856', // Metro Red
    order_index: 2,
    exercises: [
      { title: 'Supino reto', sets: 4, reps: 12, rest: '90s', order_index: 0 },
      { title: 'Supino inclinado', sets: 4, reps: 12, rest: '90s', order_index: 1 },
      { title: 'Crucifixo', sets: 3, reps: 15, rest: '60s', order_index: 2 },
      { title: 'Rosca direta', sets: 4, reps: 12, rest: '90s', order_index: 3 },
    ],
  },
  'treino-d': {
    name: 'Treino D',
    description: 'Pernas e Core',
    color: '#10893E', // Metro Green
    order_index: 3,
    exercises: [
      { title: 'Agachamento', sets: 4, reps: 12, rest: '2min', order_index: 0 },
      { title: 'Leg press', sets: 4, reps: 12, rest: '90s', order_index: 1 },
      { title: 'Cadeira extensora', sets: 3, reps: 15, rest: '60s', order_index: 2 },
      { title: 'Flexora', sets: 3, reps: 15, rest: '60s', order_index: 3 },
    ],
  },
};

async function migrateWorkouts() {
  console.log('\n🚀 Iniciando migração de treinos...\n');

  // 1. Buscar todos os alunos
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, name, phone')
    .eq('active', true);

  if (studentsError) {
    console.error('❌ Erro ao buscar alunos:', studentsError);
    return;
  }

  if (!students || students.length === 0) {
    console.log('⚠️  Nenhum aluno encontrado. Cadastre alunos primeiro!');
    return;
  }

  console.log(`✅ Encontrados ${students.length} aluno(s)\n`);

  // 2. Para cada aluno, criar os 4 treinos
  for (const student of students) {
    console.log(`📝 Migrando treinos para: ${student.name} (${student.phone})`);

    for (const [workoutKey, workoutData] of Object.entries(WORKOUTS_DATA)) {
      // Verificar se o treino já existe
      const { data: existingWorkout } = await supabase
        .from('workouts')
        .select('id')
        .eq('student_id', student.id)
        .eq('name', workoutData.name)
        .single();

      if (existingWorkout) {
        console.log(`   ⏭️  ${workoutData.name} já existe, pulando...`);
        continue;
      }

      // Criar treino
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          student_id: student.id,
          name: workoutData.name,
          description: workoutData.description,
          color: workoutData.color,
          order_index: workoutData.order_index,
        })
        .select()
        .single();

      if (workoutError) {
        console.error(`   ❌ Erro ao criar ${workoutData.name}:`, workoutError);
        continue;
      }

      console.log(`   ✅ ${workoutData.name} criado`);

      // Criar exercícios do treino
      const exercisesToInsert = workoutData.exercises.map((ex) => ({
        workout_id: workout.id,
        title: ex.title,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        order_index: ex.order_index,
      }));

      const { error: exercisesError } = await supabase
        .from('exercises')
        .insert(exercisesToInsert);

      if (exercisesError) {
        console.error(`   ❌ Erro ao criar exercícios:`, exercisesError);
        continue;
      }

      console.log(`   ✅ ${exercisesToInsert.length} exercícios adicionados\n`);
    }
  }

  console.log('🎉 Migração concluída!\n');

  // 3. Mostrar resumo
  const { count: workoutsCount } = await supabase
    .from('workouts')
    .select('*', { count: 'exact', head: true });

  const { count: exercisesCount } = await supabase
    .from('exercises')
    .select('*', { count: 'exact', head: true });

  console.log('📊 Resumo:');
  console.log(`   Alunos: ${students.length}`);
  console.log(`   Treinos: ${workoutsCount}`);
  console.log(`   Exercícios: ${exercisesCount}\n`);
}

// Executar migração
migrateWorkouts().catch(console.error);
