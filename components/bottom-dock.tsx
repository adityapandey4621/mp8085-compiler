"use client"

import { useState, ReactNode } from "react"
import { LucideIcon, GripHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface DockTab {
  id: string
  label: string
  icon: LucideIcon
  content: ReactNode
  badge?: string | number
}

interface BottomDockProps {
  tabs: DockTab[]
  defaultTab?: string
  height?: number
  className?: string
}

export default function BottomDock({ tabs, defaultTab, height = 220, className }: BottomDockProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id)

  const activeContent = tabs.find((t) => t.id === activeTab)?.content

  return (
    <div
      className={cn(
        "border-t border-border bg-[#08080c] flex flex-col",
        className
      )}
      style={{ height }}
    >
      {/* Tab Bar */}
      <div className="flex items-center gap-0 border-b border-border bg-muted/30 shrink-0 overflow-x-auto">
        {/* Drag handle / label */}
        <div className="flex items-center gap-1.5 px-3 border-r border-border shrink-0">
          <GripHorizontal className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-[10px] uppercase tracking-widest text-gray-600 font-medium">PANEL</span>
        </div>

        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-r border-border transition-all duration-150 shrink-0 relative",
                isActive
                  ? "text-white bg-white/[0.04]"
                  : "text-gray-500 hover:text-gray-300 hover:bg-muted/50"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-purple-400" : "text-gray-500")} />
              {tab.label}
              {tab.badge !== undefined && (
                <span className="ml-1 text-[10px] font-mono px-1 rounded bg-white/10 text-gray-400">
                  {tab.badge}
                </span>
              )}
              {/* Active indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeContent}
      </div>
    </div>
  )
}

