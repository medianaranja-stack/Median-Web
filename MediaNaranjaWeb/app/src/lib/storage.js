import { supabase } from './supabase'

const BUCKET = 'productos'

function slugify(s) {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

/** Sube un File al Storage y devuelve la URL pública */
export async function uploadImage(file, { linea, categoria, slug }) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const rand = Math.abs(hashString(file.name + file.size)).toString(36)
  const path = `${slugify(linea)}/${slugify(categoria)}/${slugify(slug)}/${rand}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: true,
    contentType: file.type || undefined,
  })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// hash determinístico simple (evita Math.random para nombres estables por archivo)
function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}

export { slugify }
