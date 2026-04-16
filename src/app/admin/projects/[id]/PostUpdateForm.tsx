'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { postProjectUpdate } from '@/lib/projects/actions'

const inputClass = 'w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 outline-none'

export function PostUpdateForm({ projectId }: { projectId: string }) {
  const [isPosting, setIsPosting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get('message') as string

    setIsPosting(true)
    const result = await postProjectUpdate(projectId, message)
    setIsPosting(false)

    if (result.success) {
      toast.success('Update posted')
      formRef.current?.reset()
    } else {
      toast.error(result.error || 'Failed to post update')
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <textarea
        name="message"
        required
        rows={3}
        placeholder="What did you just ship? What's happening next?"
        className={inputClass}
      />
      <Button type="submit" disabled={isPosting}>
        {isPosting ? 'Posting…' : 'Post update'}
      </Button>
    </form>
  )
}
