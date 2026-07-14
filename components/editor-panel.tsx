"use client"

import { useState } from "react"
import { Code, Binary, FileCode, Upload } from "lucide-react"

interface EditorPanelProps {
  code: string
  setCode: (code: string) => void
}

const tabs = [
  { id: "assembly", label: "Assembly Code", icon: Code },
  { id: "hex", label: "Hex Code", icon: Binary },
  { id: "samples", label: "Sample Programs", icon: FileCode },
  { id: "upload", label: "Upload", icon: Upload },
]

export default function EditorPanel({ code, setCode }: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState("assembly")

  const lines = code.split("\n")

  return (
    <div className="bg-background/90 border border-border rounded-2xl overflow-hidden backdrop-blur-xl flex-1 animate-slide-right">
      {/* Tabs */}
      <div className="flex border-b border-border bg-[#0d0d12]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
              activeTab === tab.id ? "text-[#00F5FF]" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00F5FF] transition-all duration-300"
                style={{ boxShadow: "0 0 10px #00F5FF, 0 0 20px #00F5FF" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Editor Body */}
      <div className="flex h-[300px] overflow-hidden">
        {/* Line Numbers */}
        <div className="bg-[#080810] px-3 py-4 text-right select-none border-r border-border">
          {lines.map((_, i) => (
            <div key={i} className="text-xs text-gray-600 font-mono leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-transparent p-4 font-mono text-sm text-[#2AFFAE] leading-6 resize-none focus:outline-none placeholder:text-gray-700"
          placeholder="; Enter your 8085 assembly code here..."
          spellCheck={false}
          style={{
            textShadow: "0 0 8px rgba(42, 255, 174, 0.3)",
          }}
        />
      </div>
    </div>
  )
}

