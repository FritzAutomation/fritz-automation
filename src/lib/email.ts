import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Initialize Resend lazily to avoid errors when API key is not configured
let resendClient: Resend | null = null
function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

// Use Resend's test domain for development, or your verified domain for production
const FROM_EMAIL = process.env.NODE_ENV === 'production'
  ? 'Fritz Automation <notifications@fritzautomation.dev>'
  : 'Fritz Automation <onboarding@resend.dev>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fritzautomation.dev'

// Create a service-level Supabase client for fetching admin emails
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey)
}

// Get all admin and superadmin email addresses
async function getAdminEmails(): Promise<string[]> {
  const supabase = getServiceClient()

  if (!supabase) {
    // Fallback to default admin email if service client not configured
    console.log('[Email] No service client - using fallback email')
    return ['forward@fritzautomation.dev']
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: admins, error } = await (supabase as any)
    .from('profiles')
    .select('email')
    .in('role', ['admin', 'superadmin'])
    .not('email', 'is', null) as { data: { email: string | null }[] | null; error: unknown }

  if (error) {
    console.error('[Email] Error fetching admin emails:', error)
    return ['forward@fritzautomation.dev']
  }

  if (!admins || admins.length === 0) {
    console.log('[Email] No admin/superadmin profiles found - using fallback email')
    return ['forward@fritzautomation.dev']
  }

  const emails = admins.map(a => a.email).filter((email): email is string => email !== null)
  console.log('[Email] Found admin emails:', emails)
  return emails
}

interface TicketNotificationData {
  ticketNumber: string
  subject: string
  clientName: string
  clientEmail: string
  ticketId: string
}

interface MessageNotificationData {
  ticketNumber: string
  subject: string
  recipientName: string
  recipientEmail: string
  senderName: string
  messagePreview: string
  ticketId: string
  isClient: boolean
}

interface ContactNotificationData {
  name: string
  email: string
  company: string | null
  phone: string | null
  subject: string | null
  message: string
}

// Email sent when a new ticket is created (to admins and superadmins)
export async function sendNewTicketNotification(data: TicketNotificationData) {
  const resend = getResendClient()
  if (!resend) {
    console.log('[Email] Skipping email - RESEND_API_KEY not configured')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const adminEmails = await getAdminEmails()
    console.log('[Email] Sending new ticket notification to:', adminEmails)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmails,
      subject: `[New Ticket] ${data.ticketNumber}: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #ef4444, #dc2626); padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Support Ticket</h1>
          </div>
          <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #475569; margin: 0 0 16px;">A new support ticket has been submitted.</p>

            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
              <p style="margin: 0 0 8px;"><strong style="color: #1e293b;">Ticket:</strong> <span style="color: #475569;">${data.ticketNumber}</span></p>
              <p style="margin: 0 0 8px;"><strong style="color: #1e293b;">Subject:</strong> <span style="color: #475569;">${data.subject}</span></p>
              <p style="margin: 0 0 8px;"><strong style="color: #1e293b;">Client:</strong> <span style="color: #475569;">${data.clientName}</span></p>
              <p style="margin: 0;"><strong style="color: #1e293b;">Email:</strong> <span style="color: #475569;">${data.clientEmail}</span></p>
            </div>

            <a href="${SITE_URL}/admin/tickets/${data.ticketId}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Ticket</a>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[Email] Error sending new ticket notification:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('[Email] Error sending new ticket notification:', error)
    return { success: false, error }
  }
}

// Email sent when a ticket is created (to client, confirming receipt)
export async function sendTicketConfirmation(data: TicketNotificationData) {
  const resend = getResendClient()
  if (!resend) {
    console.log('[Email] Skipping email - RESEND_API_KEY not configured')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.clientEmail,
      subject: `Ticket ${data.ticketNumber} Received: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #ef4444, #dc2626); padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Ticket Received</h1>
          </div>
          <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #475569; margin: 0 0 16px;">Hi ${data.clientName},</p>
            <p style="color: #475569; margin: 0 0 16px;">Thank you for contacting Fritz Automation support. We've received your ticket and will get back to you as soon as possible.</p>

            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
              <p style="margin: 0 0 8px;"><strong style="color: #1e293b;">Ticket Number:</strong> <span style="color: #475569;">${data.ticketNumber}</span></p>
              <p style="margin: 0;"><strong style="color: #1e293b;">Subject:</strong> <span style="color: #475569;">${data.subject}</span></p>
            </div>

            <p style="color: #475569; margin: 0 0 24px;">You can track the status of your ticket and respond to our team through your client portal.</p>

            <a href="${SITE_URL}/portal/tickets/${data.ticketId}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Ticket</a>

            <p style="color: #94a3b8; margin: 24px 0 0; font-size: 14px;">Best regards,<br>Fritz Automation Support Team</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[Email] Error sending ticket confirmation:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('[Email] Error sending ticket confirmation:', error)
    return { success: false, error }
  }
}

// Email sent when a new message is added to a ticket
export async function sendMessageNotification(data: MessageNotificationData) {
  const resend = getResendClient()
  if (!resend) {
    console.log('[Email] Skipping email - RESEND_API_KEY not configured')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const portalPath = data.isClient ? 'portal' : 'admin'
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.recipientEmail,
      subject: `New Reply on ${data.ticketNumber}: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #ef4444, #dc2626); padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Message</h1>
          </div>
          <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #475569; margin: 0 0 16px;">Hi ${data.recipientName},</p>
            <p style="color: #475569; margin: 0 0 16px;">${data.senderName} has replied to ticket ${data.ticketNumber}.</p>

            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
              <p style="margin: 0 0 8px;"><strong style="color: #1e293b;">Ticket:</strong> <span style="color: #475569;">${data.ticketNumber}</span></p>
              <p style="margin: 0 0 8px;"><strong style="color: #1e293b;">Subject:</strong> <span style="color: #475569;">${data.subject}</span></p>
              <p style="margin: 0;"><strong style="color: #1e293b;">Preview:</strong></p>
              <p style="color: #475569; margin: 8px 0 0; font-style: italic;">"${data.messagePreview.substring(0, 200)}${data.messagePreview.length > 200 ? '...' : ''}"</p>
            </div>

            <a href="${SITE_URL}/${portalPath}/tickets/${data.ticketId}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Conversation</a>

            <p style="color: #94a3b8; margin: 24px 0 0; font-size: 14px;">Best regards,<br>Fritz Automation Support Team</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[Email] Error sending message notification:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('[Email] Error sending message notification:', error)
    return { success: false, error }
  }
}

// Email sent when a new contact form is submitted (to admins and superadmins)
export async function sendContactNotification(data: ContactNotificationData) {
  const resend = getResendClient()
  if (!resend) {
    console.log('[Email] Skipping email - RESEND_API_KEY not configured')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const adminEmails = await getAdminEmails()
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmails,
      subject: `[Contact Form] ${data.subject || 'New Inquiry'} from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #ef4444, #dc2626); padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #475569; margin: 0 0 16px;">You have a new inquiry from your website contact form.</p>

            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
              <p style="margin: 0 0 8px;"><strong style="color: #1e293b;">Name:</strong> <span style="color: #475569;">${data.name}</span></p>
              <p style="margin: 0 0 8px;"><strong style="color: #1e293b;">Email:</strong> <span style="color: #475569;">${data.email}</span></p>
              ${data.company ? `<p style="margin: 0 0 8px;"><strong style="color: #1e293b;">Company:</strong> <span style="color: #475569;">${data.company}</span></p>` : ''}
              ${data.phone ? `<p style="margin: 0 0 8px;"><strong style="color: #1e293b;">Phone:</strong> <span style="color: #475569;">${data.phone}</span></p>` : ''}
              ${data.subject ? `<p style="margin: 0 0 8px;"><strong style="color: #1e293b;">Subject:</strong> <span style="color: #475569;">${data.subject}</span></p>` : ''}
              <p style="margin: 16px 0 0;"><strong style="color: #1e293b;">Message:</strong></p>
              <p style="color: #475569; margin: 8px 0 0; white-space: pre-wrap;">${data.message}</p>
            </div>

            <a href="${SITE_URL}/admin/contacts" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View in Admin</a>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[Email] Error sending contact notification:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('[Email] Error sending contact notification:', error)
    return { success: false, error }
  }
}
