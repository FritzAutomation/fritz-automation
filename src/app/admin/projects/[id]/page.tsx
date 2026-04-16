import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectForAdmin, getProjectUpdates } from '@/lib/projects/queries'
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
        </section>
      </div>
    </div>
  )
}
