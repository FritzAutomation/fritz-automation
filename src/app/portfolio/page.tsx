import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'Portfolio',
  description: 'Browse websites and web applications built by Fritz Automation. Modern, fast, and designed to convert.',
}

const projects = [
  {
    id: 'fritz-automation',
    title: 'Fritz Automation',
    category: 'Business Website',
    description: 'Our own marketing site and client portal — built to showcase what we deliver. Server-rendered, animated, and scoring 95+ on Lighthouse across all categories.',
    url: 'https://fritzautomation.dev',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    highlights: [
      '95+ Lighthouse score',
      'Server-side rendering',
      'Animated service demos',
      'Client portal with auth',
      'ROI calculator tool',
      'SEO-optimized',
    ],
  },
  {
    id: 'iowan-foodie',
    title: 'Iowan Foodie',
    category: 'Content Creator',
    description: 'A food content creator portfolio and blog showcasing Iowa\'s culinary scene. Clean, image-forward design built for engagement and discoverability.',
    url: 'https://www.iowanfoodie.com',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    highlights: [
      'Image-forward layout',
      'Mobile-responsive design',
      'Fast page loads',
      'SEO-optimized content',
      'Social media integration',
      'Content-first architecture',
    ],
  },
  {
    id: 'two-makers-co',
    title: 'Two Makers Co',
    category: 'E-Commerce',
    description: 'An online store for handcrafted 3D-printed home decor and office products. Full shopping experience with cart, wishlist, and product filtering.',
    url: 'https://www.twomakers.co',
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

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-semibold">
            Our Work
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Website Portfolio
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Modern, high-performance websites built with the latest technologies.
            Every project is crafted for speed, accessibility, and conversions.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                {/* Card header */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6">
                  <span className="inline-block mb-3 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold">
                    {project.category}
                  </span>
                  <h2 className="text-xl font-bold text-white mb-2">{project.title}</h2>
                  <p className="text-sm text-slate-400">{project.description}</p>
                </div>

                {/* Card body */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Tech stack */}
                  <div className="mb-5">
                    <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6 flex-1">
                    <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">Highlights</h3>
                    <ul className="grid grid-cols-1 gap-1.5">
                      {project.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visit link */}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Visit Site
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your Website?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s create a fast, modern website that helps your business grow.
          </p>
          <Link href="/contact">
            <Button variant="secondary" size="lg">
              Get a Free Consultation
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
