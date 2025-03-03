"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { OfficeLocation } from "@/lib/auth"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  office: OfficeLocation
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkLoggedIn = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)

          // Safely store role and office in cookies instead of localStorage
          document.cookie = `user-role=${userData.role}; path=/`
          document.cookie = `user-office=${userData.office}; path=/`
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      setUser(data.user)

      // Store role and office in cookies instead of localStorage
      document.cookie = `user-role=${data.user.role}; path=/`
      document.cookie = `user-office=${data.user.office}; path=/`

      router.push(data.user.role === "admin" ? "/admin/dashboard" : "/dashboard")
    } catch (error) {
      throw error instanceof Error ? error : new Error("Login failed")
    }
  }

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })

      if (response.ok) {
        setUser(null)

        // Clear cookies
        document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
        document.cookie = "user-office=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

        router.push("/login")
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

