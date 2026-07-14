"use client"

import { Zap, Activity } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface InterruptDisplayProps {
    interruptsEnabled: boolean
    interruptMask: number
    pendingInterrupts: number
    serialInput: number
    serialOutput: number
}

export default function InterruptDisplay({
    interruptsEnabled,
    interruptMask,
    pendingInterrupts,
    serialInput,
    serialOutput,
}: InterruptDisplayProps) {
    const interrupts = [
        { name: "RST 7.5", maskBit: 2, pendingBit: 2 },
        { name: "RST 6.5", maskBit: 1, pendingBit: 1 },
        { name: "RST 5.5", maskBit: 0, pendingBit: 0 },
        { name: "TRAP", maskBit: -1, pendingBit: 3 }, // TRAP is non-maskable
        { name: "INTR", maskBit: -1, pendingBit: 4 }, // INTR is maskable by IE but no specific mask bit in SIM
    ]

    return (
        <div className="rounded-lg bg-background border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Interrupts & Serial I/O</span>
            </div>

            <div className="p-4 space-y-4">
                {/* Main Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${interruptsEnabled ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`} />
                        <span className="text-xs font-medium text-gray-400">Interrupts (IE)</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 uppercase">SID</span>
                            <span className={`font-mono text-xs ${serialInput ? "text-green-400" : "text-gray-600"}`}>{serialInput}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 uppercase">SOD</span>
                            <span className={`font-mono text-xs ${serialOutput ? "text-green-400" : "text-gray-600"}`}>{serialOutput}</span>
                        </div>
                    </div>
                </div>

                {/* Interrupt Grid */}
                <div className="grid grid-cols-5 gap-1">
                    {interrupts.map((intr) => {
                        const isMasked = intr.maskBit !== -1 && ((interruptMask >> intr.maskBit) & 1) === 1
                        const isPending = ((pendingInterrupts >> intr.pendingBit) & 1) === 1

                        return (
                            <TooltipProvider key={intr.name}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className={`
                      flex flex-col items-center justify-center p-2 rounded border transition-all duration-300
                      ${isPending
                                                ? "bg-yellow-500/20 border-yellow-500/40 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                                                : "bg-muted/50 border-border"}
                    `}>
                                            <span className="text-[10px] font-bold text-gray-400 mb-1">{intr.name}</span>
                                            <div className="flex gap-1">
                                                {/* Mask Status Dot */}
                                                {intr.maskBit !== -1 && (
                                                    <div
                                                        className={`w-1.5 h-1.5 rounded-full ${isMasked ? "bg-red-500" : "bg-green-500"}`}
                                                    />
                                                )}
                                                {/* Pending Status Dot */}
                                                <div
                                                    className={`w-1.5 h-1.5 rounded-full ${isPending ? "bg-yellow-400 animate-pulse" : "bg-gray-700"}`}
                                                />
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="bg-background border-border/60 text-xs">
                                        <p>{intr.name}</p>
                                        <p>Status: {isPending ? "Pending" : "Inactive"}</p>
                                        {intr.maskBit !== -1 && <p>Mask: {isMasked ? "Masked" : "Unmasked"}</p>}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

