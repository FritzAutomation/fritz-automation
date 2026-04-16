import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { MouseGrid } from '@/components/animations/MouseGrid'
import { DataStream } from '@/components/animations/DataStream'
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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[
            { label: 'demos', href: '/demos' },
            { label: 'csv-dashboard' },
          ]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">CSV Dashboard</h1>
          <p className="mt-3 text-lg text-slate-300 max-w-2xl">
            Upload a spreadsheet and get an instant dashboard. Charts, filters, stats — all in the browser.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Recharts', 'CSV parsing'].map(t => (
              <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Before */}
      <ScrollReveal>
        <section className="bg-slate-950 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <DemoTerminalBlock filename="~/the-problem.sh">
              <div className="text-slate-500">// the problem</div>
              <div className="mt-2">
                <span className="text-emerald-400">$</span>{' '}
                <span className="text-slate-200">open sales-data-Q1.xlsx</span>
              </div>
              <div className="text-slate-500 ml-3">→ 14 tabs. 6 people editing. 3 versions on the shared drive.</div>
              <div className="text-slate-500 ml-3">→ Your Monday starts with 45 minutes of copy-paste to get one number.</div>
            </DemoTerminalBlock>
          </div>
        </section>
      </ScrollReveal>

      {/* Interactive demo */}
      <ScrollReveal>
        <section className="bg-slate-900 py-12 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="font-mono text-xs text-slate-500 mb-4">// the solution — try it</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="font-mono text-xs text-slate-500 ml-2">~/csv-dashboard.app</span>
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
        <section className="bg-slate-950 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <DemoTerminalBlock filename="~/in-production.md">
              <div className="text-slate-500">// in production, this connects to your database</div>
              <div className="mt-2 text-slate-500 space-y-1">
                <div>→ Live data from your POS, ERP, or spreadsheets — updated automatically.</div>
                <div>→ Role-based access so your team sees what they need.</div>
                <div>→ Scheduled email reports every Monday morning.</div>
                <div className="mt-3 text-emerald-400/70">→ This demo runs entirely in your browser. Nothing is uploaded or stored.</div>
              </div>
            </DemoTerminalBlock>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section className="bg-slate-950 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Need something like this?</h2>
          <p className="mt-3 text-slate-400">I build custom dashboards connected to your real data.</p>
          <div className="mt-6">
            <TrackedStartProjectButton source="csv_dashboard_cta" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
