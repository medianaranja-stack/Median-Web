import { createContext, useContext, useEffect, useState } from 'react'
import { isSupabaseEnabled } from './supabase-env'

// El cliente de Supabase pesa 210 KB y solo hace falta para la sesion del
// panel. Se carga bajo demanda: el visitante del sitio publico nunca lo baja.
let clientePromesa = null
function cliente() {
  if (!clientePromesa) clientePromesa = import('./supabase').then((m) => m.supabase)
  return clientePromesa
}

const AuthContext = createContext({ session: null, isAdmin: false, loading: true })

// Estar logueado no alcanza: el usuario tiene que estar en public.admins.
// El servidor ya lo exige vía RLS; esto es para no mostrarle el panel a alguien
// que no puede guardar nada.
async function checkAdmin(session) {
  if (!session) return false
  const { data, error } = await (await cliente()).rpc('is_admin')
  if (error) return false
  return data === true
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setLoading(false)
      return
    }
    let alive = true

    const apply = async (s) => {
      const admin = await checkAdmin(s)
      if (!alive) return
      setSession(s)
      setIsAdmin(admin)
      setLoading(false)
    }

    // El sitio publico no necesita sesion: sin esto cada visitante cargaria el
    // cliente de Supabase solo para preguntar por una sesion que no existe.
    if (!window.location.pathname.startsWith('/admin')) {
      setLoading(false)
      return () => { alive = false }
    }
    let sub = null
    cliente().then((sb) => {
      if (!alive) return
      sb.auth.getSession().then(({ data }) => apply(data.session))
      sub = sb.auth.onAuthStateChange((_e, s) => apply(s)).data
    })
    return () => {
      alive = false
      sub?.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ session, isAdmin, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export async function signIn(email, password) {
  const { error } = await (await cliente()).auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  await (await cliente()).auth.signOut()
}
