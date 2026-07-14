"use client"

import { BarChart3 } from "lucide-react"

interface StatisticsDisplayProps {
  stats: {
    clockCycles: number
    instructionsExecuted: number
    memoryReads: number
    memoryWrites: number
    stackOps: number
  }
}

export default function StatisticsDisplay({ stats }: StatisticsDisplayProps) {
  const statItems = [
    { label: "Clock Cycles", value: stats.clockCycles },
    { label: "Inst. Executed", value: stats.instructionsExecuted },
    { label: "Memory Reads", value: stats.memoryReads },
    { label: "Memory Writes", value: stats.memoryWrites },
    { label: "Stack Ops", value: stats.stackOps },
  ]

  return (
    <div className="rounded-lg bg-background border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
        <BarChart3 className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-foreground">Statistics</span>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2">
        {statItems.map((item, idx) => (
          <div key={idx} className="bg-muted/50 border border-border rounded p-2 flex flex-col items-center justify-center">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-center">{item.label}</span>
            <span className="font-mono text-base font-semibold text-foreground mt-1">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

