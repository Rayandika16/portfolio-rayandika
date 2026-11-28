import { useId, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2, Upload } from 'lucide-react'
import { uploadMedia } from '../lib/media'
import { Button } from '../components/ui/button'
import { inputVariants } from '../components/ui/input'
import { textareaVariants } from '../components/ui/textarea'
import { cn } from '../lib/utils'

export const inputCls = inputVariants

export function Field({ label, hint, value, onChange, textarea = false, rows = 3, type = 'text', placeholder, maxLength }) {
  const id = useId()
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <Tag
        id={id}
        type={textarea ? undefined : type}
        rows={textarea ? rows : undefined}
        value={value ?? ''}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={cn(textarea ? textareaVariants : inputVariants, 'mt-2')}
        aria-describedby={hint ? `${id}-h` : undefined}
      />
      {hint && <p id={`${id}-h`} className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function SelectField({ label, value, onChange, options }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputVariants, 'mt-2')}>
        {options.map((o) => (
          <option key={o} value={o} className="bg-popover text-popover-foreground">
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

// Satu baris = satu item. Nilai disimpan sebagai array; join/split menjaga baris kosong saat mengetik.
export function LinesField({ label, hint, value, onChange, rows = 4 }) {
  return (
    <Field
      label={label}
      hint={hint ?? 'Satu item per baris.'}
      textarea
      rows={rows}
      value={(value || []).join('\n')}
      onChange={(t) => onChange(t.split('\n'))}
    />
  )
}

export function Toggle({ label, checked, onChange }) {
  const id = useId()
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground">
      <input
        id={id}
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-input accent-primary focus-visible:ring-2 focus-visible:ring-ring"
      />
      {label}
    </label>
  )
}

export function Panel({ title, description, children }) {
  return (
    <section
      data-slot="card"
      className="rounded-2xl bg-card p-5 text-card-foreground ring-1 ring-foreground/10 md:p-6"
    >
      <h2 className="text-base font-semibold text-card-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

const iconBtn =
  'rounded-4xl p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent'

export function ListEditor({ items, onChange, newItem, addLabel, title, render, keyOf, defaultOpen = false }) {
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const a = [...items]
    ;[a[i], a[j]] = [a[j], a[i]]
    onChange(a)
  }
  const patch = (i, p) => onChange(items.map((it, k) => (k === i ? { ...it, ...p } : it)))
  const remove = (i) => { if (window.confirm('Hapus item ini?')) onChange(items.filter((_, k) => k !== i)) }
  const stop = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn() }

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <details
          key={keyOf ? keyOf(it, i) : i}
          open={defaultOpen}
          className="overflow-hidden rounded-2xl border border-border bg-background/60"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:ring-inset focus-visible:ring-offset-0">
            <span className="truncate">{title(it, i)}</span>
            <span className="flex shrink-0 items-center gap-0.5">
              <button type="button" className={iconBtn} disabled={i === 0} onClick={stop(() => move(i, -1))} aria-label="Pindah ke atas"><ArrowUp size={16} /></button>
              <button type="button" className={iconBtn} disabled={i === items.length - 1} onClick={stop(() => move(i, 1))} aria-label="Pindah ke bawah"><ArrowDown size={16} /></button>
              <button type="button" className={`${iconBtn} hover:!bg-destructive/10 hover:!text-destructive`} onClick={stop(() => remove(i))} aria-label="Hapus"><Trash2 size={16} /></button>
            </span>
          </summary>
          <div className="space-y-4 border-t border-border p-4">{render(it, (p) => patch(i, p), i)}</div>
        </details>
      ))}
      <Button type="button" variant="outline" onClick={() => onChange([...items, newItem()])}>
        <Plus size={16} aria-hidden="true" /> {addLabel}
      </Button>
    </div>
  )
}

export function FileField({ label, hint, value, onChange, kind = 'image', alt, onAlt, wide = true }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pick = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    setErr('')
    try {
      onChange(await uploadMedia(f, kind))
    } catch (x) {
      setErr(x.message)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
        {kind === 'image' && (
          <div
            className={`flex w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/70 ${
              wide ? 'aspect-video sm:w-56' : 'h-20 w-20'
            }`}
          >
            {value ? (
              <img src={value} alt="" className={`h-full w-full ${wide ? 'object-cover' : 'object-contain p-2'}`} />
            ) : (
              <span className="px-2 text-center text-xs text-muted-foreground">Belum ada gambar</span>
            )}
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex flex-wrap gap-2">
            <input
              ref={input}
              type="file"
              accept={kind === 'pdf' ? 'application/pdf' : 'image/png,image/jpeg,image/webp,image/gif'}
              onChange={pick}
              className="sr-only"
              aria-label={`Pilih file untuk ${label}`}
            />
            <Button type="button" variant="outline" onClick={() => input.current?.click()} disabled={busy}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {busy ? 'Mengunggah…' : kind === 'pdf' ? 'Unggah PDF' : 'Unggah gambar'}
            </Button>
            {value && (
              <Button type="button" variant="destructive" onClick={() => onChange('')}>
                Hapus
              </Button>
            )}
          </div>
          <input
            type="text"
            aria-label={`${label} (URL)`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="atau tempel URL (https://… atau /images/…)"
            className={inputCls}
          />
          {onAlt && (
            <input
              type="text"
              aria-label="Deskripsi gambar (alt)"
              value={alt || ''}
              onChange={(e) => onAlt(e.target.value)}
              placeholder="Deskripsi singkat gambar untuk pembaca layar"
              className={inputCls}
            />
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          {err && <p role="alert" className="text-xs font-medium text-destructive">{err}</p>}
        </div>
      </div>
    </div>
  )
}
