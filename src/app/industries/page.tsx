import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface Industry {
  id: string
  title: string
  slug: string
  description: string | null
  icon: string | null
  display_order: number
  is_active: boolean
}

export const metadata = {
  title: 'Industries We Serve | Fritz Automation',
  description: 'Automation solutions for manufacturing, logistics, finance, healthcare, retail, and professional services industries.',
}

export default async function IndustriesPage() {
  const supabase = await createClient()

  let industries: Industry[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('industries')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    industries = data || []
  } catch {
    // Database might not exist yet
  }

  // Fallback industries with detailed content
  const defaultIndustries = [
    {
      id: '1',
      title: 'Manufacturing',
      slug: 'manufacturing',
      icon: 'factory',
      description: 'Streamline production workflows, inventory management, and quality control processes.',
      longDescription: 'Manufacturing operations generate massive amounts of data across production lines, inventory systems, and quality control checkpoints. We help manufacturers automate data collection, reporting, and analysis to reduce downtime and improve efficiency.',
      challenges: [
        'Manual data entry from production floor to ERP systems',
        'Disconnected systems between production, inventory, and shipping',
        'Time-consuming quality control documentation',
        'Delayed reporting affecting decision-making'
      ],
      solutions: [
        'Automated production data capture and ERP integration',
        'Real-time inventory tracking and reorder alerts',
        'Digital quality control checklists with automatic reporting',
        'Custom dashboards for production KPIs'
      ],
      display_order: 1,
      is_active: true
    },
    {
      id: '2',
      title: 'Logistics & Distribution',
      slug: 'logistics',
      icon: 'truck',
      description: 'Optimize shipping, tracking, and warehouse operations with intelligent automation.',
      longDescription: 'Logistics companies handle complex workflows involving multiple carriers, warehouses, and delivery schedules. Our automation solutions help streamline operations from order receipt to final delivery.',
      challenges: [
        'Manual shipment tracking across multiple carriers',
        'Paper-based warehouse processes',
        'Reconciling invoices with delivery confirmations',
        'Customer communication for delivery updates'
      ],
      solutions: [
        'Unified tracking dashboard pulling from all carrier APIs',
        'Barcode/RFID integration for warehouse management',
        'Automated invoice matching and exception reporting',
        'Automated customer notifications and tracking updates'
      ],
      display_order: 2,
      is_active: true
    },
    {
      id: '3',
      title: 'Finance & Accounting',
      slug: 'finance',
      icon: 'chart',
      description: 'Automate reconciliation, reporting, and compliance workflows.',
      longDescription: 'Financial operations require accuracy, auditability, and speed. We build automation solutions that reduce manual data entry, ensure compliance, and accelerate month-end close processes.',
      challenges: [
        'Manual bank reconciliation taking hours daily',
        'Spreadsheet-based reporting prone to errors',
        'Compliance documentation scattered across systems',
        'Delayed financial close due to manual processes'
      ],
      solutions: [
        'Automated bank reconciliation with exception flagging',
        'Consolidated reporting from multiple data sources',
        'Automated compliance documentation and audit trails',
        'Streamlined close processes with automated workflows'
      ],
      display_order: 3,
      is_active: true
    },
    {
      id: '4',
      title: 'Healthcare',
      slug: 'healthcare',
      icon: 'health',
      description: 'Improve patient data management and administrative efficiency.',
      longDescription: 'Healthcare organizations face unique challenges balancing patient care with administrative requirements. Our HIPAA-aware automation solutions help reduce paperwork and improve data accuracy.',
      challenges: [
        'Manual patient data entry across multiple systems',
        'Insurance verification and claims processing',
        'Appointment scheduling and reminder management',
        'Compliance reporting and documentation'
      ],
      solutions: [
        'Automated patient intake and data synchronization',
        'Insurance eligibility verification automation',
        'Intelligent appointment scheduling with automated reminders',
        'Automated compliance reporting and documentation'
      ],
      display_order: 4,
      is_active: true
    },
    {
      id: '5',
      title: 'Retail & E-Commerce',
      slug: 'retail',
      icon: 'cart',
      description: 'Scale operations with automated inventory, pricing, and order management.',
      longDescription: 'Retail operations require real-time visibility across inventory, pricing, and customer orders. We help retailers automate the workflows that keep operations running smoothly.',
      challenges: [
        'Inventory synchronization across multiple channels',
        'Competitor price monitoring and adjustments',
        'Order processing and fulfillment tracking',
        'Customer data management and segmentation'
      ],
      solutions: [
        'Multi-channel inventory sync and stock alerts',
        'Automated competitor price scraping and analysis',
        'Order workflow automation from purchase to delivery',
        'Customer data consolidation and automated segmentation'
      ],
      display_order: 5,
      is_active: true
    },
    {
      id: '6',
      title: 'Professional Services',
      slug: 'professional-services',
      icon: 'briefcase',
      description: 'Streamline client management, billing, and project tracking.',
      longDescription: 'Professional services firms need to maximize billable time while minimizing administrative overhead. Our solutions automate the back-office work that takes time away from clients.',
      challenges: [
        'Time tracking and billable hours management',
        'Client reporting and project status updates',
        'Invoice generation and payment tracking',
        'Document management and version control'
      ],
      solutions: [
        'Automated time tracking integration and reporting',
        'Scheduled client reports with real-time data',
        'Automated invoicing based on tracked time',
        'Document automation and organized file management'
      ],
      display_order: 6,
      is_active: true
    }
  ]

  const displayIndustries = industries.length > 0
    ? industries.map(ind => ({
        ...ind,
        longDescription: defaultIndustries.find(d => d.slug === ind.slug)?.longDescription || ind.description,
        challenges: defaultIndustries.find(d => d.slug === ind.slug)?.challenges || [],
        solutions: defaultIndustries.find(d => d.slug === ind.slug)?.solutions || []
      }))
    : defaultIndustries

  const iconMap: Record<string, string> = {
    factory: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    truck: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
    chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    health: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-semibold">
            Who We Serve
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Industries We Serve
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Deep expertise across sectors that rely on efficient processes.
            We understand your industry&apos;s unique challenges and build solutions that fit.
          </p>
        </div>
      </section>

      {/* Industries Grid - Overview */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayIndustries.map((industry) => (
              <a
                key={industry.id}
                href={`#${industry.slug}`}
                className="group bg-slate-50 hover:bg-red-50 rounded-xl p-4 text-center transition-all hover:shadow-lg border border-transparent hover:border-red-200"
              >
                <div className="w-12 h-12 bg-white group-hover:bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors shadow-sm">
                  <svg className="w-6 h-6 text-slate-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconMap[industry.icon || 'settings']} />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{industry.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Industry Sections */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {displayIndustries.map((industry, index) => (
              <div
                key={industry.id}
                id={industry.slug}
                className="scroll-mt-24"
              >
                <div className={`grid md:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? '' : ''}`}>
                  <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                    <div className="sticky top-24">
                      <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconMap[industry.icon || 'settings']} />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4">{industry.title}</h2>
                      <p className="text-lg text-slate-600 mb-6">{industry.longDescription}</p>

                      <Link href="/contact">
                        <Button>
                          Discuss Your {industry.title} Needs
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className={`space-y-6 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    {/* Challenges */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Common Challenges</h3>
                      </div>
                      <ul className="space-y-3">
                        {industry.challenges.map((challenge, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                            </span>
                            <span className="text-slate-600">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Solutions */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Our Solutions</h3>
                      </div>
                      <ul className="space-y-3">
                        {industry.solutions.map((solution, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-slate-600">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Don&apos;t See Your Industry?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Our automation principles apply across industries. If you have manual processes
            that need streamlining, we can help.
          </p>
          <Link href="/contact">
            <Button variant="secondary" size="lg">
              Let&apos;s Talk About Your Needs
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
