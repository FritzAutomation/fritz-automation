import { createClient } from '@/lib/supabase/server'
import { CreateProjectForm } from './CreateProjectForm'

export default async function NewProjectPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: clients } = await (supabase as any)
    .from('profiles')
    .select('id, first_name, last_name, email, company_name')
    .eq('role', 'client')
    .order('email', { ascending: true })

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">New project</h1>
      <CreateProjectForm clients={clients || []} />
    </div>
  )
}
