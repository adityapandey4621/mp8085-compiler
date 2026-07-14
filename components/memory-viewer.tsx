"use client"

import { useRef } from "react"
import { Database, Search } from "lucide-react"

interface MemoryViewerProps {
  memory: string[]
  currentPC: number
}

export default function MemoryViewer({ memory, currentPC }: MemoryViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Create rows of 16 bytes
  const rows = []
  for (let i = 0; i < Math.min(memory.length, 256); i += 16) {
    rows.push({
      address: i,
      bytes: memory.slice(i, i + 16),
    })
  }

  const currentRow = Math.floor((currentPC - 0x2000) / 16)

  return (
    <div className="bg-background/90 border border-border rounded-2xl overflow-hidden backdrop-blur-xl flex-1 flex flex-col animate-slide-left">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[#0d0d12]">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#4A90E2]" />
          <span className="text-sm font-medium text-white">Memory Viewer</span>
        </div>
        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-2 py-1">
          <Search className="w-3 h-3 text-gray-500" />
          <input
            type="text"
            placeholder="Go to address..."
            className="bg-transparent text-xs text-white w-24 focus:outline-none placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Header Row */}
      <div className="flex px-4 py-2 border-b border-border bg-[#0d0d12]/50 text-[10px] text-gray-500 font-mono">
        <span className="w-16">ADDR</span>
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className="w-6 text-center">
            {i.toString(16).toUpperCase()}
          </span>
        ))}
      </div>

      {/* Memory Grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-[300px]">
        {rows.map((row, rowIdx) => {
          const isCurrentRow = rowIdx === currentRow
          return (
            <div
              key={row.address}
              className={`flex px-4 py-1 font-mono text-xs border-b border-[#0a0a0f] transition-colors duration-200 ${
                isCurrentRow ? "bg-[#00F5FF]/10" : rowIdx % 2 === 0 ? "bg-background/30" : ""
              }`}
            >
              <span className="w-16 text-[#4A90E2]">
                {(0x2000 + row.address).toString(16).toUpperCase().padStart(4, "0")}
              </span>
              {row.bytes.map((byte, byteIdx) => {
                const addr = row.address + byteIdx
                const isPC = 0x2000 + addr === currentPC
                return (
                  <span
                    key={byteIdx}
                    className={`w-6 text-center transition-all duration-200 ${
                      isPC ? "text-[#00F5FF]" : "text-gray-500"
                    }`}
                    style={{
                      textShadow: isPC ? "0 0 10px #00F5FF" : "none",
                    }}
                  >
                    {byte}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

