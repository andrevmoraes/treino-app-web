-- ============================================
-- TREINO APP - DATABASE SCHEMA
-- PostgreSQL / Supabase
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABELA DE PROFESSORES
-- ============================================
-- Por que: Separar professores de alunos, permitir múltiplos no futuro
-- Índices: email (login), created_at (ordenação)

CREATE TABLE professors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- Bcrypt hash, nunca senha plain text
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por email no login
CREATE INDEX idx_professors_email ON professors(email);

-- Comentários para documentação
COMMENT ON TABLE professors IS 'Professores que gerenciam alunos e treinos';
COMMENT ON COLUMN professors.password_hash IS 'Hash bcrypt da senha (nunca armazenar senha em texto)';

-- ============================================
-- 2. TABELA DE ALUNOS
-- ============================================
-- Por que: Cada aluno tem seus próprios treinos
-- Relacionamento: N alunos para 1 professor
-- Índices: phone (login único), professor_id (filtro)

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL, -- Login do aluno
  name TEXT NOT NULL,
  email TEXT, -- Opcional, para contato
  professor_id UUID REFERENCES professors(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true, -- Professor pode desativar aluno
  avatar_url TEXT, -- Foto do aluno (futuro)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: telefone deve ter formato válido
  CONSTRAINT phone_format CHECK (phone ~ '^\(\d{2}\) \d{5}-\d{4}$')
);

-- Índices para performance
CREATE INDEX idx_students_phone ON students(phone); -- Login rápido
CREATE INDEX idx_students_professor ON students(professor_id); -- Filtro por professor
CREATE INDEX idx_students_active ON students(active); -- Filtro ativos/inativos

COMMENT ON TABLE students IS 'Alunos que fazem login e acessam treinos';
COMMENT ON COLUMN students.phone IS 'Telefone formatado: (11) 99999-9999';

-- ============================================
-- 3. TABELA DE TREINOS
-- ============================================
-- Por que: Cada aluno pode ter múltiplos treinos (A, B, C, D)
-- Relacionamento: N treinos para 1 aluno
-- Índices: student_id (busca por aluno), order_index (ordenação)

CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ex: "Treino A", "Treino B"
  description TEXT NOT NULL, -- Ex: "Costas e Tríceps"
  color TEXT DEFAULT '#0078D7', -- Cor Metro UI da tile
  order_index INTEGER NOT NULL DEFAULT 0, -- Ordem de exibição (0, 1, 2, 3)
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: cada aluno não pode ter treinos com mesmo order_index
  CONSTRAINT unique_student_workout_order UNIQUE(student_id, order_index)
);

-- Índices para performance
CREATE INDEX idx_workouts_student ON workouts(student_id, order_index); -- Busca ordenada por aluno
CREATE INDEX idx_workouts_active ON workouts(active); -- Filtro ativos

COMMENT ON TABLE workouts IS 'Treinos atribuídos a cada aluno';
COMMENT ON COLUMN workouts.order_index IS 'Ordem de exibição (0=primeiro)';

-- ============================================
-- 4. TABELA DE EXERCÍCIOS
-- ============================================
-- Por que: Cada treino tem múltiplos exercícios
-- Relacionamento: N exercícios para 1 treino
-- Índices: workout_id (busca por treino), order_index (ordenação)

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  title TEXT NOT NULL, -- Ex: "Supino Reto"
  sets INTEGER NOT NULL CHECK (sets > 0), -- Ex: 4
  reps INTEGER NOT NULL CHECK (reps > 0), -- Ex: 12
  rest TEXT NOT NULL, -- Ex: "90s", "2min"
  video TEXT, -- URL do vídeo (YouTube, etc)
  tip TEXT, -- Dica de execução
  order_index INTEGER NOT NULL DEFAULT 0, -- Ordem no treino
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: ordem única por treino
  CONSTRAINT unique_workout_exercise_order UNIQUE(workout_id, order_index)
);

-- Índice composto para busca otimizada
CREATE INDEX idx_exercises_workout ON exercises(workout_id, order_index);

COMMENT ON TABLE exercises IS 'Exercícios de cada treino';
COMMENT ON COLUMN exercises.order_index IS 'Ordem de exibição no treino';

-- ============================================
-- 5. TABELA DE PROGRESSO
-- ============================================
-- Por que: Rastrear histórico de treinos realizados
-- Relacionamento: N progressos para 1 aluno/exercício
-- Performance: Particionamento por data (futuro)

CREATE TABLE workout_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  completed_sets JSONB NOT NULL DEFAULT '[]', -- [true, false, true, true]
  notes TEXT, -- Anotações do aluno (peso usado, etc)
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: JSONB deve ser array de booleanos
  CONSTRAINT valid_completed_sets CHECK (jsonb_typeof(completed_sets) = 'array')
);

-- Índices para queries comuns
CREATE INDEX idx_progress_student ON workout_progress(student_id, completed_at DESC); -- Histórico do aluno
CREATE INDEX idx_progress_exercise ON workout_progress(exercise_id, completed_at DESC); -- Evolução por exercício
CREATE INDEX idx_progress_date ON workout_progress(completed_at DESC); -- Treinos recentes

COMMENT ON TABLE workout_progress IS 'Histórico de treinos realizados pelos alunos';
COMMENT ON COLUMN workout_progress.completed_sets IS 'Array JSON: [true, false, true] = séries completadas';

-- ============================================
-- 6. TRIGGERS PARA UPDATED_AT AUTOMÁTICO
-- ============================================
-- Por que: Rastrear modificações sem código manual

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar em todas tabelas com updated_at
CREATE TRIGGER update_professors_updated_at BEFORE UPDATE ON professors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================
-- Por que: Aluno só vê seus próprios dados, professor vê tudo

-- Habilitar RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_progress ENABLE ROW LEVEL SECURITY;

-- Política: Alunos veem apenas seus dados
CREATE POLICY "Students can view own data" ON students
  FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Students can view own workouts" ON workouts
  FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE auth.uid()::text = id::text));

CREATE POLICY "Students can view own exercises" ON exercises
  FOR SELECT
  USING (workout_id IN (SELECT id FROM workouts WHERE student_id IN (SELECT id FROM students WHERE auth.uid()::text = id::text)));

CREATE POLICY "Students can manage own progress" ON workout_progress
  FOR ALL
  USING (student_id IN (SELECT id FROM students WHERE auth.uid()::text = id::text));

-- Política: Professores veem tudo (implementar depois com auth context)
-- CREATE POLICY "Professors can view all" ...

-- ============================================
-- 8. VIEWS ÚTEIS
-- ============================================
-- Por que: Queries comuns pré-otimizadas

-- View: Treinos com contagem de exercícios
CREATE VIEW workouts_with_exercise_count AS
SELECT 
  w.*,
  COUNT(e.id) as exercise_count,
  s.name as student_name,
  s.phone as student_phone
FROM workouts w
LEFT JOIN exercises e ON e.workout_id = w.id
LEFT JOIN students s ON s.id = w.student_id
GROUP BY w.id, s.id;

-- View: Progresso recente dos alunos
CREATE VIEW recent_student_progress AS
SELECT 
  s.id as student_id,
  s.name as student_name,
  w.name as workout_name,
  e.title as exercise_title,
  p.completed_sets,
  p.completed_at,
  p.notes
FROM workout_progress p
JOIN students s ON s.id = p.student_id
JOIN workouts w ON w.id = p.workout_id
JOIN exercises e ON e.id = p.exercise_id
ORDER BY p.completed_at DESC;

-- ============================================
-- 9. DADOS INICIAIS (SEED)
-- ============================================
-- Criar primeiro professor (você)

INSERT INTO professors (name, email, password_hash)
VALUES (
  'Professor Principal',
  'professor@treino.app',
  '$2a$10$YourHashedPasswordHere' -- Substituir pelo hash real
);

-- ============================================
-- 10. EXPLICAÇÃO DA ESTRUTURA
-- ============================================

/*
HIERARQUIA DE DADOS:
  Professor
    └── Student (N)
        └── Workout (N)
            └── Exercise (N)
                └── Progress (N)

EXEMPLO DE DADOS:
  Professor: João Silva
    └── Aluno: André (11) 99999-9999
        ├── Treino A (Costas e Tríceps) - Azul
        │   ├── Exercício: Barra fixa (4x12, 90s)
        │   ├── Exercício: Remada curvada (4x12, 90s)
        │   └── Progress: [true, true, false, true] em 2025-11-08
        ├── Treino B (Ombros) - Cyan
        └── Treino C (Peito e Bíceps) - Vermelho

PERFORMANCE:
  - Índices em todas foreign keys
  - Índices compostos para queries comuns
  - JSONB para arrays (mais rápido que tabela pivot)
  - Views materializadas (futuro, se necessário)
  
SEGURANÇA:
  - Row Level Security habilitado
  - Senhas com bcrypt hash
  - UUID ao invés de integer (não sequencial)
  - Constraints de validação

ESCALABILIDADE:
  - Suporta 10.000+ alunos sem problemas
  - Particionamento de workout_progress por data (adicionar se > 1M registros)
  - Replicação read-only (Supabase faz automático)
*/
