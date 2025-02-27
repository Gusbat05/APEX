"use client"

import { useState, useEffect } from "react"
import { Bell, Settings, HelpCircle, LogOut, CheckCircle, Shield, Star } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { saveChanges } from "@/lib/api"
import { SettingsPage } from "./settings-page"
import { NotificationsPage } from "./notifications-page"
import { SupportPage } from "./support-page"
import { user, generateGradient } from "@/lib/user"

interface AccountInfoPopupProps {
  isOpen: boolean
  onClose: () => void
  currentTheme: string[]
}

export function AccountInfoPopup({ isOpen, onClose, currentTheme }: AccountInfoPopupProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<"main" | "support" | "settings" | "notifications">("main")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsExpanded(currentPage !== "main")
  }, [currentPage])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [currentPage])

  const togglePage = (page: "main" | "support" | "settings" | "notifications") => {
    setIsVisible(false)
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentPage(page)
      setTimeout(() => {
        setIsVisible(true)
        setIsTransitioning(false)
      }, 50)
    }, 300)
  }

  const handleLogout = async () => {
    try {
      await saveChanges()
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`p-4 overflow-hidden bg-white/5 backdrop-filter backdrop-blur-xl border border-white/10 shadow-lg rounded-lg transition-all duration-300 ease-in-out ${
          isExpanded ? "sm:max-w-[600px] h-[600px]" : "sm:max-w-[425px] h-[500px]"
        }`}
        style={{
          boxShadow: "0 0 20px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        <div
          className={`relative transition-all duration-300 ease-in-out ${
            currentPage !== "main" ? "h-12" : "h-32"
          } animated-gradient -mx-4 -mt-4`}
          style={{
            backgroundImage: `linear-gradient(135deg, ${currentTheme.map((color) => `${color}BF`).join(", ")})`,
          }}
        >
          {currentPage === "main" && (
            <div
              className={`absolute -bottom-12 left-8 transition-all duration-300 ease-in-out ${
                isTransitioning ? "opacity-0 transform -translate-y-4" : "opacity-100 transform translate-y-0"
              }`}
            >
              <div
                className="h-24 w-24 rounded-full border-4 border-[#221e26] bg-white/10 backdrop-filter backdrop-blur-lg overflow-hidden shadow-lg"
                style={{ boxShadow: "0 0 20px 0 rgba(255, 255, 255, 0.05)" }}
              >
                <div
                  className="h-full w-full flex items-center justify-center text-white text-4xl font-bold"
                  style={{ background: generateGradient(user.name) }}
                >
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            isTransitioning || !isVisible ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
          }`}
        >
          {currentPage === "support" && <SupportPage onBack={() => togglePage("main")} />}
          {currentPage === "settings" && <SettingsPage onBack={() => togglePage("main")} />}
          {currentPage === "notifications" && <NotificationsPage onBack={() => togglePage("main")} />}
          {currentPage === "main" && (
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <div className="flex justify-between items-center pt-10 px-4 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-base text-white/70">{user.company}</p>
                  </div>
                  <div className="flex space-x-2 p-2 bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg shadow-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <Shield className="w-5 h-5 text-blue-400" />
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
                <div className="border-b border-white/10 mx-4 my-2"></div>
              </div>
              <div className="px-4 py-2 mt-auto">
                <div className="space-y-2">
                  {[
                    { icon: Bell, label: "Notifications", onClick: () => togglePage("notifications") },
                    { icon: Settings, label: "Settings", onClick: () => togglePage("settings") },
                    { icon: HelpCircle, label: "Support", onClick: () => togglePage("support") },
                    {
                      icon: LogOut,
                      label: "Log Out",
                      className: "text-red-400 hover:text-white",
                      onClick: handleLogout,
                    },
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`group relative flex w-full items-center justify-start gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors overflow-hidden text-white/70 hover:text-white ${item.className || ""}`}
                      onClick={(e) => {
                        const ripple = document.createElement("span")
                        const rect = e.currentTarget.getBoundingClientRect()
                        ripple.style.left = `${e.clientX - rect.left}px`
                        ripple.style.top = `${e.clientY - rect.top}px`
                        ripple.className = "ripple"
                        e.currentTarget.appendChild(ripple)
                        setTimeout(() => ripple.remove(), 1000)
                        item.onClick()
                      }}
                    >
                      <span className="relative z-10 flex items-center">
                        <item.icon className="h-4 w-4 mr-2 transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:filter group-hover:drop-shadow-glow" />
                        {item.label}
                      </span>
                      <span
                        className={`absolute inset-0 z-0 ${
                          item.label === "Log Out" ? "group-hover:bg-red-500/20" : "group-hover:bg-white/10"
                        } translate-x-[-100%] group-hover:translate-x-0 transition-all duration-300 ease-in-out`}
                      />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      <style jsx>{`
        .animated-gradient {
          background-size: 400% 400%;
          animation: gradientAnimation 5s ease-in-out infinite;
        }
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 0% 50%;
          }
          75% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.7));
        }
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 600ms linear;
          background-color: rgba(255, 255, 255, 0.7);
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
      <style jsx global>{`
        .translate-y-4 {
          transform: translateY(1rem);
        }
      `}</style>
    </Dialog>
  )
}

