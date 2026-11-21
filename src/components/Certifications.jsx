import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useContent } from '../content/ContentContext'
import Reveal from './Reveal'
import CredentialModal from './CredentialModal'
import { Hatch } from './Motifs'

export default function Certifications() {
  const { sections, credentials } = useContent()
  const [filter, setFilter] = useState('Semua')
  const [active, setActive] = useState(null)
  const close = useCallback(() => setActive(null), [])

  if (!credentials.length) return null

  const types = [...new Set(credentials.map((c) => c.type))]
  const filters = ['Semua', ...types]
  const shown = filter === 'Semua' ? credentials : credentials.filter((c) => c.type === filter)

  return (
    <section id="certifications" aria-labelledby="cert-heading" className="relative overflow-hidden bg-white">
      <Hatch className="right-0 top-0 h-72 w-96" />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-2xl">
            <h2 id="cert-heading" className="text-3xl font-semibold">{sections.certifications.title}</h2>
            <p className="mt-3">{sections.certifications.description}</p>
          </Reveal>

          {types.length > 1 && (
            <Reveal delay={0.08}>
              <div role="group" aria-label="Filter jenis" className="flex rounded-lg border border-slate-200 bg-white p-1">
                {filters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                    className={`relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${filter === f ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {filter === f && <motion.span layoutId="cert-filter" className="absolute inset-0 rounded-md bg-slate-900" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                    <span className="relative">{f}</span>
                  </button>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <ul key={filter} className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
            {shown.map((c, i) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: i * 0.05 }}
              >
                <button
                  type="button"
                  onClick={() => setActive(c)}
                  aria-haspopup="dialog"
                  className="group grid w-full gap-3 px-5 py-5 text-left transition-colors hover:bg-slate-50 md:grid-cols-[5.5rem_1fr_auto] md:items-center md:gap-6 md:px-6"
                >
                  <span className="font-mono text-sm text-slate-500">{c.year || '—'}</span>
                  <span>
                    <span className="block text-base font-semibold text-slate-900 transition-colors group-hover:text-brand">{c.title}</span>
                    {c.issuer && <span className="mt-0.5 block text-sm text-slate-600">{c.issuer}</span>}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-700">{c.type}</span>
                    <ChevronRight size={18} className="text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden="true" />
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </div>
      <CredentialModal item={active} onClose={close} />
    </section>
  )
}
