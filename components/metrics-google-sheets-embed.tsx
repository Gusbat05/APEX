"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { Loader2, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MetricsGoogleSheetsEmbedProps {
  onDataLoaded?: (data: SheetData | null) => void
  searchTerm?: string
  onSearchChange?: (term: string) => void
  isFilterOpen?: boolean
  setIsFilterOpen?: (isOpen: boolean) => void
  selectedSheet?: string
  useMetricsSheet?: boolean
}

interface SheetData {
  values: string[][]
}

export function MetricsGoogleSheetsEmbed(props: MetricsGoogleSheetsEmbedProps) {
  const { onDataLoaded, selectedSheet, useMetricsSheet } = props
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [data, setData] = useState<SheetData | null>(null)
  const [filteredData, setFilteredData] = useState<SheetData | null>(null)
  const [searchTerm, setSearchTerm] = useState(props.searchTerm || "")

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value
    setSearchTerm(newSearchTerm)
    // If you need to propagate the search term up to the parent component
    if (props.onSearchChange) {
      props.onSearchChange(newSearchTerm)
    }

    // Filter the data based on the search term
    if (data && data.values) {
      filterData(data, newSearchTerm)
    }
  }

  // Update the filterData function to handle units
  const filterData = useCallback((data: SheetData, term: string) => {
    if (!term.trim()) {
      setFilteredData(data)
      return
    }

    // Get column indices for internet and TV
    const headers = data.values[0]
    const internetColIndex = headers.findIndex(
      (header) => header.toLowerCase().includes("internet") || header.toLowerCase().includes("data"),
    )
    const tvColIndex = headers.findIndex(
      (header) => header.toLowerCase().includes("tv") || header.toLowerCase().includes("television"),
    )

    const filtered = {
      ...data,
      values: [
        data.values[0],
        ...data.values.slice(1).filter((row) => {
          // Calculate units for this row
          const hasInternet = internetColIndex !== -1 && row[internetColIndex]?.toLowerCase() === "yes"
          const hasTv = tvColIndex !== -1 && row[tvColIndex]?.toLowerCase() === "yes"
          const units = (hasInternet ? 1 : 0) + (hasTv ? 1 : 0)
          const totalUnits = units > 0 ? units : 1

          // Add units to the row data if not already present
          if (!row.includes("Units")) {
            row.push(totalUnits.toString())
          }

          return row.some((cell) => cell && cell.toString().toLowerCase().includes(term.toLowerCase()))
        }),
      ],
    }

    setFilteredData(filtered)
  }, [])

  // Update the useEffect hook for fetching sheets
  useEffect(() => {
    if (selectedSheet) {
      fetchSheetData(selectedSheet)
    }
  }, [selectedSheet])

  // Update the useEffect hook that filters data based on search term to also filter by account:
  useEffect(() => {
    if (!data) return

    const filtered = {
      ...data,
      values: [
        data.values[0],
        ...data.values.slice(1).filter((row) => {
          // First check if the row matches the search term
          const matchesSearch =
            searchTerm.trim() === "" ||
            row.some((cell) => cell && cell.toString().toLowerCase().includes(searchTerm.toLowerCase()))

          // Then check if the row matches the user's account
          // Look for "adose" in any cell of the row (case insensitive)
          const matchesAccount = row.some((cell) => cell && cell.toString().toLowerCase().includes("adose"))

          // Return true only if both conditions are met
          return matchesSearch && matchesAccount
        }),
      ],
    }
    setFilteredData(filtered)
  }, [searchTerm, data])

  // Update the fetchSheetData function to include unit calculations
  const fetchSheetData = async (sheetName: string) => {
    setIsLoading(true)
    try {
      const sheetId = useMetricsSheet
        ? process.env.NEXT_PUBLIC_METRICS_SHEETS_ID
        : process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID
      const apiKey = useMetricsSheet
        ? process.env.NEXT_PUBLIC_METRICS_SHEETS_API_KEY
        : process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY

      console.log(`Fetching data for sheet: ${sheetName} with ID: ${sheetId?.substring(0, 5)}...`)

      // Ensure we're fetching column K by using range A:K
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}!A:K?key=${apiKey}`,
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP error! status: ${response.status}, response: ${errorText}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: SheetData = await response.json()
      console.log("Data fetched successfully:", result.values.length, "rows")

      if (result.values && result.values.length > 0) {
        const headers = result.values[0]

        // Add Units column if it doesn't exist
        if (!headers.includes("Units")) {
          headers.push("Units")
        }

        // Process each row to add unit counts
        result.values = result.values.map((row, index) => {
          if (index === 0) return row // Skip header row

          // Check columns H and I (indices 7 and 8) for service entries
          const hasServiceH = row[7] && row[7].toString().trim() !== ""
          const hasServiceI = row[8] && row[8].toString().trim() !== ""

          // Calculate units (2 if both services, 1 if either service or none)
          const units = hasServiceH && hasServiceI ? 2 : hasServiceH || hasServiceI ? 1 : 1

          return [...row, units.toString()]
        })
      }

      setData(result)
      setFilteredData(result)
      if (onDataLoaded) {
        onDataLoaded(result)
      }
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error)
      if (error instanceof Error) {
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
        setErrorMessage(error.message)
      }
      console.error("Sheet ID:", useMetricsSheet ? "Using metrics sheet ID" : "Using regular sheet ID")
      console.error(
        "API Key status:",
        useMetricsSheet
          ? process.env.NEXT_PUBLIC_METRICS_SHEETS_API_KEY
            ? "Metrics API Key Set"
            : "Metrics API Key Not set"
          : process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY
            ? "Regular API Key Set"
            : "Regular API Key Not set",
      )
      setHasError(true)
      setData(null)
      setFilteredData(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400">Error loading data: {errorMessage || "Failed to fetch sheet data"}</p>
        <Button
          variant="outline"
          className="mt-4 bg-white/10 text-white"
          onClick={() => selectedSheet && fetchSheetData(selectedSheet)}
        >
          Retry
        </Button>
      </div>
    )
  }

  if (!filteredData || !filteredData.values || filteredData.values.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/70">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4" data-sheet-type={props.useMetricsSheet ? "metrics" : "tracker"}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => props.setIsFilterOpen?.(true)}
            className="bg-white/10 border-white/20 text-white"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-white/20 overflow-hidden">
        <div className="w-full overflow-hidden">
          <Table>
            <TableHeader className="bg-black/50 z-20">
              <TableRow>
                {filteredData.values[0].map((header, index) => (
                  <TableHead
                    key={index}
                    className="text-white font-semibold cursor-pointer hover:bg-white/5 border-b border-white/20 text-xs py-2"
                    style={{ width: `${100 / filteredData.values[0].length}%`, minWidth: "150px" }}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{header}</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="max-h-[550px] overflow-auto">
          <Table>
            <TableBody>
              {filteredData.values.slice(1).map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-white/5 transition-colors">
                  {row.map((cell, cellIndex) => {
                    // Check if this is the status column
                    const isStatusColumn =
                      filteredData.values[0][cellIndex] &&
                      filteredData.values[0][cellIndex].toLowerCase().includes("status")

                    // Style status cells differently
                    if (isStatusColumn) {
                      const statusLower = cell ? cell.toString().toLowerCase() : ""
                      let statusColor = "text-green-400"
                      let bgColor = "bg-green-500/10"

                      if (statusLower.includes("approved")) {
                        statusColor = "text-green-400"
                        bgColor = "bg-green-500/10"
                      } else if (statusLower.includes("cancelled")) {
                        statusColor = "text-red-400"
                        bgColor = "bg-red-500/10"
                      } else if (statusLower.includes("pending")) {
                        statusColor = "text-yellow-400"
                        bgColor = "bg-yellow-500/10"
                      }

                      return (
                        <TableCell key={cellIndex} className={`${statusColor} text-center`}>
                          <div className="flex justify-center items-center w-full">
                            <div className={`w-32 h-8 rounded-full ${bgColor} flex items-center justify-center px-2`}>
                              <span className={`${statusColor} font-medium`}>
                                {statusLower.includes("approved")
                                  ? "Approved"
                                  : statusLower.includes("cancelled")
                                    ? "Cancelled"
                                    : statusLower.includes("pending")
                                      ? "Pending"
                                      : cell || "—"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      )
                    }

                    // Check if this is the autopay column
                    const isAutopayColumn =
                      filteredData.values[0][cellIndex] &&
                      filteredData.values[0][cellIndex].toLowerCase().includes("autopay")

                    if (isAutopayColumn) {
                      return (
                        <TableCell key={cellIndex} className="text-center">
                          <div className="flex justify-center items-center w-full">
                            {cell === "y" || cell === "Y" ? (
                              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <span className="text-green-500 font-bold text-xl">✓</span>
                              </div>
                            ) : cell === "n" || cell === "N" ? (
                              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                <span className="text-red-500 font-bold text-xl">✗</span>
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center">
                                <span className="text-gray-400 text-xl">?</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      )
                    }

                    return (
                      <TableCell
                        key={cellIndex}
                        className="text-white/80 text-xs py-1.5"
                        style={{
                          width: `${100 / filteredData.values[0].length}%`,
                          minWidth: "150px",
                          height: "48px",
                          maxHeight: "48px",
                          overflow: "visible",
                          whiteSpace: "normal",
                        }}
                      >
                        {cell || "—"}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mt-4 text-xs text-white/50 text-right">Showing {filteredData.values.length - 1} rows</div>
      <style jsx>{`
        table {
          table-layout: fixed;
          width: 100%;
        }

        :global(.tracker-table th),
        :global(.tracker-table td) {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          font-size: 0.75rem;
        }

        :global(.tracker-table) {
          table-layout: fixed;
        }
      `}</style>
    </div>
  )
}

