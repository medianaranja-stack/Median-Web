import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Package, Mail, ArrowRight, Download, Facebook, Instagram, Factory, Check } from 'lucide-react'
import seed from '../data/seed.json'
import { getMockProducts } from '../lib/mockStore.js'
import { getBanner } from '../lib/bannerStore.js'
import { SITE } from '../lib/site.js'
import Logo from '../components/Logo.jsx'
import SafeImg from '../components/SafeImg.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductModal from '../components/ProductModal.jsx'

const YELLOW = '#FFD400', RED = '#E30613', INK = '#1c1a17'
const limpiezaProducts = () => [...getMockProducts().filter((p) => p.linea === 'limpieza'), ...seed.productos.filter((p) => p.linea === 'limpieza')]

const MODULES = [
  { icon: BookOpen, title: 'Historia', desc: 'Fabricamos en Catamarca desde 1975.', href: '#historia' },
  { icon: Package, title: 'Productos', desc: 'Trapos, microfibras, rejillas y más.', href: '#productos' },
  { icon: Mail, title: 'Contacto', desc: 'Consultas, mayoristas y ventas.', href: '#contacto' },
]

export default function LandingV5() {
  const [selected, setSelected] = useState(null)
  return (
    <main className="relative min-h-dvh bg-[var(--bg)] font-body text-[var(--ink)]">
      <a href="#modulos" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[#1c1a17] focus:px-4 focus:py-2 focus:text-white">Saltar al contenido</a>
      <h1 className="sr-only">Media Naranja Limpieza — productos de limpieza hechos en Argentina desde 1975.</h1>
      <PageBg />
      <div className="relative z-10">
        <Header />
        <Banner />
        <Modules />
        <Productos onOpen={setSelected} />
        <Historia />
        <Contacto />
        <Footer />
      </div>
      {selected && <ProductModal producto={selected} onClose={() => setSelected(null)} />}
      <style>{V5CSS}</style>
    </main>
  )
}

const V5CSS = `
@keyframes v5drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(6vw,4vw)}}
@keyframes v5drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-5vw,-3vw)}}
@keyframes v5drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(3vw,-5vw)}}
.v5-glow{animation:v5drift1 20s ease-in-out infinite}
.v5-glow2{animation:v5drift2 26s ease-in-out infinite}
.v5-glow3{animation:v5drift3 32s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){.v5-glow,.v5-glow2,.v5-glow3{animation:none}}
`

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5" style={{ background: YELLOW }}>
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
        <a href="#top" aria-label="Media Naranja Limpieza"><Logo /></a>
        <div className="flex items-center gap-4">
          <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="text-[#5c4a00] hover:text-[#1c1a17]"><Facebook size={18} /></a>
          <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="text-[#5c4a00] hover:text-[#1c1a17]"><Instagram size={18} /></a>
        </div>
      </div>
    </header>
  )
}

function PageBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="tech-grid absolute inset-0 opacity-60" />
      <div className="v5-glow absolute h-[38vw] w-[38vw] rounded-full bg-[#FFD400] opacity-25 blur-[90px]" style={{ top: '4%', left: '2%' }} />
      <div className="v5-glow2 absolute h-[34vw] w-[34vw] rounded-full bg-[#E30613] opacity-[0.09] blur-[90px]" style={{ top: '38%', right: '4%' }} />
      <div className="v5-glow3 absolute h-[32vw] w-[32vw] rounded-full bg-[#FFD400] opacity-[0.16] blur-[90px]" style={{ bottom: '2%', left: '38%' }} />
    </div>
  )
}

function Banner() {
  const [b, setB] = useState(getBanner())
  const [idx, setIdx] = useState(0)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const h = () => { setB(getBanner()); setIdx(0) }
    window.addEventListener('mn-banner-changed', h)
    return () => window.removeEventListener('mn-banner-changed', h)
  }, [])

  const slides = b.slides || []
  useEffect(() => {
    if (reduce || slides.length < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3800)
    return () => clearInterval(t)
  }, [reduce, slides.length])

  if (!b.active || slides.length === 0) return <div id="top" />
  return (
    <section id="top" className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-6 sm:px-8">
      <div className="relative h-[42vh] min-h-[240px] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card sm:h-[46vh]">
        {slides.map((s, i) => (
          <div key={s.id} className="absolute inset-0 transition-opacity duration-[900ms] ease-out" style={{ opacity: i === idx ? 1 : 0 }}>
            <SafeImg src={s.src} alt={s.title || 'Media Naranja'} className="h-full w-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
            {s.title && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 sm:p-8">
                <h2 className="max-w-2xl font-archivo text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">{s.title}</h2>
              </div>
            )}
          </div>
        ))}
        {/* puntos */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((_, i) => (
              <button key={i} type="button" onClick={() => setIdx(i)} aria-label={`Ir a la imagen ${i + 1}`}
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: i === idx ? 20 : 8, background: i === idx ? '#fff' : 'rgba(255,255,255,.55)' }} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function Modules() {
  return (
    <section id="modulos" className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-8 pt-6 sm:px-8">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {MODULES.map(({ icon: Icon, title, desc, href }) => (
          <a key={title} href={href} className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-6">
            <span className="grid h-10 w-10 place-items-center rounded-full sm:h-12 sm:w-12" style={{ background: YELLOW }}><Icon size={20} className="text-[#1c1a17]" /></span>
            <h3 className="mt-3 font-archivo text-lg font-extrabold sm:text-xl">{title}</h3>
            <p className="mt-1 hidden text-sm text-[var(--muted)] sm:block">{desc}</p>
            <span className="mt-auto hidden items-center gap-1 pt-3 text-sm font-semibold sm:inline-flex" style={{ color: RED }}>Ver <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></span>
          </a>
        ))}
      </div>
    </section>
  )
}

function Productos({ onOpen }) {
  const all = useMemo(limpiezaProducts, [])
  const featured = all.slice(0, 12)
  return (
    <section id="productos" className="scroll-mt-16 border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-archivo text-2xl font-extrabold sm:text-3xl">Nuestros productos</h2>
            <p className="mt-1 text-[15px] text-[var(--muted)]">Tocá un producto para ver la ficha y descargar las fotos.</p>
          </div>
          <Link to="/limpieza" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: INK }}>Ver todos ({all.length}) <ArrowRight size={15} /></Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => <ProductCard key={p.id} producto={p} index={i} onOpen={onOpen} />)}
        </div>
      </div>
    </section>
  )
}

function Historia() {
  return (
    <section id="historia" className="scroll-mt-16 border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
        <h2 className="font-archivo text-2xl font-extrabold sm:text-3xl">Nuestra fábrica en Catamarca</h2>
        <div className="mt-6 grid gap-3">
          <div className="overflow-hidden rounded-2xl">
            <SafeImg src="/fabrica/planta-a.jpg" alt="Planta textil de Media Naranja en Valle Viejo, Catamarca" loading="lazy" className="aspect-[21/9] w-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { src: '/fabrica/planta-b.jpg', alt: 'Producción en la planta' },
              { src: '/fabrica/fabrica-2.jpg', alt: 'Fábrica de trapos de piso' },
              { src: '/fabrica/nosotros.jpg', alt: 'Media Naranja desde 1975' },
            ].map((f) => (
              <div key={f.src} className="overflow-hidden rounded-2xl">
                <SafeImg src={f.src} alt={f.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Contacto() {
  const [sent, setSent] = useState(false)
  return (
    <section id="contacto" className="scroll-mt-16 border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-xl px-5 py-12 text-center sm:px-8">
        <h2 className="font-archivo text-2xl font-extrabold sm:text-3xl">Contacto</h2>
        <p className="mt-2 text-[var(--muted)]">¿Consultas, mayoristas o dónde comprar? Escribinos.</p>
        {sent ? (
          <div className="mx-auto mt-6 grid place-items-center rounded-2xl border border-green-200 bg-green-50 p-8">
            <Check className="text-green-700" size={26} /><p className="mt-2 font-semibold text-green-800">¡Gracias! Te respondemos a la brevedad.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input required placeholder="Nombre" autoComplete="name" className="v5-input" />
            <input required type="email" placeholder="E-mail" autoComplete="email" className="v5-input" />
            <input placeholder="Teléfono" inputMode="tel" autoComplete="tel" className="v5-input sm:col-span-2" />
            <textarea rows={3} placeholder="Comentario" className="v5-input resize-none sm:col-span-2" />
            <button type="submit" className="rounded-full px-8 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5 sm:col-span-2" style={{ background: RED }}>Enviar</button>
          </form>
        )}
        <p className="mt-5 text-sm text-[var(--muted)]"><a href={`mailto:${SITE.email}`} className="underline underline-offset-2">{SITE.email}</a></p>
      </div>
      <style>{`.v5-input{width:100%;border:1.5px solid var(--border);border-radius:10px;padding:12px 14px;font-size:15px;min-height:48px;background:var(--bg);color:var(--ink)}.v5-input:focus{outline:none;border-color:var(--ink)}`}</style>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-5xl px-5 py-6 text-center text-sm text-[var(--muted)] sm:px-8">
        Media Naranja · Fibran Sur S.A. · Argentina · © {new Date().getFullYear()}
      </div>
    </footer>
  )
}
