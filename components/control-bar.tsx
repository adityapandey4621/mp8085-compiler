"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, StepForward, StepBack as StepBackIcon, RotateCcw, Trash2, Hammer, Save, Share2, Download, FolderOpen } from "lucide-react"

interface ControlBarProps {
  onAssemble: () => void
  onRun: () => void
  onStep: () => void
  onStepBack: () => void
  onReset: () => void
  onClear: () => void
  onSave: () => void
  onOpen: (content: string) => void
  onShare: () => void
  onDownload: () => void
}

export default function ControlBar({ onAssemble, onRun, onStep, onStepBack, onReset, onClear, onSave, onOpen, onShare, onDownload }: ControlBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      onOpen(content)
      if (fileInputRef.current) {
        fileInputRef.current.value = "" // reset input
      }
    }
    reader.readAsText(file)
  }
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0a0f] border border-white/5">
      <Button
        onClick={onAssemble}
        size="sm"
        title="Assemble (Ctrl+Enter)"
        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <Hammer className="w-4 h-4" />
        Assemble
      </Button>
      <Button
        onClick={onRun}
        size="sm"
        title="Run (F5)"
        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <Play className="w-4 h-4" />
        Run
      </Button>
      <Button
        onClick={onStep}
        size="sm"
        title="Step (F10)"
        className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <StepForward className="w-4 h-4" />
        Step
      </Button>
      <Button
        onClick={onStepBack}
        size="sm"
        title="Step Back (F9)"
        className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <StepBackIcon className="w-4 h-4" />
        Step Back
      </Button>
      <div className="w-px h-6 bg-white/10 mx-1" />
      <input 
        type="file" 
        accept=".asm,.txt" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        size="sm"
        variant="ghost"
        className="text-gray-400 hover:text-white hover:bg-white/5 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <FolderOpen className="w-4 h-4" />
        Open
      </Button>
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
        title="Reset (Ctrl+R)"
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
