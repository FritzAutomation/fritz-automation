'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
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
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]">Selected work.</h1>
          <p className="mt-3 text-lg text-[var(--ink)] max-w-2xl">
            A small sample of sites I&apos;ve built for clients. <span className="text-[var(--heading)] font-semibold">Each one shipped</span>, each one in production today.
          </p>
        </div>
      </section>

      <section className="bg-[var(--bg)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[220px_1fr] gap-0 rounded-xl border border-[var(--line)] overflow-hidden bg-[var(--bg-soft)]">
            <aside className="bg-[var(--bg)]/60 border-b md:border-b-0 md:border-r border-[var(--line)] p-3">
              <div className="font-mono text-xs text-[var(--ink-dim)] px-2 py-1 uppercase tracking-wide">Explorer</div>
              <div className="font-mono text-xs text-[var(--ink-soft)] px-2 py-1 mt-1 flex items-center gap-1">
                <span className="text-[var(--ink-dim)]">▾</span>
                work/
              </div>
              <ul className="mt-1 space-y-0.5 pl-3">
                {projects.map(p => (
                  <li key={p.id}>
                    <button
                      onClick={() => setActiveId(p.id)}
                      className={`w-full text-left font-mono text-sm px-2 py-1 rounded flex items-center gap-2 transition-colors ${
                        activeId === p.id
                          ? 'bg-[var(--accent-glow)] text-[var(--accent-bright)]'
                          : 'text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <span className="text-[var(--ink-dim)]">└─</span>
                      {p.file}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 text-xs font-mono text-[var(--ink-dim)] mb-4 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--accent)]">
                  {active.category}
                </span>
                <span>~/work/{active.file}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading)] mb-3">{active.title}</h2>
              <p className="text-[var(--ink)] leading-relaxed mb-6">{active.description}</p>

              <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[var(--line)] bg-[var(--bg)] mb-6">
                <Image
                  src={active.image}
                  alt={`${active.title} website screenshot`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="font-mono text-xs text-[var(--ink-dim)] uppercase tracking-wide mb-2">Stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {active.technologies.map(tech => (
                      <span key={tech} className="px-2 py-0.5 rounded text-xs font-mono bg-[var(--bg-card)] text-[var(--ink)] border border-[var(--line-soft)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs text-[var(--ink-dim)] uppercase tracking-wide mb-2">Highlights</div>
                  <ul className="text-sm text-[var(--ink)] space-y-1">
                    {active.highlights.map(h => <li key={h}>· {h}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--line)]">
                <Link
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm text-[var(--accent)] hover:text-[var(--accent-bright)]"
                >
                  $ open {active.url} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
