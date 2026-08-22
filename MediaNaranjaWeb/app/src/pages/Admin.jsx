import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Trash2, Plus, ImagePlus, Loader2, ShieldAlert, ArrowLeft } from 'lucide-react'
import { isSupabaseEnabled } from '../lib/supabase.js'
import { useAuth, signIn, signOut } from '../lib/auth.jsx'
import { getAllProducts, createProduct, deleteProduct } from '../lib/products.js'
import { uploadImage, slugify } from '../lib/storage.js'
import { LINEAS } from '../lib/theme.js'

export default function Admin() {
  const { session, loading } = useAuth()

  if (!isSupabaseEnabled) return <NotConfigured />
  if (loading)
    return (
      <Centered>
        <Loader2 className="animate-spin" />
      </Centered>
    )
  if (!session) return <Login />
  return <Dashboard email={session.user.email} />
}

/* ---------------- Shells ---------------- */
function Centered({ children }) {
  return <div className="grid min-h-dvh place-items-center bg-[#faf8f4] text-[#141210]">{children}</div>
}

function NotConfigured() {
  return (
    <Centered>
      <div className="max-w-md rounded-2xl border border-[#e9e5df] bg-white p-8 text-center shadow-card">
        <ShieldAlert className="mx-auto text-[#E30613]" />
        <h1 className="mt-4 font-archivo text-2xl font-bold">Panel no configurado</h1>
        <p className="mt-2 text-[#6b6560]">
          Falta conectar Supabase. Completá <code className="rounded bg-[#f4f1ec] px-1">VITE_SUPABASE_URL</code> y{' '}
          <code className="rounded bg-[#f4f1ec] px-1">VITE_SUPABASE_ANON_KEY</code> y volvé a desplegar.
        </p>
        <Link to="/" className="btn btn-ghost mt-6">
          <ArrowLeft size={16} /> Volver al sitio
        </Link>
      </div>
    </Centered>
  )
}

/* ---------------- Login ---------------- */
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      await signIn(email, password)
    } catch (e2) {
      setErr('Email o contraseña incorrectos.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Centered>
      <div className="w-full max-w-sm px-5">
        <div className="rounded-2xl border border-[#e9e5df] bg-white p-8 shadow-card">
          <h1 className="font-archivo text-2xl font-extrabold">Panel Media Naranja</h1>
          <p className="mt-1 text-sm text-[#6b6560]">Ingresá para administrar los productos.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Email">
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Contraseña">
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </Field>
            {err && (
              <p role="alert" className="text-sm font-medium text-[#E30613]">
                {err}
              </p>
            )}
            <button type="submit" disabled={busy} className="btn btn-primary w-full disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : null} Ingresar
            </button>
          </form>
        </div>
        <Link to="/" className="mt-4 block text-center text-sm text-[#6b6560] hover:text-[#141210]">
          ← Volver al sitio
        </Link>
      </div>
      <style>{`.input{width:100%;border:1.5px solid #e9e5df;border-radius:12px;padding:12px 14px;font-size:16px;min-height:48px;background:#fff}.input:focus{outline:none;border-color:#141210}`}</style>
    </Centered>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  )
}

/* ---------------- Dashboard ---------------- */
const emptyForm = { linea: 'limpieza', categoria: '', categoriaLabel: '', nombre: '', descripcion: '' }

function Dashboard({ email }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [files, setFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  const load = () =>
    getAllProducts()
      .then(setItems)
      .catch((e) => setMsg({ type: 'err', text: e.message }))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const catsForLinea = [...new Set(items.filter((i) => i.linea === form.linea).map((i) => `${i.categoria}|${i.categoriaLabel}`))]

  const submit = async (e) => {
    e.preventDefault()
    if (!form.nombre || !form.categoriaLabel) {
      setMsg({ type: 'err', text: 'Completá nombre y categoría.' })
      return
    }
    setSaving(true)
    setMsg(null)
    try {
      const slug = slugify(form.nombre)
      const categoria = form.categoria || slugify(form.categoriaLabel)
      const imagenes = []
      for (const f of files) {
        // eslint-disable-next-line no-await-in-loop
        const url = await uploadImage(f, { linea: form.linea, categoria, slug })
        imagenes.push(url)
      }
      await createProduct({
        linea: form.linea,
        categoria,
        categoriaLabel: form.categoriaLabel,
        nombre: form.nombre,
        slug,
        descripcion: form.descripcion,
        specs: {},
        imagenes,
        comprarUrl: LINEAS[form.linea].comprarUrl,
        orden: items.length,
      })
      setForm(emptyForm)
      setFiles([])
      setMsg({ type: 'ok', text: 'Producto agregado.' })
      load()
    } catch (e2) {
      setMsg({ type: 'err', text: e2.message })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await deleteProduct(p.id)
      setItems((xs) => xs.filter((x) => x.id !== p.id))
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    }
  }

  return (
    <div className="min-h-dvh bg-[#faf8f4] text-[#141210]">
      <header className="sticky top-0 z-20 border-b border-[#e9e5df] bg-white/90 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <div>
            <h1 className="font-archivo text-lg font-extrabold leading-none">Panel Media Naranja</h1>
            <p className="text-xs text-[#6b6560]">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn btn-ghost !py-2 !px-4">Ver sitio</Link>
            <button onClick={signOut} className="btn btn-ghost !py-2 !px-4">
              <LogOut size={15} /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="container-x grid gap-8 py-8 lg:grid-cols-[380px_1fr]">
        {/* Form alta */}
        <section className="h-fit rounded-2xl border border-[#e9e5df] bg-white p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 font-archivo text-lg font-bold">
            <Plus size={18} /> Nuevo producto
          </h2>
          <form onSubmit={submit} className="mt-4 space-y-4">
            <Field label="Línea">
              <div className="grid grid-cols-2 gap-2">
                {['limpieza', 'hogar'].map((l) => (
                  <button
                    type="button"
                    key={l}
                    onClick={() => setForm((f) => ({ ...f, linea: l, categoria: '', categoriaLabel: '' }))}
                    className="rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize transition-colors"
                    style={{
                      borderColor: form.linea === l ? '#141210' : '#e9e5df',
                      background: form.linea === l ? '#141210' : '#fff',
                      color: form.linea === l ? '#fff' : '#141210',
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Categoría">
              <input
                list="cats"
                value={form.categoriaLabel}
                onChange={(e) => {
                  const v = e.target.value
                  const match = catsForLinea.find((c) => c.split('|')[1] === v)
                  setForm((f) => ({ ...f, categoriaLabel: v, categoria: match ? match.split('|')[0] : '' }))
                }}
                placeholder="Ej: Microfibras…"
                className="input"
                autoComplete="off"
                required
              />
              <datalist id="cats">
                {catsForLinea.map((c) => (
                  <option key={c} value={c.split('|')[1]} />
                ))}
              </datalist>
            </Field>

            <Field label="Nombre">
              <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className="input" autoComplete="off" required />
            </Field>

            <Field label="Descripción">
              <textarea
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                className="input resize-none"
              />
            </Field>

            <Field label="Fotos">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#d9d3ca] px-4 py-6 text-sm font-medium text-[#6b6560] transition-colors hover:border-[#141210]">
                <ImagePlus size={18} />
                {files.length ? `${files.length} foto(s) seleccionada(s)` : 'Elegir fotos'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles([...e.target.files])}
                />
              </label>
            </Field>

            {msg && (
              <p role="alert" className={`text-sm font-medium ${msg.type === 'ok' ? 'text-green-700' : 'text-[#E30613]'}`}>
                {msg.text}
              </p>
            )}

            <button type="submit" disabled={saving} className="btn btn-primary w-full disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {saving ? 'Guardando…' : 'Agregar producto'}
            </button>
          </form>
        </section>

        {/* Lista */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-archivo text-lg font-bold">Productos ({items.length})</h2>
          </div>
          {loading ? (
            <Centered>
              <Loader2 className="animate-spin" />
            </Centered>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((p) => (
                <div key={p.id} className="flex gap-3 rounded-xl border border-[#e9e5df] bg-white p-3 shadow-sm">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f4f1ec]">
                    {p.imagenes[0] && <img src={p.imagenes[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.nombre}</p>
                    <p className="text-xs capitalize text-[#6b6560]">
                      {p.linea} · {p.categoriaLabel}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(p)}
                    className="grid h-9 w-9 shrink-0 place-items-center self-center rounded-full text-[#E30613] transition-colors hover:bg-red-50"
                    aria-label={`Eliminar ${p.nombre}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <style>{`.input{width:100%;border:1.5px solid #e9e5df;border-radius:12px;padding:11px 13px;font-size:15px;min-height:46px;background:#fff}.input:focus{outline:none;border-color:#141210}`}</style>
    </div>
  )
}
