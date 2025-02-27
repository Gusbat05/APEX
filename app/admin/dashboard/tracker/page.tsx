"use client"

import { Header } from "@/components/header"
import { GoogleSheetsEmbed } from "@/components/tracker/google-sheets-embed"

export default function AdminTrackerPage() {
  return (
    <div className="flex flex-col h-full p-6">
      <Header />
      <div className="mt-6 flex-1 overflow-hidden">
        <h2 className="text-2xl font-semibold text-white mb-4">Admin Tracker</h2>
        <div className="h-[calc(100%-2rem)] overflow-hidden">
          <GoogleSheetsEmbed title="Admin Tracker Data" useMetricsSheet={true} />
        </div>
      </div>
    </div>
  )
}

