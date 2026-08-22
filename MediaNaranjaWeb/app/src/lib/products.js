import seed from '../data/seed.json'
import { supabase, isSupabaseEnabled } from './supabase'
import { getMockProducts } from './mockStore'

// Deriva la lista de categorías (únicas, en orden de aparición) de un set de productos.
function deriveCategorias(productos, linea) {
  const seen = new Map()
  for (const p of productos) if (!seen.has(p.categoria)) seen.set(p.categoria, p.categoriaLabel)
  return [...seen].map(([slug, label]) => ({ linea, slug, label }))
}

const forceSeed = import.meta.env.VITE_USE_SEED === 'true'
const useSeed = forceSeed || !isSupabaseEnabled

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
    comprarUrl: row.comprar_url || 'https://www.medianaranja.store',
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
    comprar_url: p.comprarUrl || 'https://www.medianaranja.store',
    orden: p.orden ?? 0,
  }
}

/** Devuelve { productos, categorias } para una línea */
export async function getCatalog(linea) {
  if (useSeed) {
    const mock = getMockProducts().filter((p) => p.linea === linea)
    const base = seed.productos.filter((p) => p.linea === linea)
    // mock primero para que se vean arriba en la demo
    const productos = [...mock, ...base]
    return { productos, categorias: deriveCategorias(productos, linea) }
  }
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('linea', linea)
    .order('orden', { ascending: true })
  if (error) throw error
  const productos = (data || []).map(fromRow)
  const seen = new Map()
  for (const p of productos) if (!seen.has(p.categoria)) seen.set(p.categoria, p.categoriaLabel)
  const categorias = [...seen].map(([slug, label]) => ({ linea, slug, label }))
  return { productos, categorias }
}

/** Todos los productos (para el admin) */
export async function getAllProducts() {
  if (useSeed) return [...getMockProducts(), ...seed.productos]
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

export async function deleteProduct(id) {
  const { error } = await supabase.from('productos').delete().eq('id', id)
  if (error) throw error
}

export const CATALOG_MODE = useSeed ? 'seed' : 'supabase'
