import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const token = cookies().get("auth-token")?.value

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return new NextResponse("Invalid token", { status: 401 })
    }

    return NextResponse.json({
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      office: payload.office,
    })
  } catch (error) {
    console.error("Error in /api/auth/me:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

