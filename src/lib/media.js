import { supabase } from './supabase'

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'application/pdf': 'pdf' }
const MAX = 5 * 1024 * 1024

// Unggah ke bucket "media" di Supabase Storage dan kembalikan URL publiknya.
export async function uploadMedia(file, kind = 'image') {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
  const ext = EXT[file.type]
  if (!ext) throw new Error('Format tidak didukung. Gunakan JPG, PNG, WebP, GIF, atau PDF.')
  if (kind === 'pdf' && ext !== 'pdf') throw new Error('File harus berformat PDF.')
  if (kind === 'image' && ext === 'pdf') throw new Error('File harus berupa gambar (JPG, PNG, WebP, atau GIF).')
  if (file.size > MAX) throw new Error('Ukuran file maksimal 5 MB.')

  const path = `uploads/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw new Error(error.message)
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}
