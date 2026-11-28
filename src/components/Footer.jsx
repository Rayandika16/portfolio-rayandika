import { useContent } from '../content/ContentContext'

export default function Footer() {
  const { footer } = useContent()
  return (
    <footer className="border-t border-border bg-background">
      <p className="mx-auto max-w-6xl px-6 py-7 text-sm text-muted-foreground">{footer.text}</p>
    </footer>
  )
}
