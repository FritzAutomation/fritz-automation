import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProjectStatusBadge } from '@/components/portal/ProjectStatusBadge'
import { getAllProjectsForAdmin } from '@/lib/projects/queries'

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsForAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">Create, edit, and post updates on client projects.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>+ New project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
          <h2 className="font-semibold text-white">No projects yet</h2>
          <p className="text-sm text-slate-500 mt-2">
            Create your first project to start tracking client work.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Project</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Client</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map((project) => {
                const clientName = project.client
                  ? `${project.client.first_name ?? ''} ${project.client.last_name ?? ''}`.trim() || project.client.email
                  : 'Unknown'
                return (
                  <tr key={project.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm font-medium text-white hover:text-emerald-400"
                      >
                        {project.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{clientName}</td>
                    <td className="px-4 py-3">
                      <ProjectStatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
