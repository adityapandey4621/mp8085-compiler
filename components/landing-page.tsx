"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Cpu, Monitor, Database, Cloud, Zap, BarChart3, Code2, Layers, ArrowRight, Github, Play } from "lucide-react"
import AuthModal from "./auth-modal"
import Link from "next/link"

const features = [
  {
    icon: Monitor,
    title: "Real-time Register Visualization",
    description: "Watch your registers update live as you step through code with smooth animations.",
  },
  {
    icon: Database,
    title: "Memory Mapping",
    description: "Interactive hex-grid memory viewer with execution address highlighting.",
  },
  {
    icon: Cloud,
    title: "Cloud Save",
    description: "Save your programs to the cloud and access them from anywhere.",
  },
  {
    icon: Zap,
    title: "Instant Execution",
    description: "Run and step through your assembly code with blazing fast performance.",
  },
  {
    icon: BarChart3,
    title: "Flag Visualization",
    description: "Clear status flag indicators with tooltips explaining each flag's purpose.",
  },
  {
    icon: Code2,
    title: "Syntax Highlighting",
    description: "Professional code editor with full 8085 assembly syntax support.",
  },
]

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Circuit Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M 0 50 L 40 50 M 60 50 L 100 50 M 50 0 L 50 40 M 50 60 L 50 100"
                stroke="#4a90e2"
                strokeWidth="0.5"
                fill="none"
              />
              <circle cx="50" cy="50" r="3" fill="none" stroke="#4a90e2" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#4a90e2" />
              <circle cx="100" cy="50" r="2" fill="#4a90e2" />
              <circle cx="50" cy="0" r="2" fill="#4a90e2" />
              <circle cx="50" cy="100" r="2" fill="#4a90e2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">MP8085</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">
              About
            </a>
            <a href="https://github.com" className="text-sm text-gray-400 hover:text-white transition-colors">
              GitHub
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openAuth("login")}
              className="text-gray-300 hover:text-white"
            >
              Log in
            </Button>
            <Button size="sm" onClick={() => openAuth("signup")} className="bg-blue-600 hover:bg-blue-500 text-white">
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-32 px-6">
        <div className="container mx-auto text-center max-w-4xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8">
            <Zap className="w-3.5 h-3.5" />
            Now with cloud save and real-time visualization
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
            The Modern{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              8085 Simulator
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
            A cloud-based, visualization-rich emulator for students and engineers. Write, debug, and understand 8085
            assembly like never before.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => openAuth("signup")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 text-base gap-2 group"
            >
              Start Simulation
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Link href="/simulator">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 hover:border-gray-600 hover:bg-white/5 px-8 h-12 text-base gap-2 bg-transparent"
              >
                <Play className="w-4 h-4" />
                Try Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Preview Image */}
        <div className="container mx-auto mt-20 max-w-6xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-1">
            <div className="rounded-lg bg-[#0a0a0f] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-xs text-gray-500 font-mono">simulator.mp8085.app</span>
              </div>
              <div className="aspect-[16/9] bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-8 w-full max-w-4xl opacity-60">
                  <div className="bg-white/5 rounded-lg h-48 border border-white/10" />
                  <div className="bg-white/5 rounded-lg h-48 border border-white/10" />
                  <div className="bg-white/5 rounded-lg h-48 border border-white/10" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-500/20 via-transparent to-cyan-500/20 blur-xl -z-10" />
        </div>
      </section>

      {/* What is MP8085 */}
      <section id="about" className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What is MP8085?</h2>
          <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
            MP8085 is a next-generation cloud-based microprocessor simulator designed specifically for the Intel 8085
            architecture. Whether you're a computer science student learning assembly language or an engineer debugging
            embedded systems, MP8085 provides an intuitive, visualization-rich environment to write, test, and
            understand 8085 assembly code.
          </p>
          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400">50+</div>
              <div className="text-sm text-gray-500 mt-1">Instructions</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400">64KB</div>
              <div className="text-sm text-gray-500 mt-1">Memory</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400">Real-time</div>
              <div className="text-sm text-gray-500 mt-1">Visualization</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to master 8085 assembly programming in one place.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-3xl text-center">
          <Layers className="w-12 h-12 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of students and engineers using MP8085 to master microprocessor programming.
          </p>
          <Button
            size="lg"
            onClick={() => openAuth("signup")}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 text-base gap-2 group"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">MP8085</span>
          </div>
          <div className="text-sm text-gray-500">Built for education. Open for everyone.</div>
          <div className="flex items-center gap-4">
            {/* Social links removed */}
          </div>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} mode={authMode} setMode={setAuthMode} />
    </div>
  )
}
