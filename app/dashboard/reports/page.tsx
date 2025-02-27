"use client"

import { Header } from "@/components/header"

export default function ReportsPage() {
  return (
    <div className="h-full p-6">
      <Header />
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Reports Dashboard</h2>
        <div className="bg-white/10 p-4 rounded-lg">
          <p className="text-white">Various reports and analytics will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}

