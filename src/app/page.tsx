'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MouseGrid } from '@/components/animations/MouseGrid'
import { DataStream } from '@/components/animations/DataStream'
import { TypingHero } from '@/components/home/TypingHero'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ScrollReveal'
import Link from 'next/link'
import Image from 'next/image'
import { track } from '@vercel/analytics'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-mono">
            fritz-automation ~ idle
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            <TypingHero text="Hi, I'm Josh. I build custom software for small businesses." />
          </h1>
          <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Websites that sell. Internal tools that save hours. Built by one developer in Iowa.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" onClick={() => track('start_project_clicked', { source: 'homepage_hero' })}><Button size="lg">Start a project</Button></Link>
            <Link href="/work"><Button size="lg" variant="outline">See my work</Button></Link>
          </div>
        </div>
      </section>

      {/* What I build */}
      <ScrollReveal>
      <section className="bg-slate-950 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-xs text-slate-500 mb-2">// what i build</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Two kinds of projects</h2>
          <p className="mt-3 text-slate-400 max-w-2xl">
            Both aimed at the same thing: software that gets out of your way so your business runs better.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <Link
              href="/services#websites"
              className="group relative rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-colors p-6 block"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-3">
                <span className="px-1.5 py-0.5 bg-slate-800 rounded">websites.tsx</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Websites &amp; online stores</h3>
              <p className="mt-2 text-slate-300">Your customers can find you, trust you, and buy from you.</p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-400 font-mono">
                <li>· Marketing sites &amp; portfolios</li>
                <li>· Online stores &amp; custom carts</li>
                <li>· Fast, mobile-first, SEO-ready</li>
              </ul>
              <div className="mt-5 text-emerald-400 font-mono text-sm group-hover:text-emerald-300">open →</div>
            </Link>

            <Link
              href="/services#automation"
              className="group relative rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-colors p-6 block"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mb-3">
                <span className="px-1.5 py-0.5 bg-slate-800 rounded">automation.py</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Internal tools &amp; automation</h3>
              <p className="mt-2 text-slate-300">Your team stops wasting hours on manual work.</p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-400 font-mono">
                <li>· Internal dashboards &amp; admin tools</li>
                <li>· Process automation &amp; data pipelines</li>
                <li>· Scripts that replace spreadsheet workflows</li>
              </ul>
              <div className="mt-5 text-emerald-400 font-mono text-sm group-hover:text-emerald-300">open →</div>
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Selected work */}
      <ScrollReveal>
      <section className="bg-slate-900 py-20 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <div className="font-mono text-xs text-slate-500 mb-2">// selected work</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Shipped and in production</h2>
              <p className="mt-3 text-slate-400 max-w-2xl">Built for real people running real businesses — each one live today.</p>
            </div>
            <Link href="/work" className="font-mono text-sm text-emerald-400 hover:text-emerald-300">see all →</Link>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Link
              href="/work"
              className="group rounded-xl border border-slate-800 overflow-hidden bg-slate-950 hover:border-emerald-500/40 transition-colors"
            >
              <div className="relative aspect-[16/10] bg-slate-900">
                <Image
                  src="/portfolio/iowan-foodie.png"
                  alt="Iowan Foodie"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <div className="font-mono text-xs text-emerald-400">content-creator</div>
                <h3 className="text-lg font-semibold text-white mt-1">Iowan Foodie</h3>
                <p className="text-sm text-slate-400 mt-1">Food content portfolio and blog.</p>
              </div>
            </Link>

            <Link
              href="/work"
              className="group rounded-xl border border-slate-800 overflow-hidden bg-slate-950 hover:border-emerald-500/40 transition-colors"
            >
              <div className="relative aspect-[16/10] bg-slate-900">
                <Image
                  src="/portfolio/two-makers-co.png"
                  alt="Two Makers Co"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <div className="font-mono text-xs text-emerald-400">e-commerce</div>
                <h3 className="text-lg font-semibold text-white mt-1">Two Makers Co</h3>
                <p className="text-sm text-slate-400 mt-1">Custom online store for 3D-printed home decor.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Whoami */}
      <ScrollReveal>
      <section className="bg-slate-950 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-xs text-slate-500 mb-2">// whoami</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Hi, I&apos;m Josh</h2>
          <p className="mt-5 text-lg text-slate-300 leading-relaxed">
            I&apos;ve been writing code for 15 years — self-taught since high school, a software development degree, and a decade-plus of shipping real tools inside real companies. Fritz Automation is how I do that work independently now. I answer every email myself, and your project gets built by the same person you talked to on the call.
          </p>
          <div className="mt-6">
            <Link href="/about" className="font-mono text-sm text-emerald-400 hover:text-emerald-300">about me →</Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* How it works */}
      <ScrollReveal>
      <section className="bg-slate-900 py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-xs text-slate-500 mb-2">// how it works</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">What hiring me looks like</h2>

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              <span className="font-mono text-xs text-slate-500 ml-2">~/fritz-automation/process.sh</span>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed">
              <div><span className="text-emerald-400">$</span> <span className="text-slate-200">fritz chat</span></div>
              <div className="text-slate-500 ml-3">→ Free 30-minute call. We figure out if I&apos;m the right fit for your project.</div>

              <div className="mt-3"><span className="text-emerald-400">$</span> <span className="text-slate-200">fritz propose</span></div>
              <div className="text-slate-500 ml-3">→ Within a few days, a written proposal: scope, timeline, and a fixed price.</div>

              <div className="mt-3"><span className="text-emerald-400">$</span> <span className="text-slate-200">fritz build</span></div>
              <div className="text-slate-500 ml-3">→ I build. You see progress weekly and can request changes along the way.</div>

              <div className="mt-3"><span className="text-emerald-400">$</span> <span className="text-slate-200">fritz launch</span></div>
              <div className="text-slate-500 ml-3">→ Ship it. First month of support is on me; retainer after that if you want it.</div>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Final CTA */}
      <ScrollReveal>
      <section className="bg-slate-950 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Have a project in mind?</h2>
          <p className="mt-4 text-slate-400">
            Tell me about it. I reply to every inquiry personally, usually within a day.
          </p>
          <div className="mt-8">
            <Link href="/contact" onClick={() => track('start_project_clicked', { source: 'homepage_final_cta' })}><Button size="lg">Start a project</Button></Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}
