"use client"

import { useRef, useEffect } from "react"
import { HardDrive } from "lucide-react"

interface MemoryGridProps {
  memory: Uint8Array
  currentPC: number
}

export default function MemoryGrid({ memory, currentPC }: MemoryGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRowRef = useRef<HTMLTableRowElement>(null)
  
  const colCount = 16
  
  // Calculate a smaller safe 16-row window around the currentPC (256 bytes)
  const pcRow = Math.floor(currentPC / colCount)
  const startRow = Math.max(0, pcRow - 8)
  const endRow = Math.min(4095, startRow + 15)
  
  const rows = []
  for (let r = startRow; r <= endRow; r++) {
    const baseAddr = r * colCount
    rows.push({
      address: baseAddr.toString(16).toUpperCase().padStart(4, "0"),
      cells: Array.from({ length: colCount }, (_, i) => {
        const val = memory[baseAddr + i] || 0
        return val.toString(16).toUpperCase().padStart(2, "0")
      }),
      isPcRow: r === pcRow,
      baseAddr
    })
  }

  // Smooth scroll to active row
  useEffect(() => {
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [currentPC])

  const isCurrentAddress = (addr: number) => addr === currentPC

  return (
    <div className="flex-1 rounded-lg bg-[#0a0a0f] border border-white/5 overflow-hidden flex flex-col min-h-[300px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <HardDrive className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-gray-300">Memory Map</span>
        <span className="ml-auto text-xs text-gray-500 font-mono">
          PC: {currentPC.toString(16).toUpperCase().padStart(4, "0")}H
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 scroll-smooth">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[10px] text-gray-500 font-mono font-normal p-1 text-left sticky top-0 bg-[#0a0a0f] z-10 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                Addr
              </th>
              {Array.from({ length: colCount }, (_, i) => (
                <th
                  key={i}
                  className="text-[10px] text-gray-500 font-mono font-normal p-1 text-center sticky top-0 bg-[#0a0a0f] z-10 shadow-[0_1px_0_rgba(255,255,255,0.05)]"
                >
                  {i.toString(16).toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.address} ref={row.isPcRow ? activeRowRef : null}>
                <td className="text-[10px] text-gray-500 font-mono p-1">{row.address}</td>
                {row.cells.map((cell, colIdx) => {
                  const addr = row.baseAddr + colIdx
                  const active = isCurrentAddress(addr)
                  return (
                    <td
                      key={colIdx}
                      className={`text-xs font-mono p-1 text-center transition-all duration-200 ${
                        active
                          ? "bg-cyan-500/30 text-cyan-300 rounded border border-cyan-500/50 shadow-[0_0_8px_rgba(34,211,238,0.4)] relative z-0"
                          : "text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      {cell}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
