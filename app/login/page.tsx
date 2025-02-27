"use client"
import { LoginForm } from "@/components/login-form"
import { BackgroundVideo } from "@/components/background-video"

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animated-gradient">
      <BackgroundVideo />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-white/70">Enter your credentials to access the dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

