import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, DownloadCloud, Check } from 'lucide-react'
import { registrarProducto, registrarDescarga } from '../lib/analytics.js'
import { urlServida } from '../lib/storage.js'
import { downloadImage, downloadAll, filenameFor } from '../lib/download.js'

export default function ProductModal({ producto, onClose }) {
  // Una apertura de ficha por vez que se abre el modal.
  useEffect(() => { registrarProducto(producto.slug) }, [producto.slug])

  const [active, setActive] = useState(0)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const close = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [close])

  if (!producto) return null
  const imgs = producto.imagenes
  const specs = Object.entries(producto.specs || {}).filter(([, v]) => v)

  const handleOne = async () => {
    setBusy(true)
    await downloadImage(imgs[active], filenameFor(producto, active))
    registrarDescarga(producto.slug)
    setBusy(false)
  }
  const handleAll = async () => {
    setBusy(true)
    await downloadAll(producto)
    registrarDescarga(producto.slug)
    setBusy(false)
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={close} aria-hidden="true" />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={producto.nombre}
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
          style={{ background: 'var(--surface)' }}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow transition-transform hover:scale-105"
            aria-label="Cerrar"
          >
            <X size={18} style={{ color: '#141210' }} />
          </button>

          <div className="grid gap-0 overflow-y-auto overscroll-contain md:grid-cols-[1.1fr_1fr]">
            {/* Galería */}
            <div className="bg-[#f4f1ec] p-4 sm:p-6">
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white">
                <img
                  src={urlServida(imgs[active])}
                  alt={`${producto.nombre} — foto ${active + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              {imgs.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
                  {imgs.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActive(i)}
                      className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors"
                      style={{ borderColor: i === active ? 'var(--accent)' : 'transparent' }}
                      aria-label={`Foto ${i + 1}`}
                    >
                      <img src={urlServida(src)} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col p-5 sm:p-7">
              <span className="chip w-fit" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>
                {producto.categoriaLabel}
              </span>
              <h2 className="display mt-3 text-2xl font-semibold sm:text-3xl">{producto.nombre}</h2>
              {producto.descripcion && (
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-muted">
                  {producto.descripcion}
                </p>
              )}

              {specs.length > 0 && (
                <dl className="mt-5 grid grid-cols-1 gap-x-4 gap-y-2 border-t pt-4 text-sm" style={{ borderColor: 'var(--border)' }}>
                  {specs.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <dt className="capitalize text-muted">{k.toLowerCase()}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-auto space-y-2.5 pt-6">
                <div className="flex gap-2.5">
                  <button type="button" onClick={handleOne} disabled={busy} className="btn btn-ghost flex-1 disabled:opacity-50">
                    <Download size={16} /> Esta foto
                  </button>
                  <button type="button" onClick={handleAll} disabled={busy} className="btn btn-ghost flex-1 disabled:opacity-50">
                    {done ? <Check size={16} /> : <DownloadCloud size={16} />}
                    {done ? 'Listo' : `Todas (${imgs.length})`}
                  </button>
                </div>
                <p className="pt-1 text-center text-xs text-muted">
                  Descargá las fotos para revender. Uso libre para clientes.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
