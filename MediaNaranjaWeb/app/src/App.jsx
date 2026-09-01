import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import LineaPage from './pages/LineaPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { registrarVisita } from './lib/analytics.js'

// Sólo el panel se carga aparte: es la única ruta que el visitante no usa.
const Admin = lazy(() => import('./pages/Admin.jsx'))

function Fallback() {
  return (
    <div className="grid min-h-dvh place-items-center text-neutral-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(registrarVisita, [])

  useEffect(() => {
    if (!pathname.startsWith('/limpieza')) {
      document.documentElement.removeAttribute('data-linea')
    }
  }, [pathname])

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/limpieza" element={<LineaPage key="limpieza" linea="limpieza" />} />
          <Route path="/limpieza/:categoria" element={<LineaPage key="limpieza" linea="limpieza" />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    </>
  )
}
