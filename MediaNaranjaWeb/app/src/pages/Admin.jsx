import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LogOut, Trash2, Plus, ImagePlus, Loader2, ShieldAlert, ArrowLeft,
  Package, Images, ChevronUp, ChevronDown, Star, Eye, EyeOff, Info, AlertTriangle, Crop,
  Pencil, X, Check, UploadCloud, BarChart3, Archive, Download, Gauge,
} from 'lucide-react'
import { isSupabaseEnabled } from '../lib/supabase-env.js'
import { useAuth, signIn, signOut } from '../lib/auth.jsx'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../lib/productosAdmin.js'
import { uploadImage, uploadBannerImage, slugify, esDeStorage, borrarImagenesProducto } from '../lib/storage.js'
import {
  getAllBanners, createBanner, deleteBanner, updateBanner, saveOrden, importarRespaldo,
} from '../lib/bannersAdmin.js'
import { moverBanner, hacerPrincipal, RESPALDO } from '../lib/banners.js'
import { fotosEnRepo, pendientesDeMigrar, totalFotosEnRepo, migrarProducto } from '../lib/migracion.js'
import { optimizar, pesoCorto, miniatura } from '../lib/imagen.js'
import { reoptimizarBanners, reoptimizarProductos } from '../lib/reoptimizar.js'
import { cargarMetricas, numero, duracion, fechaCorta } from '../lib/metricas.js'
import { Tarjeta, Barras, LineaTiempo, SERIE } from '../components/Graficos.jsx'
import { planificar, armarZip, descargarBlob, nombreArchivoZip, pesoLegible, descargarUna, descargarProducto } from '../lib/backup.js'

export default function Admin() {
  const { session, isAdmin, loading } = useAuth()

  if (!isSupabaseEnabled) return <NotConfigured />
  if (loading)
    return (
      <Centered>
        <Loader2 className="animate-spin" />
      </Centered>
    )
  if (!session) return <Login />
  if (!isAdmin) return <NoAccess email={session.user.email} />
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

function NoAccess({ email }) {
  return (
    <Centered>
      <div className="max-w-md rounded-2xl border border-[#e9e5df] bg-white p-8 text-center shadow-card">
        <ShieldAlert className="mx-auto text-[#E30613]" />
        <h1 className="mt-4 font-archivo text-2xl font-bold">Sin permisos</h1>
        <p className="mt-2 text-[#6b6560]">
          La cuenta <strong className="font-semibold text-[#141210]">{email}</strong> no tiene acceso al panel.
          Pedile al administrador que te habilite.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={signOut} className="btn btn-ghost">
            <LogOut size={16} /> Cerrar sesión
          </button>
          <Link to="/" className="btn btn-ghost">
            <ArrowLeft size={16} /> Volver al sitio
          </Link>
        </div>
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
          <p className="mt-1 text-sm text-[#6b6560]">Ingresá para administrar el sitio.</p>
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
      <PanelCSS />
    </Centered>
  )
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[#8a837c]">{hint}</span>}
    </label>
  )
}

const TONO_AVISO = {
  ok: 'text-green-700',
  warn: 'text-[#8a5a00]',
  err: 'text-[#E30613]',
}

function Aviso({ msg }) {
  if (!msg) return null
  return (
    <p role="alert" className={`flex items-start gap-1.5 text-sm font-medium ${TONO_AVISO[msg.type] || TONO_AVISO.err}`}>
      {msg.type === 'warn' && <AlertTriangle size={15} className="mt-0.5 shrink-0" />}
      <span>{msg.text}</span>
    </p>
  )
}

/* ---------------- Dashboard ---------------- */
const TABS = [
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'banners', label: 'Banner del home', icon: Images },
  { id: 'metricas', label: 'Métricas', icon: BarChart3 },
  { id: 'backup', label: 'Backup de fotos', icon: Archive },
]

function Dashboard({ email }) {
  const [tab, setTab] = useState('productos')

  return (
    <div className="min-h-dvh bg-[#faf8f4] text-[#141210]">
      <header className="sticky top-0 z-20 border-b border-[#e9e5df] bg-white/90 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <div>
            <h1 className="font-archivo text-lg font-extrabold leading-none">Panel Media Naranja</h1>
            <p className="text-xs text-[#6b6560]">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn btn-ghost !px-4 !py-2">Ver sitio</Link>
            <button onClick={signOut} className="btn btn-ghost !px-4 !py-2">
              <LogOut size={15} /> Salir
            </button>
          </div>
        </div>
        <div className="container-x flex gap-1" role="tablist" aria-label="Secciones del panel">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className="relative flex min-h-[44px] items-center gap-2 px-3 text-sm font-semibold transition-colors"
              style={{ color: tab === id ? '#141210' : '#6b6560' }}
            >
              <Icon size={16} /> {label}
              <span
                aria-hidden
                className="absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-transform duration-200"
                style={{ background: '#E30613', transform: `scaleX(${tab === id ? 1 : 0})` }}
              />
            </button>
          ))}
        </div>
      </header>

      <main className="container-x py-8">
        {tab === 'productos' && <PanelProductos />}
        {tab === 'banners' && <PanelBanners />}
        {tab === 'metricas' && <PanelMetricas />}
        {tab === 'backup' && <PanelBackup />}
      </main>
      <PanelCSS />
    </div>
  )
}

/* ---------------- Productos ---------------- */
// Los mismos campos que ya traen los productos del catálogo, para que lo que
// cargue el cliente quede con la misma ficha técnica que los de ejemplo.
const SPECS = [
  ['CODIGO', 'Código', 'Ej: 81423'],
  ['MEDIDAS', 'Medidas', 'Ej: 30X30cm (c/u)'],
  ['EAN13', 'EAN13', 'Ej: 7790927814233'],
  ['DUN14', 'DUN14', 'Ej: 17790927814230'],
  ['EMPAQUE', 'Empaque', 'Ej: Cajas de 10 unidades'],
  ['COMPOSICION', 'Composición', 'Ej: 80% poliéster + 20% algodón'],
]

const formVacio = {
  categoriaLabel: '',
  categoria: '',
  nombre: '',
  descripcion: '',
  specs: Object.fromEntries(SPECS.map(([k]) => [k, ''])),
}

function PanelProductos() {
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState(null)   // producto en edición, o null = alta
  const [form, setForm] = useState(formVacio)
  const [fotos, setFotos] = useState([])           // URLs ya guardadas (al editar)
  const [files, setFiles] = useState([])           // archivos nuevos por subir
  const [guardando, setGuardando] = useState(false)
  const [bajando, setBajando] = useState(null)
  const [msg, setMsg] = useState(null)
  const formRef = useRef(null)

  const cargar = () =>
    getAllProducts()
      .then(setItems)
      .catch((e) => setMsg({ type: 'err', text: e.message }))
      .finally(() => setCargando(false))

  useEffect(() => { cargar() }, [])

  const categorias = [...new Set(items.map((i) => `${i.categoria}|${i.categoriaLabel}`))]

  const salirDeEdicion = () => {
    setEditando(null)
    setForm(formVacio)
    setFotos([])
    setFiles([])
  }

  const empezarEdicion = (p) => {
    setEditando(p)
    setForm({
      categoriaLabel: p.categoriaLabel || '',
      categoria: p.categoria || '',
      nombre: p.nombre || '',
      descripcion: p.descripcion || '',
      specs: { ...formVacio.specs, ...(p.specs || {}) },
    })
    setFotos(p.imagenes || [])
    setFiles([])
    setMsg(null)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.categoriaLabel.trim()) {
      setMsg({ type: 'err', text: 'Completá nombre y categoría.' })
      return
    }
    setGuardando(true)
    setMsg(null)
    try {
      const slug = slugify(form.nombre)
      const categoria = form.categoria || slugify(form.categoriaLabel)

      const subidas = []
      let ahorroFotos = 0
      for (const f of files) {
        // eslint-disable-next-line no-await-in-loop
        const { blob, nombre, ahorro } = await optimizar(f)
        ahorroFotos += ahorro
        // eslint-disable-next-line no-await-in-loop
        subidas.push(await uploadImage(blob, { linea: 'limpieza', categoria, slug, nombre }))
      }
      // Los specs vacíos no se guardan: la ficha sólo muestra los que tienen valor.
      const specs = Object.fromEntries(
        Object.entries(form.specs).filter(([, v]) => v.trim()).map(([k, v]) => [k, v.trim()]),
      )
      const datos = {
        linea: 'limpieza',
        categoria,
        categoriaLabel: form.categoriaLabel.trim(),
        nombre: form.nombre.trim(),
        slug,
        descripcion: form.descripcion.trim(),
        specs,
        imagenes: [...fotos, ...subidas],
      }

      if (editando) {
        // Las fotos que el usuario sacó de la lista se borran del bucket para
        // no dejar archivos pagando espacio sin que nada los referencie.
        const quitadas = (editando.imagenes || []).filter((u) => !fotos.includes(u))
        await updateProduct(editando.id, datos)
        const sobro = quitadas.length ? await borrarImagenesProducto(quitadas) : null
        setMsg(sobro
          ? { type: 'warn', text: `"${datos.nombre}" se actualizó, pero no se pudieron borrar del Storage ${quitadas.length} foto(s) que quitaste.` }
          : { type: 'ok', text: `"${datos.nombre}" se actualizó.` })
        salirDeEdicion()
      } else {
        await createProduct({ ...datos, orden: items.length })
        setMsg({
          type: 'ok',
          text: `"${datos.nombre}" se agregó al catálogo.` + (ahorroFotos > 0 ? ` Fotos optimizadas: ${pesoCorto(ahorroFotos)} menos.` : ''),
        })
        setForm(formVacio)
        setFiles([])
      }
      cargar()
    } catch (e2) {
      setMsg({
        type: 'err',
        text: e2.message?.includes('productos_ident_key')
          ? 'Ya existe otro producto con ese nombre en esa categoría.'
          : e2.message,
      })
    } finally {
      setGuardando(false)
    }
  }

  const borrar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await deleteProduct(p.id)
      const sobro = await borrarImagenesProducto(p.imagenes)
      setItems((xs) => xs.filter((x) => x.id !== p.id))
      if (sobro) setMsg({ type: 'warn', text: `Se eliminó "${p.nombre}", pero sus fotos quedaron en el Storage.` })
      if (editando?.id === p.id) salirDeEdicion()
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    }
  }

  // Una foto baja directo; varias van en un ZIP con el nombre del producto.
  const bajarProducto = async (p) => {
    setBajando(p.id)
    setMsg(null)
    try {
      const { fallados } = await descargarProducto(p)
      if (fallados.length) setMsg({ type: 'warn', text: `Faltaron ${fallados.length} foto(s) de "${p.nombre}".` })
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    } finally {
      setBajando(null)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
      <section
        ref={formRef}
        className="h-fit scroll-mt-32 rounded-2xl border bg-white p-6 shadow-card lg:sticky lg:top-32"
        style={{ borderColor: editando ? '#141210' : '#e9e5df' }}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="flex items-center gap-2 font-archivo text-lg font-bold">
            {editando ? <Pencil size={18} /> : <Plus size={18} />}
            {editando ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          {editando && (
            <button type="button" onClick={salirDeEdicion} className="text-sm font-semibold text-[#6b6560] hover:text-[#141210]">
              Cancelar
            </button>
          )}
        </div>
        {editando && <p className="mt-1 truncate text-sm text-[#6b6560]">{editando.nombre}</p>}

        <form onSubmit={submit} className="mt-4 space-y-4">
          <Field label="Categoría" hint="Elegí una existente o escribí una nueva.">
            <input
              list="cats"
              value={form.categoriaLabel}
              onChange={(e) => {
                const v = e.target.value
                const match = categorias.find((c) => c.split('|')[1] === v)
                setForm((f) => ({ ...f, categoriaLabel: v, categoria: match ? match.split('|')[0] : '' }))
              }}
              placeholder="Ej: Microfibras"
              className="input"
              autoComplete="off"
              required
            />
            <datalist id="cats">
              {categorias.map((c) => (
                <option key={c} value={c.split('|')[1]} />
              ))}
            </datalist>
          </Field>

          <Field label="Nombre">
            <input
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              placeholder="Ej: Multiuso"
              className="input"
              autoComplete="off"
              required
            />
          </Field>

          <Field label="Descripción" hint="Cada renglón se muestra como una línea en la ficha.">
            <textarea
              rows={5}
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              placeholder={'MICROFIBRAS\nMULTIUSO\nSuper absorbente • Ultra resistente.'}
              className="input resize-y"
            />
          </Field>

          <fieldset className="rounded-xl border border-[#e9e5df] p-4">
            <legend className="px-1.5 text-sm font-semibold">Ficha técnica</legend>
            <p className="mb-3 text-xs text-[#8a837c]">Opcionales: los que dejes vacíos no aparecen.</p>
            <div className="space-y-3">
              {SPECS.map(([key, label, ph]) => (
                <Field key={key} label={label}>
                  <input
                    value={form.specs[key]}
                    onChange={(e) => setForm((f) => ({ ...f, specs: { ...f.specs, [key]: e.target.value } }))}
                    placeholder={ph}
                    className="input"
                    autoComplete="off"
                    inputMode={key === 'EAN13' || key === 'DUN14' ? 'numeric' : undefined}
                  />
                </Field>
              ))}
            </div>
          </fieldset>

          <GestorFotos fotos={fotos} onFotos={setFotos} files={files} onFiles={setFiles} />

          <Aviso msg={msg} />

          <button type="submit" disabled={guardando} className="btn btn-primary w-full disabled:opacity-60">
            {guardando ? <Loader2 size={16} className="animate-spin" /> : editando ? <Check size={16} /> : <Plus size={16} />}
            {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Agregar producto'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 font-archivo text-lg font-bold">Productos ({items.length})</h2>

        <MigracionFotos items={items} onListo={cargar} />

        {items.length > 0 && !pendientesDeMigrar(items).length && (
          <div className="mb-5">
            <BotonReoptimizar
              etiqueta="Optimizar las fotos de los productos"
              ayuda="Vuelve a comprimir las fotos ya subidas. Son muchas, así que puede tardar varios minutos."
              correr={(onCada) => reoptimizarProductos(items, onCada).then((r) => { cargar(); return r })}
            />
          </div>
        )}

        {cargando ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <Vacio texto="Todavía no hay productos cargados." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => {
              const enRepo = fotosEnRepo(p).length
              return (
                <div
                  key={p.id}
                  className="flex gap-3 rounded-xl border bg-white p-3 shadow-sm"
                  style={{ borderColor: editando?.id === p.id ? '#141210' : '#e9e5df' }}
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f4f1ec]">
                    {p.imagenes[0] && <img src={p.imagenes[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.nombre}</p>
                    <p className="text-xs text-[#6b6560]">{p.categoriaLabel}</p>
                    <p className="mt-0.5 text-xs text-[#8a837c]">
                      {p.imagenes.length} foto{p.imagenes.length === 1 ? '' : 's'}
                      {Object.keys(p.specs || {}).length > 0 && ' · con ficha'}
                    </p>
                    {enRepo > 0 && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-[#8a5a00]">
                        <AlertTriangle size={11} /> {enRepo} sin migrar
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-center justify-center">
                    <IconBtn onClick={() => empezarEdicion(p)} label={`Editar ${p.nombre}`}>
                      <Pencil size={15} />
                    </IconBtn>
                    <IconBtn
                      onClick={() => bajarProducto(p)}
                      disabled={bajando === p.id || !p.imagenes.length}
                      label={`Descargar las fotos de ${p.nombre}`}
                    >
                      {bajando === p.id ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                    </IconBtn>
                    <IconBtn onClick={() => borrar(p)} label={`Eliminar ${p.nombre}`} danger>
                      <Trash2 size={15} />
                    </IconBtn>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

/* --- Fotos de un producto: orden, borrado y altas --- */
function GestorFotos({ fotos, onFotos, files, onFiles }) {
  const mover = (i, d) => {
    const j = i + d
    if (j < 0 || j >= fotos.length) return
    const copia = [...fotos]
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
    onFotos(copia)
  }

  return (
    <fieldset className="rounded-xl border border-[#e9e5df] p-4">
      <legend className="px-1.5 text-sm font-semibold">Fotos</legend>

      {fotos.length > 0 && (
        <>
          <p className="mb-2 text-xs text-[#8a837c]">La primera es la que se ve en el listado.</p>
          <ul className="mb-3 space-y-1.5">
            {fotos.map((url, i) => (
              <li key={`${url}-${i}`} className="flex items-center gap-2 rounded-lg border border-[#f0ece5] p-1.5">
                <img src={url} alt="" className="h-11 w-11 shrink-0 rounded object-cover" />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-xs text-[#8a837c]">
                    {i === 0 ? 'Principal' : `Foto ${i + 1}`}
                  </span>
                  {!esDeStorage(url) && (
                    <span className="block text-[11px] font-medium text-[#8a5a00]">en el repo</span>
                  )}
                </span>
                <IconBtn onClick={() => mover(i, -1)} disabled={i === 0} label="Subir">
                  <ChevronUp size={14} />
                </IconBtn>
                <IconBtn onClick={() => mover(i, 1)} disabled={i === fotos.length - 1} label="Bajar">
                  <ChevronDown size={14} />
                </IconBtn>
                <IconBtn onClick={() => onFotos(fotos.filter((_, k) => k !== i))} label="Quitar" danger>
                  <X size={14} />
                </IconBtn>
              </li>
            ))}
          </ul>
        </>
      )}

      <label className="flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#d9d3ca] px-4 py-5 text-sm font-medium text-[#6b6560] transition-colors hover:border-[#141210]">
        <ImagePlus size={18} />
        {files.length ? `${files.length} foto(s) por subir` : fotos.length ? 'Agregar más fotos' : 'Elegir fotos'}
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => onFiles([...e.target.files])}
        />
      </label>
      {files.length > 0 && (
        <button
          type="button"
          onClick={() => onFiles([])}
          className="mt-1.5 text-xs font-semibold text-[#6b6560] underline-offset-2 hover:text-[#141210] hover:underline"
        >
          Quitar las {files.length} seleccionadas
        </button>
      )}
    </fieldset>
  )
}

/* --- Migración de las fotos que quedaron en el repo --- */
function MigracionFotos({ items, onListo }) {
  const [corriendo, setCorriendo] = useState(false)
  const [hechas, setHechas] = useState(0)
  const [msg, setMsg] = useState(null)

  const pendientes = pendientesDeMigrar(items)
  const totalFotos = totalFotosEnRepo(items)
  if (!pendientes.length && !msg) return null

  const migrar = async () => {
    setCorriendo(true)
    setHechas(0)
    setMsg(null)
    let ok = 0
    const fallados = []
    for (const p of pendientes) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await migrarProducto(p, () => setHechas((n) => n + 1))
        ok++
      } catch (e) {
        fallados.push(`${p.nombre}: ${e.message}`)
      }
    }
    setCorriendo(false)
    setMsg(
      fallados.length
        ? { type: 'warn', text: `Se migraron ${ok} de ${pendientes.length}. Fallaron: ${fallados.join(' · ')}` }
        : { type: 'ok', text: `Listo: ${ok} producto(s) migrado(s). Ahora todas las fotos se editan desde acá.` },
    )
    onListo()
  }

  return (
    <div className="mb-5 rounded-xl border border-[#e8d9b0] bg-[#fdf8ec] p-4">
      {pendientes.length > 0 && (
        <>
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#8a5a00]">
            <AlertTriangle size={15} /> Hay fotos que todavía no están en Supabase
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[#6b6560]">
            <strong className="font-semibold text-[#141210]">{pendientes.length} producto(s)</strong> tienen
            en total <strong className="font-semibold text-[#141210]">{totalFotos} foto(s)</strong> guardadas
            dentro del sitio y no dentro de la base. Esas no se pueden reemplazar desde el panel.
            Migralas una vez y quedan todas editables desde acá.
          </p>
        </>
      )}

      {corriendo && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e9e5df]">
            <div
              className="h-full rounded-full bg-[#141210] transition-[width] duration-300"
              style={{ width: `${totalFotos ? (hechas / totalFotos) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-[#6b6560]" aria-live="polite">
            Subiendo {hechas} de {totalFotos} fotos… no cierres esta pestaña.
          </p>
        </div>
      )}

      {msg && <div className="mt-3"><Aviso msg={msg} /></div>}

      {pendientes.length > 0 && (
        <button
          type="button"
          onClick={migrar}
          disabled={corriendo}
          className="btn btn-primary mt-3 !py-2.5 disabled:opacity-60"
        >
          {corriendo ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
          {corriendo ? 'Migrando…' : `Migrar ${totalFotos} fotos a Supabase`}
        </button>
      )}
    </div>
  )
}

const BANNER_IDEAL = { w: 2400, h: 1000 }
const BANNER_MINIMO = { w: 1600, h: 700 }

// Las mismas proporciones que usa el banner del home (BANNER_ALTO en Landing).
// Si allá cambian, hay que cambiarlas acá o la vista previa miente.
const VISTAS = [
  { id: 'movil', label: 'Celular', ratio: 3 / 2 },
  { id: 'tablet', label: 'Tablet', ratio: 21 / 9 },
  { id: 'desktop', label: 'Computadora', ratio: 3 / 1 },
]

// object-position: qué parte de la foto se mantiene siempre a la vista.
const FOCOS = [
  [{ v: '0% 0%', l: 'arriba izquierda' }, { v: '50% 0%', l: 'arriba centro' }, { v: '100% 0%', l: 'arriba derecha' }],
  [{ v: '0% 50%', l: 'centro izquierda' }, { v: '50% 50%', l: 'centro' }, { v: '100% 50%', l: 'centro derecha' }],
  [{ v: '0% 100%', l: 'abajo izquierda' }, { v: '50% 100%', l: 'abajo centro' }, { v: '100% 100%', l: 'abajo derecha' }],
]

function medirImagen(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve({ w: img.naturalWidth, h: img.naturalHeight }) }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
    img.src = url
  })
}

function GuiaMedidas() {
  return (
    <div className="mt-4 rounded-xl border border-[#e9e5df] bg-[#fdfcfa] p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold">
        <Info size={15} /> Qué medida tienen que tener las fotos
      </h3>

      <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
        <dt className="font-semibold">Medida ideal</dt>
        <dd className="text-[#6b6560]">{BANNER_IDEAL.w} × {BANNER_IDEAL.h} px (apaisada, proporción 2,4:1)</dd>
        <dt className="font-semibold">Mínimo</dt>
        <dd className="text-[#6b6560]">{BANNER_MINIMO.w} × {BANNER_MINIMO.h} px — abajo de esto se ve pixelada</dd>
        <dt className="font-semibold">Formato</dt>
        <dd className="text-[#6b6560]">JPG o WebP · hasta 10 MB (ideal menos de 1 MB para que cargue rápido)</dd>
      </dl>

      <p className="mt-3 text-sm leading-relaxed text-[#6b6560]">
        Con una sola foto de esa medida alcanza para todos los dispositivos. Como la pantalla de un
        celular es más alta que ancha, ahí se recortan un poco los costados: por eso conviene dejar
        lo importante hacia el centro. Si aun así queda mal encuadrada, abrí{' '}
        <strong className="font-semibold text-[#141210]">Encuadre</strong> en la imagen y elegí qué
        parte se tiene que ver siempre — abajo te muestra cómo queda en cada pantalla.
      </p>
    </div>
  )
}

function PanelBanners() {
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [subiendo, setSubiendo] = useState(false)
  const [importando, setImportando] = useState(false)
  const [msg, setMsg] = useState(null)

  const cargar = () =>
    getAllBanners()
      .then(setItems)
      .catch((e) => setMsg({ type: 'err', text: e.message }))
      .finally(() => setCargando(false))

  useEffect(() => { cargar() }, [])

  const subir = async (files) => {
    if (!files.length) return
    setSubiendo(true)
    setMsg(null)
    try {
      // Avisar (sin bloquear) si alguna foto va a verse pixelada.
      const chicas = []
      for (const f of files) {
        // eslint-disable-next-line no-await-in-loop
        const d = await medirImagen(f)
        if (d && (d.w < BANNER_MINIMO.w || d.h < BANNER_MINIMO.h)) {
          chicas.push(`${f.name} (${d.w}×${d.h})`)
        }
      }

      let orden = items.length
      let ahorroTotal = 0
      for (const f of files) {
        // Se comprime antes de subir. Un PNG de 2400px pesa ~4 MB y en WebP baja
        // a ~350 KB: sin esto cada visitante se descarga esos megas.
        // eslint-disable-next-line no-await-in-loop
        const { blob, nombre, ahorro } = await optimizar(f)
        ahorroTotal += ahorro
        // eslint-disable-next-line no-await-in-loop
        const url = await uploadBannerImage(blob, nombre)
        // eslint-disable-next-line no-await-in-loop
        const blur = await miniatura(blob)
        // eslint-disable-next-line no-await-in-loop
        await createBanner({ url, blur }, orden++)
      }

      const optimizadas = ahorroTotal > 0 ? ` Se optimizaron: ${pesoCorto(ahorroTotal)} menos de descarga.` : ''
      setMsg(
        chicas.length
          ? {
              type: 'warn',
              text: `Se agregaron, pero estas fotos son más chicas que ${BANNER_MINIMO.w}×${BANNER_MINIMO.h} y se van a ver pixeladas: ${chicas.join(', ')}.${optimizadas}`,
            }
          : { type: 'ok', text: `${files.length} imagen(es) agregada(s) al carrusel.${optimizadas}` },
      )
      cargar()
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    } finally {
      setSubiendo(false)
    }
  }

  // Optimista: se reordena en pantalla y después se persiste el orden.
  const reordenar = async (nueva) => {
    setItems(nueva)
    try {
      await saveOrden(nueva)
    } catch (e) {
      setMsg({ type: 'err', text: `No se pudo guardar el orden: ${e.message}` })
      cargar()
    }
  }

  const borrar = async (b) => {
    if (!window.confirm('¿Eliminar esta imagen del carrusel?')) return
    try {
      const sobro = await deleteBanner(b)
      const resto = items.filter((x) => x.id !== b.id)
      setItems(resto)
      await saveOrden(resto)
      if (sobro) setMsg({ type: 'warn', text: 'Se quitó del carrusel, pero el archivo quedó en el Storage.' })
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    }
  }

  const alternarActivo = async (b) => {
    try {
      await updateBanner(b.id, { activo: !b.activo })
      setItems((xs) => xs.map((x) => (x.id === b.id ? { ...x, activo: !x.activo } : x)))
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    }
  }

  const editarTitulo = async (b, titulo) => {
    setItems((xs) => xs.map((x) => (x.id === b.id ? { ...x, titulo } : x)))
    try {
      await updateBanner(b.id, { titulo })
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    }
  }

  const editarFoco = async (b, foco) => {
    setItems((xs) => xs.map((x) => (x.id === b.id ? { ...x, foco } : x)))
    try {
      await updateBanner(b.id, { foco })
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    }
  }

  // Pasa las fotos de respaldo a la base para que se puedan editar como
  // cualquier otra: mientras vivan en el código no hay nada que reordenar.
  const importar = async () => {
    setImportando(true)
    setMsg(null)
    try {
      const creados = await importarRespaldo()
      setMsg({ type: 'ok', text: `${creados.length} imágenes importadas. Ahora podés reordenarlas, encuadrarlas y borrarlas.` })
      cargar()
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    } finally {
      setImportando(false)
    }
  }

  const bajarBanner = async (b, i) => {
    try {
      await descargarUna(b.url, `medianaranja-banner-${String(i + 1).padStart(2, '0')}`)
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    }
  }

  const publicados = items.filter((b) => b.activo)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-[#e9e5df] bg-white p-6 shadow-card">
        <h2 className="flex items-center gap-2 font-archivo text-lg font-bold">
          <Images size={18} /> Banner del home
        </h2>
        <p className="mt-1 text-sm text-[#6b6560]">
          El primero de la lista es el que se ve al entrar a la página. Movelos con las flechas
          o tocá la estrella para mandar uno al principio.
        </p>

        <GuiaMedidas />

        <label className="mt-4 flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#d9d3ca] px-4 py-7 text-sm font-medium text-[#6b6560] transition-colors hover:border-[#141210]">
          {subiendo ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
          {subiendo ? 'Subiendo…' : 'Agregar imágenes al carrusel'}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={subiendo}
            className="sr-only"
            onChange={(e) => { subir([...e.target.files]); e.target.value = '' }}
          />
        </label>

        <div className="mt-4">
          <Aviso msg={msg} />
        </div>

        {items.length > 0 && (
          <div className="mt-4">
            <BotonReoptimizar
              etiqueta="Optimizar las imágenes ya cargadas"
              ayuda="Vuelve a comprimir los banners que ya están subidos con los parámetros actuales. Si alguna no mejora al menos un 15%, la deja como está."
              correr={(onCada) => reoptimizarBanners(items, onCada).then((r) => { cargar(); return r })}
            />
          </div>
        )}

        {cargando ? (
          <div className="grid place-items-center py-16">
            <Loader2 className="animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-4">
            <BannersDeRespaldo onImportar={importar} importando={importando} />
          </div>
        ) : (
          <>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#8a837c]">
              {publicados.length} publicada{publicados.length === 1 ? '' : 's'} · {items.length} en total
            </p>
            <ul className="mt-2 space-y-2">
              {items.map((b, i) => (
                <FilaBanner
                  key={b.id}
                  b={b}
                  i={i}
                  total={items.length}
                  onTitulo={(t) => editarTitulo(b, t)}
                  onFoco={(f) => editarFoco(b, f)}
                  onPrincipal={() => reordenar(hacerPrincipal(items, b.id))}
                  onMover={(d) => reordenar(moverBanner(items, b.id, d))}
                  onActivo={() => alternarActivo(b)}
                  onBajar={() => bajarBanner(b, i)}
                  onBorrar={() => borrar(b)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

function FilaBanner({ b, i, total, onTitulo, onFoco, onPrincipal, onMover, onActivo, onBajar, onBorrar }) {
  const [abierto, setAbierto] = useState(false)
  const foco = b.foco || '50% 50%'

  return (
    <li
      className="rounded-xl border border-[#e9e5df] p-2.5"
      style={{ background: b.activo ? '#fff' : '#f7f5f1', opacity: b.activo ? 1 : 0.7 }}
    >
      {/* flex-wrap + ancho mínimo del texto: con seis acciones, en ventanas
          angostas los botones bajan a su propia línea en vez de aplastar el
          campo de título hasta dejarlo ilegible. */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f4f1ec]">
          <img src={b.url} alt="" className="h-full w-full object-cover" style={{ objectPosition: foco }} />
          {i === 0 && b.activo && (
            <span className="absolute left-1 top-1 rounded bg-[#141210] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Portada
            </span>
          )}
        </div>

        <div className="min-w-[190px] flex-1">
          <label className="sr-only" htmlFor={`titulo-${b.id}`}>Título sobre la imagen</label>
          <input
            id={`titulo-${b.id}`}
            value={b.titulo || ''}
            onChange={(e) => onTitulo(e.target.value)}
            placeholder="Título sobre la imagen (opcional)"
            className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm hover:border-[#e9e5df] focus:border-[#141210] focus:outline-none"
            autoComplete="off"
          />
          <div className="flex items-center gap-2 px-2">
            <p className="text-xs text-[#8a837c]">{b.activo ? `Posición ${i + 1}` : 'Oculta'}</p>
            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#6b6560] underline-offset-2 hover:text-[#141210] hover:underline"
            >
              <Crop size={12} /> Encuadre
            </button>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center">
          <IconBtn onClick={onPrincipal} disabled={i === 0} label="Poner primera (portada)">
            <Star size={16} fill={i === 0 ? 'currentColor' : 'none'} />
          </IconBtn>
          <IconBtn onClick={() => onMover(-1)} disabled={i === 0} label="Subir">
            <ChevronUp size={16} />
          </IconBtn>
          <IconBtn onClick={() => onMover(1)} disabled={i === total - 1} label="Bajar">
            <ChevronDown size={16} />
          </IconBtn>
          <IconBtn onClick={onActivo} label={b.activo ? 'Ocultar del carrusel' : 'Publicar'}>
            {b.activo ? <Eye size={16} /> : <EyeOff size={16} />}
          </IconBtn>
          <IconBtn onClick={onBajar} label="Descargar esta imagen">
            <Download size={16} />
          </IconBtn>
          <IconBtn onClick={onBorrar} label="Eliminar" danger>
            <Trash2 size={16} />
          </IconBtn>
        </div>
      </div>

      {abierto && <Encuadre url={b.url} foco={foco} onFoco={onFoco} />}
    </li>
  )
}

// Muestra la MISMA foto en los tres recortes reales del sitio. Al cambiar el
// punto de encuadre las tres se actualizan, así se ve al toque si una sola
// imagen funciona en todos lados.
function Encuadre({ url, foco, onFoco }) {
  return (
    <div className="mt-3 border-t border-[#f0ece5] pt-3">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8a837c]">
            Así se ve en cada pantalla
          </p>
          {/* items-stretch + el pie abajo: las tres proporciones tienen alturas
              distintas y si no los rótulos quedan escalonados. */}
          <div className="flex items-stretch gap-2">
            {VISTAS.map((v) => (
              <figure key={v.id} className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-1 items-center">
                  <div
                    className="w-full overflow-hidden rounded-md border border-[#e9e5df] bg-[#f4f1ec]"
                    style={{ aspectRatio: String(v.ratio) }}
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" style={{ objectPosition: foco }} />
                  </div>
                </div>
                <figcaption className="mt-1.5 truncate text-center text-[11px] text-[#8a837c]">{v.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <fieldset className="shrink-0">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8a837c]">
            Qué parte priorizar
          </legend>
          <div className="grid grid-cols-3 gap-1" role="radiogroup" aria-label="Punto de encuadre">
            {FOCOS.flat().map(({ v, l }) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={foco === v}
                aria-label={`Priorizar ${l}`}
                title={l}
                onClick={() => onFoco(v)}
                className="grid h-11 w-11 place-items-center rounded-md border transition-colors"
                style={{
                  borderColor: foco === v ? '#141210' : '#e9e5df',
                  background: foco === v ? '#141210' : '#fff',
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: foco === v ? '#FFD400' : '#d9d3ca' }}
                />
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  )
}

/* ---------------- Métricas ---------------- */
const PERIODOS = [
  { dias: 7, label: '7 días' },
  { dias: 30, label: '30 días' },
  { dias: 90, label: '90 días' },
]

function PanelMetricas() {
  const [dias, setDias] = useState(30)
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [msg, setMsg] = useState(null)
  const [tabla, setTabla] = useState(false)

  useEffect(() => {
    let vivo = true
    setCargando(true)
    cargarMetricas(dias)
      .then((d) => vivo && setDatos(d))
      .catch((e) => vivo && setMsg({ type: 'err', text: e.message }))
      .finally(() => vivo && setCargando(false))
    return () => { vivo = false }
  }, [dias])

  if (cargando && !datos) {
    return <div className="grid place-items-center py-20"><Loader2 className="animate-spin" /></div>
  }

  const sinDatos = datos && Number(datos.resumen.visitas) === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-archivo text-lg font-bold">Métricas del sitio</h2>
        <div className="flex gap-1 rounded-full border border-[#e9e5df] bg-white p-1" role="group" aria-label="Período">
          {PERIODOS.map((p) => (
            <button
              key={p.dias}
              type="button"
              onClick={() => setDias(p.dias)}
              aria-pressed={dias === p.dias}
              className="min-h-[36px] rounded-full px-4 text-sm font-semibold transition-colors"
              style={{
                background: dias === p.dias ? '#141210' : 'transparent',
                color: dias === p.dias ? '#fff' : '#6b6560',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <Aviso msg={msg} />

      {sinDatos ? (
        <div className="rounded-2xl border border-[#e9e5df] bg-white p-8 text-center shadow-card">
          <BarChart3 className="mx-auto text-[#b3ada5]" size={28} />
          <h3 className="mt-3 font-archivo text-lg font-bold">Todavía no hay visitas registradas</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#6b6560]">
            Los datos empiezan a juntarse cuando la gente entre al sitio publicado. Tus propias
            visitas no se cuentan mientras tengas la sesión del panel abierta, así que para probar
            conviene entrar desde una ventana privada.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Tarjeta hero etiqueta="Visitas" valor={datos.resumen.visitas} detalle={`en los últimos ${dias} días`} />
            <Tarjeta etiqueta="Visitantes únicos" valor={datos.resumen.visitantes} detalle="navegadores distintos" />
            <Tarjeta etiqueta="Sesiones" valor={datos.resumen.sesiones} detalle="cada visita a la página" />
          </div>

          <Bloque
            titulo="Evolución día a día"
            accion={
              <button
                type="button"
                onClick={() => setTabla((v) => !v)}
                className="text-sm font-semibold text-[#6b6560] underline-offset-2 hover:text-[#141210] hover:underline"
              >
                {tabla ? 'Ver gráfico' : 'Ver datos'}
              </button>
            }
          >
            {tabla ? (
              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white text-left text-xs uppercase tracking-wide text-[#8a837c]">
                    <tr>
                      <th scope="col" className="py-2">Día</th>
                      <th scope="col" className="py-2 text-right">Visitas</th>
                      <th scope="col" className="py-2 text-right">Visitantes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datos.porDia.map((d) => (
                      <tr key={d.dia} className="border-t border-[#f0ece5]">
                        <td className="py-1.5">{fechaCorta(d.dia)}</td>
                        <td className="py-1.5 text-right tabular-nums">{numero(d.visitas)}</td>
                        <td className="py-1.5 text-right tabular-nums">{numero(d.visitantes)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <LineaTiempo
                datos={datos.porDia}
                series={[
                  { clave: 'visitas', nombre: 'Visitas', color: SERIE.principal },
                  { clave: 'visitantes', nombre: 'Visitantes únicos', color: SERIE.secundaria },
                ]}
              />
            )}
          </Bloque>

          <Bloque
            titulo="Zonas más usadas"
            ayuda="Tiempo real que cada sección estuvo a la vista, sumando todas las visitas. Mide atención, no si pasaron scrolleando."
          >
            <Barras
              datos={datos.secciones.map((s) => ({ clave: s.seccion, nombre: s.nombre, valor: Number(s.segundos) }))}
              formato={duracion}
              vacio="Nadie se detuvo todavía en ninguna sección."
            />
          </Bloque>

          <div className="grid gap-6 lg:grid-cols-2">
            <Bloque titulo="Productos más vistos" ayuda="Cuántas veces se abrió la ficha de cada uno.">
              <Barras
                datos={datos.productos.map((p) => ({ clave: p.producto, nombre: p.producto, valor: Number(p.aperturas) }))}
                vacio="Todavía no abrieron ninguna ficha."
              />
            </Bloque>
            <Bloque titulo="Fotos más descargadas" ayuda="Descargas desde la ficha de producto.">
              <Barras
                datos={datos.descargas.map((p) => ({ clave: p.producto, nombre: p.producto, valor: Number(p.descargas) }))}
                vacio="Todavía no descargaron fotos."
              />
            </Bloque>
          </div>
        </>
      )}
    </div>
  )
}

function Bloque({ titulo, ayuda, accion, children }) {
  return (
    <section className="rounded-2xl border border-[#e9e5df] bg-white p-6 shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-archivo text-base font-bold">{titulo}</h3>
          {ayuda && <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#8a837c]">{ayuda}</p>}
        </div>
        {accion}
      </div>
      {children}
    </section>
  )
}

/**
 * Sin banners cargados el home no queda vacío: muestra estas fotos de fábrica,
 * que viven en el repo y no en la base. Mostrarlas acá evita la confusión de
 * ver un carrusel en el sitio y "nada cargado" en el panel.
 */
function BannersDeRespaldo({ onImportar, importando }) {
  return (
    <div className="rounded-xl border border-dashed border-[#d9d3ca] p-4">
      <h3 className="text-sm font-bold">Todavía no cargaste ninguna imagen</h3>
      <p className="mt-1 text-sm leading-relaxed text-[#6b6560]">
        Mientras tanto el carrusel del home muestra estas {RESPALDO.length} fotos de la fábrica,
        que vienen con el sitio. Como no están en la base, no se pueden reordenar ni borrar.
        Importalas y pasan a ser banners normales, o subí las tuyas y estas dejan de mostrarse.
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {RESPALDO.map((b) => (
          <li key={b.id} className="overflow-hidden rounded-lg border border-[#e9e5df] bg-white">
            <img src={b.url} alt="" className="aspect-[5/3] w-full object-cover opacity-70" />
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onImportar}
        disabled={importando}
        className="btn btn-ghost mt-3 !py-2.5 disabled:opacity-60"
      >
        {importando ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
        {importando ? 'Importando…' : 'Importar estas para poder editarlas'}
      </button>
    </div>
  )
}

/* ---------------- Copia de seguridad ---------------- */
function PanelBackup() {
  const [productos, setProductos] = useState([])
  const [banners, setBanners] = useState([])
  const [cargando, setCargando] = useState(true)
  const [progreso, setProgreso] = useState(null) // { hechas, total, que }
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    let vivo = true
    Promise.all([getAllProducts(), getAllBanners()])
      .then(([p, b]) => { if (vivo) { setProductos(p); setBanners(b) } })
      .catch((e) => vivo && setMsg({ type: 'err', text: e.message }))
      .finally(() => vivo && setCargando(false))
    return () => { vivo = false }
  }, [])

  const fotosProductos = productos.reduce((n, p) => n + (p.imagenes?.length || 0), 0)

  const bajar = async (que) => {
    const plan = planificar({
      productos: que === 'banner' ? [] : productos,
      banners: que === 'productos' ? [] : banners,
    })
    if (!plan.length) {
      setMsg({ type: 'err', text: 'No hay fotos para descargar.' })
      return
    }
    setMsg(null)
    setProgreso({ hechas: 0, total: plan.length, que })
    try {
      const { blob, incluidas, fallados } = await armarZip(plan, (hechas, total) =>
        setProgreso({ hechas, total, que }),
      )
      descargarBlob(blob, nombreArchivoZip(que))
      setMsg(fallados.length
        ? { type: 'warn', text: `Se descargaron ${incluidas} de ${plan.length} fotos. No se pudieron bajar ${fallados.length}: ${fallados.slice(0, 3).map((f) => f.ruta).join(', ')}${fallados.length > 3 ? '…' : ''}` }
        : { type: 'ok', text: `Listo: ${incluidas} fotos en ${pesoLegible(blob.size)}.` })
    } catch (e) {
      setMsg({ type: 'err', text: `No se pudo armar el ZIP: ${e.message}` })
    } finally {
      setProgreso(null)
    }
  }

  if (cargando) {
    return <div className="grid place-items-center py-20"><Loader2 className="animate-spin" /></div>
  }

  const ocupado = progreso !== null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-2xl border border-[#e9e5df] bg-white p-6 shadow-card">
        <h2 className="flex items-center gap-2 font-archivo text-lg font-bold">
          <Archive size={18} /> Descargar todas las fotos
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[#6b6560]">
          Baja todo el material en un archivo ZIP, ordenado por categoría y producto. Sirve como
          copia de seguridad: aunque las fotos vivan en Supabase, tener una copia afuera es lo que
          te cubre ante un borrado por error o si algún día querés mudarte a otro proveedor.
        </p>

        <div className="mt-5 grid gap-3">
          <OpcionBackup
            titulo="Fotos de productos"
            detalle={`${fotosProductos} fotos · ${productos.length} productos`}
            onClick={() => bajar('productos')}
            disabled={ocupado || !fotosProductos}
          />
          <OpcionBackup
            titulo="Imágenes del banner"
            detalle={banners.length ? `${banners.length} imágenes` : 'todavía no cargaste ninguna'}
            onClick={() => bajar('banner')}
            disabled={ocupado || !banners.length}
          />
          <OpcionBackup
            titulo="Todo junto"
            detalle={`${fotosProductos + banners.length} fotos en un solo ZIP`}
            onClick={() => bajar('completo')}
            disabled={ocupado || !(fotosProductos + banners.length)}
            destacado
          />
        </div>

        {progreso && (
          <div className="mt-5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e9e5df]">
              <div
                className="h-full rounded-full bg-[#141210] transition-[width] duration-200"
                style={{ width: `${(progreso.hechas / progreso.total) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-[#6b6560]" aria-live="polite">
              Bajando {progreso.hechas} de {progreso.total} fotos…
              {progreso.hechas === progreso.total && ' armando el ZIP, puede tardar unos segundos.'}
            </p>
          </div>
        )}

        <div className="mt-4"><Aviso msg={msg} /></div>

        <p className="mt-5 border-t border-[#f0ece5] pt-4 text-xs leading-relaxed text-[#8a837c]">
          El ZIP se arma en tu navegador, así que conviene hacerlo desde una computadora y no
          desde el celular: todas las fotos pasan por la memoria del equipo antes de guardarse.
          Las carpetas quedan como <code className="rounded bg-[#f4f1ec] px-1">productos/microfibras/multiuso/01.jpg</code>.
        </p>
      </section>
    </div>
  )
}

function OpcionBackup({ titulo, detalle, onClick, disabled, destacado }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-[64px] items-center justify-between gap-4 rounded-xl border px-5 py-3 text-left transition-colors disabled:opacity-50"
      style={{
        borderColor: destacado ? '#141210' : '#e9e5df',
        background: destacado ? '#141210' : '#fff',
        color: destacado ? '#fff' : '#141210',
      }}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{titulo}</span>
        <span className="block text-xs" style={{ color: destacado ? '#c9c5bf' : '#8a837c' }}>{detalle}</span>
      </span>
      <Download size={17} className="shrink-0" />
    </button>
  )
}

/**
 * Reoptimiza imágenes que ya estan en Storage. La optimizacion al subir sólo
 * aplica a lo nuevo, asi que sin esto habria que borrar y volver a cargar todo
 * a mano cada vez que cambian los parametros de compresion.
 */
function BotonReoptimizar({ etiqueta, ayuda, correr }) {
  const [estado, setEstado] = useState(null) // {hechos,total} mientras corre
  const [msg, setMsg] = useState(null)

  const ir = async () => {
    setEstado({ hechos: 0, total: 0 })
    setMsg(null)
    try {
      const { cambiados, ahorro, fallados } = await correr((hechos, total) =>
        setEstado({ hechos, total }),
      )
      setMsg(
        cambiados === 0
          ? { type: 'ok', text: 'Ya estaban optimizadas: no habia nada que mejorar.' }
          : fallados.length
            ? { type: 'warn', text: `Se optimizaron ${cambiados}, ${pesoCorto(ahorro)} menos. Fallaron ${fallados.length}.` }
            : { type: 'ok', text: `Listo: ${cambiados} optimizadas, ${pesoCorto(ahorro)} menos para descargar.` },
      )
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    } finally {
      setEstado(null)
    }
  }

  const corriendo = estado !== null
  return (
    <div className="rounded-xl border border-[#e9e5df] bg-[#fdfcfa] p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold">
        <Gauge size={15} /> {etiqueta}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-[#6b6560]">{ayuda}</p>

      {corriendo && estado.total > 0 && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e9e5df]">
            <div
              className="h-full rounded-full bg-[#141210] transition-[width] duration-200"
              style={{ width: `${(estado.hechos / estado.total) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-[#6b6560]" aria-live="polite">
            Procesando {estado.hechos} de {estado.total}… no cierres esta pestana.
          </p>
        </div>
      )}

      {msg && <div className="mt-3"><Aviso msg={msg} /></div>}

      <button type="button" onClick={ir} disabled={corriendo} className="btn btn-ghost mt-3 !py-2.5 disabled:opacity-60">
        {corriendo ? <Loader2 size={15} className="animate-spin" /> : <Gauge size={15} />}
        {corriendo ? 'Optimizando…' : 'Optimizar ahora'}
      </button>
    </div>
  )
}

function IconBtn({ onClick, disabled, label, danger, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`grid h-11 w-11 place-items-center rounded-full transition-colors disabled:opacity-30 ${
        danger ? 'text-[#E30613] hover:bg-red-50' : 'text-[#6b6560] hover:bg-[#f4f1ec] hover:text-[#141210]'
      }`}
    >
      {children}
    </button>
  )
}

function Vacio({ texto }) {
  return (
    <p className="rounded-xl border border-dashed border-[#d9d3ca] px-5 py-10 text-center text-sm text-[#6b6560]">
      {texto}
    </p>
  )
}

function PanelCSS() {
  return (
    <style>{`.input{width:100%;border:1.5px solid #e9e5df;border-radius:12px;padding:11px 13px;font-size:16px;min-height:48px;background:#fff;color:#141210}.input:focus{outline:none;border-color:#141210}.input::placeholder{color:#b3ada5}`}</style>
  )
}
