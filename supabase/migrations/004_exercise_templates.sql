-- ============================================
-- MIGRATION 004: Exercise Templates Library
-- ============================================
-- Purpose: Create a reusable library of exercises for professors
-- Date: 2025-11-09

CREATE TABLE exercise_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professor_id UUID NOT NULL REFERENCES professors(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ex: "Supino Reto"
  description TEXT, -- Ex: "Exercício para desenvolvimento do peitoral maior"
  video_url TEXT, -- YouTube URL
  thumbnail_url TEXT, -- YouTube thumbnail (auto-extraído)
  category TEXT, -- Ex: "Peito", "Costas", "Pernas", "Ombros", "Braços", "Core"
  muscle_group TEXT, -- Ex: "Peitoral Maior", "Latíssimo do Dorso"
  equipment TEXT, -- Ex: "Barra", "Halteres", "Máquina", "Peso Corporal"
  difficulty TEXT CHECK (difficulty IN ('iniciante', 'intermediário', 'avançado')),
  default_sets INTEGER DEFAULT 3,
  default_reps INTEGER DEFAULT 12,
  default_rest TEXT DEFAULT '90s',
  tip TEXT, -- Dica de execução
  is_active BOOLEAN DEFAULT true, -- Professor pode arquivar exercícios
  usage_count INTEGER DEFAULT 0, -- Quantas vezes foi usado (analytics)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_exercise_templates_professor ON exercise_templates(professor_id, is_active);
CREATE INDEX idx_exercise_templates_category ON exercise_templates(category, is_active);
CREATE INDEX idx_exercise_templates_usage ON exercise_templates(usage_count DESC);

-- Comentários
COMMENT ON TABLE exercise_templates IS 'Biblioteca de exercícios reutilizáveis dos professores';
COMMENT ON COLUMN exercise_templates.video_url IS 'URL do YouTube com demonstração do exercício';
COMMENT ON COLUMN exercise_templates.usage_count IS 'Contador de uso para analytics';

-- Adicionar referência ao template na tabela exercises
ALTER TABLE exercises ADD COLUMN template_id UUID REFERENCES exercise_templates(id) ON DELETE SET NULL;
CREATE INDEX idx_exercises_template ON exercises(template_id);

COMMENT ON COLUMN exercises.template_id IS 'Referência ao template usado (null se customizado)';

-- Trigger para incrementar usage_count automaticamente
CREATE OR REPLACE FUNCTION increment_template_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.template_id IS NOT NULL THEN
    UPDATE exercise_templates 
    SET usage_count = usage_count + 1 
    WHERE id = NEW.template_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_template_usage
  AFTER INSERT ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION increment_template_usage();

-- Trigger para updated_at
CREATE TRIGGER update_exercise_templates_updated_at 
  BEFORE UPDATE ON exercise_templates
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE exercise_templates ENABLE ROW LEVEL SECURITY;

-- Professors can only see/manage their own templates
CREATE POLICY "Professors can view own templates"
  ON exercise_templates FOR SELECT
  USING (professor_id = auth.uid());

CREATE POLICY "Professors can insert own templates"
  ON exercise_templates FOR INSERT
  WITH CHECK (professor_id = auth.uid());

CREATE POLICY "Professors can update own templates"
  ON exercise_templates FOR UPDATE
  USING (professor_id = auth.uid());

CREATE POLICY "Professors can delete own templates"
  ON exercise_templates FOR DELETE
  USING (professor_id = auth.uid());
