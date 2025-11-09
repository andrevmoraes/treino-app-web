# 📚 Feature: Biblioteca de Exercícios (Exercise Library)

## ✅ Implementação Completa

Sistema de templates reutilizáveis de exercícios para professores, com importação automática do YouTube.

---

## 📋 Passo 1: Executar SQL no Supabase

Acesse **Supabase Dashboard** → **SQL Editor** e execute:

```sql
-- (Copie todo o conteúdo de supabase/migrations/004_exercise_templates.sql)
```

Arquivo completo: `supabase/migrations/004_exercise_templates.sql`

---

## 🎬 Passo 2: Importar Vídeos do YouTube (Opcional)

### 2.1 Obter YouTube API Key

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione existente
3. Vá em **APIs & Services** → **Enable APIs**
4. Busque e ative: **YouTube Data API v3**
5. Vá em **Credentials** → **Create Credentials** → **API Key**
6. Copie a API Key gerada

### 2.2 Configurar .env.local

Adicione no arquivo `.env.local`:

```env
YOUTUBE_API_KEY=sua_api_key_aqui
```

### 2.3 Executar Importação

```bash
# Obter o professor_id do banco
# Depois executar:
node import-youtube-videos.js <8252cc24-f922-41e8-bdd9-3b477566143e>
```

O script vai:
- ✅ Buscar todos os Shorts do canal @MaddaloniPersonal
- ✅ Categorizar automaticamente (peito, costas, pernas, etc)
- ✅ Extrair thumbnails
- ✅ Inserir na biblioteca do professor

---

## 🎯 Funcionalidades

### Tabela `exercise_templates`:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| professor_id | UUID | Dono da biblioteca |
| name | TEXT | Nome do exercício |
| description | TEXT | Descrição detalhada |
| video_url | TEXT | YouTube URL |
| thumbnail_url | TEXT | Miniatura do vídeo |
| category | TEXT | Categoria (peito, costas, pernas...) |
| muscle_group | TEXT | Músculo alvo |
| equipment | TEXT | Equipamento necessário |
| difficulty | TEXT | iniciante/intermediário/avançado |
| default_sets | INT | Séries padrão (ex: 3) |
| default_reps | INT | Repetições padrão (ex: 12) |
| default_rest | TEXT | Descanso padrão (ex: "90s") |
| tip | TEXT | Dica de execução |
| usage_count | INT | Contador de uso (analytics) |

### Recursos:

- ✅ CRUD completo de templates
- ✅ Categorização automática
- ✅ Filtro por categoria
- ✅ Busca por nome
- ✅ Contador de uso (exercícios mais populares)
- ✅ Soft delete (is_active)
- ✅ Trigger automático para incrementar usage_count

---

## 📁 Arquivos Criados

### Backend (API):
- `app/api/exercise-templates/list/route.ts` - Listar templates (com filtros)
- `app/api/exercise-templates/create/route.ts` - Criar template
- `app/api/exercise-templates/update/route.ts` - Atualizar template
- `app/api/exercise-templates/delete/route.ts` - Soft delete

### Scripts:
- `import-youtube-videos.js` - Importação automática do YouTube
- `supabase/migrations/004_exercise_templates.sql` - Migration SQL

### Próximos Passos (UI):
- [ ] Página `/admin/exercise-library` (CRUD interface)
- [ ] Modificar modal de exercício para permitir seleção da biblioteca
- [ ] Adicionar filtros e busca
- [ ] Cards com thumbnails dos vídeos

---

## 🔄 Integração com Exercises

Quando o professor usa um template para criar um exercício:

1. Seleciona "Supino Reto" da biblioteca
2. Campos pré-preenchidos:
   - Nome: "Supino Reto"
   - Vídeo: URL do YouTube
   - Séries: 3
   - Reps: 12
   - Descanso: 90s
3. Professor pode ajustar para o aluno específico
4. Salva em `exercises` com `template_id` preenchido
5. `usage_count` incrementa automaticamente

---

## 📊 Analytics Futuras

Com `usage_count` você pode:
- Ver exercícios mais populares
- Sugerir exercícios baseado no histórico
- Dashboard de uso da biblioteca
- Exercícios nunca usados (limpar biblioteca)

---

## 🚀 Próximos Passos

1. ✅ SQL executado no Supabase
2. ⏳ Obter YouTube API Key (opcional)
3. ⏳ Importar vídeos do canal
4. ⏳ Criar UI da biblioteca (/admin/exercise-library)
5. ⏳ Modificar modal de exercício

**Status atual:** Backend completo, aguardando UI! 🎯
