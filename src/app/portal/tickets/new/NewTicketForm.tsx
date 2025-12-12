'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createTicket } from './actions'
import { toast } from 'sonner'

interface FormErrors {
  subject?: string
  description?: string
}

export function NewTicketForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  function validateForm(subject: string, description: string): FormErrors {
    const newErrors: FormErrors = {}

    if (!subject || subject.trim().length < 5) {
      newErrors.subject = 'Please enter a subject (at least 5 characters)'
    } else if (subject.length > 200) {
      newErrors.subject = 'Subject must be less than 200 characters'
    }

    if (!description || description.trim().length < 20) {
      newErrors.description = 'Please provide more detail (at least 20 characters)'
    }

    return newErrors
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const subject = formData.get('subject') as string
    const category = formData.get('category') as string
    const priority = formData.get('priority') as string
    const description = formData.get('description') as string

    // Client-side validation
    const validationErrors = validateForm(subject, description)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form')
      return
    }

    setErrors({})
    setIsLoading(true)

    const result = await createTicket({
      subject,
      category: category || null,
      priority,
      description,
    })

    if (!result.success) {
      toast.error(result.error || 'Failed to create ticket')
      setIsLoading(false)
      return
    }

    toast.success('Ticket created successfully! A confirmation email has been sent.')
    router.push('/portal/tickets')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="subject"
        name="subject"
        label="Subject"
        placeholder="Brief description of your issue"
        required
        error={errors.subject}
        minLength={5}
        maxLength={200}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
          >
            <option value="">Select a category</option>
            <option value="general">General Inquiry</option>
            <option value="technical">Technical Support</option>
            <option value="billing">Billing</option>
            <option value="feature">Feature Request</option>
            <option value="bug">Bug Report</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
            defaultValue="normal"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="Please provide as much detail as possible about your issue..."
        rows={6}
        required
        error={errors.description}
        minLength={20}
      />

      <div className="flex gap-4">
        <Button type="submit" isLoading={isLoading}>
          Create Ticket
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
