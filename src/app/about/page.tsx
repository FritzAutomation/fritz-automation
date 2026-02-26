import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { businessInfo } from '@/lib/constants'
import Link from 'next/link'
import { AnimatedTimeline } from '@/components/animations/AnimatedTimeline'

export const metadata = {
  title: 'About Us',
  description: 'Learn about Fritz Automation - 20+ years of manufacturing experience turned into enterprise automation solutions.',
}

export default function AboutPage() {
  const milestones = [
    {
      year: '2000s',
      title: 'Manufacturing Roots',
      description: 'Started career in manufacturing, learning firsthand the challenges of manual processes and data management.'
    },
    {
      year: '2010',
      title: 'First Automation Projects',
      description: 'Began automating internal processes, reducing manual data entry from hours to minutes.'
    },
    {
      year: '2015',
      title: 'Enterprise Scale',
      description: 'Developed automation systems processing 100,000+ records daily for manufacturing operations.'
    },
    {
      year: '2020',
      title: 'Fritz Automation Founded',
      description: 'Launched Fritz Automation to help other businesses benefit from custom automation solutions.'
    },
    {
      year: 'Today',
      title: '10M+ Daily Records',
      description: 'Our solutions now process over 10 million records daily across multiple enterprise clients.'
    }
  ]

  const values = [
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: 'Reliability First',
      description: 'We build solutions that run 24/7 without supervision. Error handling, logging, and recovery are built into everything we create.'
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: 'Speed & Efficiency',
      description: 'Time is money. Our solutions are optimized for performance, processing millions of records in minutes, not hours.'
    },
    {
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      title: 'Partnership Approach',
      description: 'We\'re not just vendors—we\'re partners in your success. We take time to understand your business and provide ongoing support.'
    },
    {
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      title: 'Practical Innovation',
      description: 'We use proven technologies in innovative ways. No bleeding-edge experiments—just solid solutions that work.'
    }
  ]

  const stats = [
    { value: '20+', label: 'Years Experience' },
    { value: '10M+', label: 'Daily Records Processed' },
    { value: '14', label: 'Years Enterprise Scale' },
    { value: '99.9%', label: 'Uptime Reliability' }
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-semibold">
              About Us
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              <span className="block">Manufacturing Experience,</span>
              <span className="text-emerald-400">Automation Expertise</span>
            </h1>
            <p className="text-xl text-slate-300">
              Founded by {businessInfo.founder} in {businessInfo.location.city}, {businessInfo.location.state},
              Fritz Automation is built on 20+ years of manufacturing experience.
              We understand your operational challenges because we&apos;ve lived them.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-emerald-500 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-500 text-sm font-semibold">
                Our Story
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                From the Factory Floor to Your Business
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Fritz Automation was born from frustration. After spending over two decades in manufacturing,
                  we saw the same story play out again and again: talented people spending hours on repetitive
                  tasks that machines could do in seconds.
                </p>
                <p>
                  Data entry. Report generation. File management. System reconciliation. These tasks consumed
                  countless hours every week—hours that could be spent on work that actually moves the needle.
                </p>
                <p>
                  So we started building solutions. First for ourselves, then for colleagues, and eventually
                  for businesses across industries. What started as a few Python scripts has grown into
                  enterprise-grade automation systems processing millions of records daily.
                </p>
                <p className="font-medium text-slate-900">
                  Today, we help businesses of all sizes eliminate manual work, reduce errors, and scale
                  their operations without scaling their headcount.
                </p>
              </div>
            </div>

            <AnimatedTimeline milestones={milestones} />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-500 text-sm font-semibold">
              What We Stand For
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The principles that guide how we work and what we deliver.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={value.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Why Work With Us?</h3>
              <ul className="space-y-4">
                {[
                  'We speak your language—manufacturing, operations, business processes',
                  'Solutions built for reliability, not just demos',
                  'Direct access to developers, not account managers',
                  'Transparent pricing with no hidden costs',
                  'Ongoing support included, not upsold',
                  'Code ownership—you own everything we build'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                We&apos;re Not Your Typical Dev Shop
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Most software consultancies are filled with developers who&apos;ve never worked outside of tech.
                  They build impressive demos but struggle to understand real-world business constraints.
                </p>
                <p>
                  We&apos;re different. We&apos;ve managed inventory systems, reconciled financial data, and processed
                  production reports. We know what it&apos;s like to stay late because a manual process went wrong.
                </p>
                <p>
                  That experience shapes everything we build. Our solutions aren&apos;t just technically sound—they&apos;re
                  designed for the real world, with all its messiness, edge cases, and late-night emergencies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Let&apos;s Talk About Your Challenges
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation to discuss how automation can transform your operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Get in Touch
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
