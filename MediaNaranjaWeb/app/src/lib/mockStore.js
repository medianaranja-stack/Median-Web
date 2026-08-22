// Store local (localStorage) de productos cargados desde el mock-admin (personita).
// Para la demo: los productos cargados acá se mezclan con el catálogo (modo seed).
const KEY = 'mn-mock-products'

export function getMockProducts() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function addMockProduct(p) {
  const list = getMockProducts()
  const rec = { ...p, id: `mock-${Date.now()}`, orden: 9000 + list.length, _mock: true }
  list.push(rec)
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event('mn-mock-changed'))
  return rec
}

export function deleteMockProduct(id) {
  const list = getMockProducts().filter((p) => p.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event('mn-mock-changed'))
}

export function clearMockProducts() {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new Event('mn-mock-changed'))
}
