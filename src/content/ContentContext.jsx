import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_CONTENT } from '../data/content'
import { fetchContent, normalizeContent, readCache, writeCache } from '../lib/contentApi'

const Ctx = createContext(DEFAULT_CONTENT)
export const useContent = () => useContext(Ctx)

// Urutan sumber: cache browser (instan) -> Supabase (terbaru) -> konten bawaan di content.js (cadangan).
export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    const cached = readCache()
    return cached ? normalizeContent(cached) : null
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let next = null
      try {
        const raw = await fetchContent()
        if (raw) {
          next = normalizeContent(raw)
          writeCache(raw)
        }
      } catch {
        /* jaringan/Supabase bermasalah: pakai cache atau bawaan */
      }
      if (!cancelled) setContent((prev) => next ?? prev ?? normalizeContent(DEFAULT_CONTENT))
    })()
    return () => { cancelled = true }
  }, [])

  if (!content) return <div className="min-h-screen bg-white" aria-busy="true" />
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>
}
