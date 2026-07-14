"use client"

import { Radio } from "lucide-react"

interface IOPortsProps {
  ports: Record<string, string>
}

export default function IOPorts({ ports }: IOPortsProps) {
  return (
    <div className="rounded-lg bg-background border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
        <Radio className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-gray-300">I/O Ports</span>
      </div>

      <div className="p-4 space-y-2">
        {Object.entries(ports).map(([port, value]) => (
          <div
            key={port}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
          >
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Port</div>
              <div className="font-mono text-sm text-gray-300">{port}H</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Value</div>
              <div className="font-mono text-lg font-semibold text-cyan-400">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

