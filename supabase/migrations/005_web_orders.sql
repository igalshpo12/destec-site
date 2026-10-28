-- 005_web_orders.sql — orders placed on destec.co.il that are PAID ONLINE through Credit2000
-- (D.C.S, terminal 5432336 — the same terminal des-manager charges on).
--
-- Lives in the Supabase project the site shares with des-manager. The site's publishable key is
-- public (vercel.json), so RLS is ON with NO policies: only the server (service role) reads or
-- writes this table. The card itself is typed on Credit2000's hosted page — no card number ever
-- reaches this table; the gateway's token is NOT stored either (the site never refunds — a refund
-- is done in the Credit2000 portal and the receipt handled in des-manager).
create table if not exists public.web_orders (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  ref             text not null unique,                 -- WEB-YYYYMMDD-XXXX, shown to the customer
  order_ref       text not null unique                  -- Credit2000 product_Id: exactly 16 digits
                  check (order_ref ~ '^[0-9]{16}$'),
  status          text not null default 'pending'       -- pending → approved | declined | error | abandoned
                  check (status in ('pending', 'approved', 'declined', 'error', 'abandoned')),
  amount_agorot   integer not null check (amount_agorot > 0),  -- incl. VAT, re-priced from catalog_products
  customer        jsonb not null,                       -- {name, phone, email, clinic, address, notes}
  lines           jsonb not null,                       -- [{id, item_number, name, manufacturer, qty, unit_price}]
  gateway_uid     text,                                 -- the hosted page's params=<uid>
  gateway_raw     text,                                 -- the one getTokenAndApprovePro answer, verbatim (read-once!)
  gateway_return_code text,
  approval        text,
  card_brand      text,
  verifying_at    timestamptz,                          -- claim: one verifier at a time (Pro answer is read-once)
  resolved_at     timestamptz,
  notified_at     timestamptz,                          -- the order e-mail to DES went out
  error_text      text
);
create index if not exists idx_web_orders_status_created on public.web_orders (status, created_at desc);
alter table public.web_orders enable row level security;
-- no policies on purpose: service role only
comment on table public.web_orders is 'destec.co.il online orders paid via Credit2000; server-only (RLS, no policies)';
