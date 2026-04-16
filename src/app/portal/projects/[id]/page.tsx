import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProjectStatusBadge } from '@/components/portal/ProjectStatusBadge'
import { UpdatesFeed } from '@/components/portal/UpdatesFeed'
import type { Project, ProjectUpdateWithAuthor } from '@/types/database'

function formatDate(dateString: string | null): string | null {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const projectResult = await sb
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('client_id', user.id)
    .maybeSingle()

  const project = projectResult.data as Project | null
  if (!project) return notFound()

  const updatesResult = await sb
    .from('project_updates')
    .select('*, author:profiles(id, first_name, last_name, role)')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  const updates = (updatesResult.data || []) as ProjectUpdateWithAuthor[]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ticketsResult = await (sb as any)
    .from('tickets')
    .select('id, ticket_number, subject, status, priority, created_at')
    .eq('project_id', id)
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const projectTickets = (ticketsResult.data || []) as Array<{
    id: string
    ticket_number: string
    subject: string
    status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
    priority: 'low' | 'normal' | 'high' | 'urgent'
    created_at: string
  }>

  const start = formatDate(project.start_date)
  const target = formatDate(project.target_date)

  return (
    <div>
      <div className="mb-6">
        <Link href="/portal" className="text-sm text-slate-500 hover:text-primary">
          ← All projects
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
          <ProjectStatusBadge status={project.status} />
        </div>
        {project.description && (
          <p className="text-slate-600 max-w-3xl whitespace-pre-wrap">{project.description}</p>
        )}
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Updates</h2>
          <UpdatesFeed updates={updates} />

          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Tickets</h2>
              <Link
                href={`/portal/tickets/new?project=${project.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                + New ticket
              </Link>
            </div>

            {projectTickets.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-500">
                  No tickets yet. Open one when you need help on this project.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {projectTickets.map(t => (
                  <li key={t.id}>
                    <Link
                      href={`/portal/tickets/${t.id}`}
                      className="block rounded-lg border border-slate-200 bg-white p-3 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{t.ticket_number}</span>
                            <span>·</span>
                            <span>{new Date(t.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="text-sm text-slate-900 mt-0.5 truncate">{t.subject}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {t.status.replace('_', ' ')}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Project details</h3>
            <dl className="space-y-2 text-sm">
              {start && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Started</dt>
                  <dd className="text-slate-900">{start}</dd>
                </div>
              )}
              {target && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Target</dt>
                  <dd className="text-slate-900">{target}</dd>
                </div>
              )}
            </dl>
          </div>

          {project.wave_url && (
            <a
              href={project.wave_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/30 transition-colors"
            >
              <h3 className="text-sm font-semibold text-slate-900">Invoices &amp; Quotes</h3>
              <p className="text-xs text-slate-500 mt-1">Opens in Wave</p>
              <span className="inline-block mt-3 text-sm text-primary">Open in Wave →</span>
            </a>
          )}
        </aside>
      </div>
    </div>
  )
}
