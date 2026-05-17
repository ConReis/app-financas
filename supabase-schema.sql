-- FinançasPessoais App - Supabase Schema
-- Execute este SQL no Supabase SQL Editor

-- Tabela de transações
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  date date not null,
  type text not null check (type in ('receita', 'despesa')),
  category text not null check (category in (
    'Alimentação', 'Transporte', 'Moradia', 'Lazer',
    'Saúde', 'Educação', 'Salário', 'Freelance', 'Outros'
  )),
  created_at timestamptz default now() not null
);

-- Row Level Security
alter table public.transactions enable row level security;

-- Políticas RLS: cada usuário só vê/edita suas próprias transações
create policy "Usuários veem suas transações"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Usuários criam suas transações"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Usuários editam suas transações"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuários excluem suas transações"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Índices para performance
create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_date on public.transactions(date);
create index if not exists idx_transactions_type on public.transactions(type);
