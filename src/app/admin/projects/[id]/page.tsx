import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectForAdmin, getProjectUpdates } from '@/lib/projects/queries'
import { createClient } from '@/lib/supabase/server'
import { EditProjectForm } from './EditProjectForm'
import { PostUpdateForm } from './PostUpdateForm'
import { UpdatesFeed } from '@/components/portal/UpdatesFeed'

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectForAdmin(id)
  if (!project) return notFound()

  const updates = await getProjectUpdates(id)

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ticketsData } = await (supabase as any)
    .from('tickets')
    .select('id, ticket_number, subject, status, priority, created_at')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  const projectTickets = (ticketsData || []) as Array<{
    id: string
    ticket_number: string
    subject: string
    status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
    priority: 'low' | 'normal' | 'high' | 'urgent'
    created_at: string
  }>

  const clientName = project.client
    ? `${project.client.first_name ?? ''} ${project.client.last_name ?? ''}`.trim() || project.client.email
    : 'Unknown'

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/projects" className="text-sm text-slate-500 hover:text-emerald-400">
          ← All projects
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
      <p className="text-slate-400 mb-8">Client: {clientName}</p>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Edit details</h2>
          <EditProjectForm project={project} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Post update</h2>
          <PostUpdateForm projectId={project.id} />

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">Timeline</h2>
          <UpdatesFeed updates={updates} />

          <h2 className="text-lg font-semibold text-white mt-8 mb-4">Tickets</h2>
          {projectTickets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-500 text-center">
              No tickets on this project yet.
            </div>
          ) : (
            <ul className="space-y-2">
              {projectTickets.map(t => (
                <li key={t.id}>
                  <Link
                    href={`/admin/tickets/${t.id}`}
                    className="block rounded-lg border border-slate-800 bg-slate-900/60 p-3 hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{t.ticket_number}</span>
                          <span>·</span>
                          <span>{new Date(t.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm text-slate-200 mt-0.5 truncate">{t.subject}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
