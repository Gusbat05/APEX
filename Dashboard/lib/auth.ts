import { z } from "zod"
import { SignJWT, jwtVerify } from "jose"
import { nanoid } from "nanoid"

// Update User type to use string for office
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  office: OfficeLocation
  password: string
}

export type OfficeLocation = string

// Define office to email mapping with the exact office names from column A
const officeEmailMap: Record<string, string> = {
  "Adose Capital Consulting, Inc.": "jordanadose1@gmail.com",
  "Top Tier Executives, Inc.": "alexjhamjr@gmail.com",
  "Veritas Management, Inc.": "daighn.veritas@gmail.com",
  "Liberty Consulting and Management": "gademaj.business@gmail.com",
  "Synergy Management": "a.puglia1@gmail.com",
  "Wealth Opportunity Power Inc": "a.allahsmith@gmail.com",
}

// Initialize users array with admin and default users with exact office names
const users: User[] = [
  {
    id: "admin",
    email: "admin@apexmetrics.com",
    name: "Admin User",
    role: "admin",
    office: "ALL",
    password: "Admin2024!",
  },
  {
    id: "adose",
    email: "jordanadose1@gmail.com",
    name: "Jordan Adose",
    role: "user",
    office: "Adose Capital Consulting, Inc.",
    password: "Adose2024!",
  },
  {
    id: "toptier",
    email: "alexjhamjr@gmail.com",
    name: "Alex Ham Jr",
    role: "user",
    office: "Top Tier Executives, Inc.",
    password: "TopTier2024!",
  },
  {
    id: "veritas",
    email: "daighn.veritas@gmail.com",
    name: "Daighn Veritas",
    role: "user",
    office: "Veritas Management, Inc.",
    password: "Veritas2024!",
  },
  {
    id: "liberty",
    email: "gademaj.business@gmail.com",
    name: "Gademaj Liberty",
    role: "user",
    office: "Liberty Consulting and Management",
    password: "Liberty2024!",
  },
  {
    id: "synergy",
    email: "a.puglia1@gmail.com",
    name: "A Puglia",
    role: "user",
    office: "Synergy Management",
    password: "Synergy2024!",
  },
  {
    id: "wealth",
    email: "a.allahsmith@gmail.com",
    name: "A Allah Smith",
    role: "user",
    office: "Wealth Opportunity Power Inc",
    password: "Wealth2024!",
  },
]

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
      "Password must contain at least one uppercase letter, one number, and one special character",
    ),
})

// Auth functions
export async function authenticate(email: string, password: string): Promise<User | null> {
  console.log(`Authentication attempt for email: ${email}`)

  // Find user by email (case insensitive)
  const normalizedEmail = email.toLowerCase()
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail)

  if (!user) {
    console.log(`No user found with email: ${email}`)
    return null
  }

  console.log(`User found: ${user.email}, validating password...`)

  // Validate password
  if (password === user.password) {
    console.log(`Password valid for user: ${user.email}`)
    return user
  }

  console.log(`Invalid password for user: ${user.email}`)
  return null
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin"
}

export async function generateToken(user: User): Promise<string> {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined")
  }

  const token = await new SignJWT({
    userId: user.id,
    role: user.role,
    email: user.email,
    office: user.office,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))

  return token
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const normalizedEmail = email.toLowerCase()
  return users.find((user) => user.email.toLowerCase() === normalizedEmail)
}

export async function validatePassword(user: User | undefined, password: string): Promise<boolean> {
  if (!user) return false
  return user.password === password
}

export async function verifyToken(token: string): Promise<any> {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined")
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    return payload
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Debug function to get all users (for development only)
export async function getAllUsers(): Promise<Omit<User, "password">[]> {
  return users.map(({ password, ...user }) => user)
}

