import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check usage
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { aiUsage: true }
    })

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (user.aiUsage && user.aiUsage.count >= 100) {
        return NextResponse.json({ error: "AI usage limit reached (100 requests per email)" }, { status: 403 })
    }

    const body = await req.json()

    if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.length > 2000) {
        return NextResponse.json({ error: "Invalid prompt. Must be a string under 2000 characters." }, { status: 400 })
    }

    const { prompt } = body
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
        return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to fetch from Gemini")
        }

        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated"

        // Update usage
        await prisma.aIUsage.upsert({
            where: { userId: user.id },
            update: { count: { increment: 1 }, lastUsed: new Date() },
            create: { userId: user.id, count: 1 }
        })

        return NextResponse.json({ text: generatedText })
    } catch (error) {
        console.error("AI Error:", error)
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
    }
}
