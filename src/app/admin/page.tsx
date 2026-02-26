import { createClient } from '@/lib/supabase/server'
import { getStatusColor, getPriorityColor, formatStatus } from '@/lib/utils'
import type { TicketWithClient, ContactSubmission } from '@/types/database'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  let stats = {
    totalTickets: 0,
    openTickets: 0,
    totalUsers: 0,
    newContacts: 0,
  }

  let recentTickets: TicketWithClient[] = []
  let recentContacts: ContactSubmission[] = []

  try {
    // Get ticket counts
    const { count: totalTickets } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })

    const { count: openTickets } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress'])

    // Get user count
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'client')

    // Get new contact submissions
    const { count: newContacts } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')

    stats = {
      totalTickets: totalTickets || 0,
      openTickets: openTickets || 0,
      totalUsers: totalUsers || 0,
      newContacts: newContacts || 0,
    }

    // Get recent tickets with client info
    const { data: ticketsData } = await supabase
      .from('tickets')
      .select(`
        *,
        client:profiles!tickets_client_id_fkey(id, first_name, last_name, email, company_name, phone)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    recentTickets = (ticketsData || []) as unknown as TicketWithClient[]

    // Get recent contacts
    const { data: contactsData } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    recentContacts = contactsData || []
  } catch {
    // Database might not exist yet
  }

  const statCards = [
    { label: 'Total Tickets', value: stats.totalTickets, href: '/admin/tickets', color: 'bg-blue-500' },
    { label: 'Open Tickets', value: stats.openTickets, href: '/admin/tickets?status=open', color: 'bg-yellow-500' },
    { label: 'Total Users', value: stats.totalUsers, href: '/admin/users', color: 'bg-green-500' },
    { label: 'New Contacts', value: stats.newContacts, href: '/admin/contacts?status=new', color: 'bg-purple-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your business operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white text-xl font-bold">{stat.value}</span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Recent Tickets</h2>
            <Link href="/admin/tickets" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all &rarr;
            </Link>
          </div>
          <div className="divide-y divide-slate-700">
            {recentTickets.length > 0 ? (
              recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/admin/tickets/${ticket.id}`}
                  className="block p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm text-slate-400">{ticket.ticket_number}</span>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {formatStatus(ticket.status)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-white font-medium truncate">{ticket.subject}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {ticket.client?.first_name} {ticket.client?.last_name} &bull; {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">No tickets yet</div>
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Recent Contact Submissions</h2>
            <Link href="/admin/contacts" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all &rarr;
            </Link>
          </div>
          <div className="divide-y divide-slate-700">
            {recentContacts.length > 0 ? (
              recentContacts.map((contact) => (
                <Link
                  key={contact.id}
                  href={`/admin/contacts/${contact.id}`}
                  className="block p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-white font-medium">{contact.name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 truncate">{contact.subject || 'No subject'}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {contact.email} &bull; {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">No contact submissions yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
