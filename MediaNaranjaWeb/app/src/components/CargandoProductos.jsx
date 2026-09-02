// Estado de carga de la grilla de productos.
//
// Los esqueletos solos no alcanzan: unos cuadros grises pueden leerse como que
// la pagina esta rota o vacia. El rotulo dice explicitamente que algo esta
// pasando, y los esqueletos reservan el alto para que al llegar las fotos el
// contenido de abajo no salte.
//
// aria-busy + aria-live avisan lo mismo a un lector de pantalla, que no ve la
// animacion.

/** Un punto que late, del rojo de la marca. */
function Punto() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden>
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
        style={{ background: 'var(--accent)' }}
      />
      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--accent)' }} />
    </span>
  )
}

export default function CargandoProductos({ cantidad = 8, columnas = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <p className="mono-label mb-5 flex items-center gap-2.5 text-muted">
        <Punto />
        Cargando productos…
      </p>

      <div className={`grid gap-4 ${columnas}`} aria-hidden>
        {Array.from({ length: cantidad }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="aspect-square w-full animate-pulse" style={{ background: 'var(--border)' }} />
            <div className="space-y-2 p-4">
              <div className="h-3 w-1/2 animate-pulse rounded" style={{ background: 'var(--border)' }} />
              <div className="h-4 w-3/4 animate-pulse rounded" style={{ background: 'var(--border)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
