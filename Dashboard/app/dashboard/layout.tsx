"use client"

import { Sidebar } from "@/components/sidebar"
import { BackgroundVideo } from "@/components/background-video"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react" // Added import for React

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentTheme, setCurrentTheme] = useState(["#1a237e", "#311b92", "#4a148c", "#880e4f"])
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole === "admin") {
      router.push("/admin/dashboard")
    }

    const handleThemeChange = (event: CustomEvent<string[]>) => {
      setCurrentTheme(event.detail)
    }

    window.addEventListener("themeChanged" as any, handleThemeChange)

    return () => {
      window.removeEventListener("themeChanged" as any, handleThemeChange)
    }
  }, [router])

  return (
    <div className="flex h-screen overflow-hidden p-4 animated-gradient">
      <BackgroundVideo />
      <Sidebar isAdmin={false} />
      <main className="flex-1 overflow-auto rounded-3xl bg-white/5 backdrop-filter backdrop-blur-xl border border-white/10 shadow-lg">
        {children}
      </main>
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient {
          background: linear-gradient(-45deg, 
            ${currentTheme.map((color) => `rgba(${hexToRgb(color)}, 0.25)`).join(", ")}
          );
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
        }
        main {
          box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.03);
        }
      `}</style>
    </div>
  )
}

function hexToRgb(hex: string) {
  const bigint = Number.parseInt(hex.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r}, ${g}, ${b}`
}

