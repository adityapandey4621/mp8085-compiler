"use client"

import { useSession } from "next-auth/react"
import SimulatorNav from "@/components/simulator-nav"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Code, User, Mail, Calendar, Settings } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-background text-white flex flex-col">
                <SimulatorNav />
                <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center flex-1">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Not Signed In</h2>
                        <p className="text-gray-400 mb-6">Please sign in to view your profile and credentials.</p>
                        <Button asChild className="bg-blue-600 hover:bg-blue-500">
                            <a href="/auth/signin">Sign In</a>
                        </Button>
                    </motion.div>
                </main>
            </div>
        )
    }

    const { user } = session
    // Get first letter of name or username, or email
    const initial = (user?.name?.[0] || user?.username?.[0] || user?.email?.[0] || "U").toUpperCase()

    return (
        <div className="min-h-screen bg-background text-white flex flex-col">
            <SimulatorNav />
            <main className="container mx-auto px-4 py-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 p-8 rounded-2xl bg-white/5 border border-border/60 backdrop-blur-sm"
                >
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            {user?.image ? (
                                <img src={user.image} alt={user.name || "User"} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <span className="text-4xl font-bold text-white">{initial}</span>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-[#0a0a0f]" title="Online"></div>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            {user?.name || "User"}
                        </h1>
                        <p className="text-blue-400 font-medium mb-1">
                            @{user?.username || user?.email?.split('@')[0] || "student"}
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                            <Badge variant="secondary" className="bg-white/10 text-gray-300 hover:bg-white/20">
                                Level 1 • Novice Engineer
                            </Badge>
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                                {user?.role || "USER"}
                            </Badge>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="md:col-span-1 space-y-6"
                    >
                        <Card className="bg-background border-border/60 shadow-xl overflow-hidden">
                            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Settings className="w-5 h-5 text-gray-400" />
                                    Account Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Email Address</span>
                                    <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 p-2 rounded">
                                        <Mail className="w-4 h-4 text-blue-400" />
                                        {user?.email || "Not provided"}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Username</span>
                                    <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 p-2 rounded">
                                        <User className="w-4 h-4 text-purple-400" />
                                        {user?.username || "Not provided"}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <Card className="bg-background border-border/60 shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Trophy className="w-5 h-5 text-yellow-400" />
                                    Badges & Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-3">
                                    <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
                                        <Badge variant="secondary" className="px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm">
                                            🌟 First Code
                                        </Badge>
                                    </motion.div>
                                    <Badge variant="outline" className="px-3 py-1.5 text-gray-500 border-gray-700 bg-gray-900/50 text-sm">
                                        🔒 Interrupt Master
                                    </Badge>
                                    <Badge variant="outline" className="px-3 py-1.5 text-gray-500 border-gray-700 bg-gray-900/50 text-sm">
                                        🔒 Memory Wizard
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-background border-border/60 shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Code className="w-5 h-5 text-green-400" />
                                    Learning Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="p-4 rounded-lg bg-white/5 border border-border/60 flex justify-between items-center transition-all hover:bg-white/10">
                                        <div className="flex flex-col">
                                            <span className="font-medium">1. Add two 8-bit numbers</span>
                                            <span className="text-xs text-gray-400 mt-1">Basic Arithmetic</span>
                                        </div>
                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
                                    </div>
                                    <div className="p-4 rounded-lg bg-white/5 border border-border/60 flex justify-between items-center transition-all hover:bg-white/10 opacity-75">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-300">2. Find largest number</span>
                                            <span className="text-xs text-gray-500 mt-1">Comparisons & Jumps</span>
                                        </div>
                                        <Badge variant="outline" className="text-gray-500 border-gray-700 bg-gray-900/50">Pending</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}

