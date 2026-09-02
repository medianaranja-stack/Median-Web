// Helpers de URL. Sin dependencias a proposito: los usa el sitio publico y no
// tiene que arrastrar el cliente de Supabase (210 KB) solo por reescribir una
// direccion.
const MARCA = '/storage/v1/object/public/'

/** ¿La URL apunta a Supabase Storage, o a un archivo suelto del repo? */
export function esDeStorage(url) {
  return typeof url === 'string' && url.includes(MARCA)
}

/** Ruta dentro del bucket, para poder borrar el archivo. null si no es de Storage. */
export function rutaEnBucket(url, bucket) {
  const marca = `${MARCA}${bucket}/`
  const i = (url || '').indexOf(marca)
  return i === -1 ? null : decodeURIComponent(url.slice(i + marca.length))
}

/**
 * Reescribe una URL de Storage para que salga por nuestro dominio.
 * Supabase responde `cache-control: no-cache` y no hay forma de cambiarlo desde
 * el codigo: cada visita volvia a bajar todo. El proxy de Netlify (/img/* en
 * netlify.toml) sirve el mismo archivo con cache de un ano y desde su CDN.
 * En desarrollo no hay proxy, asi que se deja la URL original.
 */
export function urlServida(url) {
  if (!esDeStorage(url)) return url
  if (import.meta.env.DEV) return url
  return `/img/${url.slice(url.indexOf(MARCA) + MARCA.length)}`
}

export function slugify(s) {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

/**
 * Arma el srcset a partir de la URL principal y los anchos disponibles.
 * Los archivos viven al lado del original con el ancho pegado al final
 * (abc123.webp -> abc123-400.webp), asi que se derivan de la URL sin guardar
 * nada mas. subirTamanos() los escribe exactamente con ese patron.
 *
 * Sin anchos devuelve null y el <img> usa src a secas, como antes.
 */
export function srcSetDe(url, anchos) {
  if (!Array.isArray(anchos) || !anchos.length || !esDeStorage(url)) return null
  const m = url.match(/^(.*)\.([a-z0-9]+)$/i)
  if (!m) return null
  const [, base, ext] = m
  return anchos
    .slice()
    .sort((a, b) => a - b)
    .map((w) => `${urlServida(`${base}-${w}.${ext}`)} ${w}w`)
    .join(', ')
}
