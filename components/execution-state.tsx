"use client"

import { PlayCircle } from "lucide-react"
import { decodeInstruction } from "@/lib/instruction-details"

interface ExecutionStateProps {
  memory: Uint8Array
  instructionsExecuted: number
  pc: string
}

export default function ExecutionState({ memory, instructionsExecuted, pc }: ExecutionStateProps) {
  const pcVal = parseInt(pc, 16) || 0
  const { hex, meta } = decodeInstruction(memory, pcVal)

  return (
    <div className="rounded-lg bg-background border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-fuchsia-400" />
          <span className="text-sm font-medium text-gray-300">Execution State</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs text-gray-500">Idle</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Instruction</div>
            <div className="font-mono text-lg text-white font-semibold">
              {meta.mnemonic}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Opcode</div>
            <div className="font-mono text-lg text-fuchsia-400 font-semibold">
              {hex[0]}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">PC</div>
            <div className="font-mono text-lg text-cyan-400 font-semibold">{pc}H</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Length</div>
            <div className="font-mono text-lg text-white font-semibold">
              {meta.length} Bytes
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Instructions Executed</span>
          <span className="font-mono text-sm text-white font-semibold">{instructionsExecuted}</span>
        </div>
      </div>
    </div>
  )
}

