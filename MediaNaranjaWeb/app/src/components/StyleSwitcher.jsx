import { useStyle, STYLE_META } from '../lib/style.jsx'

// Barra de demo: cambia el estilo de TODO el sitio (1 / 2 / 3).
export default function StyleSwitcher() {
  const { version, setVersion } = useStyle()
  return (
    <div className="fixed left-1/2 top-3 z-[100] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/90 p-1 shadow-lg backdrop-blur-xl dark:border-white/15 dark:bg-black/70">
        <span className="px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Estilo</span>
        {['1', '2', '3', '4', '5'].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVersion(v)}
            aria-pressed={version === v}
            title={`${STYLE_META[v].label} — ${STYLE_META[v].hint}`}
            className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold transition-colors ${
              version === v ? 'bg-[#E30613] text-white' : 'text-neutral-700 hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/10'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
