import { useId } from 'react'
import { motion } from 'framer-motion'

// Motif latar yang halus: beradaptasi otomatis pada Light & Dark Mode lewat variabel CSS --border.
const fade = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 1.4, ease: 'easeOut' },
}

const maskOf = (v) => ({ maskImage: v, WebkitMaskImage: v })

export function DotGrid({ className = '', fadeTo = 'bottom' }) {
  return (
    <motion.div
      aria-hidden="true"
      {...fade}
      className={`pointer-events-none absolute ${className}`}
      style={{
        backgroundImage: 'radial-gradient(hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        ...maskOf(`linear-gradient(to ${fadeTo}, black 0%, transparent 85%)`),
      }}
    />
  )
}

export function LineGrid({ className = '' }) {
  return (
    <motion.div
      aria-hidden="true"
      {...fade}
      className={`pointer-events-none absolute ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(to right, hsl(var(--border) / 0.75) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.75) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        ...maskOf('radial-gradient(ellipse at center, black 25%, transparent 75%)'),
      }}
    />
  )
}

export function Hatch({ className = '' }) {
  return (
    <motion.div
      aria-hidden="true"
      {...fade}
      className={`pointer-events-none absolute ${className}`}
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, hsl(var(--border) / 0.75) 0, hsl(var(--border) / 0.75) 1px, transparent 1px, transparent 10px)',
        ...maskOf('radial-gradient(ellipse at top right, black 0%, transparent 70%)'),
      }}
    />
  )
}

export function Crosses({ className = '' }) {
  const patternId = useId()
  return (
    <motion.svg
      aria-hidden="true"
      {...fade}
      className={`pointer-events-none absolute h-full text-border ${className}`}
      style={maskOf('linear-gradient(to left, black 0%, transparent 80%)')}
    >
      <defs>
        <pattern id={patternId} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M18 13v10M13 18h10" stroke="currentColor" strokeWidth="1" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </motion.svg>
  )
}

export function Rings({ className = '' }) {
  const radii = [90, 150, 210, 270]
  return (
    <svg aria-hidden="true" viewBox="0 0 600 600" fill="none" className={`pointer-events-none absolute ${className}`}>
      {radii.map((r, i) => (
        <motion.circle
          key={r}
          cx="300"
          cy="300"
          r={r}
          stroke="hsl(var(--border))"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 + i * 0.2 }}
        />
      ))}
      <motion.path
        d="M300 20v560M20 300h560"
        stroke="hsl(var(--border) / 0.7)"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.8 }}
      />
    </svg>
  )
}
