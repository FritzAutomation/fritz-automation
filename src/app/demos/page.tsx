import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { ScrollReveal } from '@/components/ScrollReveal'
import Link from 'next/link'

export const metadata = {
  title: 'Demos',
  description: 'Small working apps that show what I build on the internal-tools side.',
}

const demos = [
  {
    href: '/demos/csv-dashboard',
    file: 'csv-dashboard.app',
    title: 'CSV Dashboard',
    tagline: 'Spreadsheet chaos → clean dashboard',
    description: 'Upload a CSV and get instant charts, filters, and summary stats. All in the browser.',
  },
  {
    href: '/demos/client-portal',
    file: 'client-portal.app',
    title: 'Client Portal',
    tagline: 'Email chaos → organized client portal',
    description: 'Two views of one tool: clients track their project status, you manage it from admin.',
  },
]

export default function DemosPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'demos' }]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]">Demos.</h1>
          <p className="mt-3 text-lg text-[var(--ink)] max-w-2xl">
            Small working apps that show what I build on the internal-tools side. Play with them — everything runs in your browser.
          </p>
        </div>
      </section>

      <ScrollReveal>
        <section className="bg-slate-950 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-5">
              {demos.map(demo => (
                <Link
                  key={demo.href}
                  href={demo.href}
                  className="group relative rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-colors p-6 block"
                >
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-3">
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded">{demo.file}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">{demo.title}</h2>
                  <p className="mt-1 text-sm text-emerald-400 font-mono">{demo.tagline}</p>
                  <p className="mt-3 text-slate-400 text-sm">{demo.description}</p>
                  <div className="mt-4 text-emerald-400 font-mono text-sm group-hover:text-emerald-300">open →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}
