import { useState } from 'react'

// Logo oficial de Media Naranja: app/public/logo-clean.png (corazón + wordmark
// en rojo) — 300×252. Si el archivo falta, cae al wordmark de respaldo.

export default function Logo({ className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) return <FallbackWordmark className={className} />

  return (
    <img
      src="/logo-clean.png"
      alt="Media Naranja"
      width={300}
      height={252}
      onError={() => setFailed(true)}
      className={`h-10 w-auto sm:h-11 ${className}`}
      style={{ objectFit: 'contain' }}
    />
  )
}

/* ---- Respaldo textual si el PNG no está disponible ---- */
function FallbackWordmark({ className }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-md" style={{ background: '#FFD400' }} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
          <path d="M12 20s-7-4.35-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.65 12 20 12 20Z" fill="#E30613" />
        </svg>
      </span>
      <span className="font-archivo text-[1.2em] font-extrabold leading-none tracking-tight">
        <span style={{ color: 'var(--ink, #141210)' }}>media</span>
        <span style={{ color: '#E30613' }}>naranja</span>
      </span>
    </span>
  )
}
