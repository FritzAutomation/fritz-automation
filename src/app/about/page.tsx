import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { ScrollReveal } from '@/components/ScrollReveal'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { PhotoCard } from '@/components/v3/PhotoCard'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'About',
  description: 'About Joshua Fritzjunker and Fritz Automation — a small software studio in Burlington, Iowa.',
}

const changelog = [
  { version: 'v0.1 · 2010', text: <>First lines of code at <span className="font-semibold text-[var(--heading)]">15 years old</span> — self-taught on a hand-me-down laptop because I wanted to build something. Nothing shipped, but I was hooked.</> },
  { version: 'v0.5 · 2015', text: <>Software development degree. Started shipping internal tools inside real companies — the unglamorous stuff that no SaaS quite fits.</> },
  { version: 'v1.0 · 2017', text: <>Became the person coworkers came to when their spreadsheet turned into a monster. The <span className="font-semibold text-[var(--heading)]">&ldquo;I can just build that&rdquo;</span> person.</> },
  { version: 'v1.8 · 2022', text: <>A decade-plus in. Started taking on outside clients on the side — small businesses who needed software that fit how they actually work.</> },
  { version: 'v2.0 · 2024', text: <><span className="font-semibold text-[var(--heading)]">Fritz Automation</span> launches as a real, registered, full-time studio. Same person, fewer middlemen, prices on the website.</> },
]

const values = [
  <><span className="font-semibold text-[var(--heading)]">Honest scope and fixed prices.</span> No surprise invoices, no scope creep with a wink.</>,
  <><span className="font-semibold text-[var(--heading)]">I write the code I&apos;d want to inherit.</span> Including documentation, including tests where they earn their keep.</>,
  <><span className="font-semibold text-[var(--heading)]">You talk to me, not an account manager.</span> Same person on the call, same person in the codebase, the whole way through.</>,
  <><span className="font-semibold text-[var(--heading)]">You own everything I build.</span> Code, deployment, domain, data — yours. No lock-in, no monthly hostage situation.</>,
]

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-2.5 flex items-center gap-2">
      <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
      <span className="text-[var(--accent)]">{children}</span>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'about' }]} />
          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.1s both' }}
          >
            About.
          </h1>
          <p
            className="mt-3 text-lg text-[var(--ink)] max-w-2xl"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.28s both' }}
          >
            A small software studio in Burlington, Iowa — run by one person who actually answers the phone.
          </p>
        </div>
      </section>

      <section className="bg-[var(--bg)] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-[300px_1fr] gap-9 items-start">
            <PhotoCard />
            <div className="text-[var(--ink)]">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em] leading-tight">Hi, I&apos;m Josh.</h2>
              <p className="mt-3.5 text-[18px] leading-[1.6]">I build software in Burlington, Iowa — and I run Fritz Automation as a one-person shop because I think the best client work happens when the person you hire is the person doing the work.</p>
              <p className="mt-3.5 text-[16px] leading-[1.65]">I&apos;ve been writing code for <span className="text-[var(--heading)] font-semibold">15 years</span> — self-taught since high school, a software development degree, and a decade-plus of shipping real tools inside real companies. Most of what I built lived behind the scenes: dashboards, integrations, automation scripts, and internal apps that replaced spreadsheet-and-email workflows someone&apos;s team had been running for years.</p>
              <p className="mt-3.5 text-[16px] leading-[1.65]">Somewhere along the way I became the person coworkers came to when their spreadsheet turned into a monster. The <span className="text-[var(--heading)] font-semibold">&ldquo;I can just build that&rdquo;</span> person. Fritz Automation is how I do that work independently now — for businesses that need it, on their terms, with their code in their hands when we&apos;re done.</p>
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal>
      <section className="bg-[var(--surface-overlay)] py-14 border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>// the 15-year arc</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">A short changelog.</h2>
          <div className="mt-4">
            {changelog.map((row, i) => (
              <div
                key={row.version}
                className={`grid grid-cols-[100px_1fr] gap-[18px] py-3.5 items-baseline ${i < changelog.length - 1 ? 'border-b border-dashed border-[var(--line)]' : ''}`}
              >
                <span className="font-mono text-[13px] font-medium text-[var(--accent)]">{row.version}</span>
                <p className="text-[16px] text-[var(--ink)] leading-[1.5]">{row.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="bg-[var(--bg)] py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>// how i work</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">Four things I won&apos;t compromise on.</h2>
          <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center gap-2.5 font-mono text-[12px] text-[var(--ink-dim)]">
              <span className="flex gap-1.5">
                <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-r)]" />
                <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-y)]" />
                <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-g)]" />
              </span>
              <span className="text-[var(--ink-soft)]">~/values.toml</span>
            </div>
            <div>
              {values.map((text, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[36px_1fr] gap-3.5 px-[22px] py-[14px] items-baseline ${i < values.length - 1 ? 'border-b border-dashed border-[var(--line)]' : ''}`}
                >
                  <span className="font-mono text-[13px] text-[var(--accent)]">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[16px] text-[var(--ink)] leading-[1.5]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="bg-[var(--surface-overlay)] py-14 border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>// why fritz automation exists</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">A note on why this is small on purpose.</h2>
          <p className="mt-3.5 text-[17px] text-[var(--ink)] leading-[1.65] max-w-[60ch]">
            Software consulting is full of shops that&apos;ll sell you what they want to sell, in the shape of a retainer. I wanted to run something smaller and more direct — where the person you hire is the person who does the work, where pricing is legible, and where the goal is shipping something you&apos;d recommend to a friend.
          </p>
          <p className="mt-3.5 text-[17px] text-[var(--ink)] leading-[1.65] max-w-[60ch]">
            Burlington isn&apos;t San Francisco. That&apos;s the whole point.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact"><Button>Start a project</Button></Link>
            <Link href="/work"><Button variant="outline">See what I&apos;ve shipped</Button></Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}
