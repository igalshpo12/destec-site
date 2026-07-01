-- Public marketing catalog table for destec.co.il.
-- Fully decoupled from the internal `equipment` registry (which the des-manager
-- app uses for invoicing via is_active). This table is populated from the
-- Konimbo storefront export and is the ONLY source the public site reads.
--
-- Run once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query -> Run).

create table if not exists public.catalog_products (
  id             uuid primary key default gen_random_uuid(),
  konimbo_id     text unique not null,          -- source id, for idempotent upserts
  item_number    text,                          -- Konimbo SKU
  name_he        text not null,
  name_en        text,
  manufacturer   text,
  model          text,
  category       text,
  description_he text,
  description_en text,
  image_url      text,
  price          numeric(12,2),
  currency       text default 'ILS',
  is_active      boolean default true,          -- catalog visibility (independent of equipment.is_active)
  sort_order     int,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index if not exists idx_catalog_products_active   on public.catalog_products(is_active);
create index if not exists idx_catalog_products_category on public.catalog_products(category);
create index if not exists idx_catalog_products_manuf    on public.catalog_products(manufacturer);

-- Public read of active products (site uses the anon / publishable key).
alter table public.catalog_products enable row level security;

drop policy if exists "public read active catalog" on public.catalog_products;
create policy "public read active catalog"
  on public.catalog_products
  for select
  to anon, authenticated
  using (is_active = true);
