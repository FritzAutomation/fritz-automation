import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface Ticket {
  id: string
  ticket_number: string
  subject: string
  status: string
  priority: string
  category: string | null
  created_at: string
  updated_at: string
  client: {
    first_name: string | null
    last_name: string | null
    email: string | null
    company_name: string | null
  } | null
}

export default async function AdminTicketsPage() {
  const supabase = await createClient()

  let tickets: Ticket[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('tickets')
      .select(`
        *,
        client:profiles!tickets_client_id_fkey(first_name, last_name, email, company_name)
      `)
      .order('created_at', { ascending: false })

    tickets = data || []
  } catch {
    // Database might not exist yet
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-400'
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400'
      case 'waiting': return 'bg-purple-500/20 text-purple-400'
      case 'resolved': return 'bg-green-500/20 text-green-400'
      case 'closed': return 'bg-slate-500/20 text-slate-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400'
      case 'high': return 'bg-orange-500/20 text-orange-400'
      case 'normal': return 'bg-slate-500/20 text-slate-400'
      case 'low': return 'bg-slate-600/20 text-slate-500'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">All Tickets</h1>
          <p className="text-slate-400 mt-1">Manage support tickets from all users</p>
        </div>
      </div>

      {tickets.length > 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-700">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Ticket</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Subject</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Priority</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/tickets/${ticket.id}`} className="text-red-400 font-medium hover:text-red-300">
                      {ticket.ticket_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">
                        {ticket.client?.first_name} {ticket.client?.last_name}
                      </p>
                      <p className="text-sm text-slate-400">{ticket.client?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/tickets/${ticket.id}`} className="text-slate-200 hover:text-white">
                      {ticket.subject}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No tickets yet</h3>
          <p className="text-slate-400">Tickets from users will appear here.</p>
        </div>
      )}
    </div>
  )
}
