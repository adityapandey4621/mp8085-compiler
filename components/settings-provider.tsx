"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type SettingsContextType = {
    fontSize: number
    setFontSize: (size: number) => void
    companionMode: boolean
    setCompanionMode: (enabled: boolean) => void
    lineNumbers: boolean
    setLineNumbers: (enabled: boolean) => void
    accentColor: string
    setAccentColor: (color: string) => void
    autoUppercase: boolean
    setAutoUppercase: (enabled: boolean) => void
    syntaxHighlighting: boolean
    setSyntaxHighlighting: (enabled: boolean) => void
    autoSave: boolean
    setAutoSave: (enabled: boolean) => void
    autoReset: boolean
    setAutoReset: (enabled: boolean) => void
    highlightRegisters: boolean
    setHighlightRegisters: (enabled: boolean) => void
    showInstructionTrace: boolean
    setShowInstructionTrace: (enabled: boolean) => void
    compactMode: boolean
    setCompactMode: (enabled: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSize] = useState(14)
    const [companionMode, setCompanionMode] = useState(true)
    const [lineNumbers, setLineNumbers] = useState(true)
    const [accentColor, setAccentColor] = useState("blue")
    const [autoUppercase, setAutoUppercase] = useState(true)
    const [syntaxHighlighting, setSyntaxHighlighting] = useState(true)
    const [autoSave, setAutoSave] = useState(true)
    const [autoReset, setAutoReset] = useState(false)
    const [highlightRegisters, setHighlightRegisters] = useState(true)
    const [showInstructionTrace, setShowInstructionTrace] = useState(true)
    const [compactMode, setCompactMode] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem("mp8085-settings")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (parsed.fontSize) setFontSize(parsed.fontSize)
                if (parsed.companionMode !== undefined) setCompanionMode(parsed.companionMode)
                if (parsed.lineNumbers !== undefined) setLineNumbers(parsed.lineNumbers)
                if (parsed.accentColor) setAccentColor(parsed.accentColor)
                if (parsed.autoUppercase !== undefined) setAutoUppercase(parsed.autoUppercase)
                if (parsed.syntaxHighlighting !== undefined) setSyntaxHighlighting(parsed.syntaxHighlighting)
                if (parsed.autoSave !== undefined) setAutoSave(parsed.autoSave)
                if (parsed.autoReset !== undefined) setAutoReset(parsed.autoReset)
                if (parsed.highlightRegisters !== undefined) setHighlightRegisters(parsed.highlightRegisters)
                if (parsed.showInstructionTrace !== undefined) setShowInstructionTrace(parsed.showInstructionTrace)
                if (parsed.compactMode !== undefined) setCompactMode(parsed.compactMode)
            } catch (e) { }
        }
    }, [])

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("mp8085-settings", JSON.stringify({ 
                fontSize, companionMode, lineNumbers, accentColor, autoUppercase, syntaxHighlighting,
                autoSave, autoReset, highlightRegisters, showInstructionTrace, compactMode
            }))
        }
    }, [fontSize, companionMode, lineNumbers, accentColor, autoUppercase, syntaxHighlighting, autoSave, autoReset, highlightRegisters, showInstructionTrace, compactMode, mounted])

    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
            <SettingsContext.Provider value={{ 
                fontSize, setFontSize, companionMode, setCompanionMode, lineNumbers, setLineNumbers,
                accentColor, setAccentColor, autoUppercase, setAutoUppercase, syntaxHighlighting, setSyntaxHighlighting,
                autoSave, setAutoSave, autoReset, setAutoReset, highlightRegisters, setHighlightRegisters,
                showInstructionTrace, setShowInstructionTrace, compactMode, setCompactMode
            }}>
                <div data-accent={accentColor} className={compactMode ? "compact-mode" : ""}>
                    {children}
                </div>
            </SettingsContext.Provider>
        </NextThemesProvider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider")
    }
    return context
}

