"use client"

import { useState } from "react"
import SimulatorNav from "./simulator-nav"
import CodeEditor from "./code-editor"
import ControlBar from "./control-bar"
import ConsolePanel from "./console-panel"
import RegisterDisplay from "./register-display"
import FlagDisplay from "./flag-display"
import OutputDisplay from "./output-display"
import MemoryGrid from "./memory-grid"
import IOPorts from "./io-ports"
import InterruptDisplay from "./interrupt-display"
import { useSimulator } from "@/hooks/use-simulator"
import { AIAssistantPanel } from "./ai-assistant-panel"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

const sampleCode = `; 8085 Assembly Program
; Add two numbers

MVI A, 25H    ; Load 25H into A
MVI B, 3AH    ; Load 3AH into B
ADD B         ; Add B to A
STA 2050H     ; Store result at 2050H
HLT           ; Halt`

export default function SimulatorDashboard() {
  const [code, setCode] = useState(sampleCode)
  const { data: session } = useSession()

  const {
    emulatorState,
    consoleOutput,
    assembleCode,
    runProgram,
    stepProgram,
    resetSimulator,
    clearCode,
    currentLine
  } = useSimulator()

  // Transform emulator state for UI components
  const registers = {
    A: emulatorState.registers?.A?.toString(16).toUpperCase().padStart(2, "0") || "00",
    B: emulatorState.registers?.B?.toString(16).toUpperCase().padStart(2, "0") || "00",
    C: emulatorState.registers?.C?.toString(16).toUpperCase().padStart(2, "0") || "00",
    D: emulatorState.registers?.D?.toString(16).toUpperCase().padStart(2, "0") || "00",
    E: emulatorState.registers?.E?.toString(16).toUpperCase().padStart(2, "0") || "00",
    H: emulatorState.registers?.H?.toString(16).toUpperCase().padStart(2, "0") || "00",
    L: emulatorState.registers?.L?.toString(16).toUpperCase().padStart(2, "0") || "00",
    PC: emulatorState.registers?.PC?.toString(16).toUpperCase().padStart(4, "0") || "0000",
    SP: emulatorState.registers?.SP?.toString(16).toUpperCase().padStart(4, "0") || "0000",
  }

  const flags = {
    Z: emulatorState.flags?.Z || 0,
    S: emulatorState.flags?.S || 0,
    CY: emulatorState.flags?.CY || 0,
    P: emulatorState.flags?.P || 0,
    AC: emulatorState.flags?.AC || 0,
  }

  const interruptState = {
    interruptsEnabled: emulatorState.interruptsEnabled || false,
    interruptMask: emulatorState.interruptMask || 0,
    pendingInterrupts: emulatorState.pendingInterrupts || 0,
    serialInput: emulatorState.serialInput || 0,
    serialOutput: emulatorState.serialOutput || 0,
  }

  // Create memory array for display (starting at 0x2000)
  const memory = Array.from({ length: 256 }, (_, i) => {
    const addr = 0x2000 + i
    if (emulatorState.memory && emulatorState.memory[addr] !== undefined) {
      return emulatorState.memory[addr].toString(16).toUpperCase().padStart(2, "0")
    }
    return "00"
  })

  // Create I/O ports object
  const ioPorts: Record<string, string> = {}
  if (emulatorState.ioPorts) {
    emulatorState.ioPorts.forEach((value: number, port: number) => {
      ioPorts[port.toString(16).toUpperCase().padStart(2, "0")] = value.toString(16).toUpperCase().padStart(2, "0")
    })
  }

  // Calculate LED and segment values
  const ledValue = parseInt(registers.A, 16) || 0
  const segmentValue = registers.A

  // Get current PC for memory grid highlighting
  const currentPC = parseInt(registers.PC, 16) || 0

  const handleAssemble = () => {
    assembleCode(code)
  }

  const handleRun = () => {
    runProgram()
  }

  const handleStep = () => {
    stepProgram()
  }

  const handleReset = () => {
    resetSimulator()
    setCode("")
  }

  const handleClear = () => {
    clearCode()
    setCode("")
  }

  const handleSave = async () => {
    if (!session) {
      toast.error("Please sign in to save your code")
      return
    }

    if (!code.trim()) {
      toast.error("Cannot save empty code")
      return
    }

    try {
      const response = await fetch("/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "My 8085 Program", code })
      })

      if (response.ok) {
        toast.success("Code saved successfully!")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save code")
      }
    } catch (error) {
      toast.error("Failed to save code")
    }
  }

  const handleShare = async () => {
    if (!session) {
      toast.error("Please sign in to share your code")
      return
    }

    if (!code.trim()) {
      toast.error("Cannot share empty code")
      return
    }

    try {
      // Create a shareable link by copying to clipboard
      const url = `${window.location.origin}/simulator?code=${encodeURIComponent(code)}`
      await navigator.clipboard.writeText(url)
      toast.success("Share link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy share link")
    }
  }

  const handleDownload = () => {
    if (!session) {
      toast.error("Please sign in to download your code")
      return
    }

    if (!code.trim()) {
      toast.error("Cannot download empty code")
      return
    }

    const element = document.createElement("a")
    const file = new Blob([code], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "program.asm"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("Code downloaded successfully!")
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <SimulatorNav />

      <main className="flex-1 container mx-auto px-4 py-4 animate-fade-in">
        {/* Control Bar */}
        <ControlBar
          onAssemble={handleAssemble}
          onRun={handleRun}
          onStep={handleStep}
          onReset={handleReset}
          onClear={handleClear}
          onSave={handleSave}
          onShare={handleShare}
          onDownload={handleDownload}
        />

        {/* Main Layout with AI Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_320px] xl:grid-cols-[1fr_320px_320px_320px] gap-4 mt-4 min-h-[calc(100vh-180px)]">
          {/* LEFT: Code Editor & Console */}
          <div className="flex flex-col gap-4">
            <CodeEditor code={code} setCode={setCode} activeLine={currentLine} />
            <ConsolePanel logs={consoleOutput} />
          </div>

          {/* CENTER: CPU Visualizer */}
          <div className="flex flex-col gap-4">
            <RegisterDisplay registers={registers} />
            <FlagDisplay flags={flags} />
            <OutputDisplay ledValue={ledValue} segmentValue={segmentValue} />
          </div>

          {/* RIGHT: Memory & I/O */}
          <div className="flex flex-col gap-4">
            <MemoryGrid memory={memory} currentPC={currentPC} />
            <InterruptDisplay {...interruptState} />
            <IOPorts ports={ioPorts} />
          </div>

          {/* AI ASSISTANT PANEL */}
          <div className="hidden xl:block">
            <AIAssistantPanel code={code} registers={registers} flags={flags} />
          </div>
        </div>

        {/* AI ASSISTANT PANEL - MOBILE/TABLET */}
        <div className="mt-4 xl:hidden">
          <AIAssistantPanel code={code} registers={registers} flags={flags} />
        </div>
      </main>
    </div>
  )
}
