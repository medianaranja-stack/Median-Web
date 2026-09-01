import { supabase, isSupabaseEnabled, conLimite } from './supabase'

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
function fromRow(row) {
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
    orden: row.orden ?? 0,
  }
}

function toRow(p) {
  return {
    linea: p.linea,
    categoria: p.categoria,
    categoria_label: p.categoriaLabel,
    nombre: p.nombre,
    slug: p.slug,
    descripcion: p.descripcion || '',
    specs: p.specs || {},
    imagenes: p.imagenes || [],
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
  const { data, error } = await conLimite(
    supabase.from('productos').select('*').eq('linea', linea).order('orden', { ascending: true }),
    8000,
    'el catálogo',
  )
  if (error) throw error
  const productos = (data || []).map(fromRow)
  const seen = new Map()
  for (const p of productos) if (!seen.has(p.categoria)) seen.set(p.categoria, p.categoriaLabel)
  const categorias = [...seen].map(([slug, label]) => ({ linea, slug, label }))
  return { productos, categorias }
}

/** Todos los productos (para el admin) */
export async function getAllProducts() {
  if (useSeed) return (await getSeed()).productos
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('linea', { ascending: true })
    .order('orden', { ascending: true })
  if (error) throw error
  return (data || []).map(fromRow)
}

export async function createProduct(p) {
  const { data, error } = await supabase.from('productos').insert(toRow(p)).select().single()
  if (error) throw error
  return fromRow(data)
}

/**
 * Actualiza un producto. `patch` usa los nombres de la app (categoriaLabel,
 * categoriaLabel…) y acá se traducen a las columnas de la tabla.
 */
export async function updateProduct(id, patch) {
  const columnas = {
    linea: 'linea',
    categoria: 'categoria',
    categoriaLabel: 'categoria_label',
    nombre: 'nombre',
    slug: 'slug',
    descripcion: 'descripcion',
    specs: 'specs',
    imagenes: 'imagenes',
    orden: 'orden',
  }
  const row = {}
  for (const [k, v] of Object.entries(patch)) {
    if (columnas[k] !== undefined) row[columnas[k]] = v
  }
  const { data, error } = await supabase.from('productos').update(row).eq('id', id).select().single()
  if (error) throw error
  return fromRow(data)
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('productos').delete().eq('id', id)
  if (error) throw error
}

export const CATALOG_MODE = useSeed ? 'seed' : 'supabase'
