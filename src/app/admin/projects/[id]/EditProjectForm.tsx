'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { updateProject, deleteProject } from '@/lib/projects/actions'
import type { Project, ProjectStatus } from '@/types/database'

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'proposed', label: 'Proposed' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
]

const inputClass = 'w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 outline-none'

export function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setIsSaving(true)
    const result = await updateProject(project.id, {
      title: (formData.get('title') as string).trim(),
      description: (formData.get('description') as string) || null,
      status: formData.get('status') as ProjectStatus,
      start_date: (formData.get('start_date') as string) || null,
      target_date: (formData.get('target_date') as string) || null,
      wave_url: (formData.get('wave_url') as string) || null,
    })
    setIsSaving(false)

    if (result.success) toast.success('Saved')
    else toast.error(result.error || 'Failed to save')
  }

  async function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    setIsDeleting(true)
    const result = await deleteProject(project.id)
    setIsDeleting(false)

    if (result.success) {
      toast.success('Project deleted')
      router.push('/admin/projects')
    } else {
      toast.error(result.error || 'Failed to delete')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Title</label>
        <input name="title" type="text" required defaultValue={project.title} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Description</label>
        <textarea name="description" rows={3} defaultValue={project.description ?? ''} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Status</label>
          <select name="status" defaultValue={project.status} className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Wave URL</label>
          <input name="wave_url" type="url" defaultValue={project.wave_url ?? ''} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Start date</label>
          <input name="start_date" type="date" defaultValue={project.start_date ?? ''} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Target date</label>
          <input name="target_date" type="date" defaultValue={project.target_date ?? ''} className={inputClass} />
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm text-red-400 hover:text-red-300"
        >
          {isDeleting ? 'Deleting…' : 'Delete project'}
        </button>
      </div>
    </form>
  )
}
