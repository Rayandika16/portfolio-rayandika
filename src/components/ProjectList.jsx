import { useCallback, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'
import CaseStudyModal from './CaseStudyModal'

// "CV Hamparan Artha Citra" -> "HA", "NPL Indo" -> "NI", "DOS" -> "DO"
const initialsOf = (name = '') => {
  const w = name.replace(/^(cv|pt)\.?\s+/i, '').trim().split(/\s+/).filter(Boolean)
  const t = w.length > 1 ? w[0][0] + w[1][0] : (w[0] || '?').slice(0, 2)
  return t.toUpperCase()
}

function LogoTile({ logo, name }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white md:h-[4.5rem] md:w-[4.5rem]">
      {logo && !failed ? (
        <img src={logo} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-contain p-2.5" />
      ) : (
        <span className="font-mono text-lg font-medium text-slate-500" aria-hidden="true">{initialsOf(name)}</span>
      )}
    </span>
  )
}

function ProjectRow({ project, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group -mx-3 flex w-[calc(100%+1.5rem)] items-start gap-5 rounded-lg px-3 py-6 text-left transition-colors hover:bg-white"
    >
      <LogoTile logo={project.logo} name={project.client || project.title} />
      <span className="min-w-0 flex-1">
        {project.client && <span className="block text-sm text-slate-500">{project.client}</span>}
        <span className="mt-0.5 block text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-brand">{project.title}</span>
        <span className="mt-1.5 block text-sm leading-relaxed text-slate-600">{project.short || project.description}</span>
      </span>
      <ArrowUpRight size={18} className="mt-1 shrink-0 text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden="true" />
    </button>
  )
}

export default function ProjectList({ projects }) {
  const [active, setActive] = useState(null)
  const close = useCallback(() => setActive(null), [])

  return (
    <>
      <ul className="grid gap-x-14 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.id} delay={(i % 2) * 0.06} className="border-t border-slate-200">
            <ProjectRow project={p} onOpen={() => setActive(p)} />
          </Reveal>
        ))}
      </ul>
      <CaseStudyModal study={active} onClose={close} />
    </>
  )
}
