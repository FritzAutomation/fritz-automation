import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ServiceCard } from '@/components/services/ServiceCard'
import { iconPaths } from '@/lib/constants'
import { DataStream } from '@/components/animations/DataStream'
import { MouseGrid } from '@/components/animations/MouseGrid'
import Link from 'next/link'

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

export const metadata = {
  title: 'Services',
  description: 'Custom automation solutions including process automation, system integration, custom software development, data analytics, and website development.',
}

export default async function ServicesPage() {
  const supabase = await createClient()

  let services: Service[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    services = data || []
  } catch {
    // Database might not exist yet
  }

  // Fallback services if database is empty
  const defaultServices: Service[] = [
    {
      id: '1',
      title: 'Process Automation',
      slug: 'process-automation',
      description: 'Eliminate repetitive manual tasks with intelligent automation. We build custom scripts and workflows that handle data entry, file processing, report generation, and more.',
      icon: 'cog',
      features: [
        'Excel & spreadsheet automation',
        'Data entry and validation',
        'Automated report generation',
        'File processing and organization',
        'Scheduled task execution',
        'Error handling and logging'
      ],
      technologies: ['Python', 'VBA', 'Power Automate', 'Selenium'],
      display_order: 1,
      is_active: true
    },
    {
      id: '2',
      title: 'System Integration',
      slug: 'system-integration',
      description: 'Connect your disparate systems and eliminate data silos. We build bridges between your ERP, CRM, accounting software, and custom applications.',
      icon: 'link',
      features: [
        'API development and integration',
        'Database synchronization',
        'Real-time data pipelines',
        'Legacy system modernization',
        'Cloud service integration',
        'Webhook and event handling'
      ],
      technologies: ['REST APIs', 'GraphQL', 'SQL', 'AWS', 'Azure'],
      display_order: 2,
      is_active: true
    },
    {
      id: '3',
      title: 'Custom Software Development',
      slug: 'custom-software',
      description: 'When off-the-shelf solutions fall short, we build custom applications tailored to your exact business requirements and workflows.',
      icon: 'code',
      features: [
        'Web application development',
        'Internal business tools',
        'Customer portals',
        'Inventory management systems',
        'Workflow management apps',
        'Mobile-responsive design'
      ],
      technologies: ['React', 'Next.js', 'Python', 'Node.js', 'PostgreSQL'],
      display_order: 3,
      is_active: true
    },
    {
      id: '4',
      title: 'Data Analytics & Reporting',
      slug: 'data-analytics',
      description: 'Transform raw data into actionable insights. We build dashboards, automated reports, and analytics pipelines that help you make better decisions.',
      icon: 'chart',
      features: [
        'Custom dashboard development',
        'Automated reporting systems',
        'Data visualization',
        'KPI tracking and alerts',
        'Historical trend analysis',
        'Predictive analytics'
      ],
      technologies: ['Python', 'SQL', 'Power BI', 'Tableau', 'Pandas'],
      display_order: 4,
      is_active: true
    },
    {
      id: '5',
      title: 'Web Scraping & Data Collection',
      slug: 'web-scraping',
      description: 'Automatically gather data from websites, competitors, and online sources. We build reliable scrapers that handle pagination, authentication, and rate limiting.',
      icon: 'globe',
      features: [
        'Competitor price monitoring',
        'Market research automation',
        'Lead generation',
        'Content aggregation',
        'Inventory tracking',
        'News and social monitoring'
      ],
      technologies: ['Python', 'BeautifulSoup', 'Scrapy', 'Puppeteer'],
      display_order: 5,
      is_active: true
    },
    {
      id: '6',
      title: 'Email & Document Automation',
      slug: 'email-document-automation',
      description: 'Automate your communication workflows. From bulk email campaigns to document generation and PDF processing, we handle it all.',
      icon: 'mail',
      features: [
        'Automated email campaigns',
        'Document generation (PDF, Word, Excel)',
        'Invoice and quote automation',
        'Email parsing and routing',
        'Template-based document creation',
        'Digital signature integration'
      ],
      technologies: ['Python', 'SMTP', 'PDF libraries', 'DocuSign API'],
      display_order: 6,
      is_active: true
    },
    {
      id: '7',
      title: 'Website Development',
      slug: 'website-development',
      description: 'Professional websites that load fast, rank well, and convert visitors into customers. From marketing sites to full-stack web applications, we build it all.',
      icon: 'layout',
      features: [
        'Custom design & development',
        'Mobile-responsive layouts',
        'SEO & performance optimization',
        'CMS integration',
        'E-commerce solutions',
        'Hosting & domain setup'
      ],
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
      display_order: 7,
      is_active: true
    }
  ]

  const displayServices = services.length > 0 ? services : defaultServices

  // Use centralized icon paths
  const iconMap = iconPaths

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-semibold">
            What We Do
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Our Services
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Custom automation solutions designed to eliminate manual work, reduce errors,
            and help your business scale efficiently.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {displayServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                iconPath={iconMap[service.icon || 'cog']}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-500 text-sm font-semibold">
              How We Work
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Process</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A straightforward approach to understanding your needs and delivering solutions that work.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'We start by understanding your current processes, pain points, and goals through detailed conversations.'
              },
              {
                step: '02',
                title: 'Solution Design',
                description: 'We design a custom solution architecture that addresses your specific needs and integrates with existing systems.'
              },
              {
                step: '03',
                title: 'Development',
                description: 'Our team builds your solution with regular check-ins and demos to ensure we\'re on the right track.'
              },
              {
                step: '04',
                title: 'Deployment & Support',
                description: 'We deploy your solution, train your team, and provide ongoing support to ensure long-term success.'
              }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-emerald-500/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <MouseGrid />
        <DataStream />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Automate Your Business?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your challenges and explore how automation can save you time and money.
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
