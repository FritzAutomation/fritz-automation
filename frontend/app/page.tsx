import { getSkills, getFeaturedProjects, getWorkExperience, getSiteSettings } from '@/lib/api';
import Link from 'next/link';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollReveal from '@/components/ScrollReveal';
import OptimizedImage from '@/components/OptimizedImage';
import AnimatedCodeHero from '@/components/AnimatedCodeHero';
import type { Skill, Project, WorkExperience, SiteSettings } from '@/types';

export const metadata = {
  title: 'Fritz Automation | Custom Automation Solutions & Software Development',
  description: 'Fritz Automation specializes in process automation, system integration, and custom software development using Python, Django, FastAPI, React, and Next.js. Transform your business with intelligent automation solutions.',
  keywords: 'Fritz Automation, Process Automation, System Integration, Custom Software Development, Python Development, Django, FastAPI, React, Next.js, Business Automation, Workflow Automation, API Integration',
  authors: [{ name: 'Fritz Automation' }],
  openGraph: {
    title: 'Fritz Automation | Custom Automation Solutions & Software Development',
    description: 'Specializing in process automation, system integration, and custom software solutions built with Python and modern web technologies.',
    url: 'https://www.fritzautomation.dev',
    siteName: 'Fritz Automation',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fritz Automation | Custom Automation Solutions',
    description: 'Transform your business with intelligent automation solutions. Process automation, system integration, and custom software development.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Force dynamic rendering during development
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Fetch data server-side with error handling
  let skills: Skill[] = [];
  let projects: Project[] = [];
  let experience: WorkExperience[] = [];
  let settings: SiteSettings = {
    site_title: 'Fritz Automation',
    tagline: 'Software Developer & Designer',
    about_text: 'Welcome to Fritz Automation!',
    email: 'forward@fritzautomation.dev',
  };

  try {
    [skills, projects, experience, settings] = await Promise.all([
      getSkills().catch(() => []),
      getFeaturedProjects().catch(() => []),
      getWorkExperience().catch(() => []),
      getSiteSettings().catch(() => settings),
    ]);
  } catch (error) {
    // Silently handle errors - data will fall back to defaults
  }

  return (
    <div className="min-h-screen">
      <Header siteTitle={settings.site_title} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20 md:py-32">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
                ⚡ Automation Solutions
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block text-gray-600 text-2xl md:text-3xl font-normal mb-2">Welcome to</span>
                <span className="gradient-text">Fritz Automation</span>
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-gray-700 font-medium">
                Custom automation solutions built with Python and modern web technologies
              </p>
              <p className="mb-8 text-gray-600 text-lg leading-relaxed">
                We specialize in process automation, system integration, and custom software development.
                Transform your business with intelligent automation solutions tailored to your needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/services"
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Our Services
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Get a Quote
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Python Experts</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Full-Stack Solutions</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Custom Built</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Animated Code Editor + Terminal */}
            <ScrollReveal direction="right" delay={200}>
              <AnimatedCodeHero />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Skills Marquee */}
      {skills.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-50 py-16 border-y border-gray-100">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative">
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {/* Duplicate skills for seamless loop */}
              {[...skills, ...skills].map((skill, index) => (
                <div
                  key={`${skill.id}-${index}`}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                >
                  {skill.icon && (
                    <OptimizedImage src={skill.icon} alt="" width={24} height={24} objectFit="contain" />
                  )}
                  <span className="text-lg font-semibold text-gray-800">
                    {skill.name}
                  </span>
                  {skill.proficiency && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                      {skill.proficiency}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      <section id="skills" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
              🎯 Our Capabilities
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="block text-gray-600 text-xl md:text-2xl font-medium mb-2">Technology Stack</span>
              <span className="gradient-text">Our Expertise</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We leverage modern technologies to build robust, scalable automation solutions
            </p>
          </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Skills Grid */}
            <ScrollReveal direction="left" delay={100}>
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-3xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Core Technologies</h3>
                </div>

                {skills.length > 0 ? (
                  <div className="space-y-4">
                    {skills.slice(0, 8).map((skill, index) => (
                      <div key={skill.id} className="fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {skill.icon && (
                              <OptimizedImage src={skill.icon} alt="" width={20} height={20} objectFit="contain" />
                            )}
                            <span className="font-semibold text-gray-800">{skill.name}</span>
                          </div>
                          <span className="text-sm font-bold text-primary">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${skill.proficiency}%`,
                              transitionDelay: `${index * 100}ms`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-3">📚</div>
                    <p className="text-gray-500">
                      No skills added yet. Add some in the Django Admin!
                    </p>
                  </div>
                )}

                {skills.length > 8 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600">
                      + {skills.length - 8} more technologies
                    </p>
                  </div>
                )}
              </div>
            </div>
            </ScrollReveal>

            {/* Why Choose Us */}
            <ScrollReveal direction="right" delay={200}>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-secondary/10 to-transparent rounded-3xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-secondary/20 rounded-xl">
                    <svg className="w-6 h-6 text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Why Choose Fritz Automation</h3>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We deliver intelligent automation solutions that transform how businesses operate. Our expertise in Python,
                    Django, FastAPI, and modern web technologies enables us to build robust, scalable systems tailored to your unique needs.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    From streamlining workflows to integrating complex systems, we focus on solutions that save time, reduce errors,
                    and scale with your growth.
                  </p>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 border-2 border-primary/10 hover:border-primary/30 transition-colors">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {skills.length}+
                  </div>
                  <div className="text-sm text-gray-600">Technologies</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border-2 border-primary/10 hover:border-primary/30 transition-colors">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {projects.length + 1}+
                  </div>
                  <div className="text-sm text-gray-600">Projects Delivered</div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-white">
                <h4 className="text-xl font-bold mb-3">Ready to Automate?</h4>
                <p className="mb-6 text-primary-lighter">
                  Let's discuss how Fritz Automation can streamline your operations and build custom solutions for your business.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                >
                  Get a Quote
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
                ⚡ What We Offer
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="block text-gray-600 text-xl md:text-2xl font-medium mb-2">Our Services</span>
                <span className="gradient-text">How We Can Help</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Fritz Automation specializes in three core areas to transform your business operations
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <ScrollReveal delay={0} direction="up">
              <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover-lift">
                <div className="text-5xl mb-4">⚙️</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Process Automation</h3>
                <p className="text-gray-600 mb-4">
                  Streamline workflows, automate repetitive tasks, and build intelligent systems that save time and reduce errors.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Workflow automation
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Data processing
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Report generation
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100} direction="up">
              <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover-lift">
                <div className="text-5xl mb-4">🔗</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">System Integration</h3>
                <p className="text-gray-600 mb-4">
                  Connect your existing systems seamlessly, eliminating data silos and enabling real-time synchronization.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    API development
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Database sync
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Third-party connections
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover-lift">
                <div className="text-5xl mb-4">💻</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Custom Solutions</h3>
                <p className="text-gray-600 mb-4">
                  Tailored software applications built specifically for your business needs, from concept to deployment.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Web applications
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Internal dashboards
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Customer portals
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                View All Services
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Work Experience */}
      <section id="experience" className="relative py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-secondary/20 rounded-full text-secondary-dark text-sm font-semibold">
              🏆 Our Experience
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="block text-gray-600 text-xl md:text-2xl font-medium mb-2">Proven Track Record</span>
              <span className="gradient-text">Experience & Expertise</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our team's professional background and key accomplishments in automation and software development
            </p>
          </div>
          </ScrollReveal>

          {experience.length > 0 ? (
            <div className="relative">
              {/* Timeline line - hidden on mobile */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary-light to-transparent transform -translate-x-1/2"></div>

              {/* Experience items */}
              <div className="space-y-12 md:space-y-16">
                {experience.map((job, index) => (
                  <ScrollReveal key={job.id} delay={index * 150} direction="up">
                  <div
                    className={`relative ${
                      index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="hidden md:block absolute left-1/2 top-8 w-6 h-6 bg-gradient-to-br from-primary to-primary-light rounded-full transform -translate-x-1/2 ring-4 ring-white shadow-lg z-10">
                      <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
                    </div>

                    {/* Content card */}
                    <div className={`md:w-11/12 ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                      <div className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover-lift">
                        {/* Company image */}
                        {job.image && (
                          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/20">
                            <OptimizedImage
                              src={job.image}
                              alt={job.company}
                              fill
                              objectFit="cover"
                              className="group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          </div>
                        )}

                        <div className="p-8">
                          {/* Header */}
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                {job.position}
                              </h3>
                              <div className="flex items-center gap-2 text-primary font-semibold">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {job.company}
                              </div>
                            </div>

                            {/* Duration badge */}
                            <div className="flex flex-col items-end gap-2">
                              <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-full">
                                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {job.duration}
                                </div>
                              </div>
                              {job.is_current && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Date range */}
                          <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium">
                              {new Date(job.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              {' - '}
                              {job.end_date
                                ? new Date(job.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                : 'Present'}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed">
                            {job.description}
                          </p>

                          {/* Location */}
                          {job.location && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">💼</div>
              <p className="text-gray-500 text-lg">No work experience added yet.</p>
              <p className="text-gray-400 text-sm mt-2">Add your professional journey in the Django Admin!</p>
            </div>
          )}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-secondary/20 rounded-full text-secondary-dark text-sm font-semibold">
              💼 Our Work
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="block text-gray-600 text-xl md:text-2xl font-medium mb-2">Recent Projects</span>
              <span className="gradient-text">Our Work</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our recent automation projects and custom solutions built for clients
            </p>
          </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Game Project */}
            <ScrollReveal delay={0} direction="up">
              <Link
                href="/game"
                className="group relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl overflow-hidden shadow-md hover-lift border-2 border-purple-200"
              >
                {/* Project Image */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 overflow-hidden">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-8xl mb-2">🐉</div>
                      <div className="text-white font-bold text-2xl">Dragon Repeller</div>
                    </div>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <span className="text-sm font-semibold">Play Game</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  {/* Featured badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-semibold rounded-full flex items-center gap-1">
                      ⭐ Interactive
                    </span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    Dragon Repeller RPG
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    A playable text-based RPG game built with React. Battle monsters, collect weapons, and defeat the dragon!
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      React
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-full">
                      Game Logic
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {projects.length > 0 && (
              projects.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 100} direction="up">
                <Link
                  href={`/projects/${project.slug}`}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover-lift"
                >
                  {/* Project Image */}
                  <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                    <OptimizedImage
                      src={project.image}
                      alt={project.title}
                      fill
                      objectFit="cover"
                      className="group-hover:scale-110 transition-transform duration-500"
                      fallback={
                        <div className="flex items-center justify-center h-full text-6xl">
                          🚀
                        </div>
                      }
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <span className="text-sm font-semibold">View Project</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                    {/* Status badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        {project.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.short_description}
                    </p>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech.id}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                          >
                            {tech.name}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <ScrollReveal>
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  FA
                </div>
                <span className="text-xl font-bold">{settings.site_title}</span>
              </Link>
              <p className="text-gray-400 mb-6 max-w-md">
                Custom automation solutions built with Python and modern web technologies
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                {settings.github_url && (
                  <a
                    href={settings.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="GitHub"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {settings.linkedin_url && (
                  <a
                    href={settings.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {settings.twitter_url && (
                  <a
                    href={settings.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#skills" className="text-gray-400 hover:text-white transition-colors">
                    Expertise
                  </Link>
                </li>
                <li>
                  <Link href="#projects" className="text-gray-400 hover:text-white transition-colors">
                    Our Work
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Get a Quote
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">Get In Touch</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {settings.email}
                  </a>
                </li>
                {settings.resume_file && (
                  <li>
                    <a
                      href={settings.resume_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Resume
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} {settings.site_title}. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  Built with
                  <span className="text-red-500">❤️</span>
                  using Django & Next.js
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </ScrollReveal>

      <ScrollToTop />
    </div>
  );
}
