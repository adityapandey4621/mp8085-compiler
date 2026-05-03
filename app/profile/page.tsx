import SimulatorNav from "@/components/simulator-nav"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Code } from "lucide-react"

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col">
            <SimulatorNav />
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-400">U</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">User Profile</h1>
                        <p className="text-gray-400">Level 1 • Novice Engineer</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-[#0a0a0f] border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                Badges
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                                    First Code
                                </Badge>
                                <Badge variant="outline" className="text-gray-500 border-gray-700">
                                    Interrupt Master (Locked)
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0a0a0f] border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Code className="w-5 h-5 text-green-400" />
                                Challenges
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="p-3 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                                    <span>1. Add two 8-bit numbers</span>
                                    <Badge className="bg-green-500/20 text-green-400">Completed</Badge>
                                </div>
                                <div className="p-3 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                                    <span>2. Find largest number</span>
                                    <Badge variant="outline" className="text-gray-400">Pending</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
