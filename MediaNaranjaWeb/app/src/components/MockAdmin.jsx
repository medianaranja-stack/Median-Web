import { useEffect, useState, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { User, X, LogOut, Plus, ImagePlus, Check, Trash2, Eye, Megaphone, Package, ChevronUp, ChevronDown } from 'lucide-react'
import seed from '../data/seed.json'
import { addMockProduct, getMockProducts, deleteMockProduct } from '../lib/mockStore.js'
import { getBanner, setBanner, bannerLibrary, resetBanner } from '../lib/bannerStore.js'
import SafeImg from './SafeImg.jsx'

const AUTH_KEY = 'mn-mock-auth'
const slugify = (s) =>
  (s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase()

const CAT_LABELS = {}
seed.productos.forEach((p) => { CAT_LABELS[p.categoria] = p.categoriaLabel })

const SPEC_FIELDS = [
  ['CODIGO', 'Código'], ['MEDIDAS', 'Medidas'], ['EAN13', 'EAN13'],
  ['DUN14', 'DUN14'], ['EMPAQUE', 'Empaque'], ['COMPOSICION', 'Composición'],
]

export default function MockAdmin() {
  const [open, setOpen] = useState(false)
  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem(AUTH_KEY) === 'true' } catch { return false }
  })

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[100] grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-[#141210] text-white shadow-xl transition-transform hover:scale-105"
        aria-label="Acceso administrador"
        title="Admin — cargar productos (demo)"
      >
        <User size={20} />
      </button>
      {open &&
        createPortal(
          <Overlay onClose={() => setOpen(false)}>
            {authed ? (
              <Dashboard onLogout={() => { localStorage.removeItem(AUTH_KEY); setAuthed(false) }} onClose={() => setOpen(false)} />
            ) : (
              <Login onOk={() => { localStorage.setItem(AUTH_KEY, 'true'); setAuthed(true) }} />
            )}
          </Overlay>,
          document.body
        )}
    </>
  )
}

function Overlay({ children, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" className="relative z-10 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white text-[#141210] shadow-2xl sm:rounded-3xl">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/5 transition-colors hover:bg-black/10" aria-label="Cerrar"><X size={18} /></button>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold">{label}</span>{children}</label>
}

function Login({ onOk }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (user.trim() === 'admin' && pass === 'admin') onOk()
    else setErr(true)
  }
  return (
    <div className="p-8 sm:p-10">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#141210] text-white"><User size={26} /></div>
      <h2 className="mt-4 text-center font-archivo text-2xl font-extrabold">Panel Media Naranja</h2>
      <p className="mt-1 text-center text-sm text-neutral-500">Ingresá para cargar productos (demo).</p>
      <form onSubmit={submit} className="mx-auto mt-6 max-w-sm space-y-4">
        <Field label="Usuario"><input value={user} onChange={(e) => setUser(e.target.value)} autoFocus className="mk-input" placeholder="admin" autoComplete="username" /></Field>
        <Field label="Contraseña"><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="mk-input" placeholder="admin" autoComplete="current-password" /></Field>
        {err && <p role="alert" className="text-sm font-medium text-[#E30613]">Usuario o contraseña incorrectos. (admin / admin)</p>}
        <button type="submit" className="w-full rounded-full bg-[#E30613] px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5">Ingresar</button>
        <p className="text-center text-xs text-neutral-400">Demo: usuario <b>admin</b> · contraseña <b>admin</b></p>
      </form>
      <style>{MK_CSS}</style>
    </div>
  )
}

const emptyForm = {
  linea: 'limpieza', categoriaLabel: '', nombre: '', descripcion: '',
  specs: { CODIGO: '', MEDIDAS: '', EAN13: '', DUN14: '', EMPAQUE: '', COMPOSICION: '' },
}

function Dashboard({ onLogout, onClose }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('producto')
  const [form, setForm] = useState(emptyForm)
  const [images, setImages] = useState([]) // dataURLs
  const [done, setDone] = useState(null) // {linea, categoria}
  const [err, setErr] = useState(null)
  const [mine, setMine] = useState(getMockProducts())

  useEffect(() => {
    const h = () => setMine(getMockProducts())
    window.addEventListener('mn-mock-changed', h)
    return () => window.removeEventListener('mn-mock-changed', h)
  }, [])

  const catsForLinea = [...new Set(seed.productos.filter((p) => p.linea === form.linea).map((p) => p.categoriaLabel))]

  const onFiles = (e) => {
    const files = [...e.target.files].slice(0, 5)
    Promise.all(files.map((f) => new Promise((res) => {
      const r = new FileReader()
      r.onload = () => res(r.result)
      r.readAsDataURL(f)
    }))).then((urls) => setImages((prev) => [...prev, ...urls].slice(0, 6)))
  }

  const submit = (e) => {
    e.preventDefault()
    setErr(null)
    if (!form.nombre.trim() || !form.categoriaLabel.trim()) { setErr('Completá al menos Nombre y Categoría.'); return }
    const categoria = slugify(form.categoriaLabel)
    const specs = Object.fromEntries(Object.entries(form.specs).filter(([, v]) => v.trim()))
    const rec = {
      linea: form.linea,
      categoria,
      categoriaLabel: form.categoriaLabel.trim(),
      nombre: form.nombre.trim(),
      slug: slugify(form.nombre) || `producto-${Date.now()}`,
      descripcion: form.descripcion.trim(),
      specs,
      imagenes: images,
      comprarUrl: 'https://www.medianaranja.store',
    }
    try {
      addMockProduct(rec)
      setDone({ linea: form.linea, categoria })
      setForm(emptyForm)
      setImages([])
    } catch (e2) {
      setErr('No se pudo guardar (¿imágenes muy pesadas?). Probá con fotos más chicas.')
    }
  }

  return (
    <div className="flex max-h-[92dvh] flex-col">
      <div className="flex items-center justify-between border-b border-neutral-200 p-5 pr-16">
        <div>
          <h2 className="font-archivo text-lg font-extrabold leading-none">Cargar producto</h2>
          <p className="text-xs text-neutral-500">Ficha completa · demo local</p>
        </div>
        <button onClick={onLogout} className="mr-2 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50"><LogOut size={14} /> Salir</button>
      </div>

      <div className="flex gap-1 border-b border-neutral-200 px-5 pt-3">
        <TabBtn active={tab === 'producto'} onClick={() => setTab('producto')} icon={Package}>Producto</TabBtn>
        <TabBtn active={tab === 'banner'} onClick={() => setTab('banner')} icon={Megaphone}>Novedades</TabBtn>
      </div>

      <div className="overflow-y-auto overscroll-contain p-5 sm:p-6">
        {tab === 'banner' && <BannerEditor />}
        {tab === 'producto' && (<>
        {done && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm">
            <span className="flex items-center gap-2 font-medium text-green-800"><Check size={16} /> ¡Producto cargado! Ya aparece en el catálogo.</span>
            <button onClick={() => { onClose(); navigate(`/${done.linea}/${done.categoria}`) }} className="inline-flex items-center gap-1.5 rounded-full bg-green-700 px-3 py-1.5 text-white"><Eye size={14} /> Verlo en el sitio</button>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Línea">
              <div className="grid grid-cols-2 gap-2">
                {['limpieza', 'hogar'].map((l) => (
                  <button type="button" key={l} onClick={() => setForm((f) => ({ ...f, linea: l, categoriaLabel: '' }))} className="rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize"
                    style={{ borderColor: form.linea === l ? '#141210' : '#e5e5e5', background: form.linea === l ? '#141210' : '#fff', color: form.linea === l ? '#fff' : '#141210' }}>{l}</button>
                ))}
              </div>
            </Field>
            <Field label="Categoría">
              <input list="mk-cats" value={form.categoriaLabel} onChange={(e) => setForm((f) => ({ ...f, categoriaLabel: e.target.value }))} className="mk-input" placeholder="Ej: Microfibras…" autoComplete="off" />
              <datalist id="mk-cats">{catsForLinea.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
          </div>

          <Field label="Nombre del producto"><input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className="mk-input" placeholder="Ej: Trapo Compacto Gris Grande…" autoComplete="off" /></Field>

          <Field label="Descripción"><textarea rows={3} value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} className="mk-input resize-none" placeholder="Súper absorbente • Liviano…" /></Field>

          <div>
            <span className="mb-2 block text-sm font-semibold">Ficha técnica</span>
            <div className="grid gap-3 sm:grid-cols-2">
              {SPEC_FIELDS.map(([k, label]) => (
                <label key={k} className="block">
                  <span className="mb-1 block text-xs font-medium text-neutral-500">{label}</span>
                  <input value={form.specs[k]} onChange={(e) => setForm((f) => ({ ...f, specs: { ...f.specs, [k]: e.target.value } }))} className="mk-input" autoComplete="off" />
                </label>
              ))}
            </div>
          </div>

          <Field label="Fotos del producto">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 px-4 py-6 text-sm font-medium text-neutral-500 transition-colors hover:border-[#141210]">
              <ImagePlus size={18} /> {images.length ? `${images.length} foto(s) — agregar más` : 'Elegir fotos'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
            </label>
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((src, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-neutral-200">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => setImages((xs) => xs.filter((_, j) => j !== i))} className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white" aria-label="Quitar"><X size={11} /></button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          {err && <p role="alert" className="text-sm font-medium text-[#E30613]">{err}</p>}

          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E30613] px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"><Plus size={16} /> Cargar producto</button>
        </form>

        {mine.length > 0 && (
          <div className="mt-8 border-t border-neutral-200 pt-5">
            <p className="mb-3 text-sm font-semibold">Cargados en esta demo ({mine.length})</p>
            <div className="space-y-2">
              {mine.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg border border-neutral-200 p-2">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-neutral-100">{p.imagenes?.[0] && <img src={p.imagenes[0]} alt="" className="h-full w-full object-cover" />}</div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{p.nombre}</p><p className="text-xs capitalize text-neutral-500">{p.linea} · {p.categoriaLabel}</p></div>
                  <button onClick={() => deleteMockProduct(p.id)} className="grid h-8 w-8 place-items-center rounded-full text-[#E30613] hover:bg-red-50" aria-label="Eliminar"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
        </>)}
      </div>
      <style>{MK_CSS}</style>
    </div>
  )
}

function TabBtn({ active, onClick, icon: Icon, children }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors"
      style={{ borderColor: active ? '#E30613' : 'transparent', color: active ? '#141210' : '#8a8a86' }}>
      <Icon size={15} /> {children}
    </button>
  )
}

let _sid = 0
const newId = () => `s${Date.now()}_${_sid++}`

function BannerEditor() {
  const [b, setB] = useState(getBanner())
  const [saved, setSaved] = useState(false)
  const lib = useMemo(bannerLibrary, [])
  const save = () => { setBanner(b); setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const add = (src) => setB((x) => ({ ...x, slides: [...x.slides, { id: newId(), src, title: '' }] }))
  const onFile = (e) => {
    const files = [...e.target.files]
    files.forEach((f) => { const r = new FileReader(); r.onload = () => add(r.result); r.readAsDataURL(f) })
    e.target.value = ''
  }
  const move = (i, dir) => setB((x) => {
    const s = [...x.slides]; const j = i + dir
    if (j < 0 || j >= s.length) return x
    ;[s[i], s[j]] = [s[j], s[i]]; return { ...x, slides: s }
  })
  const remove = (i) => setB((x) => ({ ...x, slides: x.slides.filter((_, k) => k !== i) }))
  const setTitle = (i, t) => setB((x) => ({ ...x, slides: x.slides.map((s, k) => k === i ? { ...s, title: t } : s) }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">Carrusel del <b>banner principal</b> (v5). Ordenalo, agregá productos, fábrica o subí tus imágenes.</p>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={b.active} onChange={(e) => setB((x) => ({ ...x, active: e.target.checked }))} className="h-4 w-4 accent-[#E30613]" />
        Mostrar el banner
      </label>

      {/* slides actuales, ordenables */}
      <div>
        <p className="mb-2 text-sm font-semibold">Slides del carrusel ({b.slides.length})</p>
        <div className="space-y-2">
          {b.slides.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-2">
              <span className="w-5 text-center text-xs font-bold text-neutral-400">{i + 1}</span>
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-neutral-100"><SafeImg src={s.src} alt="" className="h-full w-full object-cover" /></div>
              <input value={s.title} onChange={(e) => setTitle(i, e.target.value)} placeholder="Título (opcional)" className="mk-input !min-h-0 flex-1 !py-2 text-sm" autoComplete="off" />
              <div className="flex flex-col">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="grid h-5 w-6 place-items-center text-neutral-500 disabled:opacity-25" aria-label="Subir"><ChevronUp size={14} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === b.slides.length - 1} className="grid h-5 w-6 place-items-center text-neutral-500 disabled:opacity-25" aria-label="Bajar"><ChevronDown size={14} /></button>
              </div>
              <button type="button" onClick={() => remove(i)} className="grid h-8 w-8 place-items-center rounded-full text-[#E30613] hover:bg-red-50" aria-label="Quitar"><Trash2 size={15} /></button>
            </div>
          ))}
          {b.slides.length === 0 && <p className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-400">Sin slides. Agregá abajo.</p>}
        </div>
      </div>

      {/* subir propias */}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 px-4 py-4 text-sm font-medium text-neutral-500 transition-colors hover:border-[#141210]">
        <ImagePlus size={18} /> Subir mis imágenes
        <input type="file" accept="image/*" multiple className="hidden" onChange={onFile} />
      </label>

      {/* biblioteca */}
      <BannerLibrary title="Fábrica" items={lib.fabrica} onAdd={add} />
      <BannerLibrary title="Productos" items={lib.productos} onAdd={add} scroll />

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-full bg-[#E30613] px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5">
          {saved ? <Check size={16} /> : <Megaphone size={16} />} {saved ? 'Publicado' : 'Publicar carrusel'}
        </button>
        <button type="button" onClick={() => { if (window.confirm('¿Restablecer el carrusel al set original? Se quitan las imágenes que subiste.')) { resetBanner(); setB(getBanner()) } }}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
          <Trash2 size={14} /> Restablecer
        </button>
      </div>
    </div>
  )
}

function BannerLibrary({ title, items, onAdd, scroll }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title} <span className="font-normal text-neutral-400">— tocá para agregar</span></p>
      <div className={`grid grid-cols-5 gap-2 sm:grid-cols-7 ${scroll ? 'max-h-40 overflow-y-auto overscroll-contain rounded-lg border border-neutral-200 p-2' : ''}`}>
        {items.map((it) => (
          <button key={it.src} type="button" onClick={() => onAdd(it.src)} title={it.label} className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-200 hover:border-[#141210]">
            <SafeImg src={it.src} alt={it.label} loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100"><Plus size={18} /></span>
          </button>
        ))}
      </div>
    </div>
  )
}

const MK_CSS = `.mk-input{width:100%;border:1.5px solid #e5e5e5;border-radius:12px;padding:11px 13px;font-size:15px;min-height:46px;background:#fff;color:#141210}.mk-input:focus{outline:none;border-color:#141210}`
