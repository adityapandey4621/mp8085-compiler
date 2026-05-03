"use client"

import { useState, useEffect, useRef } from "react"
import { Cpu } from "lucide-react"

interface RegisterDisplayProps {
  registers: Record<string, string>
}

export default function RegisterDisplay({ registers }: RegisterDisplayProps) {
  const [changedRegs, setChangedRegs] = useState<Set<string>>(new Set())
  const prevRegs = useRef(registers)

  useEffect(() => {
    const changed = new Set<string>()
    Object.keys(registers).forEach((key) => {
      if (registers[key] !== prevRegs.current[key]) {
        changed.add(key)
      }
    })
    if (changed.size > 0) {
      setChangedRegs(changed)
      setTimeout(() => setChangedRegs(new Set()), 600)
    }
    prevRegs.current = registers
  }, [registers])

  const mainRegs = ["A", "B", "C", "D", "E", "H", "L"]
  const specialRegs = ["PC", "SP"]

  return (
    <div className="rounded-lg bg-[#0a0a0f] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <Cpu className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-gray-300">CPU Registers</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Main Registers */}
        <div className="grid grid-cols-4 gap-2">
          {mainRegs.map((reg) => (
            <div
              key={reg}
              className={`p-2 rounded-lg border transition-all duration-300 ${
                changedRegs.has(reg)
                  ? "bg-blue-500/20 border-blue-500/50 shadow-[0_0_12px_rgba(74,144,226,0.3)]"
                  : "bg-white/[0.02] border-white/5"
              }`}
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">{reg}</div>
              <div
                className={`font-mono text-lg font-semibold transition-colors ${
                  changedRegs.has(reg) ? "text-blue-400" : "text-white"
                }`}
              >
                {registers[reg]}
              </div>
            </div>
          ))}
        </div>

        {/* Special Registers */}
        <div className="grid grid-cols-2 gap-2">
          {specialRegs.map((reg) => (
            <div
              key={reg}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                changedRegs.has(reg)
                  ? "bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_12px_rgba(0,245,255,0.3)]"
                  : "bg-white/[0.02] border-white/5"
              }`}
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                {reg === "PC" ? "Program Counter" : "Stack Pointer"}
              </div>
              <div
                className={`font-mono text-xl font-semibold transition-colors ${
                  changedRegs.has(reg) ? "text-cyan-400" : "text-white"
                }`}
              >
                {registers[reg]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
