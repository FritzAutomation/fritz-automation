import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { AnimatedCodeHero } from '@/components/AnimatedCodeHero'
import { FAQ } from '@/components/FAQ'
import {
  AnimatedStats,
  AnimatedServices,
  AnimatedTestimonials,
  AnimatedIndustries
} from '@/components/home/AnimatedSections'
import { createClient } from '@/lib/supabase/server'
import { iconPaths } from '@/lib/constants'

interface Service {
  id: string
  title: string
  slug: string
  description: string | null
  icon: string | null
  features: string[]
  technologies: string[]
  display_order: number
  is_active: boolean
}

interface Industry {
  id: string
  title: string
  slug: string
  description: string | null
  icon: string | null
  display_order: number
  is_active: boolean
}

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch services and industries from Supabase
  let services: Service[] = []
  let industries: Industry[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [servicesResult, industriesResult] = await Promise.all([
      (supabase as any).from('services').select('*').eq('is_active', true).order('display_order'),
      (supabase as any).from('industries').select('*').eq('is_active', true).order('display_order'),
    ])
    services = servicesResult.data || []
    industries = industriesResult.data || []
  } catch {
    // Database might not exist yet, use empty arrays
  }

  // Use centralized icon paths
  const iconMap = iconPaths

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-semibold">
                Enterprise Automation Solutions
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block text-slate-400 text-xl md:text-2xl font-normal mb-2">Stop Wasting Hours on</span>
                <span className="text-white">Manual Processes</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 text-slate-300 font-medium">
                We build automation systems that eliminate repetitive work and scale with your business
              </p>
              <p className="mb-8 text-slate-400 leading-relaxed">
                With 20+ years of manufacturing experience, we understand operational challenges firsthand.
                Our solutions process 10,000,000+ records daily for enterprise clients.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/services">
                  <Button size="lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Our Services
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="border-slate-600 text-white hover:bg-slate-800">
                    Get a Quote
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-slate-700">
                {['20+ Years Experience', 'Enterprise Scale', '10M+ Daily Records'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-slate-400">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Animated terminal */}
            <div className="lg:pl-8">
              <AnimatedCodeHero />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <AnimatedStats />

      {/* Tech Stack Section */}
      <section className="py-16 bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Technologies We Use
            </h2>
            <p className="text-slate-400">
              Modern tools for reliable, scalable automation
            </p>
          </div>
        </div>

        {/* Full-width marquee container with CSS mask for fade effect */}
        <div className="marquee-container">
          {/* Scrolling marquee - items duplicated for seamless loop */}
          <div className="flex animate-marquee">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-4 px-2">
                {[
                  { name: 'Python', color: 'bg-[#3776ab]' },
                  { name: 'React', color: 'bg-[#61dafb]' },
                  { name: 'Next.js', color: 'bg-slate-700' },
                  { name: 'TypeScript', color: 'bg-[#3178c6]' },
                  { name: 'PostgreSQL', color: 'bg-[#336791]' },
                  { name: 'Node.js', color: 'bg-[#339933]' },
                  { name: 'AWS', color: 'bg-[#ff9900]' },
                  { name: 'Supabase', color: 'bg-[#3ecf8e]' },
                  { name: 'REST APIs', color: 'bg-purple-600' },
                  { name: 'SQL', color: 'bg-orange-500' },
                  { name: 'Excel/VBA', color: 'bg-green-600' },
                  { name: 'Power BI', color: 'bg-yellow-500' },
                ].map((tech) => (
                  <div
                    key={`${setIndex}-${tech.name}`}
                    className="flex-shrink-0"
                  >
                    <div className="flex items-center gap-3 px-5 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-500 transition-all hover:bg-slate-700/50 cursor-default">
                      <div className={`w-3 h-3 rounded-full ${tech.color}`} />
                      <span className="text-slate-300 font-medium whitespace-nowrap">
                        {tech.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <AnimatedServices services={services} iconMap={iconMap} />

      {/* Testimonials Section */}
      <AnimatedTestimonials />

      {/* Industries Section */}
      <AnimatedIndustries industries={industries} iconMap={iconMap} />

      {/* FAQ Section */}
      <FAQ />

      <Footer />
    </div>
  )
}
