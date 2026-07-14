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
    <div className="flex flex-col h-full rounded-lg bg-background border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-foreground">Instruction History</span>
        </div>
        <span className="text-xs text-muted-foreground">{history.length} executed</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {history.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
            No instructions executed yet.
          </div>
        ) : (
          <div className="space-y-1">
            {[...history].reverse().map((inst, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between px-3 py-1.5 rounded bg-muted/50 hover:bg-muted/50 border border-border font-mono text-xs"
              >
                <div className="flex gap-4">
                  <span className="text-cyan-500/70">{inst.address.toString(16).toUpperCase().padStart(4, "0")}H</span>
                  <span className="text-foreground/80 font-semibold">{inst.statement}</span>
                </div>
                <span className="text-muted-foreground">{inst.hex?.join(" ") || ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

