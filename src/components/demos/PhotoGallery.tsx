'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { track } from '@vercel/analytics'

type Status = 'pending' | 'approved' | 'rejected'
type Photo = {
  id: string
  seed: string
  filename: string
  status: Status
  comment?: string
}

const SEED_PHOTOS: Photo[] = [
  { id: 'p01', seed: 'fritz-portrait-01', filename: 'IMG_4012.jpg', status: 'pending' },
  { id: 'p02', seed: 'fritz-portrait-02', filename: 'IMG_4023.jpg', status: 'pending' },
  { id: 'p03', seed: 'fritz-portrait-03', filename: 'IMG_4031.jpg', status: 'pending' },
  { id: 'p04', seed: 'fritz-portrait-04', filename: 'IMG_4044.jpg', status: 'pending' },
  { id: 'p05', seed: 'fritz-portrait-05', filename: 'IMG_4058.jpg', status: 'pending' },
  { id: 'p06', seed: 'fritz-portrait-06', filename: 'IMG_4067.jpg', status: 'pending' },
  { id: 'p07', seed: 'fritz-portrait-07', filename: 'IMG_4072.jpg', status: 'pending' },
  { id: 'p08', seed: 'fritz-portrait-08', filename: 'IMG_4089.jpg', status: 'pending' },
  { id: 'p09', seed: 'fritz-portrait-09', filename: 'IMG_4093.jpg', status: 'pending' },
  { id: 'p10', seed: 'fritz-portrait-10', filename: 'IMG_4101.jpg', status: 'pending' },
  { id: 'p11', seed: 'fritz-portrait-11', filename: 'IMG_4118.jpg', status: 'pending' },
  { id: 'p12', seed: 'fritz-portrait-12', filename: 'IMG_4127.jpg', status: 'pending' },
]

function thumbUrl(seed: string) {
  return `https://picsum.photos/seed/${seed}/480/600`
}
function fullUrl(seed: string) {
  return `https://picsum.photos/seed/${seed}/1200/1500`
}

export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>(SEED_PHOTOS)
  const [openId, setOpenId] = useState<string | null>(null)
  const [sent, setSent] = useState<{ count: number } | null>(null)

  const stats = useMemo(() => {
    const approved = photos.filter(p => p.status === 'approved').length
    const rejected = photos.filter(p => p.status === 'rejected').length
    const pending = photos.filter(p => p.status === 'pending').length
    return { approved, rejected, pending }
  }, [photos])

  const openIndex = openId ? photos.findIndex(p => p.id === openId) : -1
  const open = openIndex >= 0 ? photos[openIndex] : null

  const setStatus = useCallback((id: string, status: Status) => {
    setPhotos(curr => curr.map(p => (p.id === id ? { ...p, status } : p)))
    track('demo_interaction', { demo: 'gallery', action: status })
  }, [])

  const setComment = useCallback((id: string, comment: string) => {
    setPhotos(curr => curr.map(p => (p.id === id ? { ...p, comment } : p)))
  }, [])

  const navOpen = useCallback((delta: number) => {
    if (openIndex < 0) return
    const next = (openIndex + delta + photos.length) % photos.length
    setOpenId(photos[next].id)
  }, [openIndex, photos])

  // Keyboard nav inside lightbox
  useEffect(() => {
    if (!openId) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpenId(null); return }
      if (e.key === 'ArrowRight') { navOpen(1); return }
      if (e.key === 'ArrowLeft')  { navOpen(-1); return }
      if (open && (e.key === 'a' || e.key === 'A')) { setStatus(open.id, 'approved'); navOpen(1) }
      if (open && (e.key === 'r' || e.key === 'R')) { setStatus(open.id, 'rejected'); navOpen(1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId, open, navOpen, setStatus])

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (!openId) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [openId])

  function approveAll() {
    setPhotos(curr => curr.map(p => (p.status === 'pending' ? { ...p, status: 'approved' } : p)))
    track('demo_interaction', { demo: 'gallery', action: 'approve_all' })
  }

  function reset() {
    setPhotos(SEED_PHOTOS)
    setSent(null)
  }

  function sendSelections() {
    if (stats.approved === 0) return
    setSent({ count: stats.approved })
    track('demo_interaction', { demo: 'gallery', action: 'sent', count: stats.approved })
  }

  if (sent) {
    return <SentState count={sent.count} onReset={reset} />
  }

  return (
    <div>
      {/* Top bar */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.04em]">
            // gallery: <span className="text-[var(--accent)]">~/two-makers-co/portraits</span>
          </div>
          <div className="mt-1 font-sans font-semibold text-[15px] text-[var(--heading)]">
            Two Makers Co · brand portraits
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-[var(--ink-dim)]">
            12 proofs · select your favorites
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-x-5 gap-y-2 font-mono text-[11.5px]">
          <Stat label="approved" value={stats.approved} accent />
          <Stat label="rejected" value={stats.rejected} muted />
          <Stat label="pending"  value={stats.pending} />
        </div>
      </div>

      {/* Action row */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={sendSelections}
          disabled={stats.approved === 0}
          className="px-3 py-1.5 rounded-lg font-sans font-semibold text-[13px] bg-[var(--accent)] text-[var(--btn-fg)] hover:opacity-90 disabled:bg-[var(--surface)] disabled:text-[var(--ink-dim)] disabled:cursor-not-allowed transition-all"
        >
          Send approved set ({stats.approved})
        </button>
        <button
          type="button"
          onClick={approveAll}
          className="px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg-card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-mono text-[12px] transition-colors"
        >approve all pending</button>
        <button
          type="button"
          onClick={reset}
          className="px-3 py-1.5 rounded-lg border border-dashed border-[var(--line)] text-[var(--ink-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)] font-mono text-[12px] transition-colors"
        >reset</button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {photos.map(p => (
          <Tile
            key={p.id}
            photo={p}
            onOpen={() => setOpenId(p.id)}
            onApprove={() => setStatus(p.id, 'approved')}
            onReject={() => setStatus(p.id, 'rejected')}
          />
        ))}
      </div>

      <div className="mt-4 font-mono text-[11px] text-[var(--ink-dim)] flex flex-wrap gap-x-4 gap-y-1">
        <span>tap a photo to <span className="text-[var(--accent)]">comment</span></span>
        <span>· in lightbox: <span className="text-[var(--accent)]">←/→</span> nav, <span className="text-[var(--accent)]">a</span> approve, <span className="text-[var(--accent)]">r</span> reject</span>
      </div>

      {open && (
        <Lightbox
          photo={open}
          index={openIndex}
          total={photos.length}
          onClose={() => setOpenId(null)}
          onNav={navOpen}
          onStatus={s => setStatus(open.id, s)}
          onComment={c => setComment(open.id, c)}
        />
      )}
    </div>
  )
}

function Stat({ label, value, accent, muted }: { label: string; value: number; accent?: boolean; muted?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider">{label}</div>
      <div
        className={`tabular-nums font-semibold text-[14px] ${
          accent ? 'text-[var(--accent)]' : muted ? 'text-[var(--ink-dim)]' : 'text-[var(--heading)]'
        }`}
      >{value}</div>
    </div>
  )
}

function Tile({
  photo,
  onOpen,
  onApprove,
  onReject,
}: {
  photo: Photo
  onOpen: () => void
  onApprove: () => void
  onReject: () => void
}) {
  const isApproved = photo.status === 'approved'
  const isRejected = photo.status === 'rejected'
  return (
    <div className="group relative rounded-lg overflow-hidden border border-[var(--line)] bg-[var(--surface)] aspect-[4/5]">
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 w-full h-full"
        aria-label={`Open ${photo.filename}`}
      >
        <img
          src={thumbUrl(photo.seed)}
          alt={photo.filename}
          loading="lazy"
          className={`w-full h-full object-cover transition-all ${
            isRejected ? 'grayscale opacity-50' : isApproved ? '' : 'opacity-90 group-hover:opacity-100'
          }`}
        />
      </button>

      {/* Status badge */}
      {photo.status !== 'pending' && (
        <span
          className={`absolute top-2 left-2 z-[2] inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10.5px] backdrop-blur ${
            isApproved
              ? 'bg-[var(--accent-glow)] text-[var(--accent)]'
              : 'bg-black/40 text-white/90'
          }`}
          style={isApproved ? { border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)' } : undefined}
        >
          {isApproved ? '✓ approved' : '✗ rejected'}
        </span>
      )}
      {photo.comment && (
        <span
          className="absolute top-2 right-2 z-[2] inline-flex items-center justify-center w-5 h-5 rounded-full bg-black/50 text-white text-[10px] backdrop-blur"
          aria-label="has comment"
          title={photo.comment}
        >💬</span>
      )}

      {/* Quick actions on hover */}
      <div className="absolute bottom-0 inset-x-0 z-[2] p-2 bg-gradient-to-t from-black/75 to-transparent flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <button
          type="button"
          onClick={onApprove}
          className="pointer-events-auto flex-1 px-2 py-1 rounded font-mono text-[11px] bg-[var(--accent)] text-[var(--btn-fg)] hover:opacity-90"
        >✓ approve</button>
        <button
          type="button"
          onClick={onReject}
          className="pointer-events-auto px-2 py-1 rounded font-mono text-[11px] bg-black/60 text-white border border-white/20 hover:bg-black/80"
          aria-label="reject"
        >✗</button>
      </div>

      {/* Filename strip */}
      <div className="absolute bottom-0 inset-x-0 px-2 py-1 bg-gradient-to-t from-black/55 to-transparent group-hover:opacity-0 transition-opacity">
        <span className="font-mono text-[10px] text-white/85">{photo.filename}</span>
      </div>
    </div>
  )
}

function Lightbox({
  photo,
  index,
  total,
  onClose,
  onNav,
  onStatus,
  onComment,
}: {
  photo: Photo
  index: number
  total: number
  onClose: () => void
  onNav: (delta: number) => void
  onStatus: (s: Status) => void
  onComment: (c: string) => void
}) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm grid place-items-center p-4 sm:p-8 animate-[v3-fade-in_0.18s_ease]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.filename}, ${index + 1} of ${total}`}
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 max-w-[1200px] w-full max-h-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Image pane */}
        <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-0">
          <img
            src={fullUrl(photo.seed)}
            alt={photo.filename}
            className="max-w-full max-h-[70vh] lg:max-h-[80vh] object-contain"
          />
          {/* Prev/next */}
          <button
            type="button"
            onClick={() => onNav(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 text-white grid place-items-center text-[18px] backdrop-blur"
            aria-label="Previous photo"
          >‹</button>
          <button
            type="button"
            onClick={() => onNav(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 text-white grid place-items-center text-[18px] backdrop-blur"
            aria-label="Next photo"
          >›</button>
          {/* Top bar */}
          <div className="absolute top-0 inset-x-0 px-3 py-2 flex items-center gap-3 font-mono text-[11px] text-white/80 bg-gradient-to-b from-black/55 to-transparent">
            <span>{photo.filename}</span>
            <span className="opacity-60">·</span>
            <span className="opacity-80">{index + 1} / {total}</span>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto w-7 h-7 rounded-full bg-black/55 hover:bg-black/75 text-white grid place-items-center"
              aria-label="Close"
            >×</button>
          </div>
        </div>

        {/* Side panel */}
        <aside className="rounded-lg bg-[var(--bg-card)] border border-[var(--line)] p-4 flex flex-col gap-3 min-h-0">
          <div className="font-mono text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider">status</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onStatus('approved')}
              className={`flex-1 px-3 py-2 rounded-lg font-mono text-[12px] transition-colors ${
                photo.status === 'approved'
                  ? 'bg-[var(--accent)] text-[var(--btn-fg)]'
                  : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >✓ approve</button>
            <button
              type="button"
              onClick={() => onStatus('rejected')}
              className={`flex-1 px-3 py-2 rounded-lg font-mono text-[12px] transition-colors ${
                photo.status === 'rejected'
                  ? 'bg-[var(--ink-dim)] text-[var(--bg)]'
                  : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink-dim)]'
              }`}
            >✗ reject</button>
          </div>

          <div>
            <div className="font-mono text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider mb-1">comment</div>
            <textarea
              value={photo.comment || ''}
              onChange={e => onComment(e.target.value)}
              rows={4}
              placeholder="like the warmer tone here · maybe try without grain · etc."
              className="w-full px-3 py-2 rounded-lg border border-[var(--line)] bg-[var(--bg-card)] text-[var(--ink)] font-sans text-[13px] focus:outline-none focus:border-[var(--accent)] resize-none"
            />
          </div>

          <div className="mt-auto pt-3 border-t border-dashed border-[var(--line)] font-mono text-[10.5px] text-[var(--ink-dim)] space-y-1">
            <div><span className="text-[var(--accent)]">←/→</span> previous / next</div>
            <div><span className="text-[var(--accent)]">a</span> approve · <span className="text-[var(--accent)]">r</span> reject (auto-advances)</div>
            <div><span className="text-[var(--accent)]">esc</span> close</div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SentState({ count, onReset }: { count: number; onReset: () => void }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center gap-2.5 font-mono text-xs text-[var(--ink-dim)]">
        <span className="v3-pulse-dot" />
        <span className="text-[var(--ink-soft)]">~/selections-sent.log</span>
        <span className="ml-auto text-[var(--accent)]">200 OK</span>
      </div>
      <div className="p-8 text-center">
        <div
          className="mx-auto w-14 h-14 rounded-full grid place-items-center text-[28px] font-bold mb-4"
          style={{
            background: 'var(--accent-glow)',
            color: 'var(--accent)',
            border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)',
          }}
          aria-hidden
        >✓</div>
        <h3 className="font-sans font-bold text-[22px] text-[var(--heading)] tracking-[-0.012em]">{count} selection{count === 1 ? '' : 's'} sent.</h3>
        <p className="mt-2 text-[14.5px] text-[var(--ink-soft)] max-w-md mx-auto">
          The photographer gets your picks plus any comments you left, ready to start retouching.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 px-4 py-2 rounded-lg border border-[var(--line)] bg-[var(--bg-card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-mono text-[12.5px] transition-colors"
        >← review again</button>
      </div>
    </div>
  )
}
