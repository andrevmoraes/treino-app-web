'use client';

import { MetroButton, MetroInput } from '@/components/metro-ui';
import { ThemeColors } from '@/constants/metro-design-system';
import { useTheme } from '@/contexts/theme-context';
import { Exercise } from '@/types/exercise';
import { useEffect, useState } from 'react';

interface ExerciseCardProps {
  exercise: Exercise;
  studentId?: string; // ID do aluno logado (opcional para compatibilidade)
}

export function ExerciseCard({ exercise, studentId }: ExerciseCardProps) {
  const { accentColor, colorScheme } = useTheme();
  const [completedSets, setCompletedSets] = useState<boolean[]>(Array(exercise.sets).fill(false));
  const [weight, setWeight] = useState<string>('');
  const [lastWeight, setLastWeight] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const themeColors = ThemeColors[colorScheme];

  // Carregar último peso usado
  useEffect(() => {
    if (!studentId) return;

    async function loadLastWeight() {
      try {
        const response = await fetch(
          `/api/exercise-weights/get?student_id=${studentId}&exercise_id=${exercise.id}`
        );
        const result = await response.json();
        
        if (result.success && result.data) {
          setLastWeight(result.data.weight);
          setWeight(result.data.weight.toString());
        }
      } catch (error) {
        console.error('Erro ao carregar peso:', error);
      }
    }

    loadLastWeight();
  }, [studentId, exercise.id]);

  const toggleSet = (index: number) => {
    const newSets = [...completedSets];
    newSets[index] = !newSets[index];
    setCompletedSets(newSets);
  };

  const handleSaveWeight = async () => {
    if (!studentId || !weight || parseFloat(weight) <= 0) return;

    setSaving(true);
    try {
      const response = await fetch('/api/exercise-weights/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          exercise_id: exercise.id,
          weight: parseFloat(weight),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setLastWeight(parseFloat(weight));
      } else {
        alert('Erro ao salvar peso');
      }
    } catch (error) {
      console.error('Erro ao salvar peso:', error);
      alert('Erro ao salvar peso');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = completedSets.filter(Boolean).length;
  const isComplete = completedCount === exercise.sets;

  // Extrair ID do vídeo do YouTube
  const getYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = exercise.video ? getYouTubeId(exercise.video) : null;

  return (
    <div
      className="mb-3 overflow-hidden rounded-sm border p-5 transition-all hover:opacity-90"
      style={{
        backgroundColor: themeColors.surface,
        borderColor: isComplete ? accentColor : themeColors.border,
        borderWidth: isComplete ? '2px' : '1px',
      }}
    >
      <div className="mb-3 flex items-start justify-between">
        <h3
          className="font-segoe text-lg font-semibold lowercase"
          style={{ color: isComplete ? accentColor : themeColors.text }}
        >
          {exercise.title}
        </h3>
        <span 
          className="rounded-sm px-2 py-1 font-segoe text-xs uppercase font-bold"
          style={{ 
            backgroundColor: isComplete ? accentColor : themeColors.border,
            color: isComplete ? '#fff' : themeColors.textSecondary 
          }}
        >
          {completedCount}/{exercise.sets}
        </span>
      </div>

      <div className="mb-4 flex gap-4 font-segoe text-sm" style={{ color: themeColors.textSecondary }}>
        <span>📊 {exercise.sets} séries</span>
        <span>🔁 {exercise.reps} reps</span>
        <span>⏱️ {exercise.rest}</span>
      </div>

      {/* Weight Input - Only show if studentId is provided */}
      {studentId && (
        <div className="mb-4 flex items-center gap-2">
          <MetroInput
            type="number"
            value={weight}
            onChange={setWeight}
            placeholder="Peso (kg)"
            accentColor={accentColor}
            bgColor={themeColors.surface}
            textColor={themeColors.text}
            className="w-24"
          />
          <MetroButton
            onClick={handleSaveWeight}
            disabled={saving || !weight || parseFloat(weight) <= 0}
            variant="primary"
            accentColor={accentColor}
            size="sm"
          >
            {saving ? '...' : 'salvar'}
          </MetroButton>
          {lastWeight && (
            <span className="font-segoe text-xs" style={{ color: themeColors.textSecondary }}>
              último: {lastWeight}kg
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: exercise.sets }).map((_, index) => (
          <button
            key={index}
            onClick={() => toggleSet(index)}
            className="flex h-12 w-12 items-center justify-center rounded-sm border-2 font-segoe text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: completedSets[index] ? accentColor : 'transparent',
              borderColor: completedSets[index] ? accentColor : themeColors.border,
              color: completedSets[index] ? '#fff' : themeColors.text,
            }}
          >
            {completedSets[index] ? '✓' : index + 1}
          </button>
        ))}
      </div>

      {exercise.tip && (
        <p className="mt-4 rounded-sm border-l-4 bg-opacity-10 p-3 font-segoe text-sm italic" style={{ 
          color: themeColors.textSecondary,
          borderColor: accentColor,
          backgroundColor: `${accentColor}10`
        }}>
          💡 {exercise.tip}
        </p>
      )}

      {exercise.video && (
        <MetroButton
          onClick={() => setShowVideoModal(true)}
          variant="primary"
          accentColor={accentColor}
          size="sm"
          className="mt-4"
        >
          ▶️ assistir vídeo
        </MetroButton>
      )}

      {/* Video Modal */}
      {showVideoModal && videoId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div 
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -right-4 -top-4 flex h-10 w-10 items-center justify-center bg-white text-black hover:bg-gray-200 border-2 border-black z-10"
              style={{ borderRadius: '50%' }}
            >
              ✕
            </button>
            <div className="relative overflow-hidden rounded-sm" style={{ paddingBottom: '177.78%' }}>
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={exercise.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
