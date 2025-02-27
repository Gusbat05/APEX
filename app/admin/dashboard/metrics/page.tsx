"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MetricsGoogleSheetsEmbed } from "@/components/metrics-google-sheets-embed"
import MetricsDisplay from "@/components/metrics-display"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchSheetNames } from "@/lib/googleSheets"

export default function AdminMetricsPage() {
  const [sheetData, setSheetData] = useState<any[] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentSheet, setCurrentSheet] = useState("")
  const [availableSheets, setAvailableSheets] = useState<string[]>([])

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const sheets = await fetchSheetNames(true) // Use metrics sheet
        setAvailableSheets(sheets)
        setCurrentSheet(sheets[0])
      } catch (error) {
        console.error("Error fetching sheet names:", error)
      }
    }
    fetchSheets()
  }, [])

  const handleDataLoaded = (data: any) => {
    if (data && data.values) {
      setSheetData(data.values)
    }
  }

  const changeSheet = (direction: "prev" | "next") => {
    const currentIndex = availableSheets.indexOf(currentSheet)
    if (direction === "prev" && currentIndex > 0) {
      setCurrentSheet(availableSheets[currentIndex - 1])
    } else if (direction === "next" && currentIndex < availableSheets.length - 1) {
      setCurrentSheet(availableSheets[currentIndex + 1])
    }
  }

  return (
    <div className="flex flex-col h-full p-6 overflow-hidden">
      <Header />
      <div className="mt-6 space-y-4 flex-grow overflow-auto pr-4 scrollbar-hide">
        <div className="bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 shadow-lg rounded-lg overflow-hidden p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">Overall Metrics</h2>
            <Select value={currentSheet} onValueChange={setCurrentSheet}>
              <SelectTrigger className="w-[180px] bg-white/10 text-white border-white/20">
                <SelectValue placeholder="Select sheet" />
              </SelectTrigger>
              <SelectContent>
                {availableSheets.map((sheet) => (
                  <SelectItem key={sheet} value={sheet}>
                    {sheet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <MetricsDisplay data={sheetData} />
        </div>
        <div className="bg-white/5 backdrop-filter backdrop-blur-lg border border-white/10 shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">
                {currentSheet} - Pay Period {new Date().toLocaleDateString()}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changeSheet("prev")}
                  disabled={availableSheets.indexOf(currentSheet) === 0}
                  className="bg-white/10 text-white border-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changeSheet("next")}
                  disabled={availableSheets.indexOf(currentSheet) === availableSheets.length - 1}
                  className="bg-white/10 text-white border-white/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <MetricsGoogleSheetsEmbed
              onDataLoaded={handleDataLoaded}
              searchTerm={searchTerm}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              selectedSheet={currentSheet}
              useMetricsSheet={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

