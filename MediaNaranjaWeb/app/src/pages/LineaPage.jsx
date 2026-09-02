import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Download, ChevronRight } from 'lucide-react'
import { getCatalog, catalogoSembrado } from '../lib/products.js'
import { LINEAS } from '../lib/theme.js'
import Logo from '../components/Logo.jsx'
import HeartMark from '../components/HeartMark.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CargandoProductos from '../components/CargandoProductos.jsx'
import ProductModal from '../components/ProductModal.jsx'

export default function LineaPage({ linea }) {
  const meta = LINEAS[linea]
  const { categoria } = useParams()
  const navigate = useNavigate()
  // Sembrado desde el HTML que genero el prerender: si hay datos, la grilla
  // sale dibujada en el primer render y no se muestra el estado de carga.
  const semilla = useMemo(() => catalogoSembrado(linea), [linea])
  const [data, setData] = useState(semilla)
  const [loading, setLoading] = useState(semilla.productos.length === 0)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-linea', linea)
    return () => document.documentElement.removeAttribute('data-linea')
  }, [linea])

  useEffect(() => {
    let alive = true
    // Se vuelve a la semilla en vez de vaciar: al cambiar de linea no hay nada
    // sembrado y queda vacio igual, pero al montar evita un parpadeo entre lo
    // que ya venia dibujado en el HTML y la respuesta de la base.
    setData(semilla)
    setLoading(semilla.productos.length === 0)
    getCatalog(linea)
      .then((d) => {
        if (!alive) return
        setData({
          productos: d.productos.filter((p) => p.linea === linea),
          categorias: d.categorias.filter((c) => c.linea === linea),
        })
        setError(null)
      })
      // Con la semilla en pantalla, un fallo de red no es un error visible.
      .catch((e) => alive && !semilla.productos.length && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [linea, semilla])

  const activeCat = categoria || 'todos'
  const productos = useMemo(
    () => (activeCat === 'todos' ? data.productos : data.productos.filter((p) => p.categoria === activeCat)),
    [data.productos, activeCat]
  )
  const counts = useMemo(() => {
    const m = {}
    for (const p of data.productos) m[p.categoria] = (m[p.categoria] || 0) + 1
    return m
  }, [data.productos])

  return (
    <main className="grain relative min-h-dvh" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <a href="#productos" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-white">
        Saltar a los productos
      </a>
      <Nav />
      <Hero linea={linea} meta={meta} productos={data.productos} />

      {/* Rail de categorías — mobile/tablet */}
      <div className="sticky top-[68px] z-20 border-y backdrop-blur-xl lg:hidden" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--bg) 82%, transparent)' }}>
        <div className="container-x flex gap-2 overflow-x-auto no-scrollbar py-3">
          <CatChip to={`/${linea}`} active={activeCat === 'todos'} label="Todos" count={data.productos.length} />
          {data.categorias.map((c) => (
            <CatChip key={c.slug} to={`/${linea}/${c.slug}`} active={activeCat === c.slug} label={c.label} count={counts[c.slug]} />
          ))}
        </div>
      </div>

      {/* Cuerpo: sidebar + grilla */}
      <section id="productos" className="container-x scroll-mt-28 py-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="mono-label mb-3 text-muted">Categorías</div>
            <nav className="flex flex-col">
              <SideItem to={`/${linea}`} active={activeCat === 'todos'} label="Todos" count={data.productos.length} />
              {data.categorias.map((c) => (
                <SideItem key={c.slug} to={`/${linea}/${c.slug}`} active={activeCat === c.slug} label={c.label} count={counts[c.slug]} />
              ))}
            </nav>
          </div>
        </aside>

        {/* Grilla */}
        <div>
          {loading ? (
            <CargandoProductos cantidad={9} columnas="grid-cols-2 sm:grid-cols-3" />
          ) : error ? (
            <ErrorState msg={error} />
          ) : productos.length === 0 ? (
            <EmptyState onReset={() => navigate(`/${linea}`)} />
          ) : (
            <>
              <div className="mono-label mb-5 flex items-center gap-2 text-muted">
                <span style={{ color: 'var(--accent)' }}>{String(productos.length).padStart(2, '0')}</span>
                {activeCat === 'todos' ? 'productos' : data.categorias.find((c) => c.slug === activeCat)?.label}
              </div>
              <ProductGrid productos={productos} onOpen={setSelected} />
            </>
          )}
        </div>
      </section>

      <SectionFooter />
      {selected && <ProductModal producto={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}

/* ------------------------------- NAV ------------------------------- */
function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b backdrop-blur-xl" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--bg) 82%, transparent)' }}>
      <div className="container-x flex h-[68px] items-center gap-3">
        <Link to="/" className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-black/5" aria-label="Volver al inicio">
          <ArrowLeft size={18} />
        </Link>
        <Logo />
      </div>
    </header>
  )
}

/* ------------------------------- HERO ------------------------------ */
function Hero({ linea, meta, productos }) {
  const reduce = useReducedMotion()
  return (
    <section className="relative overflow-hidden">
      {/* atmósfera: glow del mundo + grilla */}
      <div aria-hidden className="atmo pointer-events-none absolute inset-0" />
      <div aria-hidden className="tech-grid pointer-events-none absolute inset-0 opacity-40" />
      {/* watermark del nombre de la línea */}
      <span aria-hidden className="pointer-events-none absolute -bottom-6 right-2 select-none font-archivo text-[26vw] font-extrabold leading-none tracking-tighter opacity-[0.05] sm:text-[20vw]" style={{ color: 'var(--ink)' }}>
        {meta.nombre}
      </span>

      <div className="container-x relative grid gap-8 py-14 sm:py-20 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div>
          <div className="mono-label flex items-center gap-2" style={{ color: 'var(--accent)' }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
            {linea === 'limpieza' ? '01' : '02'} — Línea Media Naranja
          </div>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="display mt-3 text-6xl sm:text-8xl" style={{ color: 'var(--ink)' }}
          >
            {meta.nombre}
          </motion.h1>
          <p className="mt-4 max-w-md text-lg text-muted">{meta.descripcion}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#productos" className="btn btn-primary">
              <Download size={17} /> Descargar fotos
            </a>
          </div>
        </div>

        <HeroVisual reduce={reduce} productos={productos} />
      </div>
    </section>
  )
}

function HeroVisual({ reduce, productos }) {
  // collage flotante con profundidad
  const imgs = useHeroImages(productos)
  return (
    <div className="relative hidden h-[340px] md:block">
      {/* halo detrás */}
      <div aria-hidden className="absolute right-8 top-6 h-64 w-64 rounded-full blur-3xl" style={{ background: 'var(--accent)', opacity: 0.18 }} />
      <HeartMark aria-hidden className="absolute -right-4 -top-8 w-40 opacity-[0.08]" fill="var(--ink)" />
      {imgs.map((src, i) => (
        <motion.div
          key={src}
          initial={reduce ? false : { opacity: 0, y: 30, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: [-8, 4, -3][i] || 0 }}
          transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute overflow-hidden rounded-2xl border border-white/40 bg-white shadow-[0_30px_60px_-20px_rgba(10,10,12,0.45)]"
          style={{
            width: 200, height: 200,
            right: [40, 170, 110][i],
            top: [30, 90, 150][i],
            zIndex: [3, 1, 2][i],
          }}
        >
          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
        </motion.div>
      ))}
    </div>
  )
}

/* helper: primeras 3 fotos del catálogo ya cargado, para el collage del hero */
function useHeroImages(productos) {
  return useMemo(
    () => (productos || []).filter((p) => p.imagenes.length).slice(0, 3).map((p) => p.imagenes[0]),
    [productos]
  )
}

/* ---------------------------- CATEGORÍAS --------------------------- */
function CatChip({ to, active, label, count }) {
  return (
    <Link
      to={to}
      className="chip border"
      style={{
        background: active ? 'var(--accent)' : 'var(--surface)',
        color: active ? 'var(--accent-ink)' : 'var(--ink)',
        borderColor: active ? 'var(--accent)' : 'var(--border)',
      }}
      aria-current={active ? 'page' : undefined}
    >
      {label} <span className="opacity-60">{count}</span>
    </Link>
  )
}

function SideItem({ to, active, label, count }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
      style={{ background: active ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent', color: active ? 'var(--accent)' : 'var(--ink)' }}
      aria-current={active ? 'page' : undefined}
    >
      <span className="flex items-center gap-2">
        <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" style={{ opacity: active ? 1 : 0.35 }} />
        {label}
      </span>
      <span className="mono-label text-muted">{String(count).padStart(2, '0')}</span>
    </Link>
  )
}

/* ------------------------------ GRILLA ----------------------------- */
function ProductGrid({ productos, onOpen }) {
  const reduce = useReducedMotion()
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {productos.map((p, i) => (
        <motion.div
          key={p.id}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProductCard producto={p} index={i} onOpen={onOpen} />
        </motion.div>
      ))}
    </div>
  )
}

function EmptyState({ onReset }) {
  return (
    <div className="grid place-items-center gap-3 py-24 text-center">
      <p className="text-muted">No hay productos en esta categoría todavía.</p>
      <button onClick={onReset} className="btn btn-ghost">Ver todos</button>
    </div>
  )
}

function ErrorState({ msg }) {
  return (
    <div className="grid place-items-center gap-2 py-24 text-center">
      <p className="font-semibold">No pudimos cargar los productos.</p>
      <p className="text-sm text-muted">{msg}</p>
    </div>
  )
}

function SectionFooter() {
  return (
    <footer className="mt-10 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="container-x flex items-center gap-4 py-10">
        <Link to="/" className="mono-label text-muted hover:opacity-80">← Inicio</Link>
      </div>
    </footer>
  )
}
