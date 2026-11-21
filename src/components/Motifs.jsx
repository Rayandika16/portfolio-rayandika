import { motion } from 'framer-motion'

// Motif latar yang halus: tidak bergerak terus-menerus, hanya muncul perlahan sekali.
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
        backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
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
          'linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)',
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
        backgroundImage: 'repeating-linear-gradient(135deg, #E2E8F0 0, #E2E8F0 1px, transparent 1px, transparent 10px)',
        ...maskOf('radial-gradient(ellipse at top right, black 0%, transparent 70%)'),
      }}
    />
  )
}

const PLUS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Cpath d='M18 13v10M13 18h10' stroke='%23CBD5E1' stroke-width='1' fill='none'/%3E%3C/svg%3E\")"

export function Crosses({ className = '' }) {
  return (
    <motion.div
      aria-hidden="true"
      {...fade}
      className={`pointer-events-none absolute ${className}`}
      style={{ backgroundImage: PLUS, ...maskOf('linear-gradient(to left, black 0%, transparent 80%)') }}
    />
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
          stroke="#CBD5E1"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 + i * 0.2 }}
        />
      ))}
      <motion.path
        d="M300 20v560M20 300h560"
        stroke="#E2E8F0"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.8 }}
      />
    </svg>
  )
}
