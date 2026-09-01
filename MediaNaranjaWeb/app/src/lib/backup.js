// Descarga masiva de todas las fotos del sitio, en un ZIP.
//
// Sirve como copia de seguridad: aunque todo viva en Supabase, tener el
// material fuera de la nube es lo que hace que una cuenta suspendida, un borrado
// por error o una migración a otro proveedor no cuesten las fotos.
//
// El ZIP se arma sin compresión (nivel 0) a propósito: un JPG ya está
// comprimido, volver a comprimirlo tarda mucho más y no baja casi nada de peso.
import { slugify } from './storage'

/** Nombre de archivo estable y ordenable dentro del ZIP. */
export function nombreFoto(indice, url) {
  const ext = (url.split('?')[0].split('.').pop() || 'jpg').toLowerCase()
  return `${String(indice + 1).padStart(2, '0')}.${ext.length > 4 ? 'jpg' : ext}`
}

/**
 * Arma la lista de archivos a bajar, con la ruta que va a tener cada uno
 * dentro del ZIP. Se separa del bajado para poder contar el total antes de
 * arrancar y mostrar un progreso real.
 */
export function planificar({ productos = [], banners = [] }) {
  const plan = []
  for (const p of productos) {
    const carpeta = `productos/${slugify(p.categoriaLabel || p.categoria)}/${p.slug}`
    ;(p.imagenes || []).forEach((url, i) => {
      plan.push({ ruta: `${carpeta}/${nombreFoto(i, url)}`, url })
    })
  }
  banners.forEach((b, i) => {
    plan.push({ ruta: `banner/${nombreFoto(i, b.url)}`, url: b.url })
  })
  return plan
}

/**
 * Baja todo y devuelve un Blob con el ZIP.
 * `onProgreso(hechas, total)` se llama después de cada archivo.
 * Devuelve también las que fallaron, para poder avisar en vez de entregar
 * una copia incompleta haciéndola pasar por completa.
 */
export async function armarZip(plan, onProgreso) {
  const { zipSync } = await import('fflate')

  const archivos = {}
  const fallados = []
  let hechas = 0

  // De a 6 en paralelo: suficiente para que no tarde una eternidad, sin
  // saturar la conexión ni disparar límites del Storage.
  const TANDA = 6
  for (let i = 0; i < plan.length; i += TANDA) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(
      plan.slice(i, i + TANDA).map(async ({ ruta, url }) => {
        try {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          archivos[ruta] = new Uint8Array(await res.arrayBuffer())
        } catch (e) {
          fallados.push({ ruta, motivo: e.message })
        } finally {
          onProgreso?.(++hechas, plan.length)
        }
      }),
    )
  }

  const zip = zipSync(archivos, { level: 0 })
  return {
    blob: new Blob([zip], { type: 'application/zip' }),
    incluidas: Object.keys(archivos).length,
    fallados,
  }
}

export function descargarBlob(blob, nombre) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function nombreArchivoZip(que) {
  const hoy = new Date().toISOString().slice(0, 10)
  return `medianaranja-${que}-${hoy}.zip`
}

/** Peso aproximado, para avisar antes de arrancar una descarga grande. */
export function pesoLegible(bytes) {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`
  if (bytes >= 1048576) return `${Math.round(bytes / 1048576)} MB`
  return `${Math.round(bytes / 1024)} KB`
}

/** Baja un archivo suelto tal cual, sin empaquetar. */
export async function descargarUna(url, nombre) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`No se pudo bajar la imagen (HTTP ${res.status})`)
  const blob = await res.blob()
  const ext = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
  descargarBlob(blob, `${nombre}.${ext}`)
}

/**
 * Fotos de un solo producto. Con una sola foto baja el archivo directo: meter
 * una imagen suelta en un ZIP obliga a descomprimir para nada.
 */
export async function descargarProducto(p, onProgreso) {
  const imgs = p.imagenes || []
  if (!imgs.length) throw new Error('Este producto no tiene fotos.')
  if (imgs.length === 1) {
    await descargarUna(imgs[0], `medianaranja-${p.slug}`)
    return { incluidas: 1, fallados: [] }
  }
  const plan = imgs.map((url, i) => ({ ruta: `${p.slug}/${nombreFoto(i, url)}`, url }))
  const { blob, incluidas, fallados } = await armarZip(plan, onProgreso)
  descargarBlob(blob, `medianaranja-${p.slug}.zip`)
  return { incluidas, fallados }
}
