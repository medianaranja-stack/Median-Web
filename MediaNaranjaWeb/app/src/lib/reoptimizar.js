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
import { uploadImage, uploadBannerImage, subirTamanos, precalentar, variantesDe } from './storage'
import { esDeStorage, rutaEnBucket } from './urls'
import { supabase } from './supabase'
import { updateBanner } from './bannersAdmin'
import { updateProduct } from './productosAdmin'

const MEJORA_MINIMA = 0.15

/**
 * Anchos que existen en TODAS las fotos del producto. `anchos` es una sola
 * lista para el producto entero, asi que declarar uno que solo tenga la primera
 * foto deja a las demas apuntando a archivos que no existen.
 * null significa "todavia no se miro ninguna".
 */
function interseccion(actual, nuevos) {
  if (actual === null) return nuevos
  return actual.filter((w) => nuevos.includes(w))
}

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
  const aCalentar = []
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
        if (parche.anchos) aCalentar.push(...variantesDe(b.url, parche.anchos))
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
      aCalentar.push(...variantesDe(nuevaUrl, anchos))
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
  await precalentar(aCalentar)
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
    // Los tamaños se generan para CADA foto. `anchos` describe al producto, asi
    // que solo puede quedar en la interseccion: un ancho que exista en todas.
    // Si una foto no lo tiene, su srcset apuntaria a un archivo inexistente.
    let anchosComunes = null
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
          // La foto ya pesaba bien, pero igual necesita sus tamaños: es lo que
          // baja la pagina de 4,3 MB a ~0,3 MB.
          // eslint-disable-next-line no-await-in-loop
          const w = await subirTamanos('productos', url, await generarTamanos(archivo))
          anchosComunes = interseccion(anchosComunes, w)
          if (w.length) tocado = true
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
        // eslint-disable-next-line no-await-in-loop
        const w = await subirTamanos('productos', nuevaUrl, await generarTamanos(blob))
        anchosComunes = interseccion(anchosComunes, w)
        // eslint-disable-next-line no-await-in-loop
        await borrarDe('productos', url)
      } catch (e) {
        nuevas.push(url)
        fallados.push(e.message)
        // Si no se pudo procesar, no se puede prometer ningun ancho para ella.
        anchosComunes = []
      } finally {
        onCada?.(++hechos, total)
      }
    }
    if (tocado) {
      // eslint-disable-next-line no-await-in-loop
      await updateProduct(p.id, {
        imagenes: nuevas,
        anchos: anchosComunes || [],
      })
      cambiados++
    }
  }
  return { cambiados, ahorro, fallados }
}
