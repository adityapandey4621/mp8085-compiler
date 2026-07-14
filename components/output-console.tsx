"use client"

import { useEffect, useRef } from "react"
import { Terminal } from "lucide-react"

interface OutputConsoleProps {
  logs: string[]
}

export default function OutputConsole({ logs }: OutputConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="bg-background/90 border border-border rounded-2xl overflow-hidden backdrop-blur-xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-[#0d0d12]">
        <Terminal className="w-4 h-4 text-[#2AFFAE]" />
        <span className="text-sm text-muted-foreground">Output Console</span>
      </div>

      {/* Console Body */}
      <div ref={scrollRef} className="h-[150px] overflow-y-auto p-4 font-mono text-xs">
        {logs.map((log, i) => (
          <div
            key={i}
            className={`leading-5 animate-slide-right ${
              log.includes("[ERROR]")
                ? "text-red-400"
                : log.includes("[ASM]")
                  ? "text-[#4A90E2]"
                  : log.includes("[RUN]")
                    ? "text-[#2AFFAE]"
                    : log.includes("[STEP]")
                      ? "text-[#00F5FF]"
                      : log.includes("[RESET]")
                        ? "text-[#A66CFF]"
                        : "text-muted-foreground"
            }`}
          >
            <span className="text-muted-foreground/70 mr-2">{String(i + 1).padStart(2, "0")}</span>
            {log}
          </div>
        ))}
        <div className="flex items-center mt-1">
          <span className="text-[#2AFFAE] mr-1">{">"}</span>
          <span className="w-2 h-4 bg-[#2AFFAE] animate-blink" />
        </div>
      </div>
    </div>
  )
}

