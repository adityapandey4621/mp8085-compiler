"use client"

import { useState } from "react"
import NavigationBar from "./navigation-bar"
import EditorPanel from "./editor-panel"
import ControlButtons from "./control-buttons"
import OutputConsole from "./output-console"
import RegisterPanel from "./register-panel"
import FlagPanel from "./flag-panel"
import SevenSegment from "./seven-segment"
import LEDBar from "./led-bar"
import MemoryViewer from "./memory-viewer"
import IOPortPanel from "./io-port-panel"
import AIAssistantPanel from "./ai-assistant-panel"

// Dummy data
const initialRegisters = {
  A: "3A",
  B: "00",
  C: "25",
  D: "FA",
  E: "10",
  H: "20",
  L: "15",
  PC: "2000",
  SP: "FF00",
}

const initialFlags = { Z: 1, S: 0, CY: 1, P: 0, AC: 1 }

const initialMemory = Array.from({ length: 256 }, (_, i) => i.toString(16).toUpperCase().padStart(2, "0"))

const initialIOPorts = {
  "01": "FF",
  "02": "3C",
}

const sampleCode = `; 8085 Assembly Program
; Add two numbers

MVI A, 25H    ; Load 25H into A
MVI B, 3AH    ; Load 3AH into B
ADD B         ; Add B to A
STA 2050H     ; Store result at 2050H
HLT           ; Halt`

export default function SimulatorPage() {
  const [registers, setRegisters] = useState(initialRegisters)
  const [flags, setFlags] = useState(initialFlags)
  const [memory, setMemory] = useState(initialMemory)
  const [ioPorts, setIOPorts] = useState(initialIOPorts)
  const [code, setCode] = useState(sampleCode)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "[INFO] 8085 Simulator initialized",
    "[INFO] Ready to load program",
  ])
  const [ledValues, setLedValues] = useState(0xff)
  const [segmentValue, setSegmentValue] = useState("3A")
  const [currentPC, setCurrentPC] = useState(0x2000)

  const handleAssemble = () => {
    setConsoleOutput((prev) => [
      ...prev,
      "[ASM] Assembling program...",
      "[ASM] Program assembled successfully",
      "[ASM] 5 instructions generated",
    ])
  }

  const handleRun = () => {
    setConsoleOutput((prev) => [...prev, "[RUN] Executing program..."])
    // Simulate register changes
    setTimeout(() => {
      setRegisters((prev) => ({ ...prev, A: "5F", PC: "2008" }))
      setFlags((prev) => ({ ...prev, Z: 0, CY: 0 }))
      setLedValues(0x5f)
      setSegmentValue("5F")
      setConsoleOutput((prev) => [...prev, "[RUN] Program halted at 2008H"])
    }, 500)
  }

  const handleStep = () => {
    setConsoleOutput((prev) => [...prev, "[STEP] Executing single instruction..."])
    setCurrentPC((prev) => prev + 1)
  }

  const handleReset = () => {
    setRegisters(initialRegisters)
    setFlags(initialFlags)
    setLedValues(0xff)
    setSegmentValue("3A")
    setCurrentPC(0x2000)
    setConsoleOutput((prev) => [...prev, "[RESET] Simulator reset"])
  }

  const handleClear = () => {
    setCode("")
    setConsoleOutput(["[INFO] Editor cleared"])
  }

  return (
    <div className="min-h-screen bg-background text-white overflow-hidden">
      <NavigationBar />

      <main className="container mx-auto px-4 py-6 animate-fade-in">
        {/* Main Three-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[38%_32%_30%] gap-4 min-h-[calc(100vh-180px)]">
          {/* LEFT COLUMN - Code Workspace */}
          <div className="flex flex-col gap-4">
            <EditorPanel code={code} setCode={setCode} />
            <ControlButtons
              onAssemble={handleAssemble}
              onRun={handleRun}
              onStep={handleStep}
              onReset={handleReset}
              onClear={handleClear}
            />
            <OutputConsole logs={consoleOutput} />
          </div>

          {/* CENTER COLUMN - CPU Core Visualizer */}
          <div className="flex flex-col gap-4">
            <RegisterPanel registers={registers} />
            <FlagPanel flags={flags} />
            <div className="grid grid-cols-2 gap-4">
              <SevenSegment value={segmentValue} />
              <LEDBar value={ledValues} />
            </div>
          </div>

          {/* RIGHT COLUMN - Memory & I/O */}
          <div className="flex flex-col gap-4">
            <MemoryViewer memory={memory} currentPC={currentPC} />
            <IOPortPanel ports={ioPorts} />
          </div>
        </div>

        {/* Bottom AI Assistant Panel */}
        <AIAssistantPanel />
      </main>
    </div>
  )
}

