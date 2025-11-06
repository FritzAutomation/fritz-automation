import Link from 'next/link';
import { Metadata } from 'next';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'Our Services - Fritz Automation | Process Automation & Custom Solutions',
  description: 'Fritz Automation specializes in process automation, system integration, and custom software development using Python, Django, FastAPI, React, and Next.js.',
  keywords: 'Process Automation, System Integration, Custom Software Development, Python Development, Django, FastAPI, React, Next.js, Business Automation',
};

export default function ServicesPage() {
  const services = [
    {
      icon: '⚙️',
      title: 'Process Automation',
      description: 'Streamline your business operations with intelligent automation solutions that save time and reduce errors.',
      features: [
        'Workflow automation',
        'Data processing pipelines',
        'Report generation',
        'Task scheduling & monitoring',
        'Email & notification automation',
        'File processing & management'
      ],
      technologies: ['Python', 'Celery', 'Apache Airflow', 'Pandas']
    },
    {
      icon: '🔗',
      title: 'System Integration',
      description: 'Connect your existing systems and tools to work together seamlessly, eliminating manual data transfer and reducing silos.',
      features: [
        'API development & integration',
        'Database synchronization',
        'Third-party service connections',
        'Legacy system modernization',
        'Real-time data sync',
        'Webhook automation'
      ],
      technologies: ['Django', 'FastAPI', 'REST APIs', 'GraphQL']
    },
    {
      icon: '💻',
      title: 'Custom Solutions',
      description: 'Tailored software applications built specifically for your business needs, from concept to deployment.',
      features: [
        'Web applications',
        'Internal tools & dashboards',
        'Customer portals',
        'Data visualization',
        'Admin panels',
        'Progressive web apps'
      ],
      technologies: ['React', 'Next.js', 'Django', 'PostgreSQL']
    }
  ];

  const techStack = [
    {
      category: 'Backend',
      icon: '🐍',
      technologies: ['Python', 'Django', 'FastAPI', 'Flask', 'Celery']
    },
    {
      category: 'Frontend',
      icon: '⚛️',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
    },
    {
      category: 'Database',
      icon: '🗄️',
      technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis']
    },
    {
      category: 'DevOps',
      icon: '🚀',
      technologies: ['Docker', 'AWS', 'Railway', 'Vercel', 'GitHub Actions']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                FA
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Fritz Automation
              </span>
            </Link>
            <Link
              href="/"
              className="px-6 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
            >
              ← Back to Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
              ⚡ What We Do
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Our Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fritz Automation delivers custom automation solutions that transform how your business operates.
              We build intelligent systems that save time, reduce errors, and scale with your growth.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 100} direction="up">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border-2 border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-6xl mb-6">{service.icon}</div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-gray-600">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Technologies:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
                🛠️ Tech Stack
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Technology We Use</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We leverage modern, proven technologies to build reliable and scalable solutions
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((stack, index) => (
              <ScrollReveal key={stack.category} delay={index * 100} direction="up">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <div className="text-4xl mb-3">{stack.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{stack.category}</h3>
                  <ul className="space-y-2">
                    {stack.technologies.map((tech) => (
                      <li key={tech} className="text-gray-600 text-sm">{tech}</li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary to-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Automate Your Business?
            </h2>
            <p className="text-xl text-primary-lighter mb-8">
              Let's discuss how Fritz Automation can help streamline your operations and build custom solutions for your unique needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Get a Free Consultation
              </Link>
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Our Work
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Fritz Automation. All rights reserved.</p>
            <p className="text-gray-500 text-sm mt-2">Custom automation solutions built with Python and modern web technologies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
