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
