'use client';

import { MetroButton, MetroHeader, MetroLoading } from '@/components/metro-ui';
import WorkoutModal from '@/components/workout-modal';
import { MetroColors, ThemeColors } from '@/constants/metro-design-system';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Student {
  id: string;
  name: string;
  phone: string;
  active: boolean;
  created_at: string;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  const { professor } = useAdminAuth();
  const { colorScheme } = useTheme();

  const [student, setStudent] = useState<Student | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (!professor) {
      router.push('/admin/login');
      return;
    }

    loadStudentData();
  }, [professor, studentId, router]);

  const loadStudentData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar dados do aluno
      const studentsResponse = await fetch(`/api/students/list?professor_id=${professor?.id}`);
      const studentsResult = await studentsResponse.json();

      if (!studentsResponse.ok) {
        throw new Error(studentsResult.error || 'Erro ao carregar aluno');
      }

      const studentData = studentsResult.data?.find((s: Student) => s.id === studentId);
      
      if (!studentData) {
        throw new Error('Aluno não encontrado');
      }

      setStudent(studentData);

      // Buscar treinos do aluno
      const workoutsResponse = await fetch(`/api/workouts/list?student_id=${studentId}`);
      const workoutsResult = await workoutsResponse.json();

      if (!workoutsResponse.ok) {
        throw new Error(workoutsResult.error || 'Erro ao carregar treinos');
      }

      setWorkouts(workoutsResult.data || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkout = () => {
    setSelectedWorkout(null);
    setShowWorkoutModal(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutModal(true);
  };

  const handleDeleteWorkout = async (workoutId: string, workoutName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o treino "${workoutName}"?\n\nEsta ação não pode ser desfeita e todos os exercícios serão deletados.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/workouts/delete?workout_id=${workoutId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao deletar treino');
      }

      // Recarregar lista de treinos
      await loadStudentData();
    } catch (err) {
      console.error('Erro ao deletar treino:', err);
      alert(`Erro ao deletar treino: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  const handleWorkoutSuccess = async () => {
    setShowWorkoutModal(false);
    setSelectedWorkout(null);
    await loadStudentData();
  };

  const themeColors = ThemeColors[colorScheme];

  if (isLoading) {
    return <MetroLoading fullScreen />;
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4" style={{ backgroundColor: themeColors.background }}>
        <span className="text-6xl">❌</span>
        <p className="font-segoe text-lg" style={{ color: themeColors.text }}>
          {error || 'Aluno não encontrado'}
        </p>
        <MetroButton
          onClick={() => router.push('/admin/dashboard')}
          variant="primary"
          accentColor={MetroColors.blue}
        >
          ← voltar ao dashboard
        </MetroButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      {/* Header */}
      <MetroHeader
        title={student.name}
        subtitle={`📱 ${student.phone} • ${student.active ? '✓ Ativo' : '✗ Inativo'} • Cadastrado em ${new Date(student.created_at).toLocaleDateString('pt-BR')}`}
        onBack={() => router.push('/admin/dashboard')}
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Info Card */}
        <div className="rounded-sm border p-8 mb-8" style={{ 
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border 
        }}>
          <div className="flex items-center gap-6">
            <div 
              className="w-20 h-20 rounded-sm flex items-center justify-center text-white font-bold text-3xl"
              style={{ backgroundColor: MetroColors.blue }}
            >
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="font-segoe text-2xl font-light lowercase mb-2" style={{ color: themeColors.text }}>
                {student.name}
              </h2>
              <div className="flex items-center gap-4 font-segoe text-sm" style={{ color: themeColors.textSecondary }}>
                <span>📱 {student.phone}</span>
                <span>•</span>
                <span style={{ 
                  color: student.active ? MetroColors.green : MetroColors.red,
                  fontWeight: 600 
                }}>
                  {student.active ? '✓ Ativo' : '✗ Inativo'}
                </span>
                <span>•</span>
                <span>Cadastrado em {new Date(student.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workouts Section */}
        <div className="rounded-sm border" style={{ 
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border 
        }}>
          <div className="p-6 border-b" style={{ borderColor: themeColors.border }}>
            <div className="flex items-center justify-between">
              <h2 className="font-segoe text-xl lowercase" style={{ color: themeColors.text }}>
                🏋️ treinos
              </h2>
              <MetroButton
                onClick={handleCreateWorkout}
                variant="primary"
                accentColor={MetroColors.green}
              >
                ➕ novo treino
              </MetroButton>
            </div>
          </div>

          <div className="p-6">
            {workouts.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📭</span>
                <p className="font-segoe text-lg mb-6 lowercase" style={{ color: themeColors.textSecondary }}>
                  nenhum treino cadastrado para este aluno
                </p>
                <MetroButton
                  onClick={handleCreateWorkout}
                  variant="primary"
                  accentColor={MetroColors.blue}
                >
                  criar primeiro treino
                </MetroButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="border-2 rounded-sm p-6 hover:opacity-80 transition-opacity"
                    style={{ borderColor: themeColors.border }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: workout.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-segoe text-lg font-semibold mb-1 truncate" style={{ color: themeColors.text }}>
                          {workout.name}
                        </h3>
                        <p className="font-segoe text-sm line-clamp-2" style={{ color: themeColors.textSecondary }}>
                          {workout.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <MetroButton
                        onClick={() => router.push(`/admin/workouts/${workout.id}/exercises`)}
                        variant="primary"
                        accentColor={MetroColors.blue}
                        fullWidth
                        size="sm"
                      >
                        📋 gerenciar exercícios
                      </MetroButton>
                      <div className="flex gap-2">
                        <MetroButton
                          onClick={() => handleEditWorkout(workout)}
                          variant="secondary"
                          fullWidth
                          size="sm"
                        >
                          ✏️ editar
                        </MetroButton>
                        <MetroButton
                          onClick={() => handleDeleteWorkout(workout.id, workout.name)}
                          variant="danger"
                          fullWidth
                          size="sm"
                        >
                          🗑️ excluir
                        </MetroButton>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t font-segoe text-xs" style={{ 
                      borderColor: themeColors.border,
                      color: themeColors.textTertiary 
                    }}>
                      Criado em {new Date(workout.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Workout Modal */}
      <WorkoutModal
        isOpen={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        onSuccess={handleWorkoutSuccess}
        studentId={studentId}
        workout={selectedWorkout}
      />
    </div>
  );
}
