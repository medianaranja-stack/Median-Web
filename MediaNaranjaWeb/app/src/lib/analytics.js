// Métricas propias. Los eventos van directo a la tabla `eventos` del Supabase
// del cliente: no hay servicio externo de por medio, ningún tercero ve el
// tráfico y la CSP no necesita abrirse a ningún dominio nuevo.
//
// Qué NO se guarda: IP, nombre, mail, ni nada que identifique a una persona.
// Para contar visitantes únicos se usa un número aleatorio que genera el propio
// navegador y queda guardado ahí. O sea que "visitante único" en realidad
// significa "navegador distinto": si alguien entra del celular y de la compu
// cuenta dos veces, y si borra los datos del navegador vuelve a contar como nuevo.
import { supabase, isSupabaseEnabled } from './supabase'

const CLAVE_VISITANTE = 'mn-v'
const CLAVE_SESION = 'mn-s'
const INTERVALO_ENVIO = 10000

let cola = []
let temporizador = null
let iniciado = false

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function idAleatorio() {
  const b = new Uint8Array(12)
  crypto.getRandomValues(b)
  return [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function guardado(almacen, clave) {
  try {
    let v = almacen.getItem(clave)
    if (!v) {
      v = idAleatorio()
      almacen.setItem(clave, v)
    }
    return v
  } catch {
    // Navegación privada o storage bloqueado: se mide igual, pero cada carga
    // cuenta como visitante nuevo.
    return idAleatorio()
  }
}

/** Un admin logueado no debe ensuciar las métricas con sus propias visitas. */
function haySesionAdmin() {
  try {
    return Object.keys(localStorage).some((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))
  } catch {
    return false
  }
}

function medible() {
  if (!isSupabaseEnabled) return false
  if (typeof window === 'undefined') return false
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return false
  if (window.location.pathname.startsWith('/admin')) return false
  if (haySesionAdmin()) return false
  return true
}

function dispositivo() {
  return window.matchMedia('(max-width: 639px)').matches ? 'movil' : 'escritorio'
}

function origen() {
  try {
    if (!document.referrer) return null
    const h = new URL(document.referrer).hostname
    return h === window.location.hostname ? null : h.replace(/^www\./, '')
  } catch {
    return null
  }
}

function encolar(evento) {
  if (!medible()) return
  cola.push({
    ...evento,
    visitante: guardado(localStorage, CLAVE_VISITANTE),
    sesion: guardado(sessionStorage, CLAVE_SESION),
    dispositivo: dispositivo(),
  })
  if (!temporizador) temporizador = setTimeout(enviar, INTERVALO_ENVIO)
}

/**
 * `keepalive` es lo que permite que el último envío sobreviva a que el usuario
 * cierre la pestaña; por eso se usa fetch directo y no supabase-js, que no lo
 * expone.
 */
function enviar() {
  clearTimeout(temporizador)
  temporizador = null
  if (!cola.length) return
  const lote = cola
  cola = []
  try {
    fetch(`${url}/rest/v1/eventos`, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(lote),
    }).catch(() => {})
  } catch {
    // Que fallen las métricas no puede romperle el sitio a nadie.
  }
}

/* ---------- API pública ---------- */

export function registrarVisita() {
  if (iniciado) return
  iniciado = true
  encolar({ tipo: 'visita', origen: origen() })
  // Cuando la pestaña se oculta o se cierra, mandar lo que quede pendiente.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') enviar()
  })
  window.addEventListener('pagehide', enviar)
}

export function registrarProducto(slug) {
  encolar({ tipo: 'producto', ref: slug })
}

export function registrarDescarga(slug) {
  encolar({ tipo: 'descarga', ref: slug })
}

/**
 * Mide cuánto tiempo estuvo cada sección efectivamente a la vista.
 * Esto es lo que responde "qué zona usó más la gente": no alcanza con contar
 * que la sección apareció, porque alguien puede pasarla de largo scrolleando.
 * Sólo suma tiempo mientras la pestaña está activa.
 */
export function medirSecciones(secciones) {
  if (!medible()) return () => {}

  const acumulado = new Map()
  const desde = new Map()

  const arrancar = (id) => { if (!desde.has(id)) desde.set(id, performance.now()) }
  const frenar = (id) => {
    const t0 = desde.get(id)
    if (t0 === undefined) return
    desde.delete(id)
    acumulado.set(id, (acumulado.get(id) || 0) + (performance.now() - t0))
  }

  const nodos = secciones.map((s) => document.getElementById(s.id)).filter(Boolean)
  if (!nodos.length) return () => {}

  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) arrancar(e.target.id)
        else frenar(e.target.id)
      }
    },
    // Un tercio a la vista ya cuenta como "la está mirando".
    { threshold: 0.33 },
  )
  nodos.forEach((n) => obs.observe(n))

  // Si se va a otra pestaña, el reloj se pausa.
  const alCambiarVisibilidad = () => {
    if (document.visibilityState === 'hidden') [...desde.keys()].forEach(frenar)
    else nodos.forEach((n) => { if (enPantalla(n)) arrancar(n.id) })
  }
  document.addEventListener('visibilitychange', alCambiarVisibilidad)

  const volcar = () => {
    [...desde.keys()].forEach(frenar)
    for (const [id, ms] of acumulado) {
      // Menos de un segundo es scroll de paso, no interés.
      if (ms >= 1000) encolar({ tipo: 'seccion', ref: id, ms: Math.round(ms) })
    }
    acumulado.clear()
  }
  window.addEventListener('pagehide', volcar)

  return () => {
    obs.disconnect()
    document.removeEventListener('visibilitychange', alCambiarVisibilidad)
    window.removeEventListener('pagehide', volcar)
    volcar()
    enviar()
  }
}

function enPantalla(n) {
  const r = n.getBoundingClientRect()
  return r.top < window.innerHeight && r.bottom > 0
}
