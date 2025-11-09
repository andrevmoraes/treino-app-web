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
