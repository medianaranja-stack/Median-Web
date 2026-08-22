import { useState } from 'react'

// Logos oficiales de Media Naranja (en app/public/).
//   • logo-clean.png → corazón + "media naranja" en ROJO (línea Limpieza / default) — 300×252
//   • Logo-home.png  → corazón negro + "media naranja | Home" (línea Hogar) — 398×183
// Si un archivo falta, cae automáticamente al wordmark de respaldo (no rompe la UI).

const SRC = {
  default: { src: '/logo-clean.png', w: 300, h: 252 },
  limpieza: { src: '/logo-clean.png', w: 300, h: 252 },
  hogar: { src: '/Logo-home.png', w: 398, h: 183 },
}

export default function Logo({ variant = 'default', className = '' }) {
  const [failed, setFailed] = useState(false)
  const { src, w, h } = SRC[variant] || SRC.default
  const isHogar = variant === 'hogar'

  if (failed) return <FallbackWordmark variant={variant} className={className} />

  return (
    <img
      src={src}
      alt="Media Naranja"
      width={w}
      height={h}
      data-logo={isHogar ? 'hogar' : 'default'}
      onError={() => setFailed(true)}
      className={`w-auto ${isHogar ? 'h-8 sm:h-9' : 'h-10 sm:h-11'} ${className}`}
      style={{ objectFit: 'contain' }}
    />
  )
}

/* ---- Respaldo textual si el PNG no está disponible ---- */
function FallbackWordmark({ variant, className }) {
  if (variant === 'hogar') {
    return (
      <span className={`inline-flex items-baseline gap-1.5 font-fraunces ${className}`}>
        <span className="text-[1.35em] font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
          media
        </span>
        <span className="text-[1.35em] font-normal italic tracking-tight" style={{ color: 'var(--accent)' }}>
          naranja
        </span>
        <span className="ml-1 self-center text-[0.6em] font-body font-semibold uppercase tracking-[0.25em] text-muted">
          home
        </span>
      </span>
    )
  }
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
