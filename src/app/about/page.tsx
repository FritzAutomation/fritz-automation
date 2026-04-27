import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { PhotoCard } from '@/components/v3/PhotoCard'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ScrollReveal'
import Link from 'next/link'

export const metadata = {
  title: 'About',
  description: 'About Joshua Fritzjunker and Fritz Automation — a small software studio in Burlington, Iowa.',
}

type Line =
  | { kind: 'blank' }
  | { kind: 'comment'; text: string }
  | { kind: 'prose'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'const-open'; name: string }
  | { kind: 'const-item'; text: string }
  | { kind: 'const-close' }

const lines: Line[] = [
  { kind: 'comment', text: '// about.md' },
  { kind: 'blank' },
  { kind: 'prose', text: "I'm Josh Fritzjunker. I build software in Burlington, Iowa." },
  { kind: 'blank' },
  { kind: 'heading', text: '// the 15-year arc' },
  { kind: 'prose', text: "I started writing code at 15 — self-taught on a hand-me-down laptop because I wanted to build something. That turned into a software development degree, and a decade-plus of shipping real tools inside real companies. Most of what I built lived behind the scenes: dashboards, integrations, automation scripts, and internal apps that replaced spreadsheet-and-email workflows someone's team had been running for years." },
  { kind: 'blank' },
  { kind: 'prose', text: 'Somewhere along the way I became the person coworkers came to when their spreadsheet turned into a monster. The "I can just build that" person. Fritz Automation is how I do that work independently now — for businesses that need it, on their terms, with their code in their hands when we\'re done.' },
  { kind: 'blank' },
  { kind: 'heading', text: '// how i work' },
  { kind: 'const-open', name: 'values' },
  { kind: 'const-item', text: "Honest scope and fixed prices. No surprise invoices." },
  { kind: 'const-item', text: "I write the code I'd want to inherit." },
  { kind: 'const-item', text: "You talk to me, not an account manager — the whole way through." },
  { kind: 'const-item', text: "You own everything I build." },
  { kind: 'const-close' },
  { kind: 'blank' },
  { kind: 'heading', text: '// why fritz automation exists' },
  { kind: 'prose', text: "Software consulting is full of shops that'll sell you what they want to sell, in the shape of a retainer. I wanted to run something smaller and more direct — where the person you hire is the person who does the work, where pricing is legible, and where the goal is shipping something you'd recommend to a friend." },
]

function LineRow({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="font-mono text-xs text-slate-600 select-none w-8 text-right pt-1 shrink-0">{n}</span>
      <div className="flex-1 leading-relaxed">{children}</div>
    </div>
  )
}

function renderLine(line: Line) {
  switch (line.kind) {
    case 'blank':
      return <span>&nbsp;</span>
    case 'comment':
      return <span className="font-mono text-emerald-400">{line.text}</span>
    case 'heading':
      return <span className="font-mono text-slate-500">{line.text}</span>
    case 'prose':
      return <span className="text-slate-300">{line.text}</span>
    case 'const-open':
      return (
        <span className="font-mono text-emerald-300">
          const {line.name} = [
        </span>
      )
    case 'const-item':
      return <span className="pl-6 text-slate-300 font-mono text-sm">&quot;{line.text}&quot;,</span>
    case 'const-close':
      return <span className="font-mono text-emerald-300">]</span>
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'about' }]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]">About.</h1>
          <p className="mt-3 text-lg text-[var(--ink)] max-w-2xl">A small software studio in Burlington, Iowa — run by one person who actually answers the phone.</p>
        </div>
      </section>

      <ScrollReveal>
      <section className="bg-slate-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-[280px_1fr] gap-8 items-start">
            <PhotoCard />
            <div className="text-slate-300 leading-relaxed">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Hi, I&apos;m Josh.</h2>
              <p className="mt-4 text-lg">I build software in Burlington, Iowa — and I run Fritz Automation as a one-person shop because I think the best client work happens when the person you hire is the person doing the work.</p>
              <p className="mt-4">I&apos;ve been writing code for <span className="text-white font-semibold">15 years</span> — self-taught since high school, a software development degree, and a decade-plus of shipping real tools inside real companies. Most of what I built lived behind the scenes: dashboards, integrations, automation scripts, and internal apps that replaced spreadsheet-and-email workflows someone&apos;s team had been running for years.</p>
              <p className="mt-4">Fritz Automation is how I do that work independently now — for businesses that need it, on their terms, with their code in their hands when we&apos;re done.</p>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="bg-slate-950 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              <span className="font-mono text-xs text-slate-500 ml-2">~/about.md</span>
            </div>
            <div className="p-6 space-y-1">
              {lines.map((line, i) => (
                <LineRow key={i} n={i + 1}>{renderLine(line)}</LineRow>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/contact"><Button size="lg">Start a project</Button></Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}
