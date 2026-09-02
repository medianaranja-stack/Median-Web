// Inyecta en el HTML los datos del home antes de mandarlo al navegador.
//
// El problema que resuelve: el sitio es una SPA, asi que el HTML sale vacio y
// el navegador no puede saber que existe una imagen hasta que baja el JS, lo
// ejecuta y consulta la base. Eso son ~0,65s en los que no pide nada.
//
// Aca, en el borde, se consulta Supabase y se agrega al <head>:
//   · un <link rel="preload"> de la foto de portada, para que empiece a bajar
//     durante el parseo del HTML, en paralelo con el JS
//   · los datos ya serializados, para que React pinte sin volver a consultar
//
// Si algo falla se devuelve el HTML tal cual: la pagina sigue funcionando como
// hasta ahora, consultando desde el navegador.
const URL_BASE = Deno.env.get('VITE_SUPABASE_URL')
const ANON = Deno.env.get('VITE_SUPABASE_ANON_KEY')
const ESPERA = 1200 // no vale la pena demorar el HTML mas que esto

// Cuantas tarjetas pinta el home. Inyectar las 36 con ficha completa llevaba el
// HTML de 1,8 KB a 46 KB: retrasa lo primero que llega y anula el beneficio.
const TARJETAS = 12

// Solo los campos que el home necesita para pintar. La descripcion y la ficha
// tecnica pesan mucho y no se ven hasta que se abre el producto, asi que esas
// las trae el JS despues.
const CAMPOS_TARJETA = 'id,nombre,slug,categoria,categoria_label,imagenes,anchos,linea'

const MARCA = '/storage/v1/object/public/'
const porProxy = (u) => (u && u.includes(MARCA) ? `/img/${u.slice(u.indexOf(MARCA) + MARCA.length)}` : u)

// Tiene que coincidir con el `sizes` del <img> del banner en Landing.jsx. Si no
// coincide, el navegador precarga una version y despues pide otra: se descarga
// la imagen dos veces y el preload empeora las cosas en vez de ayudar.
const SIZES_BANNER = '(max-width: 640px) 100vw, (max-width: 1280px) 800px, 1600px'

function srcsetDe(url, anchos) {
  if (!Array.isArray(anchos) || !anchos.length) return null
  const m = url.match(/^(.*)\.([a-z0-9]+)$/i)
  if (!m) return null
  const [, base, ext] = m
  return anchos
    .slice()
    .sort((a, b) => a - b)
    .map((w) => `${porProxy(`${base}-${w}.${ext}`)} ${w}w`)
    .join(', ')
}

async function traer(tabla, consulta, signal) {
  const r = await fetch(`${URL_BASE}/rest/v1/${tabla}?${consulta}`, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
    signal,
  })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

export default async function (request, context) {
  const res = await context.next()
  const tipo = res.headers.get('content-type') || ''
  if (!tipo.includes('text/html') || !URL_BASE || !ANON) return res

  const ctrl = new AbortController()
  const reloj = setTimeout(() => ctrl.abort(), ESPERA)
  let banners = null
  let productos = null
  try {
    ;[banners, productos] = await Promise.all([
      traer('banners', 'select=*&activo=eq.true&order=orden.asc', ctrl.signal),
      traer(
        'productos',
        `select=${CAMPOS_TARJETA}&linea=eq.limpieza&order=orden.asc&limit=${TARJETAS}`,
        ctrl.signal,
      ),
    ])
  } catch {
    return res // Supabase lento o caido: se sirve el HTML sin tocar.
  } finally {
    clearTimeout(reloj)
  }

  const b0 = banners?.[0]
  const html = await res.text()

  let preload = ''
  if (b0?.url) {
    const set = srcsetDe(b0.url, b0.anchos)
    // Con imagesrcset el navegador elige la misma version que va a pedir el
    // <img>; con href a secas bajaria la grande siempre.
    preload = set
      ? `<link rel="preload" as="image" imagesrcset="${set}" imagesizes="${SIZES_BANNER}" fetchpriority="high">`
      : `<link rel="preload" as="image" href="${porProxy(b0.url)}" fetchpriority="high">`
  }

  // Los banners van con blur para poder pintar la vista previa borrosa apenas
  // llega el HTML, sin esperar a que responda la base.
  const inyeccion =
    preload +
    `<script>window.__DATOS__=${JSON.stringify({ banners, productos }).replace(/</g, '\\u003c')}</script>`

  return new Response(html.replace('</head>', `${inyeccion}</head>`), {
    status: res.status,
    headers: res.headers,
  })
}

export const config = { path: '/' }
