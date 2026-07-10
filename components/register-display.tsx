"use client"

import { useState, useEffect, useRef } from "react"
import { Cpu } from "lucide-react"

interface RegisterDisplayProps {
  registers: Record<string, string>
  onSetPC?: (address: number) => void
}

export default function RegisterDisplay({ registers, onSetPC }: RegisterDisplayProps) {
  const [changedRegs, setChangedRegs] = useState<Set<string>>(new Set())
  const [editingPC, setEditingPC] = useState(false)
  const [pcInput, setPcInput] = useState("")
  const prevRegs = useRef(registers)

  useEffect(() => {
    const changed = new Set<string>()
    Object.keys(registers).forEach((key) => {
      if (registers[key] !== prevRegs.current[key]) {
        changed.add(key)
      }
    })
    if (changed.size > 0) {
      setChangedRegs(changed)
      setTimeout(() => setChangedRegs(new Set()), 600)
    }
    prevRegs.current = registers
  }, [registers])

  const RegisterBox = ({ reg, label }: { reg: string, label: string }) => (
    <div
      className={`p-2 rounded-lg border transition-all duration-300 ${
        changedRegs.has(reg)
          ? "bg-blue-500/20 border-blue-500/50 shadow-[0_0_12px_rgba(74,144,226,0.3)]"
          : "bg-white/[0.02] border-white/5"
      }`}
    >
      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div
        className={`font-mono text-lg font-semibold transition-colors ${
          changedRegs.has(reg) ? "text-blue-400" : "text-white"
        }`}
      >
        {registers[reg]}
      </div>
    </div>
  )

  const PairBox = ({ title, highReg, lowReg }: { title: string, highReg: string, lowReg: string }) => {
    const pairValue = `${registers[highReg]}${registers[lowReg]}`
    return (
      <div className="flex flex-col gap-1 border border-white/5 bg-white/[0.01] rounded-lg p-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">{title}</span>
          <span className="text-[10px] text-gray-600 font-mono">{pairValue}H</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <RegisterBox reg={highReg} label={highReg} />
          <RegisterBox reg={lowReg} label={lowReg} />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-[#0a0a0f] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <Cpu className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-gray-300">CPU Registers</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Accumulator */}
        <div className="border border-white/5 bg-white/[0.01] rounded-lg p-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Accumulator (A)</span>
          <RegisterBox reg="A" label="A" />
        </div>

        {/* Register Pairs */}
        <div className="grid grid-cols-2 gap-4">
          <PairBox title="BC Pair" highReg="B" lowReg="C" />
          <PairBox title="DE Pair" highReg="D" lowReg="E" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <PairBox title="HL Pair" highReg="H" lowReg="L" />
          
          {/* SP & PC block in right col */}
          <div className="flex flex-col gap-2">
            <div className={`p-3 rounded-lg border transition-all duration-300 flex-1 flex flex-col justify-center ${
                changedRegs.has("PC")
                  ? "bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_12px_rgba(0,245,255,0.3)]"
                  : "bg-white/[0.02] border-white/5"
              }`}
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Program Counter
              </div>
              {editingPC ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (onSetPC) {
                      const addr = parseInt(pcInput, 16);
                      if (!isNaN(addr)) onSetPC(addr);
                    }
                    setEditingPC(false);
                  }}
                  className="mt-1"
                >
                  <input 
                    autoFocus
                    type="text"
                    value={pcInput}
                    onChange={(e) => setPcInput(e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 4))}
                    onBlur={() => setEditingPC(false)}
                    className="w-full bg-transparent border-b border-cyan-500/50 outline-none font-mono text-xl font-semibold text-cyan-400"
                    placeholder="0000"
                  />
                </form>
              ) : (
                <div
                  onClick={() => {
                    setPcInput(registers["PC"]);
                    setEditingPC(true);
                  }}
                  className={`font-mono text-xl font-semibold transition-colors cursor-text hover:text-cyan-200 ${
                    changedRegs.has("PC") ? "text-cyan-400" : "text-white"
                  }`}
                  title="Click to edit Program Counter"
                >
                  {registers["PC"]}
                </div>
              )}
            </div>

            <div className={`p-2 rounded-lg border transition-all duration-300 ${
                changedRegs.has("SP")
                  ? "bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_12px_rgba(0,245,255,0.3)]"
                  : "bg-white/[0.02] border-white/5"
              }`}
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Stack Pointer
              </div>
              <div
                className={`font-mono text-lg font-semibold transition-colors ${
                  changedRegs.has("SP") ? "text-cyan-400" : "text-white"
                }`}
              >
                {registers["SP"]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
