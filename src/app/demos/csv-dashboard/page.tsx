import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { ScrollReveal } from '@/components/ScrollReveal'
import { DemoTerminalBlock } from '@/components/demos/DemoTerminalBlock'
import { CsvDashboard } from '@/components/demos/CsvDashboard'
import { TrackedStartProjectButton } from '@/components/TrackedStartProjectButton'

export const metadata = {
  title: 'CSV Dashboard Demo',
  description: 'Upload a CSV and get an instant dashboard with charts, filters, and stats.',
}

export default function CsvDashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[
            { label: 'demos', href: '/demos' },
            { label: 'csv-dashboard' },
          ]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]">CSV Dashboard.</h1>
          <p className="mt-3 text-lg text-[var(--ink)] max-w-2xl">
            Upload a spreadsheet and get an instant dashboard. <span className="text-[var(--heading)] font-semibold">Charts, filters, summary stats</span> — all in your browser.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Recharts', 'CSV parsing'].map(t => (
              <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-[var(--bg-card)] text-[var(--ink-soft)] border border-[var(--line-soft)]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Before */}
      <ScrollReveal>
        <section className="bg-[var(--bg)] py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <DemoTerminalBlock filename="~/the-problem.sh">
              <div className="text-[var(--ink-dim)]">// the problem</div>
              <div className="mt-2">
                <span className="text-[var(--accent)]">$</span>{' '}
                <span className="text-[var(--ink)]">open sales-data-Q1.xlsx</span>
              </div>
              <div className="text-[var(--ink-dim)] ml-3">→ 14 tabs. 6 people editing. 3 versions on the shared drive.</div>
              <div className="text-[var(--ink-dim)] ml-3">→ Your Monday starts with 45 minutes of copy-paste to get one number.</div>
            </DemoTerminalBlock>
          </div>
        </section>
      </ScrollReveal>

      {/* Interactive demo */}
      <ScrollReveal>
        <section className="bg-[var(--bg-soft)] py-12 border-t border-[var(--line)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="font-mono text-xs text-[var(--ink-dim)] mb-4">// the solution — try it</div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] overflow-hidden">
              <div className="bg-[var(--bg-soft)] border-b border-[var(--line)] px-4 py-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--traffic-r)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--traffic-y)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--traffic-g)]" />
                <span className="font-mono text-xs text-[var(--ink-dim)] ml-2">~/csv-dashboard.app</span>
              </div>
              <div className="p-5">
                <CsvDashboard />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* In production */}
      <ScrollReveal>
        <section className="bg-[var(--bg)] py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <DemoTerminalBlock filename="~/in-production.md">
              <div className="text-[var(--ink-dim)]">// in production, this connects to your database</div>
              <div className="mt-2 text-[var(--ink-dim)] space-y-1">
                <div>→ Live data from your POS, ERP, or spreadsheets — updated automatically.</div>
                <div>→ Role-based access so your team sees what they need.</div>
                <div>→ Scheduled email reports every Monday morning.</div>
                <div className="mt-3 text-[var(--accent)]/70">→ This demo runs entirely in your browser. Nothing is uploaded or stored.</div>
              </div>
            </DemoTerminalBlock>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="bg-[var(--bg)] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)]">Need something like this?</h2>
          <p className="mt-3 text-[var(--ink-soft)]">I build custom dashboards connected to your real data.</p>
          <div className="mt-6">
            <TrackedStartProjectButton source="csv_dashboard_cta" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
