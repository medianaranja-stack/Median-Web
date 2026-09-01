// Escrituras y lecturas completas de productos: solo las usa el panel.
// Viven aparte de products.js para que el cliente de Supabase (210 KB) quede
// fuera del bundle del visitante, que solo necesita leer el catalogo.
import { supabase } from './supabase'
import { fromRow, toRow } from './products'

let seedCache = null
async function getSeed() {
  if (!seedCache) seedCache = (await import('../data/seed.json')).default
  return seedCache
}
const useSeed = import.meta.env.VITE_USE_SEED === 'true'
  || !(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)


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
