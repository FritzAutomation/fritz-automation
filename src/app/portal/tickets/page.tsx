import { createClient } from '@/lib/supabase/server'
import { getStatusColor, getPriorityColor, formatStatus } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface Ticket {
  id: string
  ticket_number: string
  subject: string
  description: string | null
  status: string
  priority: string
  category: string | null
  created_at: string
  updated_at: string
}

export default async function TicketsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  let tickets: Ticket[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('tickets')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })

    tickets = data || []
  } catch {
    // Database might not exist yet
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-slate-600 mt-1">View and manage your support requests</p>
        </div>
        <Link href="/portal/tickets/new">
          <Button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Ticket
          </Button>
        </Link>
      </div>

      {tickets.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Ticket</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/portal/tickets/${ticket.id}`} className="text-primary font-medium hover:underline">
                      {ticket.ticket_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/portal/tickets/${ticket.id}`} className="text-slate-900 hover:text-primary">
                      {ticket.subject}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status, 'light')}`}>
                      {formatStatus(ticket.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority, 'light')}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No tickets yet</h3>
          <p className="text-slate-600 mb-6">Create your first support ticket to get help from our team.</p>
          <Link href="/portal/tickets/new">
            <Button>Create Your First Ticket</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
