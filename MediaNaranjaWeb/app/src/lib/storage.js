import { supabase } from './supabase'

const BUCKET = 'productos'
const BANNERS_BUCKET = 'banners'

function slugify(s) {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

/**
 * Sube una imagen al bucket de productos y devuelve la URL pública.
 * Acepta un File (del input del panel) o un Blob (por ejemplo el que baja la
 * migración de las fotos que todavía viven en el repo); en ese caso hay que
 * pasarle `nombre`, porque un Blob no tiene uno.
 */
export async function uploadImage(file, { linea, categoria, slug, nombre }) {
  const nombreArchivo = nombre || file.name || 'foto.jpg'
  const ext = (nombreArchivo.split('.').pop() || 'jpg').toLowerCase()
  const rand = Math.abs(hashString(nombreArchivo + file.size)).toString(36)
  const path = `${slugify(linea)}/${slugify(categoria)}/${slugify(slug)}/${rand}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: true,
    contentType: file.type || undefined,
  })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// hash determinístico simple (evita Math.random para nombres estables por archivo)
function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}

export { slugify }

const MARCA_STORAGE = '/storage/v1/object/public/'

/**
 * Reescribe una URL de Supabase Storage para que salga por nuestro dominio.
 *
 * En el plan gratuito Supabase responde `cache-control: no-cache` y no hay forma
 * de cambiarlo desde el codigo: cada visita volvia a bajar todas las imagenes.
 * El proxy de Netlify (`/img/*` en netlify.toml) sirve el mismo archivo pero con
 * cache de un ano, y desde un CDN mas cercano.
 *
 * En desarrollo no hay proxy, asi que se deja la URL original.
 */
export function urlServida(url) {
  if (!esDeStorage(url)) return url
  if (import.meta.env.DEV) return url
  const i = url.indexOf(MARCA_STORAGE)
  return `/img/${url.slice(i + MARCA_STORAGE.length)}`
}

/** ¿La URL apunta a Supabase Storage, o a un archivo suelto del repo? */
export function esDeStorage(url) {
  return typeof url === 'string' && url.includes(MARCA_STORAGE)
}

/** Ruta dentro del bucket, para poder borrar el archivo. null si no es de Storage. */
export function rutaEnBucket(url, bucket) {
  const marca = `${MARCA_STORAGE}${bucket}/`
  const i = (url || '').indexOf(marca)
  return i === -1 ? null : decodeURIComponent(url.slice(i + marca.length))
}

/**
 * Borra del bucket de productos las imágenes que sean de Storage.
 *
 * No lanza si el archivo no se pudo borrar: para ese momento la fila ya se
 * eliminó y el usuario hizo lo que quería. Devuelve el error para que quien
 * llama pueda avisar que quedó un archivo suelto, en vez de que falle en
 * silencio y el bucket junte basura sin que nadie lo sepa.
 */
export async function borrarImagenesProducto(urls) {
  const rutas = (urls || []).map((u) => rutaEnBucket(u, BUCKET)).filter(Boolean)
  if (!rutas.length) return null
  const { error } = await supabase.storage.from(BUCKET).remove(rutas)
  return error || null
}

/** Sube la imagen de un banner al bucket `banners` y devuelve la URL pública */
export async function uploadBannerImage(file, nombre) {
  // Igual que uploadImage: acepta un File del input o un Blob descargado (las
  // fotos del repo que se importan como banner), que no tiene nombre propio.
  const nombreArchivo = nombre || file.name || 'banner.jpg'
  const ext = (nombreArchivo.split('.').pop() || 'jpg').toLowerCase()
  const base = slugify(nombreArchivo.replace(/\.[^.]+$/, '')) || 'banner'
  const rand = Math.abs(hashString(nombreArchivo + file.size + (file.lastModified || 0))).toString(36)
  const path = `${base}-${rand}.${ext}`
  const { error } = await supabase.storage.from(BANNERS_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: true,
    contentType: file.type || undefined,
  })
  if (error) throw error
  const { data } = supabase.storage.from(BANNERS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
