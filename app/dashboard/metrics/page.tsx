"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { MetricsGoogleSheetsEmbed } from "@/components/metrics-google-sheets-embed"
import MetricsDisplay from "@/components/metrics-display"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchSheetNames } from "@/lib/googleSheets"
import { getEnvironmentVariables } from "@/lib/utils"

export default function MetricsPage() {
  const [sheetData, setSheetData] = useState<any[] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentSheet, setCurrentSheet] = useState("Current Week")
  const [availableSheets, setAvailableSheets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"individual" | "rolling">("individual")
  const [onDataLoaded, setOnDataLoaded] = useState<((data: any) => void) | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDataLoaded = useCallback((data: any) => {
    if (data && data.values) {
      // Process the data to count units based on internet and TV services
      const headers = data.values[0]
      const internetColIndex = headers.findIndex(
        (header: string) => header.toLowerCase().includes("internet") || header.toLowerCase().includes("data"),
      )
      const tvColIndex = headers.findIndex(
        (header: string) => header.toLowerCase().includes("tv") || header.toLowerCase().includes("television"),
      )

      const processedData = {
        ...data,
        values: data.values.map((row: string[], index: number) => {
          if (index === 0) return row // Return header row unchanged

          // Calculate units for this row
          const hasInternet = internetColIndex !== -1 && row[internetColIndex]?.toLowerCase() === "yes"
          const hasTv = tvColIndex !== -1 && row[tvColIndex]?.toLowerCase() === "yes"
          const units = (hasInternet ? 1 : 0) + (hasTv ? 1 : 0)
          const totalUnits = units > 0 ? units : 1

          // Add a new column for units if it doesn't exist
          if (!headers.includes("Units")) {
            if (index === 1) {
              data.values[0].push("Units")
            }
            return [...row, totalUnits.toString()]
          }

          return row
        }),
      }

      console.log("Data loaded in metrics page:", processedData.values.length, "rows")
      setSheetData(processedData.values)
    }
  }, [])

  useEffect(() => {
    setOnDataLoaded(() => (data: any) => {
      setSheetData(data)
    })
  }, [])

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setIsLoading(true)
        const sheets = await fetchSheetNames(true) // Use metrics sheet
        setAvailableSheets(sheets)
        setCurrentSheet(sheets[0])
      } catch (error) {
        console.error("Error fetching sheet names:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSheets()
  }, [])

  const calculateRollingAverage = useCallback(
    async (currentSheet: string) => {
      try {
        setError(null)
        // Get the week number from the current sheet
        const currentWeekNum = Number.parseInt(currentSheet.replace(/\D/g, "")) || 1

        // Calculate which weeks to include
        const weeksToInclude = [currentWeekNum, currentWeekNum + 1, currentWeekNum + 2, currentWeekNum + 3]
          .filter((num) => num <= 6)
          .map((num) => (num === 1 ? "Current Week" : `Week ${num}`))

        console.log("Calculating rolling average for weeks:", weeksToInclude)

        const env = getEnvironmentVariables()
        if (!env) {
          throw new Error("Environment variables are not properly configured")
        }

        // Fetch data for all relevant weeks
        const allData = await Promise.all(
          weeksToInclude.map(async (weekName) => {
            console.log(`Fetching data for ${weekName}...`)
            const response = await fetch(
              `https://sheets.googleapis.com/v4/spreadsheets/${env.metricsSheetId}/values/${weekName}!A:K?key=${env.metricsApiKey}`,
            )
            if (!response.ok) {
              console.error(`Failed to fetch ${weekName}:`, response.status)
              throw new Error(`Failed to fetch ${weekName}: ${response.statusText}`)
            }
            const data = await response.json()
            console.log(`Successfully fetched data for ${weekName}`)
            return data
          }),
        )

        // Validate that we have data to work with
        if (!allData.length || !allData[0].values || !allData[0].values.length) {
          throw new Error("No data available for the selected weeks")
        }

        console.log(`Processing data from ${allData.length} weeks`)

        // Combine and average the data
        const combinedData = {
          values: allData[0].values.map((row: any[], rowIndex: number) => {
            if (rowIndex === 0) return row // Return headers unchanged

            return row.map((cell: any, colIndex: number) => {
              // For numeric values, calculate average
              if (!isNaN(Number(cell))) {
                const sum = allData.reduce((acc, weekData) => {
                  const value = weekData.values[rowIndex]?.[colIndex]
                  return acc + (Number(value) || 0)
                }, 0)
                return (sum / allData.length).toFixed(1)
              }
              // For non-numeric values (like names, statuses), keep the original
              return cell
            })
          }),
        }

        console.log("Successfully calculated rolling average")
        setSheetData(combinedData)
        if (onDataLoaded) {
          onDataLoaded(combinedData)
        }
      } catch (error) {
        console.error("Error calculating rolling average:", error)
        setError(error instanceof Error ? error.message : "Failed to calculate rolling average")
        // Set empty data to prevent displaying stale data
        setSheetData(null)
      }
    },
    [onDataLoaded],
  )

  const changeSheet = (direction: "prev" | "next") => {
    const currentIndex = availableSheets.indexOf(currentSheet)
    if (direction === "prev" && currentIndex > 0) {
      setCurrentSheet(availableSheets[currentIndex - 1])
    } else if (direction === "next" && currentIndex < availableSheets.length - 1) {
      setCurrentSheet(availableSheets[currentIndex + 1])
    }
  }

  const fetchSheetData = useCallback(
    async (sheetName: string) => {
      try {
        setError(null)
        const env = getEnvironmentVariables()
        if (!env) {
          throw new Error("Environment variables are not properly configured")
        }

        console.log(`Fetching individual sheet data for ${sheetName}...`)
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${env.metricsSheetId}/values/${sheetName}!A:K?key=${env.metricsApiKey}`,
        )
        if (!response.ok) {
          throw new Error(`Failed to fetch sheet data: ${response.statusText}`)
        }
        const data = await response.json()
        console.log(`Successfully fetched data for ${sheetName}`)
        handleDataLoaded(data)
      } catch (error) {
        console.error("Error fetching sheet data:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch sheet data")
        setSheetData(null)
      }
    },
    [handleDataLoaded],
  )

  useEffect(() => {
    if (currentSheet) {
      if (viewMode === "individual") {
        fetchSheetData(currentSheet)
      } else {
        calculateRollingAverage(currentSheet)
      }
    }
  }, [currentSheet, viewMode, fetchSheetData, calculateRollingAverage])

  return (
    <div className="flex flex-col h-full p-6 overflow-hidden">
      <Header />
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      <div className="mt-6 space-y-4 flex-grow overflow-auto">
        <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-filter backdrop-blur-lg border border-white/30 shadow-lg rounded-lg overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">
              Overall Metrics
              {viewMode === "rolling" && (
                <span className="ml-2 text-sm font-normal text-white/70">(4 Weeks Rolling Average)</span>
              )}
            </h2>
            <div className="flex items-center space-x-2">
              <Select
                value={viewMode}
                onValueChange={(value: "individual" | "rolling") => {
                  setViewMode(value)
                  setError(null) // Clear any existing errors
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select view mode">
                    {viewMode === "individual" ? "Individual Week" : "4 Weeks Rolling"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual Week</SelectItem>
                  <SelectItem value="rolling">4 Weeks Rolling</SelectItem>
                </SelectContent>
              </Select>
              <Select value={currentSheet} onValueChange={setCurrentSheet} disabled={isLoading}>
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
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeSheet("prev")}
                disabled={isLoading || availableSheets.indexOf(currentSheet) === 0}
                className="bg-white/10 text-white border-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeSheet("next")}
                disabled={isLoading || availableSheets.indexOf(currentSheet) === availableSheets.length - 1}
                className="bg-white/10 text-white border-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="text-sm text-white/70">
                  {viewMode === "rolling" ? "Calculating rolling average..." : "Loading data..."}
                </p>
              </div>
            </div>
          ) : (
            <MetricsDisplay data={sheetData} />
          )}
        </div>
        <div className="bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30 backdrop-filter backdrop-blur-lg border border-white/30 shadow-lg rounded-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-white mb-4">{currentSheet} Data</h2>
            <MetricsGoogleSheetsEmbed
              onDataLoaded={handleDataLoaded}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
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

