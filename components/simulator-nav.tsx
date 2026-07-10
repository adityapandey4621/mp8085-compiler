"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Cpu, Save, FolderOpen, Settings, HelpCircle, LogOut, User, LogIn } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { SettingsDialog } from "@/components/settings-dialog"

export default function SimulatorNav() {
  const { data: session } = useSession()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <nav className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight">MP8085</span>
        </Link>

        {/* Center Actions */}
        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-2 h-8">
            <FolderOpen className="w-4 h-4" />
            Open
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-2 h-8">
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link href="/documentation">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white h-8 w-8">
              <HelpCircle className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white h-8 w-8"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-blue-500/20 hover:bg-blue-500/30 overflow-hidden">
                  {session.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-blue-400" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#0a0a0f] border-white/10">
                <div className="px-2 py-1.5 text-sm truncate">
                  <div className="text-gray-200 font-medium">{session.user?.name || "User"}</div>
                  <div className="text-gray-500 text-xs">
                    {session.user?.username ? `@${session.user.username}` : session.user?.email}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <Link href="/profile">
                  <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-white/5 cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="text-gray-300 focus:text-white focus:bg-white/5 cursor-pointer"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="text-gray-300 focus:text-white focus:bg-white/5 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/signin">
              <Button
                variant="default"
                size="sm"
                className="h-8 bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </nav>
  )
}
