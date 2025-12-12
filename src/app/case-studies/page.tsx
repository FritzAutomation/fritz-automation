import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'Case Studies | Fritz Automation',
  description: 'See how Fritz Automation has helped businesses transform their operations with custom automation solutions.',
}

const caseStudies = [
  {
    id: 'manufacturing-reporting',
    title: 'Automated Production Reporting',
    client: 'Midwest Manufacturing Co.',
    industry: 'Manufacturing',
    challenge: 'Manual data entry from production floor to ERP system taking 3+ days per month, with frequent errors causing inventory discrepancies.',
    solution: 'Built an automated data pipeline that captures production data in real-time, validates entries, and syncs directly with their ERP system.',
    results: [
      { metric: '95%', label: 'Reduction in reporting time' },
      { metric: '99.9%', label: 'Data accuracy rate' },
      { metric: '$50K', label: 'Annual savings' },
      { metric: '3 days', label: 'to 15 minutes' },
    ],
    testimonial: {
      quote: "Fritz Automation reduced our monthly reporting time from 3 days to 15 minutes. The ROI was evident within the first month.",
      author: "Sarah Mitchell",
      role: "Operations Director"
    },
    technologies: ['Python', 'SQL Server', 'REST APIs', 'Power BI'],
    duration: '6 weeks',
    image: 'manufacturing'
  },
  {
    id: 'erp-integration',
    title: 'Legacy ERP System Integration',
    client: 'Pacific Logistics Group',
    industry: 'Logistics & Distribution',
    challenge: 'Disconnected systems between warehouse management, shipping, and accounting required manual data re-entry and caused delays in order fulfillment.',
    solution: 'Developed custom middleware that connects their legacy ERP with modern cloud tools, enabling real-time data synchronization across all departments.',
    results: [
      { metric: '100%', label: 'Real-time data sync' },
      { metric: '4hrs', label: 'Saved daily per team' },
      { metric: '60%', label: 'Faster order processing' },
      { metric: '0', label: 'Manual data entry errors' },
    ],
    testimonial: {
      quote: "Their system integration work connected our legacy ERP with modern tools seamlessly. We finally have real-time visibility across all departments.",
      author: "James Chen",
      role: "IT Manager"
    },
    technologies: ['Python', 'Node.js', 'PostgreSQL', 'AWS Lambda'],
    duration: '10 weeks',
    image: 'logistics'
  },
  {
    id: 'financial-dashboard',
    title: 'Real-Time Financial Dashboard',
    client: 'Summit Financial Services',
    industry: 'Finance',
    challenge: 'Finance team spent 2+ weeks each month manually compiling reports from multiple data sources, delaying critical business decisions.',
    solution: 'Created a custom dashboard that automatically aggregates data from 8 different sources, providing real-time financial insights and automated report generation.',
    results: [
      { metric: '50K+', label: 'Daily transactions processed' },
      { metric: '90%', label: 'Reduction in report time' },
      { metric: '8', label: 'Data sources unified' },
      { metric: '24/7', label: 'Real-time visibility' },
    ],
    testimonial: {
      quote: "The custom dashboard they built processes over 50,000 transactions daily without breaking a sweat. Support has been exceptional.",
      author: "Maria Rodriguez",
      role: "Finance Director"
    },
    technologies: ['React', 'Python', 'PostgreSQL', 'Redis'],
    duration: '8 weeks',
    image: 'finance'
  },
  {
    id: 'inventory-automation',
    title: 'Inventory Management Automation',
    client: 'Great Lakes Supply Co.',
    industry: 'Retail & Distribution',
    challenge: 'Manual inventory counts took a full week each month, with stockouts and overstock issues costing thousands in lost sales and storage fees.',
    solution: 'Implemented automated inventory tracking with barcode scanning integration, real-time stock alerts, and predictive reordering based on historical data.',
    results: [
      { metric: '75%', label: 'Reduction in stockouts' },
      { metric: '$120K', label: 'Annual inventory savings' },
      { metric: '1 week', label: 'to 2 hours for counts' },
      { metric: '40%', label: 'Less overstock' },
    ],
    testimonial: {
      quote: "We went from dreading monthly inventory to barely thinking about it. The system just works, and our stock levels are always optimized.",
      author: "David Kim",
      role: "Warehouse Manager"
    },
    technologies: ['Python', 'React', 'PostgreSQL', 'Barcode APIs'],
    duration: '12 weeks',
    image: 'inventory'
  }
]

const iconMap: Record<string, string> = {
  manufacturing: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  logistics: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  finance: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  inventory: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
}

export default function CaseStudiesPage() {
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
            Real Results
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Case Studies
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            See how we&apos;ve helped businesses eliminate manual work, reduce errors,
            and scale their operations with custom automation solutions.
          </p>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50+', label: 'Projects Completed' },
              { value: '$2M+', label: 'Client Savings' },
              { value: '10M+', label: 'Records Processed Daily' },
              { value: '99.9%', label: 'Uptime Reliability' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {caseStudies.map((study, index) => (
              <div
                key={study.id}
                id={study.id}
                className="scroll-mt-24"
              >
                <div className={`grid lg:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? '' : ''}`}>
                  {/* Content Side */}
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    {/* Industry Badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconMap[study.image]} />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-primary">{study.industry}</span>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{study.title}</h2>
                    <p className="text-lg text-slate-500 mb-6">{study.client}</p>

                    {/* Challenge & Solution */}
                    <div className="space-y-6 mb-8">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">The Challenge</h3>
                        <p className="text-slate-600">{study.challenge}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Our Solution</h3>
                        <p className="text-slate-600">{study.solution}</p>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {study.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Duration */}
                    <p className="text-sm text-slate-500">
                      <span className="font-medium">Project Duration:</span> {study.duration}
                    </p>
                  </div>

                  {/* Results Side */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    {/* Results Grid */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Results</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {study.results.map((result, i) => (
                          <div key={i} className="text-center p-4 bg-slate-50 rounded-xl">
                            <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{result.metric}</div>
                            <div className="text-sm text-slate-600">{result.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                      <svg className="w-8 h-8 text-red-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <blockquote className="text-lg mb-4">
                        &ldquo;{study.testimonial.quote}&rdquo;
                      </blockquote>
                      <div>
                        <div className="font-semibold">{study.testimonial.author}</div>
                        <div className="text-sm text-slate-400">{study.testimonial.role}, {study.client}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {index < caseStudies.length - 1 && (
                  <div className="border-b border-slate-200 mt-24" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Be Our Next Success Story?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how automation can transform your operations and deliver measurable results.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Start Your Project
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                View Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
