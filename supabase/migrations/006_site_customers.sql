-- 006_site_customers.sql — customer accounts for destec.co.il (passwordless e-mail login).
--
-- Deliberately NOT Supabase Auth: several des-manager policies grant access to any
-- `authenticated` user of this project, so a customer login there could read business data.
-- Site customers get a magic link by e-mail and a signed cookie; these tables are service-role
-- only (RLS on, no policies). Orders are matched to the customer by e-mail (online_orders.customer).
create table if not exists public.site_customers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique check (email = lower(email)),
  name          text,
  phone         text,
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);
create table if not exists public.site_login_tokens (
  token_hash    text primary key,                        -- sha256 of the one-time token in the link
  email         text not null,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null,
  used_at       timestamptz
);
create index if not exists idx_site_login_tokens_email_created on public.site_login_tokens (email, created_at desc);
alter table public.site_customers enable row level security;
alter table public.site_login_tokens enable row level security;
comment on table public.site_customers is 'destec.co.il customer accounts (magic-link login); server-only';
comment on table public.site_login_tokens is 'one-time login tokens (hashed) for destec.co.il; server-only';
