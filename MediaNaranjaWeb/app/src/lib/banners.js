// Carrusel del home. Vive en Supabase (tabla `banners` + bucket `banners`),
// así lo que carga el admin lo ve todo el mundo — antes era localStorage, o sea
// que cada visitante veía su propia versión.
//
// El orden manda: el banner con menor `orden` es el primero que aparece al
// entrar. Si todavía no hay ninguno cargado, cae a estas fotos del repo para
// que el home nunca quede vacío. El panel las muestra como "de respaldo" para
// que no parezca que el carrusel salió de la nada.
import { isSupabaseEnabled } from './supabase-env'
import { leer, tomarPrecargado } from './api'

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
  // Si la Edge Function ya los dejo en el HTML, se usan sin pedir nada.
  const yaEstan = tomarPrecargado('banners')
  if (yaEstan?.length) return yaEstan
  const data = await leer('banners', 'select=*&activo=eq.true&order=orden.asc', 6000)
    .catch(() => null)
  return data && data.length ? data : RESPALDO
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

