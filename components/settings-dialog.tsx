"use client"

import { useSettings } from "@/components/settings-provider"
import { useTheme } from "next-themes"
import {
  Settings, Palette, Code2, Cpu, Bug, Layout,
  Moon, Sun, Monitor, X, Check
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

/* ── Sidebar nav items ───────────────────────────────────────────────── */
type Tab = "appearance" | "editor" | "engine" | "debugging" | "interface"

const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "editor",     label: "Editor",     icon: Code2   },
  { id: "engine",     label: "Engine",     icon: Cpu     },
  { id: "debugging",  label: "Debugging",  icon: Bug     },
  { id: "interface",  label: "Interface",  icon: Layout  },
]

/* ── Small reusable pieces ───────────────────────────────────────────── */
function SettingRow({
  label,
  description,
  children,
  disabled,
}: {
  label: string
  description?: string
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <div className={cn(
      "flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0",
      disabled && "opacity-50 cursor-not-allowed pointer-events-none"
    )}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground leading-tight">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 mt-1">
      {children}
    </h3>
  )
}

/* ── Main Component ──────────────────────────────────────────────────── */
export default function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { theme, setTheme } = useTheme()
  const {
    accentColor, setAccentColor,
    autoUppercase, setAutoUppercase,
    syntaxHighlighting, setSyntaxHighlighting,
    autoSave, setAutoSave,
    fontSize, setFontSize,
    autoReset, setAutoReset,
    highlightRegisters, setHighlightRegisters,
    showInstructionTrace, setShowInstructionTrace,
    compactMode, setCompactMode,
  } = useSettings()

  const [activeTab, setActiveTab] = useState<Tab>("appearance")

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onOpenChange])

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  const ACCENT_COLORS = [
    { id: "blue",   label: "Blue",   cls: "bg-blue-500"   },
    { id: "green",  label: "Green",  cls: "bg-green-500"  },
    { id: "purple", label: "Purple", cls: "bg-purple-500" },
    { id: "orange", label: "Orange", cls: "bg-orange-500" },
  ]

  const FONT_SIZES = [
    { value: 12, label: "Small",  sub: "12px" },
    { value: 14, label: "Medium", sub: "14px" },
    { value: 16, label: "Large",  sub: "16px" },
  ]

  return (
    /* Backdrop */
    <div
      className="settings-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false) }}
    >
      {/* Dialog Box */}
      <div
        className={cn(
          "relative w-full max-w-2xl max-h-[90vh] flex flex-col",
          "bg-background border border-border rounded-xl shadow-2xl",
          "animate-scale-in overflow-hidden"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        {/* ── Title Bar ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Settings</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body: Sidebar + Content ────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* Sidebar */}
          <nav className="w-44 shrink-0 border-r border-border bg-muted/30 p-2 flex flex-col gap-0.5 overflow-y-auto">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-all",
                  activeTab === id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* ── APPEARANCE ────────────────────────────────────────── */}
            {activeTab === "appearance" && (
              <div>
                <SectionTitle>Appearance</SectionTitle>

                {/* Theme */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-foreground mb-3 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "light",  label: "Light",  Icon: Sun     },
                      { id: "dark",   label: "Dark",   Icon: Moon    },
                      { id: "system", label: "System", Icon: Monitor },
                    ].map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        onClick={() => setTheme(id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all text-sm font-medium",
                          theme === id
                            ? "border-primary bg-primary/8 text-primary"
                            : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {label}
                        {theme === id && (
                          <span className="absolute top-1.5 right-1.5">
                            <Check className="w-3 h-3 text-primary" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">Accent Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {ACCENT_COLORS.map(({ id, label, cls }) => (
                      <button
                        key={id}
                        onClick={() => setAccentColor(id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all text-xs font-medium",
                          accentColor === id
                            ? "border-primary bg-primary/8 text-foreground"
                            : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                        )}
                      >
                        <span className={cn("w-5 h-5 rounded-full", cls)} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── EDITOR ────────────────────────────────────────────── */}
            {activeTab === "editor" && (
              <div>
                <SectionTitle>Editor</SectionTitle>

                <SettingRow
                  label="Auto Uppercase Mnemonics"
                  description="Automatically convert mvi → MVI while typing"
                >
                  <Switch checked={autoUppercase} onCheckedChange={setAutoUppercase} />
                </SettingRow>

                <SettingRow
                  label="Syntax Highlighting"
                  description="Color instructions, registers, and hex values"
                >
                  <Switch checked={syntaxHighlighting} onCheckedChange={setSyntaxHighlighting} />
                </SettingRow>

                <SettingRow
                  label="Auto Save Code"
                  description="Saves program to localStorage automatically"
                >
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </SettingRow>

                {/* Font Size */}
                <div className="pt-3">
                  <Label className="text-sm font-medium text-foreground mb-3 block">Font Size</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {FONT_SIZES.map(({ value, label, sub }) => (
                      <button
                        key={value}
                        onClick={() => setFontSize(value)}
                        className={cn(
                          "flex flex-col items-center gap-0.5 py-3 px-2 rounded-lg border-2 transition-all",
                          fontSize === value
                            ? "border-primary bg-primary/8 text-primary"
                            : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                        )}
                      >
                        <span className="text-sm font-semibold">{label}</span>
                        <span className="text-xs opacity-70">{sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── ENGINE ────────────────────────────────────────────── */}
            {activeTab === "engine" && (
              <div>
                <SectionTitle>Engine</SectionTitle>
                <SettingRow
                  label="Auto Reset Before Run"
                  description="Pressing Run automatically resets the CPU state first"
                >
                  <Switch checked={autoReset} onCheckedChange={setAutoReset} />
                </SettingRow>
              </div>
            )}

            {/* ── DEBUGGING ─────────────────────────────────────────── */}
            {activeTab === "debugging" && (
              <div>
                <SectionTitle>Debugging</SectionTitle>
                <SettingRow
                  label="Highlight Changed Registers"
                  description="Flash registers briefly when their value changes"
                >
                  <Switch checked={highlightRegisters} onCheckedChange={setHighlightRegisters} />
                </SettingRow>
                <SettingRow
                  label="Instruction Trace Panel"
                  description="Show the execution history tab in the console dock"
                >
                  <Switch checked={showInstructionTrace} onCheckedChange={setShowInstructionTrace} />
                </SettingRow>
              </div>
            )}

            {/* ── INTERFACE ─────────────────────────────────────────── */}
            {activeTab === "interface" && (
              <div>
                <SectionTitle>Interface</SectionTitle>
                <SettingRow
                  label="Restore Last Workspace"
                  description="Reopen layout exactly as you left it (always on)"
                  disabled
                >
                  <Switch checked disabled />
                </SettingRow>
                <SettingRow
                  label="Compact Mode"
                  description="Reduce spacing to fit more panels on smaller screens"
                >
                  <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                </SettingRow>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-end px-5 py-3 border-t border-border bg-muted/20">
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 px-5 text-sm"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
