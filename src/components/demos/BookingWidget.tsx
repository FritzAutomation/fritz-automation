'use client'

import { useMemo, useState } from 'react'
import { track } from '@vercel/analytics'

type Service = {
  id: string
  name: string
  duration: number
  price: number
  deposit: number
  blurb: string
}

const SERVICES: Service[] = [
  { id: 'portrait',  name: 'Portrait session', duration: 60, price: 300, deposit: 50, blurb: 'studio · 1 hr · 30 edits' },
  { id: 'family',    name: 'Family session',   duration: 90, price: 450, deposit: 75, blurb: 'on-location · 1.5 hr · 50 edits' },
  { id: 'discovery', name: 'Discovery call',   duration: 30, price: 0,   deposit: 0,  blurb: 'free intro · video or phone' },
]

const SLOT_HOURS = [9, 10, 11, 13, 14, 15, 16]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DAYS_LONG = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// Deterministic "closed" days: Sundays + Mondays + a few specific dates per month
function isClosed(date: Date): boolean {
  const day = date.getDay()
  if (day === 0 || day === 1) return true
  const d = date.getDate()
  return d === 7 || d === 22
}

// Deterministic "this slot is already booked"
function isSlotTaken(date: Date, hour: number): boolean {
  // Stable hash from date + hour
  const seed = (date.getDate() * 31 + date.getMonth() * 7 + hour) % 11
  return seed < 3 // ~27% taken
}

function fmtHour(hour: number) {
  const ampm = hour >= 12 ? 'pm' : 'am'
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${h}:00 ${ampm}`
}

function fmtDateLong(d: Date) {
  return `${DAYS_LONG[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function BookingWidget() {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const service = SERVICES.find(s => s.id === serviceId) || null
  const monthGrid = useMemo(() => buildMonthGrid(view.year, view.month), [view])
  const monthLabel = `${MONTHS[view.month]} ${view.year}`

  const canConfirm = service && date && time !== null && name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  function reset() {
    setServiceId(null)
    setDate(null)
    setTime(null)
    setName('')
    setEmail('')
    setNotes('')
    setConfirmed(false)
    setView({ year: today.getFullYear(), month: today.getMonth() })
  }

  function selectService(id: string) {
    setServiceId(id)
    setDate(null)
    setTime(null)
    track('demo_interaction', { demo: 'booking', action: 'service_selected', service: id })
  }

  function selectDate(d: Date) {
    setDate(d)
    setTime(null)
    track('demo_interaction', { demo: 'booking', action: 'date_selected' })
  }

  function selectTime(h: number) {
    setTime(h)
    track('demo_interaction', { demo: 'booking', action: 'time_selected' })
  }

  function confirm() {
    if (!canConfirm) return
    setConfirmed(true)
    track('demo_interaction', { demo: 'booking', action: 'confirmed', service: serviceId })
  }

  function shiftMonth(delta: number) {
    setView(v => {
      let m = v.month + delta
      let y = v.year
      if (m < 0) { m = 11; y -= 1 }
      if (m > 11) { m = 0; y += 1 }
      return { year: y, month: m }
    })
  }

  if (confirmed && service && date && time !== null) {
    return <Confirmation service={service} date={date} hour={time} email={email} onReset={reset} />
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-5">
      {/* Main flow */}
      <div className="space-y-4">
        {/* Step 1 — service */}
        <Section
          step={1}
          label="pick a service"
          done={!!service}
          summary={service ? `${service.name} · ${service.duration} min${service.price ? ` · $${service.price}` : ''}` : null}
        >
          <div className="grid sm:grid-cols-3 gap-2.5">
            {SERVICES.map(s => {
              const selected = s.id === serviceId
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectService(s.id)}
                  className={`text-left rounded-lg border p-3.5 transition-all ${
                    selected
                      ? 'border-[var(--accent)] bg-[var(--accent-glow)]'
                      : 'border-[var(--line)] bg-[var(--bg-card)] hover:border-[var(--ink-dim)]'
                  }`}
                >
                  <div className="font-sans font-semibold text-[15px] text-[var(--heading)]">{s.name}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-[var(--ink-dim)]">{s.blurb}</div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-mono text-[13px] text-[var(--accent)]">
                      {s.price ? `$${s.price}` : 'free'}
                    </span>
                    {s.deposit > 0 && (
                      <span className="font-mono text-[10.5px] text-[var(--ink-dim)]">${s.deposit} deposit</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Step 2 — date */}
        <Section
          step={2}
          label="pick a date"
          enabled={!!service}
          done={!!date}
          summary={date ? fmtDateLong(date) : null}
        >
          <div className="rounded-lg border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)]">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="px-2 py-0.5 rounded text-[var(--ink-dim)] hover:text-[var(--accent)] hover:bg-[var(--surface)] font-mono text-sm"
                aria-label="Previous month"
              >‹</button>
              <span className="font-mono text-[13px] text-[var(--heading)]">{monthLabel}</span>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="px-2 py-0.5 rounded text-[var(--ink-dim)] hover:text-[var(--accent)] hover:bg-[var(--surface)] font-mono text-sm"
                aria-label="Next month"
              >›</button>
            </div>
            <div className="grid grid-cols-7 px-2 pt-2 pb-1 gap-1">
              {DAYS_SHORT.map((d, i) => (
                <div key={i} className="text-center font-mono text-[10px] text-[var(--ink-dim)] uppercase tracking-wider py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 px-2 pb-2 gap-1">
              {monthGrid.map((cell, i) => {
                if (!cell) return <div key={i} />
                const past = cell < today
                const closed = isClosed(cell)
                const disabled = past || closed
                const selected = date && isSameDay(cell, date)
                const isToday = isSameDay(cell, today)
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => selectDate(cell)}
                    className={`aspect-square rounded text-[12.5px] font-mono transition-colors flex items-center justify-center ${
                      selected
                        ? 'bg-[var(--accent)] text-[var(--btn-fg)] font-semibold'
                        : disabled
                          ? 'text-[var(--ink-dim)] opacity-40 line-through cursor-not-allowed'
                          : isToday
                            ? 'text-[var(--accent)] border border-[var(--accent)]'
                            : 'text-[var(--ink)] hover:bg-[var(--surface)]'
                    }`}
                  >
                    {cell.getDate()}
                  </button>
                )
              })}
            </div>
            <div className="px-3.5 py-2 border-t border-[var(--line)] bg-[var(--surface-overlay)] font-mono text-[10.5px] text-[var(--ink-dim)] flex flex-wrap items-center gap-3">
              <span><span className="inline-block w-2 h-2 rounded-sm bg-[var(--accent)] mr-1 align-middle" /> selected</span>
              <span><span className="inline-block w-2 h-2 rounded-sm border border-[var(--accent)] mr-1 align-middle" /> today</span>
              <span className="opacity-60">closed: Sun · Mon</span>
            </div>
          </div>
        </Section>

        {/* Step 3 — time */}
        <Section
          step={3}
          label="pick a time"
          enabled={!!date}
          done={time !== null}
          summary={time !== null ? fmtHour(time) : null}
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {SLOT_HOURS.map(h => {
              const taken = date ? isSlotTaken(date, h) : false
              const selected = time === h
              return (
                <button
                  key={h}
                  type="button"
                  disabled={taken}
                  onClick={() => selectTime(h)}
                  className={`px-3 py-2 rounded-lg border font-mono text-[13px] transition-all ${
                    selected
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--btn-fg)]'
                      : taken
                        ? 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink-dim)] line-through opacity-50 cursor-not-allowed'
                        : 'border-[var(--line)] bg-[var(--bg-card)] text-[var(--ink)] hover:border-[var(--accent)]'
                  }`}
                >
                  {fmtHour(h)}
                </button>
              )
            })}
          </div>
          <div className="mt-2 font-mono text-[11px] text-[var(--ink-dim)]">
            All times in <span className="text-[var(--ink-soft)]">CST</span>. Crossed-out slots are already booked.
          </div>
        </Section>

        {/* Step 4 — details */}
        <Section
          step={4}
          label="your details"
          enabled={time !== null}
          done={false}
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="name" required>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3 py-2 rounded-lg border border-[var(--line)] bg-[var(--bg-card)] text-[var(--ink)] font-sans text-[14px] focus:outline-none focus:border-[var(--accent)]"
              />
            </Field>
            <Field label="email" required>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-3 py-2 rounded-lg border border-[var(--line)] bg-[var(--bg-card)] text-[var(--ink)] font-sans text-[14px] focus:outline-none focus:border-[var(--accent)]"
              />
            </Field>
            <Field label="anything we should know?" className="sm:col-span-2">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="(optional)"
                className="w-full px-3 py-2 rounded-lg border border-[var(--line)] bg-[var(--bg-card)] text-[var(--ink)] font-sans text-[14px] focus:outline-none focus:border-[var(--accent)] resize-none"
              />
            </Field>
          </div>
          <button
            type="button"
            onClick={confirm}
            disabled={!canConfirm}
            className={`mt-4 w-full px-4 py-3 rounded-lg font-sans font-semibold text-[14px] transition-all ${
              canConfirm
                ? 'bg-[var(--accent)] text-[var(--btn-fg)] hover:opacity-90'
                : 'bg-[var(--surface)] text-[var(--ink-dim)] cursor-not-allowed'
            }`}
          >
            {service && service.deposit > 0
              ? `Confirm and pay $${service.deposit} deposit`
              : 'Confirm booking'}
          </button>
          <div className="mt-2 text-center font-mono text-[10.5px] text-[var(--ink-dim)]">
            // demo only · no card is charged · nothing is sent
          </div>
        </Section>
      </div>

      {/* Summary panel */}
      <aside className="lg:sticky lg:top-4 self-start rounded-lg border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden h-fit">
        <div className="px-3.5 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center justify-between font-mono text-[11.5px] text-[var(--ink-dim)]">
          <span>~/booking-summary</span>
          {!service && <span className="text-[var(--accent)]">empty</span>}
        </div>
        <div className="p-4 space-y-3 font-mono text-[12.5px]">
          <SummaryRow k="service" v={service?.name || '—'} hl={!!service} />
          <SummaryRow k="duration" v={service ? `${service.duration} min` : '—'} hl={!!service} />
          <SummaryRow k="date" v={date ? fmtDateLong(date) : '—'} hl={!!date} />
          <SummaryRow k="time" v={time !== null ? fmtHour(time) : '—'} hl={time !== null} />
          {service && (
            <>
              <div className="border-t border-dashed border-[var(--line)] pt-3 mt-3 space-y-1.5">
                <SummaryRow k="price" v={service.price ? `$${service.price}` : 'free'} hl />
                {service.deposit > 0 && (
                  <SummaryRow k="deposit due" v={`$${service.deposit}`} hl emphasize />
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}

function Section({
  step,
  label,
  enabled = true,
  done,
  summary,
  children,
}: {
  step: number
  label: string
  enabled?: boolean
  done: boolean
  summary?: string | null
  children: React.ReactNode
}) {
  return (
    <div className={`rounded-xl border bg-[var(--bg-card)] overflow-hidden transition-opacity ${
      enabled ? 'border-[var(--line)] opacity-100' : 'border-[var(--line)] opacity-50 pointer-events-none'
    }`}>
      <div className="flex items-baseline gap-3 px-4 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)]">
        <span className={`inline-grid place-items-center w-[18px] h-[18px] rounded-full text-[10px] font-mono ${
          done
            ? 'bg-[var(--accent)] text-[var(--btn-fg)]'
            : 'border border-[var(--line)] text-[var(--ink-dim)]'
        }`}>
          {done ? '✓' : step}
        </span>
        <span className="font-mono text-[12px] text-[var(--ink-dim)] tracking-[0.04em]">// {label}</span>
        {done && summary && (
          <span className="ml-auto font-mono text-[11.5px] text-[var(--accent)] truncate">{summary}</span>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className || ''}`}>
      <span className="block font-mono text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider mb-1">
        {label} {required && <span className="text-[var(--accent)]">*</span>}
      </span>
      {children}
    </label>
  )
}

function SummaryRow({ k, v, hl, emphasize }: { k: string; v: string; hl?: boolean; emphasize?: boolean }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-2">
      <span className="text-[var(--ink-dim)] uppercase tracking-wider text-[10.5px] pt-0.5">{k}</span>
      <span className={`text-right break-words ${
        emphasize
          ? 'text-[var(--accent)] font-semibold text-[13.5px]'
          : hl
            ? 'text-[var(--heading)]'
            : 'text-[var(--ink-dim)]'
      }`}>{v}</span>
    </div>
  )
}

function Confirmation({
  service,
  date,
  hour,
  email,
  onReset,
}: {
  service: Service
  date: Date
  hour: number
  email: string
  onReset: () => void
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center gap-2.5 font-mono text-xs text-[var(--ink-dim)]">
        <span className="v3-pulse-dot" />
        <span className="text-[var(--ink-soft)]">~/booking-confirmed</span>
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
        <h3 className="font-sans font-bold text-[22px] text-[var(--heading)] tracking-[-0.012em]">You&apos;re booked.</h3>
        <p className="mt-2 text-[14.5px] text-[var(--ink-soft)] max-w-md mx-auto">
          A confirmation is on its way to <span className="text-[var(--accent)]">{email}</span> with a calendar invite and prep notes.
        </p>

        <div className="mt-6 max-w-sm mx-auto rounded-lg border border-dashed border-[var(--line)] p-4 text-left font-mono text-[12.5px]" style={{ background: 'var(--surface-overlay)' }}>
          <div className="grid grid-cols-[80px_1fr] gap-2 py-0.5">
            <span className="text-[var(--ink-dim)] uppercase text-[10.5px] tracking-wider pt-0.5">service</span>
            <span className="text-[var(--heading)]">{service.name}</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-2 py-0.5">
            <span className="text-[var(--ink-dim)] uppercase text-[10.5px] tracking-wider pt-0.5">when</span>
            <span className="text-[var(--heading)]">{fmtDateLong(date)} · {fmtHour(hour)}</span>
          </div>
          {service.deposit > 0 && (
            <div className="grid grid-cols-[80px_1fr] gap-2 py-0.5">
              <span className="text-[var(--ink-dim)] uppercase text-[10.5px] tracking-wider pt-0.5">paid</span>
              <span className="text-[var(--accent)]">${service.deposit} deposit</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-6 px-4 py-2 rounded-lg border border-[var(--line)] bg-[var(--bg-card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-mono text-[12.5px] transition-colors"
        >
          ← book another
        </button>
      </div>
    </div>
  )
}
