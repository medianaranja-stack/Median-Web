// Optimización de imágenes antes de subirlas.
//
// El problema que resuelve: una foto de 2400×1000 exportada como PNG pesa
// ~3,8 MB. La misma en WebP pesa ~350 KB. PNG es un formato sin pérdida pensado
// para gráficos con áreas planas; para una foto es la peor opción posible.
//
// Se hace en el navegador antes de subir, y no como un paso manual, porque el
// cliente no tiene por qué saber de formatos: sube lo que le dé su herramienta
// y el panel se encarga.

// El banner se muestra como una franja de 560px de alto como máximo. Una foto
// de 2400px estaba muy sobredimensionada para eso: 1800 alcanza para verse
// nítida hasta en pantallas grandes y pesa la mitad.
const ANCHO_MAX = 1800
const CALIDAD = 0.72

// Anchos que se generan de cada foto. La tarjeta de producto se ve a ~300px y
// el banner a ~1440: mandar 1800px para una miniatura son ~36 veces los pixeles
// que se muestran, y ahi se iba el 97% del peso de la pagina.
export const ANCHOS = [400, 800, 1600]

/** Formatos que ya vienen comprimidos y no conviene volver a tocar si son chicos. */
const YA_LIVIANO = 400 * 1024

function cargarImagen(blob) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })
}

function aBlob(canvas, tipo, calidad) {
  return new Promise((resolve) => canvas.toBlob(resolve, tipo, calidad))
}

/**
 * Devuelve una versión liviana del archivo: como mucho ANCHO_MAX de ancho y en
 * WebP. Si el original ya era chico, o si el resultado no mejora, devuelve el
 * original — comprimir algo ya comprimido sólo degrada la calidad sin ganar peso.
 *
 * Nunca lanza: si algo falla, se sube el archivo tal cual. Que la optimización
 * falle no puede impedir que el cliente cargue una foto.
 */
export async function optimizar(file) {
  try {
    if (!file.type.startsWith('image/')) return { blob: file, nombre: file.name, ahorro: 0 }
    // Los GIF pueden ser animados y el canvas los aplastaría a un solo cuadro.
    if (file.type === 'image/gif') return { blob: file, nombre: file.name, ahorro: 0 }
    if (file.size <= YA_LIVIANO && file.type !== 'image/png') {
      return { blob: file, nombre: file.name, ahorro: 0 }
    }

    const img = await cargarImagen(file)
    const escala = Math.min(1, ANCHO_MAX / img.naturalWidth)
    const w = Math.round(img.naturalWidth * escala)
    const h = Math.round(img.naturalHeight * escala)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, w, h)

    // WebP primero: pesa ~30% menos que JPEG a igual calidad. Safari devuelve un
    // PNG en vez de fallar cuando no lo soporta, de ahí la comprobación del tipo.
    let salida = soportaWebp() ? await aBlob(canvas, 'image/webp', CALIDAD) : null
    if (!salida || salida.type !== 'image/webp') {
      salida = await aBlob(canvas, 'image/jpeg', CALIDAD)
    }
    if (!salida || salida.size >= file.size) {
      return { blob: file, nombre: file.name, ahorro: 0 }
    }

    const ext = salida.type === 'image/webp' ? 'webp' : 'jpg'
    return {
      blob: salida,
      nombre: file.name.replace(/\.[^.]+$/, '') + '.' + ext,
      ahorro: file.size - salida.size,
      antes: file.size,
      despues: salida.size,
    }
  } catch {
    return { blob: file, nombre: file.name, ahorro: 0 }
  }
}

let _webp = null
/** ¿El navegador puede CODIFICAR webp? (poder mostrarlo no implica poder crearlo) */
function soportaWebp() {
  if (_webp === null) {
    const c = document.createElement('canvas')
    c.width = c.height = 1
    _webp = c.toDataURL('image/webp').startsWith('data:image/webp')
  }
  return _webp
}

export function pesoCorto(bytes) {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  return `${Math.round(bytes / 1024)} KB`
}

/**
 * Miniatura borrosa en base64, para mostrar algo mientras baja la foto real.
 *
 * Pesa ~1 KB, asi que viaja dentro de la misma consulta que trae el banner y
 * aparece sin pedir nada extra. Sin esto el visitante mira un hueco durante
 * todo lo que tarda la imagen: el ancho de banda no es el problema, el problema
 * es que la peticion de la imagen no puede ni empezar hasta que responde la base.
 *
 * 24px de ancho alcanza: se muestra estirada y desenfocada por CSS.
 */
export async function miniatura(file) {
  try {
    const img = await cargarImagen(file)
    const w = 24
    const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d').drawImage(img, 0, 0, w, h)
    const uri = canvas.toDataURL('image/jpeg', 0.5)
    // Si por lo que sea salio grande, no vale la pena guardarla en la fila.
    return uri.length > 4000 ? null : uri
  } catch {
    return null
  }
}

/**
 * Genera las versiones chicas de una foto, ademas de la principal.
 * Solo crea las que sean mas chicas que el original: agrandar no tiene sentido.
 * Devuelve [{ ancho, blob, nombre }], listo para subir.
 */
export async function generarTamanos(file) {
  const salida = []
  try {
    const img = await cargarImagen(file)
    const tipo = soportaWebp() ? 'image/webp' : 'image/jpeg'
    const ext = tipo === 'image/webp' ? 'webp' : 'jpg'
    const base = file.name.replace(/\.[^.]+$/, '')

    for (const ancho of ANCHOS) {
      if (ancho >= img.naturalWidth) continue
      const h = Math.round((img.naturalHeight / img.naturalWidth) * ancho)
      const canvas = document.createElement('canvas')
      canvas.width = ancho
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, ancho, h)
      // Las versiones chicas aguantan mas compresion: se ven a menos tamaño.
      // eslint-disable-next-line no-await-in-loop
      const blob = await aBlob(canvas, tipo, ancho <= 400 ? 0.68 : 0.72)
      if (blob) salida.push({ ancho, blob, nombre: `${base}-${ancho}.${ext}` })
    }
  } catch {
    // Que falle generar tamaños no puede impedir subir la foto.
  }
  return salida
}
