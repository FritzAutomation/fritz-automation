'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import { deleteContact } from '../actions'
import { toast } from 'sonner'

interface ContactStatusFormProps {
  contactId: string
  currentStatus: string
  currentNotes: string | null
}

export function ContactStatusForm({ contactId, currentStatus, currentNotes }: ContactStatusFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(currentNotes || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this submission? This cannot be undone.')) return
    setIsDeleting(true)
    const result = await deleteContact(contactId)
    setIsDeleting(false)

    if (result.success) {
      toast.success('Submission deleted')
      router.push('/admin/contacts')
    } else {
      toast.error(result.error || 'Failed to delete')
    }
  }

  async function handleUpdate() {
    setIsLoading(true)

    const supabase = createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('contact_submissions')
      .update({
        status,
        admin_notes: notes || null,
        ...(status === 'responded' ? { responded_at: new Date().toISOString() } : {}),
      })
      .eq('id', contactId)

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success('Contact updated successfully!')
    setIsLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Update Status</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          >
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">
            Admin Notes
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes..."
            rows={4}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
        </div>

        <Button
          onClick={handleUpdate}
          isLoading={isLoading}
          className="w-full bg-emerald-500 hover:bg-emerald-600"
        >
          Update Contact
        </Button>

        <div className="pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting…' : 'Delete submission'}
          </button>
        </div>
      </div>
    </div>
  )
}
