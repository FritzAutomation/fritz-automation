import { createClient } from '@/lib/supabase/server'
import { getStatusColor, getPriorityColor, formatStatus } from '@/lib/utils'
import type { TicketWithClient, TicketMessageWithSender } from '@/types/database'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AdminTicketActions } from './AdminTicketActions'
import { AdminTicketMessages } from './AdminTicketMessages'

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  let ticket: TicketWithClient | null = null
  let messages: TicketMessageWithSender[] = []

  try {
    const { data: ticketData } = await supabase
      .from('tickets')
      .select(`
        *,
        client:profiles!tickets_client_id_fkey(id, first_name, last_name, email, company_name, phone)
      `)
      .eq('id', id)
      .single()

    ticket = ticketData as unknown as TicketWithClient | null

    if (ticket) {
      const { data: messagesData } = await supabase
        .from('ticket_messages')
        .select(`
          *,
          sender:profiles(first_name, last_name, role)
        `)
        .eq('ticket_id', id)
        .order('created_at', { ascending: true })

      messages = (messagesData || []) as unknown as TicketMessageWithSender[]
    }
  } catch {
    // Database might not exist yet
  }

  if (!ticket) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/tickets" className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tickets
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{ticket.ticket_number}</p>
                  <h1 className="text-2xl font-bold text-white">{ticket.subject}</h1>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                    {formatStatus(ticket.status)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-slate-700">
              <h2 className="text-sm font-semibold text-slate-400 mb-2">Description</h2>
              <p className="text-slate-200 whitespace-pre-wrap">{ticket.description || 'No description provided.'}</p>
            </div>

            <div className="p-6 bg-slate-700/30 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Category</p>
                <p className="font-medium text-white">{ticket.category || 'General'}</p>
              </div>
              <div>
                <p className="text-slate-400">Created</p>
                <p className="font-medium text-white">{new Date(ticket.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Last Updated</p>
                <p className="font-medium text-white">{new Date(ticket.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <AdminTicketMessages ticketId={ticket.id} initialMessages={messages} adminId={user.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Client Information</h2>
            {ticket.client ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="text-white">{ticket.client.first_name} {ticket.client.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <a href={`mailto:${ticket.client.email}`} className="text-emerald-400 hover:text-emerald-300">
                    {ticket.client.email}
                  </a>
                </div>
                {ticket.client.company_name && (
                  <div>
                    <p className="text-sm text-slate-400">Company</p>
                    <p className="text-white">{ticket.client.company_name}</p>
                  </div>
                )}
                {ticket.client.phone && (
                  <div>
                    <p className="text-sm text-slate-400">Phone</p>
                    <a href={`tel:${ticket.client.phone}`} className="text-emerald-400 hover:text-emerald-300">
                      {ticket.client.phone}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400">No client information available</p>
            )}
          </div>

          {/* Actions */}
          <AdminTicketActions ticketId={ticket.id} ticketNumber={ticket.ticket_number} currentStatus={ticket.status} currentPriority={ticket.priority} />
        </div>
      </div>
    </div>
  )
}
