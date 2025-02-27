"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ThemeSettingsPageProps {
  onBack: () => void
  currentTheme: string[]
}

export const colorCombinations = [
  { name: "Midnight Bliss", colors: ["#1a237e", "#311b92", "#4a148c", "#880e4f"] },
  { name: "Sunset Serenity", colors: ["#bf360c", "#b71c1c", "#c2185b", "#880e4f"] },
  { name: "Ocean Breeze", colors: ["#01579b", "#006064", "#004d40", "#1b5e20"] },
  { name: "Tropical Paradise", colors: ["#00b8d4", "#00bfa5", "#64dd17", "#ffd600"] },
  { name: "Golden Horizon", colors: ["#ff6f00", "#ff8f00", "#ffa000", "#ffb300"] },
  { name: "Lavender Dream", colors: ["#4a148c", "#6a1b9a", "#8e24aa", "#aa00ff"] },
  { name: "Cherry Blossom", colors: ["#c2185b", "#d81b60", "#e91e63", "#f06292"] },
  { name: "Emerald Oasis", colors: ["#004D40", "#00695C", "#00796B", "#00897B"] },
  { name: "Azure Skies", colors: ["#1E88E5", "#2196F3", "#42A5F5", "#64B5F6"] },
  { name: "Mountain Mist", colors: ["#546E7A", "#78909C", "#90A4AE", "#B0BEC5"] },
  { name: "Arctic White", colors: ["#FFFFFF", "#FEFEFE", "#FDFDFD", "#FCFCFC"] },
  { name: "Midnight Black", colors: ["#000000", "#121212", "#1E1E1E", "#2C2C2C"] },
]

export function ThemeSettingsPage({ onBack, currentTheme }: ThemeSettingsPageProps) {
  const [selectedTheme, setSelectedTheme] = useState(
    colorCombinations.find((combo) => JSON.stringify(combo.colors) === JSON.stringify(currentTheme))?.name ||
      colorCombinations[0].name,
  )
  const [previewTheme, setPreviewTheme] = useState(selectedTheme)

  const handleThemeChange = (themeName: string) => {
    setPreviewTheme(themeName)
  }

  const applyTheme = () => {
    setSelectedTheme(previewTheme)
    setPreviewTheme(previewTheme)
    const selectedColors = colorCombinations.find((theme) => theme.name === previewTheme)?.colors
    if (selectedColors) {
      window.dispatchEvent(new CustomEvent("themeChanged", { detail: selectedColors }))
    }
  }

  useEffect(() => {
    const currentThemeName =
      colorCombinations.find((combo) => JSON.stringify(combo.colors) === JSON.stringify(currentTheme))?.name ||
      colorCombinations[0].name
    setSelectedTheme(currentThemeName)
    setPreviewTheme(currentThemeName)
  }, [currentTheme])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-white mb-1 text-center">Current</h4>
          <div className="h-12 w-full rounded-md overflow-hidden">
            <div
              className="w-full h-full animated-gradient"
              style={{
                backgroundImage: `linear-gradient(45deg, ${currentTheme.join(", ")})`,
              }}
            />
          </div>
          <p className="mt-1 text-xs text-white text-center truncate">{selectedTheme}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-1 text-center">Preview</h4>
          <div className="h-12 w-full rounded-md overflow-hidden">
            <div
              className="w-full h-full animated-gradient"
              style={{
                backgroundImage: `linear-gradient(45deg, ${colorCombinations
                  .find((theme) => theme.name === previewTheme)
                  ?.colors.join(", ")})`,
              }}
            />
          </div>
          <p className="mt-1 text-xs text-white text-center truncate">{previewTheme}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {colorCombinations.map((theme) => (
          <button
            key={theme.name}
            onClick={() => handleThemeChange(theme.name)}
            className={`p-1 rounded-md transition-all duration-300 ${
              previewTheme === theme.name ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/50"
            }`}
          >
            <div className="h-10 w-full rounded-md overflow-hidden flex">
              {theme.colors.map((color, index) => (
                <div key={index} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </div>
            <p className="mt-1 text-[10px] text-white text-center truncate">{theme.name}</p>
          </button>
        ))}
      </div>
      <Button
        onClick={applyTheme}
        disabled={previewTheme === selectedTheme}
        className={`w-full transition-all duration-300 ${
          previewTheme === selectedTheme
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-800 animate-gradient hover:brightness-110 hover:shadow-glow text-white"
        }`}
      >
        Apply Theme
      </Button>
      <style jsx>{`
        .animated-gradient {
          background-size: 400% 400%;
          animation: gradientAnimation 3s ease infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientAnimation 2s ease infinite;
        }
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .hover\\:shadow-glow:hover {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  )
}

