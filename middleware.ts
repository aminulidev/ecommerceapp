import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            // Protect dashboard routes
            if (req.nextUrl.pathname.startsWith("/") && req.nextUrl.pathname !== "/login") {
                return token !== null
            }
            return true
        },
    },
})

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login (login page)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
    ],
}
