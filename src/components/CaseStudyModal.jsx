import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import Modal from './Modal'

const isHttp = (u) => typeof u === 'string' && /^https?:\/\//i.test(u)

// Tombol selalu tampil. Bila tautan belum diisi, tombol tampil nonaktif.
function LinkButton({ href, icon: Icon, children, primary }) {
  const base = 'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors'
  if (isHttp(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${primary ? 'bg-slate-900 text-white hover:bg-slate-800' : 'border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'}`}
      >
        <Icon size={16} aria-hidden="true" /> {children}
      </a>
    )
  }
  return (
    <span
      role="link"
      aria-disabled="true"
      title="Tautan belum tersedia"
      className={`${base} cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-500`}
    >
      <Icon size={16} aria-hidden="true" /> {children}
      <span className="text-xs font-normal">(belum tersedia)</span>
    </span>
  )
}

export default function CaseStudyModal({ study, onClose }) {
  const [imgFailed, setImgFailed] = useState(false)
  useEffect(() => setImgFailed(false), [study])

  const showImg = study && study.image && !imgFailed

  return (
    <Modal open={!!study} onClose={onClose} labelledBy="project-title" maxWidth="max-w-3xl">
      {study && (
        <>
          <div className="overflow-y-auto">
            {showImg && (
              <motion.figure
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="border-b border-slate-200 bg-slate-100"
              >
                <img
                  src={study.image}
                  alt={study.imageAlt || `Tampilan proyek ${study.title}`}
                  onError={() => setImgFailed(true)}
                  className="aspect-video w-full object-cover"
                />
              </motion.figure>
            )}

            <div className={`px-6 py-6 md:px-8 md:py-8 ${showImg ? '' : 'pr-16'}`}>
              {(study.client || study.domain) && (
                <p className="text-sm text-slate-500">
                  {study.client}
                  {study.client && study.domain && ' · '}
                  {study.domain}
                </p>
              )}
              <h2 id="project-title" className="mt-1.5 text-2xl font-semibold leading-snug">{study.title}</h2>

              {study.description && <p className="mt-4 leading-relaxed text-slate-700">{study.description}</p>}

              {study.stack.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Teknologi yang dipakai">
                  {study.stack.map((s, i) => (
                    <li key={i} className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700">{s}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 md:px-8">
            <LinkButton href={study.github} icon={Github}>Lihat di GitHub</LinkButton>
            <LinkButton href={study.demo} icon={ExternalLink} primary>Buka Demo</LinkButton>
          </div>
        </>
      )}
    </Modal>
  )
}
