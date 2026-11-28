import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Download, Linkedin, Loader2, Mail, Send } from 'lucide-react'
import { useContent } from '../content/ContentContext'
import Reveal from './Reveal'
import useCopy from './useCopy'
import { Crosses } from './Motifs'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button, buttonVariants } from './ui/button'

export default function Contact() {
  const { profile, sections, contact } = useContent()
  const [copied, copy] = useCopy(profile.email)
  const [status, setStatus] = useState('idle') // idle | sending | sent | gmail | error
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (String(f.get('_gotcha') || '')) return setStatus('sent')

    const name = String(f.get('name') || '').trim()
    const from = String(f.get('contact') || '').trim()
    const message = String(f.get('message') || '').trim()

    if (contact.formEndpoint) {
      setStatus('sending')
      setError('')
      try {
        const r = await fetch(contact.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name, email: from, message }),
        })
        if (!r.ok) throw new Error('gagal')
        setStatus('sent')
      } catch {
        setError('Pesan gagal dikirim. Silakan kirim langsung lewat email.')
        setStatus('error')
      }
    } else {
      const q = (v) => encodeURIComponent(v)
      const subject = `Pesan dari ${name}`
      const body = `${message}\n\n— ${name} (${from})`
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${q(profile.email)}&su=${q(subject)}&body=${q(body)}`,
        '_blank',
        'noopener,noreferrer'
      )
      setStatus('gmail')
    }
  }

  const done = status === 'sent' || status === 'gmail'

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-hidden border-t border-border bg-muted/35">
      <Crosses className="inset-y-0 right-0 w-2/3" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:gap-16">
        <Reveal>
          <h2 id="contact-heading" className="text-3xl font-semibold">{sections.contact.title}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{sections.contact.description}</p>

          {profile.email && (
            <>
              <button
                type="button"
                onClick={copy}
                className="mt-8 flex w-full items-center justify-between gap-4 rounded-2xl bg-card p-4 text-left ring-1 ring-foreground/10 transition-all hover:bg-accent/60 hover:shadow-sm hover:ring-foreground/20"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <Mail size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="truncate font-mono text-sm text-card-foreground">{profile.email}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 rounded-4xl bg-muted px-3 py-1 text-xs font-medium text-foreground">
                  {copied ? <Check size={14} className="text-status" /> : <Copy size={14} />}
                  {copied ? 'Tersalin' : 'Salin'}
                </span>
              </button>
              <span className="sr-only" role="status" aria-live="polite">{copied ? 'Alamat email tersalin' : ''}</span>
            </>
          )}

          {(profile.linkedin || profile.resume) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'outline', size: 'default', className: 'bg-card/85' })}
                >
                  <Linkedin size={16} aria-hidden="true" /> LinkedIn
                </a>
              )}
              {profile.resume && (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'outline', size: 'default', className: 'bg-card/85' })}
                >
                  <Download size={16} aria-hidden="true" /> Resume / CV (PDF)
                </a>
              )}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.08}>
          <Card className="p-6 shadow-sm md:p-8">
            {done ? (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="py-8 text-center"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-status/15 text-status">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                  {status === 'gmail' ? 'Gmail dibuka' : 'Pesan terkirim'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {status === 'gmail'
                    ? 'Tekan Kirim di tab Gmail untuk menyelesaikan. Jika tab tidak terbuka, salin alamat email di samping.'
                    : 'Terima kasih. Pesan Anda sudah masuk ke email saya.'}
                </p>
                <Button type="button" variant="outline" onClick={() => setStatus('idle')} className="mt-6">
                  Kirim pesan lain
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-card-foreground">Nama</label>
                  <Input id="name" name="name" type="text" required maxLength={100} autoComplete="name" className="mt-2" />
                </div>
                <div>
                  <label htmlFor="contact" className="text-sm font-medium text-card-foreground">Email atau organisasi</label>
                  <Input id="contact" name="contact" type="text" required maxLength={200} autoComplete="email" className="mt-2" />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-card-foreground">Pesan</label>
                  <Textarea id="message" name="message" rows={5} required minLength={5} maxLength={4000} className="mt-2" />
                </div>
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="_gotcha">Jangan diisi</label>
                  <input id="_gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                {status === 'error' && (
                  <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive">
                    {error}
                  </p>
                )}
                <Button type="submit" size="lg" disabled={status === 'sending'} className="w-full">
                  {status === 'sending' ? (
                    <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Mengirim…</>
                  ) : (
                    <><Send size={16} aria-hidden="true" /> Kirim pesan</>
                  )}
                </Button>
              </form>
            )}
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
