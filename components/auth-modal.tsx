"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Cpu } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "login" | "signup"
  setMode: (mode: "login" | "signup") => void
}

export default function AuthModal({ open, onOpenChange, mode, setMode }: AuthModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleOAuth = async (provider: string) => {
    setError("")
    setLoading(true)
    await signIn(provider, { callbackUrl: "/simulator" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0a0a0f]/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden">
        {/* Glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

        <div className="relative p-6">
          <DialogHeader className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </DialogTitle>
            <p className="text-sm text-gray-400 mt-1">
              {mode === "login" ? "Sign in to continue to MP8085" : "Get started with MP8085 for free"}
            </p>
          </DialogHeader>

          {/* Error message zone */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-11 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 gap-3"
              onClick={() => handleOAuth("google")}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative flex items-center py-2">
              <div className="grow border-t border-white/10"></div>
              <span className="shrink-0 px-2 text-xs text-gray-500 font-medium">OR</span>
              <div className="grow border-t border-white/10"></div>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 gap-3"
              onClick={() => handleOAuth("credentials")}
              disabled={loading}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Continue as Guest
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
