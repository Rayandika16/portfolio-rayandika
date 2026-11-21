import { motion } from 'framer-motion'
import { Check, Copy, GraduationCap, Layers, Activity } from 'lucide-react'
import { useContent } from '../content/ContentContext'
import useCopy from './useCopy'
import { DotGrid, Rings } from './Motifs'

const ICONS = [GraduationCap, Layers, Activity]

const item = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
})

export default function Hero() {
  const { profile, hero, credibility } = useContent()
  const [copied, copy] = useCopy(profile.email)

  return (
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden bg-white">
      <DotGrid className="inset-x-0 top-0 h-full" />
      <Rings className="-right-40 -top-32 h-[40rem] w-[40rem] opacity-80" />

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 md:pb-20 md:pt-28">
        <div className="max-w-3xl">
          {hero.badge && (
            <motion.p {...item(0)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-status" aria-hidden="true" />
              {hero.badge}
            </motion.p>
          )}

          <motion.h1 {...item(0.08)} id="hero-heading" className="mt-6 text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-[3.5rem]">
            {hero.headline}
          </motion.h1>

          <motion.p {...item(0.16)} className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {hero.subheadline}
          </motion.p>

          <motion.div {...item(0.24)} className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800">
              {hero.primaryCta}
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              {copied ? <Check size={16} className="text-status" /> : <Copy size={16} />}
              {copied ? 'Tersalin ke Clipboard' : 'Salin Alamat Email'}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {copied ? 'Alamat email tersalin ke clipboard' : ''}
            </span>
          </motion.div>
        </div>
      </div>

      {credibility.length > 0 && (
        <div className="relative border-y border-slate-200 bg-white/80 backdrop-blur-sm">
          <dl
            style={{ '--n': credibility.length }}
            className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-slate-200 px-6 md:[grid-template-columns:repeat(var(--n),minmax(0,1fr))] md:divide-x md:divide-y-0"
          >
            {credibility.map((c, i) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <motion.div key={i} {...item(0.35 + i * 0.08)} className="flex items-start gap-3 py-5 md:px-6 md:first:pl-0 md:last:pr-0">
                  <Icon size={18} className="mt-0.5 shrink-0 text-slate-500" aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-slate-500">{c.label}:</dt>
                    <dd className="mt-0.5 text-sm font-medium text-slate-900">{c.value}</dd>
                  </div>
                </motion.div>
              )
            })}
          </dl>
        </div>
      )}
    </section>
  )
}
