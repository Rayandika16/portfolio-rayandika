import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Modal from './Modal'

const isHttp = (u) => typeof u === 'string' && /^https?:\/\//i.test(u)

export default function CredentialModal({ item, onClose }) {
  const [imgFailed, setImgFailed] = useState(false)
  useEffect(() => setImgFailed(false), [item])

  const showImg = item && item.image && !imgFailed
  const details = item ? [['Jenis', item.type], ['Penerbit', item.issuer], ['Tahun', item.year]].filter(([, v]) => v) : []

  return (
    <Modal open={!!item} onClose={onClose} labelledBy="credential-title" maxWidth="max-w-2xl">
      {item && (
        <>
          <div className="border-b border-slate-200 px-6 py-5 pr-16">
            <p className="font-mono text-xs text-slate-500">{item.type}</p>
            <h2 id="credential-title" className="mt-2 text-xl font-semibold">{item.title}</h2>
          </div>

          <div className="overflow-y-auto px-6 py-6">
            {showImg && (
              <motion.figure
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
                className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
              >
                <img
                  src={item.image}
                  alt={item.imageAlt || `Foto ${item.type.toLowerCase()} ${item.title}`}
                  onError={() => setImgFailed(true)}
                  className="max-h-[50vh] w-full object-contain"
                />
              </motion.figure>
            )}

            {item.description && <p className={`leading-relaxed text-slate-700 ${showImg ? 'mt-6' : ''}`}>{item.description}</p>}

            {details.length > 0 && (
              <dl className={`divide-y divide-slate-200 border-y border-slate-200 ${showImg || item.description ? 'mt-6' : ''}`}>
                {details.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-4 py-3">
                    <dt className="text-sm text-slate-500">{k}</dt>
                    <dd className="col-span-2 text-sm text-slate-900">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {isHttp(item.url) && (
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800">
                <ExternalLink size={16} aria-hidden="true" /> Lihat kredensial
              </a>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
