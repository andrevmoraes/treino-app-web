# 🚀 FASE 3 - MIGRAÇÃO E CRUD DE TREINOS

## ⚡ Primeiro Passo: Criar Aluno de Teste

**IMPORTANTE:** Antes de migrar os treinos, você precisa criar um aluno!

### Opção 1: Via App (Recomendado)

```
1. Acesse: http://localhost:3001/login
2. Telefone: (11) 99999-9999
3. Nome: André Moraes (ou seu nome)
4. Clique em CADASTRAR E ENTRAR
```

### Opção 2: Via SQL (Supabase Dashboard)

```sql
-- No Supabase → SQL Editor
INSERT INTO students (phone, name, professor_id, active)
VALUES (
  '(11) 99999-9999',
  'André Moraes',
  '8252cc24-f922-41e8-bdd9-3b477566143e',
  true
);
```

---

## 🔄 Migrar Treinos para o Banco

**Depois de criar o aluno**, execute:

```bash
node migrate-workouts.js
```

**Resultado esperado:**
```
🚀 Iniciando migração de treinos...
✅ Encontrados 1 aluno(s)

📝 Migrando treinos para: André Moraes ((11) 99999-9999)
   ✅ Treino A criado
   ✅ 6 exercícios adicionados
   
   ✅ Treino B criado
   ✅ 3 exercícios adicionados
   
   ✅ Treino C criado
   ✅ 4 exercícios adicionados
   
   ✅ Treino D criado
   ✅ 4 exercícios adicionados

🎉 Migração concluída!

📊 Resumo:
   Alunos: 1
   Treinos: 4
   Exercícios: 17
```

---

## 🧪 Teste Agora

### 1️⃣ **Teste Login do Professor**

```
URL: http://localhost:3001/admin/login

Email: professor@treino.app
Senha: 12345678

✅ Deve entrar no dashboard com lista de alunos
```

### 2️⃣ **Teste Login de Aluno Novo**

```
URL: http://localhost:3001/login

Telefone: (11) 98888-8888
Nome: João Silva (vai pedir quando não encontrar)

✅ Deve criar aluno e entrar no app
```

### 3️⃣ **Teste Login de Aluno Existente**

```
URL: http://localhost:3001/login

Telefone: (11) 99999-9999 (mesmo de antes)

✅ Deve entrar direto sem pedir nome
```

---

## 📂 Scripts Criados

```
migrate-workouts.js        → Migra treinos A, B, C, D para o banco
create-test-student.js     → Tenta criar aluno (bloqueado por RLS)
```

---

## 🎯 Próximos Passos

**Após migração:**
- [ ] Atualizar /home para buscar treinos do banco
- [ ] Atualizar páginas de treino individuais
- [ ] Criar CRUD de treinos (professor)
- [ ] Criar CRUD de exercícios (professor)

---

**🚀 Crie o aluno primeiro e depois rode a migração!**
