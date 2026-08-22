# Media Naranja — Web

Landing moderna con dos mundos separados — **Limpieza** (amarillo/rojo, industrial) y **Hogar**
(pasteles/beige, textil premium) — más un **panel admin** para agregar/eliminar productos.

- **Stack:** Vite + React + React Router + Tailwind + Framer Motion
- **Backend/Auth:** Supabase (Postgres + Auth + Storage)
- **Hosting:** Netlify
- Catálogo con **descarga de fotos individuales** (para revendedores) y botón **Comprar** → `medianaranja.store`
- **Sin precios** (decisión de negocio). Es landing/showcase, no e-commerce.

Funciona en **dos modos**:
1. **Seed local** (sin Supabase) — arranca con los 56 productos scrapeados incluidos. Ideal para probar.
2. **Supabase** — cuando cargás las credenciales, lee/escribe productos desde la base y habilita el admin.

---

## 1. Correr local

```bash
cd app
npm install
npm run dev        # http://localhost:5173
```

Sin `.env.local` funciona en modo seed (catálogo estático, admin deshabilitado).

## 2. Configurar Supabase (de cero)

1. Creá un proyecto en [supabase.com](https://supabase.com) (elegí región cercana, ej. São Paulo).
2. **SQL Editor → New query →** pegá y ejecutá `supabase/schema.sql` (crea tabla, RLS y bucket de imágenes).
3. *(Opcional)* ejecutá `supabase/seed.sql` para cargar los 56 productos scrapeados.
4. **Authentication → Providers → Email:** activalo y **desactivá "Enable email signups"**
   (así nadie se puede auto-registrar; sos el único admin).
5. **Authentication → Users → Add user:** creá tu usuario (email + contraseña). Ese es tu login del panel.
6. **Project Settings → API:** copiá `Project URL` y `anon public key`.
7. En `app/`, copiá `.env.example` a `.env.local` y completá:
   ```
   VITE_SUPABASE_URL=https://tuproyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
8. `npm run dev` → entrá a `/admin`, logueate y ya podés cargar/eliminar productos.

> El `anon key` es **pública por diseño** y segura de exponer en el front: la seguridad real la dan
> las **políticas RLS** (lectura pública, escritura solo autenticado). Nunca pongas el `service_role` key.

## 3. Deploy en Netlify

1. Subí el repo a GitHub (el `.gitignore` ya excluye `.env`, `node_modules`, `.memsearch/`).
2. En Netlify: **Add new site → Import from Git** y elegí el repo.
   - Base directory: `app`
   - Build command: `npm run build`  ·  Publish directory: `app/dist` (ya está en `netlify.toml`).
3. **Site settings → Environment variables:** agregá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Deploy. El `netlify.toml` ya trae el redirect SPA y las **cabeceras de seguridad** (CSP, HSTS, etc.).

## 4. Conectar el dominio (medianaranja.com.ar en NIC.ar)

1. En Netlify: **Domain settings → Add a custom domain →** `medianaranja.com.ar`.
2. En **NIC.ar** (panel del dominio), configurá los DNS. Dos opciones:
   - **Recomendado (Netlify DNS):** cambiá los *nameservers* del dominio a los que te da Netlify.
   - **O registros manuales:** `A` de `medianaranja.com.ar` → IP de Netlify (`75.2.60.5`) y
     `CNAME` de `www` → `tu-sitio.netlify.app`.
3. Netlify emite el **certificado HTTPS (Let's Encrypt)** automáticamente. Activá **Force HTTPS**.

> NIC.ar puede tardar en propagar. Si usás nameservers de Netlify, la gestión es más simple.

---

## Estructura

```
app/
├── src/
│   ├── pages/         Landing · LineaPage · Admin
│   ├── components/    Logo · ProductCard · ProductModal · ScrollToTop
│   ├── lib/           supabase · products · auth · storage · download · theme
│   └── data/seed.json 56 productos scrapeados (fallback local)
├── public/productos/  imágenes de los productos (incluidas en el deploy)
├── supabase/          schema.sql · seed.sql
└── netlify.toml       build + redirects SPA + headers de seguridad
```

## Seguridad (resumen)

- **RLS activo:** lectura pública, escritura solo para usuarios autenticados.
- **Sin signups:** el único admin sos vos (usuario creado a mano en Supabase).
- **Headers:** CSP estricta, HSTS, X-Frame-Options DENY, no-sniff, Referrer-Policy.
- **Sin secretos en el front:** solo la `anon key` pública; el `service_role` nunca se usa.
- `0 vulnerabilidades` en `npm audit`.

## Reemplazar los logos

Cuando tengas los logos oficiales (Hogar y Limpieza), ponelos en `public/` y editá
`src/components/Logo.jsx` para usar `<img>` en vez del placeholder actual.
