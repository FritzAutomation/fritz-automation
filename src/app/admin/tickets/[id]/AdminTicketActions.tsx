'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface AdminTicketActionsProps {
  ticketId: string
  currentStatus: string
  currentPriority: string
}

export function AdminTicketActions({ ticketId, currentStatus, currentPriority }: AdminTicketActionsProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [priority, setPriority] = useState(currentPriority)
  const [isLoading, setIsLoading] = useState(false)

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

  return (
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
            className="w-full px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
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
            className="w-full px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-700 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
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
          className="w-full bg-red-500 hover:bg-red-600"
        >
          Update Ticket
        </Button>
      </div>
    </div>
  )
}
