import { Download, ArrowUpRight } from 'lucide-react'
import { urlServida } from '../lib/urls.js'

export default function ProductCard({ producto, index = 0, onOpen }) {
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
        {img ? (
          <img
            src={urlServida(img)}
            alt={producto.nombre}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[600ms] ease-out-expo group-hover:scale-[1.06]"
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
