import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './lib/auth.jsx'
import './index.css'

const raiz = document.getElementById('root')

const arbol = (
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

// Las paginas publicas se generan al construir y llegan con el marcado ya
// escrito: ahi hay que HIDRATAR, o sea adoptar ese HTML y engancharle los
// eventos. Si en cambio se renderiza de cero, React borra lo que vino y lo
// vuelve a dibujar, que es exactamente el parpadeo que se quiere evitar.
//
// /admin no se prerenderiza (es privado y no tiene sentido cachearlo), asi que
// ahi la raiz llega vacia y se monta de la forma normal.
if (raiz.hasChildNodes()) {
  hydrateRoot(raiz, arbol)
} else {
  createRoot(raiz).render(arbol)
}
