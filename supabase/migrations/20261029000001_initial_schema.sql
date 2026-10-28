-- SafetyWithAthar Supabase Schema & RLS Migration
-- File: supabase/migrations/20261029000001_initial_schema.sql

create extension if not exists "pgcrypto";

-- 1. Admin Allowlist Table (Single Authorized Owner UUID)
create table if not exists public.admin_allowlist (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admin_allowlist enable row level security;

create policy "Allowlisted admins can read own record"
  on public.admin_allowlist
  for select
  to authenticated
  using (auth.uid() = user_id);

-- 2. Portfolio Samples Table
create table if not exists public.portfolio_samples (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null check (char_length(title) between 3 and 180),
  slug text not null unique,
  category text not null check (category in ('hse_docs', 'cold_email')),
  sample_type text not null,
  summary text not null check (char_length(summary) >= 15),
  description text not null default '',
  tags text[] not null default '{}',
  storage_path text,
  thumbnail_path text,
  file_type text not null default 'pdf',
  source_label text not null default 'Public-source demo sample',
  revision_label text not null default 'Rev. 0 • For review only',
  sort_order integer not null default 100,
  is_published boolean not null default false,
  permission_confirmed boolean not null default false,
  constraint published_requires_permission check (
    (is_published = false) or (permission_confirmed = true)
  )
);

create index if not exists idx_portfolio_samples_published_sort
  on public.portfolio_samples (is_published, category, sort_order);

alter table public.portfolio_samples enable row level security;

-- Public visitors can only SELECT published & permission-confirmed metadata
create policy "Public can select published samples only"
  on public.portfolio_samples
  for select
  to anon, authenticated
  using (is_published = true and permission_confirmed = true);

-- Allowlisted admin has full CRUD access
create policy "Allowlisted admin full access to samples"
  on public.portfolio_samples
  for all
  to authenticated
  using (exists (select 1 from public.admin_allowlist a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_allowlist a where a.user_id = auth.uid()));

-- 3. Inquiries Table (Deny direct anonymous table reads/writes; insert via Edge Function)
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 5 and 160),
  service text not null check (service in ('cold_email', 'hse_docs')),
  package text not null check (package in ('basic', 'standard', 'premium', 'custom')),
  message text not null check (char_length(message) between 20 and 3000),
  page_source text not null default '/safetywithathar/',
  idempotency_token text unique,
  notification_status text not null default 'pending' check (
    notification_status in ('pending', 'sent', 'failed_or_unconfigured')
  ),
  notification_error_code text,
  notified_at timestamptz
);

create index if not exists idx_inquiries_created_at
  on public.inquiries (created_at desc);

alter table public.inquiries enable row level security;

-- Only allowlisted admin can view inquiries; anonymous visitors have zero direct table access
create policy "Allowlisted admin can view inquiries"
  on public.inquiries
  for select
  to authenticated
  using (exists (select 1 from public.admin_allowlist a where a.user_id = auth.uid()));
