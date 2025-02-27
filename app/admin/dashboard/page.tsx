"use client"

import { Header } from "@/components/header"
import { DashboardMetricsCards } from "@/components/dashboard-metrics-cards"
import { TeamSection } from "@/components/team-section"

export default function AdminDashboardPage() {
  return (
    <div className="h-full pt-6 px-6 pb-6">
      <Header />
      <div className="mt-6 grid gap-6 grid-cols-1">
        <DashboardMetricsCards />
        <TeamSection />
      </div>
    </div>
  )
}

