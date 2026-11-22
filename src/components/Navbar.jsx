import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../data/content'
import { useContent } from '../content/ContentContext'
import { Link, useRouter } from '../router'

const idOf = (href) => href.split('#')[1] || ''

export default function Navbar() {
  const { profile } = useContent()
  const { path } = useRouter()
  const onProjects = path === '/projects'
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    if (onProjects) { setActive('work'); return }
    const sections = NAV_LINKS.filter((l) => idOf(l.href)).map((l) => idOf(l.href))
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    // Jika tidak ada section yang terlihat (di atas semua section), set Home aktif
    const checkHome = () => {
      const firstSection = sections.map((id) => document.getElementById(id)).find(Boolean)
      if (firstSection && firstSection.getBoundingClientRect().top > window.innerHeight * 0.5) {
        setActive('home')
      }
    }
    checkHome()
    window.addEventListener('scroll', checkHome, { passive: true })
    return () => { observer.disconnect(); window.removeEventListener('scroll', checkHome) }
  }, [onProjects])

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-40 bg-white/0 "
    >
      <nav aria-label="Utama" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo — Kiri */}
        <Link to="/" className="flex items-center gap-3 rounded">
          <span className="font-bold text-slate-900">{profile.name}</span>
          <span aria-hidden="true" className="h-4 w-px bg-slate-300" />
          <span className="text-sm text-slate-500">{profile.title}</span>
        </Link>

        {/* Dynamic Island — Tengah */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 px-2 py-1.5 shadow-sm">
          {NAV_LINKS.map((l) => {
            const id = idOf(l.href)
            const on = id ? active === id : (active === 'home' && !onProjects)
            return (
              <Link
                key={l.href}
                to={l.href}
                aria-current={on ? 'true' : undefined}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}`}
              >
                {l.label}
                {on && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white shadow-sm -z-10" />}
              </Link>
            )
          })}
        </div>

        {/* CTA — Kanan (Dynamic Island style) */}
        <div className="hidden md:flex items-center">
          <Link to="/#contact" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-800">
            Hubungi Saya
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="rounded-md p-2 text-slate-700 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="rounded py-2 text-sm font-medium text-slate-700">
                {l.label}
              </Link>
            ))}
            <Link to="/#contact" onClick={() => setOpen(false)} className="mt-2 rounded-md bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white">
              Hubungi Saya
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  )
}
