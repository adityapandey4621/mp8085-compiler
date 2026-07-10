"use client"

import { Eye, Plus } from "lucide-react"

interface WatchWindowProps {
  registers: any
  memory: any
}

export default function WatchWindow({ registers, memory }: WatchWindowProps) {
  // We'll hardcode the ones from the screenshot for now to match exactly, 
  // but hook them up to real values.
  const aVal = registers.A
  const bcVal = `${registers.B}${registers.C}`
  
  // Read memory at 2050H
  const mem2050 = memory ? memory[0x2050] : 0
  const mem2050Hex = mem2050 !== undefined ? mem2050.toString(16).toUpperCase().padStart(2, "0") : "00"

  const watches = [
    { label: "A", value: `${aVal}H` },
    { label: "BC", value: `${bcVal}H` },
    { label: "2050H", value: `${mem2050Hex}H` },
  ]

  return (
    <div className="shrink-0 rounded-lg bg-[#0a0a0f] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-300">Watch Window</span>
        </div>
        <Plus className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer" />
      </div>

      <div className="p-2 space-y-1">
        {watches.map((watch, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between px-3 py-1.5 rounded text-xs font-mono border bg-white/[0.02] border-white/5 text-gray-400"
          >
            <span className="text-white/80">{watch.label}</span>
            <span className="text-white font-semibold">{watch.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
