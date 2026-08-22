import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, Leaf, Factory, Recycle, Download,
  Mail, Instagram, Facebook, MapPin, Menu, X, ShoppingBag, MessageCircle, ChevronDown,
} from 'lucide-react'
import seed from '../data/seed.json'
import Logo from '../components/Logo.jsx'
import { SITE, waLink } from '../lib/site.js'

const peek = (linea, n = 4) =>
  seed.productos.filter((p) => p.linea === linea && p.imagenes.length).slice(0, n).map((p) => p.imagenes[0])

const catNames = (linea) => [...new Set(seed.productos.filter((p) => p.linea === linea).map((p) => p.categoriaLabel))]
const countOf = (linea) => seed.productos.filter((p) => p.linea === linea).length

const NAV = [
  { href: '#lineas', label: 'Líneas' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#revendedores', label: 'Revendedores' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Landing() {
  return (
    <main className="grain min-h-dvh bg-[var(--bg)] text-[var(--ink)]">
      <a href="#lineas" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#0c0c0d] focus:px-4 focus:py-2 focus:text-white">
        Saltar al contenido
      </a>
      <h1 className="sr-only">Media Naranja — Limpieza y Hogar. Calidad argentina desde 1975.</h1>
      <Nav />
      <Hero />
      <Lineas />
      <Nosotros />
      <Sustentabilidad />
      <Planta />
      <Revendedores />
      <Contacto />
      <Footer />
    </main>
  )
}

/* ------------------------------- NAV ------------------------------- */
function Nav() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${solid ? 'border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl' : ''}`}>
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#top" aria-label="Media Naranja — inicio"><Logo /></a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="mono-label rounded-full px-3.5 py-2 text-[var(--muted)] transition-colors hover:bg-black/[0.04] hover:text-[var(--ink)]">
              {l.label}
            </a>
          ))}
          <a href={SITE.tienda} target="_blank" rel="noopener" className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-[#E30613] px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
            <ShoppingBag size={15} /> Comprar
          </a>
        </nav>

        <button className="grid h-10 w-10 place-items-center rounded-full md:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)] md:hidden">
          <div className="container-x flex flex-col py-2">
            {NAV.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="mono-label rounded-lg px-2 py-3.5 text-[var(--muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]">
                {l.label}
              </a>
            ))}
            <a href={SITE.tienda} target="_blank" rel="noopener" className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white">
              <ShoppingBag size={16} /> Comprar en la tienda
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

/* ------------------------------- HERO ------------------------------ */
function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  const onMove = useCallback((e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [reduce])

  const year = new Date().getFullYear()

  return (
    <section id="top" ref={ref} onMouseMove={onMove} className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* grilla técnica */}
      <div aria-hidden className="pointer-events-none absolute inset-0 tech-grid opacity-70" />
      {/* glows atmosféricos de marca (profundidad) */}
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#FFD400] opacity-25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-1/3 top-0 h-64 w-64 rounded-full bg-[#E30613] opacity-[0.07] blur-3xl" />
      {/* spotlight cálido que sigue el cursor */}
      {!reduce && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{ background: 'radial-gradient(360px circle at var(--mx,70%) var(--my,35%), rgba(227,6,19,0.06), transparent 70%)' }}
        />
      )}
      <div className="container-x relative z-10 flex flex-1 flex-col justify-center pb-12 pt-24 sm:pt-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mono-label flex items-center gap-2 text-[#E30613]"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E30613]" /> Media Naranja — {SITE.planta.ciudad}
        </motion.div>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 max-w-[15ch] font-archivo text-[clamp(2.75rem,9vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-balance"
        >
          Tu casa,{' '}
          <span className="relative inline-block whitespace-nowrap">
            <span className="relative z-10">más fácil.</span>
            <span aria-hidden className="absolute inset-x-[-6px] bottom-[0.1em] z-0 h-[0.34em] -rotate-1 bg-[#FFD400]" />
          </span>
        </motion.h2>

        <div className="mt-8 grid gap-6 border-t border-[var(--border)] pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <motion.p
            initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-md text-lg leading-relaxed text-[var(--muted)]"
          >
            {year - SITE.fundacion} años desarrollando productos de calidad para la limpieza y el hogar.
            Dos líneas, un mismo compromiso con vos.
          </motion.p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#lineas" className="inline-flex items-center gap-2 rounded-full bg-[#E30613] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(227,6,19,0.5)] transition-transform hover:-translate-y-0.5">
              Ver los productos <ArrowRight size={16} />
            </a>
            <a href="#nosotros" className="inline-flex items-center gap-2 rounded-full border border-[var(--ink)]/15 px-6 py-3 text-sm font-semibold transition-colors hover:border-[var(--ink)]">
              La marca
            </a>
          </div>
        </div>
      </div>

      {/* pista de scroll */}
      <a href="#lineas" className="absolute bottom-[68px] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-[var(--muted)] transition-colors hover:text-[var(--ink)] md:flex" aria-label="Bajar a las líneas">
        <span className="mono-label">Deslizá</span>
        <ChevronDown size={16} className="animate-bounce" />
      </a>

      <Ticker />
    </section>
  )
}

function Ticker() {
  const reduce = useReducedMotion()
  const items = [...catNames('limpieza'), '●', ...catNames('hogar')]
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-[#141210]/10 bg-[#FFD400] py-3">
      <div className={`flex w-max gap-8 ${reduce ? '' : 'animate-marquee'}`}>
        {row.map((t, i) => (
          <span key={i} className="mono-label text-[#141210]">{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------- LÍNEAS ---------------------------- */
/* Sección neutral: dos filas tipo índice. El color de cada mundo      */
/* aparece sutil al hover (nada de bloques de color que corten).        */
function Lineas() {
  return (
    <section id="lineas" className="scroll-mt-16 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container-x py-16 md:py-24">
        <SectionTitle index="[ SELECT ]" kicker="Nuestras líneas" title="Elegí tu mundo" />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <LineModule
            to="/limpieza" index="01" name="Limpieza" accent="#E30613"
            desc="Trapos, microfibras, rejillas, secadores. Hechos en nuestra planta textil."
            images={peek('limpieza', 4)} cats={catNames('limpieza').length} prods={countOf('limpieza')}
          />
          <LineModule
            to="/hogar" index="02" name="Hogar" accent="#C08552"
            desc="Toallas, sábanas, acolchados, mantas. Suavidad premium para tu descanso."
            images={peek('hogar', 4)} cats={catNames('hogar').length} prods={countOf('hogar')}
          />
        </div>
      </div>
    </section>
  )
}

function LineModule({ to, index, name, desc, images, accent, cats, prods }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const onMove = useCallback((e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--rx', `${(-py * 5).toFixed(2)}deg`)
    ref.current.style.setProperty('--ry', `${(px * 7).toFixed(2)}deg`)
  }, [reduce])
  const onLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }, [])

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: '1200px' }}
    >
      <Link
        ref={ref}
        to={to}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="line-module group relative block overflow-hidden rounded-3xl p-7 sm:p-8"
        style={{ '--acc': accent }}
        aria-label={`Entrar a la línea ${name}`}
      >
        <span aria-hidden className="line-scan pointer-events-none absolute inset-0" />
        <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20" style={{ background: accent }} />

        <div className="relative z-10 flex items-center justify-between">
          <span className="mono-label text-[var(--muted)]">Line {index}</span>
          <span className="pulse-dot h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}66` }} />
        </div>

        <h3 className="relative z-10 mt-4 font-archivo text-6xl font-extrabold leading-none tracking-tight sm:text-7xl" style={{ color: 'var(--ink)' }}>{name}</h3>
        <p className="relative z-10 mt-3 max-w-sm text-[15px] text-[var(--muted)]">{desc}</p>

        {/* readouts */}
        <div className="relative z-10 mt-5 flex gap-4">
          <Readout label="Categorías" value={String(cats).padStart(2, '0')} />
          <Readout label="Productos" value={String(prods).padStart(2, '0')} />
        </div>

        {/* thumbs */}
        <div className="relative z-10 mt-6 flex gap-2.5">
          {images.map((src) => (
            <div key={src} className="h-16 w-16 overflow-hidden rounded-xl bg-white ring-1 ring-[var(--border)] shadow-sm sm:h-[74px] sm:w-[74px]">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-7 flex items-center justify-between">
          <span className="mono-label" style={{ color: accent }}>Ver productos</span>
          <span className="grid h-12 w-12 place-items-center rounded-full text-white transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5" style={{ background: accent, boxShadow: `0 10px 26px -8px ${accent}80` }}>
            <ArrowRight size={20} strokeWidth={2.5} />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

function Readout({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2">
      <div className="mono-label text-[var(--muted)]">{label}</div>
      <div className="font-archivo text-2xl font-extrabold leading-none" style={{ color: 'var(--ink)' }}>{value}</div>
    </div>
  )
}

/* ------------------------------ NOSOTROS --------------------------- */
function Nosotros() {
  const year = new Date().getFullYear()
  return (
    <section id="nosotros" className="scroll-mt-16 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container-x grid gap-12 py-20 md:grid-cols-[1fr_1.05fr] md:py-28">
        <div>
          <SectionTitle index="00" kicker="Nosotros" title={<>Más de 40 años<br />haciéndote la vida<br />más fácil.</>} />
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { n: `+${year - SITE.fundacion}`, l: 'años' },
              { n: '#1', l: 'en la categoría' },
              { n: '02', l: 'líneas' },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-[var(--border)] p-4">
                <div className="font-archivo text-3xl font-extrabold text-[#E30613]">{s.n}</div>
                <div className="mono-label mt-1 text-[var(--muted)]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 text-[17px] leading-relaxed text-[var(--muted)]">
          <p><span className="font-semibold text-[var(--ink)]">En {SITE.fundacion} nacimos</span> para que puedas tener en tu hogar un aliado que te ayude con la limpieza. Desarrollamos productos de alta calidad para que te preocupes por otras cosas, no por limpiar.</p>
          <p>En poco tiempo llegamos a ser líderes de la categoría. Día a día cambiamos junto a vos: renovamos nuestra imagen, nuestras etiquetas y lanzamos productos a la medida de tus necesidades.</p>
          <p>Hoy estamos a la vanguardia de las últimas tendencias mundiales en limpieza y hogar. Porque vos evolucionás, y nosotros evolucionamos con vos.</p>
        </div>
      </div>
    </section>
  )
}

/* --------------------------- SUSTENTABILIDAD ----------------------- */
function Sustentabilidad() {
  const items = [
    { icon: Recycle, title: 'Cero desperdicio', body: 'Nuestros trapos de piso tejidos surgen de reutilizar retazos de nuestra planta textil. Aprovechamos al máximo la producción, sin generar desperdicios.' },
    { icon: Leaf, title: 'Solo con agua', body: 'La línea de microfibras, por su composición, limpia muchas superficies solo con agua — sin químicos nocivos para el medio ambiente.' },
  ]
  return (
    <section className="bg-[#0c0c0d] text-white">
      <div className="container-x py-20 md:py-24">
        <SectionTitle index="03" kicker="Medio ambiente" title="Calidad que respeta el planeta" dark />
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
          {items.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-[#0c0c0d] p-7 sm:p-9">
              <Icon size={26} strokeWidth={1.75} className="text-[#FFD400]" />
              <h3 className="mt-4 font-archivo text-2xl font-bold">{title}</h3>
              <p className="mt-2 text-white/60">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- PLANTA ---------------------------- */
function Planta() {
  const year = new Date().getFullYear()
  const stats = [
    { n: '25.000', label: 'm² cubiertos' },
    { n: '1.7M', label: 'trapos / mes' },
    { n: '24hs', label: '6 días / semana' },
    { n: `+${year - SITE.fundacion}`, label: 'años' },
  ]
  return (
    <section className="bg-[var(--surface)]">
      <div className="container-x py-20 md:py-24">
        <div className="mono-label flex items-center gap-2 text-[var(--muted)]">
          <Factory size={16} className="text-[#E30613]" /> Nuestra planta — {SITE.planta.ciudad}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-[var(--surface)] p-6 sm:p-8">
              <div className="font-archivo text-4xl font-extrabold tracking-tight sm:text-5xl">{s.n}</div>
              <div className="mono-label mt-2 text-[var(--muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- REVENDEDORES ------------------------- */
function Revendedores() {
  return (
    <section id="revendedores" className="scroll-mt-16 border-t border-[var(--border)]">
      <div className="container-x py-20 md:py-24">
        <div className="grid items-center gap-10 rounded-2xl bg-[#0c0c0d] p-8 text-white sm:p-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="mono-label text-[#FFD400]">04 — Para revendedores</span>
            <h2 className="mt-4 font-archivo text-3xl font-extrabold sm:text-4xl">Descargá las fotos de los productos, gratis.</h2>
            <p className="mt-3 max-w-md text-white/60">Explorá el catálogo completo de las dos líneas y bajá las fotos en alta — individuales o todas juntas — para publicar y revender. Sin vueltas.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/limpieza" className="inline-flex items-center gap-2 rounded-full bg-[#FFD400] px-5 py-3 text-sm font-semibold text-[#141210] transition-transform hover:-translate-y-0.5">
                <Download size={16} /> Fotos de Limpieza
              </Link>
              <Link to="/hogar" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#141210] transition-transform hover:-translate-y-0.5">
                <Download size={16} /> Fotos de Hogar
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...peek('limpieza', 3), ...peek('hogar', 3)].map((src, i) => (
              <img key={src + i} src={src} alt="" loading="lazy" width={120} height={120} className="aspect-square w-full rounded-lg object-cover" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ CONTACTO --------------------------- */
function Contacto() {
  const wa = waLink()
  const cards = [
    { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    ...(wa ? [{ icon: MessageCircle, label: 'WhatsApp', value: SITE.whatsappDisplay || 'Escribinos', href: wa }] : []),
    { icon: Instagram, label: 'Instagram', value: '@medianaranja', href: SITE.instagram },
    { icon: Facebook, label: 'Facebook', value: 'Media Naranja', href: SITE.facebook },
    { icon: MapPin, label: 'Planta', value: SITE.planta.ciudad, href: null },
  ]
  return (
    <section id="contacto" className="scroll-mt-16 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container-x py-20 md:py-24">
        <SectionTitle index="05" kicker="Contacto" title="Hablemos" />
        <p className="mt-3 max-w-md text-[var(--muted)]">¿Consultas, mayoristas o dónde comprar? Escribinos por donde te quede más cómodo.</p>

        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, label, value, href }) => {
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <Icon size={20} className="text-[#E30613]" />
                  {href && <ArrowUpRight size={16} className="text-[var(--muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                </div>
                <div className="mt-6">
                  <div className="mono-label text-[var(--muted)]">{label}</div>
                  <div className="mt-1 font-semibold">{value}</div>
                </div>
              </>
            )
            return href ? (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener" className="group flex flex-col bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--bg)]">{inner}</a>
            ) : (
              <div key={label} className="flex flex-col bg-[var(--surface)] p-6">{inner}</div>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={SITE.tienda} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
            <ShoppingBag size={16} /> Comprar en la tienda
          </a>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- FOOTER ---------------------------- */
function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="container-x flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <Logo />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {[['Limpieza', '/limpieza'], ['Hogar', '/hogar']].map(([t, to]) => (
            <Link key={to} to={to} className="mono-label text-[var(--muted)] hover:text-[var(--ink)]">{t}</Link>
          ))}
          <a href="#nosotros" className="mono-label text-[var(--muted)] hover:text-[var(--ink)]">Nosotros</a>
          <a href="#contacto" className="mono-label text-[var(--muted)] hover:text-[var(--ink)]">Contacto</a>
          <a href={SITE.tienda} target="_blank" rel="noopener" className="mono-label text-[var(--muted)] hover:text-[var(--ink)]">Tienda</a>
        </div>
        <p className="mono-label text-[var(--muted)]">© {new Date().getFullYear()} Media Naranja</p>
      </div>
    </footer>
  )
}

/* ------------------------------ SHARED ----------------------------- */
function SectionTitle({ index, kicker, title, dark }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        {index && <span className={`mono-label ${dark ? 'text-white/40' : 'text-[var(--muted)]'}`}>{index}</span>}
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: dark ? '#FFD400' : '#E30613' }} aria-hidden />
        <span className={`mono-label ${dark ? 'text-[#FFD400]' : 'text-[#E30613]'}`}>{kicker}</span>
      </div>
      <h2 className={`font-archivo text-3xl font-extrabold tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-[var(--ink)]'}`}>{title}</h2>
    </div>
  )
}
