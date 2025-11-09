import type {
    CreateExerciseInput,
    CreateProgressInput,
    CreateStudentInput,
    CreateWorkoutInput,
    Exercise,
    Professor,
    Student,
    StudentWithWorkouts,
    Workout,
    WorkoutProgress,
    WorkoutWithExercises,
} from '@/types/database';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// STUDENT QUERIES
// ============================================

/**
 * Busca aluno por telefone (para login)
 */
export async function getStudentByPhone(phone: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('phone', phone)
    .eq('active', true)
    .limit(1);

  // Retorna o primeiro resultado ou null
  return { data: data && data.length > 0 ? (data[0] as Student) : null, error };
}

/**
 * Busca aluno por ID com seus treinos
 */
export async function getStudentWithWorkouts(studentId: string) {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      workouts:workouts(
        *,
        exercises:exercises(*)
      )
    `)
    .eq('id', studentId)
    .eq('active', true)
    .single();

  return { data: data as StudentWithWorkouts | null, error };
}

/**
 * Lista todos os alunos de um professor
 */
export async function getStudentsByProfessor(professorId: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('professor_id', professorId)
    .order('name');

  return { data: data as Student[] | null, error };
}

/**
 * Cria novo aluno
 */
export async function createStudent(input: CreateStudentInput) {
  const { data, error } = await supabase
    .from('students')
    .insert(input)
    .select()
    .single();

  return { data: data as Student | null, error };
}

/**
 * Atualiza aluno
 */
export async function updateStudent(studentId: string, updates: Partial<Student>) {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', studentId)
    .select()
    .single();

  return { data: data as Student | null, error };
}

/**
 * Desativa aluno (soft delete)
 */
export async function deactivateStudent(studentId: string) {
  return updateStudent(studentId, { active: false });
}

// ============================================
// WORKOUT QUERIES
// ============================================

/**
 * Busca treinos de um aluno
 */
export async function getWorkoutsByStudent(studentId: string) {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('student_id', studentId)
    .eq('active', true)
    .order('order_index');

  return { data: data as Workout[] | null, error };
}

/**
 * Busca treino por ID com exercícios
 */
export async function getWorkoutWithExercises(workoutId: string) {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      exercises:exercises(*)
    `)
    .eq('id', workoutId)
    .order('exercises(order_index)')
    .single();

  return { data: data as WorkoutWithExercises | null, error };
}

/**
 * Cria novo treino
 */
export async function createWorkout(input: CreateWorkoutInput) {
  const { data, error } = await supabase
    .from('workouts')
    .insert(input)
    .select()
    .single();

  return { data: data as Workout | null, error };
}

/**
 * Atualiza treino
 */
export async function updateWorkout(workoutId: string, updates: Partial<Workout>) {
  const { data, error } = await supabase
    .from('workouts')
    .update(updates)
    .eq('id', workoutId)
    .select()
    .single();

  return { data: data as Workout | null, error };
}

/**
 * Deleta treino
 */
export async function deleteWorkout(workoutId: string) {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId);

  return { error };
}

// ============================================
// EXERCISE QUERIES
// ============================================

/**
 * Busca exercícios de um treino
 */
export async function getExercisesByWorkout(workoutId: string) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('workout_id', workoutId)
    .order('order_index');

  return { data: data as Exercise[] | null, error };
}

/**
 * Cria novo exercício
 */
export async function createExercise(input: CreateExerciseInput) {
  const { data, error } = await supabase
    .from('exercises')
    .insert(input)
    .select()
    .single();

  return { data: data as Exercise | null, error };
}

/**
 * Atualiza exercício
 */
export async function updateExercise(exerciseId: string, updates: Partial<Exercise>) {
  const { data, error } = await supabase
    .from('exercises')
    .update(updates)
    .eq('id', exerciseId)
    .select()
    .single();

  return { data: data as Exercise | null, error };
}

/**
 * Deleta exercício
 */
export async function deleteExercise(exerciseId: string) {
  const { error } = await supabase
    .from('exercises')
    .delete()
    .eq('id', exerciseId);

  return { error };
}

/**
 * Cria múltiplos exercícios de uma vez
 */
export async function createExercisesBatch(exercises: CreateExerciseInput[]) {
  const { data, error } = await supabase
    .from('exercises')
    .insert(exercises)
    .select();

  return { data: data as Exercise[] | null, error };
}

// ============================================
// PROGRESS QUERIES
// ============================================

/**
 * Salva progresso de um exercício
 */
export async function saveProgress(input: CreateProgressInput) {
  const { data, error } = await supabase
    .from('workout_progress')
    .insert(input)
    .select()
    .single();

  return { data: data as WorkoutProgress | null, error };
}

/**
 * Busca progresso de um aluno
 */
export async function getStudentProgress(studentId: string, limit = 50) {
  const { data, error } = await supabase
    .from('workout_progress')
    .select(`
      *,
      workout:workouts(name, description),
      exercise:exercises(title, sets, reps)
    `)
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  return { data, error };
}

/**
 * Busca último progresso de um exercício
 */
export async function getLastExerciseProgress(studentId: string, exerciseId: string) {
  const { data, error } = await supabase
    .from('workout_progress')
    .select('*')
    .eq('student_id', studentId)
    .eq('exercise_id', exerciseId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single();

  return { data: data as WorkoutProgress | null, error };
}

// ============================================
// PROFESSOR QUERIES
// ============================================

/**
 * Busca professor por email (para login)
 */
export async function getProfessorByEmail(email: string) {
  const { data, error } = await supabase
    .from('professors')
    .select('*')
    .eq('email', email)
    .eq('active', true)
    .single();

  return { data: data as Professor | null, error };
}

/**
 * Atualiza professor
 */
export async function updateProfessor(professorId: string, updates: Partial<Professor>) {
  const { data, error } = await supabase
    .from('professors')
    .update(updates)
    .eq('id', professorId)
    .select()
    .single();

  return { data: data as Professor | null, error };
}

// ============================================
// STATS & ANALYTICS
// ============================================

/**
 * Estatísticas do aluno
 */
export async function getStudentStats(studentId: string) {
  // Contar treinos
  const { count: totalWorkouts } = await supabase
    .from('workouts')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('active', true);

  // Contar exercícios
  const { count: totalExercises } = await supabase
    .from('exercises')
    .select('*, workouts!inner(*)', { count: 'exact', head: true })
    .eq('workouts.student_id', studentId);

  // Último treino
  const { data: lastProgress } = await supabase
    .from('workout_progress')
    .select('completed_at')
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single();

  return {
    total_workouts: totalWorkouts || 0,
    total_exercises: totalExercises || 0,
    last_workout_date: lastProgress?.completed_at || null,
  };
}

/**
 * Dashboard do professor
 */
export async function getProfessorDashboardStats(professorId: string) {
  // Total de alunos
  const { count: totalStudents } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('professor_id', professorId);

  // Alunos ativos
  const { count: activeStudents } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('professor_id', professorId)
    .eq('active', true);

  // Treinos criados
  const { count: totalWorkouts } = await supabase
    .from('workouts')
    .select('*, students!inner(*)', { count: 'exact', head: true })
    .eq('students.professor_id', professorId);

  return {
    total_students: totalStudents || 0,
    active_students: activeStudents || 0,
    total_workouts: totalWorkouts || 0,
  };
}
