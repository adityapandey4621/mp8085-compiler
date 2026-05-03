"use client"

import { useState, useEffect } from "react"

type SimulatorSettings = {
    theme: "dark" | "light" | "system"
    editorFontSize: number
    simulatorSpeed: "slow" | "normal" | "fast"
    defaultAddress: string
    numberFormat: "hex" | "decimal"
    soundEnabled: boolean
    autoSave: boolean
    hapticFeedback: boolean
    showGridUpdates: boolean
    highContrast: boolean
}

const defaultSettings: SimulatorSettings = {
    theme: "dark",
    editorFontSize: 14,
    simulatorSpeed: "normal",
    defaultAddress: "2000",
    numberFormat: "hex",
    soundEnabled: true,
    autoSave: true,
    hapticFeedback: false,
    showGridUpdates: true,
    highContrast: false,
}

export function useSettings() {
    const [settings, setSettings] = useState<SimulatorSettings>(defaultSettings)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem("mp8085_settings")
        if (saved) {
            try {
                setSettings({ ...defaultSettings, ...JSON.parse(saved) })
            } catch (e) {
                console.error("Failed to parse settings", e)
            }
        }
        setMounted(true)
    }, [])

    const updateSettings = (newSettings: Partial<SimulatorSettings>) => {
        const updated = { ...settings, ...newSettings }
        setSettings(updated)
        localStorage.setItem("mp8085_settings", JSON.stringify(updated))

        // Apply theme immediately if needed (though standard next-themes might handle this better, 
        // this is for simulator specific overrides if any)
    }

    return { settings, updateSettings, mounted }
}
