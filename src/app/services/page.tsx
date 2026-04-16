'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { MouseGrid } from '@/components/animations/MouseGrid'
import { DataStream } from '@/components/animations/DataStream'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ScrollReveal'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const tabs = [
  { id: 'websites', file: 'websites.tsx', label: 'Websites & online stores' },
  { id: 'automation', file: 'automation.py', label: 'Internal tools & automation' },
] as const

type TabId = typeof tabs[number]['id']

export default function ServicesPage() {
  const [tab, setTab] = useState<TabId>('websites')

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'websites' || hash === 'automation') {
      setTab(hash)
    }
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'websites' || hash === 'automation') {
        setTab(hash)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleTabClick = (id: TabId) => {
    setTab(id)
    if (typeof window !== 'undefined') {
      history.replaceState(null, '', `#${id}`)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'services' }]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">Services</h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            Two kinds of projects, same goal: software that gets out of your way so your business runs better.
          </p>
        </div>
      </section>

      <ScrollReveal>
      <section className="bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex border-b border-slate-800 mb-10 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => handleTabClick(t.id)}
                className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? 'border-emerald-400 text-emerald-300 bg-slate-900/60'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {t.file}
              </button>
            ))}
          </div>

          {tab === 'websites' && <WebsitesPanel />}
          {tab === 'automation' && <AutomationPanel />}
        </div>
      </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}

function WebsitesPanel() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Websites &amp; online stores</h2>
      <p className="mt-3 text-slate-300 leading-relaxed">
        Your customers can find you, trust you, and buy from you. I build fast, mobile-first sites with real design care — not a template someone slapped a logo on.
      </p>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">What&apos;s included</h3>
      <ul className="mt-3 space-y-1.5 text-slate-300">
        <li>· Design and build from scratch, tailored to your brand</li>
        <li>· Mobile-first and fully responsive</li>
        <li>· SEO-ready structure and metadata</li>
        <li>· Fast page loads — measured, not assumed</li>
        <li>· Content management you can actually edit</li>
        <li>· Deployed on modern infrastructure (Vercel, fast CDN)</li>
        <li>· You own the code and the domain — no lock-in</li>
      </ul>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">Typical projects</h3>
      <ul className="mt-3 space-y-1.5 text-slate-300">
        <li>· Marketing site for a small business or professional service</li>
        <li>· Portfolio or content-creator site with a blog</li>
        <li>· Online store with cart, checkout, and product management</li>
        <li>· Landing page + booking flow for a service business</li>
      </ul>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">Timeline &amp; pricing</h3>
      <p className="mt-3 text-slate-300">
        Most projects land between <span className="text-emerald-300 font-semibold">$3,500 and $15,000</span>, typically 2–6 weeks from kickoff to launch.
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Smaller end covers focused marketing sites; higher end covers full online stores or multi-section sites with custom design.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/contact"><Button>Start a project</Button></Link>
        <Link href="/work"><Button variant="outline">See examples</Button></Link>
      </div>
    </div>
  )
}

function AutomationPanel() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl md:text-3xl font-bold text-white">Internal tools &amp; automation</h2>
      <p className="mt-3 text-slate-300 leading-relaxed">
        Your team stops wasting hours on manual work. I build the internal apps and scripts that replace spreadsheet hell with something that actually fits how your business runs.
      </p>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">What&apos;s included</h3>
      <ul className="mt-3 space-y-1.5 text-slate-300">
        <li>· Custom web apps for your team (dashboards, admin tools, client portals)</li>
        <li>· Integrations between systems that don&apos;t talk to each other</li>
        <li>· Automation scripts that replace repetitive manual work</li>
        <li>· Data pipelines that clean, move, or transform information reliably</li>
        <li>· Role-based authentication and permissions</li>
        <li>· Deployed somewhere you control, with clear documentation</li>
      </ul>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">Typical projects</h3>
      <ul className="mt-3 space-y-1.5 text-slate-300">
        <li>· Internal dashboard that pulls data from 3 different places into one screen</li>
        <li>· Admin tool replacing a shared spreadsheet or legacy Access database</li>
        <li>· Automated report that used to take a team member hours every week</li>
        <li>· Client portal where customers upload files, track status, or pay invoices</li>
        <li>· Script that moves data between tools on a schedule</li>
      </ul>

      <h3 className="mt-8 font-mono text-xs text-slate-500 uppercase tracking-wide">Timeline &amp; pricing</h3>
      <p className="mt-3 text-slate-300">
        Most projects land between <span className="text-emerald-300 font-semibold">$6,000 and $40,000</span>, typically 4–12 weeks depending on scope.
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Smaller end covers focused single-purpose tools; higher end covers multi-user web apps with integrations and custom workflows.
      </p>

      <div className="mt-6 p-4 rounded-lg border border-slate-800 bg-slate-900/60 font-mono text-sm text-slate-400">
        <span className="text-emerald-400">$</span> <span className="text-slate-200">fritz --show-past-work</span><br />
        <span className="text-slate-500">→ Most of the internal tools I&apos;ve built have been for past employers, so I can&apos;t link them publicly. Happy to walk you through specifics on a call — what they did, how they were built, and what I&apos;d do for your situation.</span>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/contact"><Button>Start a project</Button></Link>
        <Link href="/demos"><Button variant="outline">See demos</Button></Link>
      </div>
    </div>
  )
}
