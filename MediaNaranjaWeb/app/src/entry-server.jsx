// Punto de entrada para dibujar la app fuera del navegador, al construir.
//
// El sitio es una SPA: el HTML que se publicaba traia un <div id="root"> vacio,
// asi que el visitante no veia absolutamente nada hasta que bajaba y se
// ejecutaba React. Medio segundo de pantalla en blanco que ninguna optimizacion
// de imagenes podia arreglar, porque el problema no eran las imagenes.
//
// Esto renderiza las paginas publicas a HTML de verdad al desplegar. El
// navegador pinta apenas llega el documento y React despues lo "hidrata": lo
// adopta y le engancha los eventos, sin volver a dibujarlo.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './lib/auth.jsx'
import { urlServida, srcSetDe } from './lib/urls.js'

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StaticRouter>,
  )
}

/**
 * <link rel="preload"> de la foto de portada.
 *
 * El <img> del banner ya viaja en el HTML, pero esta en el cuerpo: el navegador
 * recien lo descubre cuando termina de parsear todo lo de arriba. Declarado en
 * el <head> lo empieza a bajar de inmediato.
 *
 * Usa los MISMOS helpers que el componente para armar las URLs. Si no
 * coincidieran exactamente, el navegador bajaria la foto dos veces.
 */
export function precargaDePortada(banners) {
  const b = banners?.[0]
  if (!b?.url) return ''
  const sizes = '(max-width: 640px) 100vw, (max-width: 1280px) 800px, 1600px'
  const set = srcSetDe(b.url, b.anchos)
  return set
    ? `<link rel="preload" as="image" imagesrcset="${set}" imagesizes="${sizes}" fetchpriority="high">`
    : `<link rel="preload" as="image" href="${urlServida(b.url)}" fetchpriority="high">`
}
