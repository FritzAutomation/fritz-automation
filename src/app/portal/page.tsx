import { createClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/portal/ProjectCard'
import type { Project, Profile } from '@/types/database'

export default async function PortalDashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const showNoProjectsError = params.error === 'no-projects'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  let projects: Project[] = []
  let profile: Profile | null = null

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any

    const projectsResult = await sb
      .from('projects')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })

    projects = projectsResult.data || []

    const profileResult = await sb
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    profile = profileResult.data
  } catch {
    // Tables may not exist yet in this environment
  }

  const firstName = profile?.first_name || 'there'
  const activeCount = projects.filter(p => p.status !== 'completed' && p.status !== 'on_hold').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Hi {firstName}
        </h1>
        <p className="text-slate-600 mt-1">
          {activeCount > 0
            ? `Here's where your ${activeCount === 1 ? 'project stands' : `${activeCount} projects stand`}.`
            : 'No active projects yet. I\u2019ll post here when we kick off.'}
        </p>
      </div>

      {showNoProjectsError && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          You don&apos;t have any projects yet, so there&apos;s nothing to scope a ticket to. I&apos;ll reach out when we kick off.
        </div>
      )}

      {projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <h2 className="font-semibold text-slate-900 mb-2">No projects yet</h2>
          <p className="text-sm text-slate-600">
            Once we kick off a project together, it&apos;ll show up here with its status and progress updates.
          </p>
        </div>
      )}
    </div>
  )
}
