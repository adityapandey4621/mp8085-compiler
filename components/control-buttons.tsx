"use client"

import type React from "react"

import { Play, StepForward, RotateCcw, Trash2, Cog } from "lucide-react"

interface ControlButtonsProps {
  onAssemble: () => void
  onRun: () => void
  onStep: () => void
  onReset: () => void
  onClear: () => void
}

const buttons = [
  { id: "assemble", label: "Assemble", icon: Cog, color: "#4A90E2" },
  { id: "run", label: "Run", icon: Play, color: "#2AFFAE" },
  { id: "step", label: "Step", icon: StepForward, color: "#00F5FF" },
  { id: "reset", label: "Reset", icon: RotateCcw, color: "#A66CFF" },
  { id: "clear", label: "Clear", icon: Trash2, color: "#FF6B6B" },
]

export default function ControlButtons({ onAssemble, onRun, onStep, onReset, onClear }: ControlButtonsProps) {
  const handlers: Record<string, () => void> = {
    assemble: onAssemble,
    run: onRun,
    step: onStep,
    reset: onReset,
    clear: onClear,
  }

  return (
    <div className="flex flex-wrap gap-2 bg-[#0a0a0f]/90 border border-[#1a1a2e] rounded-2xl p-4 backdrop-blur-xl animate-fade-in">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          onClick={handlers[btn.id]}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 neon-button"
          style={
            {
              border: `1px solid ${btn.color}40`,
              color: btn.color,
              background: `${btn.color}10`,
              // @ts-ignore - CSS custom property for hover effect
              "--neon-color": btn.color,
            } as React.CSSProperties
          }
        >
          <btn.icon className="w-4 h-4" />
          {btn.label}
        </button>
      ))}
    </div>
  )
}
