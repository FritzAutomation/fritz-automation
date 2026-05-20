'use server'

import { createClient } from '@/lib/supabase/server'
import { sendNewTicketNotification, sendTicketConfirmation } from '@/lib/email'

interface CreateTicketData {
  project_id: string
  subject: string
  category: string | null
  priority: string
  description: string
}

export async function createTicket(data: CreateTicketData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to create a ticket' }
  }

  if (!data.project_id) {
    return { success: false, error: 'Please select a project for this ticket' }
  }

  // Verify the client owns the project before inserting. RLS will also enforce
  // this, but checking up front gives a clearer error message.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: project } = await (supabase as any)
    .from('projects')
    .select('id')
    .eq('id', data.project_id)
    .eq('client_id', user.id)
    .maybeSingle()

  if (!project) {
    return { success: false, error: 'Project not found' }
  }

  // Get user profile for email notification
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('first_name, last_name, email')
    .eq('id', user.id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ticket, error } = await (supabase as any)
    .from('tickets')
    .insert({
      client_id: user.id,
      project_id: data.project_id,
      subject: data.subject,
      category: data.category || null,
      priority: data.priority,
      description: data.description,
    })
    .select('id, ticket_number')
    .single()

  if (error) {
    console.error('Ticket creation error:', error)
    return { success: false, error: error.message }
  }

  const clientName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Client'
    : 'Client'
  const clientEmail = profile?.email || user.email || ''

  if (ticket) {
    sendNewTicketNotification({
      ticketNumber: ticket.ticket_number,
      subject: data.subject,
      clientName,
      clientEmail,
      ticketId: ticket.id,
    }).catch((err) => console.error('Failed to send admin notification:', err))

    if (clientEmail) {
      sendTicketConfirmation({
        ticketNumber: ticket.ticket_number,
        subject: data.subject,
        clientName,
        clientEmail,
        ticketId: ticket.id,
      }).catch((err) => console.error('Failed to send client confirmation:', err))
    }
  }

  return { success: true, ticketId: ticket?.id }
}
