'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface CellError {
  row: number
  col: number
  type: 'duplicate' | 'format' | 'missing' | 'invalid' | 'inconsistent'
  message: string
  original: string
  fixed: string
}

interface DataRow {
  id: number
  name: string
  email: string
  date: string
  amount: string
  status: string
}

const INITIAL_DATA: DataRow[] = [
  { id: 1, name: 'John Smith', email: 'john@example.com', date: '2024-01-15', amount: '$1,250.00', status: 'Active' },
  { id: 2, name: 'sarah jones', email: 'sarah@example', date: '01/20/2024', amount: '980', status: 'active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', date: '2024-01-22', amount: '$2,100.00', status: 'Active' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', date: '2024-01-25', amount: '$750.00', status: 'Pending' },
  { id: 5, name: 'john smith', email: 'john@example.com', date: '2024-01-15', amount: '$1,250.00', status: 'Active' },
  { id: 6, name: 'Alex Wilson', email: '', date: '2024-02-01', amount: '$3,400.00', status: 'Active' },
  { id: 7, name: 'Lisa Brown', email: 'lisa@example.com', date: '02-05-2024', amount: '$1,800', status: 'ACTIVE' },
  { id: 8, name: 'Tom Anderson', email: 'tom@example.com', date: '2024-02-10', amount: '$2,250.00', status: 'Active' },
]

const ERRORS: CellError[] = [
  { row: 1, col: 0, type: 'inconsistent', message: 'Inconsistent capitalization', original: 'sarah jones', fixed: 'Sarah Jones' },
  { row: 1, col: 1, type: 'invalid', message: 'Invalid email format', original: 'sarah@example', fixed: 'sarah@example.com' },
  { row: 1, col: 2, type: 'format', message: 'Inconsistent date format', original: '01/20/2024', fixed: '2024-01-20' },
  { row: 1, col: 3, type: 'format', message: 'Missing currency symbol', original: '980', fixed: '$980.00' },
  { row: 1, col: 4, type: 'inconsistent', message: 'Inconsistent capitalization', original: 'active', fixed: 'Active' },
  { row: 4, col: 0, type: 'duplicate', message: 'Duplicate entry (Row 1)', original: 'john smith', fixed: 'DUPLICATE - Remove' },
  { row: 4, col: 1, type: 'duplicate', message: 'Duplicate email (Row 1)', original: 'john@example.com', fixed: 'DUPLICATE' },
  { row: 5, col: 1, type: 'missing', message: 'Required field is empty', original: '', fixed: 'REQUIRED' },
  { row: 6, col: 2, type: 'format', message: 'Inconsistent date format', original: '02-05-2024', fixed: '2024-02-05' },
  { row: 6, col: 3, type: 'format', message: 'Missing currency format', original: '$1,800', fixed: '$1,800.00' },
  { row: 6, col: 4, type: 'inconsistent', message: 'Inconsistent capitalization', original: 'ACTIVE', fixed: 'Active' },
]

const COLUMNS = ['Name', 'Email', 'Date', 'Amount', 'Status']

export function ErrorDetectionDemo() {
  const [data, setData] = useState<DataRow[]>(INITIAL_DATA)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [detectedErrors, setDetectedErrors] = useState<CellError[]>([])
  const [currentScanRow, setCurrentScanRow] = useState(-1)
  const [fixing, setFixing] = useState(false)
  const [fixedCount, setFixedCount] = useState(0)
  const [hoveredError, setHoveredError] = useState<CellError | null>(null)
  const [showFixed, setShowFixed] = useState(false)

  // Scanning animation
  useEffect(() => {
    if (!scanning) return

    let row = 0
    const interval = setInterval(() => {
      if (row < INITIAL_DATA.length) {
        setCurrentScanRow(row)
        setScanProgress(((row + 1) / INITIAL_DATA.length) * 100)

        // Find errors for this row
        const rowErrors = ERRORS.filter(e => e.row === row)
        if (rowErrors.length > 0) {
          setDetectedErrors(prev => [...prev, ...rowErrors])
        }

        row++
      } else {
        setScanning(false)
        setCurrentScanRow(-1)
        clearInterval(interval)
      }
    }, 400)

    return () => clearInterval(interval)
  }, [scanning])

  // Fixing animation
  useEffect(() => {
    if (!fixing) return

    let errorIndex = 0
    const interval = setInterval(() => {
      if (errorIndex < detectedErrors.length) {
        setFixedCount(errorIndex + 1)
        errorIndex++
      } else {
        setFixing(false)
        setShowFixed(true)
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [fixing, detectedErrors.length])

  const handleScan = () => {
    setScanning(true)
    setDetectedErrors([])
    setScanProgress(0)
    setFixedCount(0)
    setShowFixed(false)
  }

  const handleFixAll = () => {
    setFixing(true)
  }

  const handleReset = () => {
    setData(INITIAL_DATA)
    setScanning(false)
    setScanProgress(0)
    setDetectedErrors([])
    setCurrentScanRow(-1)
    setFixing(false)
    setFixedCount(0)
    setShowFixed(false)
  }

  const getCellValue = (row: DataRow, colIndex: number): string => {
    const keys: (keyof DataRow)[] = ['name', 'email', 'date', 'amount', 'status']
    return String(row[keys[colIndex]])
  }

  const getErrorForCell = (rowIndex: number, colIndex: number): CellError | undefined => {
    return detectedErrors.find(e => e.row === rowIndex && e.col === colIndex)
  }

  const isErrorFixed = (error: CellError): boolean => {
    const errorIndex = detectedErrors.indexOf(error)
    return errorIndex < fixedCount
  }

  const getErrorTypeColor = (type: CellError['type']) => {
    switch (type) {
      case 'duplicate': return 'bg-purple-100 border-purple-400 text-purple-800'
      case 'format': return 'bg-yellow-100 border-yellow-400 text-yellow-800'
      case 'missing': return 'bg-red-100 border-red-400 text-red-800'
      case 'invalid': return 'bg-orange-100 border-orange-400 text-orange-800'
      case 'inconsistent': return 'bg-blue-100 border-blue-400 text-blue-800'
      default: return 'bg-gray-100 border-gray-400 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={handleScan} disabled={scanning || detectedErrors.length > 0}>
            {scanning ? 'Scanning...' : 'Scan for Issues'}
          </Button>
          {detectedErrors.length > 0 && !showFixed && (
            <Button onClick={handleFixAll} disabled={fixing} variant="outline">
              {fixing ? `Fixing... (${fixedCount}/${detectedErrors.length})` : `Fix All (${detectedErrors.length})`}
            </Button>
          )}
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Error types:</span>
          <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">Duplicate</span>
          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">Format</span>
          <span className="px-2 py-1 rounded bg-red-100 text-red-700">Missing</span>
          <span className="px-2 py-1 rounded bg-orange-100 text-orange-700">Invalid</span>
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">Inconsistent</span>
        </div>
      </div>

      {/* Scan progress */}
      {scanning && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Scanning data...</span>
            <span className="text-sm text-blue-600">{Math.round(scanProgress)}%</span>
          </div>
          <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results summary */}
      {detectedErrors.length > 0 && !scanning && (
        <div className={`rounded-lg p-4 ${showFixed ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
          {showFixed ? (
            <div className="flex items-center gap-2 text-green-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">All {detectedErrors.length} issues have been fixed!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Found {detectedErrors.length} issues that need attention</span>
            </div>
          )}
        </div>
      )}

      {/* Spreadsheet */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-4 py-3 text-left font-semibold text-slate-700 w-12">#</th>
              {COLUMNS.map(col => (
                <th key={col} className="px-4 py-3 text-left font-semibold text-slate-700">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => {
              const isCurrentlyScanningRow = currentScanRow === rowIndex

              return (
                <tr
                  key={row.id}
                  className={`border-t border-slate-100 transition-all ${
                    isCurrentlyScanningRow ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-slate-500 font-mono">{rowIndex + 1}</td>
                  {[0, 1, 2, 3, 4].map(colIndex => {
                    const cellError = getErrorForCell(rowIndex, colIndex)
                    const isFixed = cellError && isErrorFixed(cellError)
                    const cellValue = getCellValue(row, colIndex)

                    return (
                      <td
                        key={colIndex}
                        className="px-4 py-3 relative"
                        onMouseEnter={() => cellError && !isFixed && setHoveredError(cellError)}
                        onMouseLeave={() => setHoveredError(null)}
                      >
                        <div
                          className={`px-2 py-1 rounded transition-all ${
                            cellError && !isFixed
                              ? `border ${getErrorTypeColor(cellError.type)}`
                              : isFixed
                                ? 'bg-green-100 text-green-800'
                                : ''
                          }`}
                        >
                          {isFixed ? cellError?.fixed : cellValue || <span className="text-red-400 italic">Empty</span>}
                        </div>

                        {/* Error tooltip */}
                        {hoveredError === cellError && cellError && !isFixed && (
                          <div className="absolute z-10 bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
                            <div className="font-medium mb-1">{cellError.message}</div>
                            <div className="text-slate-400">
                              Suggested fix: <span className="text-green-400">{cellError.fixed}</span>
                            </div>
                            <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900" />
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Error details panel */}
      {detectedErrors.length > 0 && !showFixed && (
        <div className="bg-slate-50 rounded-xl p-4">
          <h4 className="font-semibold text-slate-900 mb-3">Issues Found:</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {detectedErrors.map((error, index) => {
              const isFixed = index < fixedCount
              return (
                <div
                  key={`${error.row}-${error.col}`}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                    isFixed ? 'bg-green-100' : 'bg-white border border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getErrorTypeColor(error.type)}`}>
                      {error.type}
                    </span>
                    <span className="text-sm text-slate-600">
                      Row {error.row + 1}, {COLUMNS[error.col]}: {error.message}
                    </span>
                  </div>
                  {isFixed ? (
                    <span className="text-green-600 text-sm">✓ Fixed</span>
                  ) : (
                    <span className="text-slate-400 text-sm">{error.original} → {error.fixed}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
