import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewTicketForm } from './NewTicketForm'

export const metadata: Metadata = {
  title: 'New Ticket',
  description: 'Create a new support ticket',
}

interface PageProps {
  searchParams: Promise<{ project?: string }>
}

export default async function NewTicketPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: projects } = await (supabase as any)
    .from('projects')
    .select('id, title, status')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const clientProjects = (projects || []) as { id: string; title: string; status: string }[]

  // If client has no projects, there's nothing they can scope a ticket to.
  // Redirect back to dashboard with an explanatory message.
  if (clientProjects.length === 0) {
    redirect('/portal?error=no-projects')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Ticket</h1>
        <p className="text-slate-600 mt-1">Submit a support request scoped to one of your projects</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <NewTicketForm projects={clientProjects} defaultProjectId={params.project} />
      </div>
    </div>
  )
}
