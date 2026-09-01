// Carrusel del home. Vive en Supabase (tabla `banners` + bucket `banners`),
// así lo que carga el admin lo ve todo el mundo — antes era localStorage, o sea
// que cada visitante veía su propia versión.
//
// El orden manda: el banner con menor `orden` es el primero que aparece al
// entrar. Si todavía no hay ninguno cargado, cae a estas fotos del repo para
// que el home nunca quede vacío. El panel las muestra como "de respaldo" para
// que no parezca que el carrusel salió de la nada.
import { supabase, isSupabaseEnabled, conLimite } from './supabase'
import { rutaEnBucket, uploadBannerImage } from './storage'

export const RESPALDO = [
  { id: 'local-1', blur: null, url: '/fabrica/planta-a.jpg', titulo: '', orden: 0, activo: true },
  { id: 'local-2', blur: null, url: '/fabrica/planta-b.jpg', titulo: '', orden: 1, activo: true },
  { id: 'local-3', blur: null, url: '/fabrica/fabrica-2.jpg', titulo: '', orden: 2, activo: true },
  { id: 'local-4', blur: null, url: '/fabrica/nosotros.jpg', titulo: '', orden: 3, activo: true },
]

/** Banners publicados, en orden. El primero es el que se ve al entrar. */
export async function getPublicBanners() {
  if (!isSupabaseEnabled) return RESPALDO
  // Un fallo de red o un proyecto pausado no pueden dejar el home sin hero:
  // ante cualquier problema se cae a las fotos del repo, que siempre están.
  const { data, error } = await conLimite(
    supabase.from('banners').select('*').eq('activo', true).order('orden', { ascending: true }),
    6000,
    'el carrusel',
  ).catch(() => ({ data: null, error: true }))
  if (error) return RESPALDO
  return data && data.length ? data : RESPALDO
}

/** Todos los banners, activos y no, para el panel. */
export async function getAllBanners() {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('orden', { ascending: true })
  if (error) throw error
  return data || []
}

/** Agrega un banner al final de la lista. */
export async function createBanner({ url, titulo = '', blur = null }, ordenSiguiente) {
  const { data, error } = await supabase
    .from('banners')
    .insert({ url, titulo, blur, orden: ordenSiguiente, activo: true })
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Borra la fila y también el archivo del bucket, si no se acumulan imágenes
 * huérfanas ocupando espacio que nadie referencia.
 *
 * Devuelve el error del borrado del archivo (o null). No lo lanza: la fila ya
 * se eliminó, así que la operación que pidió el usuario salió bien; lo que
 * queda por avisar es que sobró un archivo.
 */
export async function deleteBanner(banner) {
  const { error } = await supabase.from('banners').delete().eq('id', banner.id)
  if (error) throw error
  // Las de respaldo viven en el repo y no devuelven ruta: no hay nada que borrar.
  const path = rutaEnBucket(banner.url, 'banners')
  if (!path) return null
  const { error: errArchivo } = await supabase.storage.from('banners').remove([path])
  return errArchivo || null
}

export async function updateBanner(id, patch) {
  const { error } = await supabase.from('banners').update(patch).eq('id', id)
  if (error) throw error
}

/**
 * Reescribe el campo `orden` según la posición en la lista recibida.
 * Se llama después de mover un banner o de elegir cuál va primero.
 */
export async function saveOrden(lista) {
  const updates = lista.map((b, i) => updateBanner(b.id, { orden: i }))
  await Promise.all(updates)
}

/** Devuelve la lista con el banner `id` movido `delta` posiciones. */
export function moverBanner(lista, id, delta) {
  const i = lista.findIndex((b) => b.id === id)
  const j = i + delta
  if (i < 0 || j < 0 || j >= lista.length) return lista
  const copia = [...lista]
  ;[copia[i], copia[j]] = [copia[j], copia[i]]
  return copia
}

/** Devuelve la lista con el banner `id` puesto primero (el de portada). */
export function hacerPrincipal(lista, id) {
  const b = lista.find((x) => x.id === id)
  if (!b) return lista
  return [b, ...lista.filter((x) => x.id !== id)]
}

/**
 * Convierte las fotos de respaldo en banners de verdad: las sube al bucket y
 * crea las filas. Recién ahí se pueden reordenar, ocultar, encuadrar y borrar,
 * porque pasan a ser datos y no rutas escritas en el código.
 *
 * Sube una copia al Storage en vez de apuntar al archivo del repo: así el
 * carrusel queda entero dentro de Supabase y borrar un banner no depende de
 * tocar el repo. Los originales siguen en public/fabrica, que los usa la
 * sección Nosotros.
 */
export async function importarRespaldo(onCadaUna) {
  const creados = []
  for (const [i, b] of RESPALDO.entries()) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(b.url)
    if (!res.ok) throw new Error(`No se pudo leer ${b.url} (HTTP ${res.status})`)
    // eslint-disable-next-line no-await-in-loop
    const blob = await res.blob()
    const nombre = b.url.split('/').pop()
    // eslint-disable-next-line no-await-in-loop
    const publica = await uploadBannerImage(blob, nombre)
    // eslint-disable-next-line no-await-in-loop
    creados.push(await createBanner({ url: publica }, i))
    onCadaUna?.()
  }
  return creados
}
