"use client"

import { Monitor } from "lucide-react"

interface SevenSegmentProps {
  value: string
}

// Segment patterns for hex digits
const segmentPatterns: Record<string, boolean[]> = {
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

function Digit({ char }: { char: string }) {
  const pattern = segmentPatterns[char.toUpperCase()] || [false, false, false, false, false, false, false]

  const segmentStyle = (on: boolean) => ({
    background: on ? "#FF3B3B" : "#2a1a1a",
    boxShadow: on ? "0 0 10px #FF3B3B, 0 0 20px #FF3B3B50" : "none",
    transition: "all 0.2s ease",
  })

  return (
    <div className="relative w-10 h-16">
      {/* Segment A - Top */}
      <div className="absolute top-0 left-1 w-8 h-1.5 rounded-full" style={segmentStyle(pattern[0])} />
      {/* Segment B - Top Right */}
      <div className="absolute top-1 right-0 w-1.5 h-6 rounded-full" style={segmentStyle(pattern[1])} />
      {/* Segment C - Bottom Right */}
      <div className="absolute bottom-1 right-0 w-1.5 h-6 rounded-full" style={segmentStyle(pattern[2])} />
      {/* Segment D - Bottom */}
      <div className="absolute bottom-0 left-1 w-8 h-1.5 rounded-full" style={segmentStyle(pattern[3])} />
      {/* Segment E - Bottom Left */}
      <div className="absolute bottom-1 left-0 w-1.5 h-6 rounded-full" style={segmentStyle(pattern[4])} />
      {/* Segment F - Top Left */}
      <div className="absolute top-1 left-0 w-1.5 h-6 rounded-full" style={segmentStyle(pattern[5])} />
      {/* Segment G - Middle */}
      <div
        className="absolute top-1/2 left-1 -translate-y-1/2 w-8 h-1.5 rounded-full"
        style={segmentStyle(pattern[6])}
      />
    </div>
  )
}

export default function SevenSegment({ value }: SevenSegmentProps) {
  const chars = value.padStart(2, "0").slice(-2).split("")

  return (
    <div className="bg-background/90 border border-border rounded-2xl overflow-hidden backdrop-blur-xl animate-scale-in">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-[#0d0d12]">
        <Monitor className="w-4 h-4 text-[#FF3B3B]" />
        <span className="text-xs text-gray-400">7-Segment Display</span>
      </div>

      {/* Display */}
      <div className="flex justify-center items-center gap-3 p-6 bg-[#0a0808]">
        {chars.map((char, i) => (
          <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <Digit char={char} />
          </div>
        ))}
      </div>
    </div>
  )
}

