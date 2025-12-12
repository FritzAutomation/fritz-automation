'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DemoContainer } from '@/components/demos/DemoContainer'
import { DemoTabs } from '@/components/demos/DemoTabs'
import { BeforeAfterDemo } from '@/components/demos/BeforeAfterDemo'
import { DataPipelineDemo } from '@/components/demos/DataPipelineDemo'
import { ErrorDetectionDemo } from '@/components/demos/ErrorDetectionDemo'
import { ReportGeneratorDemo } from '@/components/demos/ReportGeneratorDemo'
import { WorkflowBuilderDemo } from '@/components/demos/WorkflowBuilderDemo'
import { DashboardBuilderDemo } from '@/components/demos/DashboardBuilderDemo'

const DEMOS = [
  {
    id: 'before-after',
    label: 'Before/After',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
    title: 'Before/After Process Simulator',
    description: 'Experience the difference between manual work and automation first-hand',
    component: BeforeAfterDemo,
  },
  {
    id: 'pipeline',
    label: 'Data Pipeline',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    title: 'Live Data Pipeline Visualizer',
    description: 'Watch data flow through transformation stages in real-time',
    component: DataPipelineDemo,
  },
  {
    id: 'error-detection',
    label: 'Error Detection',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Error Detection & Correction',
    description: 'See how automation finds and fixes data quality issues automatically',
    component: ErrorDetectionDemo,
  },
  {
    id: 'report-generator',
    label: 'Report Generator',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    title: 'Interactive Report Generator',
    description: 'Watch a complete report build itself from raw data to finished document',
    component: ReportGeneratorDemo,
  },
  {
    id: 'workflow-builder',
    label: 'Workflow Builder',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
    title: 'Drag-and-Drop Workflow Builder',
    description: 'Create custom automation workflows by connecting visual components',
    component: WorkflowBuilderDemo,
  },
  {
    id: 'dashboard-builder',
    label: 'Dashboard Builder',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    title: 'Real-Time Dashboard Builder',
    description: 'Build a live dashboard and watch data populate in real-time',
    component: DashboardBuilderDemo,
  },
]

export default function DemosPage() {
  const [activeDemo, setActiveDemo] = useState('before-after')

  const currentDemo = DEMOS.find(d => d.id === activeDemo) || DEMOS[0]
  const DemoComponent = currentDemo.component

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-semibold">
            Interactive Demos
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            See Automation in Action
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore interactive demonstrations of what automation can do for your business.
            No code required - just click and experience the power of automation.
          </p>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="mb-8">
            <DemoTabs
              demos={DEMOS.map(d => ({ id: d.id, label: d.label, icon: d.icon }))}
              activeDemo={activeDemo}
              onSelect={setActiveDemo}
            />
          </div>

          {/* Active Demo */}
          <DemoContainer
            title={currentDemo.title}
            description={currentDemo.description}
          >
            <DemoComponent />
          </DemoContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Automate Your Processes?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            These demos show just a fraction of what&apos;s possible. Let&apos;s discuss how we can transform your specific workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/contact">
              <button className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-slate-100 transition-colors">
                Get a Custom Demo
              </button>
            </a>
            <a href="/roi-calculator">
              <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                Calculate Your ROI
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
