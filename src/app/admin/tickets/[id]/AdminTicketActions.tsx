'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface AdminTicketActionsProps {
  ticketId: string
  ticketNumber: string
  currentStatus: string
  currentPriority: string
}

export function AdminTicketActions({ ticketId, ticketNumber, currentStatus, currentPriority }: AdminTicketActionsProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [priority, setPriority] = useState(currentPriority)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function handleUpdate() {
    setIsLoading(true)

    const supabase = createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('tickets')
      .update({
        status,
        priority,
        updated_at: new Date().toISOString(),
        ...(status === 'resolved' ? { resolved_at: new Date().toISOString() } : {}),
      })
      .eq('id', ticketId)

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success('Ticket updated successfully!')
    setIsLoading(false)
    router.refresh()
  }

  async function handleDelete() {
    setIsDeleting(true)

    const supabase = createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any

    // First delete related messages
    await sb.from('ticket_messages').delete().eq('ticket_id', ticketId)

    // Then delete related files
    await sb.from('files').delete().eq('ticket_id', ticketId)

    // Finally delete the ticket
    const { error } = await sb.from('tickets').delete().eq('id', ticketId)

    if (error) {
      toast.error(error.message)
      setIsDeleting(false)
      return
    }

    toast.success('Ticket deleted successfully!')
    router.push('/admin/tickets')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Actions</h2>

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
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting">Waiting on Client</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <Button
            onClick={handleUpdate}
            isLoading={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600"
          >
            Update Ticket
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-800 rounded-xl border border-red-500/30 p-6">
        <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full px-4 py-2.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            Delete Ticket
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-300">
              Are you sure you want to delete ticket <span className="font-semibold text-white">{ticketNumber}</span>? This will also delete all messages and files associated with this ticket. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleDelete}
                isLoading={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Yes, Delete
              </Button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
