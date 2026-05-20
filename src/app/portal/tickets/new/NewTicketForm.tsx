'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createTicket } from './actions'
import { toast } from 'sonner'

interface FormErrors {
  project?: string
  subject?: string
  description?: string
}

interface ProjectOption {
  id: string
  title: string
  status: string
}

interface NewTicketFormProps {
  projects: ProjectOption[]
  defaultProjectId?: string
}

const selectClass =
  'w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all'

export function NewTicketForm({ projects, defaultProjectId }: NewTicketFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Preselect if defaultProjectId is valid, otherwise first project
  const initialProjectId = projects.find(p => p.id === defaultProjectId)?.id || projects[0]?.id || ''

  function validateForm(project_id: string, subject: string, description: string): FormErrors {
    const newErrors: FormErrors = {}
    if (!project_id) newErrors.project = 'Please pick a project'
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
    const project_id = formData.get('project_id') as string
    const subject = formData.get('subject') as string
    const category = formData.get('category') as string
    const priority = formData.get('priority') as string
    const description = formData.get('description') as string

    const validationErrors = validateForm(project_id, subject, description)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Please fix the errors in the form')
      return
    }

    setErrors({})
    setIsLoading(true)

    const result = await createTicket({
      project_id,
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
      <div>
        <label htmlFor="project_id" className="block text-sm font-medium text-slate-900 mb-1">
          Project
        </label>
        <select
          id="project_id"
          name="project_id"
          defaultValue={initialProjectId}
          required
          className={selectClass}
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        {errors.project && <p className="mt-1 text-sm text-red-600">{errors.project}</p>}
      </div>

      <Input
        id="subject"
        name="subject"
        label="Subject"
        placeholder="Short summary of your request"
        required
        minLength={5}
        maxLength={200}
        error={errors.subject}
      />

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-900 mb-1">
          Category
        </label>
        <select id="category" name="category" defaultValue="general" className={selectClass}>
          <option value="general">General</option>
          <option value="technical">Technical</option>
          <option value="billing">Billing</option>
          <option value="feature">Feature Request</option>
          <option value="bug">Bug Report</option>
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-slate-900 mb-1">
          Priority
        </label>
        <select id="priority" name="priority" defaultValue="normal" className={selectClass}>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="What's going on? The more detail you share, the faster I can help."
        rows={6}
        required
        minLength={20}
        error={errors.description}
      />

      <div className="flex gap-3">
        <Button type="submit" isLoading={isLoading}>Create Ticket</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
