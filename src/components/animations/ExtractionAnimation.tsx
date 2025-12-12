'use client'

import { useEffect, useState } from 'react'

interface ExtractionAnimationProps {
  variant: 'scraping' | 'documents'
}

export function ExtractionAnimation({ variant }: ExtractionAnimationProps) {
  const [extractedItems, setExtractedItems] = useState<number[]>([])
  const [currentRow, setCurrentRow] = useState(0)
  const [documentsGenerated, setDocumentsGenerated] = useState(0)

  useEffect(() => {
    if (variant === 'scraping') {
      // Simulate extracting data points
      const extractInterval = setInterval(() => {
        setExtractedItems((prev) => {
          if (prev.length >= 8) {
            return [Date.now()]
          }
          return [...prev, Date.now()]
        })
        setCurrentRow((prev) => (prev + 1) % 6)
      }, 600)

      return () => clearInterval(extractInterval)
    } else {
      // Document generation animation
      const docInterval = setInterval(() => {
        setDocumentsGenerated((prev) => (prev + 1) % 13)
      }, 800)

      return () => clearInterval(docInterval)
    }
  }, [variant])

  if (variant === 'scraping') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 border border-slate-700">
        <div className="text-xs text-slate-500 mb-3 font-mono flex items-center justify-between">
          <span>web_scraper.py</span>
          <span className="text-yellow-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
            Extracting...
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Simulated webpage */}
          <div className="bg-white rounded-lg overflow-hidden border border-slate-300">
            {/* Browser chrome */}
            <div className="bg-slate-100 px-2 py-1.5 flex items-center gap-1.5 border-b border-slate-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded text-[8px] text-slate-400 px-2 py-0.5 ml-2">
                https://competitor.com/products
              </div>
            </div>

            {/* Webpage content */}
            <div className="p-2 space-y-1.5">
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              <div className="h-2 bg-slate-100 rounded w-full"></div>

              {/* Product rows */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-1.5 rounded transition-all duration-300 ${
                    currentRow === i ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'bg-slate-50'
                  }`}
                >
                  <div className="w-6 h-6 bg-slate-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-2 bg-slate-200 rounded w-3/4 mb-1"></div>
                    <div className={`h-2 rounded w-1/4 transition-colors ${
                      currentRow === i ? 'bg-green-400' : 'bg-slate-300'
                    }`}></div>
                  </div>
                  {currentRow === i && (
                    <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Extracted data output */}
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-700">
            <div className="text-[10px] text-slate-500 mb-2 flex items-center justify-between">
              <span>prices.csv</span>
              <span className="text-green-400">{extractedItems.length} rows</span>
            </div>

            {/* CSV header */}
            <div className="font-mono text-[9px] text-slate-500 border-b border-slate-700 pb-1 mb-1">
              product,price,stock
            </div>

            {/* Extracted data rows */}
            <div className="space-y-0.5 font-mono text-[9px] max-h-32 overflow-hidden">
              {extractedItems.map((item, i) => (
                <div
                  key={item}
                  className={`text-green-400 transition-all duration-300 ${
                    i === extractedItems.length - 1 ? 'animate-pulse' : ''
                  }`}
                >
                  Widget_{i + 1},${ (Math.random() * 100 + 50).toFixed(2)},{Math.floor(Math.random() * 500)}
                </div>
              ))}
            </div>

            {/* Animated cursor line */}
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-3 bg-green-400 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-3 bg-slate-800/50 rounded-lg p-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Progress</span>
            <span className="text-slate-300">{Math.min(extractedItems.length * 12 + currentRow * 2, 100)}%</span>
          </div>
          <div className="mt-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-300"
              style={{ width: `${Math.min(extractedItems.length * 12 + currentRow * 2, 100)}%` }}
            />
          </div>
          <div className="mt-1 flex gap-4 text-[9px] text-slate-500">
            <span>Pages: <span className="text-slate-300">156</span></span>
            <span>Extracted: <span className="text-green-400">{extractedItems.length * 156}</span></span>
            <span>Rate: <span className="text-slate-300">~200/min</span></span>
          </div>
        </div>
      </div>
    )
  }

  // Documents variant
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 border border-slate-700">
      <div className="text-xs text-slate-500 mb-3 font-mono flex items-center justify-between">
        <span>document_generator.py</span>
        <span className="text-blue-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
          Generating...
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {/* Template */}
        <div className="col-span-2">
          <div className="text-[10px] text-slate-500 mb-2">Template</div>
          <div className="bg-white rounded-lg p-3 border border-slate-300 shadow-lg">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-700">Fritz Automation</div>
                <div className="text-[8px] text-slate-400">Invoice Template</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px]">
                <span className="text-slate-500">To:</span>
                <span className="text-blue-500 font-mono">{'{{customer}}'}</span>
              </div>
              <div className="flex justify-between text-[9px]">
                <span className="text-slate-500">Amount:</span>
                <span className="text-blue-500 font-mono">{'{{amount}}'}</span>
              </div>
              <div className="flex justify-between text-[9px]">
                <span className="text-slate-500">Date:</span>
                <span className="text-blue-500 font-mono">{'{{date}}'}</span>
              </div>
              <div className="h-8 bg-slate-100 rounded mt-2"></div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-green-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-[9px] text-slate-500 mt-1">x{documentsGenerated}</span>
          </div>
        </div>

        {/* Generated documents stack */}
        <div className="col-span-2">
          <div className="text-[10px] text-slate-500 mb-2">Generated ({documentsGenerated}/12)</div>
          <div className="relative h-36">
            {/* Stack of generated documents */}
            {Array.from({ length: Math.min(documentsGenerated, 5) }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded border border-slate-200 p-2 shadow-md transition-all duration-300"
                style={{
                  top: `${i * 4}px`,
                  left: `${i * 3}px`,
                  width: 'calc(100% - 12px)',
                  zIndex: 5 - i,
                  opacity: 1 - i * 0.15
                }}
              >
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-4 h-4 bg-red-500/20 rounded flex items-center justify-center">
                    <span className="text-red-500 text-[8px] font-bold">F</span>
                  </div>
                  <span className="text-[8px] font-medium text-slate-700">Invoice #{2847 - i}</span>
                </div>
                <div className="space-y-0.5">
                  <div className="h-1.5 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-1.5 bg-slate-100 rounded w-1/2"></div>
                </div>
                {i === 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email sending visualization */}
      <div className="mt-4 bg-slate-800/50 rounded-lg p-3">
        <div className="text-[10px] text-slate-400 mb-2 flex items-center gap-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Sending to Recipients
        </div>

        <div className="flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-6 rounded transition-all duration-300 flex items-center justify-center ${
                i < documentsGenerated ? 'bg-green-500/20 border border-green-500/50' : 'bg-slate-700'
              }`}
            >
              {i < documentsGenerated && (
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-between text-[9px] text-slate-500">
          <span>Sent: <span className="text-green-400">{documentsGenerated}</span></span>
          <span>Pending: <span className="text-slate-300">{12 - documentsGenerated}</span></span>
          <span>Failed: <span className="text-slate-300">0</span></span>
        </div>
      </div>
    </div>
  )
}
