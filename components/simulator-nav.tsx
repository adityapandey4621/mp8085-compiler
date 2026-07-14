"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Cpu, Settings, LogOut, User, LogIn, Menu, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import SettingsDialog from "@/components/settings-dialog"

export default function SimulatorNav() {
  const { data: session } = useSession()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 h-14 flex items-center justify-between gap-4 max-w-[1800px] mx-auto">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-sm">
              <Cpu className="w-4 h-4 text-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-foreground tracking-tight">MP8085</span>
              <span className="text-[10px] text-muted-foreground tracking-wide hidden sm:block">Microprocessor Simulator</span>
            </div>
          </Link>

          {/* ── Center nav links (desktop) ──────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {["Simulator", "Documentation", "Examples"].map((item) => (
              <Link
                key={item}
                href={item === "Simulator" ? "/simulator" : `/${item.toLowerCase()}`}
                className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* ── Right actions ────────────────────────────────────── */}
          <div className="flex items-center gap-1.5">
            {/* Settings button (desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setSettingsOpen(true)}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>

            {/* User dropdown or Sign in */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 overflow-hidden border border-border"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  {/* User info */}
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {/* @ts-ignore */}
                      {session.user?.username ? `@${session.user.username}` : session.user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" /> Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setSettingsOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 text-muted-foreground"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* ── Mobile menu ─────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1 animate-slide-down">
            {["Simulator", "Documentation", "Examples"].map((item) => (
              <Link
                key={item}
                href={item === "Simulator" ? "/simulator" : `/${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                {item}
              </Link>
            ))}
            <button
              onClick={() => { setSettingsOpen(true); setMobileMenuOpen(false) }}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-left"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
        )}
      </nav>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
