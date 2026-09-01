import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase es opcional: si no hay credenciales, la web funciona con el seed local
// (modo catálogo estático) y el panel admin queda deshabilitado.
export const isSupabaseEnabled = Boolean(url && anonKey)

export const supabase = isSupabaseEnabled
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

/**
 * Corta una consulta que no responde. Sin esto, si el proyecto de Supabase está
 * pausado o inalcanzable, la promesa queda colgada y la página se queda con los
 * esqueletos de carga para siempre — que es exactamente lo que parece una web
 * rota. Mejor fallar rápido y mostrar algo.
 */
export function conLimite(promesa, ms = 8000, queFalla = 'la consulta') {
  return Promise.race([
    promesa,
    new Promise((_, rechazar) =>
      setTimeout(() => rechazar(new Error(`No hubo respuesta al cargar ${queFalla}.`)), ms),
    ),
  ])
}
