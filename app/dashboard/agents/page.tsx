"use client"

import { Header } from "@/components/header"

export default function AgentsPage() {
  return (
    <div className="h-full p-6">
      <Header />
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Agents Dashboard</h2>
        <div className="bg-white/10 p-4 rounded-lg">
          <p className="text-white">Agent performance and management tools will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}

