import { NextAuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            username?: string | null
        } & DefaultSession["user"]
    }
}

// Build providers list dynamically — only add Google if credentials are set
const providers: NextAuthOptions["providers"] = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    )
}

providers.push(
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            usernameOrEmail: { label: "Username or Email", type: "text" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.usernameOrEmail || !credentials?.password) {
                throw new Error("Missing credentials")
            }

            try {
                // Check if user exists by email or username
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.usernameOrEmail },
                            { username: credentials.usernameOrEmail }
                        ]
                    }
                })

                if (!user || !user.password) {
                    throw new Error("Invalid credentials")
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials")
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    username: user.username,
                    role: user.role
                } as any
            } catch (error: any) {
                // Re-throw auth errors, wrap DB errors
                if (error.message === "Invalid credentials" || error.message === "Missing credentials") {
                    throw error
                }
                console.error("[auth] DB error during authorize:", error)
                throw new Error("Authentication service unavailable")
            }
        }
    })
)

export const authOptions: NextAuthOptions = {
    // Only use PrismaAdapter when DB is available
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers,
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                // @ts-ignore
                token.role = user.role || "USER"
                // @ts-ignore
                token.username = user.username
            }
            if (trigger === "update" && session?.username) {
                token.username = session.username
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                // @ts-ignore
                session.user.role = token.role as string
                // @ts-ignore
                session.user.username = token.username as string | null
            }
            return session
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
}
