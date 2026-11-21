// Membersihkan & memvalidasi konten sebelum disimpan (admin) dan sebelum ditampilkan (publik).
// Tujuan: data yang rusak/berbahaya (mis. tautan javascript:) tidak pernah sampai ke halaman.

const str = (v, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const text = (v, max = 3000) => (typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim().slice(0, max) : '')
const strList = (v, max = 30, len = 400) =>
  Array.isArray(v) ? v.map((x) => str(x, len)).filter(Boolean).slice(0, max) : []
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {})
const list = (v, max, fn) => (Array.isArray(v) ? v.slice(0, max).map(fn) : [])

// Izinkan path internal (/images/a.png) atau http(s). Tolak javascript:, data:, //host, dll.
export function safeUrl(v) {
  const s = str(v, 1000)
  if (!s) return ''
  if (/^\/(?!\/)[A-Za-z0-9._~\-/%]*$/.test(s) && !s.includes('..')) return s
  try {
    const u = new URL(s)
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : ''
  } catch {
    return ''
  }
}

export function httpsUrl(v) {
  const s = str(v, 1000)
  if (!s) return ''
  try {
    const u = new URL(s)
    return u.protocol === 'https:' ? u.toString() : ''
  } catch {
    return ''
  }
}

const newId = () => String(globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)).replace(/-/g, '').slice(0, 8)
const id = (v) => str(v, 40).replace(/[^A-Za-z0-9_-]/g, '') || newId()

const TYPES = ['Sertifikasi', 'Pelatihan']

// Isi field yang hilang dari konten bawaan.
export function mergeContent(def, val) {
  if (Array.isArray(def)) return Array.isArray(val) ? val : def
  if (def && typeof def === 'object') {
    const v = val && typeof val === 'object' ? val : {}
    const out = {}
    for (const k of Object.keys(def)) out[k] = mergeContent(def[k], v[k])
    return out
  }
  return typeof val === typeof def ? val : def
}

export function sanitizeContent(input) {
  const i = obj(input)
  const p = obj(i.profile)
  const h = obj(i.hero)
  const s = obj(i.sections)
  const sw = obj(s.work)
  const sp = obj(s.projectsPage)
  const sc = obj(s.certifications)
  const sk = obj(s.contact)

  return {
    profile: {
      name: str(p.name, 80),
      title: str(p.title, 120),
      email: str(p.email, 160),
      linkedin: safeUrl(p.linkedin),
      resume: safeUrl(p.resume),
    },
    hero: {
      badge: str(h.badge, 200),
      headline: text(h.headline, 400),
      subheadline: text(h.subheadline, 800),
      primaryCta: str(h.primaryCta, 60),
    },
    credibility: list(i.credibility, 6, (r) => ({ label: str(obj(r).label, 60), value: str(obj(r).value, 200) })).filter(
      (r) => r.label || r.value
    ),
    sections: {
      work: { title: str(sw.title, 120), description: text(sw.description, 600), cta: str(sw.cta, 60) },
      projectsPage: { title: str(sp.title, 120), description: text(sp.description, 600) },
      certifications: { title: str(sc.title, 120), description: text(sc.description, 600) },
      contact: { title: str(sk.title, 160), description: text(sk.description, 600) },
    },
    projects: list(i.projects, 30, (x) => {
      const o = obj(x)
      return {
        id: id(o.id),
        title: str(o.title, 160),
        client: str(o.client, 160),
        domain: str(o.domain, 200),
        short: str(o.short, 200),
        logo: safeUrl(o.logo),
        description: text(o.description, 1500),
        stack: strList(o.stack, 14, 60),
        image: safeUrl(o.image),
        imageAlt: str(o.imageAlt, 200),
        github: safeUrl(o.github),
        demo: safeUrl(o.demo),
        visible: o.visible !== false,
      }
    }).filter((x) => x.title),
    credentials: list(i.credentials, 30, (x) => {
      const o = obj(x)
      return {
        id: id(o.id),
        type: TYPES.includes(o.type) ? o.type : 'Sertifikasi',
        title: str(o.title, 160),
        issuer: str(o.issuer, 160),
        year: str(o.year, 20),
        description: text(o.description, 1200),
        image: safeUrl(o.image),
        imageAlt: str(o.imageAlt, 200),
        url: safeUrl(o.url),
      }
    }).filter((x) => x.title),
    contact: { formEndpoint: httpsUrl(obj(i.contact).formEndpoint) },
    footer: { text: str(obj(i.footer).text, 300) },
  }
}
