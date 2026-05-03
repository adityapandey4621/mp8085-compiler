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
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSize] = useState(14)
    const [companionMode, setCompanionMode] = useState(true)
    const [lineNumbers, setLineNumbers] = useState(true)
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
            } catch (e) { }
        }
    }, [])

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("mp8085-settings", JSON.stringify({ fontSize, companionMode, lineNumbers }))
        }
    }, [fontSize, companionMode, lineNumbers, mounted])

    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
            <SettingsContext.Provider value={{ fontSize, setFontSize, companionMode, setCompanionMode, lineNumbers, setLineNumbers }}>
                {children}
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
