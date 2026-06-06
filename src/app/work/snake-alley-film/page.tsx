import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { ScrollReveal } from '@/components/ScrollReveal'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { DemoTerminalBlock } from '@/components/demos/DemoTerminalBlock'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Snake Alley Festival of Film — case study',
  description:
    'How I built the Snake Alley Festival of Film site: an editorial festival site with a live countdown, a multi-block schedule, festival passes, and a filmmaker submission flow.',
}

const SITE_URL = 'https://www.snakealleyfestivaloffilm.com'

const tech = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS']

const features = [
  { k: 'Live countdown', v: 'A ticking counter to opening night on every page — quiet urgency that nudges visitors toward tickets.' },
  { k: 'Multi-block schedule', v: 'Fourteen blocks across four days, grouped by night so a visitor can find the screening they want without wrestling a spreadsheet.' },
  { k: 'Passes & ticketing', v: 'Three clear ways in — a single $8 block, a day pass, or a full festival pass — so casual visitors and regulars both know exactly what to buy.' },
  { k: 'Filmmaker submissions', v: 'A clear path for filmmakers to submit their work (via FilmFreeway), so the festival fills its program from the same site that sells it.' },
  { k: 'Editorial design', v: 'Print-inspired serif typography and generous space, so the site feels as considered as the films it screens.' },
]

export default function SnakeAlleyCaseStudy() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16 md:py-20">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'work', href: '/work' }, { label: 'snake-alley-film' }]} />
          <div className="mt-4 flex items-center gap-3 flex-wrap text-[11.5px] font-mono">
            <span
              className="px-2.5 py-[3px] rounded-full text-[var(--accent)]"
              style={{ background: 'var(--accent-glow)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}
            >
              Arts &amp; culture
            </span>
            <span
              className="px-2.5 py-[3px] rounded-full text-[var(--ink-soft)] inline-flex items-center gap-1.5"
              style={{ border: '1px solid var(--line)' }}
            >
              <span className="v3-pulse-dot" style={{ width: 6, height: 6 }} />live
            </span>
          </div>
          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]"
            style={{ animation: 'v3-rise 0.6s cubic-bezier(0.2,0.8,0.2,1) 0.1s both' }}
          >
            Snake Alley Festival of Film
          </h1>
          <p
            className="mt-3 text-lg text-[var(--ink)] max-w-2xl"
            style={{ animation: 'v3-rise 0.6s cubic-bezier(0.2,0.8,0.2,1) 0.24s both' }}
          >
            An editorial home for a four-day short-film festival at the historic Capitol Theater in Burlington, Iowa — built to sell tickets, attract filmmakers, and make a dense program feel effortless.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={SITE_URL} target="_blank" rel="noopener noreferrer">
              <Button>Visit the live site →</Button>
            </Link>
            <Link href="/contact"><Button variant="outline">Start a project</Button></Link>
          </div>
        </div>
      </section>

      {/* Screenshot */}
      <section className="bg-[var(--bg)] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--bg-card)]">
            <Image
              src="/portfolio/snake-alley-film.png"
              alt="Snake Alley Festival of Film homepage"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        </div>
      </section>

      {/* The challenge */}
      <ScrollReveal>
      <section className="bg-[var(--bg)] pb-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-2.5 flex items-center gap-2">
            <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
            <span className="text-[var(--accent)]">// the challenge</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">One site, three jobs.</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[var(--ink-soft)]">
            A regional film festival&apos;s website has to do three things at once: sell tickets and passes to the public, convince filmmakers to submit their work, and present a packed four-day, fourteen-block program clearly enough that nobody gives up trying to read it. Do any one of those badly and the festival feels smaller than it is. The site also had to <span className="text-[var(--heading)] font-medium">feel crafted</span> — a festival celebrating filmmakers can&apos;t look like a generic event template.
          </p>
        </div>
      </section>
      </ScrollReveal>

      {/* The approach */}
      <ScrollReveal>
      <section className="bg-[var(--bg)] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-2.5 flex items-center gap-2">
            <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
            <span className="text-[var(--accent)]">// the approach</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">Editorial first, functional underneath.</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[var(--ink-soft)]">
            I leaned into a print-inspired, editorial look — big serif display type and room to breathe — then wired the working parts in behind it.
          </p>

          <dl className="mt-7 space-y-0 border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--bg-card)]">
            {features.map((f, i) => (
              <div key={f.k} className={`grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-5 px-5 sm:px-6 py-4 ${i > 0 ? 'border-t border-dashed border-[var(--line)]' : ''}`}>
                <dt className="font-mono text-[12.5px] text-[var(--accent)] pt-0.5">{f.k}</dt>
                <dd className="text-[15px] leading-[1.55] text-[var(--ink)]">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      </ScrollReveal>

      {/* In the program — real screens */}
      <ScrollReveal>
      <section className="bg-[var(--bg)] pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-5">
            <figure className="m-0">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--bg-card)]">
                <Image
                  src="/portfolio/snake-alley-schedule.png"
                  alt="The SNAFF schedule page — fourteen blocks across four days"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <figcaption className="mt-2.5 font-mono text-[12px] text-[var(--ink-dim)]">// the schedule — fourteen blocks, four days</figcaption>
            </figure>
            <figure className="m-0">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--bg-card)]">
                <Image
                  src="/portfolio/snake-alley-passes.png"
                  alt="The SNAFF passes page — single ticket, day pass, and festival pass tiers"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <figcaption className="mt-2.5 font-mono text-[12px] text-[var(--ink-dim)]">// passes — three ways in</figcaption>
            </figure>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Under the hood */}
      <ScrollReveal>
      <section className="bg-[var(--bg)] pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <DemoTerminalBlock filename="~/snake-alley-film/stack.txt">
            <div className="text-[var(--ink-dim)]">// built with</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tech.map(t => (
                <span key={t} className="px-2.5 py-[3px] rounded text-[12px] font-mono bg-[var(--surface)] text-[var(--ink)] border border-[var(--line-soft)]">{t}</span>
              ))}
            </div>
            <div className="mt-3 text-[var(--ink-dim)] space-y-1">
              <div>→ Fast, mobile-first, and SEO-ready — it loads quickly on a phone in a theater lobby.</div>
              <div>→ Content is structured so the schedule and passes stay easy to update year over year.</div>
            </div>
          </DemoTerminalBlock>
        </div>
      </section>
      </ScrollReveal>

      {/* The result */}
      <ScrollReveal>
      <section className="bg-[var(--surface-overlay)] py-12 border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-2.5 flex items-center gap-2">
            <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
            <span className="text-[var(--accent)]">// the result</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">Live for the 2026 festival.</h2>
          {/* NOTE for Josh: results below are intentionally qualitative — no invented metrics.
              Send me real numbers (ticket sales, submissions received, traffic) and I'll add a stats row here. */}
          <p className="mt-3 text-[16px] leading-relaxed text-[var(--ink-soft)]">
            The site shipped and is live at <Link href={SITE_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:text-[var(--accent-bright)] border-b border-dashed border-[var(--accent-glow)]">snakealleyfestivaloffilm.com</Link> for VOL. XIV — handling the program, passes, and filmmaker submissions in one place, with a look that matches the care that goes into the festival itself.
          </p>
        </div>
      </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
      <section className="bg-[var(--bg)] py-14 border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">Have something like this in mind?</h2>
          <p className="mt-3 text-[var(--ink-soft)]">Events, arts orgs, small businesses — if it needs a site that does real work, let&apos;s talk.</p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link href="/contact"><Button size="lg">Start a project</Button></Link>
            <Link href="/work"><Button size="lg" variant="outline">See more work</Button></Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}
