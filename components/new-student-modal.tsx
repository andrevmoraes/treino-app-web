'use client';

import { MetroButton, MetroInput, MetroModal } from '@/components/metro-ui';
import { MetroColors } from '@/constants/metro-design-system';
import { useState } from 'react';

interface NewStudentModalProps {
  professorId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewStudentModal({ professorId, onClose, onSuccess }: NewStudentModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Chamar API route ao invés de createStudent direto
      const response = await fetch('/api/students/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          professor_id: professorId,
        }),
      });

      const result = await response.json();

      setLoading(false);

      if (!response.ok || result.error) {
        setError(result.error || 'Erro ao cadastrar aluno');
        return;
      }

      onSuccess();
    } catch (err) {
      setLoading(false);
      setError('Erro ao conectar com o servidor');
    }
  };

  return (
    <MetroModal isOpen onClose={onClose}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-segoe text-2xl font-light lowercase text-gray-900">
          ➕ novo aluno
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block font-segoe text-sm uppercase tracking-wide text-gray-700 mb-2">
            👤 NOME COMPLETO
          </label>
          <MetroInput
            type="text"
            value={name}
            onChange={setName}
            placeholder="Ex: João Silva"
            disabled={loading}
            accentColor={MetroColors.blue}
            bgColor="#F5F5F5"
            textColor="#1A1A1A"
            fullWidth
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block font-segoe text-sm uppercase tracking-wide text-gray-700 mb-2">
            📱 TELEFONE
          </label>
          <MetroInput
            type="tel"
            value={phone}
            onChange={(value) => setPhone(formatPhone(value))}
            placeholder="(11) 99999-9999"
            disabled={loading}
            accentColor={MetroColors.blue}
            bgColor="#F5F5F5"
            textColor="#1A1A1A"
            fullWidth
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-sm font-segoe text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <MetroButton
            type="button"
            onClick={onClose}
            disabled={loading}
            variant="secondary"
            fullWidth
          >
            cancelar
          </MetroButton>
          <MetroButton
            type="submit"
            disabled={loading || !name || !phone}
            variant="primary"
            accentColor={MetroColors.blue}
            fullWidth
          >
            {loading ? '⏳ cadastrando...' : '✓ cadastrar'}
          </MetroButton>
        </div>
      </form>
    </MetroModal>
  );
}
