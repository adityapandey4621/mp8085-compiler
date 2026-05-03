"use client"

import { Button } from "@/components/ui/button"
import { Play, StepForward, RotateCcw, Trash2, Hammer, Save, Share2, Download } from "lucide-react"

interface ControlBarProps {
  onAssemble: () => void
  onRun: () => void
  onStep: () => void
  onReset: () => void
  onClear: () => void
  onSave: () => void
  onShare: () => void
  onDownload: () => void
}

export default function ControlBar({ onAssemble, onRun, onStep, onReset, onClear, onSave, onShare, onDownload }: ControlBarProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0a0f] border border-white/5">
      <Button
        onClick={onAssemble}
        size="sm"
        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <Hammer className="w-4 h-4" />
        Assemble
      </Button>
      <Button
        onClick={onRun}
        size="sm"
        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <Play className="w-4 h-4" />
        Run
      </Button>
      <Button
        onClick={onStep}
        size="sm"
        className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <StepForward className="w-4 h-4" />
        Step
      </Button>
      <div className="w-px h-6 bg-white/10 mx-1" />
      <Button
        onClick={onSave}
        size="sm"
        variant="ghost"
        className="text-gray-400 hover:text-white hover:bg-white/5 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <Save className="w-4 h-4" />
        Save
      </Button>
      <Button
        onClick={onShare}
        size="sm"
        variant="ghost"
        className="text-gray-400 hover:text-white hover:bg-white/5 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      <Button
        onClick={onDownload}
        size="sm"
        variant="ghost"
        className="text-gray-400 hover:text-white hover:bg-white/5 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <Download className="w-4 h-4" />
        Download
      </Button>
      <div className="w-px h-6 bg-white/10 mx-1" />
      <Button
        onClick={onReset}
        size="sm"
        variant="ghost"
        className="text-gray-400 hover:text-white hover:bg-white/5 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
      <Button
        onClick={onClear}
        size="sm"
        variant="ghost"
        className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <Trash2 className="w-4 h-4" />
        Clear
      </Button>
    </div>
  )
}
