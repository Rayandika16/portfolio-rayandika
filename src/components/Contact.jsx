import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Download, Linkedin, Loader2, Mail, Send } from 'lucide-react'
import { useContent } from '../content/ContentContext'
import Reveal from './Reveal'
import useCopy from './useCopy'
import { Crosses } from './Motifs'

const field =
  'mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30'

export default function Contact() {
  const { profile, sections, contact } = useContent()
  const [copied, copy] = useCopy(profile.email)
  const [status, setStatus] = useState('idle') // idle | sending | sent | gmail | error
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (String(f.get('_gotcha') || '')) return setStatus('sent') // anti-spam (honeypot)

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
      // Cadangan bila formEndpoint belum diisi: buka tab Gmail dengan pesan sudah terisi.
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
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-hidden border-t border-slate-200 bg-slate-50">
      <Crosses className="inset-y-0 right-0 w-2/3" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:gap-16">
        <Reveal>
          <h2 id="contact-heading" className="text-3xl font-semibold">{sections.contact.title}</h2>
          <p className="mt-4 leading-relaxed">{sections.contact.description}</p>

          {profile.email && (
            <>
              <button
                type="button"
                onClick={copy}
                className="mt-8 flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <Mail size={18} className="text-slate-500" aria-hidden="true" />
                  <span className="font-mono text-sm text-slate-900">{profile.email}</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  {copied ? <Check size={16} className="text-status" /> : <Copy size={16} />}
                  {copied ? 'Tersalin' : 'Salin'}
                </span>
              </button>
              <span className="sr-only" role="status" aria-live="polite">{copied ? 'Alamat email tersalin' : ''}</span>
            </>
          )}

          {(profile.linkedin || profile.resume) && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand hover:underline">
                  <Linkedin size={16} aria-hidden="true" /> LinkedIn
                </a>
              )}
              {profile.resume && (
                <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand hover:underline">
                  <Download size={16} aria-hidden="true" /> Resume / CV (PDF)
                </a>
              )}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-lg border border-slate-200 bg-white p-6 md:p-8">
            {done ? (
              <motion.div role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="py-8 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.1 }} />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold">{status === 'gmail' ? 'Gmail dibuka' : 'Pesan terkirim'}</h3>
                <p className="mt-2 text-sm">
                  {status === 'gmail'
                    ? 'Tekan Kirim di tab Gmail untuk menyelesaikan. Jika tab tidak terbuka, salin alamat email di samping.'
                    : 'Terima kasih. Pesan Anda sudah masuk ke email saya.'}
                </p>
                <button type="button" onClick={() => setStatus('idle')} className="mt-6 text-sm font-medium text-brand hover:underline">
                  Kirim pesan lain
                </button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-slate-900">Nama</label>
                  <input id="name" name="name" type="text" required maxLength={100} autoComplete="name" className={field} />
                </div>
                <div>
                  <label htmlFor="contact" className="text-sm font-medium text-slate-900">Email atau organisasi</label>
                  <input id="contact" name="contact" type="text" required maxLength={200} autoComplete="email" className={field} />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-slate-900">Pesan</label>
                  <textarea id="message" name="message" rows={5} required minLength={5} maxLength={4000} className={field} />
                </div>
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="_gotcha">Jangan diisi</label>
                  <input id="_gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                {status === 'error' && (
                  <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-800">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-80"
                >
                  {status === 'sending' ? (
                    <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Mengirim…</>
                  ) : (
                    <><Send size={16} aria-hidden="true" /> Kirim pesan</>
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
