import { DEFAULT_CONTENT } from '../data/content'
import { supabase } from './supabase'
import { mergeContent, sanitizeContent } from './sanitize'

const CACHE_KEY = 'portfolio:content:v2'

// Gabungkan dengan bawaan lalu bersihkan.
export const normalizeContent = (raw) => sanitizeContent(mergeContent(DEFAULT_CONTENT, raw))

export function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeCache(raw) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(raw)) } catch { /* abaikan */ }
}

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))])

// Ambil konten dari Supabase. Mengembalikan null bila belum ada baris / Supabase belum diset.
export async function fetchContent({ timeoutMs = 4000 } = {}) {
  if (!supabase) return null
  const { data, error } = await withTimeout(supabase.from('site_content').select('data').eq('id', 1).maybeSingle(), timeoutMs)
  if (error) throw error
  return data?.data ?? null
}

export async function saveContent(content) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
  const { error } = await supabase.from('site_content').upsert({ id: 1, data: content, updated_at: new Date().toISOString() })
  if (error) throw error
  writeCache(content)
}
