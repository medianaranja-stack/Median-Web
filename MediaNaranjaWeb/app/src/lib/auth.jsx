import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseEnabled } from './supabase'

const AuthContext = createContext({ session: null, isAdmin: false, loading: true })

// Estar logueado no alcanza: el usuario tiene que estar en public.admins.
// El servidor ya lo exige vía RLS; esto es para no mostrarle el panel a alguien
// que no puede guardar nada.
async function checkAdmin(session) {
  if (!session) return false
  const { data, error } = await supabase.rpc('is_admin')
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

    supabase.auth.getSession().then(({ data }) => apply(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => apply(s))
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ session, isAdmin, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  await supabase.auth.signOut()
}
