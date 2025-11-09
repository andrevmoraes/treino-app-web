# Treino App - Next.js Web

App de treinos estilo Windows Phone Metro UI, migrado de React Native (Expo) para Next.js 15.

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

Acesse: **http://localhost:3000**

## 📱 Funcionalidades

- ✅ **Autenticação Simplificada**: Login apenas com telefone (sem senha)
- ✅ **4 Treinos Completos**: Treino A (Costas), B (Ombros), C (Peito), D (Pernas)
- ✅ **Metro UI**: Design estilo Windows Phone com tiles coloridos
- ✅ **Tema Claro/Escuro/Sistema**: Alternância de tema com persistência
- ✅ **Tracking de Progresso**: Checkboxes para marcar séries completadas (em memória da sessão)
- ✅ **Responsivo**: Mobile-first, otimizado para celular
- ✅ **Links para Vídeos**: Cada exercício tem link para YouTube

## 🏗️ Estrutura do Projeto

```
app/
  ├── layout.tsx          # Layout raiz com providers
  ├── page.tsx            # Página de redirecionamento
  ├── login/              # Página de login (telefone)
  ├── home/               # Home com tiles dos 4 treinos
  ├── treino-a/           # Treino A: Costas e Tríceps
  ├── treino-b/           # Treino B: Ombros
  ├── treino-c/           # Treino C: Peito e Bíceps
  ├── treino-d/           # Treino D: Pernas e Core
  └── perfil/             # Perfil com logout e troca de tema

components/
  └── exercise-card.tsx   # Card de exercício com checkboxes

contexts/
  ├── auth-context.tsx    # Contexto de autenticação (Supabase)
  └── theme-context.tsx   # Contexto de tema (claro/escuro/sistema)

constants/
  ├── workouts.ts         # Configuração dos 4 treinos
  ├── metro-styles.ts     # Cores e espaçamentos Metro UI
  └── theme.ts            # Definições de tema

types/
  ├── exercise.ts         # Interface Exercise
  └── workout-data.ts     # Dados hardcoded dos treinos
```

## 🎨 Design

- **Fonte**: Segoe UI (Metro UI)
- **Cores**: Blue (#0078D7), Cyan (#00B7C3), Red (#E81123), Green (#107C10)
- **Estilo**: Tiles quadrados, tipografia lowercase, minimal

## 🔐 Autenticação

Configurado com **Supabase**:
- URL: `https://liefsocnyrnreqcdmnhs.supabase.co`
- Método: Login anônimo com telefone armazenado em metadata
- **Próximos passos**: Implementar OTP via SMS

## 📝 To-Do Futuro

- [ ] Implementar autenticação real com OTP/SMS
- [ ] Salvar progresso dos treinos no Supabase
- [ ] Adicionar histórico de treinos
- [ ] Adicionar mais informações de perfil
- [ ] PWA (Progressive Web App)
- [ ] Notificações push

## 🚀 Deploy

O projeto está pronto para deploy na **Vercel**:

```bash
# Instalar Vercel CLI (se necessário)
npm i -g vercel

# Deploy
vercel
```

Ou conecte o repositório GitHub diretamente na Vercel.

## 🔧 Variáveis de Ambiente

Criar arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://liefsocnyrnreqcdmnhs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu_anon_key
```

## � Licença

MIT


This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
