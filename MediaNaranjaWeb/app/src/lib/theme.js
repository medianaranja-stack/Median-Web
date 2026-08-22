// Metadatos por línea/mundo. Los colores reales viven en tokens CSS (index.css)
// aplicados vía [data-linea]; acá guardamos copy, labels y helpers.

export const LINEAS = {
  limpieza: {
    id: 'limpieza',
    nombre: 'Limpieza',
    tagline: 'Aliados de la limpieza desde 1975',
    descripcion:
      'Trapos, microfibras, rejillas y más. Calidad argentina hecha en nuestra planta de Catamarca.',
    comprarUrl: 'https://www.medianaranja.store',
    heroFrom: '#FFD400',
    heroTo: '#F5B800',
    accent: '#E30613',
    ink: '#141210',
    display: 'font-archivo',
  },
  hogar: {
    id: 'hogar',
    nombre: 'Hogar',
    tagline: 'Textiles que abrazan tu casa',
    descripcion:
      'Toallas, sábanas, acolchados y mantas. Suavidad premium para el descanso y el día a día.',
    comprarUrl: 'https://www.medianaranja.store',
    heroFrom: '#FAF5F0',
    heroTo: '#EDE3D8',
    accent: '#C08552',
    ink: '#2B2724',
    display: 'font-fraunces',
  },
}

export const LINEA_LIST = Object.values(LINEAS)
