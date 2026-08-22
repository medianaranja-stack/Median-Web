import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, Leaf, Factory, Recycle, Download,
  Mail, Instagram, Facebook, MapPin, Menu, X, ShoppingBag, MessageCircle,
} from 'lucide-react'
import seed from '../data/seed.json'
import Logo from '../components/Logo.jsx'
import { SITE, waLink } from '../lib/site.js'

const CREAM = '#EFE2C6', INK = '#3A2A1C', ORANGE = '#C2410C', MUST = '#E3A72F', RUST = '#CC3A1E', PANEL = '#F8EED6'
const peek = (linea, n = 4) => seed.productos.filter((p) => p.linea === linea && p.imagenes.length).slice(0, n).map((p) => p.imagenes[0])
const catNames = (linea) => [...new Set(seed.productos.filter((p) => p.linea === linea).map((p) => p.categoriaLabel))]
const countOf = (linea) => seed.productos.filter((p) => p.linea === linea).length

const NAV = [
  { href: '#lineas', label: 'Líneas' }, { href: '#nosotros', label: 'Nosotros' },
  { href: '#revendedores', label: 'Revendedores' }, { href: '#contacto', label: 'Contacto' },
]

export default function LandingV3() {
  return (
    <main className="grain min-h-dvh font-body" style={{ background: CREAM, color: INK }}>
      <a href="#lineas" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#3A2A1C] focus:px-4 focus:py-2 focus:text-[#EFE2C6]">Saltar al contenido</a>
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
      <style>{V3CSS}</style>
    </main>
  )
}

function Seal({ size = 116 }) {
  return (
    <div className="v3-seal relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
        <defs><path id="v3circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
        <text fill={INK} style={{ fontFamily: "'DM Serif Display', serif", fontSize: '13px', letterSpacing: '3px' }}>
          <textPath href="#v3circle" startOffset="0">MEDIA NARANJA ✦ DESDE 1975 ✦ </textPath>
        </text>
      </svg>
      <span className="grid h-14 w-14 place-items-center rounded-full text-[11px] font-bold uppercase tracking-wider text-white" style={{ background: ORANGE }}>1975</span>
    </div>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${solid ? 'border-b border-[#dcc9a2] bg-[#EFE2C6]/90 backdrop-blur' : ''}`}>
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
        <a href="#top" aria-label="Media Naranja"><Logo /></a>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((l) => (<a key={l.href} href={l.href} className="rounded-full px-3.5 py-2 font-medium transition-colors" style={{ color: INK }} onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)} onMouseLeave={(e) => (e.currentTarget.style.color = INK)}>{l.label}</a>))}
          <a href={SITE.tienda} target="_blank" rel="noopener" className="ml-1 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: ORANGE }}><ShoppingBag size={15} /> Comprar</a>
        </nav>
        <button className="grid h-10 w-10 place-items-center rounded-full md:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && (
        <div className="border-t border-[#dcc9a2] bg-[#EFE2C6] md:hidden">
          <div className="mx-auto flex w-full max-w-5xl flex-col px-5 py-2 sm:px-8">
            {NAV.map((l) => (<a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3.5 font-medium">{l.label}</a>))}
            <a href={SITE.tienda} target="_blank" rel="noopener" className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold text-white" style={{ background: ORANGE }}><ShoppingBag size={16} /> Comprar</a>
          </div>
        </div>
      )}
    </header>
  )
}

function Hero() {
  const reduce = useReducedMotion()
  const year = new Date().getFullYear()
  return (
    <section id="top" className="relative flex min-h-dvh flex-col justify-center overflow-hidden">
      {/* sunburst retro */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[130vh] w-[130vh] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" style={{ background: `repeating-conic-gradient(${ORANGE} 0deg 7deg, transparent 7deg 14deg)` }} />
      <div className="mx-auto w-full max-w-5xl px-5 pt-24 text-center sm:px-8">
        <div className="flex justify-center"><Seal /></div>
        <motion.p initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-6 font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: RUST }}>Limpieza & Hogar · {SITE.planta.ciudad}</motion.p>
        <motion.h2 initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto mt-4 max-w-3xl font-[DM_Serif_Display] text-[clamp(3rem,8.5vw,7rem)] leading-[0.95]" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Tu casa, <span className="italic" style={{ color: ORANGE }}>más fácil.</span>
        </motion.h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: '#6a5a45' }}>{year - SITE.fundacion} años desarrollando productos de calidad para la limpieza y el hogar. Dos líneas, un mismo compromiso con vos.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#lineas" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: ORANGE }}>Ver los productos <ArrowRight size={16} /></a>
          <a href="#nosotros" className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors" style={{ borderColor: INK }}>La marca</a>
        </div>
      </div>
    </section>
  )
}

function Arch({ children, className = '', style = {} }) {
  return <div className={`overflow-hidden ${className}`} style={{ borderRadius: '999px 999px 22px 22px', ...style }}>{children}</div>
}

function Lineas() {
  return (
    <section id="lineas" className="scroll-mt-16 border-t" style={{ borderColor: '#dcc9a2' }}>
      <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 md:py-28">
        <div className="text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: RUST }}>Nuestras líneas</span>
          <h2 className="mt-3 italic" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.25rem,5vw,3.5rem)' }}>Dos mundos, una marca</h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <LineCard to="/limpieza" name="Limpieza" panel={MUST} accent={RUST} desc="Trapos, microfibras, rejillas, secadores. Hechos en nuestra planta textil." images={peek('limpieza', 3)} cats={catNames('limpieza').length} prods={countOf('limpieza')} />
          <LineCard to="/hogar" name="Hogar" panel="#D9B48A" accent={ORANGE} desc="Toallas, sábanas, acolchados, mantas. Suavidad premium para tu descanso." images={peek('hogar', 3)} cats={catNames('hogar').length} prods={countOf('hogar')} />
        </div>
      </div>
    </section>
  )
}

function LineCard({ to, name, desc, images, panel, accent, cats, prods }) {
  const reduce = useReducedMotion()
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}>
      <Link to={to} className="group block" aria-label={`Entrar a ${name}`}>
        <Arch className="border" style={{ borderColor: '#dcc9a2' }}>
          <div className="relative px-5 pt-10" style={{ background: panel }}>
            <div className="flex justify-center gap-2">
              {images.map((src, i) => (
                <div key={src} className="h-24 w-24 overflow-hidden rounded-xl bg-white shadow-md transition-transform duration-500 group-hover:-translate-y-1 sm:h-28 sm:w-28" style={{ transform: `rotate(${[-5, 0, 5][i] ?? 0}deg)`, transitionDelay: `${i * 50}ms` }}>
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-t-3xl bg-[#F8EED6] px-6 pb-6 pt-6">
              <h3 className="text-center italic leading-none" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.5rem,6vw,4rem)' }}>{name}</h3>
              <p className="mt-3 text-center text-[15px]" style={{ color: '#6a5a45' }}>{desc}</p>
              <div className="mt-5 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-wider" style={{ color: '#8a7452' }}>
                <span>{cats} categorías</span><span style={{ color: accent }}>✦</span><span>{prods} productos</span>
              </div>
              <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all group-hover:gap-3.5" style={{ background: accent }}>Ver productos <ArrowRight size={17} strokeWidth={2.5} /></span>
              </div>
            </div>
          </div>
        </Arch>
      </Link>
    </motion.div>
  )
}

function Nosotros() {
  const year = new Date().getFullYear()
  return (
    <section id="nosotros" className="scroll-mt-16 border-t" style={{ borderColor: '#dcc9a2', background: PANEL }}>
      <div className="mx-auto grid w-full max-w-5xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-[1fr_1.05fr] md:py-28">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: RUST }}>Nosotros</span>
          <h2 className="mt-3 italic leading-[1]" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.25rem,5vw,3.5rem)' }}>Más de 40 años haciéndote la vida más fácil.</h2>
        </div>
        <div className="space-y-4 text-[17px] leading-relaxed" style={{ color: '#6a5a45' }}>
          <p className="v3-dropcap">En {SITE.fundacion} nacimos para que puedas tener en tu hogar un aliado que te ayude con la limpieza. Desarrollamos productos de alta calidad para que te preocupes por otras cosas, no por limpiar.</p>
          <p>En poco tiempo llegamos a ser líderes de la categoría. Día a día cambiamos junto a vos: renovamos nuestra imagen, nuestras etiquetas y lanzamos productos a la medida de tus necesidades.</p>
          <p>Hoy estamos a la vanguardia de las últimas tendencias mundiales en limpieza y hogar.</p>
        </div>
      </div>
    </section>
  )
}

function Sustentabilidad() {
  const items = [
    { icon: Recycle, title: 'Cero desperdicio', body: 'Nuestros trapos de piso tejidos surgen de reutilizar retazos de nuestra planta textil. Aprovechamos al máximo la producción.' },
    { icon: Leaf, title: 'Solo con agua', body: 'La línea de microfibras limpia muchas superficies solo con agua — sin químicos nocivos para el medio ambiente.' },
  ]
  return (
    <section className="border-t" style={{ borderColor: '#dcc9a2' }}>
      <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 md:py-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: RUST }}>Medio ambiente</span>
        <h2 className="mt-3 italic" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem,4.5vw,3rem)' }}>Calidad que respeta el planeta</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-[28px] border p-7 sm:p-9" style={{ borderColor: '#dcc9a2', background: PANEL }}>
              <span className="grid h-12 w-12 place-items-center rounded-full text-white" style={{ background: ORANGE }}><Icon size={22} /></span>
              <h3 className="mt-4 italic" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem' }}>{title}</h3>
              <p className="mt-2" style={{ color: '#6a5a45' }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Planta() {
  const year = new Date().getFullYear()
  const stats = [{ n: '25.000', label: 'm² cubiertos' }, { n: '1.7M', label: 'trapos / mes' }, { n: '24hs', label: '6 días' }, { n: `+${year - SITE.fundacion}`, label: 'años' }]
  return (
    <section className="border-t" style={{ borderColor: '#dcc9a2', background: PANEL }}>
      <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 md:py-24">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em]" style={{ color: RUST }}><Factory size={16} /> Nuestra planta — {SITE.planta.ciudad}</p>
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (<div key={s.label}><div className="italic" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.5rem,5vw,3.5rem)' }}>{s.n}</div><div className="mt-1 text-sm" style={{ color: '#8a7452' }}>{s.label}</div></div>))}
        </div>
      </div>
    </section>
  )
}

function Revendedores() {
  return (
    <section id="revendedores" className="scroll-mt-16 border-t" style={{ borderColor: '#dcc9a2' }}>
      <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 md:py-24">
        <div className="grid items-center gap-10 rounded-[32px] p-8 text-white sm:p-12 md:grid-cols-[1.2fr_1fr]" style={{ background: INK }}>
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.24em]" style={{ color: MUST }}>Para revendedores</span>
            <h2 className="mt-3 italic" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem,4vw,2.75rem)' }}>Descargá las fotos de los productos, gratis.</h2>
            <p className="mt-3 max-w-md text-[#EFE2C6]/70">Explorá el catálogo de las dos líneas y bajá las fotos en alta — individuales o todas juntas — para publicar y revender.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/limpieza" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: ORANGE }}><Download size={16} /> Fotos de Limpieza</Link>
              <Link to="/hogar" className="inline-flex items-center gap-2 rounded-full bg-[#EFE2C6] px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5" style={{ color: INK }}><Download size={16} /> Fotos de Hogar</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...peek('limpieza', 3), ...peek('hogar', 3)].map((src, i) => (<img key={src + i} src={src} alt="" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />))}
          </div>
        </div>
      </div>
    </section>
  )
}

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
    <section id="contacto" className="scroll-mt-16 border-t" style={{ borderColor: '#dcc9a2', background: PANEL }}>
      <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 md:py-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: RUST }}>Contacto</span>
        <h2 className="mt-3 italic" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.25rem,5vw,3.5rem)' }}>Hablemos</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, label, value, href }) => {
            const inner = (<><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: ORANGE }}><Icon size={18} /></span>{href && <ArrowUpRight size={16} style={{ color: '#8a7452' }} />}</div><div className="mt-5"><div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: '#8a7452' }}>{label}</div><div className="mt-1 font-semibold">{value}</div></div></>)
            return href ? (<a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener" className="flex flex-col rounded-3xl border p-6 transition-transform hover:-translate-y-1" style={{ borderColor: '#dcc9a2', background: CREAM }}>{inner}</a>) : (<div key={label} className="flex flex-col rounded-3xl border p-6" style={{ borderColor: '#dcc9a2', background: CREAM }}>{inner}</div>)
          })}
        </div>
        <a href={SITE.tienda} target="_blank" rel="noopener" className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: ORANGE }}><ShoppingBag size={16} /> Comprar en la tienda</a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: '#dcc9a2' }}>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <Logo />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" style={{ color: '#8a7452' }}>
          <Link to="/limpieza" className="hover:text-[#3A2A1C]">Limpieza</Link>
          <Link to="/hogar" className="hover:text-[#3A2A1C]">Hogar</Link>
          <a href="#contacto" className="hover:text-[#3A2A1C]">Contacto</a>
          <a href={SITE.tienda} target="_blank" rel="noopener" className="hover:text-[#3A2A1C]">Tienda</a>
        </div>
        <p className="text-sm" style={{ color: '#8a7452' }}>© {new Date().getFullYear()} Media Naranja</p>
      </div>
    </footer>
  )
}

const V3CSS = `
.v3-seal{animation:v3spin 26s linear infinite}
@keyframes v3spin{to{transform:rotate(360deg)}}
.v3-seal > span{animation:v3spin 26s linear infinite reverse}
.v3-dropcap::first-letter{float:left;margin:.04em .08em 0 0;font-family:'DM Serif Display',serif;font-size:3.6em;line-height:.72;color:${ORANGE}}
@media (prefers-reduced-motion:reduce){.v3-seal,.v3-seal > span{animation:none}}
`
