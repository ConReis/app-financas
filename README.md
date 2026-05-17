# FinançasPessoais App

App de gestão financeira pessoal construído com Next.js 16, Supabase e shadcn/ui.

## Setup em 5 passos

### 1. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. No SQL Editor, execute o arquivo `supabase-schema.sql`
3. Copie a **Project URL** e a **anon key** em Settings → API

### 2. Configure as variáveis de ambiente

Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA-ANON-KEY
```

### 3. Instale as dependências e rode

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

### 4. Deploy na Vercel

1. Faça push para o GitHub
2. Importe no [vercel.com](https://vercel.com)
3. Adicione as variáveis de ambiente no painel da Vercel
4. Deploy automático!

## Funcionalidades

- **Landing Page** — Apresentação do app com preview do dashboard
- **Autenticação** — Login e cadastro com Supabase Auth
- **Dashboard** — Cards de resumo (receitas, despesas, saldo) + gráfico de pizza por categoria
- **Transações** — CRUD completo com filtros por mês/ano/categoria/tipo e busca
- **Exportar CSV** — Exporte as transações filtradas para planilha
- **Responsivo** — Funciona no celular e desktop

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (componentes manuais)
- **Recharts** (gráficos)
- **Supabase** (auth + banco de dados PostgreSQL + RLS)
- **Vercel** (deploy)
