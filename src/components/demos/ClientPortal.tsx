'use client'

import { useState, useCallback, useRef } from 'react'
import { track } from '@vercel/analytics'
import { sampleProjects, type Project } from './SampleData'

const STATUS_LABELS: Record<Project['status'], string> = {
  'submitted': 'Submitted',
  'in-progress': 'In Progress',
  'under-review': 'Under Review',
  'completed': 'Completed',
}

const STATUS_COLORS: Record<Project['status'], string> = {
  'submitted': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'in-progress': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'under-review': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'completed': 'bg-[var(--accent-glow)] text-[var(--accent)] border-[var(--accent)]',
}

const STATUSES: Project['status'][] = ['submitted', 'in-progress', 'under-review', 'completed']

export function ClientPortal() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [view, setView] = useState<'client' | 'admin'>('client')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')
  const adminViewTracked = useRef(false)

  const selected = projects.find(p => p.id === selectedId) ?? null

  const updateStatus = useCallback((id: string, status: Project['status']) => {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, status } : p
    ))
  }, [])

  const addNote = useCallback((id: string) => {
    if (!newNote.trim()) return
    const today = new Date().toISOString().split('T')[0]
    setProjects(prev => prev.map(p =>
      p.id === id
        ? { ...p, timeline: [...p.timeline, { date: today, note: newNote.trim() }] }
        : p
    ))
    setNewNote('')
  }, [newNote])

  const handleSubmitRequest = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('title') as string
    const message = formData.get('message') as string
    if (!title.trim()) return

    const today = new Date().toISOString().split('T')[0]
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      client: 'You',
      status: 'submitted',
      timeline: [{ date: today, note: 'Project submitted' }],
      files: [],
      messages: message.trim()
        ? [{ from: 'You', text: message.trim(), date: today }]
        : [],
    }
    setProjects(prev => [newProject, ...prev])
    track('demo_interaction', { action: 'request_submitted' })
    form.reset()
    setSelectedId(newProject.id)
  }, [])

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-[var(--line)] mb-6">
        <button
          onClick={() => setView('client')}
          className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${
            view === 'client'
              ? 'border-[var(--accent)] text-[var(--accent-bright)] bg-[var(--surface)]'
              : 'border-transparent text-[var(--ink-dim)] hover:text-[var(--ink)]'
          }`}
        >
          client-view.tsx
        </button>
        <button
          onClick={() => {
            if (!adminViewTracked.current) {
              track('demo_interaction', { action: 'view_switched_admin' })
              adminViewTracked.current = true
            }
            setView('admin')
          }}
          className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${
            view === 'admin'
              ? 'border-[var(--accent)] text-[var(--accent-bright)] bg-[var(--surface)]'
              : 'border-transparent text-[var(--ink-dim)] hover:text-[var(--ink)]'
          }`}
        >
          admin-view.tsx
        </button>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-4">
        {/* Project list */}
        <div className="space-y-2">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedId === p.id
                  ? 'border-[var(--accent)] bg-emerald-500/5'
                  : 'border-[var(--line)] bg-[var(--surface-overlay)] hover:bg-[var(--bg-card)]/40'
              }`}
            >
              <div className="text-sm text-[var(--ink)] font-medium">{p.title}</div>
              <div className="text-xs text-[var(--ink-dim)] mt-1">{p.client}</div>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-mono border ${STATUS_COLORS[p.status]}`}>
                {STATUS_LABELS[p.status]}
              </span>
            </button>
          ))}

          {/* Submit new (client view only) */}
          {view === 'client' && (
            <form onSubmit={handleSubmitRequest} className="mt-4 p-3 rounded-lg border border-dashed border-[var(--line-soft)] space-y-2">
              <div className="font-mono text-xs text-[var(--ink-dim)]">+ new request</div>
              <input
                name="title"
                placeholder="Project title"
                required
                className="w-full bg-[var(--bg)] border border-[var(--line)] rounded px-2 py-1.5 text-sm text-[var(--ink)] placeholder-slate-600 focus:border-[var(--accent)] outline-none"
              />
              <textarea
                name="message"
                placeholder="Tell me about your project..."
                rows={2}
                className="w-full bg-[var(--bg)] border border-[var(--line)] rounded px-2 py-1.5 text-sm text-[var(--ink)] placeholder-slate-600 focus:border-[var(--accent)] outline-none resize-none"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-[var(--accent-glow)] hover:bg-emerald-500/30 text-[var(--accent)] rounded font-mono text-xs transition-colors border border-[var(--accent)]"
              >
                $ submit
              </button>
            </form>
          )}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-overlay)] p-5 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[var(--heading)]">{selected.title}</h3>
              <div className="text-sm text-[var(--ink-dim)] mt-1">Client: {selected.client}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono border ${STATUS_COLORS[selected.status]}`}>
                  {STATUS_LABELS[selected.status]}
                </span>
                {view === 'admin' && (
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value as Project['status'])}
                    className="bg-[var(--bg)] border border-[var(--line-soft)] rounded px-2 py-0.5 text-xs font-mono text-[var(--ink)] focus:border-[var(--accent)] outline-none"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="font-mono text-xs text-[var(--ink-dim)] uppercase tracking-wide mb-2">Timeline</div>
              <div className="space-y-2 border-l-2 border-[var(--line)] pl-4">
                {selected.timeline.map((entry, i) => (
                  <div key={i}>
                    <div className="font-mono text-xs text-[var(--ink-dim)]">{entry.date}</div>
                    <div className="text-sm text-[var(--ink)]">{entry.note}</div>
                  </div>
                ))}
              </div>
              {view === 'admin' && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 bg-[var(--bg)] border border-[var(--line)] rounded px-2 py-1 text-sm text-[var(--ink)] placeholder-slate-600 focus:border-[var(--accent)] outline-none"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNote(selected.id) } }}
                  />
                  <button
                    onClick={() => addNote(selected.id)}
                    className="px-3 py-1 bg-[var(--bg-card)] hover:bg-[var(--line-soft)] text-[var(--ink)] rounded font-mono text-xs transition-colors"
                  >
                    + add
                  </button>
                </div>
              )}
            </div>

            {/* Files */}
            {selected.files.length > 0 && (
              <div>
                <div className="font-mono text-xs text-[var(--ink-dim)] uppercase tracking-wide mb-2">Files</div>
                <div className="space-y-1">
                  {selected.files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-1 px-2 rounded bg-[var(--bg-card)]/40 text-sm">
                      <span className="text-[var(--ink)] font-mono text-xs">{f.name}</span>
                      <span className="text-[var(--ink-dim)] text-xs">{f.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {selected.messages.length > 0 && (
              <div>
                <div className="font-mono text-xs text-[var(--ink-dim)] uppercase tracking-wide mb-2">Messages</div>
                <div className="space-y-2">
                  {selected.messages.map((m, i) => (
                    <div key={i} className="p-2 rounded bg-[var(--bg-card)]/40">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-[var(--accent)]">{m.from}</span>
                        <span className="text-[var(--ink-dim)]">{m.date}</span>
                      </div>
                      <div className="text-sm text-[var(--ink)] mt-1">{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-overlay)] p-8 flex items-center justify-center">
            <div className="text-[var(--ink-dim)] font-mono text-sm">Select a project to view details</div>
          </div>
        )}
      </div>
    </div>
  )
}
