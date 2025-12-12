'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How long does a typical automation project take?",
    answer: "Most projects take 4-12 weeks depending on complexity. Simple automations like report generation can be done in 2-4 weeks, while comprehensive system integrations typically take 8-12 weeks. We'll provide a detailed timeline after our initial consultation."
  },
  {
    question: "Do I need technical expertise to work with you?",
    answer: "Not at all. We handle all the technical aspects. You just need to understand your current processes and pain points. We'll guide you through the entire project with clear communication and no jargon."
  },
  {
    question: "What if my systems are outdated or legacy?",
    answer: "We specialize in working with legacy systems. Many of our clients have older ERP systems, Access databases, or Excel-based processes. We build bridges between old and new technology without requiring you to replace what's working."
  },
  {
    question: "How much does automation typically cost?",
    answer: "Projects typically range from $5,000 for simple automations to $50,000+ for comprehensive enterprise solutions. We provide detailed quotes after understanding your specific needs. Most clients see ROI within 3-6 months."
  },
  {
    question: "Do you provide ongoing support after the project?",
    answer: "Yes, all projects include 30 days of post-launch support. We also offer ongoing maintenance packages for clients who want continued monitoring, updates, and priority support."
  },
  {
    question: "What industries do you work with?",
    answer: "We work across manufacturing, logistics, finance, healthcare, retail, and professional services. Our automation principles apply universally—if you have repetitive manual processes, we can likely help."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
            Common Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Frequently Asked Questions</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about working with Fritz Automation
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-slate-300 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-3 sm:gap-4 min-h-[60px] active:bg-slate-50"
              >
                <span className="font-semibold text-slate-900 text-sm sm:text-base">{faq.question}</span>
                <svg
                  className={cn(
                    "w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  openIndex === index ? "max-h-96" : "max-h-0"
                )}
              >
                <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-slate-600 leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
