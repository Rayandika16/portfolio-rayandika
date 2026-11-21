import { useCallback, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'
import CaseStudyModal from './CaseStudyModal'

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
        <img
          src={logo}
          alt={name ? `Logo ${name}` : ''}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-2.5"
        />
      ) : (
        <span className="font-mono text-lg font-medium text-slate-500" aria-hidden="true">
          {initialsOf(name)}
        </span>
      )}
    </span>
  )
}

function ProjectRow({ project, onOpen }) {
  return (
    <article className="group relative -mx-3 flex w-[calc(100%+1.5rem)] items-start gap-5 rounded-lg px-3 py-6 text-left transition-colors hover:bg-white">
      <LogoTile logo={project.logo} name={project.client || project.title} />
      <div className="min-w-0 flex-1">
        {project.client && <p className="text-sm text-slate-500">{project.client}</p>}
        <h3 className="mt-0.5 text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-brand">
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="text-left focus:outline-none after:absolute after:inset-0"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          {project.short || project.description}
        </p>
        {Array.isArray(project.stack) && project.stack.length > 0 && (
          <ul aria-label="Teknologi" className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((tech) => (
              <li
                key={tech}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
      </div>
      <ArrowUpRight
        size={18}
        className="mt-1 shrink-0 text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
        aria-hidden="true"
      />
    </article>
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