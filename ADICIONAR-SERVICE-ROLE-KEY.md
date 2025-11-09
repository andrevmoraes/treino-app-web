# 🔑 Adicionar Service Role Key

Para permitir que o professor cadastre alunos, você precisa adicionar a **Service Role Key** no `.env.local`.

## 📋 Como Pegar a Key:

1. Acesse: https://supabase.com
2. Entre no seu projeto
3. No menu lateral, clique em **"Settings"** (⚙️)
4. Clique em **"API"**
5. Procure por **"service_role"** (⚠️ secret key)
6. Copie a chave que começa com `eyJ...`

## ✏️ Adicione no `.env.local`:

Abra o arquivo `.env.local` e adicione esta linha:

```bash
# Service Role Key (NUNCA compartilhar ou commitar!)
SUPABASE_SERVICE_ROLE_KEY=cole_a_chave_aqui
```

**Exemplo:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://liefsocnyrnreqcdmnhs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
NEXT_PUBLIC_DEFAULT_PROFESSOR_ID=8252cc24-f922-41e8-bdd9-3b477566143e

# Service Role Key (bypass RLS - server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZWZzb2NueXJucmVxY2RtbmhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTg3ODQyNiwiZXhwIjoyMDc3NDU0NDI2fQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

ADMIN_EMAIL=professor@treino.app
ADMIN_PASSWORD_HASH=$2b$10$cKYgPdOWgjw7pms/8wkbLeZOmCFxpl4wBFIdHAKrIU.bUH3rfc8lO
```

## 🔒 Segurança:

- ⚠️ **NUNCA** exponha essa key no frontend
- ⚠️ **NUNCA** commite essa key no git
- ✅ Use apenas em API routes (server-side)
- ✅ Já está no `.gitignore` (`.env.local`)

## 🔄 Reinicie o servidor:

Depois de adicionar a key, reinicie o servidor:

```bash
Ctrl+C (parar)
npm run dev (reiniciar)
```

---

**📝 Depois de adicionar, me avise que eu atualizo o modal!**
