"use client"

import { useState, useEffect } from "react"
import { Crosshair, ArrowRight } from "lucide-react"

interface ProgramCounterProps {
  pc: string
  onSetPC: (address: number) => void
}

export default function ProgramCounter({ pc, onSetPC }: ProgramCounterProps) {
  const [inputVal, setInputVal] = useState(pc)

  useEffect(() => {
    setInputVal(pc)
  }, [pc])

  const handleJump = () => {
    const addr = parseInt(inputVal, 16)
    if (!isNaN(addr) && addr >= 0 && addr <= 0xFFFF) {
      onSetPC(addr)
    } else {
      setInputVal(pc)
    }
  }

  return (
    <div className="shrink-0 rounded-lg bg-background border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
        <Crosshair className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-foreground">Program Counter</span>
      </div>

      <div className="p-3 flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 4))}
            onKeyDown={(e) => e.key === 'Enter' && handleJump()}
            className="w-full bg-muted/50 border border-border/60 rounded px-3 py-1.5 text-cyan-400 font-mono text-sm focus:outline-none focus:border-cyan-500/50 pr-6"
            placeholder="0000"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">H</span>
        </div>
        <button
          onClick={handleJump}
          className="shrink-0 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <span>Jump</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

