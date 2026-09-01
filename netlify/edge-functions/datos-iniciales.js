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

const MARCA = '/storage/v1/object/public/'
const porProxy = (u) => (u && u.includes(MARCA) ? `/img/${u.slice(u.indexOf(MARCA) + MARCA.length)}` : u)

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
      traer('productos', 'select=*&linea=eq.limpieza&order=orden.asc', ctrl.signal),
    ])
  } catch {
    return res // Supabase lento o caido: se sirve el HTML sin tocar.
  } finally {
    clearTimeout(reloj)
  }

  const portada = banners?.[0]?.url ? porProxy(banners[0].url) : null
  const html = await res.text()

  const inyeccion =
    (portada
      ? `<link rel="preload" as="image" href="${portada}" fetchpriority="high">`
      : '') +
    `<script>window.__DATOS__=${JSON.stringify({ banners, productos }).replace(/</g, '\\u003c')}</script>`

  return new Response(html.replace('</head>', `${inyeccion}</head>`), {
    status: res.status,
    headers: res.headers,
  })
}

export const config = { path: '/' }
