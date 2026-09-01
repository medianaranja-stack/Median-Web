// Solo la bandera de configuracion. Separada del cliente para que preguntar
// "hay Supabase?" no obligue a cargar la libreria de 210 KB.
export const isSupabaseEnabled = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
)
