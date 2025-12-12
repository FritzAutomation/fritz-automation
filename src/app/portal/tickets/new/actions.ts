'use server'

import { createClient } from '@/lib/supabase/server'
import { sendNewTicketNotification, sendTicketConfirmation } from '@/lib/email'

interface CreateTicketData {
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

  // Send email notifications (non-blocking)
  if (ticket) {
    // Notify admin about new ticket
    sendNewTicketNotification({
      ticketNumber: ticket.ticket_number,
      subject: data.subject,
      clientName,
      clientEmail,
      ticketId: ticket.id,
    }).catch((err) => console.error('Failed to send admin notification:', err))

    // Send confirmation to client
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
