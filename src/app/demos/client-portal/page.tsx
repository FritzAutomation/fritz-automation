import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { ScrollReveal } from '@/components/ScrollReveal'
import { DemoTerminalBlock } from '@/components/demos/DemoTerminalBlock'
import { ClientPortal } from '@/components/demos/ClientPortal'
import { TrackedStartProjectButton } from '@/components/TrackedStartProjectButton'

export const metadata = {
  title: 'Client Portal Demo',
  description: 'A simple client portal with project tracking, timelines, and status updates.',
}

export default function ClientPortalPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[
            { label: 'demos', href: '/demos' },
            { label: 'client-portal' },
          ]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]">Client Portal.</h1>
          <p className="mt-3 text-lg text-[var(--ink)] max-w-2xl">
            Two views of one tool. <span className="text-[var(--heading)] font-semibold">Clients</span> see their project status; <span className="text-[var(--heading)] font-semibold">you</span> manage everything from the admin side.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'State management'].map(t => (
              <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ScrollReveal>
        <section className="bg-slate-950 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <DemoTerminalBlock filename="~/the-problem.sh">
              <div className="text-slate-500">// the problem</div>
              <div className="mt-2">
                <span className="text-emerald-400">$</span>{' '}
                <span className="text-slate-200">grep -r &quot;status update&quot; ~/inbox</span>
              </div>
              <div className="text-slate-500 ml-3">→ 47 emails. 12 phone calls. 3 sticky notes.</div>
              <div className="text-slate-500 ml-3">→ Your client asks &quot;where&apos;s my project?&quot; and you dig for 10 minutes.</div>
            </DemoTerminalBlock>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-slate-900 py-12 border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="font-mono text-xs text-slate-500 mb-4">// the solution — try both views</div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="font-mono text-xs text-slate-500 ml-2">~/client-portal.app</span>
              </div>
              <div className="p-5">
                <ClientPortal />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-slate-950 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <DemoTerminalBlock filename="~/in-production.md">
              <div className="text-slate-500">// in production, this connects to your database</div>
              <div className="mt-2 text-slate-500 space-y-1">
                <div>→ Real authentication — clients log in and see only their projects.</div>
                <div>→ Email notifications on status changes.</div>
                <div>→ File upload and storage.</div>
                <div className="mt-3 text-emerald-400/70">→ This demo uses sample data. Nothing is saved.</div>
              </div>
            </DemoTerminalBlock>
          </div>
        </section>
      </ScrollReveal>

      <section className="bg-slate-950 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Need a client portal?</h2>
          <p className="mt-3 text-slate-400">I build custom portals connected to your real workflow.</p>
          <div className="mt-6">
            <TrackedStartProjectButton source="client_portal_cta" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
