'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ScrollReveal, StaggerContainer } from '@/components/animations/ScrollReveal'

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

interface AnimatedServicesProps {
  services: Service[]
  iconMap: Record<string, string>
}

interface AnimatedIndustriesProps {
  industries: Industry[]
  iconMap: Record<string, string>
}

export function AnimatedStats() {
  const stats = [
    { value: '20+', label: 'Years in Manufacturing' },
    { value: '10M+', label: 'Daily Records Processed' },
    { value: '14', label: 'Years at Enterprise Scale' },
    { value: '24hr', label: 'Average Response Time' },
  ]

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8" staggerDelay={100}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

export function AnimatedServices({ services, iconMap }: AnimatedServicesProps) {
  return (
    <section id="services" className="py-20 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
            What We Do
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Our Services</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Custom automation solutions that transform how your business operates
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={150}>
          {services?.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconMap[service.icon || 'cog']} />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-slate-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {(service.features as string[])?.slice(0, 3).map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </StaggerContainer>

        <ScrollReveal className="text-center mt-12" delay={300}>
          <Link href="/services">
            <Button variant="outline">
              View All Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}

export function AnimatedTestimonials() {
  const testimonials = [
    {
      quote: "Fritz Automation reduced our monthly reporting time from 3 days to 15 minutes. The ROI was evident within the first month.",
      author: "Sarah Mitchell",
      role: "Operations Director",
      company: "Midwest Manufacturing Co.",
      metric: "95% time saved",
      avatar: "SM"
    },
    {
      quote: "Their system integration work connected our legacy ERP with modern tools seamlessly. We finally have real-time visibility across all departments.",
      author: "James Chen",
      role: "IT Manager",
      company: "Pacific Logistics Group",
      metric: "100% data sync",
      avatar: "JC"
    },
    {
      quote: "The custom dashboard they built processes over 50,000 transactions daily without breaking a sweat. Support has been exceptional.",
      author: "Maria Rodriguez",
      role: "Finance Director",
      company: "Summit Financial Services",
      metric: "50K+ daily transactions",
      avatar: "MR"
    }
  ]

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
            Client Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">What Our Clients Say</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Real results from businesses that transformed their operations with automation
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={150}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-slate-700 mb-6 flex-grow">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Metric Badge */}
              <div className="inline-flex self-start mb-6 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {testimonial.metric}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.author}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                  <div className="text-sm text-slate-400">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </StaggerContainer>

        {/* Case Study CTA */}
        <ScrollReveal className="mt-16 text-center" delay={200}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-100 rounded-2xl p-6 sm:p-8">
            <div className="flex -space-x-3">
              {['SM', 'JC', 'MR', 'DK'].map((initials, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-slate-900 font-semibold">Join 50+ businesses</p>
              <p className="text-slate-500 text-sm">that have automated their operations</p>
            </div>
            <Link href="/contact" className="sm:ml-4">
              <Button>
                Start Your Project
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export function AnimatedIndustries({ industries, iconMap }: AnimatedIndustriesProps) {
  return (
    <section id="industries" className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
            Who We Serve
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Industries We Serve</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Deep expertise across sectors that rely on efficient processes
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={100}>
          {industries?.map((industry) => (
            <div
              key={industry.id}
              className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconMap[industry.icon || 'settings']} />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-primary transition-colors">{industry.title}</h3>
              <p className="text-sm text-slate-600">{industry.description}</p>
            </div>
          ))}
        </StaggerContainer>

        <ScrollReveal className="mt-16" delay={300}>
          <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Not Sure If Automation Is Right for You?</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Let&apos;s discuss your challenges. We&apos;ll help you identify opportunities to save time and reduce errors - no obligation.
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Schedule a Free Consultation
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
