import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './ui/button'

// Modal dasar: Escape menutup, fokus terkunci di dalam, fokus kembali ke pemicu, gulir halaman dikunci.
export default function Modal({ open, onClose, labelledBy, maxWidth = 'max-w-4xl', children }) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const lastFocused = useRef(null)

  useEffect(() => {
    if (!open) return
    lastFocused.current = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      const f = panelRef.current.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      lastFocused.current?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div key="modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`relative flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/10`}
          >
            <Button
              ref={closeRef}
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onClose}
              aria-label="Tutup"
              className="absolute right-4 top-4 z-10 bg-popover/90 shadow-sm backdrop-blur-sm"
            >
              <X size={18} />
            </Button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
