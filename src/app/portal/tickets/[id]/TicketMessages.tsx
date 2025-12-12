'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Message {
  id: string
  ticket_id: string
  sender_id: string
  content: string
  is_internal: boolean
  created_at: string
  sender?: {
    first_name: string | null
    last_name: string | null
    role: string
  }
}

interface TicketMessagesProps {
  ticketId: string
  initialMessages: Message[]
  userId: string
}

export function TicketMessages({ ticketId, initialMessages, userId }: TicketMessagesProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!newMessage.trim()) return

    setIsLoading(true)

    const supabase = createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('ticket_messages')
      .insert({
        ticket_id: ticketId,
        sender_id: userId,
        content: newMessage.trim(),
        is_internal: false,
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

    setMessages([...messages, data])
    setNewMessage('')
    setIsLoading(false)
    toast.success('Message sent!')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
      </div>

      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message) => {
            const isOwn = message.sender_id === userId
            const senderName = message.sender
              ? `${message.sender.first_name || ''} ${message.sender.last_name || ''}`.trim() || 'Unknown'
              : 'Unknown'
            const isAdmin = message.sender?.role === 'admin' || message.sender?.role === 'superadmin'

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    isOwn
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-medium ${isOwn ? 'text-white/90' : 'text-slate-700'}`}>
                      {isOwn ? 'You' : senderName}
                    </span>
                    {isAdmin && !isOwn && (
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        Staff
                      </span>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${isOwn ? 'text-white/70' : 'text-slate-500'}`}>
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-center text-slate-500 py-8">No messages yet. Start the conversation below.</p>
        )}
      </div>

      <div className="p-6 border-t border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            id="message"
            name="message"
            placeholder="Type your message..."
            rows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading} disabled={!newMessage.trim()}>
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
