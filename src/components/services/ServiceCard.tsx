'use client'

import { DataFlowAnimation } from '@/components/animations/DataFlowAnimation'
import { DashboardAnimation } from '@/components/animations/DashboardAnimation'
import { ExtractionAnimation } from '@/components/animations/ExtractionAnimation'

interface ServiceCardProps {
  service: {
    id: string
    title: string
    slug: string
    description: string | null
    icon: string | null
    features: string[]
    technologies: string[]
  }
  index: number
  iconPath: string
}

export function ServiceCard({ service, index, iconPath }: ServiceCardProps) {
  // Map service slugs to animation components
  const getAnimation = () => {
    switch (service.slug) {
      case 'process-automation':
        return <DataFlowAnimation variant="process" />
      case 'system-integration':
        return <DataFlowAnimation variant="integration" />
      case 'custom-software':
        return <DashboardAnimation variant="software" />
      case 'data-analytics':
        return <DashboardAnimation variant="analytics" />
      case 'web-scraping':
        return <ExtractionAnimation variant="scraping" />
      case 'email-document-automation':
        return <ExtractionAnimation variant="documents" />
      default:
        return null
    }
  }

  const animation = getAnimation()

  return (
    <div
      className={`grid md:grid-cols-2 gap-12 items-center ${
        index % 2 === 1 ? 'md:flex-row-reverse' : ''
      }`}
    >
      <div className={index % 2 === 1 ? 'md:order-2' : ''}>
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{service.title}</h2>
        <p className="text-lg text-slate-600 mb-6">{service.description}</p>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">What We Deliver</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-slate-600">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          {service.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
        {animation}
      </div>
    </div>
  )
}
