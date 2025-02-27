"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"

interface MetricsData {
  totalSales: number
  approved: number
  cancelled: number
  pending: number
  totalReps: number
  approvedPercentage: string
  cancelledPercentage: string
  pendingPercentage: string
}

const calculateMetrics = (data: any[]): MetricsData => {
  if (!data || data.length < 2) {
    return {
      totalSales: 0,
      approved: 0,
      cancelled: 0,
      pending: 0,
      totalReps: 0,
      approvedPercentage: "0",
      cancelledPercentage: "0",
      pendingPercentage: "0",
    }
  }

  const headers = data[0]
  const statusIndex = headers.findIndex((header: string) => header.toLowerCase().includes("status"))
  const repIndex = headers.findIndex((header: string) => header.toLowerCase().includes("sales agent"))
  const internetIndex = headers.findIndex(
    (header: string) => header.toLowerCase().includes("internet") || header.toLowerCase().includes("data"),
  )
  const tvIndex = headers.findIndex(
    (header: string) => header.toLowerCase().includes("tv") || header.toLowerCase().includes("television"),
  )

  const reps = new Set()
  let approved = 0
  let cancelled = 0
  let pending = 0
  let totalSales = 0

  data.slice(1).forEach((row: string[]) => {
    if (row.some((cell: string) => cell.trim() !== "")) {
      const status = row[statusIndex]?.toLowerCase() || ""
      const rep = row[repIndex]
      if (rep) reps.add(rep)

      // Determine if this row has internet and/or TV
      const hasInternet = internetIndex !== -1 && row[internetIndex]?.toLowerCase() === "yes"
      const hasTv = tvIndex !== -1 && row[tvIndex]?.toLowerCase() === "yes"

      // Count units (if both internet and TV, count as 2 units)
      const units = (hasInternet ? 1 : 0) + (hasTv ? 1 : 0)
      const totalRowUnits = units > 0 ? units : 1

      totalSales += totalRowUnits

      if (status.includes("approved")) {
        approved += totalRowUnits // Count each unit as approved
      } else if (status.includes("cancelled")) {
        cancelled += totalRowUnits // Count each unit as cancelled
      } else {
        pending += totalRowUnits // Count each unit as pending
      }
    }
  })

  return {
    totalSales,
    approved,
    cancelled,
    pending,
    totalReps: reps.size,
    approvedPercentage: ((approved / totalSales) * 100).toFixed(1),
    cancelledPercentage: ((cancelled / totalSales) * 100).toFixed(1),
    pendingPercentage: ((pending / totalSales) * 100).toFixed(1),
  }
}

export function DashboardMetricsCards() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${process.env.NEXT_PUBLIC_METRICS_SHEETS_ID}/values/Current Week!A:J?key=${process.env.NEXT_PUBLIC_METRICS_SHEETS_API_KEY}`,
        )
        if (!response.ok) throw new Error("Failed to fetch data")
        const result = await response.json()
        const calculatedMetrics = calculateMetrics(result.values)
        setMetrics(calculatedMetrics)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to load metrics")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/5 backdrop-filter backdrop-blur-lg border-white/10">
            <CardContent className="p-6 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-6">
          <p className="text-red-400">Error loading metrics: {error}</p>
        </CardContent>
      </Card>
    )
  }

  const cards = [
    {
      title: "Total Sales",
      value: metrics?.totalSales || 0,
      icon: TrendingUp,
      gradient: "from-cyan-500/30 to-blue-500/30",
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/30",
    },
    {
      title: "Approved",
      value: metrics?.approved || 0,
      percentage: metrics?.approvedPercentage,
      icon: CheckCircle,
      gradient: "from-green-500/30 to-emerald-500/30",
      iconColor: "text-green-400",
      iconBg: "bg-green-500/30",
    },
    {
      title: "Cancelled",
      value: metrics?.cancelled || 0,
      percentage: metrics?.cancelledPercentage,
      icon: XCircle,
      gradient: "from-red-500/30 to-pink-500/30",
      iconColor: "text-red-400",
      iconBg: "bg-red-500/30",
    },
    {
      title: "Pending",
      value: metrics?.pending || 0,
      percentage: metrics?.pendingPercentage,
      icon: Clock,
      gradient: "from-yellow-500/30 to-orange-500/30",
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-500/30",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${card.gradient} border-white/10 text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg relative group h-[120px]`}
        >
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${card.iconBg}`}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-3">
            <CardTitle className="text-base font-bold">{card.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                {card.value} {card.percentage && <span className="text-lg">({card.percentage}%)</span>}
              </div>
              <div className={`rounded-full ${card.iconBg} p-2 transition-all duration-300 group-hover:scale-110`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
            {index === 0 && metrics?.totalReps && (
              <div className="text-xs text-white/70 flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{metrics.totalReps} Active Representatives</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

