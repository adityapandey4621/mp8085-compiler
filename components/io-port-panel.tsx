"use client"

import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react"

interface IOPortPanelProps {
  ports: Record<string, string>
}

export default function IOPortPanel({ ports }: IOPortPanelProps) {
  const inputPorts = [{ port: "01", value: ports["01"] || "00" }]
  const outputPorts = [{ port: "02", value: ports["02"] || "00" }]

  return (
    <div className="grid grid-cols-2 gap-3 animate-slide-left">
      {/* Input Ports */}
      <div className="bg-background/90 border border-border rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-[#0d0d12]">
          <ArrowDownToLine className="w-3 h-3 text-[#00F5FF]" />
          <span className="text-xs text-muted-foreground">Input Ports</span>
        </div>
        <div className="p-3 space-y-2">
          {inputPorts.map((p) => (
            <div key={p.port} className="bg-[#0d0d15] border border-border rounded-lg p-2">
              <div className="text-[10px] text-[#00F5FF]">Port {p.port}H</div>
              <div className="font-mono text-sm text-foreground">{p.value}H</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {Number.parseInt(p.value, 16).toString(2).padStart(8, "0")}B
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Output Ports */}
      <div className="bg-background/90 border border-border rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-[#0d0d12]">
          <ArrowUpFromLine className="w-3 h-3 text-[#2AFFAE]" />
          <span className="text-xs text-muted-foreground">Output Ports</span>
        </div>
        <div className="p-3 space-y-2">
          {outputPorts.map((p) => (
            <div key={p.port} className="bg-[#0d0d15] border border-border rounded-lg p-2">
              <div className="text-[10px] text-[#2AFFAE]">Port {p.port}H</div>
              <div className="font-mono text-sm text-foreground">{p.value}H</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {Number.parseInt(p.value, 16).toString(2).padStart(8, "0")}B
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

