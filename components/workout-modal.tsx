'use client';

import { MetroButton, MetroModal } from '@/components/metro-ui';
import { useEffect, useState } from 'react';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentId: string;
  workout?: {
    id: string;
    name: string;
    description: string;
    color: string;
  } | null;
}

const PRESET_COLORS = [
  { name: 'Azul', value: '#0078D7' },
  { name: 'Ciano', value: '#00B7C3' },
  { name: 'Verde', value: '#10893E' },
  { name: 'Vermelho', value: '#E74856' },
  { name: 'Roxo', value: '#881798' },
  { name: 'Laranja', value: '#FF8C00' },
  { name: 'Rosa', value: '#E3008C' },
  { name: 'Amarelo', value: '#FFB900' },
];

export default function WorkoutModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  studentId,
  workout 
}: WorkoutModalProps) {
  const isEditMode = !!workout;
  
  const [formData, setFormData] = useState({
    name: workout?.name || '',
    description: workout?.description || '',
    color: workout?.color || PRESET_COLORS[0].value,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Atualizar formData quando o workout mudar
  useEffect(() => {
    if (workout) {
      setFormData({
        name: workout.name,
        description: workout.description,
        color: workout.color,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: PRESET_COLORS[0].value,
      });
    }
  }, [workout]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('🚀 Iniciando submit:', { isEditMode, studentId, formData });

    try {
      if (isEditMode) {
        // Atualizar treino existente
        const response = await fetch('/api/workouts/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workout_id: workout.id,
            ...formData,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao atualizar treino');
        }
      } else {
        // Criar novo treino
        console.log('📤 Enviando dados para criar treino:', {
          student_id: studentId,
          ...formData,
        });

        const response = await fetch('/api/workouts/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            ...formData,
          }),
        });

        const result = await response.json();
        console.log('📥 Resposta do servidor:', { status: response.status, result });

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao criar treino');
        }
      }

      onSuccess();
    } catch (err) {
      console.error('Erro ao salvar treino:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar treino');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        description: '',
        color: PRESET_COLORS[0].value,
      });
      setError(null);
      onClose();
    }
  };

  return (
    <MetroModal isOpen={isOpen} onClose={handleClose} maxWidth="md">
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-light text-gray-900 dark:text-white lowercase">
          {isEditMode ? 'editar treino' : 'novo treino'}
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Nome */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
            NOME DO TREINO *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Treino A - Peito e Tríceps"
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-sm focus:border-[--metro-blue] focus:outline-none transition-all"
            required
            disabled={isLoading}
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase">
            DESCRIÇÃO *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ex: Foco em peito e tríceps, com ênfase em hipertrofia"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-sm focus:border-[--metro-blue] focus:outline-none transition-all resize-none"
            required
            disabled={isLoading}
          />
        </div>

        {/* Cor */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase">
            COR DO TREINO *
          </label>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setFormData({ ...formData, color: preset.value })}
                className={`relative h-16 rounded-sm transition-all ${
                  formData.color === preset.value
                    ? 'ring-4 ring-gray-900 dark:ring-white ring-offset-2 scale-105'
                    : 'hover:scale-105 border-2 border-gray-200 dark:border-gray-800'
                }`}
                style={{ backgroundColor: preset.value }}
                disabled={isLoading}
                title={preset.name}
              >
                {formData.color === preset.value && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 uppercase">
            cor selecionada: <strong>{PRESET_COLORS.find(c => c.value === formData.color)?.name}</strong>
          </p>
        </div>

        {/* Preview */}
        <div className="border-2 border-gray-200 dark:border-gray-800 rounded-sm p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase">Preview:</p>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-sm flex-shrink-0"
              style={{ backgroundColor: formData.color }}
            />
            <div>
              <p className="font-bold text-gray-900 dark:text-white lowercase">
                {formData.name || 'nome do treino'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formData.description || 'descrição do treino'}
              </p>
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
            {isLoading ? 'salvando...' : (isEditMode ? 'salvar alterações' : 'criar treino')}
          </MetroButton>
        </div>
      </form>
    </MetroModal>
  );
}
