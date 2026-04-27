'use client'

import { useState } from 'react'
import { submitContact } from './actions'
import { contactInfo } from '@/lib/constants'
import { toast } from 'sonner'
import { track } from '@vercel/analytics'

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const inputClass =
  'w-full bg-[var(--bg)] border border-[var(--line)] rounded px-3 py-2 text-slate-100 placeholder-slate-600 font-mono text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors'

const errorClass = 'mt-1 text-xs text-red-400 font-mono'

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
        const subject = (formData.get('subject') as string) || ''
        track('contact_form_submitted', { subject_length: subject.trim().length })
        toast.success("Message sent! I'll reply within a day.")
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-[var(--ink-soft)] mb-8 leading-relaxed">
        I read every inquiry personally and reply within a day (usually sooner). The more you tell
        me, the more useful my first reply will be.
      </p>

      {/* IDE window chrome */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
        {/* Title bar */}
        <div className="bg-[var(--bg-soft)] border-b border-[var(--line)] px-4 py-2 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--traffic-r)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--traffic-y)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--traffic-g)]" />
          <span className="font-mono text-xs text-[var(--ink-dim)] ml-2">~/new-project.yaml</span>
        </div>

        {/* Form */}
        <form id="contact-form" action={handleSubmit} className="p-6 space-y-5 font-mono text-sm">
          {/* Honeypot — hidden from humans, bots tend to fill it anyway.
              Server rejects submissions with a value here. Do not remove. */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
            <label htmlFor="website_url">Website (leave empty)</label>
            <input
              id="website_url"
              name="website_url"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* name */}
          <div>
            <label htmlFor="name" className="block text-[var(--accent)] mb-1.5">
              name:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              autoComplete="name"
              placeholder="Your name"
              className={inputClass}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          {/* email */}
          <div>
            <label htmlFor="email" className="block text-[var(--accent)] mb-1.5">
              email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          {/* company (optional) */}
          <div>
            <label htmlFor="company" className="block text-[var(--accent)] mb-1.5">
              <span className="text-[var(--ink-dim)]"># optional</span>
              <br />
              company:
            </label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Your company"
              className={inputClass}
            />
          </div>

          {/* subject */}
          <div>
            <label htmlFor="subject" className="block text-[var(--accent)] mb-1.5">
              subject:
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              minLength={3}
              placeholder="Project inquiry"
              className={inputClass}
            />
            {errors.subject && <p className={errorClass}>{errors.subject}</p>}
          </div>

          {/* message */}
          <div>
            <label htmlFor="message" className="block text-[var(--accent)] mb-1.5">
              message:
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              rows={6}
              placeholder="Tell me about your project or inquiry..."
              className={`${inputClass} resize-none`}
            />
            {errors.message && <p className={errorClass}>{errors.message}</p>}
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold py-2.5 rounded transition-colors font-mono text-sm"
          >
            {isLoading ? '$ sending…' : '$ submit →'}
          </button>
        </form>
      </div>

      {/* Alternate contact */}
      <div className="mt-8 font-mono text-sm text-[var(--ink-dim)]">
        <div>// prefer email?</div>
        <div>
          →{' '}
          <a
            href={`mailto:${contactInfo.email}`}
            className="text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors"
          >
            {contactInfo.email}
          </a>
        </div>
      </div>
    </div>
  )
}
