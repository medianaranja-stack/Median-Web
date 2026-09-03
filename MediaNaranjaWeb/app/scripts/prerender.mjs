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

async function traerDatos() {
  if (!URL_BASE || !ANON) {
    console.log('  · sin credenciales de Supabase: se dibuja el estado de carga')
    return { banners: [], productos: [] }
  }
  const [banners, productos] = await Promise.all([
    leer('banners', 'select=*&activo=eq.true&order=orden.asc').catch((e) => {
      console.log('  · banners:', e.message)
      return []
    }),
    leer('productos', `select=${CAMPOS}&linea=eq.limpieza&order=orden.asc&limit=${TARJETAS}`).catch((e) => {
      console.log('  · productos:', e.message)
      return []
    }),
  ])
  return { banners, productos }
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

// Cada ruta se guarda como `<ruta>.html`, no como `<ruta>/index.html`.
//
// Con la forma de directorio, Netlify redirige /limpieza a /limpieza/ antes de
// servir (su funcion "Pretty URLs"): un viaje de ida y vuelta extra para quien
// entra directo. Medido en produccion, 1,5 s contra 0,87 s del home. Como
// archivo suelto lo sirve de una, sin redireccion.
function guardar(ruta, html) {
  const destino = ruta === '/' ? join(DIST, 'index.html') : join(DIST, `${ruta}.html`)
  mkdirSync(dirname(destino), { recursive: true })
  writeFileSync(destino, html)
  console.log(`  ✓ ${ruta.padEnd(28)} ${(html.length / 1024).toFixed(1)} KB`)
}

// --- principal ------------------------------------------------------------
const plantilla = readFileSync(join(DIST, 'index.html'), 'utf8')

// El molde vacio, para /admin: es privado, cambia con cada sesion y no tiene
// sentido dibujarlo al construir. Se guarda ANTES de tocar nada.
writeFileSync(join(DIST, 'app.html'), plantilla)

const datos = await traerDatos()
console.log(`  · datos: ${datos.banners.length} banners, ${datos.productos.length} productos`)

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
  `<script type="application/json" id="datos-iniciales">${seguro(datos)}</script>`

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
