// Descarga de imágenes individuales (para revendedores).

export function filenameFor(producto, index) {
  const base = `medianaranja-${producto.slug}-${index + 1}`
  return base.replace(/[^a-z0-9-]/gi, '').toLowerCase()
}

export async function downloadImage(url, filename) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('fetch failed')
    const blob = await res.blob()
    const ext = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
    triggerBlob(blob, `${filename}.${ext}`)
  } catch {
    // Fallback: abrir en nueva pestaña si el fetch falla (CORS, etc.)
    window.open(url, '_blank', 'noopener')
  }
}

export async function downloadAll(producto) {
  for (let i = 0; i < producto.imagenes.length; i++) {
    // pequeño delay para no disparar todas las descargas a la vez
    // eslint-disable-next-line no-await-in-loop
    await downloadImage(producto.imagenes[i], filenameFor(producto, i))
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 250))
  }
}

function triggerBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
