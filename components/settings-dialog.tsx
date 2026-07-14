"use client"

import { useSettings } from "@/components/settings-provider"
import { useTheme } from "next-themes"
import { Settings, Palette, Code2, Cpu, Bug, Layout, Moon, Sun, Monitor, X } from "lucide-react"
import { Rnd } from "react-rnd"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
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
    compactMode, setCompactMode
  } = useSettings()

  if (!open) return null;

  return (
    <Rnd
      default={{
        x: typeof window !== 'undefined' ? window.innerWidth / 2 - 400 : 100,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 - 250 : 100,
        width: 800,
        height: 500,
      }}
      minWidth={500}
      minHeight={300}
      bounds="window"
      dragHandleClassName="settings-drag-handle"
      className="z-[100] bg-background border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col"
    >
      {/* Top Title Bar - Drag Handle */}
      <div className="settings-drag-handle h-12 bg-muted/50 border-b border-border flex items-center justify-between px-4 cursor-move shrink-0">
        <h2 className="text-sm font-semibold flex items-center gap-2 pointer-events-none">
          <Settings className="w-4 h-4 text-muted-foreground" />
          Settings
        </h2>
        <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <Tabs defaultValue="appearance" orientation="vertical" className="flex flex-row flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 sm:w-56 bg-muted/30 border-r border-border flex flex-col shrink-0">
          <TabsList className="flex flex-col h-full bg-transparent p-2 justify-start items-stretch space-y-1">
              <TabsTrigger value="appearance" className="justify-start gap-2 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground">
                <Palette className="w-4 h-4" /> Appearance
              </TabsTrigger>
              <TabsTrigger value="editor" className="justify-start gap-2 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground">
                <Code2 className="w-4 h-4" /> Editor
              </TabsTrigger>
              <TabsTrigger value="engine" className="justify-start gap-2 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground">
                <Cpu className="w-4 h-4" /> Engine
              </TabsTrigger>
              <TabsTrigger value="debugging" className="justify-start gap-2 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground">
                <Bug className="w-4 h-4" /> Debugging
              </TabsTrigger>
              <TabsTrigger value="interface" className="justify-start gap-2 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground">
                <Layout className="w-4 h-4" /> Interface
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-background">
            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-8 mt-0 outline-none w-full">
              <div>
                <h3 className="text-lg font-medium mb-4">Appearance</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">Theme</Label>
                    <div className="flex gap-2">
                      <Button variant={theme === 'light' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('light')} className="flex-1 gap-2">
                        <Sun className="w-4 h-4" /> Light
                      </Button>
                      <Button variant={theme === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('dark')} className="flex-1 gap-2">
                        <Moon className="w-4 h-4" /> Dark
                      </Button>
                      <Button variant={theme === 'system' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('system')} className="flex-1 gap-2">
                        <Monitor className="w-4 h-4" /> System
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">Accent Color</Label>
                    <div className="flex gap-2">
                      {['blue', 'green', 'purple', 'orange'].map(color => (
                        <Button 
                          key={color}
                          variant="outline" 
                          onClick={() => setAccentColor(color)}
                          className={`flex-1 capitalize ${accentColor === color ? 'border-primary ring-1 ring-primary' : ''}`}
                        >
                          <div className={`w-3 h-3 rounded-full mr-2 bg-${color}-500`}></div>
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Editor Tab */}
            <TabsContent value="editor" className="space-y-8 mt-0 outline-none w-full">
              <div>
                <h3 className="text-lg font-medium mb-4">Editor</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Uppercase Mnemonics</Label>
                      <p className="text-xs text-muted-foreground">Automatically convert mvi to MVI while typing</p>
                    </div>
                    <Switch checked={autoUppercase} onCheckedChange={setAutoUppercase} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Syntax Highlighting</Label>
                      <p className="text-xs text-muted-foreground">Enable colors for instructions and registers</p>
                    </div>
                    <Switch checked={syntaxHighlighting} onCheckedChange={setSyntaxHighlighting} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Save Code</Label>
                      <p className="text-xs text-muted-foreground">Saves the current program automatically</p>
                    </div>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>
                  <div className="space-y-3 pt-2">
                    <Label className="text-sm text-muted-foreground">Font Size</Label>
                    <div className="flex gap-2">
                      <Button variant={fontSize === 12 ? 'default' : 'outline'} size="sm" onClick={() => setFontSize(12)} className="flex-1">Small (12px)</Button>
                      <Button variant={fontSize === 14 ? 'default' : 'outline'} size="sm" onClick={() => setFontSize(14)} className="flex-1">Medium (14px)</Button>
                      <Button variant={fontSize === 16 ? 'default' : 'outline'} size="sm" onClick={() => setFontSize(16)} className="flex-1">Large (16px)</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Engine Tab */}
            <TabsContent value="engine" className="space-y-8 mt-0 outline-none w-full">
              <div>
                <h3 className="text-lg font-medium mb-4">Engine</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Reset Before Run</Label>
                      <p className="text-xs text-muted-foreground">Pressing Run automatically resets the CPU first</p>
                    </div>
                    <Switch checked={autoReset} onCheckedChange={setAutoReset} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Debugging Tab */}
            <TabsContent value="debugging" className="space-y-8 mt-0 outline-none w-full">
              <div>
                <h3 className="text-lg font-medium mb-4">Debugging</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Highlight Changed Registers</Label>
                      <p className="text-xs text-muted-foreground">Briefly highlight registers when their value changes</p>
                    </div>
                    <Switch checked={highlightRegisters} onCheckedChange={setHighlightRegisters} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Instruction Trace</Label>
                      <p className="text-xs text-muted-foreground">Show the execution history panel</p>
                    </div>
                    <Switch checked={showInstructionTrace} onCheckedChange={setShowInstructionTrace} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Interface Tab */}
            <TabsContent value="interface" className="space-y-8 mt-0 outline-none w-full">
              <div>
                <h3 className="text-lg font-medium mb-4">Interface</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                    <div className="space-y-0.5">
                      <Label>Restore Last Workspace</Label>
                      <p className="text-xs text-muted-foreground">Reopen the layout exactly as you left it (Always On)</p>
                    </div>
                    <Switch checked={true} disabled={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-xs text-muted-foreground">Reduce spacing to fit more on screen</p>
                    </div>
                    <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                  </div>
                </div>
              </div>
            </TabsContent>
        </div>
      </Tabs>
    </Rnd>
  )
}

