import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PortalSidebar } from './PortalSidebar'

interface Profile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  role: 'client' | 'admin' | 'superadmin'
  company_name: string | null
  phone: string | null
  industry: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export default async function PortalLayout({
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <PortalSidebar user={user} profile={profile} />
        <main className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  )
}
