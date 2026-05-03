"use client"

import { useRef, useState, useEffect } from "react"
import { FileCode } from "lucide-react"
import { useSession } from "next-auth/react"
import { useSettings } from "@/components/settings-provider"

const OPCODES = [
  "MOV", "MVI", "LXI", "LDA", "STA", "LHLD", "SHLD",
  "LDAX", "STAX", "XCHG", "ADD", "ADI", "SUB", "SUI",
  "INR", "DCR", "IN", "OUT", "HLT", "JMP", "JC", "JNC", "JZ", "JNZ",
  "CALL", "RET", "RST", "PUSH", "POP", "XTHL", "SPHL", "EI", "DI", "NOP"
]

interface CodeEditorProps {
  code: string
  setCode: (code: string) => void
  activeLine: number | null
}

export default function CodeEditor({ code, setCode, activeLine }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { data: session } = useSession()
  const { fontSize, companionMode } = useSettings()
  const [suggestion, setSuggestion] = useState<string | null>(null)

  // Identify guest user
  // @ts-ignore
  const isGuest = session?.user?.id === "guest-user"
  const enableCompanion = companionMode && !isGuest

  const lines = code.split("\n")

  // Simple syntax highlighting regex
  const highlightSyntax = (line: string) => {
    // Comments
    if (line.trim().startsWith(";")) return <span className="text-gray-500">{line}</span>

    // Split by words but keep delimiters
    const parts = line.split(/(\s+|;.*)/)
    return parts.map((part, i) => {
      if (part.trim().startsWith(";")) return <span key={i} className="text-gray-500">{part}</span>
      if (OPCODES.includes(part.toUpperCase())) return <span key={i} className="text-blue-400 font-bold">{part}</span>
      if (part.match(/^[0-9A-Fa-f]+H?$/)) return <span key={i} className="text-orange-400">{part}</span>
      if (part.match(/^[A-Z]$/)) return <span key={i} className="text-yellow-400">{part}</span>
      return <span key={i} className="text-gray-200">{part}</span>
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setCode(newCode)

    if (!enableCompanion) return

    // Check for suggestion
    const cursorPosition = e.target.selectionStart
    const textBeforeCursor = newCode.slice(0, cursorPosition)
    const lines = textBeforeCursor.split("\n")
    const currentLine = lines[lines.length - 1]
    const lastWord = currentLine.split(/\s+/).pop()?.toUpperCase()

    if (lastWord && lastWord.length >= 2) {
      const match = OPCODES.find(op => op.startsWith(lastWord) && op !== lastWord)
      setSuggestion(match || null)
    } else {
      setSuggestion(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestion && (e.key === "Tab" || e.key === "Enter")) {
      e.preventDefault()
      const cursorPosition = textareaRef.current?.selectionStart || 0
      const textBeforeCursor = code.slice(0, cursorPosition)
      const textAfterCursor = code.slice(cursorPosition)
      const lines = textBeforeCursor.split("\n")
      const currentLine = lines[lines.length - 1]
      const lastWord = currentLine.split(/\s+/).pop() || ""

      const newText = textBeforeCursor.slice(0, -lastWord.length) + suggestion + textAfterCursor
      setCode(newText)
      setSuggestion(null)

      // Move cursor after inserted word
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = cursorPosition - lastWord.length + suggestion.length
          textareaRef.current.selectionStart = newCursorPos
          textareaRef.current.selectionEnd = newCursorPos
        }
      }, 0)
    }
  }

  return (
    <div className="flex-1 rounded-lg bg-[#0a0a0f] border border-white/5 overflow-hidden flex flex-col min-h-[300px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <FileCode className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-gray-300">program.asm</span>
      </div>

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div className="py-3 px-2 bg-white/[0.01] border-r border-white/5 select-none">
          {lines.map((_, i) => (
            <div
              key={i}
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.5em' }}
              className={`px-2 font-mono text-right min-w-[2.5rem] transition-colors ${activeLine === i + 1 ? "text-blue-400 bg-blue-500/10" : "text-gray-600"
                }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 relative">
          {/* Highlight Layer */}
          <div className="absolute inset-0 py-3 pointer-events-none">
            {lines.map((_, i) => (
              <div
                key={i}
                className={`h-6 transition-colors duration-200 ${activeLine === i + 1 ? "bg-blue-500/10 border-l-2 border-blue-400" : ""
                  }`}
              />
            ))}
          </div>

          {/* Syntax Highlight Layer */}
          <div
            className="absolute inset-0 p-3 font-mono text-gray-200 pointer-events-none whitespace-pre"
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.5em' }}
          >
            {lines.map((line, i) => (
              <div key={i} className="h-[1.5em]">{highlightSyntax(line)}</div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.5em' }}
            className="absolute inset-0 w-full h-full p-3 font-mono bg-transparent text-transparent caret-white resize-none focus:outline-none"
            spellCheck={false}
            placeholder="; Write your 8085 assembly code here..."
          />

          {/* Suggestion Tooltip */}
          {suggestion && (
            <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-bottom-2">
              Press Tab to complete: <span className="font-bold">{suggestion}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
