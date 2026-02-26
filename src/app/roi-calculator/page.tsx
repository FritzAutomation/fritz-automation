'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { DataStream } from '@/components/animations/DataStream'
import Link from 'next/link'

interface CalculatorInputs {
  hoursPerWeek: number
  hourlyRate: number
  errorRate: number
  errorCost: number
  employees: number
}

const defaultInputs: CalculatorInputs = {
  hoursPerWeek: 10,
  hourlyRate: 35,
  errorRate: 5,
  errorCost: 100,
  employees: 3,
}

export default function ROICalculatorPage() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs)
  const [showResults, setShowResults] = useState(false)

  const results = useMemo(() => {
    const weeklyLaborCost = inputs.hoursPerWeek * inputs.hourlyRate * inputs.employees
    const annualLaborCost = weeklyLaborCost * 52

    const weeklyErrors = (inputs.hoursPerWeek * inputs.employees * inputs.errorRate) / 100
    const annualErrorCost = weeklyErrors * inputs.errorCost * 52

    const totalAnnualCost = annualLaborCost + annualErrorCost

    // Automation typically saves 80-95% of manual time
    const automationEfficiency = 0.90
    const annualSavings = totalAnnualCost * automationEfficiency

    // Typical project costs
    const estimatedProjectCost = Math.max(5000, Math.min(50000, annualSavings * 0.3))

    const roiPercentage = ((annualSavings - estimatedProjectCost) / estimatedProjectCost) * 100
    const paybackMonths = (estimatedProjectCost / (annualSavings / 12))

    const hoursReclaimed = inputs.hoursPerWeek * inputs.employees * automationEfficiency * 52

    return {
      weeklyLaborCost,
      annualLaborCost,
      annualErrorCost,
      totalAnnualCost,
      annualSavings,
      estimatedProjectCost,
      roiPercentage,
      paybackMonths,
      hoursReclaimed,
    }
  }, [inputs])

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <DataStream />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-semibold">
            Free Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Automation ROI Calculator
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            See how much time and money you could save by automating your manual processes.
            Get a personalized estimate in under 2 minutes.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Input Section */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Tell Us About Your Current Process
              </h2>

              <div className="space-y-8">
                {/* Hours per week */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Hours spent on manual tasks per week (per person)
                    </label>
                    <span className="text-sm font-bold text-primary">{inputs.hoursPerWeek} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={inputs.hoursPerWeek}
                    onChange={(e) => handleInputChange('hoursPerWeek', Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1 hr</span>
                    <span>40 hrs</span>
                  </div>
                </div>

                {/* Number of employees */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Number of employees doing this task
                    </label>
                    <span className="text-sm font-bold text-primary">{inputs.employees}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={inputs.employees}
                    onChange={(e) => handleInputChange('employees', Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Hourly rate */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Average hourly labor cost (including benefits)
                    </label>
                    <span className="text-sm font-bold text-primary">${inputs.hourlyRate}/hr</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="150"
                    step="5"
                    value={inputs.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>$15/hr</span>
                    <span>$150/hr</span>
                  </div>
                </div>

                {/* Error rate */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Estimated error rate in manual process
                    </label>
                    <span className="text-sm font-bold text-primary">{inputs.errorRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={inputs.errorRate}
                    onChange={(e) => handleInputChange('errorRate', Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* Cost per error */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Average cost to fix an error
                    </label>
                    <span className="text-sm font-bold text-primary">${inputs.errorCost}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={inputs.errorCost}
                    onChange={(e) => handleInputChange('errorCost', Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>$10</span>
                    <span>$1,000</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowResults(true)}
                  className="w-full"
                  size="lg"
                >
                  Calculate My Savings
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className={`transition-all duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Your Potential Savings
              </h2>

              {/* Main savings card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white mb-6">
                <div className="text-center mb-8">
                  <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Estimated Annual Savings</p>
                  <p className="text-5xl md:text-6xl font-bold text-green-400">
                    {formatCurrency(results.annualSavings)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{formatNumber(results.hoursReclaimed)}</p>
                    <p className="text-sm text-slate-400">Hours Reclaimed/Year</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white">{results.paybackMonths.toFixed(1)}</p>
                    <p className="text-sm text-slate-400">Months to Payback</p>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-slate-900 mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Current annual labor cost</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(results.annualLaborCost)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Annual cost of errors</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(results.annualErrorCost)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Total annual cost</span>
                    <span className="font-bold text-slate-900">{formatCurrency(results.totalAnnualCost)}</span>
                  </div>
                </div>
              </div>

              {/* ROI indicator */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-green-800">Projected First-Year ROI</p>
                    <p className="text-3xl font-bold text-green-600">{formatNumber(results.roiPercentage)}%</p>
                  </div>
                </div>
                <p className="text-sm text-green-700">
                  Based on an estimated project investment of {formatCurrency(results.estimatedProjectCost)}
                </p>
              </div>

              {/* CTA */}
              <div className="text-center">
                <p className="text-slate-600 mb-4">
                  Ready to turn these projections into reality?
                </p>
                <Link href="/contact">
                  <Button size="lg">
                    Get a Custom Quote
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Calculate Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            How We Calculate Your ROI
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Time Savings</h3>
              <p className="text-sm text-slate-600">
                Automation typically reduces manual task time by 80-95%. We use a conservative 90% efficiency gain in our calculations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Error Reduction</h3>
              <p className="text-sm text-slate-600">
                Automated processes virtually eliminate human errors, saving the costs associated with corrections, rework, and customer issues.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Scalability</h3>
              <p className="text-sm text-slate-600">
                Unlike manual processes, automated solutions scale without proportional cost increases, compounding savings over time.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              <strong className="text-slate-900">Note:</strong> These calculations provide estimates based on typical automation projects.
              Actual results vary based on process complexity, integration requirements, and specific business factors.
              Contact us for a detailed analysis of your specific situation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your specific processes and create a custom automation plan that delivers real ROI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Schedule a Consultation
              </Button>
            </Link>
            <Link href="/case-studies">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                View Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
