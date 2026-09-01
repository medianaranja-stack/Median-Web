// Piezas de visualización del panel.
//
// Paleta: los dos tonos del gráfico de líneas salieron de correr el validador
// de contraste/daltonismo, no a ojo. El amarillo de marca (#FFD400) no puede
// usarse como color de dato sobre blanco — no llega a 3:1 de contraste — y
// rojo+ámbar es indistinguible para daltonismo deuterano (ΔE 1,9). Rojo + azul
// pasa las seis verificaciones (peor par ΔE 27,3 protan / 36,9 visión normal).
import { useId, useState } from 'react'
import { numero } from '../lib/metricas.js'

export const SERIE = { principal: '#E30613', secundaria: '#1D6FD0' }
const EJE = '#e2ded6'
const TINTA_SUAVE = '#8a837c'

/* ---------------- Número destacado ---------------- */
export function Tarjeta({ etiqueta, valor, detalle, hero }) {
  return (
    <div className="rounded-2xl border border-[#e9e5df] bg-white p-5 shadow-card">
      <p className="text-sm text-[#6b6560]">{etiqueta}</p>
      <p className={`mt-1 font-archivo font-extrabold leading-none ${hero ? 'text-5xl' : 'text-3xl'}`}>
        {numero(valor)}
      </p>
      {detalle && <p className="mt-1.5 text-xs text-[#8a837c]">{detalle}</p>}
    </div>
  )
}

/* ---------------- Barras horizontales ---------------- */
// Una sola serie: un color, sin leyenda (el título ya dice qué se mide).
export function Barras({ datos, formato = numero, vacio = 'Sin datos todavía.' }) {
  if (!datos.length) return <Vacio texto={vacio} />
  const max = Math.max(...datos.map((d) => d.valor)) || 1

  return (
    <ul className="space-y-2.5">
      {datos.map((d) => (
        <li key={d.clave}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-sm text-[#141210]">{d.nombre}</span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-[#141210]">
              {formato(d.valor)}
            </span>
          </div>
          {/* Barra de 10px: fina, punta redondeada, cuadrada contra la línea base. */}
          <div className="mt-1 h-2.5 w-full overflow-hidden rounded-l-sm bg-[#f2efe9]">
            <div
              className="h-full rounded-r"
              style={{ width: `${Math.max((d.valor / max) * 100, 1.5)}%`, background: SERIE.principal }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

/* ---------------- Serie temporal ---------------- */
const W = 760
const H = 220
const PAD = { arriba: 12, derecha: 12, abajo: 26, izquierda: 40 }

export function LineaTiempo({ datos, series }) {
  const id = useId()
  const [activo, setActivo] = useState(null)

  const maxDato = Math.max(1, ...datos.flatMap((d) => series.map((s) => d[s.clave])))
  const max = techoLindo(maxDato)
  const anchoUtil = W - PAD.izquierda - PAD.derecha
  const altoUtil = H - PAD.arriba - PAD.abajo
  const x = (i) => PAD.izquierda + (datos.length === 1 ? anchoUtil / 2 : (i / (datos.length - 1)) * anchoUtil)
  const y = (v) => PAD.arriba + altoUtil - (v / max) * altoUtil

  const ticks = [0, max / 2, max]
  const paso = Math.ceil(datos.length / 7)

  return (
    <figure className="m-0">
      {/* Leyenda: siempre presente con dos o más series. */}
      <figcaption className="mb-3 flex flex-wrap gap-4">
        {series.map((s) => (
          <span key={s.clave} className="flex items-center gap-2 text-sm text-[#6b6560]">
            <span className="h-0.5 w-4 rounded-full" style={{ background: s.color }} aria-hidden />
            {s.nombre}
          </span>
        ))}
      </figcaption>

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label={`Evolución diaria de ${series.map((s) => s.nombre).join(' y ')}`}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.izquierda} x2={W - PAD.derecha} y1={y(t)} y2={y(t)}
                stroke={EJE} strokeWidth="1" vectorEffect="non-scaling-stroke"
              />
              <text x={PAD.izquierda - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={TINTA_SUAVE}>
                {numero(Math.round(t))}
              </text>
            </g>
          ))}

          {datos.map((d, i) =>
            i % paso === 0 ? (
              <text key={d.dia} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill={TINTA_SUAVE}>
                {d.dia.slice(8)}/{d.dia.slice(5, 7)}
              </text>
            ) : null,
          )}

          {series.map((s, iSerie) => (
            <g key={s.clave}>
              {/* Relleno al 10%, sólo en la primera serie: superponer dos velos
                  da un color que no es el de ninguna de las dos. */}
              {iSerie === 0 && (
                <path
                  d={`${ruta(datos, s.clave, x, y)} L ${x(datos.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`}
                  fill={s.color}
                  opacity="0.1"
                />
              )}
              <path
                d={ruta(datos, s.clave, x, y)}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}

          {activo !== null && (
            <>
              <line
                x1={x(activo)} x2={x(activo)} y1={PAD.arriba} y2={H - PAD.abajo}
                stroke={TINTA_SUAVE} strokeWidth="1" vectorEffect="non-scaling-stroke"
              />
              {series.map((s) => (
                // Anillo del color de la superficie: mantiene el punto legible
                // donde se cruza con la otra línea.
                <circle
                  key={s.clave}
                  cx={x(activo)} cy={y(datos[activo][s.clave])} r="5"
                  fill={s.color} stroke="#fff" strokeWidth="2"
                />
              ))}
            </>
          )}

          {/* Zonas de detección anchas: el objetivo es más grande que la marca. */}
          {datos.map((d, i) => (
            <rect
              key={d.dia}
              x={x(i) - anchoUtil / datos.length / 2}
              y={PAD.arriba}
              width={anchoUtil / datos.length}
              height={altoUtil}
              fill="transparent"
              onMouseEnter={() => setActivo(i)}
              onMouseLeave={() => setActivo(null)}
            />
          ))}
        </svg>

        {activo !== null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-[#e9e5df] bg-white px-3 py-2 shadow-card"
            style={{ left: `${(x(activo) / W) * 100}%`, top: '38%' }}
            role="status"
          >
            <p className="text-xs font-semibold">{fechaLarga(datos[activo].dia)}</p>
            {series.map((s) => (
              <p key={s.clave} className="mt-0.5 flex items-center gap-2 whitespace-nowrap text-xs text-[#6b6560]">
                <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} aria-hidden />
                {s.nombre}: <strong className="font-semibold text-[#141210]">{numero(datos[activo][s.clave])}</strong>
              </p>
            ))}
          </div>
        )}
      </div>
      <span id={id} className="sr-only" />
    </figure>
  )
}

function ruta(datos, clave, x, y) {
  return datos.map((d, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(d[clave])}`).join(' ')
}

// Techo del eje en un número redondo pero ajustado: se redondea a media
// magnitud, así un pico de 122 da 150 y no 200 (que dejaría medio gráfico vacío).
function techoLindo(v) {
  const mag = 10 ** Math.floor(Math.log10(v))
  const paso = mag / 2
  return Math.max(paso, Math.ceil(v / paso) * paso)
}

function fechaLarga(iso) {
  const [a, m, d] = iso.split('-')
  return new Date(+a, +m - 1, +d).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
}

export function Vacio({ texto }) {
  return (
    <p className="rounded-xl border border-dashed border-[#d9d3ca] px-5 py-8 text-center text-sm text-[#6b6560]">
      {texto}
    </p>
  )
}
