-- ============================================================
-- Media Naranja — Esquema Supabase
-- Ejecutá TODO este archivo en: Supabase > SQL Editor > New query > Run
-- ============================================================

-- 1) Tabla de productos ---------------------------------------
create table if not exists public.productos (
  id             uuid primary key default gen_random_uuid(),
  linea          text not null check (linea in ('limpieza','hogar')),
  categoria      text not null,
  categoria_label text not null,
  nombre         text not null,
  slug           text not null,
  descripcion    text default '',
  specs          jsonb default '{}'::jsonb,
  imagenes       jsonb default '[]'::jsonb,
  comprar_url    text default 'https://www.medianaranja.store',
  orden          int  default 0,
  created_at     timestamptz default now()
);

create index if not exists productos_linea_idx on public.productos (linea, orden);

-- 2) Row Level Security ---------------------------------------
alter table public.productos enable row level security;

-- Lectura pública (catálogo abierto para cualquiera)
drop policy if exists "lectura publica" on public.productos;
create policy "lectura publica"
  on public.productos for select
  using (true);

-- Escritura SOLO para usuarios autenticados (el admin logueado)
drop policy if exists "escritura admin insert" on public.productos;
create policy "escritura admin insert"
  on public.productos for insert
  to authenticated
  with check (true);

drop policy if exists "escritura admin update" on public.productos;
create policy "escritura admin update"
  on public.productos for update
  to authenticated
  using (true) with check (true);

drop policy if exists "escritura admin delete" on public.productos;
create policy "escritura admin delete"
  on public.productos for delete
  to authenticated
  using (true);

-- 3) Storage bucket para las fotos ----------------------------
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- Lectura pública de las imágenes
drop policy if exists "imagenes lectura publica" on storage.objects;
create policy "imagenes lectura publica"
  on storage.objects for select
  using (bucket_id = 'productos');

-- Subir / borrar imágenes SOLO autenticado
drop policy if exists "imagenes admin insert" on storage.objects;
create policy "imagenes admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'productos');

drop policy if exists "imagenes admin update" on storage.objects;
create policy "imagenes admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'productos');

drop policy if exists "imagenes admin delete" on storage.objects;
create policy "imagenes admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'productos');

-- ============================================================
-- LISTO. Después:
--   • Authentication > Providers > Email: activá "Email".
--     Desactivá "Enable email signups" para que NADIE pueda auto-registrarse.
--   • Authentication > Users > "Add user": creá tu usuario admin
--     (email + contraseña). Ese es el único login del panel.
-- ============================================================
