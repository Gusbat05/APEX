import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/AuthContext"
import ErrorBoundary from "@/components/error-boundary"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Modern dashboard interface",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/APEX%20DASH-5lEKnZU5SRKYFBNTa5oi5fJ9kdT6JB.png",
        sizes: "32x32",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="https://react.dev/link/react-devtools" as="script" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}



import './globals.css'