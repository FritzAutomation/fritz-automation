import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { CsvDashboard } from '@/components/demos/CsvDashboard'
import Link from 'next/link'

export const metadata = {
  title: 'CSV Dashboard Demo',
  description: 'Upload a CSV and get an instant dashboard with charts, filters, and stats.',
}

const productionSteps = [
  { num: '01 / connect',  name: 'Live data, not uploads',          desc: 'Connects to your POS, ERP, Stripe, Shopify, or spreadsheet — updated automatically. No more nightly export emails.' },
  { num: '02 / authorize', name: 'Role-based access',              desc: 'Your sales lead sees pipeline, your finance lead sees revenue, your franchisees see only their stores. One tool, many viewpoints.' },
  { num: '03 / schedule', name: 'Reports that send themselves',    desc: '"Email me Monday-morning revenue for the last 7 days." Set it once, never think about it again.' },
  { num: '04 / alert',    name: 'Notifications when it matters',   desc: 'Inventory below threshold, churn spike, daily revenue drop — sent to Slack, email, or SMS.' },
]

export default function CsvDashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'demos', href: '/demos' }, { label: 'csv-dashboard' }]} />
          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.1s both' }}
          >
            CSV Dashboard.
          </h1>
          <p
            className="mt-3 text-lg text-[var(--ink)] max-w-2xl"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.28s both' }}
          >
            Upload a spreadsheet and get an instant dashboard. <span className="text-[var(--heading)] font-semibold">Charts, filters, summary stats</span> — all in your browser.
          </p>
          <div
            className="mt-[18px] flex flex-wrap gap-1.5"
            style={{ animation: 'v3-fade-in 0.5s ease 0.46s both' }}
          >
            {['react', 'typescript', 'recharts', 'csv parsing', 'runs locally'].map(s => (
              <span key={s} className="px-2.5 py-[3px] rounded-full font-mono text-[11.5px] text-[var(--ink-soft)] border border-[var(--line)] bg-[var(--surface)]">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <ScrollReveal>
      <section className="bg-[var(--bg)] py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>// the problem</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">When the spreadsheet won.</h2>
          <p className="mt-3 max-w-[60ch] text-[var(--ink-soft)] text-[16px] leading-relaxed">
            Most small businesses don&apos;t need a fancy BI tool. They need to stop digging through tabs.
          </p>

          <div className="mt-8">
            <WindowChrome label="~/the-problem.sh" />
            <div className="rounded-b-xl border border-[var(--line)] bg-[var(--bg-card)] px-[26px] py-[22px]">
              <div className="font-mono text-[13.5px]">
                <span className="text-[var(--accent)]">$</span> <span className="text-[var(--heading)]">open sales-data-Q1.xlsx</span>
              </div>
              <Conseq>14 tabs. 6 people editing. 3 versions on the shared drive.</Conseq>
              <Conseq>Your Monday starts with 45 minutes of copy-paste to get one number.</Conseq>
              <Conseq>By the time the email goes out, the data is already stale.</Conseq>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Demo */}
      <ScrollReveal>
      <section className="bg-[var(--surface-overlay)] py-14 border-t border-[var(--line)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>// the solution — try it</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">A live dashboard, no install.</h2>
          <p className="mt-3 max-w-[60ch] text-[var(--ink-soft)] text-[16px] leading-relaxed">
            Upload your own CSV (it stays in your browser, nothing is sent), or use the sample data to see it in action.
          </p>

          <div className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
            <WindowChrome label="~/csv-dashboard.app" live />
            <div className="p-5">
              <CsvDashboard />
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* In production */}
      <ScrollReveal>
      <section className="bg-[var(--bg)] py-14 border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>// in production</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">What this becomes when it&apos;s real.</h2>

          <div className="mt-8">
            <div className="px-4 py-2.5 border border-[var(--line)] border-b-0 rounded-t-xl bg-[var(--surface-strong)] flex items-center gap-3 font-mono text-xs text-[var(--ink-dim)]">
              <span>►</span>
              <span className="text-[var(--ink-soft)]">~/in-production.md</span>
              <span className="ml-auto text-[var(--accent)]">avg setup: 4–8 weeks</span>
            </div>
            <div className="border border-[var(--line)] rounded-b-xl bg-[var(--bg-card)] py-4">
              {productionSteps.map((s, i, arr) => (
                <div key={s.num} className="grid grid-cols-[88px_1fr] gap-4 sm:gap-5 px-7 py-3.5 items-start relative">
                  {i < arr.length - 1 && (
                    <span
                      className="absolute left-[116px] top-7 bottom-[-14px] w-px"
                      style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--accent) 50%, transparent), color-mix(in srgb, var(--accent) 5%, transparent))' }}
                      aria-hidden
                    />
                  )}
                  <span className="font-mono text-[13px] text-[var(--accent)] flex items-baseline gap-2 pt-0.5">
                    <span
                      className="inline-grid place-items-center w-[18px] h-[18px] rounded-full border border-[var(--accent)] text-[10px] flex-shrink-0 bg-[var(--accent)]"
                      style={{ color: 'var(--btn-fg)' }}
                    >✓</span>
                    <span>{s.num}</span>
                  </span>
                  <div>
                    <div className="font-sans font-semibold text-[var(--heading)] tracking-[-0.01em] text-[17px]">{s.name}</div>
                    <div className="mt-1 text-[15px] leading-[1.55] text-[var(--ink-soft)]">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-6 px-[18px] py-3.5 rounded-lg border border-dashed border-[var(--line)] font-mono text-[12px] text-[var(--ink-soft)] leading-[1.6]"
              style={{ background: 'var(--surface-overlay)' }}
            >
              <span className="text-[var(--accent)]">→</span> This demo runs entirely in your browser.{' '}
              <span className="text-[var(--heading)] font-medium">Nothing is uploaded or stored.</span>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal>
      <section className="bg-[var(--bg)] text-center" style={{ padding: '80px 24px 100px' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Eyebrow>// like what you see?</Eyebrow>
          </div>
          <h2 className="font-bold text-[var(--heading)] tracking-[-0.022em]" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
            Need something like this?
          </h2>
          <p className="mt-3.5 text-[var(--ink-soft)]">I build custom dashboards connected to your real data.</p>
          <div className="mt-7 flex justify-center gap-3 flex-wrap">
            <Link href="/contact"><Button size="lg">Start a project</Button></Link>
            <Link href="/demos/client-portal"><Button size="lg" variant="outline">Try the next demo →</Button></Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-2.5 flex items-center gap-2">
      <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
      <span className="text-[var(--accent)]">{children}</span>
    </div>
  )
}

function WindowChrome({ label, live }: { label: string; live?: boolean }) {
  return (
    <div className="px-4 py-2.5 border border-[var(--line)] border-b-0 rounded-t-xl bg-[var(--surface-strong)] flex items-center gap-2.5 font-mono text-xs text-[var(--ink-dim)]">
      <span className="flex gap-1.5">
        <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-r)]" />
        <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-y)]" />
        <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-g)]" />
      </span>
      <span className="text-[var(--ink-soft)]">{label}</span>
      {live && (
        <span className="ml-auto text-[var(--accent)] flex items-center gap-1.5">
          <span className="v3-pulse-dot" />live
        </span>
      )}
    </div>
  )
}

function Conseq({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[13px] text-[var(--ink-soft)] py-1.5 pl-[22px] relative leading-[1.55] before:content-['→'] before:absolute before:left-0 before:text-[var(--ink-dim)]">
      {children}
    </div>
  )
}
