"use client"

import { Header } from "@/components/header"

export default function OfficesPage() {
  return (
    <div className="h-full p-6">
      <Header />
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Offices Dashboard</h2>
        <div className="bg-white/10 p-4 rounded-lg">
          <p className="text-white">Office locations and management tools will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}

