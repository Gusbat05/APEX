"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from "next-themes"

interface WelcomeTransitionProps {
  fullName: string
}

export function WelcomeTransition({ fullName }: WelcomeTransitionProps) {
  const [show, setShow] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setTimeout(() => setShow(true), 100)

    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true)
    }, 2500)

    const redirectTimer = setTimeout(() => {
      router.push('/')
    }, 3200)

    return () => {
      clearTimeout(fadeOutTimer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className={`w-full max-w-4xl mx-auto px-4 transition-all duration-1000 ease-in-out ${
        show ? 'opacity-100' : 'opacity-0 blur-sm'
      } ${fadeOut ? 'opacity-0 blur-sm' : ''}`}>
        <h1 
          className={`text-3xl md:text-4xl font-bold mb-2 transition-all duration-1000 ease-in-out
            ${show && !fadeOut 
              ? 'opacity-100 translate-x-0 blur-none' 
              : show && fadeOut
                ? 'opacity-0 -translate-x-full blur-sm'
                : 'opacity-0 translate-x-full blur-sm'
            }
            ${resolvedTheme === 'sunset' ? 'text-black' : 'text-primary'}
          `}
        >
          Welcome back
        </h1>
        <h2 
          className={`text-5xl md:text-7xl font-bold transition-all duration-1000 ease-in-out
            ${show && !fadeOut 
              ? 'opacity-100 translate-x-0 blur-none' 
              : show && fadeOut
                ? 'opacity-0 -translate-x-full blur-sm'
                : 'opacity-0 translate-x-full blur-sm'
            }
            ${resolvedTheme === 'sunset' ? 'text-black' : 'text-primary'}
          `}
          style={{
            transitionDelay: show && !fadeOut ? '200ms' : '0ms'
          }}
        >
          {fullName}
        </h2>
      </div>
    </div>
  )
}

