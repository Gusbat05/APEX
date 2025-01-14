"use client"

import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from './components/sidebar'
import { ThemeProvider } from './components/theme-provider'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  const isLoginPage = pathname === '/login'

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {isLoginPage ? (
            children
          ) : (
            <div className="flex min-h-screen bg-background">
              <Sidebar onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)} />
              <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}

