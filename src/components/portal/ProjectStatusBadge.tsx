import type { ProjectStatus } from '@/types/database'

const STATUS_STYLES: Record<ProjectStatus, { label: string; className: string }> = {
  proposed: {
    label: 'Proposed',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  approved: {
    label: 'Approved',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  in_review: {
    label: 'In Review',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  on_hold: {
    label: 'On Hold',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { label, className } = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  )
}
