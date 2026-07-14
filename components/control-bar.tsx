"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, StepForward, StepBack as StepBackIcon, RotateCcw, Trash2, Hammer, Save, Share2, Download, FolderOpen } from "lucide-react"

interface ControlBarProps {
  onAssemble: () => void
  onRun: () => void
  onPause?: () => void
  onStep: () => void
  onStepBack: () => void
  onReset: () => void
  onClear: () => void
  onSave: () => void
  onOpen: (content: string) => void
  onShare: () => void
  onDownload: () => void
  isRunning?: boolean
  executionSpeed?: number
  setExecutionSpeed?: (speed: number) => void
}

export default function ControlBar({ 
  onAssemble, onRun, onPause, onStep, onStepBack, 
  onReset, onClear, onSave, onOpen, onShare, onDownload,
  isRunning, executionSpeed, setExecutionSpeed 
}: ControlBarProps) {
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

  const [freqText, setFreqText] = useState("3 MHz")

  useEffect(() => {
    if (executionSpeed === 0) setFreqText("3 MHz")
    else if (executionSpeed === 1000) setFreqText("1 kHz")
    else if (executionSpeed === 100) setFreqText("100 Hz")
    else if (executionSpeed === 10) setFreqText("10 Hz")
    else if (executionSpeed === 1) setFreqText("1 Hz")
    else if (executionSpeed) setFreqText(executionSpeed >= 1000 ? `${executionSpeed/1000} kHz` : `${executionSpeed} Hz`)
  }, [executionSpeed])

  const parseAndSetSpeed = () => {
    const text = freqText.toLowerCase().trim()
    if (text === "3 mhz" || text === "0" || text.includes("real")) {
      setExecutionSpeed?.(0)
      setFreqText("3 MHz")
      return
    }
    
    let multiplier = 1
    if (text.includes('k')) multiplier = 1000
    if (text.includes('m')) multiplier = 1000000
    
    const num = parseFloat(text.replace(/[^0-9.]/g, ''))
    if (!isNaN(num)) {
      const speed = num * multiplier
      if (speed >= 3000000) {
        setExecutionSpeed?.(0)
        setFreqText("3 MHz")
      } else {
        const finalSpeed = Math.max(1, Math.round(speed))
        setExecutionSpeed?.(finalSpeed)
        setFreqText(`${finalSpeed >= 1000 ? (finalSpeed/1000) + ' kHz' : finalSpeed + ' Hz'}`)
      }
    } else {
      if (executionSpeed === 0) setFreqText("3 MHz")
      else setFreqText(`${executionSpeed} Hz`)
    }
  }
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border">
      <Button
        onClick={onAssemble}
        size="sm"
        title="Assemble (Ctrl+Enter)"
        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 gap-2 h-9 px-4 transition-all active:scale-95"
      >
        <Hammer className="w-4 h-4" />
        Assemble
      </Button>
      {isRunning ? (
        <Button
          onClick={onPause}
          size="sm"
          title="Pause"
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 gap-2 h-9 px-4 transition-all active:scale-95"
        >
          <Pause className="w-4 h-4" />
          Pause
        </Button>
      ) : (
        <Button
          onClick={onRun}
          size="sm"
          title="Run (F5)"
          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 gap-2 h-9 px-4 transition-all active:scale-95"
        >
          <Play className="w-4 h-4" />
          Run
        </Button>
      )}

      <div className="flex items-center gap-1 bg-white/5 rounded-md px-2 h-9 border border-border/60 ml-1">
        <input
          type="text"
          value={freqText}
          onChange={(e) => setFreqText(e.target.value)}
          onBlur={parseAndSetSpeed}
          onKeyDown={(e) => e.key === 'Enter' && parseAndSetSpeed()}
          className="bg-transparent text-gray-300 text-xs font-mono focus:outline-none w-16 text-center"
          title="Execution Speed (e.g., 100, 1k, 3m)"
        />
      </div>
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

