"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  TrendingUp,
  PieChart,
  Wallet,
  Users,
  Upload,
  FileText,
  MessageSquare,
  Building,
  MoreVertical,
  ChevronLeft,
  Menu,
  Car,
} from "lucide-react"
import { useState, useEffect } from "react"
import { AccountInfoPopup } from "./account-info-popup"
import { user, generateGradient } from "@/lib/user"
import { colorCombinations } from "./theme-settings-page"
import Image from "next/image"

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isAccountPopupOpen, setIsAccountPopupOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(colorCombinations[0].colors)

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent<string[]>) => {
      setCurrentTheme(event.detail)
    }

    window.addEventListener("themeChanged" as any, handleThemeChange)

    return () => {
      window.removeEventListener("themeChanged" as any, handleThemeChange)
    }
  }, [])

  // Update the navigation array to move Carrides below Agents and mark it as disabled
  const navigation = [
    { name: "Dashboard", href: isAdmin ? "/admin/dashboard" : "/dashboard", icon: Home },
    { name: "Tracker", href: isAdmin ? "/admin/dashboard/tracker" : "/dashboard/tracker", icon: TrendingUp },
    { name: "Metrics", href: isAdmin ? "/admin/dashboard/metrics" : "/dashboard/metrics", icon: PieChart },
    {
      name: "Finances",
      href: isAdmin ? "/admin/dashboard/finances" : "/dashboard/finances",
      icon: Wallet,
      disabled: true,
    },
    {
      name: "Agents",
      href: isAdmin ? "/admin/dashboard/agents" : "/dashboard/agents",
      icon: Users,
      disabled: true,
    },
    {
      name: "Carrides",
      href: isAdmin ? "/admin/dashboard/carrides" : "/dashboard/carrides",
      icon: Car,
      disabled: true,
    },
    {
      name: "Reports",
      href: isAdmin ? "/admin/dashboard/reports" : "/dashboard/reports",
      icon: FileText,
      disabled: true,
    },
  ]

  const adminNavigation = [
    {
      name: "Offices",
      href: "/admin/dashboard/offices",
      icon: Building,
      disabled: true,
      disabledText: "Coming Soon",
    },
    {
      name: "Message",
      href: "/admin/dashboard/message",
      icon: MessageSquare,
      disabled: true,
      disabledText: "Coming Soon",
    },
    {
      name: "Upload",
      href: "/admin/dashboard/upload",
      icon: Upload,
      disabled: true,
      disabledText: "Coming Soon",
    },
  ]

  return (
    <div
      className={`relative mr-4 flex ${isCollapsed ? "w-16" : "w-64"} flex-col rounded-3xl bg-white/5 backdrop-filter backdrop-blur-xl border border-white/10 shadow-lg p-3 h-full overflow-hidden transition-all duration-300 ease-in-out sidebar-fade-top sidebar-fade-bottom`}
    >
      <div className="flex flex-col h-full z-10">
        <div className="flex items-center px-2 h-10 relative overflow-hidden">
          <span
            className={`
              text-xl font-semibold text-white 
              transition-all duration-300 ease-out whitespace-nowrap overflow-hidden
              ${isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-full"}
            `}
            style={{
              transitionDelay: isCollapsed ? "0ms" : "150ms",
              ...(isCollapsed && {
                maskImage: "linear-gradient(to left, black 80%, transparent 98%)",
                WebkitMaskImage: "linear-gradient(to left, black 80%, transparent 98%)",
              }),
            }}
          >
            Apex Dashboard
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors -mr-2 group ${
              isCollapsed ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" : "ml-auto"
            }`}
          >
            <div className="relative w-6 h-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/APEX%20DASH-5lEKnZU5SRKYFBNTa5oi5fJ9kdT6JB.png"
                alt="Apex Dash Logo"
                width={24}
                height={24}
                className={`absolute inset-0 transition-opacity duration-300 sidebar-logo ${
                  isCollapsed ? "opacity-100 group-hover:opacity-0" : "opacity-0"
                }`}
              />
              <Menu
                className={`absolute inset-0 h-6 w-6 text-white transition-opacity duration-300 ${
                  isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-0"
                }`}
              />
              <ChevronLeft
                className={`absolute inset-0 h-6 w-6 text-white transition-opacity duration-300 ${
                  isCollapsed ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          </button>
        </div>
        <div className={`flex items-center gap-2 pl-0 pr-2 py-2 mt-2 ${isCollapsed ? "px-0" : ""}`}>
          <span
            className={`text-xs font-semibold text-white/70 ${isCollapsed ? "opacity-0 w-0" : "opacity-100 transition-opacity duration-300"}`}
          >
            MENU
          </span>
          <hr className={`flex-grow border-t-2 border-white/20 rounded-full ${isCollapsed ? "w-full mx-0" : ""}`} />
        </div>
        <div className="flex-grow flex flex-col">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                href={item.disabled ? "#" : item.href}
                key={item.name}
                className={`group relative flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors overflow-hidden ${
                  pathname === item.href
                    ? "bg-white/20 text-white"
                    : item.disabled
                      ? "text-white/30 pointer-events-none"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                onClick={(e) => {
                  if (item.disabled) e.preventDefault()
                }}
              >
                <span className="relative z-10 flex items-center h-5">
                  <span className="flex-shrink-0 w-[30px] ml-[0.5px]">
                    <item.icon
                      className={`h-5 w-5 stroke-2 transition-all duration-200 ease-in-out ${
                        !item.disabled && "group-hover:scale-110 group-hover:filter group-hover:drop-shadow-glow"
                      }`}
                    />
                  </span>
                  <span
                    className={`
                      transition-all duration-300 ease-out whitespace-nowrap overflow-hidden
                      ${isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-full"}
                    `}
                    style={{
                      transitionDelay: isCollapsed ? "0ms" : "150ms",
                      ...(isCollapsed && {
                        maskImage: "linear-gradient(to left, black 80%, transparent 98%)",
                        WebkitMaskImage: "linear-gradient(to left, black 80%, transparent 98%)",
                      }),
                    }}
                  >
                    {item.name}
                  </span>
                </span>
                {!item.disabled && (
                  <span className="absolute inset-0 z-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                )}
              </Link>
            ))}
            {isAdmin && (
              <>
                <div className={`flex items-center gap-2 pl-0 pr-2 py-2 mt-4 ${isCollapsed ? "px-0" : ""}`}>
                  <span
                    className={`text-xs font-semibold text-white/70 ${
                      isCollapsed ? "opacity-0 w-0" : "opacity-100 transition-opacity duration-300"
                    }`}
                  >
                    ADMIN
                  </span>
                  <hr
                    className={`flex-grow border-t-2 border-white/20 rounded-full ${isCollapsed ? "w-full mx-0" : ""}`}
                  />
                </div>
                {adminNavigation.map((item) => (
                  <Link
                    href={item.disabled ? "#" : item.href}
                    key={item.name}
                    className={`group relative flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors overflow-hidden ${
                      pathname === item.href
                        ? "bg-white/20 text-white"
                        : item.disabled
                          ? "text-white/30 pointer-events-none"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={(e) => {
                      if (item.disabled) e.preventDefault()
                    }}
                  >
                    <span className="relative z-10 flex items-center h-5">
                      <span className="flex-shrink-0 w-[30px] ml-[0.5px]">
                        <item.icon
                          className={`h-5 w-5 stroke-2 transition-all duration-200 ease-in-out ${
                            !item.disabled && "group-hover:scale-110 group-hover:filter group-hover:drop-shadow-glow"
                          }`}
                        />
                      </span>
                      <span
                        className={`
                          transition-all duration-300 ease-out whitespace-nowrap overflow-hidden
                          ${isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-full"}
                        `}
                        style={{
                          transitionDelay: isCollapsed ? "0ms" : "150ms",
                          ...(isCollapsed && {
                            maskImage: "linear-gradient(to left, black 80%, transparent 98%)",
                            WebkitMaskImage: "linear-gradient(to left, black 80%, transparent 98%)",
                          }),
                        }}
                      >
                        {item.disabled ? item.disabledText : item.name}
                      </span>
                    </span>
                    {!item.disabled && (
                      <span className="absolute inset-0 z-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                    )}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="mt-auto space-y-2">
          <button
            onClick={() => setIsAccountPopupOpen(true)}
            className={`
              group relative flex items-center
              h-10 w-full
              rounded-full bg-white/5 transition-all duration-300 overflow-hidden
              ${isCollapsed ? "justify-center" : "justify-start p-1.5 pl-11"}
            `}
            style={{ paddingLeft: isCollapsed ? "0.25rem" : "2.75rem" }}
          >
            <div
              className="h-8 w-8 rounded-full overflow-hidden absolute left-0 top-1/2 -translate-y-1/2 z-10"
              style={{ left: "3px" }}
            >
              <div
                className="h-full w-full flex items-center justify-center text-white font-semibold text-lg animated-gradient"
                style={{ background: generateGradient(user.name) }}
              >
                {user.name.charAt(0)}
              </div>
            </div>
            <div
              className={`
                flex items-center transition-all duration-300 ease-out overflow-hidden z-10
                ${isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-full"}
              `}
            >
              <div className="flex flex-col text-left w-full min-w-0">
                <span className="text-sm font-medium text-white truncate">{user.name}</span>
                <span className="text-xs text-white/70 truncate">{user.company}</span>
              </div>
            </div>
            {!isCollapsed && <MoreVertical className="h-5 w-5 text-white/70 ml-auto z-10 flex-shrink-0" />}
            <span className="absolute inset-0 z-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
          </button>
        </div>
        <AccountInfoPopup
          isOpen={isAccountPopupOpen}
          onClose={() => setIsAccountPopupOpen(false)}
          currentTheme={currentTheme}
        />
      </div>
      <style jsx>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.7));
        }
        .bg-white\\/5 {
          box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.03);
        }
        .truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient {
          background-size: 400% 400%;
          animation: gradientAnimation 3s ease infinite;
        }
      `}</style>
      <style jsx global>{`
        .sidebar-logo {
          filter: brightness(0) invert(1);
          transition: opacity 0.3s ease-in-out;
        }
        .lucide-chevron-left, .lucide-menu {
          transition: opacity 0.3s ease-in-out;
        }
        .sidebar-fade-top::before,
        .sidebar-fade-bottom::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 40px;
          pointer-events: none;
          z-index: 10;
        }

        .sidebar-fade-top::before {
          top: 0;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
        }

        .sidebar-fade-bottom::after {
          bottom: 0;
          background: linear-gradient(to top, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
        }
      `}</style>
    </div>
  )
}

export default Sidebar

