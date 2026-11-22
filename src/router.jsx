import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Router mini tanpa dependensi: cukup untuk 2 halaman (beranda dan /projects).
const Ctx = createContext({ path: '/', navigate: () => {} })
export const useRouter = () => useContext(Ctx)

const read = () => ({
  path: window.location.pathname.replace(/\/+$/, '') || '/',
  hash: window.location.hash,
})

export function Router({ children }) {
  const [loc, setLoc] = useState(read)

  useEffect(() => {
    const on = () => setLoc(read())
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])

  const navigate = useCallback((to) => {
    // Simpan hash untuk scroll, tapi push URL tanpa hash agar URL tetap bersih
    const [pathname, hash] = to.split('#')
    const cleanPath = pathname || '/'
    window.history.pushState({}, '', cleanPath)
    setLoc({ path: cleanPath.replace(/\/+$/, '') || '/', hash: hash ? `#${hash}` : '' })
  }, [])

  // Setelah pindah halaman: gulir ke #bagian bila ada, kalau tidak ke atas.
  useEffect(() => {
    if (loc.hash) {
      const id = decodeURIComponent(loc.hash.slice(1))
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    } else {
      window.scrollTo(0, 0)
    }
  }, [loc])

  const value = useMemo(() => ({ path: loc.path, navigate }), [loc.path, navigate])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function Link({ to, onClick, ...rest }) {
  const { navigate } = useRouter()
  const handle = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handle} {...rest} />
}
