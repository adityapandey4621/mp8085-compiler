"use client"

import { useRef, useEffect } from "react"
import { Terminal } from "lucide-react"

interface ConsolePanelProps {
  logs: string[]
}

export default function ConsolePanel({ logs }: ConsolePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getLogColor = (log: string) => {
    if (log.includes("[ERROR]")) return "text-red-400"
    if (log.includes("[ASM]")) return "text-amber-400"
    if (log.includes("[RUN]")) return "text-emerald-400"
    if (log.includes("[STEP]")) return "text-blue-400"
    if (log.includes("[RESET]")) return "text-purple-400"
    return "text-gray-400"
  }

  return (
    <div className="h-full w-full rounded-lg bg-background border border-border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/50">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-medium text-gray-300">Console</span>
      </div>

      {/* Logs */}
      <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className={`font-mono text-xs leading-5 ${getLogColor(log)}`}>
            {log}
          </div>
        ))}
        <span className="inline-block w-2 h-4 bg-emerald-400 animate-blink" />
      </div>
    </div>
  )
}

