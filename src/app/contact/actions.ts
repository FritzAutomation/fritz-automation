'use server'

import { createClient } from '@/lib/supabase/server'
import { sendContactNotification } from '@/lib/email'

export async function submitContact(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const company = (formData.get('company') as string) || null
  const phone = (formData.get('phone') as string) || null
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('contact_submissions')
    .insert({
      name,
      email,
      company,
      phone,
      subject,
      message,
      source: 'contact_form',
    })

  if (error) {
    console.error('Contact submission error:', error)
    return { success: false, error: 'Failed to submit message. Please try again.' }
  }

  // Send email notification to admin (non-blocking)
  sendContactNotification({
    name,
    email,
    company,
    phone,
    subject,
    message,
  }).catch((err) => console.error('Failed to send contact notification email:', err))

  return { success: true }
}
