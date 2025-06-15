import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production")

export async function verifyAuth() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin-token")

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token.value, secret)
    return payload
  } catch (error) {
    console.error("Auth verification error:", error)
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const auth = await verifyAuth()
  return auth !== null && auth.role === "admin"
}
