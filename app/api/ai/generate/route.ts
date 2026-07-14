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

    const { prompt: userMessage, context, assistantType, conversationHistory } = body
    const apiKey = process.env.GEMINI_API_KEY

    // Construct the full prompt
    let fullPrompt = `You are an expert 8085 Microprocessor Assembly language tutor/assistant.
CRITICAL 8085 RULES:
1. When providing code, ALWAYS wrap it in \`\`\`assembly ... \`\`\`
2. Use strict standard 8085 opcodes. (e.g., Use XRI to XOR an immediate value, NOT XRA. XRA only takes a register).
3. Use standard semicolons ';' for comments, not // or /* */.
4. Output highly optimized, perfectly valid code.
5. You have full visibility of the user's console errors, registers, and memory via the 'Current Code Context' below. If you see assembly or runtime errors, you should autonomously debug them and provide the fully corrected code. The user has a 1-click 'Apply to Editor' button, so output the complete fixed program when fixing bugs.
6. IMPORTANT: Respond in plain markdown text. DO NOT output raw JSON format (e.g. do not output {"role": "assistant", ...}).
\n`
    if (assistantType) {
        fullPrompt += `Mode: ${assistantType}\n`
    }
    if (context && typeof context === 'object') {
        fullPrompt += `=== CURRENT EMULATOR CONTEXT ===\n`
        if (context.code) fullPrompt += `Code:\n\`\`\`assembly\n${context.code}\n\`\`\`\n\n`
        if (context.registers) fullPrompt += `Registers: ${JSON.stringify(context.registers)}\n`
        if (context.flags) fullPrompt += `Flags: ${JSON.stringify(context.flags)}\n`
        if (context.consoleOutput) fullPrompt += `Console Output: ${JSON.stringify(context.consoleOutput)}\n`
        if (context.isAssembled !== undefined) fullPrompt += `Is Assembled: ${context.isAssembled}\n`
        if (context.isRunning !== undefined) fullPrompt += `Is Running: ${context.isRunning}\n`
        if (context.assembledCode?.errors) fullPrompt += `Assembly Errors: ${JSON.stringify(context.assembledCode.errors)}\n`
        fullPrompt += `=================================\n\n`
    } else if (context) {
        fullPrompt += `Current Code Context:\n${context}\n\n`
    }
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        fullPrompt += `Conversation History:\n`
        conversationHistory.forEach((m: any) => {
            fullPrompt += `${m.role}: ${m.content}\n`
        })
        fullPrompt += `\n`
    }
    fullPrompt += `User Request: ${userMessage}\n`

    try {
        let generatedText = ""

        // Try Gemini First if API key exists
        if (apiKey) {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: fullPrompt }] }]
                        })
                    }
                )

                if (response.ok) {
                    const data = await response.json()
                    generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
                }
            } catch (err) {
                console.error("Gemini failed, falling back to Pollinations", err)
            }
        }

        // Fallback to Free Pollinations API if Gemini failed or is missing
        if (!generatedText) {
            console.log("Using Pollinations API Fallback...")
            const pollinationsResponse = await fetch(`https://text.pollinations.ai/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { role: "user", content: fullPrompt }
                    ]
                })
            })
            
            if (!pollinationsResponse.ok) {
                throw new Error("Both Gemini and Fallback AI engines failed.")
            }
            generatedText = await pollinationsResponse.text()
            
            // In case the free API returns raw JSON (e.g., {"role":"assistant", "reasoning": "...", "content": "..."})
            try {
                const parsed = JSON.parse(generatedText)
                if (parsed.content) generatedText = parsed.content
                else if (parsed.message?.content) generatedText = parsed.message.content
                else if (parsed.response) generatedText = parsed.response
            } catch (e) {
                // Not JSON, keep raw text
            }
        }

        if (!generatedText) {
            throw new Error("AI returned empty response")
        }

        // Update usage
        await prisma.aIUsage.upsert({
            where: { userId: user.id },
            update: { count: { increment: 1 }, lastUsed: new Date() },
            create: { userId: user.id, count: 1 }
        })

        // Return `response` to match the frontend expectations
        return NextResponse.json({ response: generatedText })
    } catch (error) {
        console.error("AI Error:", error)
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
    }
}
