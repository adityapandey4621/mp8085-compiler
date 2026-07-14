"use client"

import { Cpu, Zap, Clock, Type, FileText } from "lucide-react"
import { decodeInstruction } from "@/lib/instruction-details"

interface InstructionDecoderProps {
  memory: Uint8Array
  pc: number
}

export default function InstructionDecoder({ memory, pc }: InstructionDecoderProps) {
  const { hex, meta } = decodeInstruction(memory, pc)

  return (
    <div className="shrink-0 min-h-[140px] rounded-lg bg-background border border-border flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/50">
        <Cpu className="w-4 h-4 text-fuchsia-400" />
        <span className="text-sm font-semibold text-fuchsia-300">{meta.mnemonic}</span>
        <span className="text-xs text-muted-foreground ml-auto font-mono">
          {pc.toString(16).toUpperCase().padStart(4, "0")}H : {hex.join(" ")}
        </span>
      </div>
      
      <div className="p-3 grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Type className="w-3 h-3" />
            <span>Addressing Mode</span>
          </div>
          <span className="text-foreground">{meta.addressingMode}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Zap className="w-3 h-3" />
            <span>Machine Cycles</span>
          </div>
          <span className="text-foreground">{meta.machineCycles}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>T-States</span>
          </div>
          <span className="text-foreground">{meta.tStates}</span>
        </div>

        <div className="flex flex-col gap-1 col-span-2 mt-1 pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-muted-foreground">
            <FileText className="w-3 h-3" />
            <span>Description</span>
          </div>
          <span className="text-foreground italic">{meta.description}</span>
        </div>
      </div>
    </div>
  )
}

