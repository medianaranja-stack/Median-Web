// Banner carrusel editable (versión 5). Slides ordenables desde el panel admin,
// mezcla de productos, fábrica e imágenes propias.
import seed from '../data/seed.json'

const KEY = 'mn-banner'

function defaultSlides() {
  // Imagen principal al entrar: vista aérea de la planta en Catamarca.
  const aerial = { id: 'f_aerial', src: '/fabrica/planta-a.jpg', title: '' }
  const prod = seed.productos
    .filter((p) => p.linea === 'limpieza' && p.imagenes.length)
    .slice(0, 6)
    .map((p, i) => ({ id: `p${i}`, src: p.imagenes[0], title: '' }))
  const fab = ['/fabrica/planta-b.jpg', '/fabrica/fabrica-2.jpg', '/fabrica/nosotros.jpg']
    .map((s, i) => ({ id: `f${i}`, src: s, title: '' }))
  const rest = []
  const max = Math.max(prod.length, fab.length)
  for (let i = 0; i < max; i++) {
    if (prod[i]) rest.push(prod[i])
    if (fab[i]) rest.push(fab[i])
  }
  return [aerial, ...rest].slice(0, 10)
}

const DEFAULT = { active: true, slides: defaultSlides() }

export function getBanner() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!v || !Array.isArray(v.slides)) return DEFAULT
    return { active: v.active !== false, slides: v.slides.filter((s) => s && s.src) }
  } catch {
    return DEFAULT
  }
}

export function setBanner(b) {
  localStorage.setItem(KEY, JSON.stringify({ active: !!b.active, slides: b.slides || [] }))
  window.dispatchEvent(new Event('mn-banner-changed'))
}

// Vuelve el carrusel al set original (borra slides subidos, ej. imágenes propias).
export function resetBanner() {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new Event('mn-banner-changed'))
}

// biblioteca de imágenes disponibles para agregar al banner
export function bannerLibrary() {
  const productos = seed.productos
    .filter((p) => p.linea === 'limpieza' && p.imagenes.length)
    .map((p) => ({ src: p.imagenes[0], label: p.nombre }))
  const fabrica = [
    { src: '/fabrica/planta-a.jpg', label: 'Planta (aérea)' },
    { src: '/fabrica/planta-b.jpg', label: 'Producción' },
    { src: '/fabrica/fabrica-2.jpg', label: 'Fábrica' },
    { src: '/fabrica/nosotros.jpg', label: 'Media Naranja' },
    { src: '/fabrica/medioambiente.jpg', label: 'Medio ambiente' },
    { src: '/fabrica/hist-2015.jpg', label: 'Histórico' },
  ]
  return { productos, fabrica }
}
