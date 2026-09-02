// Lecturas publicas del sitio, con fetch pelado.
//
// El cliente de @supabase/supabase-js pesa 210 KB y en el sitio publico se usaba
// para dos SELECT. Como PostgREST es una API REST comun, esas lecturas son un
// fetch con dos cabeceras — y asi la libreria queda fuera del bundle del
// visitante y solo se carga en /admin.
const URL_BASE = import.meta.env.VITE_SUPABASE_URL
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hayApi = Boolean(URL_BASE && ANON)

/**
 * GET contra PostgREST. `espera` corta la peticion: si el proyecto esta pausado
 * la promesa quedaria colgada y la pagina se quedaria en los esqueletos.
 */
export async function leer(tabla, consulta, espera = 8000) {
  const ctrl = new AbortController()
  const reloj = setTimeout(() => ctrl.abort(), espera)
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

/** Donde el prerender deja los datos dentro del HTML. */
export const ID_DATOS = 'datos-iniciales'

let cache
function datosDelHtml() {
  if (cache !== undefined) return cache
  if (typeof window === 'undefined') return (cache = null)
  // Al prerenderizar no hay DOM: los datos llegan por aca.
  if (window.__DATOS__) return (cache = window.__DATOS__)
  const el = typeof document !== 'undefined' ? document.getElementById(ID_DATOS) : null
  try {
    cache = el ? JSON.parse(el.textContent) : null
  } catch {
    cache = null
  }
  return cache
}

/**
 * Datos que el prerender dejo escritos en el HTML.
 *
 * Sirven para SEMBRAR el estado inicial de forma sincronica: el componente
 * pinta con datos en su primer render, sin esperar a ningun efecto. Es lo que
 * permite que el HTML llegue ya dibujado — antes traia los datos pero no el
 * marcado, asi que el visitante miraba una pantalla en blanco hasta que React
 * bajaba y se ejecutaba.
 *
 * Viajan en un <script type="application/json">, que el navegador NO ejecuta:
 * es un bloque de datos. Un script inline comun quedaria bloqueado por la CSP
 * (`script-src 'self'`, sin 'unsafe-inline'), y relajarla para esto seria abrir
 * la puerta a XSS a cambio de nada.
 *
 * NO se consumen: el mismo valor se lee al prerenderizar y al hidratar, y tienen
 * que coincidir exactamente o React descarta el arbol y lo vuelve a dibujar de
 * cero, que es justo lo que se quiere evitar. Los datos frescos llegan despues,
 * por la revalidacion en segundo plano que hace cada pagina.
 */
export function sembrado(clave) {
  return datosDelHtml()?.[clave] || null
}
