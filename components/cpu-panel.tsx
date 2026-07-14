"use client"

import { useState, useEffect, useRef } from "react"
import { Cpu, Flag, Activity } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Panel from "./panel"

interface CPUPanelProps {
  registers: Record<string, string>
  flags: Record<string, number>
  isRunning?: boolean
  isAssembled?: boolean
  currentInstruction?: string
}

const flagDescriptions: Record<string, string> = {
  Z: "Zero — set when result is zero",
  S: "Sign — set when result is negative",
  CY: "Carry — set on arithmetic overflow",
  P: "Parity — set when result has even parity",
  AC: "Aux Carry — set on carry from bit 3→4",
}

export default function CPUPanel({
  registers,
  flags,
  isRunning = false,
  isAssembled = false,
  currentInstruction,
}: CPUPanelProps) {
  const [changedRegs, setChangedRegs] = useState<Set<string>>(new Set())
  const [changedFlags, setChangedFlags] = useState<Set<string>>(new Set())
  const prevRegs = useRef(registers)
  const prevFlags = useRef(flags)

  // Detect register changes and flash
  useEffect(() => {
    const changed = new Set<string>()
    Object.keys(registers).forEach((key) => {
      if (registers[key] !== prevRegs.current[key]) changed.add(key)
    })
    if (changed.size > 0) {
      setChangedRegs(changed)
      setTimeout(() => setChangedRegs(new Set()), 700)
    }
    prevRegs.current = registers
  }, [registers])

  // Detect flag changes and flash
  useEffect(() => {
    const changed = new Set<string>()
    Object.keys(flags).forEach((key) => {
      if (flags[key] !== prevFlags.current[key]) changed.add(key)
    })
    if (changed.size > 0) {
      setChangedFlags(changed)
      setTimeout(() => setChangedFlags(new Set()), 700)
    }
    prevFlags.current = flags
  }, [flags])

  const mainRegs = ["A", "B", "C", "D", "E", "H", "L"]
  const specialRegs = ["PC", "SP"]

  return (
    <div className="flex flex-col gap-3">
      {/* Execution Status Strip */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border">
        <div
          className={`w-2 h-2 rounded-full shrink-0 transition-all duration-300 ${
            isRunning
              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
              : isAssembled
              ? "bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.5)]"
              : "bg-gray-600"
          }`}
        />
        <span className="text-[11px] font-medium text-gray-400 flex-1 truncate">
          {isRunning
            ? "Running…"
            : isAssembled
            ? currentInstruction
              ? `PC: ${registers.PC} — ${currentInstruction}`
              : `PC: ${registers.PC} — Ready`
            : "Not assembled"}
        </span>
        <span className="font-mono text-[10px] text-gray-600 shrink-0">
          SP: {registers.SP}
        </span>
      </div>

      {/* CPU Registers Panel */}
      <Panel title="CPU Registers" icon={Cpu} color="blue" noPadding>
        <div className="p-3 space-y-3">
          {/* Main Registers — 4 per row */}
          <div className="grid grid-cols-4 gap-1.5">
            {mainRegs.map((reg) => (
              <div
                key={reg}
                className={`p-2 rounded-lg border text-center transition-all duration-300 ${
                  changedRegs.has(reg)
                    ? "bg-blue-500/20 border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.35)]"
                    : "bg-muted/50 border-border"
                }`}
              >
                <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">{reg}</div>
                <div
                  className={`font-mono text-base font-semibold leading-none transition-colors ${
                    changedRegs.has(reg) ? "text-blue-300" : "text-white"
                  }`}
                >
                  {registers[reg]}
                </div>
              </div>
            ))}
          </div>

          {/* Special Registers — PC + SP full width */}
          <div className="grid grid-cols-2 gap-1.5">
            {specialRegs.map((reg) => (
              <div
                key={reg}
                className={`p-2.5 rounded-lg border flex items-center justify-between transition-all duration-300 ${
                  changedRegs.has(reg)
                    ? "bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                    : "bg-muted/50 border-border"
                }`}
              >
                <div className="text-[9px] text-gray-500 uppercase tracking-wider">
                  {reg === "PC" ? "Program Counter" : "Stack Pointer"}
                </div>
                <div
                  className={`font-mono text-lg font-bold transition-colors ${
                    changedRegs.has(reg) ? "text-cyan-300" : "text-white"
                  }`}
                >
                  {registers[reg]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Status Flags Panel */}
      <Panel title="Status Flags" icon={Flag} color="emerald" noPadding>
        <div className="p-3">
          <TooltipProvider>
            <div className="flex items-stretch gap-1.5">
              {Object.entries(flags).map(([flag, value]) => (
                <Tooltip key={flag}>
                  <TooltipTrigger asChild>
                    <div
                      className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg border cursor-help transition-all duration-300 ${
                        changedFlags.has(flag)
                          ? value
                            ? "bg-emerald-500/30 border-emerald-500/60 shadow-[0_0_14px_rgba(16,185,129,0.4)]"
                            : "bg-gray-500/20 border-gray-500/30"
                          : value
                          ? "bg-emerald-500/15 border-emerald-500/30"
                          : "bg-muted/50 border-border"
                      }`}
                    >
                      <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">{flag}</div>
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          value
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                            : "bg-gray-700"
                        }`}
                      />
                      <div
                        className={`font-mono text-xs font-bold mt-1 ${
                          value ? "text-emerald-300" : "text-gray-600"
                        }`}
                      >
                        {value}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-background border-border/60 text-xs max-w-[180px]"
                  >
                    {flagDescriptions[flag]}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </Panel>
    </div>
  )
}

