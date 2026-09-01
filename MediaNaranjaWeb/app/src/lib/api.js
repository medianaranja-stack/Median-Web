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

/**
 * Datos que la Edge Function dejo en el HTML. Si estan, el primer render no
 * necesita consultar nada y se pinta en el primer frame. Se leen una sola vez:
 * a partir de ahi cualquier recarga de datos va contra la base, para no mostrar
 * informacion vieja si el admin cambia algo mientras la pestana esta abierta.
 */
let precargados = typeof window !== 'undefined' ? window.__DATOS__ : null

export function tomarPrecargado(clave) {
  const v = precargados?.[clave]
  if (v) precargados = { ...precargados, [clave]: null }
  return v || null
}
