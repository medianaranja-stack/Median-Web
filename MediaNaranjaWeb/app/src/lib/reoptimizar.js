// Reoptimización de imágenes ya cargadas.
//
// La optimización al subir sólo aplica a lo nuevo. Esto recorre lo que ya está
// en Storage, lo vuelve a comprimir con los parámetros actuales y reemplaza el
// archivo, para no tener que borrar y volver a subir todo a mano.
//
// Es conservador: si la versión nueva no es al menos un 15% más liviana, deja
// la original. Recomprimir un JPG ya comprimido degrada la imagen sin ganar
// peso, y hacerlo repetidamente la arruina.
import { optimizar, miniatura, generarTamanos } from './imagen'
import { uploadImage, uploadBannerImage, subirTamanos } from './storage'
import { esDeStorage, rutaEnBucket } from './urls'
import { supabase } from './supabase'
import { updateBanner } from './bannersAdmin'
import { updateProduct } from './productosAdmin'

const MEJORA_MINIMA = 0.15

/** Baja una imagen de Storage y la devuelve como File, para poder optimizarla. */
async function bajarComoArchivo(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const blob = await res.blob()
  const nombre = decodeURIComponent(url.split('/').pop().split('?')[0])
  return new File([blob], nombre, { type: blob.type })
}

async function borrarDe(bucket, url) {
  const ruta = rutaEnBucket(url, bucket)
  if (ruta) await supabase.storage.from(bucket).remove([ruta])
}

/**
 * Reprocesa los banners. Devuelve cuántos cambió y cuántos bytes ahorró.
 * `onCada(hechos, total)` para el progreso.
 */
export async function reoptimizarBanners(items, onCada) {
  let cambiados = 0
  let ahorro = 0
  let hechos = 0
  const fallados = []

  for (const b of items) {
    try {
      if (!esDeStorage(b.url)) continue
      // eslint-disable-next-line no-await-in-loop
      const archivo = await bajarComoArchivo(b.url)
      // eslint-disable-next-line no-await-in-loop
      const { blob, nombre } = await optimizar(archivo)
      if (blob.size > archivo.size * (1 - MEJORA_MINIMA)) {
        // Ya pesaba bien, pero puede faltarle la miniatura o los tamaños del
        // srcset, que es lo que de verdad achica la pagina.
        const parche = {}
        if (!b.blur) {
          // eslint-disable-next-line no-await-in-loop
          const soloBlur = await miniatura(archivo)
          if (soloBlur) parche.blur = soloBlur
        }
        if (!b.anchos?.length) {
          // eslint-disable-next-line no-await-in-loop
          const anchos = await subirTamanos('banners', b.url, await generarTamanos(archivo))
          if (anchos.length) parche.anchos = anchos
        }
        // eslint-disable-next-line no-await-in-loop
        if (Object.keys(parche).length) await updateBanner(b.id, parche)
        continue
      }

      // eslint-disable-next-line no-await-in-loop
      const nuevaUrl = await uploadBannerImage(blob, nombre)
      // eslint-disable-next-line no-await-in-loop
      const blur = await miniatura(blob)
      // eslint-disable-next-line no-await-in-loop
      const anchos = await subirTamanos('banners', nuevaUrl, await generarTamanos(blob))
      // eslint-disable-next-line no-await-in-loop
      await updateBanner(b.id, { url: nuevaUrl, blur, anchos })
      // eslint-disable-next-line no-await-in-loop
      await borrarDe('banners', b.url)
      ahorro += archivo.size - blob.size
      cambiados++
    } catch (e) {
      fallados.push(e.message)
    } finally {
      onCada?.(++hechos, items.length)
    }
  }
  return { cambiados, ahorro, fallados }
}

/** Lo mismo para las fotos de producto. */
export async function reoptimizarProductos(items, onCada) {
  let cambiados = 0
  let ahorro = 0
  let hechos = 0
  const fallados = []
  const total = items.reduce((n, p) => n + (p.imagenes?.length || 0), 0)

  for (const p of items) {
    const nuevas = []
    let tocado = false
    let anchosProducto = []
    for (const url of p.imagenes || []) {
      try {
        if (!esDeStorage(url)) {
          nuevas.push(url)
          continue
        }
        // eslint-disable-next-line no-await-in-loop
        const archivo = await bajarComoArchivo(url)
        // eslint-disable-next-line no-await-in-loop
        const { blob, nombre } = await optimizar(archivo)
        if (blob.size > archivo.size * (1 - MEJORA_MINIMA)) {
          // La foto ya pesaba bien, pero igual hay que generarle los tamaños
          // del srcset: es lo que baja la pagina de 4,3 MB a ~0,3 MB.
          if (!anchosProducto.length) {
            // eslint-disable-next-line no-await-in-loop
            anchosProducto = await subirTamanos('productos', url, await generarTamanos(archivo))
            if (anchosProducto.length) tocado = true
          }
          nuevas.push(url)
          continue
        }
        // eslint-disable-next-line no-await-in-loop
        const nuevaUrl = await uploadImage(blob, {
          linea: p.linea,
          categoria: p.categoria,
          slug: p.slug,
          nombre,
        })
        nuevas.push(nuevaUrl)
        ahorro += archivo.size - blob.size
        tocado = true
        if (!anchosProducto.length) {
          // eslint-disable-next-line no-await-in-loop
          anchosProducto = await subirTamanos('productos', nuevaUrl, await generarTamanos(blob))
        }
        // eslint-disable-next-line no-await-in-loop
        await borrarDe('productos', url)
      } catch (e) {
        nuevas.push(url)
        fallados.push(e.message)
      } finally {
        onCada?.(++hechos, total)
      }
    }
    if (tocado) {
      // eslint-disable-next-line no-await-in-loop
      await updateProduct(p.id, {
        imagenes: nuevas,
        ...(anchosProducto.length ? { anchos: anchosProducto } : {}),
      })
      cambiados++
    }
  }
  return { cambiados, ahorro, fallados }
}
