"use client"

import { useState, ReactNode } from "react"
import { ChevronDown, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PanelAction {
  icon: LucideIcon
  label: string
  onClick: () => void
}

interface PanelProps {
  title: string
  icon?: LucideIcon
  color?: "blue" | "emerald" | "amber" | "purple" | "rose" | "cyan" | "gray"
  collapsible?: boolean
  defaultOpen?: boolean
  badge?: string | number
  actions?: PanelAction[]
  className?: string
  bodyClassName?: string
  children: ReactNode
  noPadding?: boolean
}

const colorMap = {
  blue:    { icon: "text-blue-400",    glow: "shadow-[0_0_20px_rgba(59,130,246,0.08)]",  border: "border-blue-500/20" },
  emerald: { icon: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(16,185,129,0.08)]", border: "border-emerald-500/20" },
  amber:   { icon: "text-amber-400",   glow: "shadow-[0_0_20px_rgba(245,158,11,0.08)]", border: "border-amber-500/20" },
  purple:  { icon: "text-purple-400",  glow: "shadow-[0_0_20px_rgba(168,85,247,0.08)]", border: "border-purple-500/20" },
  rose:    { icon: "text-rose-400",    glow: "shadow-[0_0_20px_rgba(244,63,94,0.08)]",  border: "border-rose-500/20" },
  cyan:    { icon: "text-cyan-400",    glow: "shadow-[0_0_20px_rgba(6,182,212,0.08)]",  border: "border-cyan-500/20" },
  gray:    { icon: "text-gray-400",    glow: "",                                          border: "border-white/5" },
}

export default function Panel({
  title,
  icon: Icon,
  color = "gray",
  collapsible = false,
  defaultOpen = true,
  badge,
  actions = [],
  className,
  bodyClassName,
  children,
  noPadding = false,
}: PanelProps) {
  const [open, setOpen] = useState(defaultOpen)
  const colors = colorMap[color]

  return (
    <div
      className={cn(
        "rounded-xl bg-[#0a0a0f] border overflow-hidden transition-all duration-200",
        colors.border,
        colors.glow,
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]",
          collapsible && "cursor-pointer select-none hover:bg-white/[0.04] transition-colors"
        )}
        onClick={collapsible ? () => setOpen(!open) : undefined}
      >
        {Icon && <Icon className={cn("w-4 h-4 shrink-0", colors.icon)} />}
        <span className="text-sm font-semibold text-gray-200 flex-1 tracking-wide">{title}</span>

        {badge !== undefined && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
            {badge}
          </span>
        )}

        {actions.map((action, i) => (
          <button
            key={i}
            title={action.label}
            onClick={(e) => { e.stopPropagation(); action.onClick() }}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <action.icon className="w-3.5 h-3.5" />
          </button>
        ))}

        {collapsible && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-500 transition-transform duration-200",
              !open && "-rotate-90"
            )}
          />
        )}
      </div>

      {/* Body */}
      {open && (
        <div className={cn(!noPadding && "p-3", bodyClassName)}>
          {children}
        </div>
      )}
    </div>
  )
}
