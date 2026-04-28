'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { ScrollReveal } from '@/components/ScrollReveal'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function DemosPage() {
  const [flipped, setFlipped] = useState(false)
  useEffect(() => {
    const id = window.setInterval(() => setFlipped(f => !f), 3500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'demos' }]} />
          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.1s both' }}
          >
            Demos.
          </h1>
          <p
            className="mt-3 text-lg text-[var(--ink)] max-w-2xl"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.28s both' }}
          >
            Small working apps that show what I build on the internal-tools side. Play with them — everything runs in your browser.
          </p>
        </div>
      </section>

      <section className="bg-[var(--bg)] py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-2.5 flex items-center gap-2">
            <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
            <span className="text-[var(--accent)]">// available demos</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">Three interactive demos.</h2>
          <p className="mt-3 max-w-[60ch] text-[15px] text-[var(--ink-soft)] leading-relaxed">
            Each one solves a real problem I&apos;ve solved for past clients — simplified down to something you can actually click on.
          </p>

          <div className="mt-9 grid md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {/* CSV Dashboard card */}
            <Link
              href="/demos/csv-dashboard"
              className="demo-card group relative rounded-xl border border-[var(--line)] bg-[var(--bg-card)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/9] bg-gradient-to-br from-[var(--surface)] to-[var(--bg-card)] grid place-items-center overflow-hidden">
                <span
                  className="absolute top-3 left-3 z-[1] font-mono text-[10.5px] tracking-[0.05em] px-2 py-[3px] text-[var(--accent)] rounded inline-flex items-center gap-1.5 backdrop-blur"
                  style={{ background: 'var(--accent-glow)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}
                >
                  <span className="v3-pulse-dot" style={{ width: 5, height: 5 }} />interactive
                </span>
                {/* CSV bars mini-art */}
                <div className="flex items-end gap-2 h-full max-h-[130px] py-4">
                  {[40, 70, 55, 90, 65, 80, 50, 95].map((h, i) => (
                    <span
                      key={i}
                      className="block w-4 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background: 'linear-gradient(to top, var(--accent), color-mix(in srgb, var(--accent) 40%, transparent))',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="p-[22px] flex-1 flex flex-col">
                <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-1.5">
                  → <span className="text-[var(--accent)]">csv-dashboard.app</span>
                </div>
                <h3 className="font-sans font-bold text-[24px] text-[var(--heading)] tracking-[-0.012em]">CSV Dashboard</h3>
                <p className="mt-1.5 font-mono text-[13px] text-[var(--accent)]">spreadsheet chaos → clean dashboard</p>
                <p className="mt-3 text-[15.5px] text-[var(--ink)] leading-[1.5]">
                  Upload a CSV and get instant charts, filters, and summary stats. All in your browser, nothing uploaded.
                </p>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {['react', 'typescript', 'recharts', 'csv parsing'].map(s => (
                    <span key={s} className="px-[9px] py-0.5 rounded-full font-mono text-[11px] text-[var(--ink-soft)] border border-[var(--line)] bg-[var(--surface)]">{s}</span>
                  ))}
                </div>
                <div className="mt-[22px] pt-3.5 border-t border-dashed border-[var(--line)] flex items-baseline justify-between mt-auto">
                  <span className="font-mono text-[13px] text-[var(--accent)]">try it →</span>
                  <span className="font-mono text-[11px] text-[var(--ink-dim)]">runs locally</span>
                </div>
              </div>
            </Link>

            {/* Booking card */}
            <Link
              href="/demos/booking"
              className="demo-card group relative rounded-xl border border-[var(--line)] bg-[var(--bg-card)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/9] bg-gradient-to-br from-[var(--surface)] to-[var(--bg-card)] grid place-items-center overflow-hidden">
                <span
                  className="absolute top-3 left-3 z-[1] font-mono text-[10.5px] tracking-[0.05em] px-2 py-[3px] text-[var(--accent)] rounded inline-flex items-center gap-1.5 backdrop-blur"
                  style={{ background: 'var(--accent-glow)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}
                >
                  <span className="v3-pulse-dot" style={{ width: 5, height: 5 }} />interactive
                </span>
                {/* Mini calendar art */}
                <div className="grid grid-cols-7 gap-[3px] p-2">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const isHeader = i < 7
                    const isAccent = i === 17
                    const isMuted = [0, 6, 7, 13, 14, 20, 21, 27, 28].includes(i)
                    return (
                      <span
                        key={i}
                        className="block w-3 h-3 rounded-[2px]"
                        style={{
                          background: isAccent
                            ? 'var(--accent)'
                            : isHeader
                              ? 'color-mix(in srgb, var(--accent) 35%, transparent)'
                              : isMuted
                                ? 'var(--surface)'
                                : 'color-mix(in srgb, var(--accent) 12%, transparent)',
                        }}
                      />
                    )
                  })}
                </div>
              </div>
              <div className="p-[22px] flex-1 flex flex-col">
                <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-1.5">
                  → <span className="text-[var(--accent)]">booking.app</span>
                </div>
                <h3 className="font-sans font-bold text-[24px] text-[var(--heading)] tracking-[-0.012em]">Booking Widget</h3>
                <p className="mt-1.5 font-mono text-[13px] text-[var(--accent)]">email tag → self-serve booking</p>
                <p className="mt-3 text-[15.5px] text-[var(--ink)] leading-[1.5]">
                  Pick a service, pick a date, pick a time, leave a deposit. Four steps, no email back-and-forth.
                </p>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {['react', 'typescript', 'date math', 'forms'].map(s => (
                    <span key={s} className="px-[9px] py-0.5 rounded-full font-mono text-[11px] text-[var(--ink-soft)] border border-[var(--line)] bg-[var(--surface)]">{s}</span>
                  ))}
                </div>
                <div className="mt-[22px] pt-3.5 border-t border-dashed border-[var(--line)] flex items-baseline justify-between mt-auto">
                  <span className="font-mono text-[13px] text-[var(--accent)]">try it →</span>
                  <span className="font-mono text-[11px] text-[var(--ink-dim)]">4-step flow</span>
                </div>
              </div>
            </Link>

            {/* Client Portal card with autoflip */}
            <Link
              href="/demos/client-portal"
              className="demo-card group relative rounded-xl border border-[var(--line)] bg-[var(--bg-card)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/9] bg-gradient-to-br from-[var(--surface)] to-[var(--bg-card)] grid place-items-center overflow-hidden">
                <span
                  className="absolute top-3 left-3 z-[1] font-mono text-[10.5px] tracking-[0.05em] px-2 py-[3px] text-[var(--accent)] rounded inline-flex items-center gap-1.5 backdrop-blur"
                  style={{ background: 'var(--accent-glow)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}
                >
                  <span className="v3-pulse-dot" style={{ width: 5, height: 5 }} />interactive
                </span>
                <div className="w-[80%] max-w-[240px] aspect-[4/3] relative" style={{ perspective: '1000px' }}>
                  <FlipFace front facing={!flipped} title="CLIENT VIEW" rows={[
                    { label: 'two makers co' },
                    { label: '45% complete', amber: true },
                    { label: 'development', dim: true },
                    { label: '4 files shared' },
                  ]} />
                  <FlipFace facing={flipped} title="ADMIN VIEW" rows={[
                    { label: 'iowan-foodie · 80%' },
                    { label: 'two-makers · 45%', amber: true },
                    { label: 'hometown · 100%' },
                    { label: '4 active', dim: true },
                  ]} />
                </div>
              </div>
              <div className="p-[22px] flex-1 flex flex-col">
                <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-1.5">
                  → <span className="text-[var(--accent)]">client-portal.app</span>
                </div>
                <h3 className="font-sans font-bold text-[24px] text-[var(--heading)] tracking-[-0.012em]">Client Portal</h3>
                <p className="mt-1.5 font-mono text-[13px] text-[var(--accent)]">email chaos → organized portal</p>
                <p className="mt-3 text-[15.5px] text-[var(--ink)] leading-[1.5]">
                  Two views of one tool: clients track their project status, you manage everything from the admin side.
                </p>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {['react', 'typescript', 'tailwind', 'state mgmt'].map(s => (
                    <span key={s} className="px-[9px] py-0.5 rounded-full font-mono text-[11px] text-[var(--ink-soft)] border border-[var(--line)] bg-[var(--surface)]">{s}</span>
                  ))}
                </div>
                <div className="mt-[22px] pt-3.5 border-t border-dashed border-[var(--line)] flex items-baseline justify-between mt-auto">
                  <span className="font-mono text-[13px] text-[var(--accent)]">try it →</span>
                  <span className="font-mono text-[11px] text-[var(--ink-dim)]">2 viewpoints</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Secondary: shell demo (smaller, easter-egg style) */}
          <Link
            href="/shell"
            className="demo-card-shell mt-7 group relative rounded-xl border border-[var(--line)] bg-[var(--bg-card)] hover:-translate-y-0.5 hover:border-[var(--accent)] transition-all duration-200 overflow-hidden grid grid-cols-[auto_1fr_auto] items-center gap-4 px-[22px] py-[18px]"
          >
            <div
              className="w-9 h-9 rounded-lg grid place-items-center font-mono text-[15px] text-[var(--accent)]"
              style={{
                background: 'var(--accent-glow)',
                border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
              }}
              aria-hidden
            >&gt;_</div>
            <div>
              <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-0.5">
                → <span className="text-[var(--accent)]">/shell</span>
              </div>
              <div className="font-sans font-semibold text-[15.5px] text-[var(--heading)]">Browse the source.</div>
              <div className="text-[13.5px] text-[var(--ink-soft)]">
                A fake terminal you can navigate. Try <span className="font-mono text-[var(--accent)]">tree</span>, <span className="font-mono text-[var(--accent)]">cd projects</span>, <span className="font-mono text-[var(--accent)]">cat README.md</span>.
              </div>
            </div>
            <span className="font-mono text-[12px] text-[var(--ink-dim)] group-hover:text-[var(--accent)] transition-colors hidden sm:inline">open →</span>
          </Link>

          {/* Note */}
          <div
            className="mt-7 px-[22px] py-[18px] rounded-xl border border-dashed border-[var(--line)] grid grid-cols-[36px_1fr] gap-4 items-start"
            style={{ background: 'var(--surface-overlay)' }}
          >
            <div
              className="w-9 h-9 rounded-lg grid place-items-center font-mono text-[14px] text-[var(--accent)]"
              style={{
                background: 'var(--accent-glow)',
                border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
              }}
            >!</div>
            <div className="text-[14.5px] leading-[1.55] text-[var(--ink)]">
              <span className="font-semibold text-[var(--heading)]">These are simplified versions.</span> The real ones I&apos;ve built connect to live databases, send email notifications, handle authentication, and run inside firewalls. The demo runs the UI only — happy to walk through the production architecture on a call.
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal>
      <section className="bg-[var(--surface-overlay)] py-12 border-t border-[var(--line)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-2 flex items-center gap-2">
            <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
            <span className="text-[var(--accent)]">// what you don&apos;t see</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--heading)]">Most of my work is behind a VPN.</h2>
          <p className="mt-2 max-w-[60ch] text-[15px] text-[var(--ink-soft)] leading-relaxed">
            The internal tools, automation pipelines, and admin dashboards I&apos;ve built for past clients all live behind their firewalls.{' '}
            <Link href="/services#automation" className="text-[var(--accent)] border-b border-dashed border-[var(--accent-glow)] hover:text-[var(--accent-bright)]">See the kinds of projects I take on</Link>,
            or <Link href="/contact" className="text-[var(--accent)] border-b border-dashed border-[var(--accent-glow)] hover:text-[var(--accent-bright)]">book a call</Link> and I&apos;ll walk you through specifics.
          </p>
        </div>
      </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}

function FlipFace({
  front,
  facing,
  title,
  rows,
}: {
  front?: boolean
  facing: boolean
  title: string
  rows: { label: string; amber?: boolean; dim?: boolean }[]
}) {
  return (
    <div
      className="absolute inset-0 rounded-md p-3 flex flex-col gap-1.5 border border-[var(--line)]"
      style={{
        background: 'var(--surface-strong)',
        backfaceVisibility: 'hidden',
        transition: 'transform 0.7s cubic-bezier(0.6,0,0.4,1)',
        transform: facing
          ? 'rotateY(0deg)'
          : front
            ? 'rotateY(180deg)'
            : 'rotateY(-180deg)',
      }}
    >
      <div className="font-mono text-[9.5px] text-[var(--ink-dim)] tracking-[0.08em] uppercase">{title}</div>
      {rows.map((r, i) => (
        <div key={i} className="font-mono text-[9.5px] text-[var(--ink-soft)] flex gap-1.5 items-center">
          <span
            className="w-1 h-1 rounded-full"
            style={{
              background: r.amber ? 'var(--amber)' : r.dim ? 'var(--ink-dim)' : 'var(--accent)',
            }}
          />
          {r.label}
        </div>
      ))}
    </div>
  )
}
