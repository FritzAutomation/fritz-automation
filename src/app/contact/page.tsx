import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { ScrollReveal } from '@/components/ScrollReveal'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project with Fritz Automation. I read every inquiry personally and reply within a day.',
}

const inquiries = [
  { when: '2h ago',     where: 'midwest',   text: 'website project · "small bakery storefront"',     status: 'responded' as const },
  { when: '5h ago',     where: 'west coast', text: 'automation · "sales pipeline integration"',       status: 'scoping' as const },
  { when: 'yesterday',  where: 'iowa',      text: 'online store · "3D-printed home decor expansion"', status: 'proposal' as const },
  { when: '3 days ago', where: 'northeast', text: 'internal tool · "invoice-tracking dashboard"',     status: 'responded' as const },
  { when: 'last week',  where: 'south',     text: 'website · "service-business landing"',             status: 'proposal' as const },
]

const statusBadge = {
  responded: { text: 'responded',     bg: 'var(--accent-glow)', color: 'var(--accent)', borderMix: 30 },
  scoping:   { text: 'scoping',       bg: 'rgba(251,191,36,0.10)', color: 'var(--amber)', borderMix: 30, isAmber: true },
  proposal:  { text: 'proposal sent', bg: 'var(--accent-glow)', color: 'var(--accent)', borderMix: 30 },
} as const

const nextSteps = [
  { text: <><span className="font-semibold text-[var(--heading)]">I read your message.</span> Usually within an hour during the workday, always within 24 hours.</> },
  { text: <><span className="font-semibold text-[var(--heading)]">A short reply</span> — either a question or two, or a suggested time for a free 30-minute call.</> },
  { text: <><span className="font-semibold text-[var(--heading)]">If we&apos;re a fit:</span> a written proposal in a few days. Scope, timeline, fixed price.</> },
  { text: <><span className="font-semibold text-[var(--heading)]">If we&apos;re not a fit:</span> I&apos;ll say so, and try to point you somewhere useful.</> },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'contact' }]} />
          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.1s both' }}
          >
            Tell me about your project.
          </h1>
          <p
            className="mt-3 text-lg text-[var(--ink)] max-w-2xl"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.28s both' }}
          >
            I read every inquiry myself. Usually reply within a day, often within an hour.
          </p>
        </div>
      </section>

      <section className="bg-[var(--bg)] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Guestbook */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center gap-2.5 font-mono text-[12px] text-[var(--ink-dim)]">
              <span className="text-[var(--ink-soft)]">// recent inquiries</span>
              <span className="ml-auto text-[var(--accent)] flex items-center gap-1.5">
                <span className="v3-pulse-dot" />live · last 5
              </span>
            </div>
            <div>
              {inquiries.map((q, i) => {
                const badge = statusBadge[q.status]
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-[84px_1fr_auto] gap-3.5 px-4 py-[11px] items-baseline ${i < inquiries.length - 1 ? 'border-b border-dashed border-[var(--line)]' : ''}`}
                  >
                    <span className="font-mono text-[12px] text-[var(--ink-dim)]">{q.when}</span>
                    <span className="text-[13.5px] text-[var(--ink)]">
                      <span className="font-semibold text-[var(--heading)]">{q.where}</span> · {q.text}
                    </span>
                    <span
                      className="font-mono text-[11px] px-2 py-0.5 rounded-full"
                      style={{
                        background: badge.bg,
                        color: badge.color,
                        border: q.status === 'scoping'
                          ? '1px solid rgba(251,191,36,0.3)'
                          : '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                      }}
                    >
                      {badge.text}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Form + sidebar */}
          <div className="grid lg:grid-cols-[1fr_360px] gap-9 items-start mt-9">
            <ContactForm />

            <aside className="space-y-[18px]">
              {/* What happens next */}
              <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden sticky top-[70px]">
                <div className="px-4 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center gap-2.5 font-mono text-[12px] text-[var(--ink-dim)]">
                  <span className="flex gap-1.5">
                    <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-r)]" />
                    <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-y)]" />
                    <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-g)]" />
                  </span>
                  <span className="text-[var(--ink-soft)]">// what happens next</span>
                </div>
                <div>
                  {nextSteps.map((step, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-[36px_1fr] gap-3.5 px-[22px] py-3 items-baseline ${i < nextSteps.length - 1 ? 'border-b border-dashed border-[var(--line)]' : ''}`}
                    >
                      <span className="font-mono text-[13px] text-[var(--accent)]">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-[14.5px] text-[var(--ink)] leading-[1.5]">{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who you're emailing */}
              <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center gap-2.5 font-mono text-[12px] text-[var(--ink-dim)]">
                  <span className="text-[var(--ink-soft)]">// who you&apos;re emailing</span>
                </div>
                <div className="px-[22px] py-4 font-mono text-[12px] text-[var(--ink-soft)] space-y-1">
                  <PersonaRow k="name"     v={<>josh fritzjunker</>} />
                  <PersonaRow k="role"     v={<>developer · sole proprietor</>} />
                  <PersonaRow k="located"  v={<><span className="text-[var(--accent)]">burlington, ia</span> · CST</>} />
                  <PersonaRow k="status"   v={<span className="text-[var(--accent)]">accepting projects</span>} />
                  <PersonaRow k="avg reply" v={<><span className="text-[var(--accent)]">&lt; 1 hr</span> on workdays</>} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ScrollReveal>
      <section className="bg-[var(--surface-overlay)] py-10 border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-2 flex items-center gap-2">
            <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
            <span className="text-[var(--accent)]">// other channels</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--heading)]">Or skip the form.</h2>
          <p className="mt-2 text-[15px] text-[var(--ink-soft)]">
            Email <a href="mailto:josh@fritzautomation.com" className="text-[var(--accent)] border-b border-dashed border-[var(--accent-glow)] hover:text-[var(--accent-bright)]">josh@fritzautomation.com</a>{' '}
            directly.
          </p>
        </div>
      </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}

function PersonaRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-2 py-1">
      <span className="text-[var(--ink-dim)]">{k}</span>
      <span className="text-[var(--ink)]">{v}</span>
    </div>
  )
}
