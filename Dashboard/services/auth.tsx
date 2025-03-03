import { cookies } from "next/headers"
import { generateToken, findUserByEmail, validatePassword } from "@/lib/auth"

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email)
  const isValidPassword = await validatePassword(user, password)

  if (!isValidPassword) {
    throw new Error("Invalid credentials")
  }

  const token = generateToken(user)

  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 86400, // 1 day
    path: "/",
  })

  return { user }
}

