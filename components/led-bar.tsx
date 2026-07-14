"use client"

import { Lightbulb } from "lucide-react"

interface LEDBarProps {
  value: number
}

export default function LEDBar({ value }: LEDBarProps) {
  // Convert value to 8-bit binary array
  const bits = Array.from({ length: 8 }, (_, i) => ((value >> (7 - i)) & 1) === 1)

  return (
    <div className="bg-background/90 border border-border rounded-2xl overflow-hidden backdrop-blur-xl animate-scale-in">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-[#0d0d12]">
        <Lightbulb className="w-4 h-4 text-[#2AFFAE]" />
        <span className="text-xs text-gray-400">LED Output (Port 01H)</span>
      </div>

      {/* LED Bar */}
      <div className="flex justify-center items-center gap-2 p-4">
        {bits.map((on, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-5 h-5 rounded-full border border-[#2a2a2a] transition-all duration-200 ${
                on ? "bg-[#2AFFAE] shadow-[0_0_12px_#2AFFAE,0_0_24px_#2AFFAE50]" : "bg-[#1a1a1a]"
              }`}
            />
            <span className="text-[8px] text-gray-600 font-mono">{7 - i}</span>
          </div>
        ))}
      </div>

      {/* Value Display */}
      <div className="text-center pb-3">
        <span className="font-mono text-xs text-[#4A90E2]">
          {value.toString(16).toUpperCase().padStart(2, "0")}H = {value.toString(2).padStart(8, "0")}B
        </span>
      </div>
    </div>
  )
}

