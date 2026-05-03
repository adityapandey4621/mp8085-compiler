"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Cpu, Mail } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SignIn() {
    return (
        <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
            >
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                        <Cpu className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400">
                        Sign in to access your projects and start simulating
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        className="w-full h-12 bg-white text-black hover:bg-gray-100 font-medium text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                        onClick={() => signIn("google", { callbackUrl: "/simulator" })}
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
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#0a0a0f] text-gray-500 rounded-full">Or</span>
                        </div>
                    </div>

                    <Button
                        className="w-full h-12 bg-white/5 text-white hover:bg-white/10 font-medium text-base flex items-center justify-center gap-3 transition-all hover:scale-[1.02] border border-white/10"
                        onClick={() => signIn("credentials", { callbackUrl: "/simulator" })}
                    >
                        <Mail className="w-5 h-5" />
                        Continue as Guest
                    </Button>

                    <div className="text-center text-sm text-gray-500">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-gray-400">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-gray-400">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
