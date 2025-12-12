import { createClient } from '@/lib/supabase/server'
import { getStatusColor, getPriorityColor, formatStatus } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TicketMessages } from './TicketMessages'

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

interface Message {
  id: string
  ticket_id: string
  sender_id: string
  content: string
  is_internal: boolean
  created_at: string
  sender?: {
    first_name: string | null
    last_name: string | null
    role: string
  }
}

export default async function TicketDetailPage({
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

  let ticket: Ticket | null = null
  let messages: Message[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any

    const { data: ticketData } = await sb
      .from('tickets')
      .select('*')
      .eq('id', id)
      .eq('client_id', user.id)
      .single()

    ticket = ticketData

    if (ticket) {
      const { data: messagesData } = await sb
        .from('ticket_messages')
        .select(`
          *,
          sender:profiles(first_name, last_name, role)
        `)
        .eq('ticket_id', id)
        .eq('is_internal', false)
        .order('created_at', { ascending: true })

      messages = messagesData || []
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
        <Link href="/portal/tickets" className="text-sm text-slate-600 hover:text-primary flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tickets
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1">{ticket.ticket_number}</p>
              <h1 className="text-2xl font-bold text-slate-900">{ticket.subject}</h1>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status, 'light')}`}>
                {formatStatus(ticket.status)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority, 'light')}`}>
                {ticket.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-600 mb-2">Description</h2>
          <p className="text-slate-700 whitespace-pre-wrap">{ticket.description || 'No description provided.'}</p>
        </div>

        <div className="p-6 bg-slate-50 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Category</p>
            <p className="font-medium text-slate-900">{ticket.category || 'General'}</p>
          </div>
          <div>
            <p className="text-slate-500">Created</p>
            <p className="font-medium text-slate-900">{new Date(ticket.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-slate-500">Last Updated</p>
            <p className="font-medium text-slate-900">{new Date(ticket.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <TicketMessages ticketId={ticket.id} initialMessages={messages} userId={user.id} />
    </div>
  )
}
