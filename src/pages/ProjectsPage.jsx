import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useContent } from '../content/ContentContext'
import { Link } from '../router'
import Reveal from '../components/Reveal'
import ProjectList from '../components/ProjectList'
import { LineGrid } from '../components/Motifs'

export default function ProjectsPage() {
  const { sections, projects, profile } = useContent()
  const visible = projects.filter((p) => p.visible !== false)

  useEffect(() => {
    const prev = document.title
    document.title = `${sections.projectsPage.title} — ${profile.name}`
    return () => { document.title = prev }
  }, [sections.projectsPage.title, profile.name])

  return (
    <section aria-labelledby="all-heading" className="relative min-h-[70vh] overflow-hidden bg-slate-50">
      <LineGrid className="inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-28">
        <Link to="/#work" className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke beranda
        </Link>

        <Reveal className="mt-8 max-w-2xl">
          <h1 id="all-heading" className="text-3xl font-semibold md:text-4xl">{sections.projectsPage.title}</h1>
          <p className="mt-3">{sections.projectsPage.description}</p>
        </Reveal>

        <div className="mt-10">
          <ProjectList projects={visible} />
        </div>
      </div>
    </section>
  )
}
