import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { BookingWidget } from '@/components/demos/BookingWidget'
import Link from 'next/link'

export const metadata = {
  title: 'Booking Widget Demo',
  description: 'A working booking widget — pick a service, pick a date, pick a time, take a deposit. The kind of tool I build for service businesses.',
}

const productionSteps = [
  { num: '01 / sync',     name: 'Connected to your real calendar',   desc: 'Reads availability from Google Calendar, Outlook, or Apple. Customers can only book slots when you\'re actually free.' },
  { num: '02 / collect',  name: 'Real deposits, real receipts',      desc: 'Stripe or Square in the back. Deposits are held against the appointment, applied to the final invoice, or refunded automatically on cancellation.' },
  { num: '03 / remind',   name: 'No-shows drop',                     desc: 'Reminder emails 24 hours out, SMS reminders 2 hours out. One-click reschedule link in every email so calls don\'t happen at midnight.' },
  { num: '04 / followup', name: 'After the appointment',             desc: 'Auto-trigger a thank-you email, a review request, or a follow-up booking link. Fits inside whatever workflow you already run.' },
]

export default function BookingPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'demos', href: '/demos' }, { label: 'booking' }]} />
          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.1s both' }}
          >
            Booking Widget.
          </h1>
          <p
            className="mt-3 text-lg text-[var(--ink)] max-w-2xl"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.28s both' }}
          >
            A self-serve booking flow that <span className="text-[var(--heading)] font-semibold">picks the slot, takes the deposit, and sends the confirmation</span> — without a single back-and-forth email.
          </p>
          <div
            className="mt-[18px] flex flex-wrap gap-1.5"
            style={{ animation: 'v3-fade-in 0.5s ease 0.46s both' }}
          >
            {['react', 'typescript', 'date math', 'forms', 'runs locally'].map(s => (
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
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">When the inbox is the calendar.</h2>
          <p className="mt-3 max-w-[60ch] text-[var(--ink-soft)] text-[16px] leading-relaxed">
            For most service businesses, booking starts as a polite back-and-forth and ends with a missed follow-up.
          </p>

          <div className="mt-8">
            <WindowChrome label="~/the-problem.sh" />
            <div className="rounded-b-xl border border-[var(--line)] bg-[var(--bg-card)] px-[26px] py-[22px]">
              <div className="font-mono text-[13.5px]">
                <span className="text-[var(--accent)]">$</span> <span className="text-[var(--heading)]">grep -c &quot;does Tuesday work?&quot; inbox</span>
              </div>
              <Conseq>14 emails to schedule one appointment.</Conseq>
              <Conseq>Two double-bookings a month, three no-shows, zero deposits collected.</Conseq>
              <Conseq>You&apos;re answering &quot;what time slots do you have?&quot; at 9pm on a Sunday.</Conseq>
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
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">A booking flow your customers actually finish.</h2>
          <p className="mt-3 max-w-[60ch] text-[var(--ink-soft)] text-[16px] leading-relaxed">
            Pick a service, pick a date, pick a time, leave a deposit. Four steps, no email tag.
          </p>

          <div className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
            <WindowChrome label="~/booking.app" live />
            <div className="p-5">
              <BookingWidget />
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
              <span className="ml-auto text-[var(--accent)]">avg setup: 3–5 weeks</span>
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
              <span className="text-[var(--heading)] font-medium">No card is charged, nothing is sent.</span>
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
          <p className="mt-3.5 text-[var(--ink-soft)]">I build booking and scheduling tools wired to your real calendar and payment processor.</p>
          <div className="mt-7 flex justify-center gap-3 flex-wrap">
            <Link href="/contact"><Button size="lg">Start a project</Button></Link>
            <Link href="/demos/csv-dashboard"><Button size="lg" variant="outline">Try the next demo →</Button></Link>
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
