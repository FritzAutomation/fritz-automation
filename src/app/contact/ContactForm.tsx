'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { submitContact } from './actions'
import { toast } from 'sonner'

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  function validateForm(formData: FormData): FormErrors {
    const newErrors: FormErrors = {}
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || name.trim().length < 2) {
      newErrors.name = 'Please enter your name (at least 2 characters)'
    }

    if (!email) {
      newErrors.email = 'Please enter your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!subject || subject.trim().length < 3) {
      newErrors.subject = 'Please enter a subject (at least 3 characters)'
    }

    if (!message || message.trim().length < 10) {
      newErrors.message = 'Please enter a message (at least 10 characters)'
    }

    return newErrors
  }

  async function handleSubmit(formData: FormData) {
    // Client-side validation
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form')
      return
    }

    setErrors({})
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
          error={errors.name}
          minLength={2}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address *"
          placeholder="john@example.com"
          required
          autoComplete="email"
          error={errors.email}
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
          error={errors.subject}
          minLength={3}
        />

        <Textarea
          id="message"
          name="message"
          label="Message *"
          placeholder="Tell us about your project or inquiry..."
          rows={6}
          required
          error={errors.message}
          minLength={10}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send Message
        </Button>
      </form>
    </div>
  )
}
