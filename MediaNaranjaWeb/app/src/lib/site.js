// Datos de contacto / marca. Editá estos valores con los reales de Media Naranja.
export const SITE = {
  tienda: 'https://www.medianaranja.store',
  // ⚠️ DUMMIES — reemplazar por los datos reales:
  email: 'dummy@medianaranja.com.ar',
  whatsapp: '5491111111111', // 11 1111 1111 (formato internacional AR). Vacío = oculta el botón.
  whatsappDisplay: '11 1111 1111',
  instagram: 'https://www.instagram.com/medianaranja',
  facebook: 'https://www.facebook.com/medianaranja',
  planta: {
    ciudad: 'Valle Viejo, Catamarca',
    pais: 'Argentina',
  },
  fundacion: 1975,
}

export const waLink = (msg = 'Hola! Quería consultar por los productos de Media Naranja.') =>
  SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}` : null
