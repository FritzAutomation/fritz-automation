import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface Ticket {
  id: string
  ticket_number: string
  subject: string
  status: string
  created_at: string
}

interface Profile {
  first_name: string | null
}

export default async function PortalDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  let tickets: Ticket[] = []
  let ticketCount = 0
  let openTicketCount = 0
  let profile: Profile | null = null

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any

    // Get user's tickets
    const ticketsResult = await sb
      .from('tickets')
      .select('*', { count: 'exact' })
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    tickets = ticketsResult.data || []
    ticketCount = ticketsResult.count || 0

    // Get open tickets count
    const openResult = await sb
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', user.id)
      .in('status', ['open', 'in_progress'])

    openTicketCount = openResult.count || 0

    // Get user's profile
    const profileResult = await sb
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    profile = profileResult.data
  } catch {
    // Database might not exist yet
  }

  const stats = [
    { label: 'Total Tickets', value: ticketCount },
    { label: 'Open Tickets', value: openTicketCount },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {profile?.first_name || 'there'}!
        </h1>
        <p className="text-slate-600 mt-1">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Tickets</h2>
          <Link href="/portal/tickets/new">
            <Button size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Ticket
            </Button>
          </Link>
        </div>

        {tickets.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/portal/tickets/${ticket.id}`}
                className="block p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-900">{ticket.subject}</p>
                    <p className="text-sm text-slate-500">{ticket.ticket_number}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                    ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                    ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-medium text-slate-900 mb-1">No tickets yet</h3>
            <p className="text-sm text-slate-600 mb-4">Create your first support ticket to get help.</p>
            <Link href="/portal/tickets/new">
              <Button size="sm">Create Ticket</Button>
            </Link>
          </div>
        )}

        {tickets.length > 0 && (
          <div className="p-4 border-t border-slate-200">
            <Link href="/portal/tickets" className="text-sm text-primary font-medium hover:underline">
              View all tickets &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
