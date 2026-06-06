import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { ScrollReveal } from '@/components/ScrollReveal'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'

export const metadata: Metadata = {
  title: 'Build log',
  description: 'A running log of what I ship on Fritz Automation — features, fixes, and shipped client work, newest first.',
}

type Tag = 'ship' | 'feat' | 'fix'

const TAG_STYLE: Record<Tag, string> = {
  ship: 'text-[var(--accent)] border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[var(--accent-glow)]',
  feat: 'text-[var(--blue)] border-[color:color-mix(in_srgb,var(--blue)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--blue)_12%,transparent)]',
  fix: 'text-[var(--ink-soft)] border-[var(--line)] bg-[var(--surface)]',
}

// Curated from the real commit history — newest first.
const entries: { date: string; tag: Tag; title: string; detail: string }[] = [
  {
    date: '2026-06-06',
    tag: 'ship',
    title: 'Theme cohesion across the whole site',
    detail: 'The interactive demos and global chrome (charts, scroll bar, buttons) now follow the dark / dim / paper theme, so the site reads as one running program end to end.',
  },
  {
    date: '2026-06-05',
    tag: 'ship',
    title: 'Lowered the barrier to entry',
    detail: 'Websites now run $1k–$30k and automation starts at $2.5k — a small, focused first project is an easy yes.',
  },
  {
    date: '2026-06-05',
    tag: 'fix',
    title: 'Faster hero, zero hydration warnings',
    detail: 'Tightened the homepage entrance so the calls-to-action land sooner, and removed a hydration mismatch that touched every page.',
  },
  {
    date: '2026-06-05',
    tag: 'ship',
    title: 'New portfolio piece — Snake Alley Festival of Film',
    detail: 'Added the SNAFF festival site to selected work, with a full case study of how it came together.',
  },
  {
    date: '2026-04-27',
    tag: 'ship',
    title: 'Four interactive demos',
    detail: 'A photo proof gallery, an order-queue kanban, a quote builder, and a booking widget — small working tools you can poke at right in the browser.',
  },
  {
    date: '2026-04-27',
    tag: 'feat',
    title: 'Little touches',
    detail: 'A returning-visitor welcome, a /shell terminal you can browse the whole site from, and a paper reading theme.',
  },
  {
    date: '2026-04-26',
    tag: 'feat',
    title: 'v3 redesign',
    detail: 'Rebuilt the site around a terminal / IDE aesthetic — live status, theme tokens, and just-enough motion.',
  },
  {
    date: '2026-04-16',
    tag: 'feat',
    title: 'Client portal: project-scoped tickets',
    detail: 'Clients can open and track support requests tied to their own projects.',
  },
  {
    date: '2026-04-16',
    tag: 'fix',
    title: 'Spam-proofed the contact form',
    detail: 'Added a honeypot field to quietly block drive-by bots.',
  },
]

export default function LogPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16 md:py-20">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'log' }]} />
          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]"
            style={{ animation: 'v3-rise 0.6s cubic-bezier(0.2,0.8,0.2,1) 0.1s both' }}
          >
            Build log.
          </h1>
          <p
            className="mt-3 text-lg text-[var(--ink)] max-w-2xl"
            style={{ animation: 'v3-rise 0.6s cubic-bezier(0.2,0.8,0.2,1) 0.24s both' }}
          >
            What I&apos;m shipping on this site and for clients — newest first. <span className="text-[var(--heading)] font-semibold">This site is never &ldquo;done&rdquo;</span>; it&apos;s a program I keep running.
          </p>
        </div>
      </section>

      <ScrollReveal>
      <section className="bg-[var(--bg)] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="px-4 py-2.5 border border-[var(--line)] border-b-0 rounded-t-xl bg-[var(--surface-strong)] flex items-center gap-3 font-mono text-xs text-[var(--ink-dim)]">
            <span className="text-[var(--accent)]">$</span>
            <span className="text-[var(--ink-soft)]">git log --oneline --all</span>
            <span className="ml-auto">{entries.length} entries</span>
          </div>

          <ol className="border border-[var(--line)] rounded-b-xl bg-[var(--bg-card)] divide-y divide-dashed divide-[var(--line)]">
            {entries.map((e, i) => (
              <li key={`${e.date}-${i}`} className="grid grid-cols-[88px_1fr] gap-3 sm:gap-5 px-5 sm:px-7 py-4 items-start">
                <div className="flex flex-col gap-2 pt-0.5">
                  <time className="font-mono text-[11.5px] text-[var(--ink-dim)] tabular-nums">{e.date}</time>
                  <span className={`inline-block w-fit px-2 py-[2px] rounded-full font-mono text-[10.5px] tracking-[0.04em] border ${TAG_STYLE[e.tag]}`}>
                    {e.tag}
                  </span>
                </div>
                <div>
                  <h2 className="font-sans font-semibold text-[16.5px] text-[var(--heading)] tracking-[-0.01em] leading-snug">{e.title}</h2>
                  <p className="mt-1 text-[14.5px] leading-[1.55] text-[var(--ink-soft)]">{e.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-5 font-mono text-[12px] text-[var(--ink-dim)]">
            <span className="text-[var(--accent)]">$</span> # more in the commit history — this is the human-readable cut.
          </p>
        </div>
      </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}
