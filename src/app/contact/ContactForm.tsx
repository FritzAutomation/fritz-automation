'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { submitContact } from './actions'
import { toast } from 'sonner'

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    try {
      const result = await submitContact(formData)

      if (result.success) {
        toast.success('Message sent successfully! We\'ll get back to you soon.')
        // Reset form
        const form = document.getElementById('contact-form') as HTMLFormElement
        form?.reset()
      } else {
        toast.error(result.error || 'Failed to send message. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-slate-900">Send a Message</h2>

      <form id="contact-form" action={handleSubmit} className="space-y-6">
        <Input
          id="name"
          name="name"
          label="Your Name *"
          placeholder="John Doe"
          required
          autoComplete="name"
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address *"
          placeholder="john@example.com"
          required
          autoComplete="email"
        />

        <Input
          id="company"
          name="company"
          label="Company"
          placeholder="Your Company"
          autoComplete="organization"
        />

        <Input
          id="subject"
          name="subject"
          label="Subject *"
          placeholder="Project Inquiry"
          required
        />

        <Textarea
          id="message"
          name="message"
          label="Message *"
          placeholder="Tell us about your project or inquiry..."
          rows={6}
          required
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send Message
        </Button>
      </form>
    </div>
  )
}
