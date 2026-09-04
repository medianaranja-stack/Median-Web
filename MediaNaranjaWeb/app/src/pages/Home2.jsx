// COPIA DEL HOME PARA PROBAR UN ESTILO NUEVO.
//
// Es un duplicado a proposito: permite rehacer el diseño sin tocar la pagina
// que esta en produccion, y compararlas lado a lado. Cuando se decida, o esto
// reemplaza a Landing.jsx o se borra entero junto con su ruta y su boton.
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Package, Mail, ArrowRight, Download, Facebook, Instagram, Factory, Check, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { getPublicBanners, bannersSembrados, RESPALDO } from '../lib/banners.js'
import { getCatalog, catalogoSembrado } from '../lib/products.js'
import { urlServida, srcSetDe } from '../lib/urls.js'
import { medirSecciones } from '../lib/analytics.js'
import { SITE } from '../lib/site.js'
import Logo from '../components/Logo.jsx'
import SafeImg from '../components/SafeImg.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CargandoProductos from '../components/CargandoProductos.jsx'
import ProductModal from '../components/ProductModal.jsx'

const YELLOW = '#FFD400', RED = '#E30613', INK = '#1c1a17'

// Alto del banner, en proporciones fijas por breakpoint. Antes era 52vh, que en
// un iPhone daba un recorte casi cuadrado y en un monitor 2K uno larguísimo: una
// misma foto no podía quedar bien en los dos.
// Es una franja apaisada a propósito: ocupa menos pantalla, deja los accesos y
// los productos más arriba, y hay menos superficie esperando a que cargue.
// El costo es recorte vertical — de una foto 2,4:1 se ve el 80% del alto en
// notebook. Para eso está el punto de encuadre en el panel.
// El aspect-ratio además reserva el alto antes de que cargue la foto (sin CLS).

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

export default function Home2() {
  const [selected, setSelected] = useState(null)
  // Se monta después del primer render para que las secciones ya existan.
  useEffect(() => medirSecciones(ZONAS), [])

  // El navbar de esta version es fijo, asi que al tabular el navegador puede
  // dejar el elemento enfocado justo debajo y taparlo. scroll-padding-top le
  // reserva ese alto al hacer scroll, tanto por foco como por ancla.
  //
  // Se pone y se saca al montar porque es propio de esta pagina: el home real
  // tiene una barra mas baja y no necesita este margen.
  useEffect(() => {
    const raiz = document.documentElement
    const previo = raiz.style.scrollPaddingTop
    raiz.style.scrollPaddingTop = '7rem'
    return () => { raiz.style.scrollPaddingTop = previo }
  }, [])
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


/* ─────────────────────────────────────────────────────────────────────────────
   Lenguaje visual de esta prueba, adaptado de mortimer.com.ar a la marca.
   Tres piezas: campo rojo con textura, corte diagonal, y titulos en italica.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Textura del hero. Un rojo plano y liso se lee barato en pantallas grandes;
 * la grilla fina y la luz central le dan profundidad sin competir con el texto.
 * La mascara la desvanece en los bordes para que no parezca un papel cuadriculado.
 */
function TexturaHero() {
  const desvanecer = 'radial-gradient(ellipse 85% 65% at 50% 35%, #000 35%, transparent 100%)'
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.55) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,.55) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          WebkitMaskImage: desvanecer,
          maskImage: desvanecer,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(255,255,255,.18), transparent 70%)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,.22), transparent)' }}
      />
    </div>
  )
}

/** Corte diagonal que cierra el hero contra la seccion siguiente. */
function CorteDiagonal() {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0 z-20 leading-[0]">
      <svg viewBox="0 0 1440 110" preserveAspectRatio="none" className="block h-[52px] w-full sm:h-[80px] lg:h-[100px]">
        <path d="M0,110 L1440,18 L1440,110 Z" fill="var(--bg)" />
      </svg>
    </div>
  )
}

/**
 * Titulo de seccion: rojo, italica pesada, centrado. Es el gesto que mas se
 * repite en la referencia y el que le da unidad a toda la pagina.
 */
function TituloSeccion({ children, sub, antetitulo }) {
  return (
    <div className="text-center">
      {antetitulo && (
        <p className="mono-label mb-2" style={{ color: 'var(--muted)' }}>{antetitulo}</p>
      )}
      <h2 className="font-archivo text-3xl font-black italic leading-none tracking-tight sm:text-4xl lg:text-[2.75rem]" style={{ color: RED }}>
        {children}
      </h2>
      {sub && <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">{sub}</p>}
    </div>
  )
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
    // Flotante sobre el hero, no pegado arriba: es el gesto que define la
    // referencia. Va fijo para que la navegacion siga a mano al scrollear —
    // un navbar que se va obliga a volver arriba para cambiar de seccion.
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className="mx-auto flex w-full max-w-6xl items-center gap-2 rounded-full px-2.5 py-2 shadow-xl sm:gap-5 sm:px-4 sm:py-2.5"
        style={{ background: RED }}
      >
        {/* Placa blanca detras del logo: el logo oficial es rojo y sobre rojo
            desapareceria. Recolorearlo no es opcion — es la marca. */}
        <a
          href="#top"
          aria-label="Media Naranja Limpieza — ir al inicio"
          className="shrink-0 rounded-full bg-white px-3.5 py-1.5 transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4"
        >
          {/* El logo es corazon + wordmark en una marca casi cuadrada: por debajo
              de ~40px de alto el wordmark deja de leerse. */}
          <Logo className="!h-9 w-auto sm:!h-11" />
        </a>

        {/* Escritorio */}
        <nav aria-label="Secciones" className="hidden flex-1 md:block">
          <ul className="flex items-center gap-1">
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={activa === id ? 'true' : undefined}
                  className="relative inline-flex h-9 items-center rounded-full px-3.5 text-sm font-bold text-white/80 transition-colors duration-200 hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-[current]:text-white"
                >
                  {label}
                  <span
                    aria-hidden
                    className="absolute inset-x-3.5 bottom-1 h-0.5 origin-left rounded-full transition-transform duration-200"
                    style={{ background: YELLOW, transform: `scaleX(${activa === id ? 1 : 0})` }}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="hidden h-10 w-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:grid"><Facebook size={17} /></a>
          <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="hidden h-10 w-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:grid"><Instagram size={17} /></a>

          {/* Boton amarillo. En la referencia dice "Donde comprar"; aca no puede
              serlo: los enlaces a tienda se dieron de baja a pedido del cliente.
              El equivalente util es el contacto (mayoristas y consultas). */}
          <a
            href="#contacto"
            className="ml-1 hidden items-center rounded-full px-5 py-2.5 font-archivo text-sm font-extrabold italic transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
            style={{ background: YELLOW, color: INK }}
          >
            Contacto
          </a>

          {/* Movil */}
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            className="grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:hidden"
          >
            {abierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Panel movil */}
      <div
        id="menu-movil"
        hidden={!abierto}
        className="mx-auto mt-2 w-full max-w-6xl overflow-hidden rounded-3xl shadow-xl md:hidden"
        style={{ background: RED }}
      >
        <nav aria-label="Secciones" className="px-5 py-2">
          <ul>
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={cerrar}
                  aria-current={activa === id ? 'true' : undefined}
                  className="flex min-h-[52px] items-center justify-between border-b border-white/15 font-archivo text-base font-extrabold italic text-white/85 transition-colors last:border-0 hover:text-white aria-[current]:text-white"
                >
                  {label}
                  <ArrowRight size={17} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 py-3">
            <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"><Facebook size={18} /></a>
            <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"><Instagram size={18} /></a>
            <a href="#contacto" onClick={cerrar} className="ml-auto rounded-full px-5 py-2.5 font-archivo text-sm font-extrabold italic" style={{ background: YELLOW, color: INK }}>Contacto</a>
          </div>
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
  // Sembrado desde el HTML: el prerender ya dejo escritos los banners, asi que
  // el primer render sale con la portada puesta y el navegador empieza a bajar
  // la foto mientras parsea, sin esperar a que React arranque.
  const [slides, setSlides] = useState(bannersSembrados)
  const [idx, setIdx] = useState(0)
  // Primera foto que termino de bajar, e indices que fallaron. Con eso el
  // carrusel sabe que mostrar aunque la portada no cargue.
  const [cargada, setCargada] = useState(null)
  const [listas, setListas] = useState([])
  const [fallidas, setFallidas] = useState([])
  // Un carrusel que avanza solo cada 5 s tiene que poder detenerse (WCAG 2.2.2).
  // `detenido` lo corta para siempre en cuanto el visitante toca una flecha o un
  // punto: si esta eligiendo que mirar, que se le mueva solo es una molestia.
  // `pausado` lo suspende mientras el puntero esta encima o hay foco adentro.
  const [detenido, setDetenido] = useState(false)
  const [pausado, setPausado] = useState(false)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lista = cargada !== null
  const todasFallaron = slides.length > 0 && fallidas.length >= slides.length

  useEffect(() => {
    let vivo = true
    // Revalidacion: el HTML se genero al desplegar, asi que si el admin cambio
    // un banner despues, esta consulta lo corrige sin necesidad de reconstruir.
    // Si falla, se conserva lo sembrado; solo se cae al respaldo si no hay nada.
    getPublicBanners()
      .then((bs) => {
        if (!vivo) return
        setSlides((s) => (bs?.length ? bs : s.length ? s : RESPALDO))
      })
      // Sin este catch, un error deja slides vacio y el loader gira para siempre.
      .catch(() => vivo && setSlides((s) => (s.length ? s : RESPALDO)))
    return () => { vivo = false }
  }, [])

  // El carrusel solo pasa a una foto QUE YA BAJO. Antes avanzaba a ciegas cada
  // 5 s: si la siguiente no habia terminado, el banner quedaba en blanco. Ahora,
  // si la proxima todavia no esta, se queda en la actual y reintenta al rato.
  useEffect(() => {
    if (reduce || detenido || pausado || !lista || slides.length < 2) return
    const t = setInterval(() => {
      setIdx((i) => {
        for (let salto = 1; salto <= slides.length; salto++) {
          const cand = (i + salto) % slides.length
          if (listas.includes(cand)) return cand
        }
        return i // ninguna otra lista todavia: quedarse donde esta
      })
    }, 5000)
    return () => clearInterval(t)
  }, [reduce, detenido, pausado, lista, slides.length, listas])

  // Que foto se muestra. Mientras no cargo ninguna se apunta a la primera que
  // todavia no fallo: si la portada no llega, se pasa sola a la siguiente en
  // vez de dejar al visitante mirando el loader.
  const primeraViable = slides.findIndex((_, i) => !fallidas.includes(i))
  const visible = lista ? idx : Math.max(0, primeraViable)

  const s = slides[visible]

  return (
    <section
      id="top"
      aria-label="Destacados"
      aria-roledescription="carrusel"
      className="relative isolate overflow-hidden"
      style={{ background: RED }}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      <TexturaHero />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-9 px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-20 lg:pt-36">
        {/* ---- Texto ---- */}
        <div className="relative">
          {/* Amarillo sobre rojo da 3,41:1: alcanza para texto grande, no para
              cuerpo. Por eso el antetitulo es grande y en negrita, nunca chico. */}
          <p className="font-archivo text-xl font-extrabold italic leading-none sm:text-2xl" style={{ color: YELLOW }}>
            Desde 1975
          </p>
          <h2 className="mt-2 font-archivo text-[2.75rem] font-black italic leading-[0.9] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {s?.titulo || 'Limpieza que rinde'}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            Fabricamos trapos, microfibras y accesorios de limpieza en Valle Viejo, Catamarca.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/limpieza"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-archivo text-sm font-extrabold italic transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
              style={{ background: YELLOW, color: INK }}
            >
              Ver productos <ArrowRight size={17} aria-hidden />
            </Link>
            <a
              href="#historia"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/45 px-6 py-3 font-archivo text-sm font-extrabold italic text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
            >
              Conocenos
            </a>
          </div>
        </div>

        {/* ---- Foto ----
            La referencia usa un recorte de producto sobre el fondo. Aca las
            fotos son apaisadas y vienen de la base, asi que van en un panel
            redondeado con halo: mantiene la composicion a dos columnas sin
            pedirle a las fotos algo que no son. */}
        <div className="relative">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] shadow-2xl ring-1 ring-white/30 sm:aspect-[16/10] lg:aspect-[4/3]"
            style={{ boxShadow: '0 30px 70px -20px rgba(0,0,0,.55)' }}
          >
            {/* Vista previa borrosa mientras baja la foto real. */}
            {!lista && !todasFallaron && s?.blur && (
              <img
                src={s.blur}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: s.foco || '50% 50%', filter: 'blur(24px)', transform: 'scale(1.06)' }}
              />
            )}

            {/* Sin miniatura (banners de respaldo): late el logo. */}
            {!lista && !todasFallaron && !s?.blur && (
              <div className="absolute inset-0 grid place-items-center bg-black/20" role="status" aria-label="Cargando">
                <img src="/logo-clean.png" alt="" width={300} height={252} className="mn-latido h-14 w-auto" />
              </div>
            )}

            <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: lista ? 1 : 0 }}>
              {slides.map((b, i) => (
                <div
                  key={b.id}
                  className="absolute inset-0 transition-opacity duration-[900ms] ease-out"
                  style={{ opacity: i === visible ? 1 : 0 }}
                  aria-hidden={i !== visible}
                >
                  {/* Solo se pide la que se ve; la siguiente recien cuando la
                      primera ya esta, para que no compitan por el ancho de banda. */}
                  {(i === visible || (lista && i === (visible + 1) % slides.length)) && (
                    <SafeImg
                      src={urlServida(b.url)}
                      srcSet={srcSetDe(b.url, b.anchos) || undefined}
                      sizes="(max-width: 1024px) 100vw, 620px"
                      alt={b.titulo || ''}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: b.foco || '50% 50%' }}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      fetchpriority={i === 0 ? 'high' : undefined}
                      onLoad={() => {
                        setCargada((c) => (c === null ? i : c))
                        setListas((l) => (l.includes(i) ? l : [...l, i]))
                      }}
                      onError={() => setFallidas((f) => (f.includes(i) ? f : [...f, i]))}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Flechas, como en la referencia. Ocultas si hay una sola foto. */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => { setDetenido(true); setIdx((i) => (i - 1 + slides.length) % slides.length) }}
                aria-label="Imagen anterior"
                className="absolute -left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white lg:-left-5"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => { setDetenido(true); setIdx((i) => (i + 1) % slides.length) }}
                aria-label="Imagen siguiente"
                className="absolute -right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white lg:-right-5"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Puntos */}
      {slides.length > 1 && (
        <div className="relative z-30 mx-auto flex w-full max-w-6xl justify-center gap-2 px-5 pb-16 sm:px-8 sm:pb-20">
          {slides.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => { setDetenido(true); setIdx(i) }}
              aria-label={`Ver imagen ${i + 1} de ${slides.length}`}
              aria-current={i === visible ? 'true' : undefined}
              // El punto se ve chico pero el area que responde al dedo mide
              // 44x44: es el minimo para no errarle en un telefono.
              className="grid h-11 w-11 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <span
                // Se anima transform y color, nunca width: animar el ancho
                // obliga al navegador a recalcular la disposicion en cada cuadro.
                className="block h-2 w-2 rounded-full transition-[transform,background-color] duration-300"
                style={{
                  transform: i === visible ? 'scaleX(3.25)' : 'scaleX(1)',
                  background: i === visible ? YELLOW : 'rgba(255,255,255,.5)',
                }}
              />
            </button>
          ))}
        </div>
      )}

      <CorteDiagonal />
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
  // Lo que el prerender dejo en el HTML: alcanza para dibujar las tarjetas en
  // el primer frame, asi que si hay semilla no se muestra el estado de carga.
  const semilla = useMemo(() => catalogoSembrado('limpieza').productos, [])
  const [all, setAll] = useState(semilla)
  const [cargando, setCargando] = useState(semilla.length === 0)
  const [error, setError] = useState(null)

  useEffect(() => {
    let vivo = true
    // Siempre se consulta la base, aunque haya semilla: la del HTML viene
    // recortada (sin descripcion ni specs) y ademas puede haber quedado vieja
    // si el admin cargo productos despues del ultimo despliegue.
    getCatalog('limpieza')
      .then((d) => {
        if (!vivo) return
        setAll(d.productos)
        setCargando(false)
      })
      .catch((e) => {
        if (!vivo) return
        // Con semilla en pantalla, un fallo de red no es un error visible.
        if (!semilla.length) setError(e.message)
        setCargando(false)
      })
    return () => { vivo = false }
  }, [semilla])

  const featured = all.slice(0, 12)
  return (
    <section id="productos" className="scroll-mt-28 border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
        <TituloSeccion sub="Tocá un producto para ver la ficha y descargar las fotos.">
          Nuestros productos
        </TituloSeccion>
        <div className="mt-6 flex justify-center">
          <Link
            to="/limpieza"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-archivo text-sm font-extrabold italic text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: RED, outlineColor: RED }}
          >
            Ver todos{all.length ? ` (${all.length})` : ''} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="mt-6">
          {cargando ? (
            <CargandoProductos cantidad={8} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p, i) => (
                <ProductCard key={p.id} producto={p} index={i} onOpen={onOpen} />
              ))}
            </div>
          )}
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
    <section id="historia" className="scroll-mt-28 border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8">
        <TituloSeccion antetitulo="● Desde 1975">Sobre nosotros</TituloSeccion>

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
                fetchpriority="low"
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
                fetchpriority="low"
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
                fetchpriority="low"
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
    <section id="contacto" className="scroll-mt-28 border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-xl px-5 py-12 text-center sm:px-8">
        <TituloSeccion sub="¿Consultas o pedidos mayoristas? Escribinos.">Contacto</TituloSeccion>
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
    <footer style={{ background: RED }}>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 text-center sm:px-8">
        <p className="font-archivo text-2xl font-black italic leading-none" style={{ color: YELLOW }}>
          Media Naranja
        </p>
        <p className="mt-3 text-sm text-white/80">
          Fibran Sur S.A. · Valle Viejo, Catamarca · Argentina · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
