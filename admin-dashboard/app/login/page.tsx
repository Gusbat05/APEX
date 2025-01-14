"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { mockAuth } from '../utils/mockAuth'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const WelcomeTransition = dynamic(() => import('../components/welcome-transition').then(mod => mod.WelcomeTransition), {
  ssr: false,
  loading: () => <p>Loading...</p>
})

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [fullName, setFullName] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Slow down the video
    }

    // Clear any existing authentication data
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userRole')

    // Trigger the animation after a short delay
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, []);

  useEffect(() => {
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValid(emailRegex.test(email) && password.length >= 6)
  }, [email, password])

  const getHighlightColor = useMemo(() => {
    switch (resolvedTheme) {
      case 'light':
        return {
          bg: 'bg-blue-600 hover:bg-blue-500',
          glow: 'rgba(59, 130, 246, 0.5)'
        }
      case 'dark':
        return {
          bg: 'bg-teal-600 hover:bg-teal-500',
          glow: 'rgba(20, 184, 166, 0.5)'
        }
      case 'midnight':
        return {
          bg: 'bg-purple-600 hover:bg-purple-500',
          glow: 'rgba(168, 85, 247, 0.5)'
        }
      case 'sunset':
        return {
          bg: 'bg-orange-600 hover:bg-orange-500',
          glow: 'rgba(234, 88, 12, 0.5)'
        }
      default:
        return {
          bg: 'bg-blue-600 hover:bg-blue-500',
          glow: 'rgba(59, 130, 246, 0.5)'
        }
    }
  }, [resolvedTheme])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const authResult = mockAuth(email, password)
    if (authResult.success) {
      // Store the user role in localStorage (in a real app, use secure storage methods)
      localStorage.setItem('userRole', authResult.role)
      localStorage.setItem('isAuthenticated', 'true')
      setFullName(authResult.fullName || '')
      setShowTransition(true)
    } else {
      setError('Invalid email or password')
    }
  }, [email, password])

  if (showTransition) {
    return <WelcomeTransition fullName={fullName} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 animated-gradient"></div>
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-5"
        aria-hidden="true"
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abstract-shapes-54uGhFsKFoFtSGm0eLGu3CG7WNsIff.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Card className={`w-full max-w-md relative z-10 backdrop-filter backdrop-blur-sm bg-opacity-80 transition-all duration-700 ease-in-out ${
        isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
      } animate-expand-horizontal text-foreground`}>
        <CardHeader className="space-y-1">
          <div className={`flex justify-center mb-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`} style={{ transitionDelay: '500ms' }}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Apex%20Hex%20Outline-oHENfbYJkEnUg8vtqdNDDq5QI56xvO.png"
              alt="Apex Dashboard Logo"
              width={80}
              height={80}
              className={`transition-opacity duration-300 shine-effect ${
                resolvedTheme === 'dark' ? 'opacity-60 invert' :
                resolvedTheme === 'midnight' ? 'opacity-60 invert' :
                'opacity-80'
              }`}
            />
          </div>
          <CardTitle className={`text-2xl font-bold text-center transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`} style={{ transitionDelay: '600ms' }}>Sign in to Apex Dashboard</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className={`space-y-2 transition-all duration-500 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`} style={{ transitionDelay: '800ms' }}>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-500 origin-left h-10 px-3 py-2"
              />
            </div>
            <div className={`space-y-2 transition-all duration-500 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`} style={{ transitionDelay: '900ms' }}>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all duration-500 origin-left h-10 px-3 py-2"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 w-full">
            <div className={`w-full transition-all duration-500 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`} style={{ transitionDelay: '1000ms' }}>
              <Button 
                type="submit" 
                className={`w-full font-semibold transition-all duration-300 sign-in-button origin-left ${
                  !isValid ? 'opacity-50 cursor-not-allowed' : `${getHighlightColor.bg} hover:shadow-lg`
                }`}
                disabled={!isValid}
                style={{
                  '--glow-color': getHighlightColor.glow,
                  boxShadow: isValid ? '0 0 10px var(--glow-color)' : 'none',
                }}
              >
                Sign In
              </Button>
            </div>
            <div className={`flex flex-col items-start space-y-2 text-sm w-full transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`} style={{ transitionDelay: '1100ms' }}>
              <Link href="/forgot-password" className="text-muted-foreground hover:underline">
                Forgot your password?
              </Link>
              <Link href="/register" className="text-muted-foreground hover:underline">
                Register your account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animated-gradient {
          background: linear-gradient(-45deg, #4a0c5e, #2e1147, #251a5c, #1a2173);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          height: 100vh;
          width: 100vw;
        }

        .bg-opacity-80 {
          --tw-bg-opacity: 0.8;
        }

        @keyframes expandHorizontal {
          0% {
            transform: scaleX(0);
            opacity: 0;
          }
          100% {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        .animate-expand-horizontal {
          animation: expandHorizontal 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .sign-in-button {
          @apply text-primary-foreground;
        }

        .sign-in-button:not(:disabled):hover {
          box-shadow: 0 0 10px var(--glow-color);
          filter: brightness(1.1);
        }

        .origin-left {
          transform-origin: left;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px hsl(var(--background)) inset !important;
          -webkit-text-fill-color: hsl(var(--foreground)) !important;
          caret-color: hsl(var(--foreground));
        }

        @keyframes shine {
          0% {
            mask-position: -100%;
          }
          100% {
            mask-position: 200%;
          }
        }

        .shine-effect {
          mask-image: linear-gradient(
            60deg,
            white 25%,
            rgba(0, 0, 0, 0.7) 50%,
            white 75%
          );
          mask-size: 300%;
          mask-position: 0%;
          animation: shine 5s linear infinite;
        }
      `}</style>
    </div>
  )
}

