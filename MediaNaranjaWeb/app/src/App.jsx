import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import LineaPage from './pages/LineaPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import StyleSwitcher from './components/StyleSwitcher.jsx'
import MockAdmin from './components/MockAdmin.jsx'
import { useStyle } from './lib/style.jsx'

const Admin = lazy(() => import('./pages/Admin.jsx'))
const LandingV2 = lazy(() => import('./pages/LandingV2.jsx'))
const LandingV3 = lazy(() => import('./pages/LandingV3.jsx'))
const LandingV4 = lazy(() => import('./pages/LandingV4.jsx'))
const LandingV5 = lazy(() => import('./pages/LandingV5.jsx'))

function Fallback() {
  return (
    <div className="grid min-h-dvh place-items-center text-neutral-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
    </div>
  )
}

function LandingByVersion() {
  const { version } = useStyle()
  if (version === '2') return <LandingV2 />
  if (version === '3') return <LandingV3 />
  if (version === '4') return <LandingV4 />
  if (version === '5') return <LandingV5 />
  return <Landing />
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!pathname.startsWith('/limpieza') && !pathname.startsWith('/hogar')) {
      document.documentElement.removeAttribute('data-linea')
    }
  }, [pathname])

  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <StyleSwitcher />}
      {!isAdmin && <MockAdmin />}
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<LandingByVersion />} />
          <Route path="/limpieza" element={<LineaPage key="limpieza" linea="limpieza" />} />
          <Route path="/limpieza/:categoria" element={<LineaPage key="limpieza" linea="limpieza" />} />
          <Route path="/hogar" element={<LineaPage key="hogar" linea="hogar" />} />
          <Route path="/hogar/:categoria" element={<LineaPage key="hogar" linea="hogar" />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={<LandingByVersion />} />
        </Routes>
      </Suspense>
    </>
  )
}
