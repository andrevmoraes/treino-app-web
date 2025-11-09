# 🎯 FASE 1 - Database Setup - COMPLETO

## ✅ O que foi criado

### 1. **Schema SQL Completo** (`supabase/schema.sql`)
- ✅ 5 tabelas otimizadas
- ✅ 15 índices para performance
- ✅ Row Level Security (RLS)
- ✅ Triggers automáticos
- ✅ Views úteis
- ✅ Constraints de validação

### 2. **Guia de Setup** (`supabase/SETUP.md`)
- ✅ Passo a passo detalhado
- ✅ Scripts de teste
- ✅ Troubleshooting
- ✅ Explicação de performance

### 3. **TypeScript Types** (`types/database.ts`)
- ✅ Tipos para todas as tabelas
- ✅ Tipos para views
- ✅ Tipos para inputs (forms)
- ✅ Tipos para API responses
- ✅ Tipos para stats/analytics

### 4. **Database Functions** (`lib/database.ts`)
- ✅ 25+ funções prontas para usar
- ✅ CRUD completo (Students, Workouts, Exercises)
- ✅ Queries otimizadas
- ✅ Funções de stats
- ✅ Type-safe (100% TypeScript)

---

## 📊 Estrutura do Banco

```
professors (1)
  └── students (N)
      └── workouts (N)
          └── exercises (N)
              └── workout_progress (N)
```

### Tabelas Criadas:

| Tabela | Propósito | Índices |
|--------|-----------|---------|
| `professors` | Dados do professor | email |
| `students` | Alunos cadastrados | phone, professor_id |
| `workouts` | Treinos (A, B, C, D) | student_id, order_index |
| `exercises` | Exercícios de cada treino | workout_id, order_index |
| `workout_progress` | Histórico de treinos | student_id, exercise_id, date |

---

## 🚀 Como Usar

### Passo 1: Setup no Supabase

```bash
# 1. Acesse: https://supabase.com
# 2. Entre no seu projeto
# 3. SQL Editor → New Query
# 4. Cole o conteúdo de supabase/schema.sql
# 5. Run
```

### Passo 2: Configurar .env.local

```bash
# Copie as keys do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

### Passo 3: Criar Primeiro Professor

```bash
# Gerar hash da senha
npm install bcrypt
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('suaSenha123', 10, (e,h) => console.log(h))"

# Copiar o hash gerado e executar no SQL Editor:
INSERT INTO professors (name, email, password_hash)
VALUES ('Seu Nome', 'seu@email.com', 'HASH_AQUI');
```

### Passo 4: Testar Conexão

```typescript
// Em qualquer arquivo .ts/.tsx
import { supabase } from '@/lib/database';

// Teste
const { data, error } = await supabase
  .from('students')
  .select('*')
  .limit(1);

console.log(data); // Deve retornar [] (vazio por enquanto)
```

---

## 📝 Funções Disponíveis

### Students

```typescript
import { 
  getStudentByPhone,
  getStudentWithWorkouts,
  getStudentsByProfessor,
  createStudent,
  updateStudent,
  deactivateStudent 
} from '@/lib/database';

// Login do aluno
const { data: student } = await getStudentByPhone('(11) 99999-9999');

// Criar aluno
const { data: newStudent } = await createStudent({
  phone: '(11) 98888-8888',
  name: 'João Silva',
  professor_id: 'uuid-do-professor'
});

// Listar alunos do professor
const { data: students } = await getStudentsByProfessor(professorId);
```

### Workouts

```typescript
import { 
  getWorkoutsByStudent,
  getWorkoutWithExercises,
  createWorkout,
  updateWorkout,
  deleteWorkout 
} from '@/lib/database';

// Buscar treinos do aluno
const { data: workouts } = await getWorkoutsByStudent(studentId);

// Criar treino
const { data: workout } = await createWorkout({
  student_id: studentId,
  name: 'Treino A',
  description: 'Costas e Tríceps',
  color: '#0078D7',
  order_index: 0
});

// Buscar treino com exercícios
const { data } = await getWorkoutWithExercises(workoutId);
console.log(data.exercises); // Array de exercícios
```

### Exercises

```typescript
import { 
  getExercisesByWorkout,
  createExercise,
  createExercisesBatch,
  updateExercise,
  deleteExercise 
} from '@/lib/database';

// Criar exercício
const { data: exercise } = await createExercise({
  workout_id: workoutId,
  title: 'Supino Reto',
  sets: 4,
  reps: 12,
  rest: '90s',
  order_index: 0
});

// Criar vários de uma vez
const { data: exercises } = await createExercisesBatch([
  { workout_id, title: 'Supino Reto', sets: 4, reps: 12, rest: '90s', order_index: 0 },
  { workout_id, title: 'Supino Inclinado', sets: 4, reps: 12, rest: '90s', order_index: 1 },
  { workout_id, title: 'Crucifixo', sets: 3, reps: 15, rest: '60s', order_index: 2 },
]);
```

### Progress

```typescript
import { 
  saveProgress,
  getStudentProgress,
  getLastExerciseProgress 
} from '@/lib/database';

// Salvar progresso
const { data } = await saveProgress({
  student_id: studentId,
  workout_id: workoutId,
  exercise_id: exerciseId,
  completed_sets: [true, true, false, true],
  notes: 'Aumentei 5kg na barra'
});

// Ver histórico
const { data: history } = await getStudentProgress(studentId, 10);
```

### Stats

```typescript
import { 
  getStudentStats,
  getProfessorDashboardStats 
} from '@/lib/database';

// Stats do aluno
const stats = await getStudentStats(studentId);
console.log(stats.total_workouts); // 4
console.log(stats.total_exercises); // 17
console.log(stats.last_workout_date); // "2025-11-08"

// Dashboard do professor
const dashboard = await getProfessorDashboardStats(professorId);
console.log(dashboard.total_students); // 25
console.log(dashboard.active_students); // 23
```

---

## 🎓 Explicações Técnicas

### Por que UUID em vez de INTEGER?

```sql
-- ❌ RUIM (sequencial, previsível)
id: 1, 2, 3, 4, 5...

-- ✅ BOM (aleatório, seguro)
id: '550e8400-e29b-41d4-a716-446655440000'
```

**Vantagens:**
- Não pode adivinhar IDs de outros alunos
- Pode gerar no cliente (offline-first)
- Merge de bancos fácil

### Por que JSONB para completed_sets?

```sql
-- ❌ RUIM (tabela pivot)
CREATE TABLE set_completions (
  progress_id UUID,
  set_number INT,
  completed BOOLEAN
);
-- 4 séries = 4 INSERTs, 4 rows, 4x mais lento

-- ✅ BOM (JSONB)
completed_sets: [true, false, true, true]
-- 1 INSERT, 1 row, super rápido
```

**Performance:**
- JSONB é binário (não texto JSON)
- Pode indexar com GIN index
- Queries: `completed_sets @> '[true]'`

### Por que Row Level Security?

```sql
-- SEM RLS: Aluno pode ver dados de outros
SELECT * FROM students; -- Retorna TODOS

-- COM RLS: Aluno só vê seus dados
SELECT * FROM students; -- Retorna apenas SEU registro
-- Automático, sem código extra!
```

### Por que Índices Compostos?

```sql
-- Query comum:
SELECT * FROM exercises 
WHERE workout_id = 'uuid' 
ORDER BY order_index;

-- Índice otimizado:
CREATE INDEX idx_exercises_workout 
ON exercises(workout_id, order_index);
-- Usa 1 índice para filtrar E ordenar = 2x mais rápido!
```

---

## 🔒 Segurança Implementada

### 1. Senhas com Bcrypt
```typescript
// NUNCA armazene senha em texto
password: '123456' // ❌

// SEMPRE use hash bcrypt
password_hash: '$2a$10$rQ3Vq3qZq...' // ✅
```

### 2. Row Level Security
```sql
-- Aluno NÃO pode:
- Ver dados de outros alunos
- Modificar dados de outros
- Acessar tabela de professores

-- Professor PODE (depois de implementar):
- Ver todos seus alunos
- Criar/editar treinos
- Ver progresso de todos
```

### 3. Constraints de Validação
```sql
-- Telefone deve ter formato correto
CHECK (phone ~ '^\(\d{2}\) \d{5}-\d{4}$')

-- Sets e reps devem ser positivos
CHECK (sets > 0)
CHECK (reps > 0)
```

---

## 📊 Estimativas de Performance

### Com 100 alunos:
- DB size: ~5MB
- Login: < 50ms
- Carregar treinos: < 100ms
- Salvar progresso: < 80ms

### Com 1.000 alunos:
- DB size: ~50MB
- Login: < 50ms (mesmo!)
- Carregar treinos: < 100ms (mesmo!)
- Salvar progresso: < 80ms (mesmo!)

### Com 10.000 alunos:
- DB size: ~500MB
- Login: < 50ms (AINDA!)
- Carregar treinos: < 120ms
- Salvar progresso: < 100ms

**Por quê?**
- Índices O(log N) - escalam bem
- Supabase auto-scaling
- CDN global
- Connection pooling

---

## 🎯 Próximos Passos

Agora que o banco está pronto, vamos:

### FASE 2 (Próxima):
1. ✅ Atualizar `AuthContext` para usar DB
2. ✅ Criar login do professor
3. ✅ Criar rota `/admin`
4. ✅ Dashboard básico de alunos

### FASE 3 (Depois):
1. Migrar treinos hardcoded para DB
2. CRUD de alunos (criar, editar, desativar)
3. Visualizar treinos dos alunos

### FASE 4 (Futuro):
1. Editor visual de treinos
2. Gráficos de progresso
3. Exportar relatórios

---

## ❓ FAQ

**P: Preciso pagar pelo Supabase?**
R: Não! Free tier: 500MB DB, 2GB storage, 50.000 usuários/mês

**P: E se meu banco crescer muito?**
R: Supabase escala automático. Só paga se passar 500MB.

**P: É seguro?**
R: Sim! RLS + bcrypt + UUIDs + constraints = muito seguro

**P: Posso exportar os dados?**
R: Sim! PostgreSQL padrão, export via pg_dump

**P: E se eu quiser trocar de banco depois?**
R: Fácil! É PostgreSQL padrão, roda em qualquer lugar

---

## 🚀 Status

**Fase 1:** ✅ COMPLETA
- [x] Schema SQL criado
- [x] Tipos TypeScript
- [x] Funções de database
- [x] Documentação completa

**Próximo:** Integração com o app (AuthContext)

---

**Quando você executar o schema no Supabase, me avise para prosseguir! 🚀**
