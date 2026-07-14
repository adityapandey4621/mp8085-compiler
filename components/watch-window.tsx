"use client"

import { useState } from "react"
import { Eye, Plus, X } from "lucide-react"

interface WatchWindowProps {
  registers: any
  memory: any
}

export default function WatchWindow({ registers, memory }: WatchWindowProps) {
  const [expressions, setExpressions] = useState<string[]>(["A", "BC", "2050H"])
  const [isAdding, setIsAdding] = useState(false)
  const [newWatch, setNewWatch] = useState("")

  const evaluateWatch = (expr: string) => {
    const e = expr.toUpperCase().trim()
    
    // Register
    if (["A", "B", "C", "D", "E", "H", "L", "PC", "SP"].includes(e)) {
      const val = registers[e]
      return val !== undefined ? `${val}` : "??H"
    }
    
    // Register Pair
    if (e === "BC") return `${registers.B || "00"}${registers.C || "00"}`
    if (e === "DE") return `${registers.D || "00"}${registers.E || "00"}`
    if (e === "HL") return `${registers.H || "00"}${registers.L || "00"}`

    // Memory location (e.g., "2050H" or "2050")
    let memAddrStr = e
    if (memAddrStr.endsWith("H")) {
      memAddrStr = memAddrStr.slice(0, -1)
    }
    const addr = parseInt(memAddrStr, 16)
    if (!isNaN(addr) && addr >= 0 && addr <= 0xFFFF) {
      const val = memory ? memory[addr] : 0
      return `${(val || 0).toString(16).toUpperCase().padStart(2, "0")}H`
    }

    return "??H"
  }

  const handleAdd = () => {
    if (newWatch.trim()) {
      setExpressions(prev => [...prev, newWatch.trim()])
    }
    setNewWatch("")
    setIsAdding(false)
  }

  const handleRemove = (idx: number) => {
    setExpressions(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="shrink-0 rounded-lg bg-background border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-300">Watch Window</span>
        </div>
        <Plus 
          className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer" 
          onClick={() => setIsAdding(true)}
        />
      </div>

      <div className="p-2 space-y-1">
        {expressions.map((expr, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between px-3 py-1.5 rounded text-xs font-mono border bg-muted/50 border-border text-gray-400 group"
          >
            <span className="text-white/80">{expr}</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">{evaluateWatch(expr)}</span>
              <X 
                className="w-3 h-3 text-gray-600 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={() => handleRemove(idx)}
              />
            </div>
          </div>
        ))}
        
        {isAdding && (
          <div className="flex items-center px-2 py-1 bg-white/[0.05] rounded border border-border/60">
            <input
              autoFocus
              type="text"
              value={newWatch}
              onChange={(e) => setNewWatch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd()
                if (e.key === 'Escape') {
                  setIsAdding(false)
                  setNewWatch("")
                }
              }}
              onBlur={() => {
                if(newWatch.trim()) handleAdd()
                else setIsAdding(false)
              }}
              placeholder="e.g. A, HL, 2050H"
              className="bg-transparent w-full text-xs font-mono text-white outline-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}

