import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Package, Mail, ArrowRight, Download, Facebook, Instagram, Factory, Check, Menu, X } from 'lucide-react'
import { getPublicBanners } from '../lib/banners.js'
import { getCatalog } from '../lib/products.js'
import { medirSecciones } from '../lib/analytics.js'
import { SITE } from '../lib/site.js'
import Logo from '../components/Logo.jsx'
import SafeImg from '../components/SafeImg.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductModal from '../components/ProductModal.jsx'

const YELLOW = '#FFD400', RED = '#E30613', INK = '#1c1a17'

// Alto del banner. Antes era 52vh, que en un iPhone daba un recorte casi
// cuadrado (0,89:1) y en un monitor 2K uno larguísimo (4,13:1): una misma foto
// no podía quedar bien en los dos. Con proporciones fijas por breakpoint el
// rango se achica mucho, así que una sola imagen sirve para todos.
// El aspect-ratio además reserva el alto antes de que cargue la foto (sin CLS).
const BANNER_ALTO = 'aspect-[4/3] sm:aspect-[16/9] lg:aspect-[12/5] max-h-[660px]'

// Secciones del navbar. El id tiene que existir como <section id="…"> abajo.
const NAV = [
  { id: 'productos', label: 'Productos' },
  { id: 'historia', label: 'Nosotros' },
  { id: 'contacto', label: 'Contacto' },
]

const MODULES = [
  { icon: BookOpen, title: 'Nosotros', desc: 'Fabricamos en Catamarca desde 1975.', href: '#historia' },
  { icon: Package, title: 'Productos', desc: 'Trapos, microfibras, rejillas y más.', href: '#productos' },
  { icon: Mail, title: 'Contacto', desc: 'Consultas, mayoristas y ventas.', href: '#contacto' },
]

// Zonas cuyo uso se mide. El id tiene que coincidir con el <section id="…">.
const ZONAS = [
  { id: 'top' }, { id: 'modulos' }, { id: 'productos' }, { id: 'historia' }, { id: 'contacto' },
]

export default function Landing() {
  const [selected, setSelected] = useState(null)
  // Se monta después del primer render para que las secciones ya existan.
  useEffect(() => medirSecciones(ZONAS), [])
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
      <style>{PAGE_CSS}</style>
    </main>
  )
}

const PAGE_CSS = `
@keyframes v5drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(6vw,4vw)}}
@keyframes v5drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-5vw,-3vw)}}
@keyframes v5drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(3vw,-5vw)}}
.v5-glow{animation:v5drift1 20s ease-in-out infinite}
.v5-glow2{animation:v5drift2 26s ease-in-out infinite}
.v5-glow3{animation:v5drift3 32s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){.v5-glow,.v5-glow2,.v5-glow3{animation:none}}

/* Loader del banner: el logo late mientras llega la primera imagen. */
@keyframes mn-latido{
  0%,100%{transform:scale(.92);opacity:.55}
  50%{transform:scale(1.06);opacity:1}
}
.mn-latido{animation:mn-latido 1.4s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){.mn-latido{animation:none;opacity:.75}}

/* Banner sin recuadro: la imagen se desvanece contra el fondo en los cuatro
   bordes, así no se lee como una caja recortada sino como algo continuo. */
.mn-banner-mask{
  -webkit-mask-image:
    linear-gradient(to right, transparent 0, #000 9%, #000 91%, transparent 100%),
    linear-gradient(to bottom, transparent 0, #000 12%, #000 78%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(to right, transparent 0, #000 9%, #000 91%, transparent 100%),
    linear-gradient(to bottom, transparent 0, #000 12%, #000 78%, transparent 100%);
  mask-composite: intersect;
}
@media (max-width: 640px){
  .mn-banner-mask{
    -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 10%, #000 80%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0, #000 10%, #000 80%, transparent 100%);
  }
}
`

// Marca cuál de las secciones se está viendo, para resaltarla en el navbar.
function useSeccionActiva() {
  const [activa, setActiva] = useState(null)
  useEffect(() => {
    const nodos = NAV.map((n) => document.getElementById(n.id)).filter(Boolean)
    if (!nodos.length) return
    const obs = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiva(visible.target.id)
      },
      // El header tapa 56px: descontarlos evita que marque la sección de arriba.
      { rootMargin: '-56px 0px -55% 0px', threshold: [0.1, 0.5] },
    )
    nodos.forEach((n) => obs.observe(n))
    return () => obs.disconnect()
  }, [])
  return activa
}

function Header() {
  const [abierto, setAbierto] = useState(false)
  const activa = useSeccionActiva()
  const burgerRef = useRef(null)

  const cerrar = useCallback(() => {
    setAbierto(false)
    burgerRef.current?.focus()
  }, [])

  // Con el panel abierto: Escape lo cierra y el fondo no scrollea.
  useEffect(() => {
    if (!abierto) return
    const onKey = (e) => e.key === 'Escape' && cerrar()
    document.addEventListener('keydown', onKey)
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previo
    }
  }, [abierto, cerrar])

  return (
    <header className="sticky top-0 z-40 border-b border-black/5" style={{ background: YELLOW }}>
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-5 sm:px-8">
        <a href="#top" aria-label="Media Naranja Limpieza — ir al inicio" className="shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1c1a17]">
          <Logo />
        </a>

        {/* Escritorio */}
        <nav aria-label="Secciones" className="hidden flex-1 md:block">
          <ul className="flex items-center gap-1">
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={activa === id ? 'true' : undefined}
                  className="relative inline-flex h-9 items-center rounded-full px-3.5 text-sm font-semibold text-[#5c4a00] transition-colors duration-200 hover:bg-black/[0.06] hover:text-[#1c1a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1a17] aria-[current]:text-[#1c1a17]"
                >
                  {label}
                  <span
                    aria-hidden
                    className="absolute inset-x-3.5 -bottom-px h-0.5 origin-left rounded-full transition-transform duration-200"
                    style={{ background: RED, transform: `scaleX(${activa === id ? 1 : 0})` }}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full text-[#5c4a00] transition-colors hover:bg-black/[0.06] hover:text-[#1c1a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1c1a17]"><Facebook size={18} /></a>
          <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full text-[#5c4a00] transition-colors hover:bg-black/[0.06] hover:text-[#1c1a17] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1c1a17]"><Instagram size={18} /></a>

          {/* Móvil */}
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            className="grid h-11 w-11 place-items-center rounded-full text-[#1c1a17] transition-colors hover:bg-black/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1c1a17] md:hidden"
          >
            {abierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Panel móvil */}
      <div
        id="menu-movil"
        hidden={!abierto}
        className="border-t border-black/10 md:hidden"
        style={{ background: YELLOW }}
      >
        <nav aria-label="Secciones" className="mx-auto w-full max-w-5xl px-5 pb-3 pt-1 sm:px-8">
          <ul>
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={cerrar}
                  aria-current={activa === id ? 'true' : undefined}
                  className="flex min-h-[48px] items-center justify-between border-b border-black/[0.07] text-base font-semibold text-[#5c4a00] transition-colors last:border-0 hover:text-[#1c1a17] aria-[current]:text-[#1c1a17]"
                >
                  {label}
                  <ArrowRight size={17} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </nav>
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
  const [slides, setSlides] = useState([])
  const [idx, setIdx] = useState(0)
  // La primera imagen decide cuándo se va el loader. Tener la URL no alcanza:
  // recién cuando termina de bajar hay algo que mostrar.
  const [lista, setLista] = useState(false)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    let vivo = true
    getPublicBanners().then((bs) => vivo && setSlides(bs))
    return () => { vivo = false }
  }, [])

  useEffect(() => {
    if (reduce || slides.length < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [reduce, slides.length])

  return (
    <section id="top" aria-label="Destacados" aria-roledescription="carrusel" className={`relative z-10 w-full ${BANNER_ALTO}`}>
      {/* Mientras baja la primera foto, el logo late en su lugar. Sin esto el
          banner es un rectángulo vacío y la página parece colgada. */}
      {!lista && (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{ background: 'var(--bg)' }}
          role="status"
          aria-label="Cargando"
        >
          <img
            src="/logo-clean.png"
            alt=""
            width={300}
            height={252}
            className="mn-latido h-16 w-auto sm:h-20"
          />
        </div>
      )}

      <div
        className="mn-banner-mask absolute inset-0 transition-opacity duration-500"
        style={{ opacity: lista ? 1 : 0 }}
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-[900ms] ease-out"
            style={{ opacity: i === idx ? 1 : 0 }}
            aria-hidden={i !== idx}
          >
            {/* Sólo se pide la actual y la siguiente. Antes se renderizaban las
                cuatro <img> juntas: como están todas dentro del mismo contenedor
                absoluto, el navegador las considera visibles y loading="lazy" no
                las difiere — bajaba las cuatro en paralelo y la primera tardaba
                el triple por competir con las otras tres por el ancho de banda. */}
            {(i === idx || i === (idx + 1) % slides.length) && (
            <SafeImg
              src={s.url}
              alt={s.titulo || ''}
              className="h-full w-full object-cover"
              style={{ objectPosition: s.foco || '50% 50%' }}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
              onLoad={i === 0 ? () => setLista(true) : undefined}
              onError={i === 0 ? () => setLista(true) : undefined}
            />
            )}
          </div>
        ))}
      </div>

      {/* El título va fuera de la máscara: si no, se desvanece con la imagen. */}
      {slides[idx]?.titulo && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 to-transparent pb-14 pt-20">
          <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
            <h2 className="max-w-2xl font-archivo text-2xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm sm:text-4xl">
              {slides[idx].titulo}
            </h2>
          </div>
        </div>
      )}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-10 mx-auto flex w-full max-w-5xl justify-center gap-2 px-5 sm:px-8">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Ver imagen ${i + 1} de ${slides.length}`}
              aria-current={i === idx ? 'true' : undefined}
              className="grid h-11 w-6 place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1a17]"
            >
              <span
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? 22 : 8,
                  background: i === idx ? INK : 'rgba(28,26,23,.3)',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function Modules() {
  return (
    <section id="modulos" className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-8 pt-6 sm:px-8">
      {/* min-w-0: las columnas 1fr no bajan del ancho mínimo de su contenido,
          así el grid nunca puede desbordar en pantallas angostas. */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {MODULES.map(({ icon: Icon, title, desc, href }) => (
          <a key={title} href={href} className="group flex min-w-0 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-6">
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
  // Sale de la base, no de un archivo del repo: lo que el cliente carga o edita
  // en el panel tiene que verse acá sin volver a desplegar.
  const [all, setAll] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let vivo = true
    getCatalog('limpieza')
      .then((d) => vivo && setAll(d.productos))
      .catch((e) => vivo && setError(e.message))
      .finally(() => vivo && setCargando(false))
    return () => { vivo = false }
  }, [])

  const featured = all.slice(0, 12)
  return (
    <section id="productos" className="scroll-mt-16 border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-archivo text-2xl font-extrabold sm:text-3xl">Nuestros productos</h2>
            <p className="mt-1 text-[15px] text-[var(--muted)]">Tocá un producto para ver la ficha y descargar las fotos.</p>
          </div>
          <Link to="/limpieza" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: INK }}>
            Ver todos{all.length ? ` (${all.length})` : ''} <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cargando
            ? Array.from({ length: 8 }, (_, i) => (
                // Reserva el lugar mientras carga, para que no salte el layout.
                <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-black/[0.06]" />
              ))
            : featured.map((p, i) => <ProductCard key={p.id} producto={p} index={i} onOpen={onOpen} />)}
        </div>
        {!cargando && !all.length && (
          <p className="mt-6 text-[15px] text-[var(--muted)]">
            {error ? 'No pudimos cargar los productos en este momento.' : 'Todavía no hay productos publicados.'}
          </p>
        )}
      </div>
    </section>
  )
}

/* Contenido tomado del sitio original medianaranja.com.ar/nosotros.
   Dos ajustes sobre el texto de origen, marcados a propósito:
   · decía "más de 40 años"; en 2025 la marca cumplió 50, así que se actualizó.
   · el tercer párrafo terminaba cortado ("…con el respaldo") también en el sitio
     viejo. Se corta la frase incompleta en vez de inventarle un final. */
const HITOS = [
  { anio: '2013', src: '/fabrica/hist-2013.jpg' },
  { anio: '2015', src: '/fabrica/hist-2015.jpg' },
  { anio: '2017', src: '/fabrica/hist-2017.jpg' },
]

const DATOS_PLANTA = [
  { valor: '25.000', unidad: 'm² cubiertos' },
  { valor: '1.700.000', unidad: 'trapos de piso por mes' },
  { valor: '6 × 24', unidad: 'días por semana, las 24 h' },
]

function Historia() {
  return (
    <section id="historia" className="scroll-mt-16 border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8">
        <p className="mono-label" style={{ color: RED }}>● Desde 1975</p>
        <h2 className="mt-2 font-archivo text-2xl font-extrabold sm:text-3xl">Nosotros</h2>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--ink)] sm:text-xl">
          En 1975 nacimos para que vos puedas tener en tu hogar un aliado para ayudarte a hacer
          más fácil la tarea de la limpieza. Es así como desarrollamos productos de alta calidad
          para que puedas preocuparte de otras cosas y no de la limpieza.
        </p>

        <div className="mt-6 grid gap-x-10 gap-y-4 text-[15px] leading-relaxed text-[var(--muted)] md:grid-cols-2">
          <p>
            En poco tiempo llegamos a convertirnos en los líderes de la categoría, permitiéndonos
            conocerte de cerca. Día a día cambiamos junto a vos, renovando nuestra imagen,
            modificando nuestras etiquetas y lanzando productos a la medida de tus necesidades.
          </p>
          <p>
            Hoy, después de 50 años en el mercado, estamos a la vanguardia de las últimas
            tendencias mundiales en limpieza. Porque vos evolucionás, nosotros evolucionamos
            con vos.
          </p>
        </div>

        {/* Evolución de la marca */}
        <ul className="mt-10 grid gap-3 sm:grid-cols-3">
          {HITOS.map(({ anio, src }) => (
            <li key={anio} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-card">
              <SafeImg
                src={src}
                alt={`Imagen de campaña de Media Naranja en ${anio}`}
                loading="lazy"
                width={823}
                height={326}
                className="aspect-[823/326] w-full object-cover"
              />
              <p className="mono-label px-4 py-3 text-[var(--muted)]">{anio}</p>
            </li>
          ))}
        </ul>

        {/* Medio ambiente */}
        <div className="mt-12 grid items-start gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-card sm:p-8 md:grid-cols-[220px_1fr]">
          <SafeImg
            src="/fabrica/medioambiente.jpg"
            alt="Trapo de piso tejido con retazos de algodón reutilizados"
            loading="lazy"
            width={300}
            height={300}
            className="aspect-square w-full max-w-[220px] rounded-xl object-cover"
          />
          <div>
            <h3 className="font-archivo text-xl font-extrabold sm:text-2xl">Cuidamos el medio ambiente</h3>
            <div className="mt-3 grid gap-x-8 gap-y-3 text-[15px] leading-relaxed text-[var(--muted)] lg:grid-cols-2">
              <p>
                Todos los trapos de piso tejidos que desarrollamos surgen a partir de la
                reutilización de retazos de nuestra planta textil. De esta forma aprovechamos al
                máximo nuestra producción, sin generar desperdicios innecesarios y ofrecemos al
                mercado un producto de calidad hecho de algodón.
              </p>
              <p>
                Por otro lado, contamos con la línea de microfibras que por su composición puede
                utilizarse para limpiar superficies sólo con agua, sin la necesidad de utilizar
                productos químicos nocivos para el medio ambiente.
              </p>
            </div>
          </div>
        </div>

        {/* Planta */}
        <div className="mt-12">
          <h3 className="font-archivo text-xl font-extrabold sm:text-2xl">Nuestra planta</h3>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--muted)]">
            La línea textil se fabrica en nuestra planta ubicada en Valle Viejo, Catamarca, con más
            de 25.000 m² de superficie cubierta y capacidad productiva de hasta 1.700.000 unidades
            de trapos de piso mensuales, funcionando 6 días a la semana las 24 hs.
          </p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {DATOS_PLANTA.map(({ valor, unidad }) => (
              <div key={unidad} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-card">
                <dt className="sr-only">{unidad}</dt>
                <dd>
                  <span className="block font-archivo text-2xl font-extrabold tabular-nums sm:text-3xl">{valor}</span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">{unidad}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl">
              <SafeImg
                src="/fabrica/planta-a.jpg"
                alt="Vista aérea de la planta de Media Naranja en Valle Viejo, Catamarca"
                loading="lazy"
                width={425}
                height={255}
                className="aspect-[5/3] w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <SafeImg
                src="/fabrica/planta-b.jpg"
                alt="Producción de trapos de piso en la planta textil"
                loading="lazy"
                width={319}
                height={255}
                className="aspect-[5/3] w-full object-cover"
              />
            </div>
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
