'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { track } from '@vercel/analytics'

type Status = 'new' | 'making' | 'ready' | 'picked-up'
type LineItem = { name: string; qty: number; price: number }
type Order = {
  id: string
  customer: string
  items: LineItem[]
  status: Status
  placedMinAgo: number   // minutes since placed (counts up while open)
  movedAt?: number       // Date.now() of the most recent column move
}

const COLUMNS: { status: Status; label: string }[] = [
  { status: 'new',       label: 'new' },
  { status: 'making',    label: 'making' },
  { status: 'ready',     label: 'ready for pickup' },
  { status: 'picked-up', label: 'picked up' },
]

const NEXT_STATUS: Record<Status, Status | null> = {
  'new':       'making',
  'making':    'ready',
  'ready':     'picked-up',
  'picked-up': null,
}

const SEED: Order[] = [
  { id: 'o1', customer: 'Maddie K.',         items: [{ name: 'cortado', qty: 2, price: 4.50 }, { name: 'cinnamon roll', qty: 1, price: 5.50 }], status: 'new', placedMinAgo: 1 },
  { id: 'o2', customer: 'Drew R.',           items: [{ name: 'latte', qty: 1, price: 5 }, { name: 'blueberry muffin', qty: 1, price: 4.25 }], status: 'new', placedMinAgo: 3 },
  { id: 'o3', customer: 'Hometown Studios',  items: [{ name: 'drip coffee', qty: 4, price: 3.50 }], status: 'making', placedMinAgo: 6 },
  { id: 'o4', customer: 'Iowan Foodie',      items: [{ name: 'sourdough loaf', qty: 12, price: 7 }], status: 'making', placedMinAgo: 9 },
  { id: 'o5', customer: 'Sam P.',            items: [{ name: 'flat white', qty: 1, price: 5 }, { name: 'scone', qty: 1, price: 3.75 }], status: 'ready', placedMinAgo: 11 },
  { id: 'o6', customer: 'Two Makers Co.',    items: [{ name: 'box of 6 cookies', qty: 3, price: 14 }], status: 'ready', placedMinAgo: 14 },
  { id: 'o7', customer: 'Riley T.',          items: [{ name: 'cold brew', qty: 1, price: 4.50 }], status: 'picked-up', placedMinAgo: 22 },
  { id: 'o8', customer: 'Tasha O.',          items: [{ name: 'americano', qty: 1, price: 4 }], status: 'picked-up', placedMinAgo: 28 },
]

const RANDOM_CUSTOMERS = ['Lena B.', 'Owen H.', 'Priya N.', 'Marcus W.', 'Beth A.', 'Jonas K.', 'Ravi S.', 'Erin Q.']
const RANDOM_ITEMS: LineItem[][] = [
  [{ name: 'latte', qty: 1, price: 5 }, { name: 'banana bread', qty: 1, price: 4 }],
  [{ name: 'drip coffee', qty: 2, price: 3.50 }],
  [{ name: 'flat white', qty: 1, price: 5 }],
  [{ name: 'cold brew', qty: 1, price: 4.50 }, { name: 'scone', qty: 1, price: 3.75 }],
  [{ name: 'cortado', qty: 1, price: 4.50 }],
]

function newId() {
  return 'o' + Math.random().toString(36).slice(2, 8)
}

function fmtMoney(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
}

function lineTotal(items: LineItem[]) {
  return items.reduce((sum, i) => sum + i.qty * i.price, 0)
}

function fmtAgo(min: number) {
  if (min < 1) return 'just now'
  if (min === 1) return '1 min ago'
  if (min < 60) return `${min} min ago`
  return `${Math.floor(min / 60)} hr ago`
}

export function OrderQueue() {
  const [orders, setOrders] = useState<Order[]>(SEED)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<Status | null>(null)
  const dropTickRef = useRef<number>(0)

  // Tick "minutes ago" once per minute. Cheap.
  useEffect(() => {
    const id = window.setInterval(() => {
      setOrders(curr => curr.map(o => (o.status === 'picked-up' ? o : { ...o, placedMinAgo: o.placedMinAgo + 1 })))
    }, 60_000)
    return () => window.clearInterval(id)
  }, [])

  function moveOrder(id: string, status: Status) {
    setOrders(curr => curr.map(o => (o.id === id ? { ...o, status, movedAt: Date.now() } : o)))
    track('demo_interaction', { demo: 'orders', action: 'moved', to: status })
  }

  function advance(id: string) {
    const o = orders.find(x => x.id === id)
    if (!o) return
    const next = NEXT_STATUS[o.status]
    if (!next) return
    moveOrder(id, next)
  }

  function addRandomOrder() {
    const customer = RANDOM_CUSTOMERS[Math.floor(Math.random() * RANDOM_CUSTOMERS.length)]
    const items = RANDOM_ITEMS[Math.floor(Math.random() * RANDOM_ITEMS.length)]
    const order: Order = { id: newId(), customer, items, status: 'new', placedMinAgo: 0 }
    setOrders(curr => [order, ...curr])
    track('demo_interaction', { demo: 'orders', action: 'added' })
  }

  function reset() {
    setOrders(SEED)
  }

  function onDragStart(e: React.DragEvent, id: string) {
    setDraggingId(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }

  function onDragEnd() {
    setDraggingId(null)
    setDragOver(null)
  }

  function onDragOver(e: React.DragEvent, status: Status) {
    e.preventDefault()
    // Throttle re-renders so dragOver doesn't thrash
    const t = Date.now()
    if (t - dropTickRef.current > 60) {
      dropTickRef.current = t
      setDragOver(status)
    }
  }

  function onDrop(e: React.DragEvent, status: Status) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || draggingId
    if (id) moveOrder(id, status)
    setDragOver(null)
    setDraggingId(null)
  }

  // Day stats (revenue from picked-up + count)
  const stats = useMemo(() => {
    const picked = orders.filter(o => o.status === 'picked-up')
    const revenue = picked.reduce((s, o) => s + lineTotal(o.items), 0)
    const open = orders.length - picked.length
    return { count: picked.length, revenue, open }
  }, [orders])

  return (
    <div>
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between mb-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11.5px]">
          <Stat label="open" value={String(stats.open)} />
          <Stat label="picked up today" value={String(stats.count)} />
          <Stat label="revenue today" value={fmtMoney(stats.revenue)} accent />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addRandomOrder}
            className="px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg-card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-mono text-[12px] transition-colors"
          >+ new order</button>
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1.5 rounded-lg border border-dashed border-[var(--line)] text-[var(--ink-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)] font-mono text-[12px] transition-colors"
          >reset</button>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {COLUMNS.map(col => {
          const cards = orders.filter(o => o.status === col.status)
          const subtotal = lineTotal(cards.flatMap(c => c.items))
          const isDropTarget = dragOver === col.status && draggingId !== null
          const isPickedUp = col.status === 'picked-up'
          return (
            <div
              key={col.status}
              onDragOver={e => onDragOver(e, col.status)}
              onDragLeave={() => setDragOver(prev => (prev === col.status ? null : prev))}
              onDrop={e => onDrop(e, col.status)}
              className={`rounded-xl border bg-[var(--bg-card)] flex flex-col min-h-[200px] transition-all duration-150 ${
                isDropTarget
                  ? 'border-[var(--accent)] bg-[var(--accent-glow)]'
                  : 'border-[var(--line)]'
              }`}
            >
              <div className="flex items-baseline gap-2 px-3.5 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)]">
                <span className="font-mono text-[12px] text-[var(--accent)] tracking-[0.04em]">// {col.label}</span>
                <span className="ml-auto font-mono text-[11px] text-[var(--ink-dim)] tabular-nums">
                  {cards.length}{isPickedUp ? '' : ` · ${fmtMoney(subtotal)}`}
                </span>
              </div>
              <div className="p-3 space-y-2.5 flex-1">
                {cards.length === 0 && (
                  <div className="rounded-lg border border-dashed border-[var(--line)] py-6 text-center font-mono text-[11px] text-[var(--ink-dim)]">
                    drag a card here
                  </div>
                )}
                {cards.map(o => (
                  <OrderCard
                    key={o.id}
                    order={o}
                    isDragging={draggingId === o.id}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onAdvance={advance}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 font-mono text-[11px] text-[var(--ink-dim)] flex flex-wrap gap-x-4 gap-y-1">
        <span><span className="text-[var(--accent)]">drag</span> cards across columns</span>
        <span>· or tap <span className="text-[var(--accent)]">→ next</span> on a card</span>
        <span>· cards age automatically while open</span>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider">{label}</div>
      <div className={`tabular-nums font-semibold ${accent ? 'text-[var(--accent)] text-[14px]' : 'text-[var(--heading)] text-[13px]'}`}>{value}</div>
    </div>
  )
}

function OrderCard({
  order,
  isDragging,
  onDragStart,
  onDragEnd,
  onAdvance,
}: {
  order: Order
  isDragging: boolean
  onDragStart: (e: React.DragEvent, id: string) => void
  onDragEnd: () => void
  onAdvance: (id: string) => void
}) {
  const total = lineTotal(order.items)
  const next = NEXT_STATUS[order.status]
  const isStale = order.status === 'ready' && order.placedMinAgo >= 10
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, order.id)}
      onDragEnd={onDragEnd}
      className={`group rounded-lg border bg-[var(--surface)] p-3 cursor-grab active:cursor-grabbing transition-all ${
        isDragging
          ? 'opacity-40 scale-[0.98]'
          : isStale
            ? 'border-[var(--accent)]'
            : 'border-[var(--line)] hover:border-[var(--ink-dim)]'
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="font-sans font-semibold text-[13.5px] text-[var(--heading)] truncate">{order.customer}</div>
        <span className={`font-mono text-[10.5px] tabular-nums ${isStale ? 'text-[var(--accent)]' : 'text-[var(--ink-dim)]'}`}>
          {fmtAgo(order.placedMinAgo)}{isStale ? ' · stale' : ''}
        </span>
      </div>
      <ul className="mt-1.5 space-y-0.5">
        {order.items.map((it, i) => (
          <li key={i} className="font-mono text-[11.5px] text-[var(--ink-soft)] flex justify-between gap-2">
            <span><span className="text-[var(--ink-dim)]">{it.qty}×</span> {it.name}</span>
            <span className="text-[var(--ink-dim)] tabular-nums">{fmtMoney(it.qty * it.price)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 pt-2 border-t border-dashed border-[var(--line)] flex items-center justify-between">
        <span className="font-mono text-[12px] text-[var(--accent)] tabular-nums">{fmtMoney(total)}</span>
        {next && (
          <button
            type="button"
            onClick={() => onAdvance(order.id)}
            className="px-2 py-0.5 rounded border border-[var(--line)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-mono text-[10.5px] text-[var(--ink-dim)] transition-colors"
          >→ {next === 'picked-up' ? 'picked up' : next}</button>
        )}
      </div>
    </div>
  )
}
