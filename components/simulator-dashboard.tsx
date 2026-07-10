"use client"

import { useState, useEffect } from "react"
import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import SimulatorNav from "./simulator-nav"
import CodeEditor from "./code-editor"
import ControlBar from "./control-bar"
import ConsolePanel from "./console-panel"
import RegisterDisplay from "./register-display"
import FlagDisplay from "./flag-display"
import OutputDisplay from "./output-display"
import MemoryGrid from "./memory-grid"
import IOPorts from "./io-ports"
import InstructionHistory from "./instruction-history"
import ExecutionState from "./execution-state"
import StackDisplay from "./stack-display"
import StatisticsDisplay from "./statistics-display"
import WatchWindow from "./watch-window"
import InstructionDecoder from "./instruction-decoder"
import ProgramCounter from "./program-counter"
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
    assembledCode,
    isRunning,
    isAssembled,
    currentLine,
    assembleCode,
    runProgram,
    stepProgram,
    stepBack,
    resetSimulator,
    clearCode,
    setPC,
    instructionHistory,
  } = useSimulator()

  const [aiOpen, setAiOpen] = useState(false)

  // ─── Keyboard Shortcuts ──────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in editor or inputs
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
        return;
      }
      
      if (e.key === 'F5') {
        e.preventDefault();
        runProgram();
      } else if (e.key === 'F10') {
        e.preventDefault();
        stepProgram();
      } else if (e.key === 'F9') {
        e.preventDefault();
        stepBack();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        assembleCode(code);
      } else if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        resetSimulator();
        setCode("");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runProgram, stepProgram, stepBack, assembleCode, resetSimulator, code]);

  // ─── Transform emulator state for UI components ───────────────────────────

  const registers = {
    A:  emulatorState.registers?.A?.toString(16).toUpperCase().padStart(2, "0")  || "00",
    B:  emulatorState.registers?.B?.toString(16).toUpperCase().padStart(2, "0")  || "00",
    C:  emulatorState.registers?.C?.toString(16).toUpperCase().padStart(2, "0")  || "00",
    D:  emulatorState.registers?.D?.toString(16).toUpperCase().padStart(2, "0")  || "00",
    E:  emulatorState.registers?.E?.toString(16).toUpperCase().padStart(2, "0")  || "00",
    H:  emulatorState.registers?.H?.toString(16).toUpperCase().padStart(2, "0")  || "00",
    L:  emulatorState.registers?.L?.toString(16).toUpperCase().padStart(2, "0")  || "00",
    PC: emulatorState.registers?.PC?.toString(16).toUpperCase().padStart(4, "0") || "0000",
    SP: emulatorState.registers?.SP?.toString(16).toUpperCase().padStart(4, "0") || "0000",
  }

  const flags = {
    Z:  emulatorState.flags?.Z  || 0,
    S:  emulatorState.flags?.S  || 0,
    CY: emulatorState.flags?.CY || 0,
    P:  emulatorState.flags?.P  || 0,
    AC: emulatorState.flags?.AC || 0,
  }

  const interruptState = {
    interruptsEnabled:  emulatorState.interruptsEnabled  || false,
    interruptMask:      emulatorState.interruptMask      || 0,
    pendingInterrupts:  emulatorState.pendingInterrupts  || 0,
    serialInput:        emulatorState.serialInput        || 0,
    serialOutput:       emulatorState.serialOutput       || 0,
  }

  // I/O ports
  const ioPorts: Record<string, string> = {}
  if (emulatorState.ioPorts) {
    emulatorState.ioPorts.forEach((value: number, port: number) => {
      ioPorts[port.toString(16).toUpperCase().padStart(2, "0")] =
        value.toString(16).toUpperCase().padStart(2, "0")
    })
  }

  const ledValue     = parseInt(registers.A, 16) || 0
  const segmentValue = registers.A
  const currentPC    = parseInt(registers.PC, 16) || 0

  const currentInstruction = isAssembled && assembledCode?.instructions
    ? assembledCode.instructions.find((i: any) => i.address === currentPC)
    : null;

  const instructionsExecuted = emulatorState.instructionsExecuted || 0;

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleAssemble = () => assembleCode(code)
  const handleRun      = () => runProgram()
  const handleStep     = () => stepProgram()
  const handleReset    = () => { resetSimulator(); setCode("") }
  const handleClear    = () => { clearCode(); setCode("") }

  const handleSave = async () => {
    if (!session) { toast.error("Please sign in to save your code"); return }
    if (!code.trim()) { toast.error("Cannot save empty code"); return }
    try {
      const response = await fetch("/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "My 8085 Program", code }),
      })
      if (response.ok) {
        toast.success("Code saved successfully!")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save code")
      }
    } catch {
      toast.error("Failed to save code")
    }
  }

  const handleShare = async () => {
    if (!session) { toast.error("Please sign in to share your code"); return }
    if (!code.trim()) { toast.error("Cannot share empty code"); return }
    try {
      const url = `${window.location.origin}/simulator?code=${encodeURIComponent(code)}`
      await navigator.clipboard.writeText(url)
      toast.success("Share link copied to clipboard!")
    } catch {
      toast.error("Failed to copy share link")
    }
  }

  const handleDownload = () => {
    if (!session) { toast.error("Please sign in to download your code"); return }
    if (!code.trim()) { toast.error("Cannot download empty code"); return }
    const element = document.createElement("a")
    const file    = new Blob([code], { type: "text/plain" })
    element.href  = URL.createObjectURL(file)
    element.download = "program.asm"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("Code downloaded successfully!")
  }


  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <SimulatorNav />

      <main className="flex-1 container mx-auto px-4 py-4 animate-fade-in">
        {/* Control Bar */}
        <ControlBar
          onAssemble={handleAssemble}
          onRun={handleRun}
          onStep={handleStep}
          onStepBack={stepBack}
          onReset={handleReset}
          onClear={handleClear}
          onSave={handleSave}
          onShare={handleShare}
          onDownload={handleDownload}
        />

        {/* Main Layout with AI Assistant */}
        <div className="mt-4 min-h-[calc(100vh-180px)] h-[calc(100vh-180px)] border border-white/5 rounded-lg overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            {/* LEFT COLUMN: 30% */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={70}>
                  <div className="h-full p-2">
                    <CodeEditor code={code} setCode={setCode} activeLine={currentLine} />
                  </div>
                </ResizablePanel>
                <ResizableHandle className="bg-white/5" />
                <ResizablePanel defaultSize={30}>
                  <div className="h-full p-2 flex flex-col gap-2">
                    <ConsolePanel logs={consoleOutput} />
                    <div className="flex-1 min-h-0">
                      <InstructionHistory history={instructionHistory} />
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            
            <ResizableHandle className="bg-white/5" />

            {/* MIDDLE COLUMN: 40% */}
            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="h-full p-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
                <div className="shrink-0">
                  <ExecutionState 
                    memory={emulatorState.memory || new Uint8Array(65536)}
                    instructionsExecuted={instructionsExecuted}
                    pc={registers.PC}
                  />
                </div>
                <div className="shrink-0">
                  <RegisterDisplay registers={registers} onSetPC={setPC} />
                </div>
                <div className="shrink-0">
                  <FlagDisplay flags={flags} />
                </div>
                <div className="shrink-0">
                  <InstructionDecoder 
                    memory={emulatorState.memory || new Uint8Array(65536)} 
                    pc={currentPC}
                    isAssembled={isAssembled}
                  />
                </div>
                <div className="shrink-0">
                  <InterruptDisplay 
                    interruptsEnabled={emulatorState.interruptsEnabled || false} 
                    interruptMask={emulatorState.interruptMask || 0}
                    pendingInterrupts={emulatorState.pendingInterrupts || 0}
                    serialInput={emulatorState.serialInput || 0}
                    serialOutput={emulatorState.serialOutput || 0}
                  />
                </div>
                <div className="shrink-0">
                  <WatchWindow registers={registers} memory={emulatorState.memory} />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="bg-white/5" />

            {/* RIGHT COLUMN: 30% */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="h-full p-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
                <div className="shrink-0">
                  <OutputDisplay ledValue={ledValue} segmentValue={segmentValue} />
                </div>
                <div className="shrink-0">
                  <ProgramCounter pc={registers.PC} onSetPC={setPC} />
                </div>
                <div className="shrink-0">
                  <StackDisplay memory={emulatorState.memory || new Uint8Array(65536)} sp={registers.SP} />
                </div>
                <div className="shrink-0">
                  <StatisticsDisplay stats={{
                    clockCycles: emulatorState.clockCycles || 0,
                    instructionsExecuted: instructionsExecuted,
                    memoryReads: emulatorState.memoryReads || 0,
                    memoryWrites: emulatorState.memoryWrites || 0,
                    stackOps: emulatorState.stackOps || 0,
                  }} />
                </div>
                <div className="shrink-0 flex-1">
                  <MemoryGrid memory={emulatorState.memory || new Uint8Array(65536)} currentPC={currentPC} />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        
        {/* AI ASSISTANT POPUP */}
        <Dialog open={aiOpen} onOpenChange={setAiOpen}>
          <DialogTrigger asChild>
            <Button 
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 p-0"
            >
              <Bot className="w-6 h-6 text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[400px] h-[600px] p-0 border-white/10 bg-[#0a0a0f] text-white flex flex-col">
            <DialogHeader className="p-4 border-b border-white/10 shrink-0">
              <DialogTitle>AI Assistant</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <AIAssistantPanel code={code} registers={registers} flags={flags} />
            </div>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  )
}
