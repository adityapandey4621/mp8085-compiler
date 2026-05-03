"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useSettings } from "@/components/settings-provider"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, Type, Code } from "lucide-react"

interface SettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const { fontSize, setFontSize, companionMode, setCompanionMode } = useSettings()
    const { theme, setTheme } = useTheme()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0f] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Customize your simulator experience.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">

                    {/* Appearance Section */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm text-gray-400">Appearance</h4>
                        <div className="flex bg-white/5 p-1 rounded-lg">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTheme("light")}
                                className={`flex-1 gap-2 ${theme === 'light' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Sun className="h-4 w-4" /> Light
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTheme("dark")}
                                className={`flex-1 gap-2 ${theme === 'dark' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Moon className="h-4 w-4" /> Dark
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTheme("system")}
                                className={`flex-1 gap-2 ${theme === 'system' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Monitor className="h-4 w-4" /> System
                            </Button>
                        </div>
                    </div>

                    {/* Editor Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm text-gray-400">Code Editor</h4>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg space-y-4">
                            {/* Font Size Control */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Type className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">Font Size</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-transparent border-white/20 hover:bg-white/10"
                                        onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                                    >
                                        <span className="text-xs">-</span>
                                    </Button>
                                    <span className="w-8 text-center text-sm">{fontSize}px</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 bg-transparent border-white/20 hover:bg-white/10"
                                        onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                                    >
                                        <span className="text-xs">+</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Companion Mode Toggle */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                <div className="flex items-start gap-2">
                                    <Code className="h-4 w-4 text-blue-400 mt-0.5" />
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-medium">Companion Mode</div>
                                        <div className="text-xs text-gray-400">AI-powered code suggestions</div>
                                    </div>
                                </div>
                                <Button
                                    variant={companionMode ? "default" : "outline"}
                                    size="sm"
                                    className={companionMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-transparent border-white/20 text-gray-400 hover:text-white"}
                                    onClick={() => setCompanionMode(!companionMode)}
                                >
                                    {companionMode ? "On" : "Off"}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}
