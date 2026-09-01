-- ============================================================================
-- Media Naranja — Setup completo de Supabase
-- Proyecto: dqlixhlsbyofejjqexzl (cuenta del cliente)
--
-- Cómo usarlo: Supabase Dashboard > SQL Editor > New query > pegar TODO > Run.
-- Es idempotente: se puede volver a ejecutar sin romper nada.
--
-- Reemplaza a schema.sql (lo incluye + la capa de autorización de admins).
-- Después de correr esto, ver el bloque "PASOS EN EL DASHBOARD" al final.
-- ============================================================================


-- ============================================================================
-- 1) AUTORIZACIÓN — quién es admin
-- ============================================================================
-- No alcanza con "estar logueado": sólo los usuarios listados en public.admins
-- pueden escribir. Así, aunque alguien logre registrarse, no puede tocar nada.

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Chequeo de admin. SECURITY DEFINER para que la policy pueda leer la tabla
-- sin quedar atrapada en el RLS de la propia tabla admins.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Un admin puede ver la lista de admins. Nadie puede modificarla desde el
-- cliente: alta y baja se hacen sólo con set_admin() desde el SQL Editor.
drop policy if exists "admins lectura" on public.admins;
create policy "admins lectura"
  on public.admins for select
  to authenticated
  using (public.is_admin());


-- Alta / baja de admins. Se ejecuta desde el SQL Editor (rol postgres).
--   select public.set_admin('mail@cliente.com');          -- dar acceso
--   select public.set_admin('mail@cliente.com', false);   -- quitar acceso
create or replace function public.set_admin(p_email text, p_enabled boolean default true)
returns text
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_id uuid;
begin
  select id into v_id from auth.users where lower(email) = lower(p_email);

  if v_id is null then
    raise exception 'No existe un usuario con el email %. Crealo primero en Authentication > Users > Add user.', p_email;
  end if;

  if p_enabled then
    insert into public.admins (user_id, email)
    values (v_id, lower(p_email))
    on conflict (user_id) do update set email = excluded.email;
    return format('OK: %s ahora es admin.', p_email);
  else
    delete from public.admins where user_id = v_id;
    return format('OK: %s ya no es admin.', p_email);
  end if;
end;
$$;

-- Sólo desde el SQL Editor / service_role. Nunca desde el navegador.
revoke all on function public.set_admin(text, boolean) from public, anon, authenticated;


-- ============================================================================
-- 2) TABLA DE PRODUCTOS
-- ============================================================================
-- Los nombres de columna coinciden con src/lib/products.js (fromRow / toRow).

create table if not exists public.productos (
  id              uuid primary key default gen_random_uuid(),
  linea           text not null check (linea = 'limpieza'),
  categoria       text not null,
  categoria_label text not null,
  nombre          text not null,
  slug            text not null,
  descripcion     text        default '',
  specs           jsonb       default '{}'::jsonb,
  imagenes        jsonb       default '[]'::jsonb,
  comprar_url     text        default 'https://www.medianaranja.store',
  orden           int         default 0,
  created_at      timestamptz default now()
);

-- Orden de listado por línea (getCatalog ordena por linea + orden).
create index if not exists productos_linea_idx on public.productos (linea, orden);

-- Evita productos duplicados. Importante: storage.js arma la ruta de las fotos
-- como linea/categoria/slug/..., así que dos productos con la misma terna se
-- pisarían las imágenes entre sí.
create unique index if not exists productos_ident_key
  on public.productos (linea, categoria, slug);


-- ============================================================================
-- 3) RLS DE PRODUCTOS
-- ============================================================================
alter table public.productos enable row level security;

-- Lectura pública: el catálogo lo ve cualquiera, sin login.
drop policy if exists "lectura publica" on public.productos;
create policy "lectura publica"
  on public.productos for select
  using (true);

-- Escritura: sólo admins.
drop policy if exists "escritura admin insert" on public.productos;
create policy "escritura admin insert"
  on public.productos for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "escritura admin update" on public.productos;
create policy "escritura admin update"
  on public.productos for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "escritura admin delete" on public.productos;
create policy "escritura admin delete"
  on public.productos for delete
  to authenticated
  using (public.is_admin());


-- ============================================================================
-- 4) BANNERS DEL HOME (carrusel editable desde el panel)
-- ============================================================================
-- El orden decide todo: el banner con menor `orden` es el que se ve primero
-- al entrar a la página. Desde el panel se reordena, se activa/desactiva y
-- se borra.

create table if not exists public.banners (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  titulo     text not null default '',
  orden      int  not null default 0,
  activo     boolean not null default true,
  -- Punto de encuadre (object-position). Como el alto del banner cambia entre
  -- celular y monitor, la foto se recorta distinto en cada uno; esto decide qué
  -- parte se mantiene siempre a la vista. Se elige desde el panel.
  foco       text not null default '50% 50%',
  created_at timestamptz not null default now()
);

-- Para proyectos donde la tabla ya existía sin esta columna.
alter table public.banners add column if not exists foco text not null default '50% 50%';

create index if not exists banners_orden_idx on public.banners (orden);

alter table public.banners enable row level security;

-- El carrusel lo ve cualquiera; sólo se publican los activos.
drop policy if exists "banners lectura publica" on public.banners;
create policy "banners lectura publica"
  on public.banners for select
  using (activo);

-- Un admin además ve los desactivados (para volver a publicarlos).
drop policy if exists "banners lectura admin" on public.banners;
create policy "banners lectura admin"
  on public.banners for select
  to authenticated
  using (public.is_admin());

drop policy if exists "banners admin insert" on public.banners;
create policy "banners admin insert"
  on public.banners for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "banners admin update" on public.banners;
create policy "banners admin update"
  on public.banners for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "banners admin delete" on public.banners;
create policy "banners admin delete"
  on public.banners for delete
  to authenticated
  using (public.is_admin());


-- ============================================================================
-- 5) STORAGE — buckets de imágenes
-- ============================================================================
-- Bucket público (las URLs de las fotos se sirven directo) con tope de 10 MB
-- por archivo y sólo imágenes.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('productos', 'productos', true, 10485760,
   array['image/jpeg','image/png','image/webp','image/avif','image/gif']),
  ('banners',   'banners',   true, 10485760,
   array['image/jpeg','image/png','image/webp','image/avif','image/gif'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Lectura: NO se abre a anónimos.
-- Al ser un bucket público, las fotos se sirven por
--   /storage/v1/object/public/productos/...  sin pasar por RLS,
-- así que el catálogo se ve igual. Esta policy sólo habilita LISTAR el
-- contenido del bucket (storage.objects), y eso queda para admins: nadie
-- puede enumerar los archivos ni descubrir imágenes que no estén publicadas.
-- ⚠️ Si algún día pasás el bucket a privado, las fotos dejan de verse hasta
--    que agregues acá una policy de select pública o uses signed URLs.
drop policy if exists "imagenes lectura publica" on storage.objects;
drop policy if exists "imagenes listado admin" on storage.objects;
create policy "imagenes listado admin"
  on storage.objects for select
  to authenticated
  using (bucket_id in ('productos','banners') and public.is_admin());

-- Subir / reemplazar / borrar: sólo admins.
drop policy if exists "imagenes admin insert" on storage.objects;
create policy "imagenes admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('productos','banners') and public.is_admin());

drop policy if exists "imagenes admin update" on storage.objects;
create policy "imagenes admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('productos','banners') and public.is_admin())
  with check (bucket_id in ('productos','banners') and public.is_admin());

drop policy if exists "imagenes admin delete" on storage.objects;
create policy "imagenes admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('productos','banners') and public.is_admin());


-- ============================================================================
-- PASOS EN EL DASHBOARD (después de correr este archivo)
-- ============================================================================
--
-- 1. Cargar el catálogo:
--    SQL Editor > New query > pegar y correr supabase/seed.sql (56 productos).
--
-- 2. Authentication > Sign In / Providers > Email:
--      • "Enable Email provider"          → ON
--      • "Confirm email"                  → OFF  (los usuarios los creás vos)
--      • "Allow new users to sign up"     → OFF  ← CRÍTICO: nadie se auto-registra
--    Y desactivá todo el resto de providers (Google, GitHub, Phone, Anonymous).
--
-- 2b. Authentication > Policies / Attack Protection (endurecido):
--      • "Leaked password protection"     → ON   (rechaza passwords filtradas)
--      • "Minimum password length"        → 12
--      • "Password requirements"          → letras + números + símbolos
--      • "Bot and Abuse Protection" (CAPTCHA) → ON si el cliente quiere el
--        máximo blindaje contra fuerza bruta en el login.
--      • Authentication > Sessions: "Time-box user sessions" → 8 h y
--        "Inactivity timeout" → 1 h, para que una sesión olvidada expire.
--
-- 3. Crear el usuario admin:
--    Authentication > Users > Add user > "Create new user"
--      • Email + Password
--      • Tildar "Auto Confirm User"
--
-- 4. Darle permisos (SQL Editor):
--      select public.set_admin('mail-del-cliente@ejemplo.com');
--
--    Para sumar más admins después: repetir los pasos 3 y 4.
--    Para quitarle el acceso a alguien (sin borrar el usuario):
--      select public.set_admin('mail@ejemplo.com', false);
--
--    Ver quiénes son admins hoy:
--      select email, created_at from public.admins order by created_at;
--
-- 5. Netlify > Site settings > Environment variables:
--      VITE_SUPABASE_URL       = https://dqlixhlsbyofejjqexzl.supabase.co
--      VITE_SUPABASE_ANON_KEY  = (la anon key del proyecto)
--    Redeploy. Después entrar a /admin y probar el login.
--
-- ============================================================================

-- ============================================================================
-- 6) MÉTRICAS — analítica propia, sin servicios externos
-- ============================================================================
-- Todo lo que se mide entra acá. No se guarda IP, ni nombre, ni nada que
-- identifique a una persona: sólo un id aleatorio que genera el navegador.
--
-- El permiso es asimétrico y es la parte importante:
--   · cualquiera puede INSERTAR (si no, no se podría medir a un visitante)
--   · sólo un admin puede LEER
-- Así el visitante nunca ve las métricas de nadie, ni las propias.

create table if not exists public.eventos (
  id          bigint generated always as identity primary key,
  -- visita: entró al sitio · seccion: estuvo mirando una sección
  -- producto: abrió la ficha · descarga: bajó fotos
  tipo        text not null check (tipo in ('visita','seccion','producto','descarga')),
  ref         text check (ref is null or length(ref) <= 120),
  -- id aleatorio del navegador; permite contar visitantes únicos sin cookies
  -- de terceros ni datos personales.
  visitante   text not null check (length(visitante) <= 40),
  sesion      text not null check (length(sesion) <= 40),
  dispositivo text check (dispositivo in ('movil','escritorio')),
  origen      text check (origen is null or length(origen) <= 120),
  -- milisegundos que la sección estuvo efectivamente a la vista
  ms          int check (ms is null or (ms >= 0 and ms <= 3600000)),
  creado      timestamptz not null default now()
);

create index if not exists eventos_creado_idx on public.eventos (creado desc);
create index if not exists eventos_tipo_creado_idx on public.eventos (tipo, creado desc);

-- La fecha la pone el servidor. Si no, alguien podría mandar eventos fechados
-- en cualquier momento y ensuciar los reportes.
create or replace function public.eventos_fecha_servidor()
returns trigger language plpgsql as $$
begin
  -- El id es `generated always as identity`: Postgres ya rechaza que venga
  -- desde afuera, así que sólo hay que forzar la fecha.
  new.creado := now();
  return new;
end;
$$;

drop trigger if exists eventos_fecha on public.eventos;
create trigger eventos_fecha before insert on public.eventos
  for each row execute function public.eventos_fecha_servidor();

alter table public.eventos enable row level security;

-- Escribir: cualquier visitante. Es la única forma de medir en un sitio sin backend.
drop policy if exists "eventos alta publica" on public.eventos;
create policy "eventos alta publica"
  on public.eventos for insert
  to anon, authenticated
  with check (true);

-- Leer: sólo admins.
drop policy if exists "eventos lectura admin" on public.eventos;
create policy "eventos lectura admin"
  on public.eventos for select
  to authenticated
  using (public.is_admin());

drop policy if exists "eventos borrado admin" on public.eventos;
create policy "eventos borrado admin"
  on public.eventos for delete
  to authenticated
  using (public.is_admin());


-- --- Consultas agregadas -----------------------------------------------------
-- Se resuelven en la base y devuelven pocas filas. Mandar los eventos crudos al
-- navegador para sumarlos ahí no escala.
-- Son SECURITY INVOKER a propósito: respetan el RLS de arriba, así que un
-- visitante que las llame recibe cero filas.

create or replace function public.metricas_resumen(dias int default 30)
returns table (visitas bigint, visitantes bigint, sesiones bigint)
language sql stable as $$
  select count(*) filter (where tipo = 'visita'),
         count(distinct visitante),
         count(distinct sesion)
  from public.eventos
  where creado >= now() - make_interval(days => dias);
$$;

create or replace function public.metricas_por_dia(dias int default 30)
returns table (dia date, visitas bigint, visitantes bigint)
language sql stable as $$
  select creado::date,
         count(*) filter (where tipo = 'visita'),
         count(distinct visitante)
  from public.eventos
  where creado >= now() - make_interval(days => dias)
  group by 1
  order by 1;
$$;

-- La "zona más usada": cuánto tiempo real estuvo cada sección a la vista.
create or replace function public.metricas_secciones(dias int default 30)
returns table (seccion text, vistas bigint, segundos bigint)
language sql stable as $$
  select ref,
         count(*),
         (coalesce(sum(ms), 0) / 1000)::bigint
  from public.eventos
  where tipo = 'seccion'
    and creado >= now() - make_interval(days => dias)
  group by 1
  order by 3 desc;
$$;

create or replace function public.metricas_productos(dias int default 30, tope int default 12)
returns table (producto text, aperturas bigint)
language sql stable as $$
  select ref, count(*)
  from public.eventos
  where tipo = 'producto'
    and creado >= now() - make_interval(days => dias)
  group by 1
  order by 2 desc
  limit tope;
$$;

create or replace function public.metricas_descargas(dias int default 30, tope int default 12)
returns table (producto text, descargas bigint)
language sql stable as $$
  select ref, count(*)
  from public.eventos
  where tipo = 'descarga'
    and creado >= now() - make_interval(days => dias)
  group by 1
  order by 2 desc
  limit tope;
$$;

create or replace function public.metricas_origen(dias int default 30)
returns table (origen text, dispositivo text, visitas bigint)
language sql stable as $$
  select coalesce(e.origen, 'directo'), e.dispositivo, count(*)
  from public.eventos e
  where e.tipo = 'visita'
    and e.creado >= now() - make_interval(days => dias)
  group by 1, 2
  order by 3 desc;
$$;

-- Limpieza. Los eventos crudos no sirven para siempre; correr de vez en cuando:
--   select public.metricas_purgar(365);
create or replace function public.metricas_purgar(dias_a_conservar int default 365)
returns bigint language plpgsql security definer set search_path = public, pg_temp as $$
declare n bigint;
begin
  if not public.is_admin() then
    raise exception 'Sólo un admin puede purgar métricas.';
  end if;
  delete from public.eventos where creado < now() - make_interval(days => dias_a_conservar);
  get diagnostics n = row_count;
  return n;
end;
$$;


-- ============================================================================
-- 7) VERIFICACIÓN — correr esto después, debe dar todo OK
-- ============================================================================
-- Ninguna tabla del schema público puede quedar sin RLS.
-- Si alguna fila sale con rls_activo = false, esa tabla está expuesta.
--
--   select tablename, rowsecurity as rls_activo
--   from pg_tables
--   where schemaname = 'public'
--   order by tablename;
--
-- Policies efectivas sobre productos y admins:
--
--   select tablename, policyname, cmd, roles
--   from pg_policies
--   where schemaname = 'public'
--   order by tablename, cmd;
--
-- Nadie más que postgres/service_role puede ejecutar set_admin:
--
--   select has_function_privilege('authenticated', 'public.set_admin(text,boolean)', 'execute') as authenticated_puede,
--          has_function_privilege('anon',          'public.set_admin(text,boolean)', 'execute') as anon_puede;
--   -- ambas deben dar false
--
-- ============================================================================
