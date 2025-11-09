// ============================================
// DATABASE TYPES - Auto-generated from schema
// ============================================

export interface Professor {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  phone: string;
  name: string;
  email?: string;
  professor_id: string;
  active: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  student_id: string;
  name: string;
  description: string;
  color: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  workout_id: string;
  title: string;
  sets: number;
  reps: number;
  rest: string;
  video?: string;
  tip?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutProgress {
  id: string;
  student_id: string;
  workout_id: string;
  exercise_id: string;
  completed_sets: boolean[];
  notes?: string;
  completed_at: string;
}

// ============================================
// VIEW TYPES
// ============================================

export interface WorkoutWithExerciseCount extends Workout {
  exercise_count: number;
  student_name: string;
  student_phone: string;
}

export interface RecentStudentProgress {
  student_id: string;
  student_name: string;
  workout_name: string;
  exercise_title: string;
  completed_sets: boolean[];
  completed_at: string;
  notes?: string;
}

// ============================================
// JOINED TYPES (Para queries complexas)
// ============================================

export interface WorkoutWithExercises extends Workout {
  exercises: Exercise[];
}

export interface StudentWithWorkouts extends Student {
  workouts: WorkoutWithExercises[];
}

export interface ExerciseWithProgress extends Exercise {
  progress?: WorkoutProgress[];
  last_completed?: string;
  completion_rate?: number;
}

// ============================================
// INPUT TYPES (Para forms e mutations)
// ============================================

export interface CreateStudentInput {
  phone: string;
  name: string;
  email?: string;
  professor_id: string;
}

export interface UpdateStudentInput {
  name?: string;
  email?: string;
  active?: boolean;
}

export interface CreateWorkoutInput {
  student_id: string;
  name: string;
  description: string;
  color?: string;
  order_index: number;
}

export interface UpdateWorkoutInput {
  name?: string;
  description?: string;
  color?: string;
  order_index?: number;
  active?: boolean;
}

export interface CreateExerciseInput {
  workout_id: string;
  title: string;
  sets: number;
  reps: number;
  rest: string;
  video?: string;
  tip?: string;
  order_index: number;
}

export interface UpdateExerciseInput {
  title?: string;
  sets?: number;
  reps?: number;
  rest?: string;
  video?: string;
  tip?: string;
  order_index?: number;
}

export interface CreateProgressInput {
  student_id: string;
  workout_id: string;
  exercise_id: string;
  completed_sets: boolean[];
  notes?: string;
}

// ============================================
// AUTH TYPES
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface StudentLoginCredentials {
  phone: string;
}

export interface AuthUser {
  id: string;
  type: 'professor' | 'student';
  name: string;
  email?: string;
  phone?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ============================================
// STATS TYPES (Para dashboard)
// ============================================

export interface StudentStats {
  student_id: string;
  total_workouts: number;
  total_exercises: number;
  completed_workouts: number;
  completion_rate: number;
  last_workout_date?: string;
  current_streak: number;
}

export interface ProfessorDashboardStats {
  total_students: number;
  active_students: number;
  total_workouts_created: number;
  total_exercises: number;
  workouts_completed_today: number;
  workouts_completed_week: number;
  most_active_students: {
    student_id: string;
    student_name: string;
    workout_count: number;
  }[];
}
