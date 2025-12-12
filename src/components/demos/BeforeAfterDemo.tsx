'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

interface ManualStep {
  id: number
  label: string
  action: string
  hasError?: boolean
}

const MANUAL_STEPS: ManualStep[] = [
  { id: 1, label: 'Open spreadsheet', action: 'Opening...' },
  { id: 2, label: 'Find next row', action: 'Searching...' },
  { id: 3, label: 'Copy customer data', action: 'Copying...' },
  { id: 4, label: 'Switch to form', action: 'Switching...' },
  { id: 5, label: 'Paste into fields', action: 'Pasting...' },
  { id: 6, label: 'Verify data', action: 'Checking...', hasError: true },
  { id: 7, label: 'Fix the error', action: 'Correcting...' },
  { id: 8, label: 'Submit form', action: 'Submitting...' },
]

const TOTAL_RECORDS = 5

export function BeforeAfterDemo() {
  // Manual side state
  const [manualStep, setManualStep] = useState(0)
  const [manualRecord, setManualRecord] = useState(1)
  const [manualTime, setManualTime] = useState(0)
  const [manualErrors, setManualErrors] = useState(0)
  const [manualComplete, setManualComplete] = useState(false)
  const [isManualActive, setIsManualActive] = useState(false)
  const [showError, setShowError] = useState(false)

  // Automated side state
  const [autoRunning, setAutoRunning] = useState(false)
  const [autoProgress, setAutoProgress] = useState(0)
  const [autoTime, setAutoTime] = useState(0)
  const [autoComplete, setAutoComplete] = useState(false)
  const [autoSteps, setAutoSteps] = useState<number[]>([])

  // Timer for manual side
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isManualActive && !manualComplete) {
      interval = setInterval(() => {
        setManualTime(prev => prev + 100)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isManualActive, manualComplete])

  // Automated process
  useEffect(() => {
    if (!autoRunning) return

    const steps = [
      'Connecting to data source',
      'Reading records',
      'Validating data',
      'Transforming formats',
      'Submitting to system',
      'Verifying results',
      'Complete!'
    ]

    let stepIndex = 0
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setAutoSteps(prev => [...prev, stepIndex])
        setAutoProgress(((stepIndex + 1) / steps.length) * 100)
        setAutoTime(prev => prev + 200)
        stepIndex++
      } else {
        setAutoRunning(false)
        setAutoComplete(true)
        clearInterval(interval)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [autoRunning])

  const handleManualClick = useCallback(() => {
    if (!isManualActive) {
      setIsManualActive(true)
    }

    const currentStepData = MANUAL_STEPS[manualStep]

    // Check if this step has an error
    if (currentStepData?.hasError && !showError) {
      setShowError(true)
      setManualErrors(prev => prev + 1)
      return
    }

    // Clear error state if we're past the error
    if (showError) {
      setShowError(false)
    }

    // Move to next step
    if (manualStep < MANUAL_STEPS.length - 1) {
      setManualStep(prev => prev + 1)
    } else {
      // Completed one record
      if (manualRecord < TOTAL_RECORDS) {
        setManualRecord(prev => prev + 1)
        setManualStep(0)
      } else {
        setManualComplete(true)
        setIsManualActive(false)
      }
    }
  }, [manualStep, manualRecord, isManualActive, showError])

  const handleAutoStart = () => {
    if (autoComplete || autoRunning) return
    setAutoRunning(true)
  }

  const handleReset = () => {
    // Reset manual
    setManualStep(0)
    setManualRecord(1)
    setManualTime(0)
    setManualErrors(0)
    setManualComplete(false)
    setIsManualActive(false)
    setShowError(false)

    // Reset auto
    setAutoRunning(false)
    setAutoProgress(0)
    setAutoTime(0)
    setAutoComplete(false)
    setAutoSteps([])
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    const remainingMs = Math.floor((ms % 1000) / 100)
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${remainingMs}`
    }
    return `${seconds}.${remainingMs}s`
  }

  const autoStepLabels = [
    'Connecting to data source',
    'Reading records',
    'Validating data',
    'Transforming formats',
    'Submitting to system',
    'Verifying results',
    'Complete!'
  ]

  const bothComplete = manualComplete && autoComplete

  return (
    <div className="space-y-6">
      {/* Header with comparison */}
      {bothComplete && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fade-in">
          <h3 className="text-xl font-bold text-green-800 mb-2">Time Saved: {formatTime(manualTime - autoTime)}</h3>
          <p className="text-green-700">
            Automation completed {Math.round(manualTime / autoTime)}x faster with 0 errors vs {manualErrors} manual errors
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Manual Process Side */}
        <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              Manual Process
            </h3>
            <div className="text-sm font-mono text-slate-600">{formatTime(manualTime)}</div>
          </div>

          {/* Progress indicator */}
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
            <span>Record {manualRecord} of {TOTAL_RECORDS}</span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${((manualRecord - 1) / TOTAL_RECORDS) * 100 + (manualStep / MANUAL_STEPS.length) * (100 / TOTAL_RECORDS)}%` }}
              />
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-2 mb-4">
            {MANUAL_STEPS.map((step, index) => {
              const isComplete = index < manualStep || (index === manualStep && manualComplete)
              const isCurrent = index === manualStep && !manualComplete
              const isError = isCurrent && showError

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    isError ? 'bg-red-100 border border-red-300' :
                    isCurrent ? 'bg-orange-100 border border-orange-300' :
                    isComplete ? 'bg-green-50' : 'opacity-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isError ? 'bg-red-500 text-white' :
                    isComplete ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-orange-500 text-white' : 'bg-slate-300 text-slate-600'
                  }`}>
                    {isError ? '!' : isComplete ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm ${isCurrent ? 'font-medium' : ''}`}>
                    {isError ? `Error: Data mismatch detected!` : step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Error counter */}
          {manualErrors > 0 && (
            <div className="mb-4 text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {manualErrors} error{manualErrors > 1 ? 's' : ''} encountered
            </div>
          )}

          {/* Action button */}
          {!manualComplete ? (
            <button
              onClick={handleManualClick}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                showError
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {!isManualActive
                ? 'Start Manual Process'
                : showError
                  ? 'Click to Fix Error'
                  : MANUAL_STEPS[manualStep]?.action || 'Next Step'}
            </button>
          ) : (
            <div className="text-center py-3 bg-green-100 rounded-lg text-green-800 font-medium">
              Complete! (with {manualErrors} errors)
            </div>
          )}
        </div>

        {/* Automated Process Side */}
        <div className="bg-slate-900 rounded-xl p-6 border-2 border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Automated Process
            </h3>
            <div className="text-sm font-mono text-slate-400">{formatTime(autoTime)}</div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <span>Processing {TOTAL_RECORDS} records</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${autoProgress}%` }}
              />
            </div>
          </div>

          {/* Automated steps */}
          <div className="space-y-2 mb-4 min-h-[200px]">
            {autoStepLabels.map((label, index) => {
              const isComplete = autoSteps.includes(index)
              const isCurrent = autoSteps.length === index && autoRunning

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    isCurrent ? 'bg-green-900/50' :
                    isComplete ? 'bg-slate-800' : 'opacity-30'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isComplete ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-green-500 text-white animate-pulse' : 'bg-slate-600 text-slate-400'
                  }`}>
                    {isComplete ? '✓' : isCurrent ? '...' : index + 1}
                  </div>
                  <span className={`text-sm ${isComplete ? 'text-white' : 'text-slate-500'}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Action button */}
          {!autoComplete ? (
            <button
              onClick={handleAutoStart}
              disabled={autoRunning}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                autoRunning
                  ? 'bg-green-700 text-green-200 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {autoRunning ? 'Processing...' : 'Run Automation'}
            </button>
          ) : (
            <div className="text-center py-3 bg-green-900 rounded-lg text-green-300 font-medium">
              Complete! (0 errors)
            </div>
          )}
        </div>
      </div>

      {/* Reset button */}
      <div className="text-center">
        <Button variant="outline" onClick={handleReset}>
          Reset Demo
        </Button>
      </div>
    </div>
  )
}
