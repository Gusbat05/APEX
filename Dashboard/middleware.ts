import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"
import { getOffices } from "./lib/googleSheets"

export async function middleware(request: NextRequest) {
  try {
    // Verify token and get user data
    const token = request.cookies.get("auth-token")?.value

    let userRole: string | null = null
    let userOffice: string | null = null

    if (token) {
      try {
        const userData = await verifyToken(token)
        userRole = userData?.role || null
        userOffice = userData?.office || null
      } catch (error) {
        console.error("Token verification error:", error)
        // Clear invalid token
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("auth-token")
        return response
      }
    }

    // Allow access to /login and /register for all users
    if (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) {
      return NextResponse.next()
    }

    // Redirect unauthenticated users to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Redirect non-admin users from /admin to home page
    if (userRole !== "admin" && request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Add office validation for non-admin users
    if (userRole !== "admin" && userOffice) {
      try {
        const validOffices = await getOffices()
        if (!validOffices.includes(userOffice)) {
          const response = NextResponse.redirect(new URL("/login", request.url))
          response.cookies.delete("auth-token")
          return response
        }
      } catch (error) {
        console.error("Error validating office:", error)
      }
    }

    // Allow access to all other routes
    const response = NextResponse.next()

    // Set client-side accessible cookies for role and office
    if (userRole) {
      response.cookies.set("user-role", userRole, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
      })
    }

    if (userOffice) {
      response.cookies.set("user-office", userOffice, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
      })
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of any error, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

