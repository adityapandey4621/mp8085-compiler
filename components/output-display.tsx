"use client"

import { Monitor } from "lucide-react"

interface OutputDisplayProps {
  ledValue: number
  segmentValue: string
}

export default function OutputDisplay({ ledValue, segmentValue }: OutputDisplayProps) {
  const bits = Array.from({ length: 8 }, (_, i) => (ledValue >> (7 - i)) & 1)

  // 7-segment display patterns
  const segments: Record<string, boolean[]> = {
    "0": [true, true, true, true, true, true, false],
    "1": [false, true, true, false, false, false, false],
    "2": [true, true, false, true, true, false, true],
    "3": [true, true, true, true, false, false, true],
    "4": [false, true, true, false, false, true, true],
    "5": [true, false, true, true, false, true, true],
    "6": [true, false, true, true, true, true, true],
    "7": [true, true, true, false, false, false, false],
    "8": [true, true, true, true, true, true, true],
    "9": [true, true, true, true, false, true, true],
    A: [true, true, true, false, true, true, true],
    B: [false, false, true, true, true, true, true],
    C: [true, false, false, true, true, true, false],
    D: [false, true, true, true, true, false, true],
    E: [true, false, false, true, true, true, true],
    F: [true, false, false, false, true, true, true],
  }

  const getSegments = (char: string) => segments[char.toUpperCase()] || segments["0"]

  return (
    <div className="rounded-lg bg-background border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
        <Monitor className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-gray-300">Output Display</span>
      </div>

      <div className="p-4 space-y-4">
        {/* 7-Segment Display */}
        <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-[#0f0f14] border border-border">
          {segmentValue.split("").map((char, idx) => {
            const segs = getSegments(char)
            return (
              <svg
                key={idx}
                width="32"
                height="48"
                viewBox="0 0 32 48"
                className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              >
                {/* Segment A (top) */}
                <path d="M 6 2 L 26 2 L 24 6 L 8 6 Z" fill={segs[0] ? "#ef4444" : "#1a1a2e"} />
                {/* Segment B (top right) */}
                <path d="M 27 4 L 31 8 L 29 22 L 25 18 L 27 8 Z" fill={segs[1] ? "#ef4444" : "#1a1a2e"} />
                {/* Segment C (bottom right) */}
                <path d="M 25 30 L 29 26 L 27 40 L 23 44 L 21 34 Z" fill={segs[2] ? "#ef4444" : "#1a1a2e"} />
                {/* Segment D (bottom) */}
                <path d="M 6 46 L 8 42 L 24 42 L 26 46 Z" fill={segs[3] ? "#ef4444" : "#1a1a2e"} />
                {/* Segment E (bottom left) */}
                <path d="M 1 40 L 5 44 L 7 34 L 3 30 L 1 26 Z" fill={segs[4] ? "#ef4444" : "#1a1a2e"} />
                {/* Segment F (top left) */}
                <path d="M 3 8 L 5 4 L 9 8 L 7 18 L 3 22 Z" fill={segs[5] ? "#ef4444" : "#1a1a2e"} />
                {/* Segment G (middle) */}
                <path d="M 8 24 L 12 20 L 20 20 L 24 24 L 20 28 L 12 28 Z" fill={segs[6] ? "#ef4444" : "#1a1a2e"} />
              </svg>
            )
          })}
        </div>

        {/* LED Bar */}
        <div className="flex items-center justify-between gap-1.5 p-3 rounded-lg bg-[#0f0f14] border border-border">
          {bits.map((bit, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full transition-all duration-200 ${
                  bit ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" : "bg-gray-700"
                }`}
              />
              <span className="text-[9px] text-gray-500 font-mono">D{7 - i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

