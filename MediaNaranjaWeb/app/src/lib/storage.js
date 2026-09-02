import { supabase } from './supabase'
import { esDeStorage, rutaEnBucket, slugify, urlServida } from './urls'

const BUCKET = 'productos'
const BANNERS_BUCKET = 'banners'


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

export { slugify, esDeStorage, rutaEnBucket, urlServida }





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

/**
 * Sube las versiones chicas AL LADO de la principal.
 *
 * La ruta se deriva de la URL que ya devolvio la subida principal, no del
 * nombre del archivo: uploadImage arma el path con un hash, asi que generarlo
 * por separado daria una ruta distinta y el srcset apuntaria a archivos que no
 * existen.
 *
 * Devuelve los anchos que quedaron efectivamente subidos.
 */
export async function subirTamanos(bucket, urlPrincipal, tamanos) {
  const rutaBase = rutaEnBucket(urlPrincipal, bucket)
  if (!rutaBase) return []
  const m = rutaBase.match(/^(.*)\.([a-z0-9]+)$/i)
  if (!m) return []
  const [, base, ext] = m

  const ok = []
  for (const { ancho, blob } of tamanos) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const { error } = await supabase.storage
        .from(bucket)
        .upload(`${base}-${ancho}.${ext}`, blob, {
          cacheControl: '31536000',
          upsert: true,
          contentType: blob.type || undefined,
        })
      if (!error) ok.push(ancho)
    } catch {
      // Si falla una version, el srcset simplemente no la ofrece.
    }
  }
  return ok
}

/**
 * Pide una vez cada version recien subida para que quede cacheada en el borde.
 *
 * Netlify solo guarda la imagen despues de que alguien la pide: la primera
 * peticion tiene que ir hasta Supabase y tarda ~1,7 s contra los ~0,4 s de una
 * cacheada. Sin esto ese costo lo paga el primer visitante real. Haciendolo
 * desde el panel al terminar de subir, lo paga el admin y nadie mas lo nota.
 *
 * No importa si falla: es solo un calentamiento.
 */
export async function precalentar(urls) {
  await Promise.allSettled(
    urls.filter(Boolean).map((u) => fetch(urlServida(u), { mode: 'no-cors', cache: 'reload' })),
  )
}

/** Todas las variantes de una imagen, para precalentarlas juntas. */
export function variantesDe(url, anchos) {
  const m = url?.match(/^(.*)\.([a-z0-9]+)$/i)
  if (!m) return [url]
  const [, base, ext] = m
  return [url, ...(anchos || []).map((w) => `${base}-${w}.${ext}`)]
}
