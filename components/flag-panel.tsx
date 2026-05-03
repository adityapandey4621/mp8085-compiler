"use client"

import { Flag } from "lucide-react"

interface FlagPanelProps {
  flags: Record<string, number>
}

const flagConfig = [
  { name: "Z", label: "Zero" },
  { name: "S", label: "Sign" },
  { name: "CY", label: "Carry" },
  { name: "P", label: "Parity" },
  { name: "AC", label: "Aux Carry" },
]

export default function FlagPanel({ flags }: FlagPanelProps) {
  return (
    <div className="bg-[#0a0a0f]/90 border border-[#1a1a2e] rounded-2xl overflow-hidden backdrop-blur-xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a2e] bg-[#0d0d12]">
        <Flag className="w-4 h-4 text-[#2AFFAE]" />
        <span className="text-sm font-medium text-white">Status Flags</span>
      </div>

      {/* Flag LEDs */}
      <div className="flex justify-around p-4">
        {flagConfig.map((flag) => {
          const isOn = flags[flag.name] === 1
          return (
            <div key={flag.name} className="flex flex-col items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  isOn
                    ? "bg-[#2AFFAE] border-[#2AFFAE] shadow-[0_0_15px_#2AFFAE,0_0_30px_#2AFFAE50]"
                    : "bg-[#1a1a1a] border-[#2a2a2a]"
                }`}
              />
              <span className="text-xs font-mono text-[#00F5FF]">{flag.name}</span>
              <span className="text-[9px] text-gray-600">{flag.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
