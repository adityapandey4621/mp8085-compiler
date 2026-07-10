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
    <div className="shrink-0 min-h-[140px] rounded-lg bg-[#0a0a0f] border border-white/5 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 bg-white/[0.02]">
        <Cpu className="w-4 h-4 text-fuchsia-400" />
        <span className="text-sm font-semibold text-fuchsia-300">{meta.mnemonic}</span>
        <span className="text-xs text-gray-500 ml-auto font-mono">
          {pc.toString(16).toUpperCase().padStart(4, "0")}H : {hex.join(" ")}
        </span>
      </div>
      
      <div className="p-3 grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-gray-500">
            <Type className="w-3 h-3" />
            <span>Addressing Mode</span>
          </div>
          <span className="text-gray-200">{meta.addressingMode}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-gray-500">
            <Zap className="w-3 h-3" />
            <span>Machine Cycles</span>
          </div>
          <span className="text-gray-200">{meta.machineCycles}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>T-States</span>
          </div>
          <span className="text-gray-200">{meta.tStates}</span>
        </div>

        <div className="flex flex-col gap-1 col-span-2 mt-1 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 text-gray-500">
            <FileText className="w-3 h-3" />
            <span>Description</span>
          </div>
          <span className="text-gray-300 italic">{meta.description}</span>
        </div>
      </div>
    </div>
  )
}
