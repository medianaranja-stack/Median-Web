import { isSupabaseEnabled } from './supabase-env'
import { leer, tomarPrecargado } from './api'

// Deriva la lista de categorías (únicas, en orden de aparición) de un set de productos.
function deriveCategorias(productos, linea) {
  const seen = new Map()
  for (const p of productos) if (!seen.has(p.categoria)) seen.set(p.categoria, p.categoriaLabel)
  return [...seen].map(([slug, label]) => ({ linea, slug, label }))
}

const forceSeed = import.meta.env.VITE_USE_SEED === 'true'
const useSeed = forceSeed || !isSupabaseEnabled

// El catálogo del repo es sólo el respaldo de cuando no hay Supabase conectado.
// Se carga aparte para que esos 34 KB no viajen en el bundle de producción,
// donde nunca se usan porque la fuente de verdad es la base.
let seedCache = null
async function getSeed() {
  if (!seedCache) seedCache = (await import('../data/seed.json')).default
  return seedCache
}

// Normaliza una fila de Supabase al shape que usa la UI
export function fromRow(row) {
  return {
    id: row.id,
    linea: row.linea,
    categoria: row.categoria,
    categoriaLabel: row.categoria_label,
    nombre: row.nombre,
    slug: row.slug,
    descripcion: row.descripcion || '',
    specs: row.specs || {},
    imagenes: row.imagenes || [],
    anchos: row.anchos || [],
    orden: row.orden ?? 0,
  }
}

export function toRow(p) {
  return {
    linea: p.linea,
    categoria: p.categoria,
    categoria_label: p.categoriaLabel,
    nombre: p.nombre,
    slug: p.slug,
    descripcion: p.descripcion || '',
    specs: p.specs || {},
    imagenes: p.imagenes || [],
    anchos: p.anchos || [],
    orden: p.orden ?? 0,
  }
}

/** Devuelve { productos, categorias } para una línea */
export async function getCatalog(linea) {
  if (useSeed) {
    const seed = await getSeed()
    const productos = seed.productos.filter((p) => p.linea === linea)
    return { productos, categorias: deriveCategorias(productos, linea) }
  }
  // Si la Edge Function ya los dejo en el HTML, se usan sin pedir nada.
  const yaEstan = linea === 'limpieza' ? tomarPrecargado('productos') : null
  const data = yaEstan?.length ? yaEstan : await leer('productos', `select=*&linea=eq.${encodeURIComponent(linea)}&order=orden.asc`)
  const productos = (data || []).map(fromRow)
  const seen = new Map()
  for (const p of productos) if (!seen.has(p.categoria)) seen.set(p.categoria, p.categoriaLabel)
  const categorias = [...seen].map(([slug, label]) => ({ linea, slug, label }))
  return { productos, categorias }
}
export const CATALOG_MODE = useSeed ? 'seed' : 'supabase'
