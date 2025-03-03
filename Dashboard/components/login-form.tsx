"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { loginSchema } from "@/lib/auth"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"

type FormData = z.infer<typeof loginSchema>

const extendedLoginSchema = loginSchema.extend({
  email: z
    .string()
    .email("Invalid email address")
    .transform((val) => val.toLowerCase()),
  password: z.string().min(8, "Invalid password"),
})

export function LoginForm({ children }: { children?: React.ReactNode }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [emailEmpty, setEmailEmpty] = useState(true)
  const [passwordEmpty, setPasswordEmpty] = useState(true)
  const [emailErrorVisible, setEmailErrorVisible] = useState(false)
  const [passwordErrorVisible, setPasswordErrorVisible] = useState(false)
  const [emailErrorFading, setEmailErrorFading] = useState(false)
  const [passwordErrorFading, setPasswordErrorFading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const hasAnimated = useRef(false)

  const form = useForm<z.infer<typeof extendedLoginSchema>>({
    resolver: zodResolver(extendedLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // This enables validation on change
  })

  // Check form validity whenever form state changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const emailValid = value.email && value.email.includes("@") && value.email.includes(".")
      const passwordValid = value.password && value.password.length >= 8
      setIsFormValid(emailValid && passwordValid)
    })

    return () => subscription.unsubscribe()
  }, [form])

  // Track empty fields
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Handle email field
      if (!value.email || value.email.trim() === "") {
        if (emailErrorVisible) {
          setEmailErrorFading(true)
          setTimeout(() => {
            setEmailErrorVisible(false)
            setEmailErrorFading(false)
          }, 300) // Match the duration of the fadeOut animation
        }
        setEmailEmpty(true)
      } else {
        setEmailEmpty(false)
        if (form.formState.errors.email && !emailErrorVisible && !emailErrorFading) {
          setEmailErrorVisible(true)
        }
      }

      // Handle password field
      if (!value.password || value.password.trim() === "") {
        if (passwordErrorVisible) {
          setPasswordErrorFading(true)
          setTimeout(() => {
            setPasswordErrorVisible(false)
            setPasswordErrorFading(false)
          }, 300) // Match the duration of the fadeOut animation
        }
        setPasswordEmpty(true)
      } else {
        setPasswordEmpty(false)
        if (form.formState.errors.password && !passwordErrorVisible && !passwordErrorFading) {
          setPasswordErrorVisible(true)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form, emailErrorVisible, passwordErrorVisible, emailErrorFading, passwordErrorFading])

  // Add this effect to handle error state changes
  useEffect(() => {
    // For email field
    if (!emailEmpty && form.formState.errors.email && !emailErrorVisible && !emailErrorFading) {
      setEmailErrorVisible(true)
    } else if (emailErrorVisible && (emailEmpty || !form.formState.errors.email)) {
      setEmailErrorFading(true)
      setTimeout(() => {
        setEmailErrorVisible(false)
        setEmailErrorFading(false)
      }, 300)
    }

    // For password field
    if (!passwordEmpty && form.formState.errors.password && !passwordErrorVisible && !passwordErrorFading) {
      setPasswordErrorVisible(true)
    } else if (passwordErrorVisible && (passwordEmpty || !form.formState.errors.password)) {
      setPasswordErrorFading(true)
      setTimeout(() => {
        setPasswordErrorVisible(false)
        setPasswordErrorFading(false)
      }, 300)
    }
  }, [
    form.formState.errors,
    emailEmpty,
    passwordEmpty,
    emailErrorVisible,
    passwordErrorVisible,
    emailErrorFading,
    passwordErrorFading,
  ])

  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => {
      setIsExpanded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  async function onSubmit(data: z.infer<typeof extendedLoginSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      // Log the request
      console.log("Attempting login with email:", data.email)

      let response: Response
      try {
        response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email.trim().toLowerCase(),
            password: data.password,
          }),
        })
      } catch (networkError) {
        console.error("Network error:", networkError)
        throw new Error("Network error occurred. Please check your connection.")
      }

      // Log the response status
      console.log("Response status:", response.status)

      let result
      try {
        result = await response.json()
        console.log("Response data:", result)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        throw new Error("Failed to parse server response")
      }

      if (!response.ok) {
        // Log the error response
        console.error("Login failed:", result)
        throw new Error(result.details || result.error || "Invalid credentials")
      }

      if (!result.user) {
        console.error("Missing user data in response:", result)
        throw new Error("Invalid server response")
      }

      // Store user data
      localStorage.setItem("userRole", result.user.role)
      localStorage.setItem("userOffice", result.user.office)

      // Log successful login
      console.log("Login successful:", result.user)

      // Redirect based on role
      if (result.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("Login error details:", err)

      // Set a user-friendly error message
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.")

      // Log the full error for debugging
      console.error("Full error object:", {
        error: err,
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`transition-opacity duration-100 ${isMounted ? "opacity-100" : "opacity-0"}`}>
      <Card
        className={`w-full max-w-md border-0 bg-white/10 backdrop-blur-xl shadow-lg transform transition-all duration-700 ease-out origin-center ${
          isExpanded ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
      >
        <CardHeader className="p-4">
          {error && <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}
        </CardHeader>
        <CardContent
          className={`space-y-2 px-6 py-4 pt-2 pb-7 transition-all duration-500 delay-1000 ease-out ${
            isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {children}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-white">Email</FormLabel>
                      {(emailErrorVisible || emailErrorFading) && (
                        <p
                          className={`text-xs text-red-400 m-0 p-0 -mt-1 ${emailErrorFading ? "fade-out" : "fade-in"}`}
                        >
                          Invalid email address
                        </p>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full h-10 border border-white/10 bg-white/10 text-white placeholder:text-white/50 rounded-md"
                        disabled={isLoading}
                        autoComplete="email"
                        value={field.value.toLowerCase()}
                        onChange={(e) => {
                          field.onChange(e)
                          const isEmpty = e.target.value.trim() === ""
                          setEmailEmpty(isEmpty)

                          // Check if the field is valid (basic email format check)
                          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)

                          if (isEmpty && emailErrorVisible) {
                            setEmailErrorFading(true)
                            setTimeout(() => {
                              setEmailErrorVisible(false)
                              setEmailErrorFading(false)
                            }, 300)
                          } else if (!isEmpty && isValidEmail && emailErrorVisible) {
                            setEmailErrorFading(true)
                            setTimeout(() => {
                              setEmailErrorVisible(false)
                              setEmailErrorFading(false)
                            }, 300)
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-white">Password</FormLabel>
                      {(passwordErrorVisible || passwordErrorFading) && (
                        <p
                          className={`text-xs text-red-400 m-0 p-0 -mt-1 ${passwordErrorFading ? "fade-out" : "fade-in"}`}
                        >
                          Invalid password
                        </p>
                      )}
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="w-full h-10 border border-white/10 bg-white/10 text-white placeholder:text-white/50 rounded-md pr-10"
                          disabled={isLoading}
                          autoComplete="current-password"
                          onChange={(e) => {
                            field.onChange(e)
                            const isEmpty = e.target.value.trim() === ""
                            setPasswordEmpty(isEmpty)

                            // Check if the password meets minimum requirements
                            const isValidPassword = e.target.value.length >= 8

                            if (isEmpty && passwordErrorVisible) {
                              setPasswordErrorFading(true)
                              setTimeout(() => {
                                setPasswordErrorVisible(false)
                                setPasswordErrorFading(false)
                              }, 300)
                            } else if (!isEmpty && isValidPassword && passwordErrorVisible) {
                              setPasswordErrorFading(true)
                              setTimeout(() => {
                                setPasswordErrorVisible(false)
                                setPasswordErrorFading(false)
                              }, 300)
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 hover:text-white"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={`w-full h-10 transition-all duration-300 text-white ${
                  isFormValid
                    ? "bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-800 animate-gradient hover:shadow-glow"
                    : "bg-gray-500"
                }`}
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <style jsx>{`
        .scale-x-0 {
          transform: scaleX(0);
        }
        .scale-x-100 {
          transform: scaleX(1);
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        .fade-out {
          animation: fadeOut 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

