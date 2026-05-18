# FinançasPessoais App

App de gestão financeira pessoal — Next.js 16, Supabase, Tailwind CSS v4 e Recharts.

---

## Deploy na Vercel (produção)

### 1. Conecte o repositório

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **Add New → Project**
3. Importe o repositório `ConReis/app-financas` do GitHub
4. A Vercel detecta Next.js automaticamente — **não altere nada**

### 2. Configure as variáveis de ambiente

Na tela de import (ou depois em **Settings → Environment Variables**), adicione:

| Nome | Valor | Onde obter |
|------|-------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` | Supabase → Settings → API → anon key |

> **Segurança:** As chaves `NEXT_PUBLIC_*` são variáveis públicas do Supabase (anon/publishable key),
> projetadas para uso no browser e protegidas pelas políticas RLS do banco de dados.
> A `service_role key` (que bypassa RLS) **nunca** é usada neste projeto.

### 3. Deploy

Clique em **Deploy**. A Vercel vai:
- Instalar dependências
- Rodar `npm run build`
- Publicar em `https://seu-projeto.vercel.app`

Deploys futuros acontecem **automaticamente** a cada push na branch `master`.

### 4. Configure o Supabase para produção

No painel do Supabase → **Authentication → URL Configuration**:

- **Site URL**: `https://seu-projeto.vercel.app`
- **Redirect URLs**: adicione `https://seu-projeto.vercel.app/auth/callback`

---

## Desenvolvimento local

### Pré-requisitos

- Node.js 20+
- Conta no [Supabase](https://supabase.com)

### Setup

```bash
# 1. Clone o repositório
git clone https://github.com/ConReis/app-financas.git
cd app-financas

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp env.template .env.local
# Edite .env.local com suas credenciais do Supabase

# 4. Crie a tabela no Supabase
# Execute o conteúdo de supabase-schema.sql no SQL Editor do Supabase

# 5. Rode o app
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Estrutura do projeto

```
app/
├── page.tsx                    # Landing page
├── auth/
│   ├── login/page.tsx          # Login
│   ├── register/page.tsx       # Cadastro + aviso de confirmação de e-mail
│   └── callback/route.ts       # Handler do link de confirmação
└── (dashboard)/
    ├── layout.tsx              # Layout autenticado com sidebar
    ├── dashboard/page.tsx      # Dashboard com cards e gráfico
    └── transactions/page.tsx   # CRUD de transações

components/
├── ui/                         # Button, Card, Dialog, Select, Toast, ThemeToggle...
├── layout/sidebar.tsx          # Sidebar responsiva + toggle dark mode
├── dashboard/dashboard-client.tsx   # Cards + gráfico de pizza (Recharts)
└── transactions/
    ├── transactions-client.tsx # Tabela + filtros + exportar CSV
    └── transaction-form.tsx    # Formulário de criação/edição

lib/
├── supabase/
│   ├── client.ts               # Cliente Supabase (browser)
│   └── server.ts               # Cliente Supabase (servidor, usa cookies)
├── types.ts                    # Tipos TypeScript + categorias
└── utils.ts                    # cn(), formatCurrency(), formatDate(), downloadCSV()

proxy.ts                        # Proteção de rotas (Next.js 16)
supabase-schema.sql             # Schema SQL com RLS
env.template                    # Template de variáveis de ambiente
```

---

## Stack

| Tecnologia | Versão | Função |
|-----------|--------|--------|
| Next.js | 16 | Framework fullstack (App Router) |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 4 | Estilização |
| Supabase | 2 | Auth + PostgreSQL + RLS |
| Recharts | 3 | Gráfico de pizza no dashboard |
| Vercel | — | Deploy e hospedagem |
