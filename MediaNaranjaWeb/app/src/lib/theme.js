// Metadatos por línea/mundo. Los colores reales viven en tokens CSS (index.css)
// aplicados vía [data-linea]; acá guardamos copy, labels y helpers.

export const LINEAS = {
  limpieza: {
    id: 'limpieza',
    nombre: 'Limpieza',
    tagline: 'Aliados de la limpieza desde 1975',
    descripcion:
      'Trapos, microfibras, rejillas y más. Calidad argentina hecha en nuestra planta de Catamarca.',
    heroFrom: '#FFD400',
    heroTo: '#F5B800',
    accent: '#E30613',
    ink: '#141210',
    display: 'font-archivo',
  },
}

export const LINEA_LIST = Object.values(LINEAS)
