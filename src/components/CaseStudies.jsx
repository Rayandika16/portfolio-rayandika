import { ArrowRight } from 'lucide-react'
import { useContent } from '../content/ContentContext'
import { Link } from '../router'
import Reveal from './Reveal'
import ProjectList from './ProjectList'
import { LineGrid } from './Motifs'
import { buttonVariants } from './ui/button'

const LIMIT = 4

export default function CaseStudies() {
  const { sections, projects } = useContent()
  const visible = projects.filter((p) => p.visible !== false)
  const top = visible.slice(0, LIMIT)

  return (
    <section id="work" aria-labelledby="work-heading" className="relative overflow-hidden border-b border-border bg-muted/35">
      <LineGrid className="inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <Reveal className="max-w-2xl">
          <h2 id="work-heading" className="text-3xl font-semibold">{sections.work.title}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{sections.work.description}</p>
        </Reveal>

        <div className="mt-12">
          <ProjectList projects={top} />
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/projects"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className: 'group bg-card/85 backdrop-blur-sm',
            })}
          >
            {sections.work.cta}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          {visible.length > LIMIT && (
            <p className="text-sm text-muted-foreground">Menampilkan {LIMIT} dari {visible.length} proyek</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
