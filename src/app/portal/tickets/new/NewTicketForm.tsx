'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function NewTicketForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const subject = formData.get('subject') as string
    const category = formData.get('category') as string
    const priority = formData.get('priority') as string
    const description = formData.get('description') as string

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('You must be logged in to create a ticket')
      setIsLoading(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('tickets')
      .insert({
        client_id: user.id,
        subject,
        category: category || null,
        priority,
        description,
      })

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success('Ticket created successfully!')
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
