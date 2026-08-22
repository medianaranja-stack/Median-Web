// Corazón de marca Media Naranja (motivo reutilizable).
export default function HeartMark({ className = '', fill = '#E30613', stroke, strokeWidth = 0 }) {
  return (
    <svg viewBox="0 0 100 92" className={className} fill="none" aria-hidden="true">
      <path
        d="M50 88C50 88 6 61.5 6 30.5C6 15.9 17.4 6 30 6C39 6 46.4 11.2 50 19C53.6 11.2 61 6 70 6C82.6 6 94 15.9 94 30.5C94 61.5 50 88 50 88Z"
        fill={stroke ? 'none' : fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}
