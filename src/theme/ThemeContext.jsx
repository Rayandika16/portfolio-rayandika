import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'theme'

export function resolveInitialTheme({
  getStorage = () => (typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null),
  prefersDark = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches,
} = {}) {
  try {
    const saved = getStorage()
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // Abaikan bila localStorage diblokir browser
  }
  return prefersDark ? 'dark' : 'light'
}

function readStoredExplicitTheme() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === 'dark' || saved === 'light' ? saved : null
  } catch {
    return null
  }
}

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => resolveInitialTheme())

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === 'dark'
    root.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'
  }, [theme])

  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mql) return
    const onChange = (e) => {
      if (!readStoredExplicitTheme()) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    mql.addEventListener?.('change', onChange)
    return () => mql.removeEventListener?.('change', onChange)
  }, [])

  const setTheme = useCallback((next) => {
    const resolved = next === 'dark' ? 'dark' : 'light'
    setThemeState(resolved)
    try {
      window.localStorage.setItem(STORAGE_KEY, resolved)
    } catch {
      // Abaikan bila localStorage tidak tersedia
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Abaikan bila localStorage tidak tersedia
      }
      return next
    })
  }, [])

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
