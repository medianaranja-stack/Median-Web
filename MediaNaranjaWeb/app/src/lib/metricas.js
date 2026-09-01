// Lectura de métricas para el panel. Todo se agrega en la base con funciones
// SQL: traer los eventos crudos al navegador para sumarlos acá no escalaría.
// Las funciones respetan el RLS, así que si las llama alguien que no es admin
// devuelven vacío.
import { supabase } from './supabase'

// Nombres lindos para los id de sección que usa el sitio.
export const NOMBRE_ZONA = {
  top: 'Banner principal',
  modulos: 'Accesos rápidos',
  productos: 'Productos',
  historia: 'Nosotros',
  contacto: 'Contacto',
}

async function rpc(fn, params) {
  const { data, error } = await supabase.rpc(fn, params)
  if (error) throw error
  return data
}

export async function cargarMetricas(dias) {
  // metricas_origen existe en la base (de dónde llegan y con qué dispositivo)
  // pero no se pide acá: no estaba entre lo que se quiso medir. Sumarla después
  // es agregar una línea.
  const [resumen, porDia, secciones, productos, descargas] = await Promise.all([
    rpc('metricas_resumen', { dias }),
    rpc('metricas_por_dia', { dias }),
    rpc('metricas_secciones', { dias }),
    rpc('metricas_productos', { dias, tope: 10 }),
    rpc('metricas_descargas', { dias, tope: 10 }),
  ])
  return {
    resumen: resumen?.[0] || { visitas: 0, visitantes: 0, sesiones: 0 },
    porDia: rellenarDias(porDia || [], dias),
    secciones: (secciones || []).map((s) => ({ ...s, nombre: NOMBRE_ZONA[s.seccion] || s.seccion })),
    productos: productos || [],
    descargas: descargas || [],
  }
}

/**
 * La base sólo devuelve los días que tuvieron tráfico. Para el gráfico hacen
 * falta todos, si no un día sin visitas se dibujaría como si no existiera y la
 * línea mentiría sobre la forma del período.
 */
function rellenarDias(filas, dias) {
  const porFecha = new Map(filas.map((f) => [f.dia, f]))
  const salida = []
  const hoy = new Date()
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() - i)
    const clave = d.toISOString().slice(0, 10)
    const f = porFecha.get(clave)
    salida.push({
      dia: clave,
      visitas: Number(f?.visitas || 0),
      visitantes: Number(f?.visitantes || 0),
    })
  }
  return salida
}

export const numero = (n) => new Intl.NumberFormat('es-AR').format(Number(n) || 0)

/** Segundos a algo legible: 45s · 3m 20s · 1h 12m */
export function duracion(seg) {
  const s = Math.round(Number(seg) || 0)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return s % 60 ? `${m}m ${s % 60}s` : `${m}m`
  const h = Math.floor(m / 60)
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`
}

export function fechaCorta(iso) {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}`
}
