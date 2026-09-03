// Genera el HTML de las paginas publicas al construir.
//
// Corre despues de los dos builds de Vite: el del navegador (dist/) y el del
// servidor (dist-ssr/). Consulta la base una sola vez, dibuja cada ruta con esos
// datos y guarda un .html por ruta. Netlify sirve archivos estaticos antes que
// cualquier redireccion, asi que una visita a / recibe el documento ya dibujado
// sin ejecutar nada: cero costo por visita, que era la condicion.
//
// Si la base no responde igual construye: las paginas salen con el estado de
// carga, exactamente como funcionaba antes. Un build no puede depender de que
// Supabase este despierto.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'

const RAIZ = join(dirname(new URL(import.meta.url).pathname), '..')
const DIST = join(RAIZ, 'dist')

// Cuantas tarjetas se dibujan en el HTML. Son las que se ven sin desplazar; el
// resto llega con la consulta que el navegador hace igual al hidratar. Meter las
// 60 solo engordaria el documento y retrasaria el primer pintado.
const TARJETAS = 12
const CAMPOS = 'id,nombre,slug,categoria,categoria_label,imagenes,anchos,linea,orden'
const ID_DATOS = 'datos-iniciales'

// --- variables de entorno -------------------------------------------------
// En Netlify vienen del entorno; en local, del .env que Vite lee solo.
function cargarEnv() {
  // Mismo orden de prioridad que usa Vite: .env.local pisa a .env.
  for (const nombre of ['.env.local', '.env']) {
    const f = join(RAIZ, nombre)
    if (!existsSync(f)) continue
    for (const linea of readFileSync(f, 'utf8').split('\n')) {
      const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
    }
  }
}
cargarEnv()
const URL_BASE = process.env.VITE_SUPABASE_URL
const ANON = process.env.VITE_SUPABASE_ANON_KEY

async function leer(tabla, consulta) {
  const ctrl = new AbortController()
  const reloj = setTimeout(() => ctrl.abort(), 15000)
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/${tabla}?${consulta}`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(reloj)
  }
}

/**
 * Trae los datos y ademas informa QUE consultas fallaron.
 *
 * La distincion importa: una tabla vacia es un estado legitimo (si el cliente
 * borra todos los banners, el sitio cae a las fotos del repo y esta bien). Una
 * consulta que falla es un problema de infraestructura, y ahi lo que se dibuje
 * va a salir sin fotos.
 */
async function traerDatos() {
  if (!URL_BASE || !ANON) return { banners: [], productos: [], fallaron: ['sin credenciales'] }

  const fallaron = []
  const [banners, productos] = await Promise.all([
    leer('banners', 'select=*&activo=eq.true&order=orden.asc').catch((e) => {
      fallaron.push(`banners (${e.message})`)
      return []
    }),
    leer('productos', `select=${CAMPOS}&linea=eq.limpieza&order=orden.asc&limit=${TARJETAS}`).catch((e) => {
      fallaron.push(`productos (${e.message})`)
      return []
    }),
  ])
  return { banners, productos, fallaron }
}

// --- sombras de las APIs del navegador ------------------------------------
// Al dibujar no se ejecuta ningun efecto, asi que hace falta muy poco: solo lo
// que se toca durante el render. Se define antes de importar el bundle porque
// los modulos leen window al cargarse.
function prepararEntorno(datos) {
  globalThis.window = {
    __DATOS__: datos,
    // addListener/removeListener son la version vieja de la API. framer-motion
    // las llama, asi que sin ellas revienta el render de cualquier pagina que
    // use animaciones.
    matchMedia: () => ({
      matches: false,
      addEventListener() {}, removeEventListener() {},
      addListener() {}, removeListener() {},
    }),
    location: { pathname: '/' },
    addEventListener() {}, removeEventListener() {}, scrollTo() {},
    innerWidth: 1440,
  }
  globalThis.document = {
    addEventListener() {}, removeEventListener() {},
    body: { style: {} },
    documentElement: { setAttribute() {}, removeAttribute() {}, style: {} },
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    createElement: () => ({ getContext: () => ({}), toDataURL: () => '', style: {} }),
  }
  globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} }
  globalThis.sessionStorage = globalThis.localStorage
  globalThis.matchMedia = globalThis.window.matchMedia
  globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }
  globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
  globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0)
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
  globalThis.getComputedStyle = () => ({ getPropertyValue: () => '' })
  // framer-motion hace `x instanceof SVGElement` para decidir como animar. Sin
  // estas clases el chequeo no falla en falso: tira ReferenceError y se cae el
  // render entero de la pagina.
  for (const n of ['Node', 'Element', 'HTMLElement', 'SVGElement']) {
    if (!globalThis[n]) globalThis[n] = class {}
    globalThis.window[n] = globalThis[n]
  }
}

// Un `</script>` dentro de los datos cerraria la etiqueta antes de tiempo y el
// navegador leeria el resto como HTML. Escapando `<` eso no puede pasar.
const seguro = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

function guardar(ruta, html) {
  const destino = ruta === '/' ? join(DIST, 'index.html') : join(DIST, ruta, 'index.html')
  mkdirSync(dirname(destino), { recursive: true })
  writeFileSync(destino, html)
  console.log(`  ✓ ${ruta.padEnd(28)} ${(html.length / 1024).toFixed(1)} KB`)
}

// --- principal ------------------------------------------------------------
// Netlify define NETLIFY=true en sus builds. Sirve para ser estricto ahi y
// permisivo cuando alguien construye en su maquina sin .env.
const EN_NETLIFY = process.env.NETLIFY === 'true'

const plantilla = readFileSync(join(DIST, 'index.html'), 'utf8')

// El molde tiene que ser la salida limpia de `vite build`. Si ya trae marcado
// inyectado es que este script corrio dos veces sin un build en medio, y estaria
// dibujando sobre su propia salida: se acumularian bloques de datos y el
// resultado seria incoherente.
if (!plantilla.includes('<div id="root"></div>') || plantilla.includes(ID_DATOS)) {
  console.error('\n  ✗ dist/index.html no es el molde limpio de vite build.')
  console.error('     Correr `vite build` antes de este script (npm run build hace las dos).')
  process.exit(1)
}

// El molde vacio, para /admin: es privado, cambia con cada sesion y no tiene
// sentido dibujarlo al construir. Se guarda ANTES de tocar nada.
writeFileSync(join(DIST, 'app.html'), plantilla)

const { fallaron, ...datos } = await traerDatos()
console.log(`  · datos: ${datos.banners.length} banners, ${datos.productos.length} productos`)

// Si la base no contesto, lo que se dibujaria sale sin banner, sin productos y
// sin la precarga de portada: o sea, el sitio lento otra vez, y quieto asi
// hasta la proxima reconstruccion. Con builds disparados a mano eso se ve al
// toque; con la reconstruccion diaria corriendo de madrugada, no se entera
// nadie. Asi que se corta.
//
// Netlify, ante un build fallido, MANTIENE el despliegue anterior. Contenido de
// ayer completo y rapido es mucho mejor que contenido de hoy sin fotos.
if (fallaron.length) {
  console.error(`\n  ✗ No se pudieron leer los datos: ${fallaron.join(', ')}`)
  if (EN_NETLIFY) {
    console.error('     Se corta el build a proposito. Netlify deja publicado el')
    console.error('     despliegue anterior, que esta completo.')
    console.error('     Si el proyecto de Supabase esta pausado, hay que reanudarlo')
    console.error('     y volver a desplegar.')
    process.exit(1)
  }
  console.error('     Build local: se continua, pero las paginas salen sin fotos.')
}

prepararEntorno(datos)
const { render, precargaDePortada } = await import('../dist-ssr/entry-server.js')

// Las categorias salen de los productos: cada una es una ruta real que alguien
// puede abrir directo o recibir por link, y sin su propio HTML caeria en el
// molde del home y React tendria que redibujar todo.
const categorias = [...new Set(datos.productos.map((p) => p.categoria).filter(Boolean))]
const rutas = ['/', '/limpieza', ...categorias.map((c) => `/limpieza/${c}`)]

// Bloque de DATOS, no de codigo: el navegador no lo ejecuta, asi que la CSP
// (`script-src 'self'`) lo deja pasar sin tener que habilitar scripts inline.
// Piso de credibilidad: cualquier pagina real supera holgadamente esto. Por
// debajo, lo que se dibujo es un respaldo de error, no la pagina.
const MINIMO = 3000
const fallidas = []

const cabeza =
  precargaDePortada(datos.banners) +
  `<script type="application/json" id="${ID_DATOS}">${seguro(datos)}</script>`

for (const ruta of rutas) {
  globalThis.window.location.pathname = ruta
  let marcado
  try {
    marcado = render(ruta)
  } catch (e) {
    console.log(`  ✗ ${ruta}: ${e.message} — se publica el molde vacio`)
    guardar(ruta, plantilla)
    continue
  }

  // React no propaga los errores de render: los atrapa el limite de error mas
  // cercano y devuelve su respaldo, que aca es un spinner. O sea que una pagina
  // rota se ve como una pagina "que carga" y se publicaria sin que nadie se
  // entere. Paso una vez: framer-motion llamaba a una API que faltaba en las
  // sombras y /limpieza salio en blanco igual.
  const roto = marcado.includes('data-msg=')
  if (roto || marcado.length < MINIMO) {
    const causa = marcado.match(/data-msg="([^"]*)"/)?.[1] || `solo ${marcado.length} caracteres`
    console.log(`  ✗ ${ruta}: el render no sirve (${causa})`)
    console.log('     se publica el molde vacio: la pagina funciona, pero sin la ventaja')
    fallidas.push(ruta)
    guardar(ruta, plantilla)
    continue
  }
  guardar(
    ruta,
    plantilla
      .replace('</head>', `${cabeza}</head>`)
      .replace('<div id="root"></div>', `<div id="root">${marcado}</div>`),
  )
}

if (fallidas.length) {
  console.log(`\n  ${fallidas.length} de ${rutas.length} rutas se publicaron sin dibujar: ${fallidas.join(', ')}`)
}
