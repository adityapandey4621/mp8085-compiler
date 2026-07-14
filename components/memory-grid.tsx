"use client"

import { useRef, useEffect, useState } from "react"
import { HardDrive } from "lucide-react"

interface MemoryGridProps {
  memory: Uint8Array
  currentPC: number
  lastMemoryAccess?: number | null
}

export default function MemoryGrid({ memory, currentPC, lastMemoryAccess }: MemoryGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRowRef = useRef<HTMLTableRowElement>(null)
  const [baseAddress, setBaseAddress] = useState(0)
  const [inputVal, setInputVal] = useState("0000")
  
  const colCount = 16
  
  // Sync baseAddress with lastMemoryAccess or PC during execution, but allow manual jumping
  useEffect(() => {
    if (lastMemoryAccess !== undefined && lastMemoryAccess !== null) {
      setBaseAddress(lastMemoryAccess)
    } else {
      setBaseAddress(currentPC)
    }
  }, [currentPC, lastMemoryAccess])

  // Calculate a safe 16-row window (256 bytes) around baseAddress
  const activeAddress = (lastMemoryAccess !== undefined && lastMemoryAccess !== null) ? lastMemoryAccess : currentPC
  const pcRow = Math.floor(activeAddress / colCount)
  const baseRow = Math.floor(baseAddress / colCount)
  const startRow = Math.max(0, baseRow - 8)
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

  const lastScrollTime = useRef<number>(0)

  // Smooth scroll to active row with throttling to allow the glide to complete
  useEffect(() => {
    if (activeRowRef.current) {
      const now = Date.now()
      if (now - lastScrollTime.current > 150) {
        activeRowRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        lastScrollTime.current = now
      }
    }
  }, [currentPC, lastMemoryAccess])

  const isCurrentAddress = (addr: number) => {
    if (lastMemoryAccess !== undefined && lastMemoryAccess !== null) {
       return addr === lastMemoryAccess
    }
    return addr === currentPC
  }

  const handleJump = () => {
    const addr = parseInt(inputVal, 16)
    if (!isNaN(addr) && addr >= 0 && addr <= 0xFFFF) {
      setBaseAddress(addr)
    }
  }

  return (
    <div className="flex-1 rounded-lg bg-background border border-border overflow-hidden flex flex-col min-h-[300px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
        <HardDrive className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="text-sm font-medium text-foreground">Memory Map</span>
        <div className="ml-auto flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 4))}
            onKeyDown={(e) => e.key === 'Enter' && handleJump()}
            className="w-16 bg-muted/50 border border-border/60 rounded px-2 py-0.5 text-amber-600 dark:text-amber-400 font-mono text-xs focus:outline-none focus:border-amber-500/50"
            placeholder="ADDR"
          />
          <button
            onClick={handleJump}
            className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-400 rounded text-[10px] font-semibold transition-colors"
          >
            Go
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 scroll-smooth">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[10px] text-muted-foreground font-mono font-normal p-1 text-left sticky top-0 bg-background z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:border-b after:border-border">
                Addr
              </th>
              {Array.from({ length: colCount }, (_, i) => (
                <th
                  key={i}
                  className="text-[10px] text-muted-foreground font-mono font-normal p-1 text-center sticky top-0 bg-background z-10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:border-b after:border-border"
                >
                  {i.toString(16).toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.address} ref={row.isPcRow ? activeRowRef : null}>
                <td className="text-[10px] text-muted-foreground font-mono p-1">{row.address}</td>
                {row.cells.map((cell, colIdx) => {
                  const addr = row.baseAddr + colIdx
                  const active = isCurrentAddress(addr)
                  return (
                    <td
                      key={colIdx}
                      className={`text-xs font-mono p-1 text-center transition-all duration-200 ${
                        active
                          ? "bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 rounded border border-cyan-500/50 shadow-[0_0_8px_rgba(34,211,238,0.4)] relative z-0"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
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

