'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { track } from '@vercel/analytics'

const tabs = [
  { id: 'websites', file: 'websites.tsx', label: 'Websites & online stores' },
  { id: 'automation', file: 'automation.py', label: 'Internal tools & automation' },
] as const

type TabId = typeof tabs[number]['id']

export default function ServicesPage() {
  const [tab, setTab] = useState<TabId>('websites')

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'websites' || hash === 'automation') setTab(hash)
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'websites' || hash === 'automation') setTab(hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleTabClick = (id: TabId) => {
    setTab(id)
    if (typeof window !== 'undefined') history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'services' }]} />
          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.1s both' }}
          >
            Services.
          </h1>
          <p
            className="mt-3 text-lg text-[var(--ink)] max-w-2xl"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.28s both' }}
          >
            Two kinds of projects, same goal: software that gets out of your way so your business runs better.
          </p>
        </div>
      </section>

      <section className="bg-[var(--bg)] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex border-b border-[var(--line)] mb-10 overflow-x-auto" role="tablist">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => handleTabClick(t.id)}
                className={`px-4 py-2.5 font-mono text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  tab === t.id
                    ? 'border-[var(--accent)] bg-[var(--surface)]'
                    : 'border-transparent text-[var(--ink-dim)] hover:text-[var(--ink)]'
                }`}
              >
                <span className={tab === t.id ? 'font-sans font-semibold text-[14px] text-[var(--heading)]' : 'font-sans font-semibold text-[14px]'}>{t.label}</span>
                <span className={tab === t.id ? 'text-[12px] text-[var(--accent)]/70' : 'text-[12px] text-[var(--ink-dim)]'} style={{ color: tab === t.id ? 'color-mix(in srgb, var(--accent) 70%, transparent)' : undefined }}>// {t.file}</span>
              </button>
            ))}
          </div>

          {tab === 'websites' && <WebsitesPanel />}
          {tab === 'automation' && <AutomationPanel />}
        </div>
      </section>

      <Footer />
    </div>
  )
}

function BlockH({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] flex items-center gap-2 mt-8 mb-3">
      <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
      <span className="text-[var(--accent)]">{children}</span>
    </div>
  )
}

function PricingRail({ budget, timeline, note, ctaSource }: { budget: string; timeline: string; note: string; ctaSource: string }) {
  return (
    <div className="sticky top-[70px]">
      <div className="rounded-[10px] border border-[var(--line)] bg-[var(--bg-card)] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[var(--line)] bg-[var(--surface-strong)] flex items-center gap-2.5 font-mono text-[12px] text-[var(--ink-dim)]">
          <span className="flex gap-1.5">
            <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-r)]" />
            <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-y)]" />
            <span className="w-[11px] h-[11px] rounded-full bg-[var(--traffic-g)]" />
          </span>
          <span className="text-[var(--accent)]">~/pricing.toml</span>
        </div>
        <div>
          <PriceRow k="budget"            v={budget}        green />
          <PriceRow k="timeline"          v={timeline} />
          <PriceRow k="price model"       v="fixed" />
          <PriceRow k="discovery call"    v="free · 30 min" />
          <PriceRow k="first-month support" v="included" last />
        </div>
        <p className="px-[22px] pb-[18px] pt-0 text-[12.5px] leading-[1.5] text-[var(--ink-dim)]">{note}</p>
        <div className="px-[22px] pb-[16px]">
          <Link href="/contact" onClick={() => track('start_project_clicked', { source: ctaSource })}>
            <Button className="w-full justify-center">Start a project</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function PriceRow({ k, v, green, last }: { k: string; v: string; green?: boolean; last?: boolean }) {
  return (
    <div
      className={`px-[22px] py-[16px] grid items-baseline ${last ? '' : 'border-b border-dashed border-[var(--line)]'}`}
      style={{ gridTemplateColumns: '1fr auto', gap: 12 }}
    >
      <span className="font-mono text-[11.5px] text-[var(--ink-dim)] tracking-[0.06em] uppercase">{k}</span>
      <span className={green
        ? 'font-mono font-medium text-[15px] text-[var(--accent)]'
        : 'font-sans font-bold text-[16px] text-[var(--heading)]'}>{v}</span>
    </div>
  )
}

function WebsitesPanel() {
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-9 items-start">
      <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em] leading-tight">Websites people actually use.</h2>
        <p className="mt-3 text-[17px] text-[var(--ink-soft)] leading-relaxed max-w-[60ch]">
          Your customers can find you, trust you, and buy from you. I build fast, mobile-first sites with real design care — not a template someone slapped a logo on.
        </p>

        <BlockH>// what&apos;s included</BlockH>
        <ul className="space-y-1.5">
          {[
            'Designed and built from scratch, tailored to your brand',
            'Mobile-first, fully responsive on every screen',
            'SEO-ready structure and metadata',
            'Fast page loads — measured, not assumed',
            'A content management system you can actually edit',
            'Deployed on modern infrastructure (Vercel, fast CDN)',
            'You own the code and the domain — no lock-in',
          ].map(item => (
            <li key={item} className="pl-[26px] py-1.5 relative text-[15.5px] text-[var(--ink)] before:content-['✓'] before:absolute before:left-0 before:text-[var(--accent)] before:font-bold">
              {item}
            </li>
          ))}
        </ul>

        <BlockH>// typical projects</BlockH>
        <ul className="space-y-1.5">
          {[
            'Marketing site for a small business or professional service',
            'Portfolio or content-creator site with a blog',
            'Online store with cart, checkout, and product management',
            'Landing page + booking flow for a service business',
          ].map(item => (
            <li key={item} className="pl-[22px] py-1.5 relative text-[15.5px] text-[var(--ink-soft)] before:content-['▸'] before:absolute before:left-0 before:text-[var(--accent)]">
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/contact" onClick={() => track('start_project_clicked', { source: 'services_websites' })}>
            <Button>Start a project</Button>
          </Link>
          <Link href="/work">
            <Button variant="outline">See examples</Button>
          </Link>
        </div>
      </div>

      <aside>
        <PricingRail
          budget="$3,500 — $15,000"
          timeline="2 — 6 weeks"
          note="Smaller end covers focused marketing sites. Higher end covers full online stores and multi-section sites with custom design."
          ctaSource="services_websites_rail"
        />
      </aside>
    </div>
  )
}

function AutomationPanel() {
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-9 items-start">
      <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em] leading-tight">Tools that replace spreadsheet hell.</h2>
        <p className="mt-3 text-[17px] text-[var(--ink-soft)] leading-relaxed max-w-[60ch]">
          Your team stops wasting hours on manual work. I build the internal apps and scripts that fit how your business actually runs — not how some generic SaaS thinks you should run it.
        </p>

        <BlockH>// what&apos;s included</BlockH>
        <ul className="space-y-1.5">
          {[
            'Custom web apps for your team — dashboards, admin tools, client portals',
            'Integrations between systems that don\'t talk to each other',
            'Automation scripts that replace repetitive manual work',
            'Data pipelines that clean, move, or transform information reliably',
            'Role-based authentication and permissions',
            'Deployed somewhere you control, with clear documentation',
          ].map(item => (
            <li key={item} className="pl-[26px] py-1.5 relative text-[15.5px] text-[var(--ink)] before:content-['✓'] before:absolute before:left-0 before:text-[var(--accent)] before:font-bold">
              {item}
            </li>
          ))}
        </ul>

        <BlockH>// typical projects</BlockH>
        <ul className="space-y-1.5">
          {[
            'Internal dashboard pulling data from 3 different places into one screen',
            'Admin tool replacing a shared spreadsheet or legacy Access database',
            'Automated report that used to take a team member hours every week',
            'Client portal where customers upload files, track status, or pay invoices',
            'Script that moves data between tools on a schedule',
          ].map(item => (
            <li key={item} className="pl-[22px] py-1.5 relative text-[15.5px] text-[var(--ink-soft)] before:content-['▸'] before:absolute before:left-0 before:text-[var(--accent)]">
              {item}
            </li>
          ))}
        </ul>

        <div
          className="mt-8 px-[18px] py-[16px] rounded-lg border border-dashed border-[var(--line)] text-[14.5px] leading-[1.55] text-[var(--ink-soft)]"
          style={{ background: 'var(--surface-overlay)' }}
        >
          <div className="font-mono text-[11px] text-[var(--accent)] tracking-[0.06em] uppercase mb-1.5">// past work — under NDA</div>
          <p className="text-[var(--ink)]">Most of the internal tools I&apos;ve built have been for past employers, so I can&apos;t link them publicly.</p>
          <p className="mt-1.5">Happy to walk you through specifics on a call — what they did, how they were built, and what I&apos;d do for your situation.</p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/contact" onClick={() => track('start_project_clicked', { source: 'services_automation' })}>
            <Button>Start a project</Button>
          </Link>
          <Link href="/demos">
            <Button variant="outline">See demos</Button>
          </Link>
        </div>
      </div>

      <aside>
        <PricingRail
          budget="$6,000 — $40,000"
          timeline="4 — 12 weeks"
          note="Smaller end covers focused single-purpose tools. Higher end covers multi-user apps with integrations and custom workflows."
          ctaSource="services_automation_rail"
        />
      </aside>
    </div>
  )
}
