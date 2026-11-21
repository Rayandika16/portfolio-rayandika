import { useContent } from '../content/ContentContext'

export default function Footer() {
  const { footer } = useContent()
  return (
    <footer className="border-t border-slate-200 bg-white">
      <p className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500">{footer.text}</p>
    </footer>
  )
}
