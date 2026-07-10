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

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
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
            }
        })
    ],
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
