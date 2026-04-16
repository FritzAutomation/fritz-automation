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
  'completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
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
      <div className="flex border-b border-slate-800 mb-6">
        <button
          onClick={() => setView('client')}
          className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${
            view === 'client'
              ? 'border-emerald-400 text-emerald-300 bg-slate-900/60'
              : 'border-transparent text-slate-500 hover:text-slate-300'
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
              ? 'border-emerald-400 text-emerald-300 bg-slate-900/60'
              : 'border-transparent text-slate-500 hover:text-slate-300'
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
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/40'
              }`}
            >
              <div className="text-sm text-slate-200 font-medium">{p.title}</div>
              <div className="text-xs text-slate-500 mt-1">{p.client}</div>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-mono border ${STATUS_COLORS[p.status]}`}>
                {STATUS_LABELS[p.status]}
              </span>
            </button>
          ))}

          {/* Submit new (client view only) */}
          {view === 'client' && (
            <form onSubmit={handleSubmitRequest} className="mt-4 p-3 rounded-lg border border-dashed border-slate-700 space-y-2">
              <div className="font-mono text-xs text-slate-500">+ new request</div>
              <input
                name="title"
                placeholder="Project title"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 outline-none"
              />
              <textarea
                name="message"
                placeholder="Tell me about your project..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 outline-none resize-none"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded font-mono text-xs transition-colors border border-emerald-500/30"
              >
                $ submit
              </button>
            </form>
          )}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white">{selected.title}</h3>
              <div className="text-sm text-slate-500 mt-1">Client: {selected.client}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono border ${STATUS_COLORS[selected.status]}`}>
                  {STATUS_LABELS[selected.status]}
                </span>
                {view === 'admin' && (
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value as Project['status'])}
                    className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs font-mono text-slate-300 focus:border-emerald-500 outline-none"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">Timeline</div>
              <div className="space-y-2 border-l-2 border-slate-800 pl-4">
                {selected.timeline.map((entry, i) => (
                  <div key={i}>
                    <div className="font-mono text-xs text-slate-600">{entry.date}</div>
                    <div className="text-sm text-slate-300">{entry.note}</div>
                  </div>
                ))}
              </div>
              {view === 'admin' && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 outline-none"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNote(selected.id) } }}
                  />
                  <button
                    onClick={() => addNote(selected.id)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-xs transition-colors"
                  >
                    + add
                  </button>
                </div>
              )}
            </div>

            {/* Files */}
            {selected.files.length > 0 && (
              <div>
                <div className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">Files</div>
                <div className="space-y-1">
                  {selected.files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-1 px-2 rounded bg-slate-800/40 text-sm">
                      <span className="text-slate-300 font-mono text-xs">{f.name}</span>
                      <span className="text-slate-600 text-xs">{f.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {selected.messages.length > 0 && (
              <div>
                <div className="font-mono text-xs text-slate-500 uppercase tracking-wide mb-2">Messages</div>
                <div className="space-y-2">
                  {selected.messages.map((m, i) => (
                    <div key={i} className="p-2 rounded bg-slate-800/40">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-emerald-400">{m.from}</span>
                        <span className="text-slate-600">{m.date}</span>
                      </div>
                      <div className="text-sm text-slate-300 mt-1">{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 flex items-center justify-center">
            <div className="text-slate-600 font-mono text-sm">Select a project to view details</div>
          </div>
        )}
      </div>
    </div>
  )
}
