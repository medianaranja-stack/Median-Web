import { useState, useEffect, useRef } from 'react'
import { useYaCargada } from '../lib/yaCargada.js'

// Placeholder inline (data URI) — nunca falla, no depende de la red.
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f1ece1'/%3E%3Cpath d='M200 252s-58-35-58-76a25 25 0 0 1 58-17 25 25 0 0 1 58 17c0 41-58 76-58 76z' fill='%23d8d0c0'/%3E%3C/svg%3E"

/**
 * <img> a prueba de balas: si la imagen falla en cargar, cae a `fallback`
 * (por defecto un placeholder que siempre funciona). En producción nunca
 * queda una imagen rota.
 */
export default function SafeImg({ src, alt = '', fallback = PLACEHOLDER, ...rest }) {
  const [cur, setCur] = useState(src || fallback)
  const ref = useRef(null)
  useEffect(() => { setCur(src || fallback) }, [src, fallback])

  // Si la foto ya estaba lista antes de hidratar, su `load` no vuelve a
  // dispararse: hay que avisarle a quien lo espera. Sin esto el banner se
  // quedaba en la vista previa borrosa con la imagen buena ya descargada.
  useYaCargada(
    ref,
    () => rest.onLoad?.(),
    () => {
      if (rest.onError) rest.onError({ currentTarget: ref.current })
      else if (cur !== fallback) setCur(fallback)
    },
  )

  return (
    <img
      ref={ref}
      src={cur}
      alt={alt}
      onError={() => { if (cur !== fallback) setCur(fallback) }}
      {...rest}
    />
  )
}
