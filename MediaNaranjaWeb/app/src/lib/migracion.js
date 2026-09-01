// Migración de las fotos de producto que todavía viven en el repo.
//
// El seed original cargó las filas en la base pero dejó las imágenes como rutas
// locales (/productos/limpieza/...), servidas desde public/. Eso las vuelve
// inmutables desde el panel: sólo se pueden reemplazar tocando el repo y
// redeployando. Esto las sube a Supabase Storage y reescribe la fila, para que
// todas las fotos de producto se manejen desde un solo lugar.
//
// Es idempotente: las que ya están en Storage se saltan.
import { uploadImage, esDeStorage } from './storage'
import { updateProduct } from './products'

/** Fotos de un producto que todavía no están en Storage. */
export function fotosEnRepo(p) {
  return (p.imagenes || []).filter((u) => !esDeStorage(u))
}

/** Productos a los que les falta migrar al menos una foto. */
export function pendientesDeMigrar(items) {
  return items.filter((p) => fotosEnRepo(p).length > 0)
}

/** Total de fotos por migrar, para mostrar el progreso. */
export function totalFotosEnRepo(items) {
  return items.reduce((n, p) => n + fotosEnRepo(p).length, 0)
}

/**
 * Sube a Storage las fotos locales de un producto y actualiza su fila.
 * `onFoto` se llama después de cada imagen, para ir informando el avance.
 */
export async function migrarProducto(p, onFoto) {
  const nuevas = []
  for (const url of p.imagenes || []) {
    if (esDeStorage(url)) {
      nuevas.push(url)
      continue
    }
    // Mismo origen que la app: public/ se sirve junto al sitio.
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(url)
    if (!res.ok) throw new Error(`No se pudo leer ${url} (HTTP ${res.status})`)
    // eslint-disable-next-line no-await-in-loop
    const blob = await res.blob()
    const nombre = decodeURIComponent(url.split('/').pop() || 'foto.jpg')
    // eslint-disable-next-line no-await-in-loop
    const publica = await uploadImage(blob, {
      linea: p.linea,
      categoria: p.categoria,
      slug: p.slug,
      nombre,
    })
    nuevas.push(publica)
    onFoto?.()
  }
  await updateProduct(p.id, { imagenes: nuevas })
  return nuevas
}
