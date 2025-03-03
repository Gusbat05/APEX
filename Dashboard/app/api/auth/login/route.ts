import { NextResponse } from "next/server"
import { authenticate, loginSchema, generateToken, getAllUsers } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    console.log("Login attempt received")

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body received:", { email: body.email })
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    // Debug: Log available users in non-production
    if (process.env.NODE_ENV !== "production") {
      const users = await getAllUsers()
      console.log("Available users:", users)
    }

    // Validate request body
    try {
      const validatedData = loginSchema.parse(body)
      body.email = validatedData.email // Use normalized email
    } catch (validationError) {
      console.error("Validation error:", validationError)
      return NextResponse.json(
        {
          error: "Invalid email or password format",
          details: validationError instanceof Error ? validationError.message : "Validation failed",
        },
        { status: 400 },
      )
    }

    // Authenticate user
    const user = await authenticate(body.email, body.password)

    if (!user) {
      console.log("Authentication failed for email:", body.email)
      return NextResponse.json(
        {
          error: "Invalid email or password",
          details: "The provided credentials are incorrect",
        },
        { status: 401 },
      )
    }

    console.log("User authenticated successfully:", { email: user.email, role: user.role })

    // Generate JWT token
    const token = await generateToken(user)

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    }

    // Set cookies
    cookies().set("auth-token", token, cookieOptions)
    cookies().set("user-role", user.role, { ...cookieOptions, httpOnly: false })
    cookies().set("user-office", user.office, { ...cookieOptions, httpOnly: false })

    console.log("Login successful, cookies set for:", { email: user.email, role: user.role })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        office: user.office,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Login failed",
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

