import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { MouseGrid } from '@/components/animations/MouseGrid'
import { DataStream } from '@/components/animations/DataStream'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Fritz Automation for custom automation solutions. We respond within 24 hours.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero — matches other reframed pages */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <MouseGrid />
          <DataStream />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'contact' }]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">Tell me about your project</h1>
        </div>
      </section>

      {/* Form section */}
      <section className="bg-slate-950 py-12">
        <ContactForm />
      </section>

      <Footer />
    </div>
  )
}
