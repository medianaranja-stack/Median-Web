// Reconstruye el sitio una vez por dia.
//
// Hace falta por dos motivos:
//
// 1. Desde que las paginas publicas se dibujan al construir, el HTML se congela
//    en cada despliegue. El visitante ve lo actual igual (cada pagina revalida
//    contra la base al montar), pero Google y las vistas previas de WhatsApp o
//    Facebook NO ejecutan JavaScript: se quedan con la version del ultimo
//    despliegue. Reconstruyendo a diario, eso nunca tiene mas de 24 h.
//
// 2. Mantiene Supabase despierto. El plan gratuito pausa el proyecto tras una
//    semana sin actividad, y al pausarse el sitio se queda sin datos ni
//    imagenes — ya paso una vez. El build consulta la base, asi que nunca se
//    llega a esa semana.
//
// La URL del hook es un secreto y vive SOLO en las variables de entorno de
// Netlify. No lleva el prefijo VITE_ a proposito: con ese prefijo Vite la
// incrustaria en el JavaScript que descarga cualquier visitante, y con esa URL
// se pueden disparar despliegues hasta agotar los minutos de build del plan.
export default async (req) => {
  // Solo el programador de Netlify puede disparar esto.
  //
  // Netlify dice que las funciones programadas no se pueden invocar por HTTP en
  // produccion, pero no conviene apoyar la seguridad en eso: si alguna vez esta
  // URL quedara alcanzable, cualquiera podria pedir reconstrucciones sin parar
  // hasta agotar los minutos de build del plan y dejar al cliente sin poder
  // desplegar. Es exactamente el riesgo por el que se descarto poner un boton
  // en el panel.
  //
  // Las invocaciones programadas traen `next_run` en el cuerpo. Las que no lo
  // traen no son del programador.
  const cuerpo = await req.json().catch(() => null)
  if (!cuerpo?.next_run) {
    return new Response('No disponible', { status: 404 })
  }

  const hook = process.env.BUILD_HOOK_URL

  if (!hook) {
    console.error('BUILD_HOOK_URL no esta configurada: no hay nada que disparar.')
    return new Response('BUILD_HOOK_URL sin configurar', { status: 500 })
  }

  const res = await fetch(hook, { method: 'POST' })

  if (!res.ok) {
    // El cuerpo puede traer el motivo (hook borrado, sitio suspendido, etc.).
    const detalle = await res.text().catch(() => '')
    console.error(`El hook respondio ${res.status}. ${detalle.slice(0, 200)}`)
    return new Response(`El hook respondio ${res.status}`, { status: 502 })
  }

  console.log('Reconstruccion disparada.')
  return new Response('Reconstruccion disparada', { status: 200 })
}

// A las 4 de la mañana UTC, o sea la 1 de la madrugada en Argentina: bien lejos
// de cualquier horario en que el cliente pueda estar cargando productos.
export const config = { schedule: '0 4 * * *' }
