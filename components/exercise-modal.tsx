'use client';

import { MetroButton, MetroLoading, MetroModal } from '@/components/metro-ui';
import { useEffect, useState } from 'react';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workoutId: string;
  professorId: string;
  exercise?: {
    id: string;
    title: string;
    sets: number;
    reps: number;
    rest: string;
  } | null;
}

interface ExerciseTemplate {
  id: string;
  name: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  category: string | null;
  default_sets: number;
  default_reps: number;
  default_rest: string;
  tip: string | null;
}

export default function ExerciseModal({
  isOpen,
  onClose,
  onSuccess,
  workoutId,
  professorId,
  exercise,
}: ExerciseModalProps) {
  const isEditMode = !!exercise;

  const [mode, setMode] = useState<'form' | 'library'>('form'); // form ou library
  const [templates, setTemplates] = useState<ExerciseTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: exercise?.title || '',
    sets: exercise?.sets?.toString() || '',
    reps: exercise?.reps?.toString() || '',
    rest: exercise?.rest || '60s',
    video: '',
    tip: '',
    template_id: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Atualizar formData quando o exercise mudar
  useEffect(() => {
    if (exercise) {
      setFormData({
        title: exercise.title,
        sets: exercise.sets.toString(),
        reps: exercise.reps.toString(),
        rest: exercise.rest,
        video: '',
        tip: '',
        template_id: '',
      });
    } else {
      setFormData({
        title: '',
        sets: '',
        reps: '',
        rest: '60s',
        video: '',
        tip: '',
        template_id: '',
      });
    }
  }, [exercise]);

  // Carregar templates quando mudar para modo biblioteca
  useEffect(() => {
    if (mode === 'library' && templates.length === 0) {
      loadTemplates();
    }
  }, [mode]);

  async function loadTemplates() {
    setLoadingTemplates(true);
    try {
      const response = await fetch(
        `/api/exercise-templates/list?professor_id=${professorId}`
      );
      const result = await response.json();
      if (result.success) {
        setTemplates(result.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  }

  function selectTemplate(template: ExerciseTemplate) {
    setFormData({
      title: template.name,
      sets: template.default_sets.toString(),
      reps: template.default_reps.toString(),
      rest: template.default_rest,
      video: template.video_url || '',
      tip: template.tip || '',
      template_id: template.id,
    });
    setMode('form'); // Volta para o formulário com dados pré-preenchidos
  }

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        // Atualizar exercício existente
        const response = await fetch('/api/exercises/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exercise_id: exercise.id,
            ...formData,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao atualizar exercício');
        }
      } else {
        // Criar novo exercício
        const response = await fetch('/api/exercises/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workout_id: workoutId,
            ...formData,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao criar exercício');
        }
      }

      onSuccess();
    } catch (err) {
      console.error('Erro ao salvar exercício:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar exercício');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        title: '',
        sets: '',
        reps: '',
        rest: '60s',
        video: '',
        tip: '',
        template_id: '',
      });
      setError(null);
      setMode('form');
      setSearchTerm('');
      onClose();
    }
  };

  return (
    <MetroModal isOpen={isOpen} onClose={handleClose} maxWidth="xl">
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-light text-gray-900 dark:text-white lowercase">
          {isEditMode ? 'editar exercício' : 'novo exercício'}
        </h2>
        
        {/* Mode Selector - apenas em modo criação */}
        {!isEditMode && (
          <div className="mt-4 flex gap-2">
            <MetroButton
              variant={mode === 'form' ? 'primary' : 'ghost'}
              onClick={() => setMode('form')}
              className="flex-1"
            >
              manual
            </MetroButton>
            <MetroButton
              variant={mode === 'library' ? 'primary' : 'ghost'}
              onClick={() => setMode('library')}
              className="flex-1"
            >
              da biblioteca
            </MetroButton>
          </div>
        )}
      </div>

      {/* Library View */}
      {mode === 'library' && !isEditMode ? (
        <div className="p-6">
          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar exercício..."
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-sm focus:border-[--metro-blue] focus:outline-none transition-all mb-4"
          />

          {/* Templates List */}
          {loadingTemplates ? (
            <div className="text-center py-12">
              <MetroLoading text="carregando biblioteca..." />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">nenhum exercício encontrado</p>
              <MetroButton
                variant="ghost"
                onClick={() => setMode('form')}
                className="mt-4"
              >
                criar manualmente
              </MetroButton>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => selectTemplate(template)}
                  className="w-full text-left p-4 border-2 border-gray-200 dark:border-gray-800 rounded-sm hover:border-[--metro-blue] hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                >
                  <div className="flex items-start gap-3">
                    {template.thumbnail_url && (
                      <img
                        src={template.thumbnail_url}
                        alt={template.name}
                        className="w-20 h-14 object-cover rounded-sm"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white lowercase">{template.name}</h3>
                      {template.category && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                          {template.category}
                        </span>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {template.default_sets}x{template.default_reps} • {template.default_rest}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Cancel Button */}
          <MetroButton
            variant="secondary"
            onClick={handleClose}
            className="mt-4 w-full"
          >
            cancelar
          </MetroButton>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
              NOME DO EXERCÍCIO *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Supino reto"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-sm focus:border-[--metro-blue] focus:outline-none transition-all"
              required
              disabled={isLoading}
            />
          </div>

          {/* Séries */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
              SÉRIES *
            </label>
            <input
              type="number"
              value={formData.sets}
              onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
              placeholder="Ex: 4"
              min="1"
              max="20"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-sm focus:border-[--metro-blue] focus:outline-none transition-all"
              required
              disabled={isLoading}
            />
          </div>

          {/* Repetições */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
              REPETIÇÕES *
            </label>
            <input
              type="number"
              value={formData.reps}
              onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
              placeholder="Ex: 12"
              min="1"
              max="100"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-sm focus:border-[--metro-blue] focus:outline-none transition-all"
              required
              disabled={isLoading}
            />
          </div>

          {/* Descanso */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
              DESCANSO *
            </label>
            <select
              value={formData.rest}
              onChange={(e) => setFormData({ ...formData, rest: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-sm focus:border-[--metro-blue] focus:outline-none transition-all"
              required
              disabled={isLoading}
              title="Descanso"
            >
              <option value="30s">30 segundos</option>
              <option value="45s">45 segundos</option>
              <option value="60s">1 minuto</option>
              <option value="90s">1min 30s</option>
              <option value="120s">2 minutos</option>
              <option value="180s">3 minutos</option>
            </select>
          </div>

          {/* Preview */}
          <div className="border-2 border-gray-200 dark:border-gray-800 rounded-sm p-4 bg-gray-50 dark:bg-gray-900">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase">Preview:</p>
            <div>
              <p className="font-bold text-gray-900 dark:text-white lowercase">
                {formData.title || 'nome do exercício'}
              </p>
              <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span>{formData.sets || '0'} séries</span>
                <span>{formData.reps || '0'} reps</span>
                <span>{formData.rest}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-sm">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <MetroButton
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              cancelar
            </MetroButton>
            <MetroButton
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'salvando...' : (isEditMode ? 'salvar alterações' : 'criar exercício')}
            </MetroButton>
          </div>
        </form>
      )}
    </MetroModal>
  );
}
