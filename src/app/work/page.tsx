'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const projects = [
  {
    id: 'iowan-foodie',
    file: 'iowan-foodie.tsx',
    title: 'Iowan Foodie',
    category: 'Content creator',
    description: 'A food content creator portfolio and blog showcasing Iowa\'s culinary scene. Clean, image-forward design built for engagement and discoverability.',
    url: 'https://www.iowanfoodie.com',
    image: '/portfolio/iowan-foodie.png',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    highlights: [
      'Image-forward layout',
      'Mobile-responsive design',
      'Fast page loads',
      'SEO-optimized content',
      'Social media integration',
    ],
  },
  {
    id: 'two-makers-co',
    file: 'two-makers-co.tsx',
    title: 'Two Makers Co',
    category: 'E-commerce',
    description: 'An online store for handcrafted 3D-printed home decor and office products. Full shopping experience with cart, wishlist, and product filtering.',
    url: 'https://www.twomakers.co',
    image: '/portfolio/two-makers-co.png',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    highlights: [
      'Full e-commerce checkout',
      'Product filtering by category',
      'Shopping cart & wishlist',
      'User authentication',
      'Supabase image storage',
      'Mobile-first design',
    ],
  },
]

export default function WorkPage() {
  const [activeId, setActiveId] = useState(projects[0].id)
  const active = projects.find(p => p.id === activeId) ?? projects[0]

  return (
    <div className="min-h-screen">
      <Header />

      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16 md:py-20">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'work' }]} />
          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.1s both' }}
          >
            Selected work.
          </h1>
          <p
            className="mt-3 text-lg text-[var(--ink)] max-w-2xl"
            style={{ animation: 'v3-rise 0.65s cubic-bezier(0.2,0.8,0.2,1) 0.28s both' }}
          >
            A small sample of sites I&apos;ve built for clients. <span className="text-[var(--heading)] font-semibold">Each one shipped</span>, each one in production today.
          </p>
        </div>
      </section>

      <section className="bg-[var(--bg)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[240px_1fr] gap-0 rounded-xl border border-[var(--line)] overflow-hidden bg-[var(--bg-card)]">
            <aside className="bg-[var(--surface-strong)] border-b md:border-b-0 md:border-r border-[var(--line)] py-3.5 min-h-[600px]">
              <div className="font-mono text-[10.5px] text-[var(--ink-dim)] px-[18px] pb-2 pt-1 tracking-[0.1em] uppercase">Explorer</div>
              <div className="font-mono text-[13px] text-[var(--ink)] px-[18px] py-1 flex gap-1.5 items-center">
                <span className="text-[var(--ink-dim)] text-[10px]">▾</span>
                work/
              </div>
              <ul className="mt-1 space-y-0.5">
                {projects.map(p => (
                  <li key={p.id}>
                    <button
                      onClick={() => setActiveId(p.id)}
                      className={`w-full text-left font-mono text-[13px] py-[5px] pl-[36px] pr-[18px] flex items-center gap-2 transition-colors ${
                        activeId === p.id
                          ? 'bg-[var(--accent-glow)] text-[var(--accent)]'
                          : 'text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <span className={activeId === p.id ? 'text-[var(--accent)] text-[11px]' : 'text-[var(--ink-dim)] text-[11px]'}>└─</span>
                      {p.file}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[var(--line)] mt-3.5 pt-3.5">
                <div className="font-mono text-[10.5px] text-[var(--ink-dim)] px-[18px] pb-2 tracking-[0.1em] uppercase">Filter</div>
                <div className="font-mono text-[12px] text-[var(--ink-dim)] px-[18px] py-1">type: all · year: 2024–2025</div>
              </div>
            </aside>

            <div className="px-6 py-6 md:px-8 md:py-8 min-w-0">
              <div className="flex items-center gap-3 flex-wrap text-[11.5px] font-mono">
                <span
                  className="px-2.5 py-[3px] rounded-full text-[var(--accent)]"
                  style={{
                    background: 'var(--accent-glow)',
                    border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                  }}
                >
                  {active.category}
                </span>
                <span className="text-[var(--ink-dim)]">~/work/{active.file}</span>
                <span
                  className="ml-auto px-2.5 py-[3px] rounded-full text-[var(--ink-soft)] inline-flex items-center gap-1.5"
                  style={{ border: '1px solid var(--line)' }}
                >
                  <span className="v3-pulse-dot" style={{ width: 6, height: 6 }} />live
                </span>
              </div>

              <h2 className="mt-3.5 text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em] leading-tight">{active.title}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-[var(--ink-soft)] max-w-[60ch]">{active.description}</p>

              <div className="mt-[22px] relative aspect-[16/10] rounded-lg overflow-hidden border border-[var(--line)] bg-[var(--bg)]">
                <Image
                  src={active.image}
                  alt={`${active.title} website screenshot`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>

              <div className="mt-7 grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.08em] uppercase mb-2.5">// stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {active.technologies.map(tech => (
                      <span key={tech} className="px-2.5 py-[3px] rounded text-[12px] font-mono bg-[var(--bg-card)] text-[var(--ink)] border border-[var(--line-soft)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.08em] uppercase mb-2.5">// highlights</div>
                  <ul className="space-y-1">
                    {active.highlights.map(h => (
                      <li key={h} className="pl-[22px] py-0.5 relative text-[14.5px] text-[var(--ink)] before:content-['✓'] before:absolute before:left-0 before:text-[var(--accent)] before:font-bold">{h}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-7 px-4 py-2.5 rounded-md font-mono text-[13px] border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-glow)] hover:text-[var(--accent-bright)] transition-colors"
              >
                $ open {active.url} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal>
      <section className="bg-[var(--surface-overlay)] py-12 border-t border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-2.5 flex items-center gap-2">
            <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
            <span className="text-[var(--accent)]">// what you don&apos;t see</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] tracking-[-0.02em]">More sitting behind firewalls.</h2>
          <p className="mt-3 max-w-[60ch] text-[15px] text-[var(--ink-soft)] leading-relaxed">
            Most of what I&apos;ve built — internal dashboards, admin tools, automation pipelines — was for past employers and lives behind their VPN. I can walk you through them on a call, screen-share what&apos;s appropriate, and tell you exactly what I&apos;d do for your situation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact"><Button>Book a call</Button></Link>
            <Link href="/services#automation"><Button variant="outline">See automation services</Button></Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}
