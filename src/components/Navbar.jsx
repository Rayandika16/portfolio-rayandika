import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../data/content'
import { useContent } from '../content/ContentContext'
import { Link, useRouter } from '../router'
import ThemeToggle from './ThemeToggle'
import { Button, buttonVariants } from './ui/button'

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
      className="fixed inset-x-0 top-0 z-40"
    >
      <nav aria-label="Utama" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo — Kiri */}
        <Link
          to="/"
          className="flex items-center gap-3 rounded-4xl bg-background/70 px-3 py-1.5 backdrop-blur-sm transition-colors hover:bg-muted/70"
        >
          <span className="font-bold text-foreground">{profile.name}</span>
          <span aria-hidden="true" className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">{profile.title}</span>
        </Link>

        {/* Dynamic Island — Tengah (Maia pill) */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-4xl border border-border bg-muted/85 p-1 shadow-sm backdrop-blur-md md:flex">
          {NAV_LINKS.map((l) => {
            const id = idOf(l.href)
            const on = id ? active === id : (active === 'home' && !onProjects)
            return (
              <Link
                key={l.href}
                to={l.href}
                aria-current={on ? 'true' : undefined}
                className={`relative rounded-4xl px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  on ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 -z-10 rounded-4xl bg-background shadow-sm ring-1 ring-foreground/10"
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Tema + CTA — Kanan */}
        <div className="hidden items-center gap-2.5 md:flex">
          <ThemeToggle />
          <Link
            to="/#contact"
            className={buttonVariants({
              variant: 'default',
              size: 'default',
              className: 'hover:-translate-y-0.5 hover:shadow-md',
            })}
          >
            Hubungi Saya
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="bg-background/70 backdrop-blur-sm"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div id="mobile-menu" className="border-y border-border bg-background/95 shadow-lg backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="rounded-4xl px-3.5 py-2 text-sm font-medium text-foreground/85 transition-colors hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/#contact"
              onClick={() => setOpen(false)}
              className={buttonVariants({ variant: 'default', size: 'lg', className: 'mt-2 w-full' })}
            >
              Hubungi Saya
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  )
}
