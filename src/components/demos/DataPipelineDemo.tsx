'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

interface DataPacket {
  id: number
  stage: number
  hasError: boolean
  position: number
}

const STAGES = [
  { id: 0, name: 'Source', icon: '📁', color: 'bg-blue-500' },
  { id: 1, name: 'Transform', icon: '⚙️', color: 'bg-purple-500' },
  { id: 2, name: 'Validate', icon: '✓', color: 'bg-yellow-500' },
  { id: 3, name: 'Output', icon: '💾', color: 'bg-green-500' },
]

const SOURCE_TYPES = [
  { id: 'csv', label: 'CSV File', icon: '📄' },
  { id: 'api', label: 'REST API', icon: '🔗' },
  { id: 'database', label: 'Database', icon: '🗄️' },
]

export function DataPipelineDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [packets, setPackets] = useState<DataPacket[]>([])
  const [processedCount, setProcessedCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [sourceType, setSourceType] = useState('csv')
  const [speed, setSpeed] = useState(1)
  const [injectError, setInjectError] = useState(false)
  const [activeStages, setActiveStages] = useState<Set<number>>(new Set())

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 100)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  // Packet movement
  useEffect(() => {
    if (!isRunning) return

    const baseInterval = 500 / speed
    let packetId = 0

    // Spawn new packets
    const spawnInterval = setInterval(() => {
      if (processedCount + packets.length < 20) {
        const hasError = injectError && Math.random() < 0.3
        setPackets(prev => [...prev, {
          id: packetId++,
          stage: 0,
          hasError,
          position: 0
        }])
        setInjectError(false)
      }
    }, baseInterval * 2)

    // Move packets
    const moveInterval = setInterval(() => {
      setPackets(prev => {
        const updated: DataPacket[] = []
        const newActiveStages = new Set<number>()

        prev.forEach(packet => {
          if (packet.stage < STAGES.length) {
            newActiveStages.add(packet.stage)
          }

          // Move packet to next stage
          if (packet.stage < STAGES.length) {
            if (packet.hasError && packet.stage === 2) {
              // Error caught at validation
              setErrorCount(e => e + 1)
              // Don't add to updated - packet is removed
            } else if (packet.stage === STAGES.length - 1) {
              // Completed
              setProcessedCount(c => c + 1)
              // Don't add to updated - packet is removed
            } else {
              updated.push({ ...packet, stage: packet.stage + 1 })
            }
          }
        })

        setActiveStages(newActiveStages)
        return updated
      })
    }, baseInterval)

    return () => {
      clearInterval(spawnInterval)
      clearInterval(moveInterval)
    }
  }, [isRunning, speed, injectError, processedCount, packets.length])

  // Auto-stop after 20 records
  useEffect(() => {
    if (processedCount + errorCount >= 20 && packets.length === 0) {
      setIsRunning(false)
    }
  }, [processedCount, errorCount, packets.length])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setPackets([])
    setProcessedCount(0)
    setErrorCount(0)
    setElapsedTime(0)
    setActiveStages(new Set())
  }

  const handleInjectError = () => {
    setInjectError(true)
  }

  const formatTime = (ms: number) => {
    const seconds = (ms / 1000).toFixed(1)
    return `${seconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Source selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Source:</span>
          <div className="flex bg-slate-100 rounded-lg p-1">
            {SOURCE_TYPES.map(source => (
              <button
                key={source.id}
                onClick={() => setSourceType(source.id)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  sourceType === source.id
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="mr-1">{source.icon}</span>
                <span className="hidden sm:inline">{source.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Speed:</span>
          <div className="flex bg-slate-100 rounded-lg p-1">
            {[1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  speed === s
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Inject error button */}
        <button
          onClick={handleInjectError}
          disabled={!isRunning}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
            isRunning
              ? 'border-red-300 text-red-600 hover:bg-red-50'
              : 'border-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Inject Error
        </button>
      </div>

      {/* Pipeline visualization */}
      <div className="relative bg-slate-900 rounded-xl p-8 overflow-hidden">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="33%" stopColor="#a855f7" />
              <stop offset="66%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <line
            x1="15%"
            y1="50%"
            x2="85%"
            y2="50%"
            stroke="url(#pipeGradient)"
            strokeWidth="4"
            strokeDasharray="8 4"
            opacity="0.3"
          />
        </svg>

        {/* Stages */}
        <div className="relative flex items-center justify-between">
          {STAGES.map((stage, index) => {
            const isActive = activeStages.has(index)
            const packetsAtStage = packets.filter(p => p.stage === index)

            return (
              <div key={stage.id} className="flex flex-col items-center z-10">
                {/* Stage node */}
                <div
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 ${stage.color} ${
                    isActive ? 'scale-110 shadow-lg shadow-current/30' : ''
                  }`}
                >
                  {stage.icon}

                  {/* Packets at this stage */}
                  {packetsAtStage.length > 0 && (
                    <div className="absolute -top-2 -right-2 flex -space-x-1">
                      {packetsAtStage.slice(0, 3).map(packet => (
                        <div
                          key={packet.id}
                          className={`w-4 h-4 rounded-full border-2 border-slate-900 ${
                            packet.hasError ? 'bg-red-500' : 'bg-white'
                          }`}
                        />
                      ))}
                      {packetsAtStage.length > 3 && (
                        <div className="w-4 h-4 rounded-full bg-slate-600 border-2 border-slate-900 flex items-center justify-center text-[8px] text-white">
                          +{packetsAtStage.length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Processing indicator */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/50 animate-ping" />
                  )}
                </div>

                {/* Stage label */}
                <span className="mt-2 text-xs sm:text-sm text-slate-400 font-medium">{stage.name}</span>
              </div>
            )
          })}
        </div>

        {/* Error handler */}
        {errorCount > 0 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-red-400">{errorCount} errors caught</span>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{processedCount}</div>
          <div className="text-sm text-slate-600">Records Processed</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{formatTime(elapsedTime)}</div>
          <div className="text-sm text-slate-600">Elapsed Time</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-red-500">{errorCount}</div>
          <div className="text-sm text-slate-600">Errors Caught</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <Button onClick={handleStart} disabled={processedCount + errorCount >= 20}>
            {processedCount + errorCount >= 20 ? 'Complete!' : 'Run Pipeline'}
          </Button>
        ) : (
          <Button onClick={handleStop} variant="outline">
            Stop
          </Button>
        )}
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
