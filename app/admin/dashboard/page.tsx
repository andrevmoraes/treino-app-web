'use client';

import { MetroHeader, MetroLoading, MetroStatsCard } from '@/components/metro-ui';
import NewStudentModal from '@/components/new-student-modal';
import { MetroColors, ThemeColors } from '@/constants/metro-design-system';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useTheme } from '@/contexts/theme-context';
import { supabase } from '@/lib/database';
import type { ProfessorDashboardStats, Student } from '@/types/database';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { professor, signOut } = useAdminAuth();
  const { colorScheme } = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<ProfessorDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewStudentModal, setShowNewStudentModal] = useState(false);

  useEffect(() => {
    if (!professor) {
      router.push('/admin/login');
      return;
    }

    loadData();
  }, [professor, router]);

  const loadData = async () => {
    try {
      // Carregar alunos via API
      const studentsResponse = await fetch(`/api/students/list?professor_id=${professor?.id}`);
      const studentsResult = await studentsResponse.json();

      if (!studentsResponse.ok || studentsResult.error) {
        throw new Error(studentsResult.error || 'Erro ao carregar alunos');
      }

      const studentsData = studentsResult.data || [];
      setStudents(studentsData);

      // Carregar estatísticas
      const { data: workoutsCount } = await supabase
        .from('workouts')
        .select('id', { count: 'exact', head: true })
        .in('student_id', studentsData.map((s: any) => s.id) || []);

      const { data: exercisesCount } = await supabase
        .from('exercises')
        .select('id', { count: 'exact', head: true });

      setStats({
        total_students: studentsData.length || 0,
        active_students: studentsData.filter((s: Student) => s.active).length || 0,
        total_workouts_created: (workoutsCount as any)?.count || 0,
        total_exercises: (exercisesCount as any)?.count || 0,
        workouts_completed_today: 0,
        workouts_completed_week: 0,
        most_active_students: [],
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const themeColors = ThemeColors[colorScheme];

  if (isLoading) {
    return <MetroLoading fullScreen />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      {/* Header Metro */}
      <MetroHeader
        title="dashboard"
        subtitle={professor?.name}
        actionLabel="sair"
        onAction={handleSignOut}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards - Metro Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <MetroStatsCard
            value={stats?.total_students || 0}
            label="alunos"
            color={MetroColors.blue}
          />
          
          <MetroStatsCard
            value={stats?.active_students || 0}
            label="ativos"
            color={MetroColors.green}
          />
          
          <MetroStatsCard
            value={stats?.total_workouts_created || 0}
            label="treinos"
            color={MetroColors.purple}
          />
          
          <MetroStatsCard
            value={stats?.total_exercises || 0}
            label="exercícios"
            color={MetroColors.orange}
          />
        </div>

        {/* Students List - Metro Style */}
        <div style={{ 
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border 
        }} className="rounded-sm border">
          <div className="p-6 border-b" style={{ borderColor: themeColors.border }}>
            <div className="flex items-center justify-between">
              <h2 className="font-segoe text-xl lowercase" style={{ color: themeColors.text }}>
                alunos
              </h2>
              <button
                onClick={() => setShowNewStudentModal(true)}
                className="font-segoe uppercase text-sm hover:opacity-80 transition-opacity"
                style={{ color: MetroColors.blue }}
              >
                novo aluno
              </button>
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: themeColors.border }}>
            {students.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-6xl mb-6">👥</p>
                <p className="font-segoe text-lg mb-4 lowercase" style={{ color: themeColors.textSecondary }}>
                  nenhum aluno cadastrado ainda
                </p>
                <button
                  onClick={() => setShowNewStudentModal(true)}
                  className="font-segoe uppercase text-sm hover:opacity-80 transition-opacity"
                  style={{ color: MetroColors.blue }}
                >
                  cadastrar primeiro aluno
                </button>
              </div>
            ) : (
              students.map((student) => (
                <div
                  key={student.id}
                  className="p-6 hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={() => router.push(`/admin/students/${student.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-sm flex items-center justify-center text-white font-segoe font-light text-2xl"
                        style={{ backgroundColor: MetroColors.blue }}
                      >
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-segoe" style={{ color: themeColors.text }}>
                          {student.name}
                        </h3>
                        <p className="font-segoe text-sm" style={{ color: themeColors.textSecondary }}>
                          {student.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-segoe text-sm" style={{ color: themeColors.textTertiary }}>
                        {new Date(student.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span style={{ color: themeColors.textTertiary }}>→</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal de Novo Aluno */}
      {showNewStudentModal && (
        <NewStudentModal
          professorId={professor?.id || ''}
          onClose={() => setShowNewStudentModal(false)}
          onSuccess={() => {
            setShowNewStudentModal(false);
            loadData(); // Recarrega a lista de alunos
          }}
        />
      )}
    </div>
  );
}
