import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, Facebook, Instagram, Home, Package, Car, ArrowRight, Recycle, Leaf, Factory, Menu, X, Check } from 'lucide-react'
import seed from '../data/seed.json'
import Logo from '../components/Logo.jsx'
import { SITE } from '../lib/site.js'

const YELLOW = '#FFD400', RED = '#E30613', INK = '#20201d'
const img = (linea, i = 0) => {
  const list = seed.productos.filter((p) => p.linea === linea && p.imagenes.length)
  return (list[i] || list[0])?.imagenes[0]
}
const NAV = [
  { href: '#nosotros', label: 'Nosotros' }, { to: '/limpieza', label: 'Productos' },
  { href: '#campana', label: 'Campaña' }, { href: '#contacto', label: 'Contacto' },
]

export default function LandingV4() {
  return (
    <main className="min-h-dvh bg-white font-body text-[#20201d]">
      <a href="#hero" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[#20201d] focus:px-4 focus:py-2 focus:text-white">Saltar al contenido</a>
      <h1 className="sr-only">Media Naranja — productos de limpieza y hogar desde 1975.</h1>
      <Header />
      <Hero />
      <SplitBlocks />
      <Campana />
      <Usos />
      <Nosotros />
      <Contacto />
      <Footer />
    </main>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 shadow-sm" style={{ background: YELLOW }}>
      <div className="mx-auto flex h-[70px] w-full max-w-6xl items-center gap-4 px-5 sm:px-8">
        <nav className="hidden items-center gap-5 md:flex">
          {NAV.map((l) => l.to ? (
            <Link key={l.label} to={l.to} className="text-sm font-semibold uppercase tracking-wide text-[#5c4a00] transition-colors hover:text-[#20201d]">{l.label}</Link>
          ) : (
            <a key={l.label} href={l.href} className="text-sm font-semibold uppercase tracking-wide text-[#5c4a00] transition-colors hover:text-[#20201d]">{l.label}</a>
          ))}
        </nav>
        <a href="#hero" className="mx-auto md:mx-4" aria-label="Media Naranja"><Logo /></a>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <div className="flex items-center overflow-hidden rounded-full bg-white shadow-inner">
            <input placeholder="Buscar…" className="w-40 bg-transparent px-4 py-2 text-sm outline-none" aria-label="Buscar" />
            <button className="grid h-9 w-9 place-items-center bg-[#20201d] text-white" aria-label="Buscar"><Search size={16} /></button>
          </div>
          <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="text-[#5c4a00] hover:text-[#20201d]"><Facebook size={18} /></a>
          <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="text-[#5c4a00] hover:text-[#20201d]"><Instagram size={18} /></a>
        </div>
        <button className="ml-auto grid h-10 w-10 place-items-center rounded-full text-[#20201d] md:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && (
        <div className="border-t border-black/10 md:hidden" style={{ background: YELLOW }}>
          <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-2 sm:px-8">
            {NAV.map((l) => l.to ? (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="px-2 py-3 font-semibold uppercase text-[#5c4a00]">{l.label}</Link>
            ) : (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="px-2 py-3 font-semibold uppercase text-[#5c4a00]">{l.label}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function Hero() {
  const reduce = useReducedMotion()
  return (
    <section id="hero" className="relative">
      <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
        <img src={img('hogar', 5)} alt="Línea Hogar Media Naranja" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/25 to-black/10" />
        <div className="absolute inset-0 grid place-items-center px-5">
          <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl rounded-2xl border border-white/40 bg-white/25 p-8 text-center backdrop-blur-md sm:p-10">
            <h2 className="font-archivo text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-5xl">
              <span style={{ color: RED }}>Conocé</span> la nueva línea <span className="whitespace-nowrap">Home</span>
            </h2>
            <p className="mt-3 font-archivo text-lg font-bold uppercase text-white sm:text-2xl">
              A <span style={{ color: RED }}>un click</span> de conocer a tu <span style={{ color: RED }}>Media Naranja</span>
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/hogar" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase text-white transition-transform hover:-translate-y-0.5" style={{ background: RED }}>Ver la línea Hogar <ArrowRight size={16} /></Link>
              <Link to="/limpieza" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold uppercase text-[#20201d] transition-transform hover:-translate-y-0.5">Línea Limpieza</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function SplitBlocks() {
  const blocks = [
    { label: 'Nosotros', sub: 'Desarrollamos productos de limpieza para que puedas disfrutar', href: '#nosotros', to: null, src: img('limpieza', 3) },
    { label: 'Nuestros productos', sub: 'Calidad argentina en limpieza y hogar', href: null, to: '/limpieza', src: img('hogar', 2) },
  ]
  return (
    <section className="grid gap-0 sm:grid-cols-2">
      {blocks.map((b) => {
        const inner = (
          <div className="group relative block aspect-[16/9] overflow-hidden sm:aspect-auto sm:h-[300px]">
            <img src={b.src} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <h3 className="font-archivo text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">{b.label}</h3>
              <p className="mt-2 max-w-sm text-sm text-white/85">{b.sub}</p>
            </div>
          </div>
        )
        return b.to ? <Link key={b.label} to={b.to}>{inner}</Link> : <a key={b.label} href={b.href}>{inner}</a>
      })}
    </section>
  )
}

function Campana() {
  return (
    <section id="campana" className="scroll-mt-20 bg-[#faf8f3]">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="grid grid-cols-3 gap-2 overflow-hidden rounded-2xl">
            {[img('limpieza', 0), img('limpieza', 4), img('limpieza', 6), img('hogar', 0), img('hogar', 4), img('limpieza', 8)].map((s, i) => (
              <div key={i} className="aspect-square overflow-hidden bg-white"><img src={s} alt="" className="h-full w-full object-cover" /></div>
            ))}
          </div>
          <div>
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: RED }}>Campañas</span>
            <h2 className="mt-2 font-archivo text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Somos parte de tu vida</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[#6f6a63]">Renovamos nuestra imagen y nuestras etiquetas junto a vos. Desarrollamos productos de limpieza y hogar pensados para el día a día — presentes en cada rincón de tu casa.</p>
            <Link to="/limpieza" className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase text-white transition-transform hover:-translate-y-0.5" style={{ background: INK }}>Ver la campaña <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Usos() {
  const cards = [
    { icon: Home, title: 'Mi Casa', body: 'Sabemos lo importante que es tu casa para vos, por eso desarrollamos una completa línea de productos para que puedas disfrutarla al máximo.', rel: ['Secador de piso', 'Microfibra 1000 USOS', 'Trapo de piso reforzado gris'], to: '/limpieza' },
    { icon: Package, title: 'Mis Cosas', body: 'Te identifican. Son parte de tu vida diaria. Guardan historias y anécdotas. Todos tenemos objetos favoritos y nosotros te ayudamos a cuidarlos.', rel: ['Microfibra tecnológica', 'Franela', 'Microfibra vidrios'], to: '/limpieza/microfibras' },
    { icon: Car, title: 'Mi Auto', body: 'Desarrollamos productos para que puedas tener tu auto impecable, incluso en aquellos pequeños detalles que solo un fanático sabe ver.', rel: ['Rejilla lava coches', 'Microfibra lava autos', 'Microfibra lustradora'], to: '/limpieza' },
  ]
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, body, rel, to }) => (
          <div key={title} className="flex flex-col overflow-hidden rounded-2xl border border-[#eee9df] bg-white shadow-card">
            <div className="flex items-center justify-between px-6 pt-6">
              <h3 className="font-archivo text-2xl font-extrabold uppercase tracking-tight">{title}</h3>
              <span className="grid h-11 w-11 place-items-center rounded-full" style={{ background: YELLOW }}><Icon size={20} className="text-[#20201d]" /></span>
            </div>
            <p className="px-6 pt-3 text-[15px] leading-relaxed text-[#6f6a63]">{body}</p>
            <div className="mt-4 border-t border-[#eee9df] px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9a938b]">Productos relacionados</p>
              <ul className="mt-2 space-y-1">
                {rel.map((r) => <li key={r} className="text-sm text-[#3a352f]">– {r}</li>)}
              </ul>
              <Link to={to} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold uppercase" style={{ color: RED }}>Ver productos <ArrowRight size={15} /></Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Nosotros() {
  const year = new Date().getFullYear()
  return (
    <section id="nosotros" className="scroll-mt-20 border-t border-[#eee9df] bg-[#faf8f3]">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        {/* Nosotros */}
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl"><img src={img('limpieza', 1)} alt="Media Naranja" className="h-full w-full object-cover" /></div>
          <div>
            <h2 className="font-archivo text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Nosotros</h2>
            <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-[#5a554e]">
              <p>En 1975 nacimos para que vos puedas tener en tu hogar un aliado para ayudarte a hacer más fácil la tarea de la limpieza. Es así como desarrollamos productos de alta calidad para que puedas preocuparte de otras cosas y no de la limpieza.</p>
              <p>En poco tiempo llegamos a convertirnos en los líderes de la categoría, permitiéndonos conocerte de cerca. Día a día cambiamos junto a vos, renovando nuestra imagen y lanzando productos a la medida de tus necesidades.</p>
              <p>Hoy, después de más de 40 años en el mercado, estamos a la vanguardia de las últimas tendencias mundiales en limpieza.</p>
            </div>
          </div>
        </div>
        {/* Medio ambiente */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Panel icon={Recycle} title="Cuidamos el medio ambiente" body="Todos los trapos de piso tejidos que desarrollamos surgen a partir de la reutilización de retazos de nuestra planta textil. Aprovechamos al máximo nuestra producción, sin generar desperdicios innecesarios, ofreciendo un producto de calidad hecho de algodón." />
          <Panel icon={Leaf} title="Solo con agua" body="Contamos con la línea de microfibras que por su composición puede utilizarse para limpiar superficies sólo con agua, sin la necesidad de utilizar productos químicos nocivos para el medio ambiente." />
        </div>
        {/* Planta */}
        <div className="mt-14 rounded-2xl border border-[#eee9df] bg-white p-8 shadow-card">
          <div className="flex items-center gap-2"><Factory size={18} style={{ color: RED }} /><span className="text-sm font-bold uppercase tracking-widest text-[#9a938b]">Nuestra planta · Valle Viejo, Catamarca</span></div>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#5a554e]">La línea textil se fabrica en nuestra planta de más de 25.000 m² de superficie cubierta, con capacidad productiva de hasta 1.700.000 unidades de trapos de piso mensuales, funcionando 6 días a la semana las 24 horas.</p>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[['25.000', 'm² cubiertos'], ['1.7M', 'trapos / mes'], ['24hs', '6 días / sem'], [`+${year - 1975}`, 'años']].map(([n, l]) => (
              <div key={l}><div className="font-archivo text-3xl font-extrabold sm:text-4xl">{n}</div><div className="text-sm text-[#9a938b]">{l}</div></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Panel({ icon: Icon, title, body }) {
  return (
    <div className="rounded-2xl border border-[#eee9df] bg-white p-7 shadow-card">
      <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: YELLOW }}><Icon size={22} className="text-[#20201d]" /></span>
      <h3 className="mt-4 font-archivo text-xl font-extrabold uppercase tracking-tight">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[#6f6a63]">{body}</p>
    </div>
  )
}

function Contacto() {
  const [sent, setSent] = useState(false)
  const submit = (e) => { e.preventDefault(); setSent(true) }
  return (
    <section id="contacto" className="scroll-mt-20 border-t-4" style={{ borderColor: YELLOW }}>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="text-center font-archivo text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Contacto</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="font-archivo text-xl font-bold">En Media Naranja valoramos tu opinión</p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#6f6a63]">Por favor, envianos tu inquietud o comentario y te responderemos a la brevedad.</p>
            <p className="mt-6 text-sm text-[#6f6a63]">Atención al cliente · Ventas · Otras consultas.<br /><a href={`mailto:${SITE.email}`} className="font-medium text-[#20201d] underline underline-offset-2">{SITE.email}</a></p>
          </div>
          {sent ? (
            <div className="grid place-items-center rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
              <Check className="text-green-700" size={32} />
              <p className="mt-3 font-semibold text-green-800">¡Gracias! Recibimos tu consulta.</p>
              <p className="text-sm text-green-700">Te vamos a responder a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input required placeholder="Nombre…" autoComplete="name" className="v4-input" />
              <input required type="email" placeholder="E-mail…" autoComplete="email" className="v4-input" />
              <input placeholder="Teléfono…" inputMode="tel" autoComplete="tel" className="v4-input" />
              <input placeholder="Localidad…" className="v4-input" />
              <select className="v4-input" defaultValue=""><option value="" disabled>Tipo de consulta</option><option>Ventas</option><option>Atención al cliente</option><option>Mayoristas</option><option>Otra</option></select>
              <select className="v4-input" defaultValue=""><option value="" disabled>¿Cómo nos conociste?</option><option>Redes sociales</option><option>Buscador</option><option>Recomendación</option><option>Otro</option></select>
              <textarea rows={4} placeholder="Comentario…" className="v4-input resize-none sm:col-span-2" />
              <button type="submit" className="w-fit rounded-md px-8 py-3 font-bold uppercase text-white transition-transform hover:-translate-y-0.5 sm:col-span-2" style={{ background: RED }}>Enviar</button>
            </form>
          )}
        </div>
      </div>
      <style>{`.v4-input{width:100%;border:1.5px solid #e2ddd3;border-radius:8px;padding:12px 14px;font-size:15px;min-height:48px;background:#fbfaf7;color:#20201d}.v4-input:focus{outline:none;border-color:#20201d}`}</style>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[#eee9df] bg-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 text-center text-sm text-[#6f6a63] sm:px-8">
        Media Naranja · Fibran Sur S.A. · Argentina · © {new Date().getFullYear()}
      </div>
    </footer>
  )
}
