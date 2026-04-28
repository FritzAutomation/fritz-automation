'use client'

import { useMemo, useState } from 'react'
import { track } from '@vercel/analytics'

type LineItem = { id: string; description: string; qty: number; rate: number }

const SEED_ITEMS: LineItem[] = [
  { id: 'l1', description: 'Discovery + content audit', qty: 4,  rate: 120 },
  { id: 'l2', description: 'Design system + wireframes', qty: 10, rate: 115 },
  { id: 'l3', description: 'Frontend build (Next.js)',   qty: 24, rate: 110 },
  { id: 'l4', description: 'Launch + handoff',           qty: 4,  rate: 95  },
]

function newId() {
  return Math.random().toString(36).slice(2, 9)
}

function fmtMoney(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
}

function quoteNumber() {
  // Stable per-render
  const d = new Date()
  return `Q-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function plusDays(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function fmtDate(iso: string) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[m - 1]} ${d}, ${y}`
}

export function QuoteBuilder() {
  const [client, setClient] = useState('Iowan Foodie LLC')
  const [project, setProject] = useState('Website refresh + content sweep')
  const [issued] = useState(todayStr())
  const [validThru, setValidThru] = useState(plusDays(30))
  const [items, setItems] = useState<LineItem[]>(SEED_ITEMS)
  const [discountKind, setDiscountKind] = useState<'percent' | 'amount'>('percent')
  const [discountValue, setDiscountValue] = useState(0)
  const [taxPct, setTaxPct] = useState(0)
  const [notes, setNotes] = useState('Deposit (30%) due to start. Balance on launch. Includes one round of revisions per phase.')
  const [sent, setSent] = useState<{ to: string } | null>(null)
  const [sendEmail, setSendEmail] = useState('')

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.rate, 0)
    const discount = Math.max(0, discountKind === 'percent' ? subtotal * (discountValue / 100) : discountValue)
    const taxable = Math.max(0, subtotal - discount)
    const tax = taxable * (taxPct / 100)
    const total = taxable + tax
    return { subtotal, discount, tax, total }
  }, [items, discountKind, discountValue, taxPct])

  const qNum = useMemo(quoteNumber, [])

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems(curr => curr.map(it => (it.id === id ? { ...it, ...patch } : it)))
  }

  function addItem() {
    setItems(curr => [...curr, { id: newId(), description: '', qty: 1, rate: 0 }])
    track('demo_interaction', { demo: 'quotes', action: 'item_added' })
  }

  function removeItem(id: string) {
    setItems(curr => curr.filter(it => it.id !== id))
  }

  function send() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sendEmail)) return
    setSent({ to: sendEmail })
    track('demo_interaction', { demo: 'quotes', action: 'sent', total: totals.total })
  }

  function reset() {
    setClient('Iowan Foodie LLC')
    setProject('Website refresh + content sweep')
    setValidThru(plusDays(30))
    setItems(SEED_ITEMS)
    setDiscountKind('percent')
    setDiscountValue(0)
    setTaxPct(0)
    setNotes('Deposit (30%) due to start. Balance on launch. Includes one round of revisions per phase.')
    setSendEmail('')
    setSent(null)
  }

  if (sent) {
    return <SentState toEmail={sent.to} qNum={qNum} total={totals.total} onReset={reset} />
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.05fr] gap-5 items-start">
      {/* Editor */}
      <div className="space-y-4">
        <Card label="// quote details">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="client">
              <input
                type="text"
                value={client}
                onChange={e => setClient(e.target.value)}
                className="qb-input"
              />
            </Field>
            <Field label="valid through">
              <input
                type="date"
                value={validThru}
                onChange={e => setValidThru(e.target.value)}
                className="qb-input"
              />
            </Field>
            <Field label="project" className="sm:col-span-2">
              <input
                type="text"
                value={project}
                onChange={e => setProject(e.target.value)}
                className="qb-input"
              />
            </Field>
          </div>
        </Card>

        <Card label="// line items" right={`${items.length} ${items.length === 1 ? 'row' : 'rows'}`}>
          <div className="hidden sm:grid grid-cols-[1fr_70px_90px_90px_28px] gap-2 px-1 pb-1.5 font-mono text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider">
            <span>description</span>
            <span className="text-right">qty</span>
            <span className="text-right">rate</span>
            <span className="text-right">total</span>
            <span />
          </div>
          <div className="space-y-1.5">
            {items.map(it => (
              <div
                key={it.id}
                className="grid grid-cols-[1fr_60px_80px_28px] sm:grid-cols-[1fr_70px_90px_90px_28px] gap-2 items-center"
              >
                <input
                  type="text"
                  value={it.description}
                  onChange={e => updateItem(it.id, { description: e.target.value })}
                  placeholder="describe the work…"
                  className="qb-input"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  min={0}
                  value={it.qty}
                  onChange={e => updateItem(it.id, { qty: Number(e.target.value) || 0 })}
                  className="qb-input text-right"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  step="5"
                  min={0}
                  value={it.rate}
                  onChange={e => updateItem(it.id, { rate: Number(e.target.value) || 0 })}
                  className="qb-input text-right"
                />
                <span className="hidden sm:flex items-center justify-end font-mono text-[12.5px] text-[var(--heading)] tabular-nums">
                  {fmtMoney(it.qty * it.rate)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  className="text-[var(--ink-dim)] hover:text-[var(--accent)] font-mono text-sm"
                  aria-label="Remove line item"
                >×</button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 px-3 py-1.5 rounded-lg border border-dashed border-[var(--line)] text-[var(--ink-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)] font-mono text-[12px] transition-colors"
          >+ add line</button>
        </Card>

        <Card label="// adjustments">
          <div className="grid grid-cols-[80px_1fr] gap-x-3 gap-y-3 items-center">
            <span className="font-mono text-[11px] text-[var(--ink-dim)] uppercase tracking-wider">discount</span>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-[var(--line)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDiscountKind('percent')}
                  className={`px-2.5 py-1.5 font-mono text-[12px] ${
                    discountKind === 'percent'
                      ? 'bg-[var(--accent)] text-[var(--btn-fg)]'
                      : 'bg-[var(--bg-card)] text-[var(--ink-dim)] hover:text-[var(--ink)]'
                  }`}
                >%</button>
                <button
                  type="button"
                  onClick={() => setDiscountKind('amount')}
                  className={`px-2.5 py-1.5 font-mono text-[12px] border-l border-[var(--line)] ${
                    discountKind === 'amount'
                      ? 'bg-[var(--accent)] text-[var(--btn-fg)]'
                      : 'bg-[var(--bg-card)] text-[var(--ink-dim)] hover:text-[var(--ink)]'
                  }`}
                >$</button>
              </div>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={discountKind === 'percent' ? 1 : 25}
                value={discountValue}
                onChange={e => setDiscountValue(Math.max(0, Number(e.target.value) || 0))}
                className="qb-input flex-1 max-w-[160px]"
              />
            </div>
            <span className="font-mono text-[11px] text-[var(--ink-dim)] uppercase tracking-wider">tax</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={20}
                step="0.5"
                value={taxPct}
                onChange={e => setTaxPct(Math.max(0, Number(e.target.value) || 0))}
                className="qb-input w-[100px]"
              />
              <span className="font-mono text-[12px] text-[var(--ink-dim)]">%</span>
            </div>
          </div>
        </Card>

        <Card label="// notes & terms">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="qb-input resize-none"
          />
        </Card>

        <Card label="// send to client">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={sendEmail}
              onChange={e => setSendEmail(e.target.value)}
              placeholder="client@example.com"
              className="qb-input flex-1"
            />
            <button
              type="button"
              onClick={send}
              disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sendEmail) || items.length === 0}
              className="px-4 py-2 rounded-lg font-sans font-semibold text-[14px] bg-[var(--accent)] text-[var(--btn-fg)] hover:opacity-90 disabled:bg-[var(--surface)] disabled:text-[var(--ink-dim)] disabled:cursor-not-allowed transition-all"
            >
              Send quote
            </button>
          </div>
          <div className="mt-2 font-mono text-[10.5px] text-[var(--ink-dim)]">
            // demo only · no email is sent
          </div>
        </Card>
      </div>

      {/* Live document preview */}
      <DocumentPreview
        client={client}
        project={project}
        issued={issued}
        validThru={validThru}
        items={items}
        totals={totals}
        notes={notes}
        qNum={qNum}
        discountKind={discountKind}
        discountValue={discountValue}
        taxPct={taxPct}
      />

      <style jsx global>{`
        .qb-input {
          width: 100%;
          padding: 7px 10px;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: var(--bg-card);
          color: var(--ink);
          font-family: var(--font-mono), monospace;
          font-size: 13px;
        }
        .qb-input:focus {
          outline: none;
          border-color: var(--accent);
        }
        .qb-input[type="date"] {
          font-family: var(--font-mono), monospace;
        }
      `}</style>
    </div>
  )
}

function Card({
  label,
  right,
  children,
}: {
  label: string
  right?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
      <div className="flex items-baseline gap-3 px-4 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)]">
        <span className="font-mono text-[12px] text-[var(--accent)] tracking-[0.04em]">{label}</span>
        {right && <span className="ml-auto font-mono text-[11px] text-[var(--ink-dim)]">{right}</span>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className || ''}`}>
      <span className="block font-mono text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider mb-1">{label}</span>
      {children}
    </label>
  )
}

function DocumentPreview({
  client,
  project,
  issued,
  validThru,
  items,
  totals,
  notes,
  qNum,
  discountKind,
  discountValue,
  taxPct,
}: {
  client: string
  project: string
  issued: string
  validThru: string
  items: LineItem[]
  totals: { subtotal: number; discount: number; tax: number; total: number }
  notes: string
  qNum: string
  discountKind: 'percent' | 'amount'
  discountValue: number
  taxPct: number
}) {
  return (
    <div className="lg:sticky lg:top-4 self-start rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)] font-mono text-[12px] text-[var(--ink-dim)]">
        <span className="v3-pulse-dot" />
        <span>~/{qNum.toLowerCase()}.pdf · live preview</span>
        <span className="ml-auto text-[var(--accent)]">{fmtMoney(totals.total)}</span>
      </div>
      <div className="p-6 sm:p-8 space-y-5">
        {/* Letterhead */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
          <div>
            <div className="font-sans font-extrabold text-[22px] text-[var(--heading)] tracking-[-0.012em]">Fritz Automation</div>
            <div className="mt-0.5 font-mono text-[11px] text-[var(--ink-dim)]">burlington · iowa</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider">quote</div>
            <div className="font-mono text-[14px] text-[var(--heading)] tabular-nums">{qNum}</div>
            <div className="mt-1 font-mono text-[10.5px] text-[var(--ink-dim)]">issued {fmtDate(issued)}</div>
            <div className="font-mono text-[10.5px] text-[var(--ink-dim)]">valid until {fmtDate(validThru)}</div>
          </div>
        </div>

        {/* For */}
        <div>
          <div className="font-mono text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider">prepared for</div>
          <div className="mt-0.5 font-sans text-[16px] text-[var(--heading)] font-semibold">{client || <span className="text-[var(--ink-dim)] italic">(client name)</span>}</div>
          <div className="mt-1 font-mono text-[12.5px] text-[var(--ink-soft)]">{project || <span className="italic">(project title)</span>}</div>
        </div>

        {/* Line items table */}
        <div>
          <div className="grid grid-cols-[1fr_50px_80px_80px] gap-2 pb-1.5 border-b border-[var(--line)] font-mono text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider">
            <span>item</span>
            <span className="text-right">qty</span>
            <span className="text-right">rate</span>
            <span className="text-right">total</span>
          </div>
          <div className="divide-y divide-[var(--line)] divide-dashed">
            {items.length === 0 && (
              <div className="py-3 font-mono text-[12px] text-[var(--ink-dim)] italic">(no line items)</div>
            )}
            {items.map(it => (
              <div key={it.id} className="grid grid-cols-[1fr_50px_80px_80px] gap-2 py-2 items-baseline font-mono text-[12.5px] tabular-nums">
                <span className="text-[var(--ink)]">{it.description || <span className="text-[var(--ink-dim)] italic">—</span>}</span>
                <span className="text-right text-[var(--ink-soft)]">{it.qty}</span>
                <span className="text-right text-[var(--ink-soft)]">{fmtMoney(it.rate)}</span>
                <span className="text-right text-[var(--heading)]">{fmtMoney(it.qty * it.rate)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="ml-auto max-w-[260px] font-mono text-[12.5px] tabular-nums space-y-1">
          <TotalRow k="subtotal" v={fmtMoney(totals.subtotal)} />
          {totals.discount > 0 && (
            <TotalRow
              k={`discount${discountKind === 'percent' && discountValue ? ` (${discountValue}%)` : ''}`}
              v={`-${fmtMoney(totals.discount)}`}
              accent
            />
          )}
          {totals.tax > 0 && (
            <TotalRow k={`tax (${taxPct}%)`} v={fmtMoney(totals.tax)} />
          )}
          <div className="grid grid-cols-2 pt-2 mt-2 border-t border-[var(--line)]">
            <span className="text-[var(--ink-dim)] uppercase text-[11px] tracking-wider">total</span>
            <span className="text-right text-[15px] font-semibold text-[var(--accent)]">{fmtMoney(totals.total)}</span>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="pt-4 border-t border-[var(--line)]">
            <div className="font-mono text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider">notes & terms</div>
            <p className="mt-1.5 font-sans text-[12.5px] text-[var(--ink-soft)] leading-[1.5] whitespace-pre-wrap">{notes}</p>
          </div>
        )}

        {/* Mock signature */}
        <div className="pt-4 mt-2 border-t border-dashed border-[var(--line)] grid grid-cols-2 gap-4">
          <div>
            <div className="h-px bg-[var(--line)] mb-1.5" />
            <div className="font-mono text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider">accepted by</div>
          </div>
          <div>
            <div className="h-px bg-[var(--line)] mb-1.5" />
            <div className="font-mono text-[10.5px] text-[var(--ink-dim)] uppercase tracking-wider">date</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TotalRow({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <span className="text-[var(--ink-dim)] uppercase text-[11px] tracking-wider">{k}</span>
      <span className={`text-right ${accent ? 'text-[var(--accent)]' : 'text-[var(--heading)]'}`}>{v}</span>
    </div>
  )
}

function SentState({
  toEmail,
  qNum,
  total,
  onReset,
}: {
  toEmail: string
  qNum: string
  total: number
  onReset: () => void
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center gap-2.5 font-mono text-xs text-[var(--ink-dim)]">
        <span className="v3-pulse-dot" />
        <span className="text-[var(--ink-soft)]">~/quote-sent.log</span>
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
        <h3 className="font-sans font-bold text-[22px] text-[var(--heading)] tracking-[-0.012em]">Quote sent.</h3>
        <p className="mt-2 text-[14.5px] text-[var(--ink-soft)] max-w-md mx-auto">
          <span className="font-mono text-[var(--accent)]">{qNum}</span> — {fmtMoney(total)} — landed in <span className="text-[var(--accent)]">{toEmail}</span>&apos;s inbox with a clickable accept link.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 px-4 py-2 rounded-lg border border-[var(--line)] bg-[var(--bg-card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-mono text-[12.5px] transition-colors"
        >
          ← draft another
        </button>
      </div>
    </div>
  )
}
