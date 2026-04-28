import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { QuoteBuilder } from '@/components/demos/QuoteBuilder'
import Link from 'next/link'

export const metadata = {
  title: 'Quote Builder Demo',
  description: 'Build a clean, branded quote in your browser. Live document preview, computed totals, and a one-click send.',
}

const productionSteps = [
  { num: '01 / brand',     name: 'Looks like your business',         desc: 'Your logo, your colors, your fonts. Quotes feel like part of your studio, not a Gmail draft.' },
  { num: '02 / accept',    name: 'A clickable accept link',          desc: 'Clients accept and sign in their browser. Acceptance writes a timestamp + IP back to you for the record.' },
  { num: '03 / convert',   name: 'Quote → invoice in one click',     desc: 'Accepted quotes turn into Stripe invoices automatically. Deposit terms carry over. No double entry.' },
  { num: '04 / templates', name: 'Reuse what works',                 desc: 'Save common scopes as templates — discovery, build, retainer — and start the next quote in 30 seconds.' },
]

export default function QuotesPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'demos', href: '/demos' }, { label: 'quotes' }]} />
          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.1s both' }}
          >
            Quote Builder.
          </h1>
          <p
            className="mt-3 text-lg text-[var(--ink)] max-w-2xl"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.28s both' }}
          >
            <span className="text-[var(--heading)] font-semibold">Type on the left, document updates on the right.</span> Add line items, apply discounts and tax, send a clean PDF — without opening Word.
          </p>
          <div
            className="mt-[18px] flex flex-wrap gap-1.5"
            style={{ animation: 'v3-fade-in 0.5s ease 0.46s both' }}
          >
            {['react', 'typescript', 'forms', 'live preview', 'runs locally'].map(s => (
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
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">When the quote is a Word doc.</h2>
          <p className="mt-3 max-w-[60ch] text-[var(--ink-soft)] text-[16px] leading-relaxed">
            Every new project is a copy of last week&apos;s quote, with the math redone by hand and a logo that&apos;s slightly off-color.
          </p>

          <div className="mt-8">
            <WindowChrome label="~/the-problem.sh" />
            <div className="rounded-b-xl border border-[var(--line)] bg-[var(--bg-card)] px-[26px] py-[22px]">
              <div className="font-mono text-[13.5px]">
                <span className="text-[var(--accent)]">$</span> <span className="text-[var(--heading)]">duplicate quote-template-FINAL-v3.docx</span>
              </div>
              <Conseq>The subtotal in the body and the subtotal in the footer don&apos;t match. You don&apos;t notice until the client does.</Conseq>
              <Conseq>The PDF you send has last client&apos;s name in the header.</Conseq>
              <Conseq>You can&apos;t tell whether the client has actually opened it, let alone accepted.</Conseq>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Demo */}
      <ScrollReveal>
      <section className="bg-[var(--surface-overlay)] py-14 border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>// the solution — try it</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">A live document, no Word required.</h2>
          <p className="mt-3 max-w-[60ch] text-[var(--ink-soft)] text-[16px] leading-relaxed">
            Edit on the left, watch the quote rebuild on the right. Math always adds up, layout never breaks.
          </p>

          <div className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
            <WindowChrome label="~/quotes.app" live />
            <div className="p-5">
              <QuoteBuilder />
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
              <span className="ml-auto text-[var(--accent)]">avg setup: 2–4 weeks</span>
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
              <span className="text-[var(--heading)] font-medium">Nothing is uploaded, nothing is sent.</span>
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
          <p className="mt-3.5 text-[var(--ink-soft)]">I build branded quoting and proposal tools that ladder into your invoicing, CRM, and accept-online flow.</p>
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
