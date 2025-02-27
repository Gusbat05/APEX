"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, User, Key, CreditCard, Palette, Settings, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeSettingsPage } from "./theme-settings-page"
import { colorCombinations } from "./theme-settings-page"
import { ServiceSettingsPage } from "./service-settings-page"
import { AccountSettingsPage } from "./account-settings-page"

type SettingsPage = {
  name: string
  icon: React.ElementType
  component: React.ComponentType<any> | null
}

export function SettingsPage({ onBack }: { onBack: () => void }) {
  const [currentPage, setCurrentPage] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(colorCombinations[0].colors)

  const settingsPages: SettingsPage[] = [
    { name: "Account Settings", icon: Key, component: AccountSettingsPage },
    { name: "Profile Settings", icon: User, component: null },
    { name: "Payout Settings", icon: CreditCard, component: null },
    {
      name: "Theme Settings",
      icon: Palette,
      component: (props: any) => <ThemeSettingsPage {...props} currentTheme={currentTheme} />,
    },
    {
      name: "Service Settings",
      icon: RefreshCcw,
      component: (props: any) => <ServiceSettingsPage {...props} />,
    },
  ]

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent<string[]>) => {
      setCurrentTheme(event.detail)
    }

    window.addEventListener("themeChanged" as any, handleThemeChange)

    return () => {
      window.removeEventListener("themeChanged" as any, handleThemeChange)
    }
  }, [])

  const handlePageChange = (pageName: string | null) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentPage(pageName)
      setIsTransitioning(false)
    }, 300)
  }

  const CurrentPageComponent = settingsPages.find((page) => page.name === currentPage)?.component || null

  return (
    <div className="px-4 pt-4 pb-2 flex flex-col transition-all duration-300 ease-in-out" style={{ height: "520px" }}>
      <div className="flex items-center mb-4">
        {currentPage ? (
          <>
            {settingsPages.find((page) => page.name === currentPage)?.icon && (
              <div className="w-6 h-6 mr-2 text-white">
                {React.createElement(settingsPages.find((page) => page.name === currentPage)!.icon)}
              </div>
            )}
            <h3 className="text-xl font-bold text-white mr-3">{currentPage}</h3>
          </>
        ) : (
          <>
            <Settings className="w-6 h-6 mr-2 text-white" />
            <h3 className="text-xl font-bold text-white mr-3">Settings</h3>
          </>
        )}
        <div className="flex-grow h-px bg-white/20"></div>
      </div>

      <div className="flex-grow">
        <div>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isTransitioning ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
            }`}
          >
            {currentPage && CurrentPageComponent ? (
              <div className="h-[360px]">
                <CurrentPageComponent onBack={() => handlePageChange(null)} />
              </div>
            ) : (
              <div className="space-y-4">
                {" "}
                {/* Updated className */}
                {settingsPages.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon className="w-5 h-5 text-white" />
                      <span className="text-sm font-medium text-white">{item.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="group relative text-sm text-white/70 hover:text-white overflow-hidden"
                      onClick={() => handlePageChange(item.name)}
                    >
                      <span className="relative z-10">Manage</span>
                      <span className="absolute inset-0 z-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <Button
          variant="ghost"
          className="group relative flex w-full items-center justify-start gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors overflow-hidden text-white/70 hover:text-white"
          onClick={currentPage ? () => handlePageChange(null) : onBack}
        >
          <span className="relative z-10 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2 transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:filter group-hover:drop-shadow-glow" />
            {currentPage ? "Back to Settings" : "Back"}
          </span>
          <span className="absolute inset-0 z-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
        </Button>
      </div>
    </div>
  )
}

