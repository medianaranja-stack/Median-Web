import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, Leaf, Factory, Recycle, Download,
  Mail, Instagram, Facebook, MapPin, Menu, X, ShoppingBag, MessageCircle, Star, Asterisk,
} from 'lucide-react'
import seed from '../data/seed.json'
import Logo from '../components/Logo.jsx'
import { SITE, waLink } from '../lib/site.js'

const INK = '#141414'
const peek = (linea, n = 4) => seed.productos.filter((p) => p.linea === linea && p.imagenes.length).slice(0, n).map((p) => p.imagenes[0])
const catNames = (linea) => [...new Set(seed.productos.filter((p) => p.linea === linea).map((p) => p.categoriaLabel))]
const countOf = (linea) => seed.productos.filter((p) => p.linea === linea).length

const NAV = [
  { href: '#lineas', label: 'Líneas' }, { href: '#nosotros', label: 'Nosotros' },
  { href: '#revendedores', label: 'Revendedores' }, { href: '#contacto', label: 'Contacto' },
]

const bd = 'border-[2.5px] border-[#141414]'
const hard = 'shadow-[6px_6px_0_#141414]'
const hardSm = 'shadow-[4px_4px_0_#141414]'

export default function LandingV2() {
  return (
    <main className="min-h-dvh bg-[#FBF3DD] font-body text-[#141414]">
      <a href="#lineas" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[#141414] focus:px-4 focus:py-2 focus:text-white">Saltar al contenido</a>
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

function Sticker({ children, rotate = -4, bg = '#FFD400', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${bd} px-3 py-1.5 font-archivo text-xs font-extrabold uppercase tracking-wide ${className}`} style={{ background: bg, transform: `rotate(${rotate}deg)` }}>
      {children}
    </span>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b-[2.5px] border-[#141414] bg-[#FBF3DD]">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" aria-label="Media Naranja"><Logo /></a>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="rounded-none px-3 py-2 font-archivo text-sm font-bold uppercase tracking-wide transition-colors hover:bg-[#FFD400]">{l.label}</a>
          ))}
          <a href={SITE.tienda} target="_blank" rel="noopener" className={`ml-2 inline-flex items-center gap-1.5 ${bd} ${hardSm} bg-[#E30613] px-4 py-2 font-archivo text-sm font-extrabold uppercase text-white transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5`}>
            <ShoppingBag size={15} /> Comprar
          </a>
        </nav>
        <button className={`grid h-10 w-10 place-items-center ${bd} md:hidden`} onClick={() => setOpen((v) => !v)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t-[2.5px] border-[#141414] bg-[#FBF3DD] md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-3 sm:px-8">
            {NAV.map((l) => (<a key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-2 py-3 font-archivo font-bold uppercase hover:bg-[#FFD400]">{l.label}</a>))}
            <a href={SITE.tienda} target="_blank" rel="noopener" className={`mt-1 inline-flex items-center justify-center gap-1.5 ${bd} bg-[#E30613] px-4 py-3 font-archivo font-extrabold uppercase text-white`}><ShoppingBag size={16} /> Comprar</a>
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
    <section id="top" className="relative overflow-hidden border-b-[2.5px] border-[#141414]">
      {/* franja superior tipo etiqueta */}
      <div className="border-b-[2.5px] border-[#141414] bg-[#E30613] py-2">
        <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-hidden px-5 font-archivo text-xs font-extrabold uppercase tracking-widest text-white sm:px-8">
          <span className="whitespace-nowrap">★ Desde {SITE.fundacion}</span><span>★ Hecho en Argentina</span><span className="hidden sm:inline">★ Fotos para revendedores</span><span className="hidden md:inline">★ Limpieza + Hogar</span>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-14 sm:px-8 md:grid-cols-[1.15fr_1fr] md:py-20">
        <div>
          <div className="flex flex-wrap gap-2">
            <Sticker rotate={-4}><Star size={12} /> Est. {SITE.fundacion}</Sticker>
            <Sticker rotate={3} bg="#fff">Media Naranja</Sticker>
          </div>
          <motion.h2 initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-5 font-archivo text-[clamp(2.75rem,8vw,6rem)] font-black uppercase leading-[0.86] tracking-tight">
            Tu casa,<br />
            <span className="inline-block -rotate-1 bg-[#FFD400] px-2 py-1">más fácil.</span>
          </motion.h2>
          <p className="mt-6 max-w-md text-lg font-medium">{year - SITE.fundacion} años desarrollando productos de calidad para la limpieza y el hogar. Dos líneas, un mismo compromiso con vos.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#lineas" className={`inline-flex items-center gap-2 ${bd} ${hard} bg-[#E30613] px-6 py-3.5 font-archivo font-extrabold uppercase text-white transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5`}>Ver los productos <ArrowRight size={16} /></a>
            <a href="#nosotros" className={`inline-flex items-center gap-2 ${bd} bg-white px-6 py-3.5 font-archivo font-extrabold uppercase transition-transform hover:-translate-y-0.5`}>La marca</a>
          </div>
        </div>

        {/* collage de productos en marcos brutalistas */}
        <div className="relative hidden md:block">
          <div className="grid grid-cols-2 gap-4">
            {[...peek('limpieza', 2), ...peek('hogar', 2)].map((src, i) => (
              <div key={src} className={`aspect-square overflow-hidden ${bd} ${hard} bg-white`} style={{ transform: `rotate(${[-3, 2, -2, 3][i]}deg)` }}>
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <span className={`absolute -bottom-4 -left-4 grid h-20 w-20 place-items-center rounded-full ${bd} bg-[#FFD400] text-center font-archivo text-[11px] font-black uppercase leading-tight`} style={{ transform: 'rotate(-8deg)' }}>100% Algodón</span>
        </div>
      </div>
    </section>
  )
}

function Lineas() {
  return (
    <section id="lineas" className="border-b-[2.5px] border-[#141414]">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <div className="flex items-center gap-3">
          <Asterisk size={20} /><span className="font-archivo text-sm font-extrabold uppercase tracking-widest">Nuestras líneas</span>
        </div>
        <h2 className="mt-3 font-archivo text-4xl font-black uppercase tracking-tight sm:text-6xl">Elegí tu mundo</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <LineBlock to="/limpieza" index="01" name="Limpieza" bg="#FFD400" accent="#E30613"
            desc="Trapos, microfibras, rejillas, secadores. Hechos en nuestra planta textil."
            images={peek('limpieza', 4)} cats={catNames('limpieza').length} prods={countOf('limpieza')} />
          <LineBlock to="/hogar" index="02" name="Hogar" bg="#F1E7D3" accent="#C0611E"
            desc="Toallas, sábanas, acolchados, mantas. Suavidad premium para tu descanso."
            images={peek('hogar', 4)} cats={catNames('hogar').length} prods={countOf('hogar')} />
        </div>
      </div>
    </section>
  )
}

function LineBlock({ to, index, name, desc, images, bg, accent, cats, prods }) {
  const reduce = useReducedMotion()
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}>
      <Link to={to} className={`group block ${bd} ${hard} p-6 transition-transform duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_#141414] sm:p-8`} style={{ background: bg }} aria-label={`Entrar a ${name}`}>
        <div className="flex items-center justify-between font-archivo text-sm font-extrabold uppercase">
          <span>Línea {index}</span>
          <span className={`grid h-8 w-8 place-items-center rounded-full ${bd} bg-white`}>{index}</span>
        </div>
        <h3 className="mt-3 font-archivo text-6xl font-black uppercase leading-none tracking-tight sm:text-7xl">{name}</h3>
        <p className="mt-3 max-w-sm font-medium">{desc}</p>
        <div className="mt-5 flex gap-3 font-archivo text-sm font-extrabold uppercase">
          <span className={`${bd} bg-white px-3 py-1.5`}>{String(cats).padStart(2, '0')} Categorías</span>
          <span className={`${bd} bg-white px-3 py-1.5`}>{String(prods).padStart(2, '0')} Productos</span>
        </div>
        <div className="mt-5 flex gap-2.5">
          {images.map((src) => (<div key={src} className={`h-16 w-16 overflow-hidden ${bd} bg-white sm:h-[74px] sm:w-[74px]`}><img src={src} alt="" loading="lazy" className="h-full w-full object-cover" /></div>))}
        </div>
        <div className={`mt-6 inline-flex items-center gap-2 ${bd} ${hardSm} bg-white px-5 py-2.5 font-archivo font-extrabold uppercase transition-transform group-hover:gap-3`} style={{ color: accent }}>
          Ver productos <ArrowRight size={18} strokeWidth={3} />
        </div>
      </Link>
    </motion.div>
  )
}

function Nosotros() {
  const year = new Date().getFullYear()
  return (
    <section id="nosotros" className="border-b-[2.5px] border-[#141414]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_1.05fr] md:py-24">
        <div>
          <Sticker rotate={-3}>Nosotros</Sticker>
          <h2 className="mt-4 font-archivo text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">Más de 40 años haciéndote la vida más fácil.</h2>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[{ n: `+${year - SITE.fundacion}`, l: 'años' }, { n: '#1', l: 'categoría' }, { n: '02', l: 'líneas' }].map((s) => (
              <div key={s.l} className={`${bd} bg-[#FFD400] p-3 text-center`}><div className="font-archivo text-3xl font-black">{s.n}</div><div className="font-archivo text-[10px] font-bold uppercase">{s.l}</div></div>
            ))}
          </div>
        </div>
        <div className="space-y-4 text-[17px] font-medium leading-relaxed">
          <p>En {SITE.fundacion} nacimos para que puedas tener en tu hogar un aliado que te ayude con la limpieza. Desarrollamos productos de alta calidad para que te preocupes por otras cosas, no por limpiar.</p>
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
    { icon: Leaf, title: 'Solo con agua', body: 'La línea de microfibras, por su composición, limpia muchas superficies solo con agua — sin químicos nocivos.' },
  ]
  return (
    <section className="border-b-[2.5px] border-[#141414] bg-[#141414] text-[#FBF3DD]">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <span className="inline-flex items-center gap-1.5 border-[2.5px] border-[#FBF3DD] bg-[#FFD400] px-3 py-1.5 font-archivo text-xs font-extrabold uppercase text-[#141414]">Medio ambiente</span>
        <h2 className="mt-4 font-archivo text-4xl font-black uppercase tracking-tight sm:text-5xl">Calidad que respeta el planeta</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {items.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border-[2.5px] border-[#FBF3DD] bg-[#1c1c1c] p-6 sm:p-8">
              <Icon size={26} className="text-[#FFD400]" />
              <h3 className="mt-3 font-archivo text-2xl font-black uppercase">{title}</h3>
              <p className="mt-2 font-medium text-[#FBF3DD]/70">{body}</p>
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
    <section className="border-b-[2.5px] border-[#141414]">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <div className="flex items-center gap-2 font-archivo text-sm font-extrabold uppercase tracking-widest"><Factory size={18} className="text-[#E30613]" /> Nuestra planta — {SITE.planta.ciudad}</div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`border-[2.5px] border-[#141414] p-6 ${i ? '-ml-[2.5px]' : ''} ${i >= 2 ? '-mt-[2.5px] md:mt-0' : ''}`} style={{ background: i % 2 ? '#FFD400' : '#fff' }}>
              <div className="font-archivo text-4xl font-black tracking-tight sm:text-5xl">{s.n}</div>
              <div className="mt-1 font-archivo text-[11px] font-bold uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Revendedores() {
  return (
    <section id="revendedores" className="border-b-[2.5px] border-[#141414]">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <div className={`grid items-center gap-8 ${bd} ${hard} bg-[#FFD400] p-8 sm:p-12 md:grid-cols-[1.2fr_1fr]`}>
          <div>
            <span className={`inline-block ${bd} bg-[#E30613] px-3 py-1.5 font-archivo text-xs font-extrabold uppercase text-white`}>Para revendedores</span>
            <h2 className="mt-4 font-archivo text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-4xl">Descargá las fotos de los productos, gratis.</h2>
            <p className="mt-3 max-w-md font-medium">Explorá el catálogo de las dos líneas y bajá las fotos en alta — individuales o todas juntas — para publicar y revender.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/limpieza" className={`inline-flex items-center gap-2 ${bd} ${hardSm} bg-[#141414] px-5 py-3 font-archivo font-extrabold uppercase text-white transition-transform hover:-translate-y-0.5`}><Download size={16} /> Limpieza</Link>
              <Link to="/hogar" className={`inline-flex items-center gap-2 ${bd} ${hardSm} bg-white px-5 py-3 font-archivo font-extrabold uppercase transition-transform hover:-translate-y-0.5`}><Download size={16} /> Hogar</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[...peek('limpieza', 3), ...peek('hogar', 3)].map((src, i) => (<div key={src + i} className={`aspect-square overflow-hidden ${bd} bg-white`}><img src={src} alt="" loading="lazy" className="h-full w-full object-cover" /></div>))}
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
    <section id="contacto" className="border-b-[2.5px] border-[#141414]">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <Sticker rotate={-3} bg="#E30613" className="text-white">Contacto</Sticker>
        <h2 className="mt-4 font-archivo text-4xl font-black uppercase tracking-tight sm:text-5xl">Hablemos</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, label, value, href }) => {
            const inner = (<><div className="flex items-center justify-between"><Icon size={20} className="text-[#E30613]" />{href && <ArrowUpRight size={16} />}</div><div className="mt-6"><div className="font-archivo text-[11px] font-bold uppercase">{label}</div><div className="mt-1 font-semibold">{value}</div></div></>)
            return href ? (<a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener" className={`flex flex-col ${bd} bg-white p-5 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#141414]`}>{inner}</a>) : (<div key={label} className={`flex flex-col ${bd} bg-white p-5`}>{inner}</div>)
          })}
        </div>
        <a href={SITE.tienda} target="_blank" rel="noopener" className={`mt-8 inline-flex items-center gap-2 ${bd} ${hard} bg-[#E30613] px-6 py-3.5 font-archivo font-extrabold uppercase text-white transition-transform hover:-translate-y-0.5`}><ShoppingBag size={16} /> Comprar en la tienda</a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#141414] text-[#FBF3DD]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-5 py-8 sm:flex-row sm:items-center sm:px-8">
        <span className="font-archivo text-xl font-black uppercase">media<span className="text-[#FFD400]">naranja</span></span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-archivo text-sm font-bold uppercase">
          <Link to="/limpieza" className="hover:text-[#FFD400]">Limpieza</Link>
          <Link to="/hogar" className="hover:text-[#FFD400]">Hogar</Link>
          <a href="#contacto" className="hover:text-[#FFD400]">Contacto</a>
          <a href={SITE.tienda} target="_blank" rel="noopener" className="hover:text-[#FFD400]">Tienda</a>
        </div>
        <p className="font-archivo text-xs font-bold uppercase text-[#FBF3DD]/60">© {new Date().getFullYear()} Media Naranja</p>
      </div>
    </footer>
  )
}
