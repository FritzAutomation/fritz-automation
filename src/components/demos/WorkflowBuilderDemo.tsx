'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

interface WorkflowNode {
  id: string
  type: NodeType
  x: number
  y: number
  label: string
}

interface Connection {
  from: string
  to: string
}

type NodeType = 'source' | 'transform' | 'filter' | 'merge' | 'output'

interface NodeConfig {
  type: NodeType
  label: string
  icon: string
  color: string
  description: string
}

const NODE_CONFIGS: NodeConfig[] = [
  { type: 'source', label: 'Source', icon: '📁', color: 'bg-blue-500', description: 'Data input source' },
  { type: 'transform', label: 'Transform', icon: '⚙️', color: 'bg-purple-500', description: 'Modify data' },
  { type: 'filter', label: 'Filter', icon: '🔍', color: 'bg-yellow-500', description: 'Filter records' },
  { type: 'merge', label: 'Merge', icon: '🔗', color: 'bg-orange-500', description: 'Combine data' },
  { type: 'output', label: 'Output', icon: '💾', color: 'bg-green-500', description: 'Save results' },
]

export function WorkflowBuilderDemo() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [draggingType, setDraggingType] = useState<NodeType | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [simulating, setSimulating] = useState(false)
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set())
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set())
  const [simulationComplete, setSimulationComplete] = useState(false)

  // Handle drop on canvas
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!draggingType) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - 40
    const y = e.clientY - rect.top - 30

    const config = NODE_CONFIGS.find(c => c.type === draggingType)
    if (!config) return

    const newNode: WorkflowNode = {
      id: `${draggingType}-${Date.now()}`,
      type: draggingType,
      x: Math.max(0, Math.min(x, rect.width - 80)),
      y: Math.max(0, Math.min(y, rect.height - 60)),
      label: config.label,
    }

    setNodes(prev => [...prev, newNode])
    setDraggingType(null)
  }, [draggingType])

  // Handle node click for connections
  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (connectingFrom) {
      if (connectingFrom !== nodeId) {
        // Create connection
        const connectionId = `${connectingFrom}-${nodeId}`
        if (!connections.find(c => c.from === connectingFrom && c.to === nodeId)) {
          setConnections(prev => [...prev, { from: connectingFrom, to: nodeId }])
        }
      }
      setConnectingFrom(null)
    } else {
      setSelectedNode(selectedNode === nodeId ? null : nodeId)
    }
  }

  // Start connecting
  const handleStartConnect = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConnectingFrom(nodeId)
    setSelectedNode(null)
  }

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId))
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId))
    setSelectedNode(null)
  }

  // Simulation logic
  const runSimulation = useCallback(() => {
    setSimulating(true)
    setActiveNodes(new Set())
    setActiveConnections(new Set())
    setSimulationComplete(false)

    // Find source nodes
    const sourceNodes = nodes.filter(n => n.type === 'source')
    if (sourceNodes.length === 0) {
      setSimulating(false)
      return
    }

    // BFS through the graph
    const visited = new Set<string>()
    let currentLevel = sourceNodes.map(n => n.id)
    let step = 0

    const processLevel = () => {
      if (currentLevel.length === 0 || step > 20) {
        setTimeout(() => {
          setSimulating(false)
          setSimulationComplete(true)
        }, 500)
        return
      }

      // Activate current level nodes
      setActiveNodes(new Set(currentLevel))

      // Find outgoing connections
      const outgoingConnections = connections.filter(c => currentLevel.includes(c.from))
      setActiveConnections(new Set(outgoingConnections.map(c => `${c.from}-${c.to}`)))

      // Mark as visited
      currentLevel.forEach(id => visited.add(id))

      // Find next level
      const nextLevel = outgoingConnections
        .map(c => c.to)
        .filter(id => !visited.has(id))
        .filter((id, index, arr) => arr.indexOf(id) === index)

      currentLevel = nextLevel
      step++

      setTimeout(processLevel, 800)
    }

    processLevel()
  }, [nodes, connections])

  // Clear canvas
  const handleClear = () => {
    setNodes([])
    setConnections([])
    setSelectedNode(null)
    setConnectingFrom(null)
    setSimulating(false)
    setActiveNodes(new Set())
    setActiveConnections(new Set())
    setSimulationComplete(false)
  }

  // Get node position for SVG line
  const getNodeCenter = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return { x: 0, y: 0 }
    return { x: node.x + 40, y: node.y + 30 }
  }

  const getNodeConfig = (type: NodeType) => NODE_CONFIGS.find(c => c.type === type)

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
        <strong>How to use:</strong> Drag nodes from the sidebar to the canvas. Click a node, then click another to connect them. Click &quot;Simulate&quot; to watch data flow through your workflow.
      </div>

      <div className="flex gap-4">
        {/* Sidebar with node types */}
        <div className="w-32 flex-shrink-0">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Components</h4>
          <div className="space-y-2">
            {NODE_CONFIGS.map(config => (
              <div
                key={config.type}
                draggable
                onDragStart={() => setDraggingType(config.type)}
                onDragEnd={() => setDraggingType(null)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-grab active:cursor-grabbing border-2 border-transparent hover:border-slate-300 transition-all ${config.color} bg-opacity-10`}
              >
                <span className="text-xl">{config.icon}</span>
                <div>
                  <div className="text-sm font-medium text-slate-800">{config.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          className={`flex-1 h-[400px] bg-slate-900 rounded-xl relative overflow-hidden border-2 transition-colors ${
            draggingType ? 'border-primary border-dashed' : 'border-slate-700'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => {
            setSelectedNode(null)
            setConnectingFrom(null)
          }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map(conn => {
              const from = getNodeCenter(conn.from)
              const to = getNodeCenter(conn.to)
              const isActive = activeConnections.has(`${conn.from}-${conn.to}`)

              return (
                <g key={`${conn.from}-${conn.to}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isActive ? '#22c55e' : '#64748b'}
                    strokeWidth={isActive ? 3 : 2}
                    strokeDasharray={isActive ? undefined : '5,5'}
                    className="transition-all duration-300"
                  />
                  {/* Arrow */}
                  <circle
                    cx={to.x}
                    cy={to.y}
                    r={4}
                    fill={isActive ? '#22c55e' : '#64748b'}
                  />
                </g>
              )
            })}

            {/* Connecting line preview */}
            {connectingFrom && (
              <line
                x1={getNodeCenter(connectingFrom).x}
                y1={getNodeCenter(connectingFrom).y}
                x2={getNodeCenter(connectingFrom).x + 50}
                y2={getNodeCenter(connectingFrom).y}
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const config = getNodeConfig(node.type)
            const isActive = activeNodes.has(node.id)
            const isSelected = selectedNode === node.id
            const isConnecting = connectingFrom === node.id

            return (
              <div
                key={node.id}
                className={`absolute w-20 h-16 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  config?.color
                } ${
                  isActive ? 'scale-110 shadow-lg shadow-green-500/50 ring-2 ring-green-400' :
                  isSelected ? 'ring-2 ring-white' :
                  isConnecting ? 'ring-2 ring-emerald-400' : ''
                }`}
                style={{ left: node.x, top: node.y }}
                onClick={(e) => handleNodeClick(node.id, e)}
              >
                <span className="text-2xl">{config?.icon}</span>
                <span className="text-xs text-white font-medium">{node.label}</span>

                {/* Connection button */}
                <button
                  onClick={(e) => handleStartConnect(node.id, e)}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center text-xs hover:scale-110 transition-transform"
                  title="Connect to another node"
                >
                  →
                </button>

                {/* Delete button (when selected) */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteNode(node.id)
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white rounded-full text-xs hover:bg-emerald-600 transition-colors"
                  >
                    ×
                  </button>
                )}

                {/* Processing indicator */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-green-400/30 animate-ping" />
                )}
              </div>
            )
          })}

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <div className="text-4xl mb-2">👆</div>
                <div>Drag components here to build your workflow</div>
              </div>
            </div>
          )}

          {/* Simulation complete indicator */}
          {simulationComplete && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium animate-fade-in">
              ✓ Simulation complete!
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={runSimulation}
          disabled={simulating || nodes.length === 0 || !nodes.some(n => n.type === 'source')}
        >
          {simulating ? 'Simulating...' : 'Simulate'}
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Tips */}
      {connectingFrom && (
        <div className="text-center text-sm text-primary">
          Click another node to create a connection, or click the canvas to cancel
        </div>
      )}
    </div>
  )
}
