'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { inviteClient } from './actions'

const inputClass = 'w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 outline-none'

export function InviteClientDialog() {
  const [open, setOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setIsSending(true)
    const result = await inviteClient({
      email: formData.get('email') as string,
      first_name: (formData.get('first_name') as string) || undefined,
      last_name: (formData.get('last_name') as string) || undefined,
    })
    setIsSending(false)

    if (result.success) {
      toast.success('Invite sent')
      setOpen(false)
    } else {
      toast.error(result.error || 'Failed to send invite')
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Invite client</Button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Invite a client</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-500 hover:text-slate-300"
                  type="button"
                >
                  esc
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email</label>
                  <input name="email" type="email" required className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">First name</label>
                    <input name="first_name" type="text" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Last name</label>
                    <input name="last_name" type="text" className={inputClass} />
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  They&apos;ll get an email with a one-click link to set their password and access the portal.
                </p>
                <div className="pt-2">
                  <Button type="submit" disabled={isSending}>
                    {isSending ? 'Sending…' : 'Send invite'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
