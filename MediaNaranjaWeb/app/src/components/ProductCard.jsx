import { useEffect, useState } from 'react'
import { Download, ArrowUpRight } from 'lucide-react'
import { urlServida, srcSetDe } from '../lib/urls.js'

export default function ProductCard({ producto, index = 0, onOpen }) {
  // Cada tarjeta avisa cuando su foto llego. Sin esto quedan huecos grises
  // desparejos mientras las 12 imagenes van cayendo de a una.
  //
  // Nota: estas fotos NO llevan fetchPriority="low". Se probo y fue un error:
  // loading="lazy" ya alcanza para que no le compitan al banner, y al entrar en
  // pantalla el navegador les sube la prioridad solo. Sumarle prioridad baja las
  // dejaba en gris mientras el visitante las estaba mirando.
  const [cargada, setCargada] = useState(false)
  // Un esqueleto que late para siempre miente: dice "cargando" cuando en
  // realidad la foto no va a llegar. Pasado un limite se deja de latir y se
  // muestra un estado quieto, que se lee como "esto no cargo" y no como
  // "espera un poco mas".
  const [seRindio, setSeRindio] = useState(false)

  useEffect(() => {
    if (cargada) return
    const t = setTimeout(() => setSeRindio(true), 8000)
    return () => clearTimeout(t)
  }, [cargada])
  const img = producto.imagenes[0]
  const n = String(index + 1).padStart(2, '0')
  return (
    <article className="group card-depth relative overflow-hidden">
      <button
        type="button"
        onClick={() => onOpen(producto)}
        className="relative block aspect-square w-full overflow-hidden"
        aria-label={`Ver ${producto.nombre}`}
      >
        {/* índice técnico */}
        <span className="mono-label absolute left-3 top-3 z-10 rounded-full bg-black/45 px-2 py-1 text-white/90 backdrop-blur">
          {n}
        </span>
        {/* Esqueleto mientras la foto baja. Usa var(--border) y no un gris
            propio: #efece5 sobre el fondo #f4f4f2 casi no se distingue y la
            grilla se leia vacia en vez de cargando. */}
        {img && !cargada && !seRindio && (
          <div aria-hidden className="absolute inset-0 animate-pulse" style={{ background: 'var(--border)' }} />
        )}

        {/* Ya no esta cargando: quieto, sin latir, y con el logo tenue para que
            se lea como una foto que falta y no como una tarjeta rota. */}
        {img && !cargada && seRindio && (
          <div
            className="absolute inset-0 grid place-items-center"
            style={{ background: 'var(--border)' }}
            title="No se pudo cargar la foto"
          >
            <img src="/logo-clean.png" alt="" width={300} height={252} className="h-8 w-auto opacity-25" />
          </div>
        )}
        {img ? (
          /* La tarjeta mide ~300px en escritorio y media pantalla en celular:
             con `sizes` el navegador pide la version chica, no la de 1800px. */
          <img
            src={urlServida(img)}
            srcSet={srcSetDe(img, producto.anchos) || undefined}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 300px"
            alt={producto.nombre}
            loading="lazy"
            decoding="async"
            onLoad={() => setCargada(true)}
            onError={(e) => {
              // Si falta la version del srcset, reintentar con el original.
              if (e.currentTarget.srcset) {
                e.currentTarget.srcset = ''
                e.currentTarget.src = urlServida(img)
                return
              }
              // La foto no llego. Marcar `cargada` la mostraria rota a
              // opacidad 1: lo correcto es pasar al estado quieto.
              setSeRindio(true)
            }}
            className={`h-full w-full object-cover transition-[transform,opacity] duration-[600ms] ease-out-expo group-hover:scale-[1.06] ${cargada ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted">Sin foto</div>
        )}
        {/* velo inferior para profundidad */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {producto.imagenes.length > 1 && (
          <span className="mono-label absolute bottom-3 left-3 z-10 rounded-full bg-black/45 px-2 py-1 text-white/90 backdrop-blur">
            {producto.imagenes.length} fotos
          </span>
        )}
        <span className="absolute right-3 top-3 z-10 grid h-9 w-9 translate-y-1 place-items-center rounded-full bg-white/90 opacity-0 shadow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={16} style={{ color: 'var(--ink)' }} />
        </span>
      </button>

      <div className="flex items-start justify-between gap-2 p-4">
        <div className="min-w-0">
          <span className="mono-label text-muted">{producto.categoriaLabel}</span>
          <h3 className="display mt-1 truncate text-[17px] font-semibold" title={producto.nombre}>
            {producto.nombre}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onOpen(producto)}
          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors"
          style={{ borderColor: 'var(--border)' }}
          aria-label={`Descargar fotos de ${producto.nombre}`}
          title="Descargar fotos"
        >
          <Download size={16} style={{ color: 'var(--accent)' }} />
        </button>
      </div>
    </article>
  )
}
