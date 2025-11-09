'use client';

import { useEffect, useState } from 'react';

interface ExerciseTemplate {
  id?: string;
  name: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  category: string | null;
  muscle_group: string | null;
  equipment: string | null;
  difficulty: string | null;
  default_sets: number;
  default_reps: number;
  default_rest: string;
  tip: string | null;
  usage_count?: number;
}

interface TemplateModalProps {
  template: ExerciseTemplate | null;
  professorId: string;
  onClose: () => void;
  onSave: () => void;
}

const CATEGORIES = ['peito', 'costas', 'pernas', 'ombros', 'braços', 'core', 'geral'];
const DIFFICULTIES = ['iniciante', 'intermediário', 'avançado'];
const REST_OPTIONS = ['30s', '45s', '60s', '90s', '120s', '180s'];

export function TemplateModal({ template, professorId, onClose, onSave }: TemplateModalProps) {
  const [formData, setFormData] = useState<ExerciseTemplate>({
    name: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    category: 'geral',
    muscle_group: '',
    equipment: '',
    difficulty: 'intermediário',
    default_sets: 3,
    default_reps: 12,
    default_rest: '90s',
    tip: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        description: template.description || '',
        video_url: template.video_url || '',
        thumbnail_url: template.thumbnail_url || '',
        category: template.category || 'geral',
        muscle_group: template.muscle_group || '',
        equipment: template.equipment || '',
        difficulty: template.difficulty || 'intermediário',
        default_sets: template.default_sets || 3,
        default_reps: template.default_reps || 12,
        default_rest: template.default_rest || '90s',
        tip: template.tip || '',
      });
    }
  }, [template]);

  // Auto-extract YouTube thumbnail
  useEffect(() => {
    if (formData.video_url && formData.video_url.includes('youtube.com')) {
      const videoId = formData.video_url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        setFormData((prev) => ({
          ...prev,
          thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        }));
      }
    }
  }, [formData.video_url]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name) {
      alert('Nome é obrigatório');
      return;
    }

    setSaving(true);

    try {
      const endpoint = template?.id
        ? '/api/exercise-templates/update'
        : '/api/exercise-templates/create';

      const body = template?.id
        ? { id: template.id, ...formData }
        : { professor_id: professorId, ...formData };

      const response = await fetch(endpoint, {
        method: template?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        onSave();
        onClose();
      } else {
        alert('Erro ao salvar exercício');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar exercício');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-sm border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-6 font-segoe text-2xl font-light lowercase text-white">
          {template?.id ? 'editar exercício' : 'novo exercício'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-2 block font-segoe text-sm uppercase text-gray-400">
              nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-sm border border-gray-800 bg-black px-4 py-3 font-segoe text-white focus:border-[--metro-blue] focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-segoe text-sm uppercase text-gray-400">
              descrição
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-sm border border-gray-800 bg-black px-4 py-3 font-segoe text-white focus:border-[--metro-blue] focus:outline-none"
              rows={3}
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="mb-2 block font-segoe text-sm uppercase text-gray-400">
              url do vídeo (youtube)
            </label>
            <input
              type="url"
              value={formData.video_url || ''}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-sm border border-gray-800 bg-black px-4 py-3 font-segoe text-white focus:border-[--metro-blue] focus:outline-none"
            />
          </div>

          {/* Category, Muscle, Equipment */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block font-segoe text-sm uppercase text-gray-400">
                categoria
              </label>
              <select
                value={formData.category || 'geral'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-sm border border-gray-800 bg-black px-4 py-3 font-segoe text-white focus:border-[--metro-blue] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-segoe text-sm uppercase text-gray-400">
                músculo alvo
              </label>
              <input
                type="text"
                value={formData.muscle_group || ''}
                onChange={(e) => setFormData({ ...formData, muscle_group: e.target.value })}
                placeholder="Ex: Peitoral maior"
                className="w-full rounded-sm border border-gray-800 bg-black px-4 py-3 font-segoe text-white focus:border-[--metro-blue] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-segoe text-sm uppercase text-gray-400">
                equipamento
              </label>
              <input
                type="text"
                value={formData.equipment || ''}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                placeholder="Ex: Barra, Halteres"
                className="w-full rounded-sm border border-gray-800 bg-black px-4 py-3 font-segoe text-white focus:border-[--metro-blue] focus:outline-none"
              />
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="mb-2 block font-segoe text-sm uppercase text-gray-400">
              dificuldade
            </label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: diff })}
                  className={`flex-1 rounded-sm border px-4 py-2 font-segoe text-sm uppercase transition-colors ${
                    formData.difficulty === diff
                      ? 'border-[--metro-blue] bg-[--metro-blue] text-white'
                      : 'border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Defaults: Sets, Reps, Rest */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block font-segoe text-sm uppercase text-gray-400">
                séries padrão
              </label>
              <input
                type="number"
                value={formData.default_sets}
                onChange={(e) =>
                  setFormData({ ...formData, default_sets: parseInt(e.target.value) || 0 })
                }
                min="1"
                className="w-full rounded-sm border border-gray-800 bg-black px-4 py-3 font-segoe text-white focus:border-[--metro-blue] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-segoe text-sm uppercase text-gray-400">
                reps padrão
              </label>
              <input
                type="number"
                value={formData.default_reps}
                onChange={(e) =>
                  setFormData({ ...formData, default_reps: parseInt(e.target.value) || 0 })
                }
                min="1"
                className="w-full rounded-sm border border-gray-800 bg-black px-4 py-3 font-segoe text-white focus:border-[--metro-blue] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-segoe text-sm uppercase text-gray-400">
                descanso padrão
              </label>
              <select
                value={formData.default_rest}
                onChange={(e) => setFormData({ ...formData, default_rest: e.target.value })}
                className="w-full rounded-sm border border-gray-800 bg-black px-4 py-3 font-segoe text-white focus:border-[--metro-blue] focus:outline-none"
              >
                {REST_OPTIONS.map((rest) => (
                  <option key={rest} value={rest}>
                    {rest}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tip */}
          <div>
            <label className="mb-2 block font-segoe text-sm uppercase text-gray-400">
              dica de execução
            </label>
            <textarea
              value={formData.tip || ''}
              onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
              className="w-full rounded-sm border border-gray-800 bg-black px-4 py-3 font-segoe text-white focus:border-[--metro-blue] focus:outline-none"
              rows={2}
              placeholder="Ex: Mantenha o core contraído durante todo movimento"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-sm bg-[--metro-green] py-3 font-segoe text-sm uppercase text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'salvando...' : 'salvar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-sm border border-gray-800 py-3 font-segoe text-sm uppercase text-gray-400 hover:border-gray-700"
            >
              cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
