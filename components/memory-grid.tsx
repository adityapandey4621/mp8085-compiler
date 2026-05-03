"use client"

import { useRef } from "react"
import { HardDrive } from "lucide-react"

interface MemoryGridProps {
  memory: string[]
  currentPC: number
}

export default function MemoryGrid({ memory, currentPC }: MemoryGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const baseAddress = 0x2000
  const rowCount = 16
  const colCount = 16

  // Create rows of memory
  const rows = Array.from({ length: rowCount }, (_, rowIdx) => ({
    address: (baseAddress + rowIdx * colCount).toString(16).toUpperCase().padStart(4, "0"),
    cells: memory.slice(rowIdx * colCount, (rowIdx + 1) * colCount),
  }))

  const isCurrentAddress = (rowIdx: number, colIdx: number) => {
    const addr = baseAddress + rowIdx * colCount + colIdx
    return addr === currentPC
  }

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

      <div ref={scrollRef} className="flex-1 overflow-auto p-2">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[10px] text-gray-500 font-mono font-normal p-1 text-left sticky top-0 bg-[#0a0a0f]">
                Addr
              </th>
              {Array.from({ length: colCount }, (_, i) => (
                <th
                  key={i}
                  className="text-[10px] text-gray-500 font-mono font-normal p-1 text-center sticky top-0 bg-[#0a0a0f]"
                >
                  {i.toString(16).toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={row.address}>
                <td className="text-[10px] text-gray-500 font-mono p-1">{row.address}</td>
                {row.cells.map((cell, colIdx) => (
                  <td
                    key={colIdx}
                    className={`text-xs font-mono p-1 text-center transition-all duration-200 ${
                      isCurrentAddress(rowIdx, colIdx)
                        ? "bg-blue-500/30 text-blue-300 rounded border border-blue-500/50 shadow-[0_0_8px_rgba(74,144,226,0.4)]"
                        : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
