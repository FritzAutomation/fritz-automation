import { siteConfig, contactInfo, businessInfo } from '@/lib/constants'

// Organization schema for the business
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.svg`,
    description: siteConfig.description,
    email: contactInfo.email,
    sameAs: [contactInfo.github.url, contactInfo.linkedin.url],
    foundingDate: businessInfo.foundingDate,
    founder: {
      '@type': 'Person',
      name: businessInfo.founder,
      jobTitle: businessInfo.founderTitle,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: businessInfo.location.city,
      addressRegion: businessInfo.location.stateAbbr,
      addressCountry: businessInfo.location.country,
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '1-10',
    },
    areaServed: 'Worldwide',
    knowsAbout: [
      'Automation Consulting',
      'Software Development',
      'Manufacturing Systems Integration',
      'IT Consulting',
      'Process Automation',
      'Data Analytics',
      'Website Development',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Local Business schema with contact info
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    image: `${siteConfig.url}/favicon.svg`,
    description: siteConfig.description,
    email: contactInfo.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: businessInfo.location.city,
      addressRegion: businessInfo.location.stateAbbr,
      addressCountry: businessInfo.location.country,
    },
    priceRange: '$$',
    serviceType: [
      'Automation Consulting',
      'Software Development',
      'Manufacturing Systems Integration',
      'IT Consulting',
      'Process Automation',
      'System Integration',
      'Data Analytics',
      'Website Development',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// WebSite schema for search features
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Service schema for individual services
interface ServiceSchemaProps {
  name: string
  description: string
  url: string
}

export function ServiceSchema({ name, description, url }: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// FAQ schema for FAQ pages
interface FAQItem {
  question: string
  answer: string
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Breadcrumb schema
interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
