import { useEffect } from 'react'

/**
 * Avisa cuando una <img> ya habia terminado de cargar antes de que React la
 * hidratara.
 *
 * Desde que el HTML se dibuja al construir, la foto viene escrita en el
 * documento y el navegador la empieza a bajar mientras parsea — o la saca del
 * cache al instante. Para cuando React hidrata y engancha el `onLoad`, ese
 * evento ya ocurrio, y los eventos del DOM no se repiten.
 *
 * El que esperaba el aviso se queda esperando para siempre. Se vio asi: el
 * banner quedaba en la vista previa borrosa con la foto buena ya bajada, y las
 * tarjetas de producto quedaban en gris con su imagen en opacidad 0.
 *
 * La solucion es no confiar en el evento y preguntarle al elemento como esta:
 * `complete` con `naturalWidth > 0` es una foto lista; `complete` con ancho 0
 * es una que fallo.
 *
 * Corre una sola vez, al montar. De ahi en mas los eventos llegan normalmente,
 * porque el listener ya esta puesto antes de que empiece cualquier carga nueva.
 */
export function useYaCargada(ref, alCargar, alFallar) {
  useEffect(() => {
    const el = ref.current
    if (!el || !el.complete) return
    if (el.naturalWidth > 0) alCargar?.()
    else alFallar?.()
    // Sin dependencias a proposito: es una correccion del arranque, no algo
    // que deba repetirse cuando cambien los handlers.
  }, [])
}
