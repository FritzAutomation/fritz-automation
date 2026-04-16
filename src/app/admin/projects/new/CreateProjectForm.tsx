'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { createProject } from '@/lib/projects/actions'
import type { ProjectStatus } from '@/types/database'

interface ClientOption {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  company_name: string | null
}

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'proposed', label: 'Proposed' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

const inputClass = 'w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 outline-none'

export function CreateProjectForm({ clients }: { clients: ClientOption[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setIsSubmitting(true)
    const result = await createProject({
      client_id: formData.get('client_id') as string,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      status: (formData.get('status') as ProjectStatus) || 'proposed',
      start_date: (formData.get('start_date') as string) || null,
      target_date: (formData.get('target_date') as string) || null,
      wave_url: (formData.get('wave_url') as string) || null,
    })
    setIsSubmitting(false)

    if (result.success) {
      toast.success('Project created')
      router.push(`/admin/projects/${result.project?.id || ''}`)
    } else {
      toast.error(result.error || 'Failed to create project')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Client</label>
        <select name="client_id" required className={inputClass}>
          <option value="">Select a client…</option>
          {clients.map((c) => {
            const name = `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim()
            return (
              <option key={c.id} value={c.id}>
                {name ? `${name} (${c.email})` : c.email}
                {c.company_name ? ` — ${c.company_name}` : ''}
              </option>
            )
          })}
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Title</label>
        <input name="title" type="text" required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Description</label>
        <textarea name="description" rows={4} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Status</label>
          <select name="status" defaultValue="proposed" className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Wave URL (optional)</label>
          <input name="wave_url" type="url" placeholder="https://…" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Start date</label>
          <input name="start_date" type="date" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Target date</label>
          <input name="target_date" type="date" className={inputClass} />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create project'}
        </Button>
      </div>
    </form>
  )
}
