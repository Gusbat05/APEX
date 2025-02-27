import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Clear the auth token cookie
  cookies().delete("auth-token")

  // Clear the user role cookie
  cookies().delete("user-role")

  return NextResponse.json({ message: "Logged out successfully" })
}

