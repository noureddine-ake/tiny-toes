import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production")

export async function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    try {
      const token = request.cookies.get("admin-token")

      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
      }

      await jwtVerify(token.value, secret)
      return NextResponse.next()
    } catch (error) {
      console.error("Middleware auth error:", error)
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
