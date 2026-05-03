'use client'

// Custom hook for 8085 simulator logic
import { useState, useEffect, useCallback, useRef } from "react"
import { Emulator8085 } from '@/lib/emulator'
import { Assembler8085 } from '@/lib/assembler'

export function useSimulator() {
  const emulatorRef = useRef<Emulator8085 | null>(null)
  const assemblerRef = useRef<Assembler8085 | null>(null)

  const [emulatorState, setEmulatorState] = useState<any>({})
  const [assembledCode, setAssembledCode] = useState<any>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isAssembled, setIsAssembled] = useState<boolean>(false)
  const [currentLine, setCurrentLine] = useState<number | null>(null)
  const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set())
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '[INFO] 8085 Simulator initialized',
    '[INFO] Ready to load program'
  ])

  // Initialize emulator and assembler
  useEffect(() => {
    if (!emulatorRef.current) {
      emulatorRef.current = new Emulator8085()
      setEmulatorState(emulatorRef.current.getState())
    }

    if (!assemblerRef.current) {
      assemblerRef.current = new Assembler8085()
    }
  }, [])

  // Update the simulator state when the emulator state changes
  const updateSimulatorState = useCallback(() => {
    if (emulatorRef.current) {
      setEmulatorState(emulatorRef.current.getState())
    }
  }, [])

  // Assemble the code
  const assembleCode = useCallback((code: string) => {
    if (!assemblerRef.current) return

    try {
      const result = assemblerRef.current.assemble(code)

      setAssembledCode(result)
      setIsAssembled(result.errors.length === 0)

      const newConsoleOutput = [
        ...consoleOutput,
        `[ASM] Assembling program...`,
        result.errors.length > 0
          ? `[ERROR] Assembly failed with ${result.errors.length} errors`
          : `[ASM] Program assembled successfully`,
        ...(result.errors.length > 0 ? result.errors.map((e: string) => `[ERROR] ${e}`) : []),
        `[ASM] ${result.instructions.length} instructions generated`
      ]

      setConsoleOutput(newConsoleOutput)
      setCurrentLine(result.errors.length === 0 ? 0 : null)

      if (result.errors.length === 0 && emulatorRef.current) {
        // Reset the emulator to clear previous state (registers, flags, memory)
        emulatorRef.current.reset()
        // Load the program into the emulator
        emulatorRef.current.loadProgram(result.machineCode)
        updateSimulatorState()
      }
    } catch (error) {
      const newConsoleOutput = [
        ...consoleOutput,
        `[ERROR] Failed to assemble code: ${error instanceof Error ? error.message : 'Unknown error'}`
      ]
      setConsoleOutput(newConsoleOutput)
    }
  }, [consoleOutput, updateSimulatorState])

  // Run the program
  const runProgram = useCallback(() => {
    if (!isAssembled) {
      setConsoleOutput([...consoleOutput, '[ERROR] Program not assembled. Please assemble first.'])
      return
    }

    if (!emulatorRef.current) return

    setIsRunning(true)
    setConsoleOutput([...consoleOutput, '[RUN] Executing program...'])

    // Run in a timeout to allow UI to update
    setTimeout(() => {
      try {
        const cycles = emulatorRef.current!.run()
        updateSimulatorState()

        const newConsoleOutput = [
          ...consoleOutput,
          `[RUN] Program execution completed in ${cycles} cycles`,
          emulatorRef.current!.getState().halted
            ? '[RUN] Program halted'
            : '[RUN] Execution stopped at breakpoint'
        ]

        setConsoleOutput(newConsoleOutput)
        setIsRunning(false)
      } catch (error) {
        const newConsoleOutput = [
          ...consoleOutput,
          `[ERROR] Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        ]
        setConsoleOutput(newConsoleOutput)
        setIsRunning(false)
      }
    }, 0)
  }, [isAssembled, consoleOutput, updateSimulatorState])

  // Step through one instruction
  const stepProgram = useCallback(() => {
    if (!isAssembled) {
      setConsoleOutput([...consoleOutput, '[ERROR] Program not assembled. Please assemble first.'])
      return
    }

    if (!emulatorRef.current) return

    try {
      const cycles = emulatorRef.current.step()
      updateSimulatorState()

      setConsoleOutput([...consoleOutput, `[STEP] Executed instruction in ${cycles} cycles`])
    } catch (error) {
      const newConsoleOutput = [
        ...consoleOutput,
        `[ERROR] Step execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      ]
      setConsoleOutput(newConsoleOutput)
    }
  }, [isAssembled, consoleOutput, updateSimulatorState])

  // Reset the simulator
  const resetSimulator = useCallback(() => {
    if (!emulatorRef.current) return

    emulatorRef.current.reset()
    updateSimulatorState()

    setIsRunning(false)
    setIsAssembled(false)
    setCurrentLine(null)
    setAssembledCode(null)
    setConsoleOutput([...consoleOutput, '[RESET] Simulator reset'])
  }, [consoleOutput, updateSimulatorState])

  // Clear the code editor
  const clearCode = useCallback(() => {
    setConsoleOutput([...consoleOutput, '[CLEAR] Editor cleared'])
  }, [consoleOutput])

  // Set a breakpoint
  const setBreakpoint = useCallback((lineNumber: number) => {
    if (!emulatorRef.current) return

    const newBreakpoints = new Set(breakpoints)
    if (newBreakpoints.has(lineNumber)) {
      newBreakpoints.delete(lineNumber)
    } else {
      newBreakpoints.add(lineNumber)
    }

    // Update emulator breakpoints
    emulatorRef.current.removeBreakpoint(lineNumber)
    if (newBreakpoints.has(lineNumber)) {
      emulatorRef.current.setBreakpoint(lineNumber)
    }

    setBreakpoints(newBreakpoints)
  }, [breakpoints])

  // Add a message to console
  const addToConsole = useCallback((message: string) => {
    setConsoleOutput([...consoleOutput, message])
  }, [consoleOutput])

  return {
    emulatorState,
    assembledCode,
    isRunning,
    isAssembled,
    currentLine,
    breakpoints,
    consoleOutput,
    assembleCode,
    runProgram,
    stepProgram,
    resetSimulator,
    clearCode,
    setBreakpoint,
    addToConsole,
  }
}