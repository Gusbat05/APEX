"use client"
import { LoginForm } from "@/components/login-form"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const [logoAnimation, setLogoAnimation] = useState("translate-y-[-50px] opacity-0")
  const [textAnimation, setTextAnimation] = useState("opacity-0")

  useEffect(() => {
    // First, start logo fade in from above after card expansion
    const logoFadeInTimer = setTimeout(() => {
      setLogoAnimation("translate-y-0 opacity-100 transition-all duration-1000 ease-out")
    }, 1500) // Start after card is expanded

    // Then slide logo to the left
    const logoSlideTimer = setTimeout(() => {
      setLogoAnimation("translate-y-0 -translate-x-[135%] opacity-100 transition-all duration-1000 ease-in-out")
    }, 2500) // Start after logo is visible

    // Finally fade in the text
    const textTimer = setTimeout(() => {
      setTextAnimation("opacity-100")
    }, 3000) // Start after logo has started sliding

    return () => {
      clearTimeout(logoFadeInTimer)
      clearTimeout(logoSlideTimer)
      clearTimeout(textTimer)
    }
  }, [])

  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 animated-gradient bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-[0.07]">
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abstract-shapes-XsRmg1ltH7e1vjXt4fS8tF7RlosU2J.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="w-full max-w-md">
          <LoginForm>
            <div className="mb-4 text-center overflow-hidden">
              <div className="flex items-center justify-center relative w-full">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/APEX%20DASH-5lEKnZU5SRKYFBNTa5oi5fJ9kdT6JB.png"
                  alt="Apex Dash Logo"
                  className={`h-24 w-24 transition-all duration-1000 ease-out transform ${logoAnimation}`}
                />
                <div className="absolute left-[32%] w-[68%] overflow-hidden">
                  <h1
                    className={`text-3xl font-bold text-white whitespace-nowrap transition-all duration-500 ease-in-out transform ${
                      textAnimation
                    }`}
                  >
                    Apex Dashboard
                  </h1>
                </div>
              </div>
            </div>
          </LoginForm>
        </div>
      </div>
      <div className="absolute bottom-2 w-full flex flex-col items-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Apex%20Hex%20Outline-0SmrfNvxTk7ZTmU0X6vNDPZiFWpyCD.png"
          alt="Old Apex Logo"
          className="h-8 w-8 mb-2 opacity-50 invert"
        />
        <div className="text-white/50 text-xs">© 2025 Apex Metrics LLC. All rights reserved.</div>
      </div>
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient {
          background-size: 200% 200%;
          animation: gradientAnimation 15s ease infinite;
        }
      `}</style>
    </>
  )
}

