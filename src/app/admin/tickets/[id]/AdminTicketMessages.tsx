'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import type { TicketMessageWithSender, Database } from '@/types/database'
import { toast } from 'sonner'

interface AdminTicketMessagesProps {
  ticketId: string
  initialMessages: TicketMessageWithSender[]
  adminId: string
}

export function AdminTicketMessages({ ticketId, initialMessages, adminId }: AdminTicketMessagesProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<TicketMessageWithSender[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!newMessage.trim()) return

    setIsLoading(true)

    const supabase = createClient()

    // Type assertion needed because Supabase's generated types don't fully support
    // insert operations with RLS policies. Runtime types are validated by the database.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('ticket_messages')
      .insert({
        ticket_id: ticketId,
        sender_id: adminId,
        content: newMessage.trim(),
        is_internal: isInternal,
      })
      .select(`
        *,
        sender:profiles(first_name, last_name, role)
      `)
      .single()

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    setMessages([...messages, data as unknown as TicketMessageWithSender])
    setNewMessage('')
    setIsLoading(false)
    toast.success(isInternal ? 'Internal note added!' : 'Reply sent!')
    router.refresh()
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Messages</h2>
      </div>

      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message) => {
            const isAdmin = message.sender?.role === 'admin' || message.sender?.role === 'superadmin'
            const senderName = message.sender
              ? `${message.sender.first_name || ''} ${message.sender.last_name || ''}`.trim() || 'Unknown'
              : 'Unknown'

            return (
              <div
                key={message.id}
                className={`rounded-lg p-4 ${
                  message.is_internal
                    ? 'bg-yellow-500/10 border border-yellow-500/30'
                    : isAdmin
                    ? 'bg-red-500/10 border border-red-500/30'
                    : 'bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${message.is_internal ? 'text-yellow-400' : isAdmin ? 'text-red-400' : 'text-slate-300'}`}>
                    {senderName}
                  </span>
                  {message.is_internal && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">
                      Internal Note
                    </span>
                  )}
                  {isAdmin && !message.is_internal && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                      Staff
                    </span>
                  )}
                </div>
                <p className="text-slate-200 whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            )
          })
        ) : (
          <p className="text-center text-slate-400 py-8">No messages yet.</p>
        )}
      </div>

      <div className="p-6 border-t border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            id="message"
            name="message"
            placeholder={isInternal ? "Add an internal note (not visible to client)..." : "Type your reply..."}
            rows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-yellow-500 focus:ring-yellow-500/20"
              />
              <span className="text-sm text-slate-300">Internal note (not visible to client)</span>
            </label>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!newMessage.trim()}
              className={isInternal ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-500 hover:bg-red-600'}
            >
              {isInternal ? 'Add Note' : 'Send Reply'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
