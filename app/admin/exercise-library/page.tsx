'use client';

import { MetroButton, MetroHeader, MetroInput, MetroLoading } from '@/components/metro-ui';
import { TemplateModal } from '@/components/template-modal';
import { MetroColors, ThemeColors } from '@/constants/metro-design-system';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ExerciseTemplate {
  id: string;
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
  usage_count: number;
}

const CATEGORIES = ['todos', 'peito', 'costas', 'pernas', 'ombros', 'braços', 'core', 'geral'];

export default function ExerciseLibraryPage() {
  const router = useRouter();
  const { professor, isLoading: authLoading } = useAdminAuth();
  const { colorScheme } = useTheme();
  const [templates, setTemplates] = useState<ExerciseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ExerciseTemplate | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Espera carregar do localStorage
    
    if (!professor) {
      router.push('/admin/login');
      return;
    }
    loadTemplates();
  }, [professor, authLoading, selectedCategory, searchTerm, router]);

  async function loadTemplates() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        professor_id: professor!.id,
      });

      if (selectedCategory !== 'todos') {
        params.append('category', selectedCategory);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/exercise-templates/list?${params}`);
      const result = await response.json();

      if (result.success) {
        setTemplates(result.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar biblioteca:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncYouTube() {
    if (!confirm('Sincronizar com o YouTube? Isso pode levar alguns minutos.')) return;

    try {
      setSyncing(true);
      const response = await fetch('/api/exercise-templates/sync-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professor_id: professor!.id }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          `Sincronização concluída!\n\n` +
          `Total de vídeos: ${result.data.total}\n` +
          `Importados: ${result.data.imported}\n` +
          `Já existentes: ${result.data.skipped}`
        );
        loadTemplates();
      } else {
        alert(`Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      alert('Erro ao sincronizar com YouTube');
    } finally {
      setSyncing(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja arquivar este exercício?')) return;

    try {
      const response = await fetch(`/api/exercise-templates/delete?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        loadTemplates();
      } else {
        alert('Erro ao arquivar exercício');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao arquivar exercício');
    }
  }

  const themeColors = ThemeColors[colorScheme];

  if (loading) {
    return <MetroLoading fullScreen />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: themeColors.background }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <MetroHeader
          title="biblioteca de exercícios"
          subtitle="gerencie seus exercícios reutilizáveis"
          onBack={() => router.push('/admin/dashboard')}
        />

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <MetroInput
            type="text"
            placeholder="buscar exercício..."
            value={searchTerm}
            onChange={setSearchTerm}
            accentColor={MetroColors.blue}
            bgColor={themeColors.surface}
            textColor={themeColors.text}
            className="flex-1"
          />

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-sm px-4 py-2 font-segoe text-sm uppercase transition-all hover:opacity-80 ${
                  selectedCategory === cat
                    ? ''
                    : ''
                }`}
                style={{
                  backgroundColor: selectedCategory === cat ? MetroColors.blue : themeColors.surface,
                  color: selectedCategory === cat ? '#FFFFFF' : themeColors.textSecondary,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <MetroButton
              onClick={handleSyncYouTube}
              disabled={syncing}
              variant="primary"
              accentColor={MetroColors.orange}
            >
              {syncing ? '⏳ sincronizando...' : '🔄 sync youtube'}
            </MetroButton>
            <MetroButton
              onClick={() => {
                setEditingTemplate(null);
                setShowModal(true);
              }}
              variant="primary"
              accentColor={MetroColors.green}
            >
              + novo exercício
            </MetroButton>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-sm border p-4" style={{ 
            borderColor: themeColors.border,
            backgroundColor: themeColors.surface 
          }}>
            <p className="font-segoe text-3xl font-light" style={{ color: themeColors.text }}>
              {templates.length}
            </p>
            <p className="font-segoe text-xs uppercase" style={{ color: themeColors.textSecondary }}>
              total
            </p>
          </div>
          <div className="rounded-sm border p-4" style={{ 
            borderColor: themeColors.border,
            backgroundColor: themeColors.surface 
          }}>
            <p className="font-segoe text-3xl font-light" style={{ color: themeColors.text }}>
              {templates.reduce((acc, t) => acc + t.usage_count, 0)}
            </p>
            <p className="font-segoe text-xs uppercase" style={{ color: themeColors.textSecondary }}>
              usos
            </p>
          </div>
          <div className="rounded-sm border p-4" style={{ 
            borderColor: themeColors.border,
            backgroundColor: themeColors.surface 
          }}>
            <p className="font-segoe text-3xl font-light" style={{ color: themeColors.text }}>
              {new Set(templates.map((t) => t.category)).size}
            </p>
            <p className="font-segoe text-xs uppercase" style={{ color: themeColors.textSecondary }}>
              categorias
            </p>
          </div>
          <div className="rounded-sm border p-4" style={{ 
            borderColor: themeColors.border,
            backgroundColor: themeColors.surface 
          }}>
            <p className="font-segoe text-3xl font-light" style={{ color: themeColors.text }}>
              {templates.filter((t) => t.video_url).length}
            </p>
            <p className="font-segoe text-xs uppercase" style={{ color: themeColors.textSecondary }}>
              com vídeo
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="rounded-sm border p-12 text-center" style={{ 
            borderColor: themeColors.border,
            backgroundColor: themeColors.surface 
          }}>
            <p className="text-6xl mb-6">💪</p>
            <p className="mb-4 font-segoe text-lg lowercase" style={{ color: themeColors.textSecondary }}>
              nenhum exercício encontrado
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="font-segoe text-sm uppercase hover:opacity-80"
              style={{ color: MetroColors.blue }}
            >
              criar primeiro exercício
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group rounded-sm border p-4 transition-opacity hover:opacity-80"
                style={{
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.surface,
                }}
              >
                {/* Thumbnail */}
                {template.thumbnail_url && (
                  <div className="mb-3 aspect-video overflow-hidden rounded-sm" style={{ backgroundColor: themeColors.border }}>
                    <img
                      src={template.thumbnail_url}
                      alt={template.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="mb-3">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-segoe text-lg" style={{ color: themeColors.text }}>
                      {template.name}
                    </h3>
                    {template.category && (
                      <span 
                        className="rounded-sm px-2 py-1 font-segoe text-xs uppercase"
                        style={{ 
                          backgroundColor: themeColors.border,
                          color: themeColors.textSecondary 
                        }}
                      >
                        {template.category}
                      </span>
                    )}
                  </div>
                  {template.description && (
                    <p className="mb-2 line-clamp-2 font-segoe text-sm" style={{ color: themeColors.textSecondary }}>
                      {template.description}
                    </p>
                  )}
                  <div className="flex gap-3 font-segoe text-xs" style={{ color: themeColors.textTertiary }}>
                    <span>{template.default_sets}x{template.default_reps}</span>
                    <span>•</span>
                    <span>{template.default_rest}</span>
                    <span>•</span>
                    <span>{template.usage_count} usos</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {template.video_url && (
                    <a
                      href={template.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-sm border py-2 text-center font-segoe text-xs uppercase transition-all hover:opacity-80"
                      style={{ 
                        borderColor: themeColors.border,
                        color: MetroColors.blue 
                      }}
                    >
                      ▶ vídeo
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setEditingTemplate(template);
                      setShowModal(true);
                    }}
                    className="flex-1 rounded-sm border py-2 font-segoe text-xs uppercase transition-all hover:opacity-80"
                    style={{ 
                      borderColor: themeColors.border,
                      color: MetroColors.green 
                    }}
                  >
                    editar
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="flex-1 rounded-sm border py-2 font-segoe text-xs uppercase transition-all hover:opacity-80"
                    style={{ 
                      borderColor: themeColors.border,
                      color: MetroColors.red 
                    }}
                  >
                    arquivar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal - TODO: Create separate component */}
      {showModal && (
        <TemplateModal
          template={editingTemplate}
          professorId={professor!.id}
          onClose={() => setShowModal(false)}
          onSave={loadTemplates}
        />
      )}
    </div>
  );
}
