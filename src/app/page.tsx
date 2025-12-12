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

  const iconMap: Record<string, string> = {
    cog: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    factory: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    truck: 'M8 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-3m-1 0v4m0-4H9m0 0v4m0-4h6m-6 0H8m1 0v4m0-4h6',
    settings: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  }

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

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {[
                { name: 'Python', color: 'bg-[#3776ab]' },
                { name: 'React', color: 'bg-[#61dafb]' },
                { name: 'Next.js', color: 'bg-slate-800' },
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
                  key={tech.name}
                  className="flex-shrink-0"
                >
                  <div className="flex items-center gap-3 px-5 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all hover:bg-slate-800 cursor-default">
                    <div className={`w-3 h-3 rounded-full ${tech.color}`} />
                    <span className="text-slate-300 font-medium whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
