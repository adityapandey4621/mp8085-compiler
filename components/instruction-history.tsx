import { History } from "lucide-react"

interface Instruction {
  address: number
  hex: string[]
  statement: string
}

interface InstructionHistoryProps {
  history: Instruction[]
}

export default function InstructionHistory({ history = [] }: InstructionHistoryProps) {
  return (
    <div className="flex flex-col h-full rounded-lg bg-[#0a0a0f] border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-gray-300">Instruction History</span>
        </div>
        <span className="text-xs text-gray-500">{history.length} executed</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {history.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-500 italic">
            No instructions executed yet.
          </div>
        ) : (
          <div className="space-y-1">
            {[...history].reverse().map((inst, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between px-3 py-1.5 rounded bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 font-mono text-xs"
              >
                <div className="flex gap-4">
                  <span className="text-cyan-500/70">{inst.address.toString(16).toUpperCase().padStart(4, "0")}H</span>
                  <span className="text-white/80 font-semibold">{inst.statement}</span>
                </div>
                <span className="text-gray-500">{inst.hex?.join(" ") || ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
