'use client';

import { MetroButton, MetroHeader, MetroInput, MetroTile } from '@/components/metro-ui';
import { MetroColors, ThemeColors } from '@/constants/metro-design-system';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConfiguracoesPage() {
  const { student, signOut, updateStudent } = useAuth();
  const { accentColor, themeMode, setThemeMode, setAccentColor, colorScheme } = useTheme();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!student) {
      router.replace('/login');
    } else {
      setEditName(student.name || '');
      setEditPhone(student.phone || '');
      setPhotoUrl(student.avatar_url || null);
    }
  }, [student, router]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !student?.id) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens');
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentId', student.id);

      const response = await fetch('/api/students/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.photoUrl) {
        // Adiciona timestamp para evitar cache
        const photoUrlWithTimestamp = `${result.photoUrl}?t=${Date.now()}`;
        setPhotoUrl(photoUrlWithTimestamp);
        updateStudent({ avatar_url: result.photoUrl });
      } else {
        alert(`Erro ao fazer upload da foto: ${result.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload da foto');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const handleSave = async () => {
    if (!student?.id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/students/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: student.id,
          name: editName,
          phone: editPhone,
        }),
      });

      if (response.ok) {
        // Atualiza o contexto (sem reload!)
        updateStudent({ name: editName, phone: editPhone });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const themeColors = ThemeColors[colorScheme];

  // Aguarda verificação de autenticação e hidratação
  if (!mounted || !student) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="mx-auto max-w-2xl">
        <MetroHeader
          title="configurações"
          onBack={() => router.push('/home')}
        />

        <div className="px-4 md:px-6">
          {/* Informações do Usuário */}
          <div className="border-b py-8" style={{ borderColor: themeColors.border }}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-segoe text-xs uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
                informações
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="font-segoe text-xs uppercase tracking-wider transition-opacity hover:opacity-100"
                  style={{ color: accentColor, opacity: 0.8 }}
                >
                  editar
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(student.name || '');
                      setEditPhone(student.phone || '');
                    }}
                    className="font-segoe text-xs uppercase tracking-wider transition-opacity hover:opacity-100"
                    style={{ color: themeColors.textSecondary, opacity: 0.6 }}
                  >
                    cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="font-segoe text-xs uppercase tracking-wider transition-opacity hover:opacity-100"
                    style={{ color: accentColor, opacity: isSaving ? 0.5 : 1 }}
                  >
                    {isSaving ? 'salvando...' : 'salvar'}
                  </button>
                </div>
              )}
            </div>
            
            {/* Foto de Perfil */}
            <div className="mb-8 flex flex-col items-center">
              <div className="relative">
                <div 
                  className="h-32 w-32 overflow-hidden rounded-full border-4"
                  style={{ borderColor: accentColor }}
                >
                  {photoUrl ? (
                    <img 
                      key={photoUrl}
                      src={photoUrl} 
                      alt="Foto de perfil" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div 
                      className="flex h-full w-full items-center justify-center text-5xl"
                      style={{ backgroundColor: themeColors.surface, color: themeColors.textSecondary }}
                    >
                      {student?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: accentColor }}
                >
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                  <span className="text-white text-lg">📷</span>
                </label>
              </div>
              {isUploadingPhoto && (
                <p className="mt-2 font-segoe text-xs" style={{ color: accentColor }}>
                  enviando...
                </p>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-2 font-segoe text-xs uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
                  nome
                </p>
                {isEditing ? (
                  <MetroInput
                    type="text"
                    value={editName}
                    onChange={setEditName}
                    placeholder="Seu nome"
                    disabled={isSaving}
                    accentColor={accentColor}
                    bgColor={themeColors.surface}
                    textColor={themeColors.text}
                    fullWidth
                  />
                ) : (
                  <p className="font-segoe text-lg" style={{ color: themeColors.text }}>
                    {student?.name || 'Não informado'}
                  </p>
                )}
              </div>
              <div>
                <p className="mb-2 font-segoe text-xs uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
                  telefone
                </p>
                {isEditing ? (
                  <MetroInput
                    type="tel"
                    value={editPhone}
                    onChange={(value) => setEditPhone(formatPhone(value))}
                    placeholder="(11) 99999-9999"
                    disabled={isSaving}
                    accentColor={accentColor}
                    bgColor={themeColors.surface}
                    textColor={themeColors.text}
                    fullWidth
                  />
                ) : (
                  <p className="font-segoe text-lg" style={{ color: themeColors.text }}>
                    {student?.phone || 'Não informado'}
                  </p>
                )}
              </div>
            </div>

            {/* Botão Sair */}
            <div className="mt-8">
              <MetroButton
                onClick={handleLogout}
                variant="primary"
                accentColor={MetroColors.red}
                fullWidth
                size="lg"
              >
                sair
              </MetroButton>
            </div>
          </div>

          {/* Aparência (Tema + Cor de destaque) */}
          <div className="border-b py-8" style={{ borderColor: themeColors.border }}>
            <h2 className="mb-6 font-segoe text-xs uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
              aparência
            </h2>
            
            {/* Seleção de Tema */}
            <p className="mb-3 font-segoe text-xs uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
              tema
            </p>
            <div className="grid grid-cols-3 gap-3">
              <MetroTile
                size="small"
                color={themeMode === 'light' ? accentColor : themeColors.surface}
                hoverable
                onClick={() => setThemeMode('light')}
              >
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <span 
                    className="font-segoe text-sm uppercase tracking-wider"
                    style={{ 
                      color: themeMode === 'light' ? '#FFFFFF' : themeColors.textSecondary 
                    }}
                  >
                    claro
                  </span>
                </div>
              </MetroTile>

              <MetroTile
                size="small"
                color={themeMode === 'dark' ? accentColor : themeColors.surface}
                hoverable
                onClick={() => setThemeMode('dark')}
              >
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <span 
                    className="font-segoe text-sm uppercase tracking-wider"
                    style={{ 
                      color: themeMode === 'dark' ? '#FFFFFF' : themeColors.textSecondary 
                    }}
                  >
                    escuro
                  </span>
                </div>
              </MetroTile>

              <MetroTile
                size="small"
                color={themeMode === 'system' ? accentColor : themeColors.surface}
                hoverable
                onClick={() => setThemeMode('system')}
              >
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <span 
                    className="font-segoe text-sm uppercase tracking-wider"
                    style={{ 
                      color: themeMode === 'system' ? '#FFFFFF' : themeColors.textSecondary 
                    }}
                  >
                    sistema
                  </span>
                </div>
              </MetroTile>
            </div>

            {/* Seleção de Cor de Destaque */}
            <p className="mb-3 mt-8 font-segoe text-xs uppercase tracking-wider" style={{ color: themeColors.textSecondary }}>
              cor de destaque
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { name: 'blue', color: MetroColors.blue },
                { name: 'teal', color: MetroColors.teal },
                { name: 'green', color: MetroColors.green },
                { name: 'orange', color: MetroColors.orange },
                { name: 'purple', color: MetroColors.purple },
                { name: 'pink', color: MetroColors.pink },
                { name: 'red', color: MetroColors.red },
                { name: 'lime', color: MetroColors.lime },
              ].map(({ name, color }) => (
                <MetroTile
                  key={name}
                  size="small"
                  color={color}
                  hoverable
                  onClick={() => setAccentColor(color)}
                >
                  <div className="flex items-center justify-center h-full">
                    {accentColor === color && (
                      <span className="font-segoe text-2xl text-white">✓</span>
                    )}
                  </div>
                </MetroTile>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
