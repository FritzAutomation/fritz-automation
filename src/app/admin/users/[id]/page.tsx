import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { UserRoleForm } from './UserRoleForm'

interface Profile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  role: string
  company_name: string | null
  phone: string | null
  industry: string | null
  created_at: string
  updated_at: string
}

interface Ticket {
  id: string
  ticket_number: string
  subject: string
  status: string
  created_at: string
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  let user: Profile | null = null
  let tickets: Ticket[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any

    const { data: userData } = await sb
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    user = userData

    if (user) {
      const { data: ticketsData } = await sb
        .from('tickets')
        .select('*')
        .eq('client_id', id)
        .order('created_at', { ascending: false })
        .limit(10)

      tickets = ticketsData || []
    }
  } catch {
    // Database might not exist yet
  }

  if (!user) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-400'
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400'
      case 'resolved': return 'bg-green-500/20 text-green-400'
      case 'closed': return 'bg-slate-500/20 text-slate-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-red-500/20 text-red-400'
      case 'admin': return 'bg-orange-500/20 text-orange-400'
      case 'client': return 'bg-blue-500/20 text-blue-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/users" className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Users
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* User Info */}
        <div className="col-span-2">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user.first_name?.[0] || user.email?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : 'No name set'}
                </h1>
                <p className="text-slate-400">{user.email}</p>
                <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">Company</p>
                <p className="text-white">{user.company_name || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Phone</p>
                <p className="text-white">{user.phone || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Industry</p>
                <p className="text-white capitalize">{user.industry?.replace('-', ' ') || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Joined</p>
                <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* User's Tickets */}
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Recent Tickets</h2>
            </div>
            {tickets.length > 0 ? (
              <div className="divide-y divide-slate-700">
                {tickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/admin/tickets/${ticket.id}`}
                    className="block p-4 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-slate-400">{ticket.ticket_number}</p>
                        <p className="text-white font-medium">{ticket.subject}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">No tickets from this user</div>
            )}
          </div>
        </div>

        {/* Actions Sidebar */}
        <div>
          <UserRoleForm userId={user.id} currentRole={user.role} />
        </div>
      </div>
    </div>
  )
}
