import Link from 'next/link'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import type { Project } from '@/types/database'

function formatDate(dateString: string | null): string | null {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ProjectCard({ project }: { project: Project }) {
  const start = formatDate(project.start_date)
  const target = formatDate(project.target_date)

  return (
    <Link
      href={`/portal/projects/${project.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 truncate">{project.title}</h3>
          {project.description && (
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      {(start || target) && (
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          {start && <span>Started {start}</span>}
          {target && <span>Target {target}</span>}
        </div>
      )}
    </Link>
  )
}
