import { ArrowRight } from 'lucide-react'
import { useContent } from '../content/ContentContext'
import { Link } from '../router'
import Reveal from './Reveal'
import ProjectList from './ProjectList'
import { LineGrid } from './Motifs'

const LIMIT = 4

export default function CaseStudies() {
  const { sections, projects } = useContent()
  const visible = projects.filter((p) => p.visible !== false)
  const top = visible.slice(0, LIMIT)

  return (
    <section id="work" aria-labelledby="work-heading" className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
      <LineGrid className="inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <h2 id="work-heading" className="text-3xl font-semibold">{sections.work.title}</h2>
          <p className="mt-3">{sections.work.description}</p>
        </Reveal>

        <div className="mt-10">
          <ProjectList projects={top} />
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            {sections.work.cta}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          {visible.length > LIMIT && <p className="text-sm text-slate-500">Menampilkan {LIMIT} dari {visible.length} proyek</p>}
        </Reveal>
      </div>
    </section>
  )
}
