import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Modal from './Modal'
import { Badge } from './ui/badge'
import { buttonVariants } from './ui/button'

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
          <div className="border-b border-border px-6 py-5 pr-16">
            <Badge variant="secondary" className="font-mono text-[11px]">
              {item.type}
            </Badge>
            <h2 id="credential-title" className="mt-2.5 text-xl font-semibold text-popover-foreground">
              {item.title}
            </h2>
          </div>

          <div className="overflow-y-auto px-6 py-6">
            {showImg && (
              <motion.figure
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
                className="overflow-hidden rounded-2xl border border-border bg-muted/60"
              >
                <img
                  src={item.image}
                  alt={item.imageAlt || `Foto ${item.type.toLowerCase()} ${item.title}`}
                  onError={() => setImgFailed(true)}
                  className="max-h-[50vh] w-full object-contain"
                />
              </motion.figure>
            )}

            {item.description && (
              <p className={`leading-relaxed text-popover-foreground/85 ${showImg ? 'mt-6' : ''}`}>
                {item.description}
              </p>
            )}

            {details.length > 0 && (
              <dl className={`divide-y divide-border border-y border-border ${showImg || item.description ? 'mt-6' : ''}`}>
                {details.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-4 py-3">
                    <dt className="text-sm text-muted-foreground">{k}</dt>
                    <dd className="col-span-2 text-sm text-popover-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {isHttp(item.url) && (
            <div className="border-t border-border bg-muted/40 px-6 py-4">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'default', size: 'lg' })}
              >
                <ExternalLink size={16} aria-hidden="true" /> Lihat kredensial
              </a>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
