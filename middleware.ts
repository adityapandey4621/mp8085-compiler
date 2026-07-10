import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/auth/signin",
    },
})

export const config = {
    matcher: [
        "/simulator/:path*",
        "/settings/:path*",
        "/profile/:path*",
        "/api/code/:path*",
        "/api/ai/generate/:path*"
    ],
}
