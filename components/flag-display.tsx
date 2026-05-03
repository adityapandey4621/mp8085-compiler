"use client"

import { useState, useEffect, useRef } from "react"
import { Flag } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FlagDisplayProps {
  flags: Record<string, number>
}

const flagDescriptions: Record<string, string> = {
  Z: "Zero Flag - Set when result is zero",
  S: "Sign Flag - Set when result is negative",
  CY: "Carry Flag - Set when arithmetic overflow occurs",
  P: "Parity Flag - Set when result has even parity",
  AC: "Auxiliary Carry - Set on carry from bit 3 to 4",
}

export default function FlagDisplay({ flags }: FlagDisplayProps) {
  const [changedFlags, setChangedFlags] = useState<Set<string>>(new Set())
  const prevFlags = useRef(flags)

  useEffect(() => {
    const changed = new Set<string>()
    Object.keys(flags).forEach((key) => {
      if (flags[key] !== prevFlags.current[key]) {
        changed.add(key)
      }
    })
    if (changed.size > 0) {
      setChangedFlags(changed)
      setTimeout(() => setChangedFlags(new Set()), 600)
    }
    prevFlags.current = flags
  }, [flags])

  return (
    <div className="rounded-lg bg-[#0a0a0f] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <Flag className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-medium text-gray-300">Status Flags</span>
      </div>

      <div className="p-4">
        <TooltipProvider>
          <div className="flex items-center justify-between gap-2">
            {Object.entries(flags).map(([flag, value]) => (
              <Tooltip key={flag}>
                <TooltipTrigger asChild>
                  <div
                    className={`flex-1 p-2 rounded-lg border text-center cursor-help transition-all duration-300 ${
                      changedFlags.has(flag)
                        ? value
                          ? "bg-emerald-500/30 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                          : "bg-gray-500/20 border-gray-500/30"
                        : value
                          ? "bg-emerald-500/20 border-emerald-500/30"
                          : "bg-white/[0.02] border-white/5"
                    }`}
                  >
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{flag}</div>
                    <div
                      className={`w-3 h-3 rounded-full mx-auto transition-all duration-300 ${
                        value ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-gray-600"
                      }`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[#0a0a0f] border-white/10 text-xs max-w-[200px]">
                  {flagDescriptions[flag]}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}
