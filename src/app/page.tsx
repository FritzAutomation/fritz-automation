'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { StatusAnchor } from '@/components/v3/StatusAnchor'
import { PhotoCard } from '@/components/v3/PhotoCard'
import Link from 'next/link'
import Image from 'next/image'
import { track } from '@vercel/analytics'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-2.5 flex items-center gap-2">
      <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
      <span className="text-[var(--accent)]">{children}</span>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* v3 Hero — split layout with live status anchor */}
      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)]">
        <GitGraphBackdrop height={600} />
        <div className="relative z-[2] max-w-[1200px] mx-auto px-6 sm:px-8 py-16 md:py-20 grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-14 items-start">
          <div>
            <div className="font-mono text-xs sm:text-sm text-[var(--ink-soft)] mb-5">
              <span className="text-[var(--accent)]">josh</span>
              <span className="text-[var(--ink-dim)]">@</span>
              <span className="text-[var(--blue)]">fritz-automation</span>
              <span className="text-[var(--ink-dim)]">:~$</span>{' '}
              <span className="text-[var(--ink)]">cat intro.md</span>
              <span className="inline-block w-2 h-3.5 bg-[var(--accent)] ml-1 align-[-2px]" style={{ animation: 'v3-blink 0.9s steps(2) infinite' }} />
            </div>
            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.028em] text-[var(--heading)] max-w-[14ch]">
              Custom software<br />for <span className="text-[var(--accent)]">small businesses.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[var(--ink)] max-w-[50ch] leading-relaxed">
              <span className="text-[var(--heading)] font-semibold">I&apos;m Josh.</span> I build websites that sell, and internal tools that save your team hours. Built by one developer, in <span className="text-[var(--accent)]">Burlington, Iowa</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" onClick={() => track('start_project_clicked', { source: 'homepage_hero' })}>
                <Button size="lg">Start a project</Button>
              </Link>
              <Link href="/work">
                <Button size="lg" variant="outline">See my work</Button>
              </Link>
            </div>
          </div>
          <StatusAnchor />
        </div>
      </section>

      {/* Below-hero meta strip */}
      <div className="border-b border-[var(--line)] bg-[var(--surface-overlay)]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-3.5 flex gap-x-7 gap-y-2 items-center flex-wrap font-mono text-[11.5px] text-[var(--ink-dim)]">
          <span className="text-[var(--accent)] border border-[var(--accent)]/25 px-2.5 py-0.5 rounded-full bg-[var(--accent-glow)] flex items-center gap-1.5">
            <span className="v3-pulse-dot" />online
          </span>
          <span>15 yrs writing code</span>
          <span>·</span>
          <span>burlington, iowa</span>
          <span>·</span>
          <span>cst <span suppressHydrationWarning>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span></span>
          <span className="ml-auto">v3.0.0 · <span className="text-[var(--accent)]">stable</span></span>
        </div>
      </div>

      {/* What I build */}
      <section className="bg-[var(--bg)] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>// what i build</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--heading)] tracking-[-0.02em]">Two kinds of projects.</h2>
          <p className="mt-3 text-[var(--ink-soft)] max-w-2xl">
            Both aimed at the same thing: software that gets out of your way so your business runs better.
          </p>

          <div className="mt-9 grid md:grid-cols-2 gap-4">
            <Link href="/services#websites" className="card-v2 group relative rounded-xl border border-[var(--line)] bg-[var(--bg-card)] hover:-translate-y-0.5 transition-all duration-200 p-7 block overflow-hidden">
              <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-1.5">
                → <span className="text-[var(--accent)]">websites.tsx</span>
              </div>
              <h3 className="font-sans font-bold text-[22px] text-[var(--heading)] tracking-[-0.012em]">Websites &amp; online stores</h3>
              <p className="mt-2.5 text-[15.5px] text-[var(--ink)] leading-snug">Your customers can find you, trust you, and buy from you.</p>
              <ul className="mt-4 space-y-1.5 text-sm text-[var(--ink-soft)]">
                <li className="pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-[var(--accent)] before:text-[11px]">Marketing sites &amp; portfolios</li>
                <li className="pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-[var(--accent)] before:text-[11px]">Online stores &amp; custom carts</li>
                <li className="pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-[var(--accent)] before:text-[11px]">Fast, mobile-first, SEO-ready</li>
              </ul>
              <div className="mt-5 pt-3.5 border-t border-dashed border-[var(--line)] flex items-baseline justify-between">
                <span className="font-mono text-[13px] text-[var(--accent)]">open →</span>
                <span className="font-mono text-[11.5px] text-[var(--ink-dim)]">
                  <span className="text-[var(--ink)]">$3.5k — $15k</span> · 2–6 wks
                </span>
              </div>
            </Link>

            <Link href="/services#automation" className="card-v2 group relative rounded-xl border border-[var(--line)] bg-[var(--bg-card)] hover:-translate-y-0.5 transition-all duration-200 p-7 block overflow-hidden">
              <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-1.5">
                → <span className="text-[var(--accent)]">automation.py</span>
              </div>
              <h3 className="font-sans font-bold text-[22px] text-[var(--heading)] tracking-[-0.012em]">Internal tools &amp; automation</h3>
              <p className="mt-2.5 text-[15.5px] text-[var(--ink)] leading-snug">Your team stops wasting hours on manual work.</p>
              <ul className="mt-4 space-y-1.5 text-sm text-[var(--ink-soft)]">
                <li className="pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-[var(--accent)] before:text-[11px]">Internal dashboards &amp; admin tools</li>
                <li className="pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-[var(--accent)] before:text-[11px]">Process automation &amp; data pipelines</li>
                <li className="pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-[var(--accent)] before:text-[11px]">Scripts that replace spreadsheet workflows</li>
              </ul>
              <div className="mt-5 pt-3.5 border-t border-dashed border-[var(--line)] flex items-baseline justify-between">
                <span className="font-mono text-[13px] text-[var(--accent)]">open →</span>
                <span className="font-mono text-[11.5px] text-[var(--ink-dim)]">
                  <span className="text-[var(--ink)]">$6k — $40k</span> · 4–12 wks
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="bg-[var(--surface-overlay)] py-20 border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <Eyebrow>// selected work</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--heading)] tracking-[-0.02em]">Shipped and in production.</h2>
              <p className="mt-3 text-[var(--ink-soft)] max-w-2xl">Built for real people running real businesses — each one live today.</p>
            </div>
            <Link href="/work" className="font-mono text-sm text-[var(--accent)] hover:text-[var(--accent-bright)] pb-1.5">see all →</Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/work" className="tile-v2 group rounded-xl border border-[var(--line)] overflow-hidden bg-[var(--bg-card)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
              <div className="relative aspect-[16/10] bg-gradient-to-br from-[var(--surface)] to-[var(--bg-card)] overflow-hidden">
                <span className="absolute top-3 left-3 z-[1] font-mono text-[10.5px] tracking-[0.05em] px-2 py-[3px] bg-[var(--accent-glow)] border border-[var(--accent)] text-[var(--accent)] rounded inline-flex items-center gap-1.5 backdrop-blur">
                  <span className="v3-pulse-dot" style={{ width: 5, height: 5 }} />live
                </span>
                <Image
                  src="/portfolio/iowan-foodie.png"
                  alt="Iowan Foodie"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-mono text-[10.5px] text-[var(--accent)] tracking-[0.06em] uppercase">content-creator</div>
                <h4 className="font-sans font-bold text-[19px] text-[var(--heading)] mt-1.5 tracking-[-0.01em]">Iowan Foodie</h4>
                <p className="text-sm text-[var(--ink-soft)] mt-1.5">Food content portfolio and blog.</p>
                <div className="mt-3.5 pt-3 border-t border-dashed border-[var(--line)] flex gap-3.5 font-mono text-[11px] text-[var(--ink-dim)]">
                  <span>next.js · tailwind</span><span>·</span><span>2024</span>
                </div>
              </div>
            </Link>

            <Link href="/work" className="tile-v2 group rounded-xl border border-[var(--line)] overflow-hidden bg-[var(--bg-card)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
              <div className="relative aspect-[16/10] bg-gradient-to-br from-[var(--surface)] to-[var(--bg-card)] overflow-hidden">
                <span className="absolute top-3 left-3 z-[1] font-mono text-[10.5px] tracking-[0.05em] px-2 py-[3px] bg-[var(--accent-glow)] border border-[var(--accent)] text-[var(--accent)] rounded inline-flex items-center gap-1.5 backdrop-blur">
                  <span className="v3-pulse-dot" style={{ width: 5, height: 5 }} />live
                </span>
                <Image
                  src="/portfolio/two-makers-co.png"
                  alt="Two Makers Co"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-mono text-[10.5px] text-[var(--accent)] tracking-[0.06em] uppercase">e-commerce</div>
                <h4 className="font-sans font-bold text-[19px] text-[var(--heading)] mt-1.5 tracking-[-0.01em]">Two Makers Co</h4>
                <p className="text-sm text-[var(--ink-soft)] mt-1.5">Custom online store for 3D-printed home decor.</p>
                <div className="mt-3.5 pt-3 border-t border-dashed border-[var(--line)] flex gap-3.5 font-mono text-[11px] text-[var(--ink-dim)]">
                  <span>next.js · supabase</span><span>·</span><span>2025</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Whoami */}
      <section className="bg-[var(--bg)] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>// whoami</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--heading)] tracking-[-0.02em]">Hi, I&apos;m Josh.</h2>
          <div className="mt-8 grid sm:grid-cols-[280px_1fr] gap-8 items-start">
            <PhotoCard />
            <p className="text-[17px] text-[var(--ink)] leading-[1.65]">
              I&apos;ve been writing code for <span className="text-[var(--heading)] font-semibold">15 years</span> — self-taught since high school, a software development degree, and a decade-plus of shipping real tools inside real companies. Fritz Automation is how I do that work independently now. <span className="text-[var(--heading)] font-semibold">I answer every email myself</span>, and your project gets built by the same person you talked to on the call.
            </p>
          </div>
          <div className="mt-7">
            <Link href="/about" className="font-mono text-sm text-[var(--accent)] hover:text-[var(--accent-bright)]">→ about me</Link>
          </div>
        </div>
      </section>

      {/* How it works — runbook */}
      <section className="bg-[var(--surface-overlay)] py-20 border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>// how it works</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--heading)] tracking-[-0.02em]">What hiring me looks like.</h2>

          <div className="mt-8">
            <div className="px-4 py-2.5 border border-[var(--line)] border-b-0 rounded-t-xl bg-[var(--surface-strong)] flex items-center gap-3 font-mono text-xs text-[var(--ink-dim)]">
              <span>►</span>
              <span className="text-[var(--ink-soft)]">~/fritz-automation/process.run</span>
              <span className="ml-auto text-[var(--accent)]">avg. runtime: 4–12 weeks</span>
            </div>
            <div className="border border-[var(--line)] rounded-b-xl bg-[var(--bg-card)] py-4">
              {[
                { num: '01 / chat',     name: 'A free 30-minute call', desc: 'We figure out if I’m the right fit for your project. No pressure, no sales pitch.', current: true },
                { num: '02 / propose',  name: 'A written proposal, in a few days', desc: 'Scope, timeline, and a fixed price. Nothing surprises you on the invoice.' },
                { num: '03 / build',    name: 'I build, you watch', desc: 'You see progress weekly and can request changes along the way. You talk to me, not an account manager.' },
                { num: '04 / launch',   name: 'Ship it, supported', desc: 'First month of post-launch support is on me. Optional retainer after that if you want it.' },
              ].map((s, i, arr) => (
                <div key={s.num} className="grid grid-cols-[88px_1fr] gap-4 sm:gap-5 px-7 py-3.5 items-start relative">
                  {/* connector pipe */}
                  {i < arr.length - 1 && (
                    <span className="absolute left-[116px] top-7 bottom-[-14px] w-px bg-gradient-to-b from-[var(--accent)]/50 to-[var(--accent)]/5" aria-hidden />
                  )}
                  <span className="font-mono text-[13px] text-[var(--accent)] flex items-baseline gap-2 pt-0.5">
                    <span className={`inline-grid place-items-center w-[18px] h-[18px] rounded-full border border-[var(--accent)] text-[10px] flex-shrink-0 ${s.current ? 'bg-[var(--accent)] text-[var(--btn-fg)]' : 'text-[var(--accent)]'}`}>
                      {s.current ? '✓' : '○'}
                    </span>
                    <span>{s.num}</span>
                  </span>
                  <div>
                    <div className={`font-sans font-semibold text-[var(--heading)] tracking-[-0.01em] ${s.current ? 'text-[19px]' : 'text-[17px]'}`}>{s.name}</div>
                    <div className={`mt-1 text-[15px] leading-[1.55] ${s.current ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'}`}>
                      {s.desc}
                      {s.current && <span className="text-[var(--accent)]"> ← you are here</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[var(--bg)] py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Eyebrow>// ready when you are</Eyebrow>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--heading)] tracking-[-0.022em]">Have a project in mind?</h2>
          <p className="mt-3.5 text-[var(--ink-soft)]">
            Tell me about it. I reply to every inquiry personally, usually within a day.
          </p>
          <div className="mt-7 flex justify-center gap-3 flex-wrap">
            <Link href="/contact" onClick={() => track('start_project_clicked', { source: 'homepage_final_cta' })}>
              <Button size="lg">Start a project</Button>
            </Link>
            <Link href="mailto:josh@fritzautomation.com">
              <Button size="lg" variant="outline">Or just email me</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .card-v2::before {
          content: '';
          position: absolute;
          top: 0; left: 0; height: 2px; width: 0;
          background: var(--accent);
          transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          z-index: 1;
        }
        .card-v2:hover {
          border-color: var(--accent);
        }
        .card-v2:hover::before {
          width: 100%;
        }
        .tile-v2:hover {
          border-color: var(--accent);
        }
      `}</style>
    </div>
  )
}
