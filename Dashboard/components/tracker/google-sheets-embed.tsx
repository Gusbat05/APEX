"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, Loader2, ArrowUpDown } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { formatPhoneNumber } from "@/lib/utils"

interface SheetData {
  range: string
  majorDimension: string
  values: string[][]
}

interface GoogleSheetsEmbedProps {
  title?: string
  onDataLoaded?: (data: SheetData | null) => void
  isMetricsPage?: boolean
  useMetricsSheet?: boolean
}

interface SheetsApiResponse {
  sheets: { properties: { title: string } }[]
}

// Add this at the top of the file
const getEnvironmentVariables = () => {
  const metricsSheetId = process.env.NEXT_PUBLIC_METRICS_SHEETS_ID
  const metricsApiKey = process.env.NEXT_PUBLIC_METRICS_SHEETS_API_KEY
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY

  if (!metricsSheetId || !metricsApiKey || !sheetId || !apiKey) {
    console.error("Missing required environment variables:", {
      metricsSheetIdSet: !!metricsSheetId,
      metricsApiKeySet: !!metricsApiKey,
      sheetIdSet: !!sheetId,
      apiKeySet: !!apiKey,
    })
    return null
  }

  return {
    metricsSheetId,
    metricsApiKey,
    sheetId,
    apiKey,
  }
}

export function GoogleSheetsEmbed(props: GoogleSheetsEmbedProps) {
  const { onDataLoaded } = props
  const [data, setData] = useState<SheetData | null>(null)
  const [sheets, setSheets] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSheets, setIsLoadingSheets] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState<SheetData | null>(null)
  const { user } = useAuth()

  // Helper function to normalize office names for comparison
  const normalizeOfficeName = useCallback((office: string): string => {
    // First try exact match
    if (office && typeof office === "string") {
      // Remove any extra whitespace but preserve commas and periods
      return office.replace(/\s+/g, " ").trim()
    }
    return ""
  }, [])

  // Add this function after the normalizeOfficeName function
  const formatRepName = useCallback((name: string): string => {
    if (!name) return ""

    // Check if the name contains a comma
    if (name.includes(",")) {
      // Split by comma and trim whitespace
      const parts = name.split(",").map((part) => part.trim())
      // Return "First Last" format
      return `${parts[1]} ${parts[0]}`
    }

    // If no comma, return the name as is
    return name
  }, [])

  const fetchSheetNames = useCallback(async (useMetricsSheet?: boolean): Promise<string[]> => {
    // Return static list of weeks instead of fetching
    return ["Current Week", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"]
  }, [])

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setIsLoadingSheets(true)
        const sheetList = await fetchSheetNames(props.useMetricsSheet)
        setSheets(sheetList)
        // Set Current Week as default
        setSelectedSheet("Current Week")
      } catch (error) {
        console.error("Error fetching sheet names:", error)
        setHasError(true)
      } finally {
        setIsLoadingSheets(false)
      }
    }

    fetchSheets()
  }, [props.useMetricsSheet, fetchSheetNames])

  // Update the fetchSheetData function
  const fetchSheetData = useCallback(
    async (sheetName: string) => {
      setIsLoading(true)
      try {
        const env = getEnvironmentVariables()
        if (!env) {
          throw new Error("Missing required environment variables")
        }

        const shouldUseMetricsSheet = props.useMetricsSheet !== false
        const sheetId = shouldUseMetricsSheet ? env.metricsSheetId : env.sheetId
        const apiKey = shouldUseMetricsSheet ? env.metricsApiKey : env.apiKey

        console.log("Environment variables check:", {
          sheetIdSet: !!sheetId,
          apiKeySet: !!apiKey,
        })

        console.log(`Fetching data for sheet: ${sheetName}`)
        console.log(`User office: ${user?.office}`)

        // Ensure we're fetching column K by using range A:K
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:K?key=${apiKey}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result: SheetData = await response.json()

        if (!result.values || result.values.length === 0) {
          throw new Error("No data found in sheet")
        }

        console.log("Sheet data fetched successfully. First row headers:", result.values[0])
        console.log("Sample row with status (row 2):", result.values.length > 1 ? result.values[1] : "No data rows")
        console.log("Total rows fetched:", result.values.length)

        const headers = result.values[0]
        const officeColumnIndex = headers.findIndex(
          (header) => header.toLowerCase().includes("office") || header.toLowerCase().includes("location"),
        )

        if (officeColumnIndex === -1) {
          console.warn("Office column not found in headers:", headers)
          // Continue without filtering by office
        }

        // Filter data based on user's office if they're not an admin
        let filteredValues = result.values
        if (user && user.role !== "admin" && user.office) {
          const userOfficeNormalized = normalizeOfficeName(user.office)
          console.log("User office (normalized):", userOfficeNormalized)

          filteredValues = [
            headers,
            ...result.values.slice(1).filter((row) => {
              const rowOffice = row[officeColumnIndex] ? normalizeOfficeName(row[officeColumnIndex]) : ""
              const matches = rowOffice === userOfficeNormalized
              if (matches) {
                console.log("Matched row office:", rowOffice)
              }
              return matches && row.some((cell) => cell.trim() !== "")
            }),
          ]

          console.log(`Filtered ${result.values.length - filteredValues.length} rows based on office`)
        }

        // Ensure we have valid data after filtering
        if (filteredValues.length <= 1) {
          console.log("No data found after filtering for office:", user?.office)
          filteredValues = [headers, ["No data available for your office"]]
        }

        // After fetching and filtering data, but before setting state
        // Find the rep name column index (usually contains "Sales Agent" or "Rep" in the header)
        const repNameColumnIndex = headers.findIndex(
          (header) =>
            header.toLowerCase().includes("sales agent") ||
            header.toLowerCase().includes("rep") ||
            header.toLowerCase().includes("agent"),
        )

        // If we found a rep name column, transform the names
        if (repNameColumnIndex !== -1) {
          filteredValues = filteredValues.map((row, rowIndex) => {
            // Skip the header row
            if (rowIndex === 0) return row

            const newRow = [...row]
            if (newRow[repNameColumnIndex]) {
              newRow[repNameColumnIndex] = formatRepName(newRow[repNameColumnIndex])
            }
            return newRow
          })
        }

        // After fetching and filtering data, but before setting state
        // Find the office column index
        const officeColumnIndex2 = headers.findIndex(
          (header) => header.toLowerCase().includes("office") || header.toLowerCase().includes("location"),
        )

        // Remove the office column from all rows if found
        if (officeColumnIndex2 !== -1) {
          filteredValues = filteredValues.map((row) => {
            const newRow = [...row]
            newRow.splice(officeColumnIndex2, 1)
            return newRow
          })
        }

        result.values = filteredValues

        setData(result)
        setFilteredData(result)
        if (onDataLoaded) {
          onDataLoaded(result)
        }
      } catch (error) {
        console.error("Error fetching Google Sheets data:", error)
        setHasError(true)
        setData(null)
        setFilteredData(null)
      } finally {
        setIsLoading(false)
      }
    },
    [onDataLoaded, props.useMetricsSheet, user, normalizeOfficeName, formatRepName],
  )

  useEffect(() => {
    if (selectedSheet) {
      fetchSheetData(selectedSheet)
    }
  }, [selectedSheet, fetchSheetData])

  useEffect(() => {
    if (!data) return

    const filtered = {
      ...data,
      values: [
        data.values[0],
        ...data.values
          .slice(1)
          .filter((row) => row.some((cell) => cell.toLowerCase().includes(searchTerm.toLowerCase()))),
      ],
    }
    setFilteredData(filtered)
  }, [searchTerm, data])

  const handleSort = (columnIndex: number) => {
    if (!filteredData) return

    const newData = { ...filteredData }
    const currentSortColumn = sortColumn === columnIndex.toString()
    const newDirection = currentSortColumn && sortDirection === "asc" ? "desc" : "asc"

    newData.values = [
      newData.values[0],
      ...newData.values.slice(1).sort((a, b) => {
        const valueA = a[columnIndex] || ""
        const valueB = b[columnIndex] || ""
        return (newDirection === "asc" ? 1 : -1) * valueA.localeCompare(valueB)
      }),
    ]

    setSortColumn(columnIndex.toString())
    setSortDirection(newDirection)
    setFilteredData(newData)
  }

  if (isLoading || isLoadingSheets) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400">Error loading data. Please try again later.</p>
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
          <Select value={selectedSheet || ""} onValueChange={setSelectedSheet}>
            <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select sheet" />
            </SelectTrigger>
            <SelectContent>
              {sheets.map((sheet) => (
                <SelectItem key={sheet} value={sheet}>
                  {sheet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        {props.title && (
          <h2 className="text-lg font-semibold text-white">
            {user?.role !== "admin"
              ? `${user?.office} ${props.title.replace(" Data", "")}`
              : props.title.replace(" Data", "")}
          </h2>
        )}
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
                    onClick={() => handleSort(index)}
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
                    // Check if this is the autopay column (case-insensitive check for header containing "autopay")
                    const isAutopayColumn =
                      filteredData.values[0][cellIndex] &&
                      filteredData.values[0][cellIndex].toLowerCase().includes("autopay")

                    // Check if this is the status column
                    const isStatusColumn =
                      filteredData.values[0][cellIndex] &&
                      filteredData.values[0][cellIndex].toLowerCase().includes("status")

                    // Process cell content based on column type
                    let cellContent = cell

                    // Add this new condition to check for phone number columns
                    const isPhoneColumn =
                      filteredData.values[0][cellIndex] &&
                      (filteredData.values[0][cellIndex].toLowerCase().includes("phone") ||
                        filteredData.values[0][cellIndex].toLowerCase().includes("mobile") ||
                        filteredData.values[0][cellIndex].toLowerCase().includes("cell"))

                    // Handle phone number formatting
                    if (isPhoneColumn && typeof cell === "string") {
                      cellContent = formatPhoneNumber(cell)
                    }
                    // Handle autopay column
                    else if (isAutopayColumn) {
                      cellContent = (
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
                      )
                    }
                    // Handle status column
                    else if (isStatusColumn) {
                      // Determine status type and apply appropriate styling
                      const statusLower = typeof cell === "string" ? cell.toLowerCase() : ""

                      // Simplify cancelled statuses first
                      let displayStatus = cell
                      if (statusLower.includes("cancelled (no ap)") || statusLower.includes("cancelled (ap)")) {
                        displayStatus = "Cancelled"
                      }

                      // Create styled status indicator
                      cellContent = (
                        <div className="flex justify-center items-center w-full">
                          {statusLower.includes("approved") ? (
                            <div className="w-32 h-8 rounded-full bg-green-500/20 flex items-center justify-center px-2">
                              <span className="text-green-500 font-medium">Approved</span>
                            </div>
                          ) : statusLower.includes("cancelled") ? (
                            <div className="w-32 h-8 rounded-full bg-red-500/20 flex items-center justify-center px-2">
                              <span className="text-red-500 font-medium">Cancelled</span>
                            </div>
                          ) : statusLower.includes("pending") ? (
                            <div className="w-32 h-8 rounded-full bg-white/5 flex items-center justify-center px-2">
                              <span className="text-gray-400 font-medium">Pending</span>
                            </div>
                          ) : statusLower.includes("pushed in") ? (
                            <div className="w-32 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center px-2">
                              <span className="text-yellow-500 font-medium">Pushed In</span>
                            </div>
                          ) : statusLower.includes("pushed out") ? (
                            <div className="w-32 h-8 rounded-full bg-purple-500/20 flex items-center justify-center px-2">
                              <span className="text-purple-500 font-medium">Pushed Out</span>
                            </div>
                          ) : statusLower.includes("jeopardy") ? (
                            <div className="w-32 h-8 rounded-full bg-gray-500/60 flex items-center justify-center px-2">
                              <span className="text-white font-medium">Jeopardy</span>
                            </div>
                          ) : statusLower.includes("rescheduled") ? (
                            <div className="w-32 h-8 rounded-full bg-blue-500/20 flex items-center justify-center px-2">
                              <span className="text-blue-500 font-medium">Rescheduled</span>
                            </div>
                          ) : statusLower.includes("working service") ? (
                            <div className="w-32 h-8 rounded-full bg-teal-500/20 flex items-center justify-center px-2">
                              <span className="text-teal-500 font-medium">Working Service</span>
                            </div>
                          ) : (
                            <div className="w-32 h-8 rounded-full bg-white/20 flex items-center justify-center px-2">
                              <span className="text-white font-medium">{displayStatus}</span>
                            </div>
                          )}
                        </div>
                      )
                    }

                    // Also update the TableCell className to center all status cells
                    return (
                      <TableCell
                        key={cellIndex}
                        className={`text-white/80 text-xs py-1.5 ${isAutopayColumn || isStatusColumn ? "text-center" : ""}`}
                        style={{
                          width: `${100 / filteredData.values[0].length}%`,
                          minWidth: "150px",
                          height: "48px",
                          maxHeight: "48px",
                          overflow: "visible",
                          whiteSpace: "normal",
                        }}
                      >
                        {cellContent}
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

