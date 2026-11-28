import { useCallback, useEffect, useMemo, useState } from 'react'
import { ExternalLink, Loader2, LogOut, Save } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { fetchContent, normalizeContent, saveContent } from '../lib/contentApi'
import { sanitizeContent } from '../lib/sanitize'
import { DEFAULT_CONTENT } from '../data/content'
import ThemeToggle from '../components/ThemeToggle'
import { Button, buttonVariants } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Field, FileField, LinesField, ListEditor, Panel, SelectField, Toggle, inputCls } from './ui'

const TABS = [
  ['umum', 'Profil & Hero'],
  ['teks', 'Judul Bagian'],
  ['proyek', 'Proyek'],
  ['sertifikasi', 'Sertifikasi'],
  ['kontak', 'Kontak & Footer'],
]

const newId = () => Math.random().toString(36).slice(2, 10)

const Screen = ({ children }) => (
  <main className="relative flex min-h-screen items-center justify-center bg-muted/35 px-4 py-10">
    <div className="fixed right-4 top-4 z-20">
      <ThemeToggle />
    </div>
    {children}
  </main>
)

function NotConfigured() {
  return (
    <Screen>
      <Card className="w-full max-w-lg gap-3 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-card-foreground">Supabase belum dikonfigurasi</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Isi <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">VITE_SUPABASE_URL</code> dan{' '}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">VITE_SUPABASE_PUBLISHABLE_KEY</code> di file{' '}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">.env</code>{' '}
          (dan di Environment Variables Vercel), lalu jalankan ulang. Langkah lengkap ada di README.
        </p>
        <a href="/" className="mt-2 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground">
          ← Kembali ke website
        </a>
      </Card>
    </Screen>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw })
    if (error) setErr(/invalid login/i.test(error.message) ? 'Email atau kata sandi salah.' : error.message)
    setBusy(false)
  }

  return (
    <Screen>
      <Card className="w-full max-w-sm gap-0 p-6 shadow-sm">
        <form onSubmit={submit}>
          <h1 className="text-xl font-semibold text-card-foreground">Panel Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Masuk untuk mengubah isi website.</p>
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="em" className="text-sm font-medium text-card-foreground">Email</label>
              <input
                id="em"
                type="email"
                autoComplete="username"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputCls} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="pw" className="text-sm font-medium text-card-foreground">Kata sandi</label>
              <input
                id="pw"
                type="password"
                autoComplete="current-password"
                required
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className={`${inputCls} mt-2`}
              />
            </div>
          </div>
          {err && (
            <p role="alert" className="mt-4 rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive">
              {err}
            </p>
          )}
          <Button type="submit" size="lg" disabled={busy} className="mt-6 w-full">
            {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />} Masuk
          </Button>
          <a href="/" className="mt-4 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground">
            ← Kembali ke website
          </a>
        </form>
      </Card>
    </Screen>
  )
}

/* ------------------------- Tab: Profil & Hero ------------------------- */
function TabUmum({ d, upd }) {
  return (
    <div className="space-y-6">
      <Panel title="Profil">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nama" value={d.profile.name} onChange={(v) => upd((n) => (n.profile.name = v))} />
          <Field label="Jabatan singkat (navbar)" value={d.profile.title} onChange={(v) => upd((n) => (n.profile.title = v))} />
          <Field label="Email (Gmail)" type="email" value={d.profile.email} onChange={(v) => upd((n) => (n.profile.email = v))} hint="Tampil di bagian kontak dan dipakai sebagai tujuan pesan." />
          <Field label="LinkedIn (URL)" value={d.profile.linkedin} onChange={(v) => upd((n) => (n.profile.linkedin = v))} placeholder="https://www.linkedin.com/in/…" hint="Kosongkan untuk menyembunyikan." />
        </div>
        <FileField label="Resume / CV (PDF)" kind="pdf" value={d.profile.resume} onChange={(v) => upd((n) => (n.profile.resume = v))} hint="Kosongkan untuk menyembunyikan tautan CV." />
      </Panel>

      <Panel title="Hero (bagian paling atas)">
        <Field label="Lencana ketersediaan" value={d.hero.badge} onChange={(v) => upd((n) => (n.hero.badge = v))} hint="Kosongkan untuk menyembunyikan." />
        <Field label="Judul utama" textarea rows={3} value={d.hero.headline} onChange={(v) => upd((n) => (n.hero.headline = v))} />
        <Field label="Sub-judul" textarea rows={4} value={d.hero.subheadline} onChange={(v) => upd((n) => (n.hero.subheadline = v))} />
        <Field label="Teks tombol utama" value={d.hero.primaryCta} onChange={(v) => upd((n) => (n.hero.primaryCta = v))} />
      </Panel>

      <Panel title="Strip kredibilitas (di bawah hero)">
        <ListEditor
          items={d.credibility}
          onChange={(rows) => upd((n) => (n.credibility = rows))}
          newItem={() => ({ label: '', value: '' })}
          addLabel="Tambah item"
          title={(r) => r.label || 'Item baru'}
          defaultOpen
          render={(r, p) => (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Label" value={r.label} onChange={(v) => p({ label: v })} />
              <Field label="Isi" value={r.value} onChange={(v) => p({ value: v })} />
            </div>
          )}
        />
      </Panel>
    </div>
  )
}

/* ------------------------- Tab: Judul Bagian ------------------------- */
function TabTeks({ d, upd }) {
  const S = d.sections
  return (
    <div className="space-y-6">
      <Panel title="Karya pilihan (beranda)">
        <Field label="Judul" value={S.work.title} onChange={(v) => upd((n) => (n.sections.work.title = v))} />
        <Field label="Deskripsi" textarea rows={3} value={S.work.description} onChange={(v) => upd((n) => (n.sections.work.description = v))} />
        <Field label="Teks tombol “lihat semua”" value={S.work.cta} onChange={(v) => upd((n) => (n.sections.work.cta = v))} />
      </Panel>
      <Panel title="Halaman semua proyek">
        <Field label="Judul" value={S.projectsPage.title} onChange={(v) => upd((n) => (n.sections.projectsPage.title = v))} />
        <Field label="Deskripsi" textarea rows={3} value={S.projectsPage.description} onChange={(v) => upd((n) => (n.sections.projectsPage.description = v))} />
      </Panel>
      <Panel title="Sertifikasi dan pelatihan">
        <Field label="Judul" value={S.certifications.title} onChange={(v) => upd((n) => (n.sections.certifications.title = v))} />
        <Field label="Deskripsi" textarea rows={3} value={S.certifications.description} onChange={(v) => upd((n) => (n.sections.certifications.description = v))} />
      </Panel>
      <Panel title="Kontak">
        <Field label="Judul" value={S.contact.title} onChange={(v) => upd((n) => (n.sections.contact.title = v))} />
        <Field label="Deskripsi" textarea rows={3} value={S.contact.description} onChange={(v) => upd((n) => (n.sections.contact.description = v))} />
      </Panel>
    </div>
  )
}

/* ------------------------- Tab: Proyek ------------------------- */
function TabProyek({ d, upd }) {
  return (
    <Panel title="Daftar proyek" description="Urutan di sini = urutan di website. Beranda menampilkan 4 proyek teratas yang tidak disembunyikan; halaman “Semua proyek” menampilkan semuanya.">
      <ListEditor
        items={d.projects}
        onChange={(rows) => upd((n) => (n.projects = rows))}
        keyOf={(p) => p.id}
        newItem={() => ({
          id: newId(), title: 'Proyek baru', client: '', domain: '', short: '', logo: '', description: '',
          stack: [], image: '', imageAlt: '', github: '', demo: '', visible: true,
        })}
        addLabel="Tambah proyek"
        title={(p) => `${p.title || 'Tanpa judul'}${p.visible === false ? '  (disembunyikan)' : ''}`}
        render={(p, set) => (
          <>
            <Toggle label="Tampilkan di website" checked={p.visible !== false} onChange={(v) => set({ visible: v })} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Judul proyek" value={p.title} onChange={(v) => set({ title: v })} />
              <Field label="Perusahaan / klien" value={p.client} onChange={(v) => set({ client: v })} />
            </div>
            <Field label="Bidang" value={p.domain} onChange={(v) => set({ domain: v })} />
            <FileField label="Logo perusahaan" kind="image" wide={false} value={p.logo} onChange={(v) => set({ logo: v })} hint="Kosongkan untuk menampilkan inisial perusahaan." />
            <Field label="Keterangan singkat (di daftar)" value={p.short} onChange={(v) => set({ short: v })} hint="Satu kalimat: apa yang Anda buat." maxLength={200} />
            <FileField label="Foto proyek (di modal)" kind="image" value={p.image} onChange={(v) => set({ image: v })} alt={p.imageAlt} onAlt={(v) => set({ imageAlt: v })} hint="Rasio 16:9 paling rapi. JPG, PNG, WebP, atau GIF, maks. 5 MB." />
            <Field label="Penjelasan (di modal)" textarea rows={4} value={p.description} onChange={(v) => set({ description: v })} />
            <LinesField label="Teknologi yang dipakai" rows={4} value={p.stack} onChange={(v) => set({ stack: v })} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Tombol GitHub (URL)" value={p.github} onChange={(v) => set({ github: v })} placeholder="https://github.com/…" hint="Kosong = tombol tampil nonaktif." />
              <Field label="Tombol Demo (URL)" value={p.demo} onChange={(v) => set({ demo: v })} placeholder="https://…" hint="Kosong = tombol tampil nonaktif." />
            </div>
          </>
        )}
      />
    </Panel>
  )
}

/* ------------------------- Tab: Sertifikasi ------------------------- */
function TabSertifikasi({ d, upd }) {
  return (
    <Panel title="Sertifikasi dan pelatihan" description="Klik sebuah baris di website untuk melihat foto dan penjelasannya. Kosongkan daftar ini untuk menyembunyikan seluruh bagian.">
      <ListEditor
        items={d.credentials}
        onChange={(rows) => upd((n) => (n.credentials = rows))}
        keyOf={(c) => c.id}
        newItem={() => ({ id: newId(), type: 'Sertifikasi', title: 'Sertifikasi baru', issuer: '', year: '', description: '', image: '', imageAlt: '', url: '' })}
        addLabel="Tambah sertifikasi / pelatihan"
        title={(c) => `${c.title || 'Tanpa judul'}  ·  ${c.type}`}
        render={(c, set) => (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Jenis" value={c.type} onChange={(v) => set({ type: v })} options={['Sertifikasi', 'Pelatihan']} />
              <Field label="Tahun" value={c.year} onChange={(v) => set({ year: v })} placeholder="2025" />
            </div>
            <Field label="Nama" value={c.title} onChange={(v) => set({ title: v })} />
            <Field label="Penerbit / penyelenggara" value={c.issuer} onChange={(v) => set({ issuer: v })} />
            <FileField label="Foto sertifikat" kind="image" value={c.image} onChange={(v) => set({ image: v })} alt={c.imageAlt} onAlt={(v) => set({ imageAlt: v })} />
            <Field label="Penjelasan singkat" textarea rows={3} value={c.description} onChange={(v) => set({ description: v })} />
            <Field label="Tautan verifikasi (opsional)" value={c.url} onChange={(v) => set({ url: v })} placeholder="https://…" />
          </>
        )}
      />
    </Panel>
  )
}

/* ------------------------- Tab: Kontak & Footer ------------------------- */
function TabKontak({ d, upd }) {
  return (
    <div className="space-y-6">
      <Panel title="Formulir kontak" description="Agar pesan pengunjung langsung masuk ke Gmail Anda, isi URL form dari Formspree (lihat README). Kosong = tombol kirim membuka tab Gmail pengunjung.">
        <Field label="URL Formspree" value={d.contact.formEndpoint} onChange={(v) => upd((n) => (n.contact.formEndpoint = v))} placeholder="https://formspree.io/f/xxxxxxx" hint="Harus diawali https://" />
      </Panel>
      <Panel title="Footer">
        <Field label="Teks footer" value={d.footer.text} onChange={(v) => upd((n) => (n.footer.text = v))} />
      </Panel>
    </div>
  )
}

/* ------------------------- Dashboard ------------------------- */
function Dashboard() {
  const [draft, setDraft] = useState(null)
  const [savedStr, setSavedStr] = useState('')
  const [tab, setTab] = useState('umum')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ type: '', text: '' })
  const [loadErr, setLoadErr] = useState('')

  useEffect(() => {
    fetchContent({ timeoutMs: 10000 })
      .then((raw) => {
        const c = normalizeContent(raw ?? DEFAULT_CONTENT)
        setDraft(c)
        setSavedStr(JSON.stringify(c))
      })
      .catch((e) => setLoadErr(e.message || 'Gagal memuat konten.'))
  }, [])

  const dirty = useMemo(() => draft && JSON.stringify(draft) !== savedStr, [draft, savedStr])

  useEffect(() => {
    if (!dirty) return
    const h = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [dirty])

  const upd = useCallback((fn) => setDraft((d) => { const n = structuredClone(d); fn(n); return n }), [])

  const save = async () => {
    setSaving(true)
    setToast({ type: '', text: '' })
    try {
      const clean = sanitizeContent(draft)
      await saveContent(clean)
      setDraft(clean)
      setSavedStr(JSON.stringify(clean))
      setToast({ type: 'ok', text: 'Tersimpan. Perubahan langsung tampil di website (pengunjung yang pernah membuka akan melihatnya setelah memuat ulang).' })
    } catch (e) {
      const denied = e?.code === '42501' || /row-level security/i.test(e?.message || '')
      setToast({ type: 'err', text: denied ? 'Ditolak: akun ini belum terdaftar sebagai admin di database.' : e.message || 'Gagal menyimpan.' })
    } finally {
      setSaving(false)
    }
  }

  const logout = async () => {
    if (dirty && !window.confirm('Ada perubahan yang belum disimpan. Tetap keluar?')) return
    await supabase.auth.signOut()
  }

  if (loadErr) {
    return (
      <Screen>
        <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {loadErr}
        </p>
      </Screen>
    )
  }
  if (!draft) return <Screen><p className="text-sm text-muted-foreground">Memuat…</p></Screen>

  return (
    <div className="min-h-screen bg-muted/35">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h1 className="text-base font-semibold text-foreground">Panel Admin</h1>
          <div className="flex flex-wrap items-center gap-2">
            {dirty && (
              <span className="rounded-4xl bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                Belum disimpan
              </span>
            )}
            <ThemeToggle />
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              <ExternalLink size={15} aria-hidden="true" /> Lihat situs
            </a>
            <Button type="button" variant="ghost" size="sm" onClick={logout}>
              <LogOut size={15} aria-hidden="true" /> Keluar
            </Button>
            <Button type="button" variant="default" size="default" onClick={save} disabled={saving || !dirty}>
              {saving ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />} Simpan
            </Button>
          </div>
        </div>
        <nav aria-label="Bagian" className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 pb-3">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={`whitespace-nowrap rounded-4xl px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === id
                  ? 'bg-secondary text-secondary-foreground ring-1 ring-foreground/10'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div role="status" aria-live="polite">
          {toast.text && (
            <p
              className={`mb-5 rounded-2xl px-4 py-3 text-sm font-medium ${
                toast.type === 'ok'
                  ? 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/25 dark:bg-status/15 dark:text-emerald-300'
                  : 'bg-destructive/10 text-destructive ring-1 ring-destructive/20'
              }`}
            >
              {toast.text}
            </p>
          )}
        </div>
        {tab === 'umum' && <TabUmum d={draft} upd={upd} />}
        {tab === 'teks' && <TabTeks d={draft} upd={upd} />}
        {tab === 'proyek' && <TabProyek d={draft} upd={upd} />}
        {tab === 'sertifikasi' && <TabSertifikasi d={draft} upd={upd} />}
        {tab === 'kontak' && <TabKontak d={draft} upd={upd} />}
      </main>
    </div>
  )
}

/* ------------------------- Pintu masuk ------------------------- */
function Gate() {
  const [session, setSession] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user?.id
  useEffect(() => {
    setIsAdmin(undefined)
    if (!userId) return
    supabase.rpc('is_admin').then(({ data, error }) => setIsAdmin(error ? false : data === true))
  }, [userId])

  if (session === undefined) return <Screen><p className="text-sm text-muted-foreground">Memuat…</p></Screen>
  if (!session) return <Login />
  if (isAdmin === undefined) return <Screen><p className="text-sm text-muted-foreground">Memeriksa akses…</p></Screen>
  if (!isAdmin) {
    return (
      <Screen>
        <Card className="w-full max-w-md gap-3 p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-card-foreground">Akun ini bukan admin</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Anda masuk sebagai <strong className="text-foreground">{session.user.email}</strong>, tetapi akun ini belum terdaftar sebagai admin. Jalankan{' '}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">supabase/make-admin.sql</code> dengan email ini (lihat README).
          </p>
          <div>
            <Button type="button" onClick={() => supabase.auth.signOut()} className="mt-2">
              Keluar
            </Button>
          </div>
        </Card>
      </Screen>
    )
  }
  return <Dashboard />
}

export default function Admin() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Panel Admin'
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex,nofollow'
    document.head.appendChild(m)
    return () => { document.title = prev; m.remove() }
  }, [])

  return isSupabaseConfigured ? <Gate /> : <NotConfigured />
}
