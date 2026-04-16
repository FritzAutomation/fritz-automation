import type { ProjectUpdateWithAuthor } from '@/types/database'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function UpdatesFeed({ updates }: { updates: ProjectUpdateWithAuthor[] }) {
  if (updates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="text-sm text-slate-500">
          I&apos;ll post progress here as we build. You&apos;ll see updates the moment I hit save.
        </p>
      </div>
    )
  }

  return (
    <ol className="space-y-4">
      {updates.map((update) => {
        const authorName = update.author
          ? `${update.author.first_name ?? ''} ${update.author.last_name ?? ''}`.trim()
          : 'Unknown'
        return (
          <li
            key={update.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-slate-700">{authorName || 'Fritz Automation'}</span>
              <time className="text-xs text-slate-500">{formatDate(update.created_at)}</time>
            </div>
            <p className="text-sm text-slate-800 whitespace-pre-wrap">{update.message}</p>
          </li>
        )
      })}
    </ol>
  )
}
