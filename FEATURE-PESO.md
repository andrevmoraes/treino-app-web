# 🏋️ Feature: Registro de Peso nos Exercícios

## ✅ Implementação Completa

Esta feature permite que os alunos registrem e acompanhem o peso que usam em cada exercício.

## 📋 Passo a Passo para Ativar

### 1️⃣ Executar SQL no Supabase

Acesse o **Supabase Dashboard** → **SQL Editor** e execute o seguinte SQL:

```sql
-- ============================================
-- MIGRATION 003: Exercise Weights Tracking
-- ============================================
-- Purpose: Allow students to save the weight they use for each exercise
-- Date: 2025-11-09

CREATE TABLE exercise_weights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  weight NUMERIC(6, 2) NOT NULL CHECK (weight >= 0), -- Peso em kg (ex: 25.5)
  unit TEXT DEFAULT 'kg' CHECK (unit IN ('kg', 'lbs')),
  notes TEXT, -- Observações adicionais (opcional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Index para buscar último peso usado por aluno em cada exercício
  CONSTRAINT idx_student_exercise_date UNIQUE(student_id, exercise_id, created_at)
);

-- Índices para performance
CREATE INDEX idx_weights_student_exercise ON exercise_weights(student_id, exercise_id, created_at DESC);
CREATE INDEX idx_weights_exercise ON exercise_weights(exercise_id, created_at DESC);

-- Comentários
COMMENT ON TABLE exercise_weights IS 'Histórico de pesos utilizados pelos alunos em cada exercício';
COMMENT ON COLUMN exercise_weights.weight IS 'Peso em kg ou lbs (decimal 2 casas)';
COMMENT ON COLUMN exercise_weights.unit IS 'Unidade de medida: kg ou lbs';

-- RLS Policies
ALTER TABLE exercise_weights ENABLE ROW LEVEL SECURITY;

-- Students can only see/update their own weights
CREATE POLICY "Students can view own weights"
  ON exercise_weights FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own weights"
  ON exercise_weights FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Professors can see all weights (for their students)
CREATE POLICY "Professors can view all weights"
  ON exercise_weights FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN professors p ON s.professor_id = p.id
      WHERE s.id = exercise_weights.student_id
      AND p.id = auth.uid()
    )
  );
```

### 2️⃣ Testar a Feature

1. Faça login como aluno
2. Acesse um treino
3. Em cada exercício, você verá um campo "Peso (kg)"
4. Digite o peso e clique em "SALVAR"
5. O peso será salvo e aparecerá como "último: XXkg"
6. Na próxima vez que abrir o treino, o peso será pré-preenchido

## 🎯 Funcionalidades

- ✅ Input numérico para registrar peso (com decimais)
- ✅ Botão para salvar o peso
- ✅ Carregamento automático do último peso usado
- ✅ Histórico completo de pesos (para evolução futura)
- ✅ Validação (peso >= 0)
- ✅ Suporte a kg/lbs (preparado para futuro)

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:
- `app/api/exercise-weights/save/route.ts` - Endpoint para salvar peso
- `app/api/exercise-weights/get/route.ts` - Endpoint para buscar último peso
- `supabase/migrations/003_exercise_weights.sql` - Migration do banco

### Arquivos Modificados:
- `components/exercise-card.tsx` - Adicionado input de peso
- `components/workout-page-layout.tsx` - Passa studentId para cards
- `app/treino/[id]/page.tsx` - Usa contexto de auth para pegar student.id

## 🔐 Segurança

A API usa **Service Role Key** para contornar RLS (padrão da aplicação).
As RLS policies estão definidas mas não são usadas na prática atual.

## 📊 Banco de Dados

### Tabela: `exercise_weights`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária |
| student_id | UUID | Referência ao aluno |
| exercise_id | UUID | Referência ao exercício |
| weight | NUMERIC(6,2) | Peso em kg/lbs (ex: 25.50) |
| unit | TEXT | Unidade: 'kg' ou 'lbs' |
| notes | TEXT | Observações (opcional) |
| created_at | TIMESTAMP | Data/hora do registro |

### Índices:
- `idx_weights_student_exercise` - Busca rápida por aluno + exercício
- `idx_weights_exercise` - Busca rápida por exercício

## 🚀 Próximos Passos (Futuro)

- [ ] Gráfico de evolução de peso por exercício
- [ ] Comparar peso entre datas
- [ ] Export de histórico
- [ ] Suporte a lbs (libras)
- [ ] Notes/observações no UI
