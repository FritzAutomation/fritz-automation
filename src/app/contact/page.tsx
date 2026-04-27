import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PathCrumbs } from '@/components/layout/PathCrumbs'
import { GitGraphBackdrop } from '@/components/v3/GitGraphBackdrop'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project with Fritz Automation. I read every inquiry personally and reply within a day.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero — v3 chrome */}
      <section className="v3-hero-bg relative overflow-hidden border-b border-[var(--line)] py-16">
        <GitGraphBackdrop height={400} />
        <div className="relative z-[2] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PathCrumbs trail={[{ label: 'contact' }]} />
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--heading)] tracking-[-0.025em]">Tell me about your project.</h1>
          <p className="mt-3 text-lg text-[var(--ink)] max-w-2xl">I read every inquiry myself. Usually reply within a day, often within an hour.</p>
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
