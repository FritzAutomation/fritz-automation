import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './AdminSidebar'

interface Profile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  role: 'client' | 'admin' | 'superadmin'
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let profile: Profile | null = null

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    profile = data
  } catch {
    // Profile might not exist yet
  }

  // Check if user is admin
  if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
    redirect('/portal')
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        <AdminSidebar user={user} profile={profile} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
