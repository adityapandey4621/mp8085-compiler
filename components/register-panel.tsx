"use client"

import { Cpu } from "lucide-react"

interface RegisterPanelProps {
  registers: Record<string, string>
}

const registerConfig = [
  { name: "A", label: "Accumulator", span: 2 },
  { name: "B", label: "Register B", span: 1 },
  { name: "C", label: "Register C", span: 1 },
  { name: "D", label: "Register D", span: 1 },
  { name: "E", label: "Register E", span: 1 },
  { name: "H", label: "Register H", span: 1 },
  { name: "L", label: "Register L", span: 1 },
  { name: "PC", label: "Program Counter", span: 2 },
  { name: "SP", label: "Stack Pointer", span: 2 },
]

export default function RegisterPanel({ registers }: RegisterPanelProps) {
  return (
    <div className="bg-background/90 border border-border rounded-2xl overflow-hidden backdrop-blur-xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-[#0d0d12]">
        <div className="relative">
          <div className="absolute inset-0 bg-[#00F5FF] blur-md opacity-40" />
          <Cpu className="w-5 h-5 text-[#00F5FF] relative" />
        </div>
        <span className="text-sm font-medium text-foreground">CPU Registers</span>
      </div>

      {/* Register Grid */}
      <div className="grid grid-cols-4 gap-2 p-4">
        {registerConfig.map((reg) => (
          <div
            key={reg.name}
            className={`bg-[#0d0d15] border border-border rounded-xl p-3 relative overflow-hidden transition-transform duration-200 hover:scale-[1.02] ${
              reg.span === 2 ? "col-span-2" : ""
            }`}
            style={{
              boxShadow: "inset 0 0 20px rgba(0, 245, 255, 0.05)",
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/5 to-transparent" />

            <div className="relative">
              <span className="text-[10px] text-[#00F5FF] tracking-wider uppercase">{reg.name}</span>
              <div
                className="font-mono text-2xl font-bold text-foreground mt-1 transition-all duration-200"
                style={{
                  textShadow: "0 0 10px rgba(0, 245, 255, 0.5)",
                }}
              >
                {registers[reg.name]}
                <span className="text-[#4A90E2]/50 text-sm ml-1">H</span>
              </div>
              <span className="text-[9px] text-muted-foreground/70">{reg.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

