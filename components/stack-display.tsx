"use client"

import { useRef, useEffect } from "react"
import { Database } from "lucide-react"

interface StackDisplayProps {
  memory: Uint8Array
  sp: string
}

export default function StackDisplay({ memory, sp }: StackDisplayProps) {
  const activeRowRef = useRef<HTMLDivElement>(null)
  const spVal = parseInt(sp, 16) || 0xFFFF
  
  // Show a 32-byte window around SP so scrolling is visible
  const startAddr = Math.max(0, spVal - 16)
  const endAddr = Math.min(0xFFFF, startAddr + 32)
  
  const stackItems = []
  for (let addr = startAddr; addr <= endAddr; addr++) {
    const val = memory[addr]
    stackItems.push({
      address: addr,
      value: val,
      isSP: addr === spVal
    })
  }

  // Smooth scroll to SP row
  useEffect(() => {
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [spVal])

  return (
    <div className="rounded-lg bg-[#0a0a0f] border border-white/5 overflow-hidden flex flex-col h-[180px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-gray-300">Stack</span>
        </div>
        <span className="text-xs text-gray-500 font-mono">SP:{sp}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 scroll-smooth">
        {stackItems.map((item, idx) => (
          <div 
            key={idx}
            ref={item.isSP ? activeRowRef : null}
            className={`flex items-center justify-between px-3 py-1.5 rounded text-xs font-mono border transition-all duration-300 ${
              item.isSP 
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] z-10 relative scale-[1.02]" 
                : "bg-white/[0.02] border-white/5 text-gray-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{item.address.toString(16).toUpperCase().padStart(4, "0")}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={item.isSP ? "text-emerald-300 font-bold" : "text-white/80"}>
                {item.value.toString(16).toUpperCase().padStart(2, "0")}
              </span>
              {item.isSP && <span className="text-[10px] text-emerald-500 font-sans font-bold uppercase">&larr; SP</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
