"use client"

import { Header } from "@/components/header"
import { GoogleSheetsEmbed } from "@/components/tracker/google-sheets-embed"

export default function TrackerPage() {
  return (
    <div className="flex flex-col h-full p-6">
      <Header />
      <div className="mt-6 flex-1 overflow-hidden">
        <div className="h-[calc(100%-2rem)] overflow-hidden">
          <GoogleSheetsEmbed title="Tracker Data" useMetricsSheet={true} />
        </div>
      </div>
    </div>
  )
}

