"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  //LabelList,
} from "recharts"
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Minus,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  PieChartIcon,
  BarChartHorizontal,
} from "lucide-react"

interface RepData {
  name: string
  value: number
}

interface RepMetrics {
  name: string
  totalSales: number
  approved: number
  cancelled: number
}

interface RepHighlightProps {
  category: string
  repMetrics?: RepMetrics[]
  bestRep?: RepData
  worstRep?: RepData
  isPercentage?: boolean
  invertColors?: boolean
}

const RepHighlight: React.FC<RepHighlightProps> = ({
  category,
  repMetrics,
  bestRep,
  worstRep,
  isPercentage = false,
  invertColors = false,
}) => {
  const formatValue = (value: number) => (isPercentage ? `${value}%` : value)
  const highestColor =
    category === "Total Eligible Sales" ? "text-emerald-400" : invertColors ? "text-emerald-400" : "text-emerald-400"
  const lowestColor =
    category === "Total Eligible Sales" ? "text-emerald-400" : invertColors ? "text-red-400" : "text-red-400"

  const gradientStyle = "bg-gradient-to-br from-green-500/20 via-transparent to-red-500/20"

  const topReps = repMetrics
    ? repMetrics
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 3)
        .map((rep) => ({ name: rep.name, value: rep.totalSales }))
    : undefined

  return (
    <div className={`bg-white/10 rounded-lg p-3 relative overflow-hidden`}>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            category === "Total Eligible Sales"
              ? "none"
              : "linear-gradient(135deg, rgba(16, 185, 129, 0.7) 0%, rgba(16, 185, 129, 0) 35%, rgba(239, 68, 68, 0) 65%, rgba(239, 68, 68, 0.7) 100%)",
        }}
      ></div>
      <div className="relative z-10">
        <h3 className="text-sm font-semibold mb-2 relative z-10">{category}</h3>
        {topReps ? (
          <div className="space-y-2 relative z-10">
            {topReps.map((rep, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs font-medium text-white">
                  {index + 1}. {rep.name}
                </span>
                <span className="text-xs font-semibold">{rep.value} Sales</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-between items-center relative z-10">
            <div className="flex flex-col">
              <span className="text-xs text-white/70">{invertColors ? "Highest" : "Lowest"}</span>
              <span className={`text-sm font-medium ${highestColor}`}>{bestRep?.name}</span>
              <span className="text-xs font-semibold">{formatValue(bestRep?.value || 0)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-white/70">{invertColors ? "Lowest" : "Highest"}</span>
              <span className={`text-sm font-medium ${lowestColor}`}>{worstRep?.name}</span>
              <span className="text-xs font-semibold">{formatValue(worstRep?.value || 0)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const formatStatus = (status: string): string => {
  const lowerStatus = status.toLowerCase()
  if (lowerStatus.includes("approved")) return "Approved"
  if (lowerStatus.includes("cancelled")) return "Cancelled"
  if (lowerStatus === "pushed in") return "Pushed In"
  if (lowerStatus === "working service") return "Working\nService"
  if (lowerStatus === "pending") return "Pending"
  if (lowerStatus === "pushed out") return "Pushed Out"
  if (lowerStatus === "jeopardy") return "Jeopardy"
  if (lowerStatus === "rescheduled") return "Rescheduled"
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const calculateSalesDifference = (todaySales: number, yesterdaySales: number) => {
  const difference = todaySales - yesterdaySales
  const percentageChange = ((difference / yesterdaySales) * 100).toFixed(1)
  return { difference, percentageChange }
}

const calculateStatusDifference = (todayCount: number, yesterdayCount: number, status: string) => {
  const difference = todayCount - yesterdayCount
  const percentageChange = yesterdayCount !== 0 ? ((difference / yesterdayCount) * 100).toFixed(1) : "100.0"
  let color = "text-yellow-300"
  let icon = <Minus className="h-3 w-3" />

  if (status === "Total Sales" || status === "Approved") {
    if (difference > 0) {
      color = "text-green-300"
      icon = "↑"
    } else if (difference < 0) {
      color = "text-red-300"
      icon = "↓"
    } else {
      color = "text-red-300"
    }
  } else {
    // Cancelled or Pending
    if (difference > 0) {
      color = "text-red-300"
      icon = "↑"
    } else if (difference < 0) {
      color = "text-green-300"
      icon = "↓"
    } else {
      color = "text-green-300"
    }
  }

  return { difference, percentageChange, color, icon }
}

interface MetricsDisplayProps {
  data: any[] | null
}

const calculatePercentages = (data: { name: string; value: number }[]) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return data.map((item) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1),
  }))
}

const simplifyData = (data: { name: string; value: number }[]) => {
  return data.reduce(
    (acc, item) => {
      if (item.name === "Approved" || item.name === "Cancelled") {
        acc.push(item)
      } else {
        const pendingIndex = acc.findIndex((i) => i.name === "Pending")
        if (pendingIndex === -1) {
          acc.push({ name: "Pending", value: item.value })
        } else {
          acc[pendingIndex].value += item.value
        }
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )
}

const calculateSimplifiedPending = (statusCounts: Record<string, number>) => {
  return Object.entries(statusCounts).reduce((total, [status, count]) => {
    if (status !== "Approved" && status !== "Cancelled") {
      return total + count
    }
    return total
  }, 0)
}

// First, add a function to get the user's office from localStorage
const getUserOffice = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userOffice")
  }
  return null
}

// Add a function to get the office column index
const getOfficeColumnIndex = (headers: string[]): number => {
  // Look for column headers that might contain office information
  const index = headers.findIndex(
    (header) =>
      header.toLowerCase().includes("office") ||
      header.toLowerCase().includes("location") ||
      header.toLowerCase() === "a",
  )
  return index === -1 ? 0 : index // Default to first column if not found
}

// Update the getSalesAgentColumnIndex function to prioritize column B
const getSalesAgentColumnIndex = (headers: string[]): number => {
  // First check if column B (index 1) should be used for rep names
  if (headers.length > 1) {
    return 1 // Return index 1 which is column B
  }

  // Fallback to the old logic if needed
  const index = headers.findIndex((header) => header.toLowerCase().includes("sales agent"))
  return index === -1 ? 0 : index
}

// Update the calculateTopReps function to use column B for rep names
const calculateTopReps = (data: any[]): RepMetrics[] => {
  if (!data || data.length < 2) return []
  const headers = data[0]
  const salesAgentIndex = 1 // Use column B (index 1) directly
  const statusIndex = getStatusColumnIndex(headers)
  const officeIndex = getOfficeColumnIndex(headers)
  const userOffice = getUserOffice()

  const repSales: Record<string, { total: number; approved: number; cancelled: number }> = {}

  // Filter data by office if user is not admin
  const filteredData = data.slice(1).filter((row) => {
    const hasData = row.slice(0, 9).some((cell) => cell.trim() !== "")
    if (!userOffice || userOffice === "ALL") {
      return hasData
    }
    return hasData && row[officeIndex] === userOffice
  })

  filteredData.forEach((row) => {
    const status = formatStatus(row[statusIndex])
    const rep = swapNames(row[salesAgentIndex])
    if (!repSales[rep]) {
      repSales[rep] = { total: 0, approved: 0, cancelled: 0 }
    }
    repSales[rep].total += 1
    if (status === "Approved") {
      repSales[rep].approved += 1
    } else if (status === "Cancelled") {
      repSales[rep].cancelled += 1
    }
  })

  return Object.entries(repSales)
    .map(([name, stats]) => ({
      name,
      totalSales: stats.total,
      approved: stats.approved,
      cancelled: stats.cancelled,
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
}

const getStatusColumnIndex = (headers: string[]): number => {
  const index = headers.findIndex((header) => header.toLowerCase().includes("status"))
  return index === -1 ? 0 : index
}

const swapNames = (name: string | undefined | null): string => {
  if (!name) return ""
  const parts = name.split(",")
  if (parts.length > 1) {
    const firstName = parts[1].trim()
    const lastName = parts[0].trim()
    return `${firstName} ${lastName}`
  } else {
    const nameParts = name.trim().split(" ")
    if (nameParts.length > 1) {
      return `${nameParts[nameParts.length - 1]} ${nameParts.slice(0, -1).join(" ")}`
    }
  }
  return name
}

const calculateBestWorstRep = (repMetrics: RepMetrics[], category: string, isBest: boolean): RepData | undefined => {
  if (!repMetrics || repMetrics.length === 0) return undefined

  const sortedReps = [...repMetrics].sort((a, b) => {
    if (category === "approvalRate") {
      return b.approved / b.totalSales - a.approved / a.totalSales
    } else if (category === "cancelRate") {
      return b.cancelled / b.totalSales - a.cancelled / a.totalSales
    }
    return b.totalSales - a.totalSales
  })

  const rep = isBest ? sortedReps[0] : sortedReps[sortedReps.length - 1]
  let value: number

  if (category === "approvalRate") {
    value = (rep.approved / rep.totalSales) * 100
  } else if (category === "cancelRate") {
    value = (rep.cancelled / rep.totalSales) * 100
  } else {
    value = rep.totalSales
  }

  return { name: rep.name, value: Number(value.toFixed(1)) }
}

function MetricsDisplay({ data }: MetricsDisplayProps) {
  const [chartView, setChartView] = useState<"detailed" | "simplified" | "bar">("detailed")
  const [activeIndex, setActiveIndex] = useState(-1)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  // Modify the metrics useMemo hook to filter by office
  const metrics = useMemo(() => {
    if (!data) return null

    const userOffice = getUserOffice()
    const headers = data[0]
    const officeIndex = getOfficeColumnIndex(headers)
    const statusColIndex = headers.findIndex((header) => header.toLowerCase().includes("status"))
    const internetColIndex = headers.findIndex((header) => header.toLowerCase().includes("internet"))
    const tvColIndex = headers.findIndex((header) => header.toLowerCase().includes("tv"))

    // Filter rows by office if user is not admin
    const filteredRows = data.slice(1).filter((row) => {
      const hasData = row.slice(0, 11).some((cell) => cell && cell.trim() !== "")
      if (!userOffice || userOffice === "ALL") {
        return hasData
      }
      return hasData && row[officeIndex] === userOffice
    })

    console.log("Total filtered rows:", filteredRows.length)

    // Initialize counters
    let approvedCount = 0
    let cancelledCount = 0
    let pendingCount = 0
    let totalUnits = 0

    // Count units and statuses based on columns H and I
    filteredRows.forEach((row) => {
      const status = row[statusColIndex] ? row[statusColIndex].toString().trim().toLowerCase() : ""

      // Check if columns H and I have entries (index 7 and 8 respectively)
      const hasServiceH = row[7] && row[7].toString().trim() !== ""
      const hasServiceI = row[8] && row[8].toString().trim() !== ""

      // Count units (2 if both services, 1 if either service)
      const units = hasServiceH && hasServiceI ? 2 : hasServiceH || hasServiceI ? 1 : 1
      totalUnits += units

      // Update status counts based on the number of units
      if (status.includes("approved")) {
        approvedCount += units
      } else if (status.includes("cancelled")) {
        cancelledCount += units
      } else {
        pendingCount += units
      }
    })

    console.log("Unit counts by status:", {
      approved: approvedCount,
      cancelled: cancelledCount,
      pending: pendingCount,
      totalUnits: totalUnits,
    })

    // Simulate yesterday's data based on filtered data
    const yesterdayApproved = Math.max(0, approvedCount - Math.floor(Math.random() * 5))
    const yesterdayCancelled = Math.max(0, cancelledCount - Math.floor(Math.random() * 5))
    const yesterdayPending = Math.max(0, pendingCount - Math.floor(Math.random() * 5))
    const yesterdayTotal = yesterdayApproved + yesterdayCancelled + yesterdayPending

    // Create status counts for pie chart (keep the original implementation for pie chart)
    const statusCounts: Record<string, number> = {}

    filteredRows.forEach((row) => {
      const status = row[statusColIndex] ? row[statusColIndex].toString().trim() : ""
      if (status) {
        const formattedStatus = formatStatus(status)
        // For pie chart, count each unit separately
        const hasInternet =
          internetColIndex !== -1 &&
          row[internetColIndex] &&
          row[internetColIndex].toString().trim().toLowerCase() === "yes"
        const hasTv = tvColIndex !== -1 && row[tvColIndex] && row[tvColIndex].toString().trim().toLowerCase() === "yes"
        const units = (hasInternet ? 1 : 0) + (hasTv ? 1 : 0)
        const totalRowUnits = units > 0 ? units : 1
        statusCounts[formattedStatus] = (statusCounts[formattedStatus] || 0) + totalRowUnits
      }
    })

    return {
      totalSales: totalUnits, // This is now total units
      Approved: approvedCount,
      Cancelled: cancelledCount,
      simplifiedPending: pendingCount,
      yesterdayTotalSales: yesterdayTotal,
      yesterdayStatusCounts: {
        Approved: yesterdayApproved,
        Cancelled: yesterdayCancelled,
      },
      yesterdaySimplifiedPending: yesterdayPending,
      ...statusCounts,
    }
  }, [data])

  const totalSales = metrics?.totalSales || 0
  // This calculates the percentage based on total sales
  const approvedPercentage = totalSales > 0 ? (((metrics?.Approved || 0) / totalSales) * 100).toFixed(1) : "0.0"
  const cancelledPercentage = totalSales > 0 ? (((metrics?.Cancelled || 0) / totalSales) * 100).toFixed(1) : "0.0"
  const pendingPercentage = totalSales > 0 ? (((metrics?.simplifiedPending || 0) / totalSales) * 100).toFixed(1) : "0.0"

  const repMetrics = calculateTopReps(data)
  const topReps = calculateTopReps(data)

  const salesDifference = useMemo(() => {
    return calculateStatusDifference(metrics?.totalSales || 0, metrics?.yesterdayTotalSales || 0, "Total Sales")
  }, [metrics])

  const approvedDifference = useMemo(() => {
    return calculateStatusDifference(metrics?.Approved || 0, metrics?.yesterdayStatusCounts?.Approved || 0, "Approved")
  }, [metrics])

  const cancelledDifference = useMemo(() => {
    return calculateStatusDifference(
      metrics?.Cancelled || 0,
      metrics?.yesterdayStatusCounts?.Cancelled || 0,
      "Cancelled",
    )
  }, [metrics])

  const pendingDifference = useMemo(() => {
    return calculateStatusDifference(
      metrics?.simplifiedPending || 0,
      metrics?.yesterdaySimplifiedPending || 0,
      "Pending",
    )
  }, [metrics])

  const pieChartData = Object.entries(metrics || {})
    .filter(
      ([key]) =>
        key !== "totalSales" &&
        key !== "yesterdayTotalSales" &&
        key !== "yesterdayStatusCounts" &&
        key !== "simplifiedPending" &&
        key !== "yesterdaySimplifiedPending" &&
        // Add this condition to filter out zero values
        typeof metrics[key] === "number" &&
        metrics[key] > 0,
    )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const order = [
        "Approved",
        "Cancelled",
        "Pending",
        "Pushed Out",
        "Pushed In",
        "Jeopardy",
        "Rescheduled",
        "Working\nService",
      ]
      return order.indexOf(a.name) - order.indexOf(b.name)
    })

  const barChartData = Object.entries(metrics || {})
    .map(([name, value]) => ({ name, value }))
    .filter(
      (item) =>
        item.name !== "totalSales" &&
        item.name !== "yesterdayTotalSales" &&
        item.name !== "yesterdayStatusCounts" &&
        item.name !== "simplifiedPending" &&
        item.name !== "yesterdaySimplifiedPending",
    )
    .sort((a, b) => b.value - a.value)

  const STATUS_COLORS: Record<string, string> = {
    Approved: "#10b981",
    Cancelled: "#ef4444",
    Pending: "#ffd166",
    "Pushed Out": "#8b5cf6",
    "Pushed In": "#f59e0b",
    Jeopardy: "#6b7280",
    Rescheduled: "#3b82f6",
    "Working\nService": "#14b8a6",
  }

  const handleLeftArrowClick = () => {
    setChartView((currentView) => {
      switch (currentView) {
        case "detailed":
          return "bar"
        case "bar":
          return "simplified"
        case "simplified":
          return "detailed"
        default:
          return "detailed"
      }
    })
  }

  const handleRightArrowClick = () => {
    setChartView((currentView) => {
      switch (currentView) {
        case "detailed":
          return "simplified"
        case "simplified":
          return "bar"
        case "bar":
          return "detailed"
        default:
          return "detailed"
      }
    })
  }

  if (!metrics) return <div className="text-white">Loading metrics...</div>

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Units Card */}
        <Card className="bg-gradient-to-br from-cyan-700/70 to-blue-800/80 border-white/30 text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg relative group h-[120px]">
          <div className="absolute inset-0 bg-cyan-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-3">
            <CardTitle className="text-base font-bold">Total Units</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{metrics.totalSales}</div>
              <div className="rounded-full bg-cyan-600/60 p-2 transition-all duration-300 group-hover:scale-110">
                <TrendingUp className="h-5 w-5 text-cyan-300" />
              </div>
            </div>
            <div className={`text-xs ${salesDifference.color} flex items-center`}>
              <span className={`mr-1 ${salesDifference.color} flex items-center`}>
                {typeof salesDifference.icon === "string" ? (
                  salesDifference.icon
                ) : (
                  <span className="flex items-center">{salesDifference.icon}</span>
                )}
              </span>
              <span className="flex items-center">
                {Math.abs(salesDifference.difference)} ({Math.abs(Number(salesDifference.percentageChange))}%) from
                yesterday
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Approved Units Card */}
        <Card className="bg-gradient-to-br from-green-700/70 to-emerald-800/80 border-white/30 text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg relative group h-[120px]">
          <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-3">
            <CardTitle className="text-base font-bold">Approved Units</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold" style={{ color: STATUS_COLORS.Approved }}>
                {metrics?.Approved || 0} <span className="text-lg">({approvedPercentage}%)</span>
              </div>
              <div className="rounded-full bg-green-600/60 p-2 transition-all duration-300 group-hover:scale-110">
                <CheckCircle className="h-5 w-5 text-green-300" />
              </div>
            </div>
            <div className={`text-xs ${approvedDifference.color} mt-1 flex items-center`}>
              <span className={`mr-1 ${approvedDifference.color} flex items-center`}>
                {typeof approvedDifference.icon === "string" ? (
                  approvedDifference.icon
                ) : (
                  <span className="flex items-center">{approvedDifference.icon}</span>
                )}
              </span>
              <span className="flex items-center">
                {Math.abs(approvedDifference.difference)} ({Math.abs(Number(approvedDifference.percentageChange))}%)
                from yesterday
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Cancelled Units Card */}
        <Card className="bg-gradient-to-br from-red-700/70 to-pink-800/80 border-white/30 text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg relative group h-[120px]">
          <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-3">
            <CardTitle className="text-base font-bold">Cancelled Units</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold" style={{ color: STATUS_COLORS.Cancelled }}>
                {metrics?.Cancelled || 0} <span className="text-lg">({cancelledPercentage}%)</span>
              </div>
              <div className="rounded-full bg-red-600/60 p-2 transition-all duration-300 group-hover:scale-110">
                <XCircle className="h-5 w-5 text-red-300" />
              </div>
            </div>
            <div className={`text-xs ${cancelledDifference.color} mt-1 flex items-center`}>
              <span className={`mr-1 ${cancelledDifference.color} flex items-center`}>
                {typeof cancelledDifference.icon === "string" ? (
                  cancelledDifference.icon
                ) : (
                  <span className="flex items-center">{cancelledDifference.icon}</span>
                )}
              </span>
              <span className="flex items-center">
                {Math.abs(cancelledDifference.difference)} ({Math.abs(Number(cancelledDifference.percentageChange))}%)
                from yesterday
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Units Card */}
        <Card className="bg-gradient-to-br from-yellow-700/70 to-orange-800/80 border-white/30 text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg relative group h-[120px]">
          <div className="absolute inset-0 bg-yellow-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-3">
            <CardTitle className="text-base font-bold">Pending Units</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold" style={{ color: STATUS_COLORS.Pending }}>
                {metrics?.simplifiedPending || 0} <span className="text-lg">({pendingPercentage}%)</span>
              </div>
              <div className="rounded-full bg-yellow-600/60 p-2 transition-all duration-300 group-hover:scale-110">
                <Clock className="h-5 w-5 text-yellow-300" />
              </div>
            </div>
            <div className={`text-xs ${pendingDifference.color} mt-1 flex items-center`}>
              <span className={`mr-1 ${pendingDifference.color} flex items-center`}>
                {typeof pendingDifference.icon === "string" ? (
                  pendingDifference.icon
                ) : (
                  <span className="flex items-center">{pendingDifference.icon}</span>
                )}
              </span>
              <span className="flex items-center">
                {Math.abs(pendingDifference.difference)} ({Math.abs(Number(pendingDifference.percentageChange))}%) from
                yesterday
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 max-h-[500px]">
        {/* Status Distribution Chart */}
        <Card className="bg-indigo-900/20 border-white/20 text-white col-span-1 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative group h-[450px]">
          <div className="absolute inset-0 bg-indigo-800 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
          <CardHeader className="relative pt-5 pb-3">
            <CardTitle className="text-left text-2xl font-bold">Status Distribution</CardTitle>
            <div className="bg-white/20 backdrop-filter backdrop-blur-lg border border-white/30 rounded-full p-1.5 flex items-center space-x-1 absolute top-3 right-3 z-10">
              <PieChartIcon
                className={`h-5 w-5 text-white cursor-pointer transition-all duration-300 ${
                  chartView === "simplified" ? "opacity-100" : "opacity-50 hover:opacity-75"
                }`}
                onClick={() => setChartView("simplified")}
              />
              <BarChart2
                className={`h-5 w-5 text-white cursor-pointer transition-all duration-300 ${
                  chartView === "bar" ? "opacity-100" : "opacity-50 hover:opacity-75"
                }`}
                onClick={() => setChartView("bar")}
              />
              <BarChartHorizontal
                className={`h-5 w-5 text-white cursor-pointer transition-all duration-300 ${
                  chartView === "detailed" ? "opacity-100" : "opacity-50 hover:opacity-75"
                }`}
                onClick={() => setChartView("detailed")}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative">
            {!pieChartData.length ? (
              <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-12 w-12 mb-3 text-white/40"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-white/60">
                  Nothing to see here...
                  <br />
                  Check in later for updates
                </p>
              </div>
            ) : (
              <>
                <div className="absolute left-4 top-[calc(40%)] transform -translate-y-1/2 z-10">
                  <ChevronLeft
                    className="h-6 w-6 text-white/50 hover:text-white cursor-pointer transition-colors duration-200"
                    onClick={handleLeftArrowClick}
                    aria-label="Previous chart view"
                  />
                </div>
                <div className="absolute right-4 top-[calc(40%)] transform -translate-y-1/2 z-10">
                  <ChevronRight
                    className="h-6 w-6 text-white/50 hover:text-white cursor-pointer transition-colors duration-200"
                    onClick={handleRightArrowClick}
                    aria-label="Next chart view"
                  />
                </div>
                {chartView === "bar" ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={chartView === "simplified" ? simplifyData(pieChartData) : pieChartData}
                      margin={{ top: 5, right: 30, bottom: 5, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis
                        dataKey="name"
                        stroke="rgba(255, 255, 255, 0.7)"
                        tick={false}
                        axisLine={{ stroke: "rgba(255, 255, 255, 0.3)" }}
                      />
                      <YAxis
                        stroke="rgba(255, 255, 255, 0.7)"
                        tick={{ fill: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}
                        tickLine={{ stroke: "rgba(255, 255, 255, 0.3)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                        labelStyle={{ color: "white", fontWeight: "bold" }}
                        itemStyle={{ color: "white" }}
                        formatter={(value, name, props) => {
                          if (props.payload && Array.isArray(props.payload)) {
                            const total = props.payload.reduce((sum, entry) => sum + (entry.value || 0), 0)
                            const percent = ((value / total) * 100).toFixed(1)
                            return [`${value} Sales (${percent}%)`, ""]
                          }
                          return [`${value} Sales`, ""]
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {(chartView === "simplified" ? simplifyData(pieChartData) : pieChartData).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={STATUS_COLORS[entry.name] || "#a855f7"}
                              style={{
                                filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))",
                                transition: "all 0.3s ease",
                              }}
                            />
                          ),
                        )}
                        {/* <LabelList
                        dataKey="name"
                        position="insideTop"
                        fill="rgba(255, 255, 255, 0.9)"
                        style={{ fontSize: "10px", fontWeight: "bold" }}
                      /> */}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <defs>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="0" stdDeviation="2" floodOpacity="0.5" />
                        </filter>
                      </defs>
                      <Pie
                        data={chartView === "simplified" ? simplifyData(pieChartData) : pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={4}
                        stroke="none"
                        activeIndex={activeIndex}
                        onMouseEnter={(_, index) => {
                          setActiveIndex(index)
                          setHoveredIndex(index)
                        }}
                        onMouseLeave={() => {
                          setActiveIndex(-1)
                          setHoveredIndex(null)
                        }}
                        activeShape={(props) => {
                          const RADIAN = Math.PI / 180
                          const {
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            startAngle,
                            endAngle,
                            fill,
                            payload,
                            percent,
                            value,
                          } = props

                          const sin = Math.sin(-RADIAN * midAngle)
                          const cos = Math.cos(-RADIAN * midAngle)
                          const sx = cx + (outerRadius + 10) * cos
                          const sy = cy + (outerRadius + 10) * sin
                          const mx = cx + (outerRadius + 30) * cos
                          const my = cy + (outerRadius + 30) * sin
                          const ex = mx + (cos >= 0 ? 1 : -1) * 22
                          const ey = my
                          const textAnchor = cos >= 0 ? "start" : "end"

                          return (
                            <g>
                              {/* Animated active sector */}
                              <Sector
                                cx={cx}
                                cy={cy}
                                innerRadius={innerRadius}
                                outerRadius={outerRadius + 6}
                                startAngle={startAngle}
                                endAngle={endAngle}
                                fill={fill}
                                cornerRadius={4}
                                className="transition-all duration-500 ease-in-out"
                              />
                              {/* Animated connector line */}
                              <path
                                d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                                stroke={fill}
                                strokeWidth={2}
                                fill="none"
                                className="transition-all duration-500 ease-in-out"
                              />
                              {/* Animated end point */}{" "}
                              <circle
                                cx={ex}
                                cy={ey}
                                r={4}
                                fill={fill}
                                stroke="none"
                                className="transition-all duration-500 ease-in-out"
                              />
                              {/* Status label with enhanced styling */}
                              <text
                                x={cx}
                                y={cy}
                                dy={12} // Updated dy attribute
                                textAnchor="middle"
                                fill="#fff"
                                className="text-base font-bold transition-all duration-500 ease-in-out"
                                style={{ textShadow: "0 0 8px rgba(0, 0, 0, 0.5)" }}
                              >
                                {payload.name.split("\n").map((line, i) => (
                                  <tspan key={i} x={cx} dy={i === 0 ? 0 : 20}>
                                    {line}
                                  </tspan>
                                ))}
                              </text>
                              {/* Value and percentage with enhanced styling */}
                              <text
                                x={ex + (cos >= 0 ? 1 : -1) * 12}
                                y={ey}
                                dy={12} // Updated dy attribute
                                textAnchor={textAnchor}
                                fill="#fff"
                                className="transition-all duration-500 ease-in-out"
                                style={{ filter: "drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))" }}
                              >
                                <tspan
                                  x={ex + (cos >= 0 ? 1 : -1) * 12}
                                  dy="-0.5em"
                                  className="text-sm font-bold"
                                  fill={fill}
                                  style={{ filter: "drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))" }}
                                >
                                  {`${value.toLocaleString()} Units`}
                                </tspan>
                                <tspan
                                  x={ex + (cos >= 0 ? 1 : -1) * 12}
                                  dy="1.5em"
                                  className="text-xs"
                                  fill="rgba(255, 255, 255, 0.9)"
                                  style={{ filter: "drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))" }}
                                >
                                  {`(${(percent * 100).toFixed(1)}%)`}
                                </tspan>
                              </text>
                            </g>
                          )
                        }}
                        animate={{ duration: 800, easing: "ease-in-out" }}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={STATUS_COLORS[entry.name] || "#a855f7"}
                            className="transition-all duration-500ease-in-out hover:opacity-80"
                            style={{
                              transform: hoveredIndex === index ? `scale(1.05)` : "none",
                              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          />
                        ))}
                      </Pie>
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-lg font-bold fill-white"
                        filter="url(#shadow)"
                      >
                        <tspan x="50%" dy="0.5em">
                          {hoveredIndex !== null ? pieChartData[hoveredIndex].name : "Status"}
                        </tspan>{" "}
                        <tspan x="50%" dy="1.7em" className="text-base">
                          {hoveredIndex !== null
                            ? `${pieChartData[hoveredIndex].value} Sales`
                            : pieChartData.reduce((sum, item) => sum + item.value, 0)}
                        </tspan>
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="flex justify-between h-8 text-[10px] space-x-2">
                  {calculatePercentages(chartView === "simplified" ? simplifyData(pieChartData) : pieChartData).map(
                    (item, index) => (
                      <div
                        key={item.name}
                        className={`flex-1 text-center transition-all duration-300 ${
                          index === activeIndex || index === hoveredIndex ? "font-bold scale-105" : ""
                        }`}
                        onMouseEnter={() => {
                          setActiveIndex(index)
                          setHoveredIndex(index)
                        }}
                        onMouseLeave={() => {
                          setActiveIndex(-1)
                          setHoveredIndex(null)
                        }}
                      >
                        <span
                          className="font-semibold"
                          style={{
                            color:
                              index === activeIndex || index === hoveredIndex
                                ? STATUS_COLORS[item.name] || "#a855f7"
                                : "inherit",
                          }}
                        >
                          {item.name.split("\n").map((line, i) => (
                            <span key={i} className="block leading-tight">
                              {line}
                            </span>
                          ))}
                        </span>
                        <span>
                          {item.value} ({item.percentage}%)
                        </span>
                      </div>
                    ),
                  )}
                </div>
                <div
                  className="flex h-6 rounded-lg overflow-hidden relative mx-[-2px]"
                  onMouseLeave={() => {
                    setActiveIndex(-1)
                    setHoveredIndex(null)
                  }}
                >
                  {calculatePercentages(chartView === "simplified" ? simplifyData(pieChartData) : pieChartData).map(
                    (item, index) => (
                      <div
                        key={item.name}
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: STATUS_COLORS[item.name] || "#a855f7",
                          margin: "0 2px",
                        }}
                        className="transition-all duration-300 hover:brightness-110 relative group h-full rounded-sm"
                        onMouseEnter={() => {
                          setActiveIndex(index)
                          setHoveredIndex(index)
                        }}
                      >
                        <div
                          className={`absolute inset-0 bg-white opacity-0 transition-opacity duration-300 ${
                            index === activeIndex || index === hoveredIndex ? "opacity-20" : ""
                          }`}
                        ></div>
                      </div>
                    ),
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Rep Highlights Card */}
        <Card className="bg-indigo-900/20 border-white/20 text-white col-span-1 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative group h-[450px]">
          <div className="absolute inset-0 bg-indigo-800 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
          <CardHeader className="pt-5 pb-3">
            <CardTitle className="text-2xl font-bold">Rep Highlights</CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="space-y-4">
              <RepHighlight category="Total Eligible Sales" repMetrics={repMetrics} />
              <RepHighlight
                category="Approval Rate"
                bestRep={calculateBestWorstRep(repMetrics, "approvalRate", true)}
                worstRep={calculateBestWorstRep(repMetrics, "approvalRate", false)}
                isPercentage
              />
              <RepHighlight
                category="Cancel Rate"
                bestRep={calculateBestWorstRep(repMetrics, "cancelRate", false)}
                worstRep={calculateBestWorstRep(repMetrics, "cancelRate", true)}
                isPercentage
                invertColors
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <style jsx>{`
        .hover\\:drop-shadow-glow:hover {
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
        }
        .transition-all{
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 500ms;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .recharts-bar-rectangle:hover {
          filter: brightness(1.2) drop-shadow(0px 6px 8px rgba(0, 0, 0, 0.2));
        }
      `}</style>
    </div>
  )
}

export default MetricsDisplay

