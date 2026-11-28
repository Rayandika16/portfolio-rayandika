import { motion } from 'framer-motion'
import { Check, Copy, GraduationCap, Layers, Activity } from 'lucide-react'
import { useContent } from '../content/ContentContext'
import useCopy from './useCopy'
import { DotGrid, Rings } from './Motifs'
import { Badge } from './ui/badge'
import { Button, buttonVariants } from './ui/button'

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
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden bg-background">
      <DotGrid className="inset-x-0 top-0 h-full" />
      <Rings className="-right-40 -top-32 h-[40rem] w-[40rem] opacity-80" />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 md:pb-24 md:pt-32">
        <div className="max-w-3xl">
          {hero.badge && (
            <motion.div {...item(0)}>
              <Badge
                variant="outline"
                className="gap-2 bg-card/85 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm"
              >
                <span className="h-2 w-2 rounded-full bg-status" aria-hidden="true" />
                {hero.badge}
              </Badge>
            </motion.div>
          )}

          <motion.h1
            {...item(0.08)}
            id="hero-heading"
            className="mt-6 text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl lg:text-[3.5rem]"
          >
            {hero.headline}
          </motion.h1>

          <motion.p {...item(0.16)} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {hero.subheadline}
          </motion.p>

          <motion.div {...item(0.24)} className="mt-9 flex flex-wrap gap-3">
            <a href="#work" className={buttonVariants({ variant: 'default', size: 'lg' })}>
              {hero.primaryCta}
            </a>
            <Button type="button" variant="outline" size="lg" onClick={copy} className="bg-card/80 backdrop-blur-sm">
              {copied ? <Check size={16} className="text-status" /> : <Copy size={16} />}
              {copied ? 'Tersalin ke Clipboard' : 'Salin Alamat Email'}
            </Button>
            <span className="sr-only" role="status" aria-live="polite">
              {copied ? 'Alamat email tersalin ke clipboard' : ''}
            </span>
          </motion.div>
        </div>
      </div>

      {credibility.length > 0 && (
        <div className="relative border-y border-border bg-card/80 backdrop-blur-sm">
          <dl
            style={{ '--n': credibility.length }}
            className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-6 md:[grid-template-columns:repeat(var(--n),minmax(0,1fr))] md:divide-x md:divide-y-0"
          >
            {credibility.map((c, i) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <motion.div
                  key={i}
                  {...item(0.35 + i * 0.08)}
                  className="flex items-start gap-3 py-5 md:px-6 md:first:pl-0 md:last:pr-0"
                >
                  <Icon size={18} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-muted-foreground">{c.label}:</dt>
                    <dd className="mt-0.5 text-sm font-medium text-foreground">{c.value}</dd>
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
