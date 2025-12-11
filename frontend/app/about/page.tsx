import Link from 'next/link';
import { Metadata } from 'next';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'About Us - Fritz Automation | Our Story & Team',
  description: 'Learn about Fritz Automation and our founder Joshua Fritzjunker. We specialize in process automation, system integration, and custom software solutions.',
  keywords: 'About Fritz Automation, Joshua Fritzjunker, Founder, Process Automation, Custom Software Development',
};

export default function AboutPage() {
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
              👋 About Us
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">Our Story</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fritz Automation was founded to help businesses leverage the power of intelligent automation
              and custom software solutions to streamline operations and drive growth.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 border border-gray-100">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">What We Do</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>
                  Fritz Automation specializes in creating intelligent automation solutions that transform how businesses operate.
                  We focus on three core areas: process automation, system integration, and custom software development.
                </p>
                <p>
                  Our approach combines deep technical expertise in Python, Django, FastAPI, and modern web technologies
                  with a practical understanding of business operations. We don't just write code—we build solutions that
                  solve real problems and deliver measurable results.
                </p>
                <p>
                  Whether you need to automate repetitive workflows, integrate disparate systems, or build a custom application
                  from the ground up, we work closely with you to understand your unique needs and deliver solutions tailored
                  to your business.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
                👤 Founder
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">Meet the Founder</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 shadow-2xl">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8">
                      <div className="text-9xl mb-4">👨‍💻</div>
                      <div className="text-4xl font-bold gradient-text mb-2">JF</div>
                      <p className="text-gray-600">Joshua Fritzjunker</p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -z-10 top-10 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute -z-10 bottom-10 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={200}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-2">Joshua Fritzjunker</h3>
                  <p className="text-xl text-primary font-semibold mb-4">Founder & Lead Developer</p>
                </div>

                <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
                  <p>
                    With over 20 years in manufacturing and 14 years at CNH Industrial, Joshua brings a unique perspective
                    to automation—one grounded in real-world operational challenges. As a self-taught developer, he identified
                    opportunities to transform manual processes into automated systems and built mission-critical solutions
                    that process over 100,000 datasets daily.
                  </p>
                  <p>
                    His experience spans building financial accounting systems (Manufacturing Index), plant-wide MES
                    visualizations, and enterprise data pipelines. This deep understanding of both the shop floor and
                    executive reporting needs allows him to create solutions that truly solve business problems.
                  </p>
                  <p>
                    Joshua founded Fritz Automation to bring this same results-driven approach to businesses of all sizes.
                    His expertise in Python, Django, FastAPI, React, and Next.js enables him to build end-to-end solutions
                    that are powerful, scalable, and user-friendly.
                  </p>
                </div>

                {/* Contact Links */}
                <div className="flex flex-wrap gap-4 pt-6">
                  <a
                    href="https://github.com/FritzAutomation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all hover:scale-105 font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/joshua-fritzjunker-53383590/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0077b5] text-white rounded-xl hover:bg-[#006399] transition-all hover:scale-105 font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="mailto:forward@fritzautomation.dev"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
                💎 Our Values
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">What We Believe</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0} direction="up">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border border-gray-100">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-3">Results-Focused</h3>
                <p className="text-gray-600 leading-relaxed">
                  We measure success by the tangible impact our solutions have on your business. Every line of code
                  serves a purpose.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100} direction="up">
              <div className="bg-gradient-to-br from-cyan-50 to-white rounded-3xl p-8 border border-gray-100">
                <div className="text-5xl mb-4">🔧</div>
                <h3 className="text-2xl font-bold mb-3">Quality First</h3>
                <p className="text-gray-600 leading-relaxed">
                  We build solutions that are maintainable, scalable, and built to last. Clean code and best
                  practices are non-negotiable.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 border border-gray-100">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-2xl font-bold mb-3">Partnership</h3>
                <p className="text-gray-600 leading-relaxed">
                  We work closely with our clients as partners, not just vendors. Your success is our success,
                  and we're invested in your growth.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary to-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Work Together?
            </h2>
            <p className="text-xl text-primary-lighter mb-8">
              Let's discuss how Fritz Automation can help streamline your operations and build custom solutions for your business.
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
                href="/services"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                View Our Services
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
