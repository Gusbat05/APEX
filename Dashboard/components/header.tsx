"use client"

import { usePathname } from "next/navigation"
import {
  Home,
  TrendingUp,
  PieChart,
  Wallet,
  Users,
  Upload,
  FileText,
  Building,
  MessageSquare,
  Bell,
} from "lucide-react"
import { user } from "@/lib/user"

export function Header() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const pageName = pathname.split("/").pop() || "home"
  const firstName = user.name.split(" ")[0] // Get first name

  const pageInfo = {
    home: {
      name: pageName === "home" ? `Welcome ${firstName}` : isAdmin ? "Admin Dashboard" : "Dashboard",
      icon: Home,
    },
    tracker: { name: isAdmin ? "Admin Tracker" : "Tracker", icon: TrendingUp },
    metrics: { name: isAdmin ? "Admin Metrics" : "Metrics", icon: PieChart },
    finances: { name: isAdmin ? "Admin Finances" : "Finances", icon: Wallet },
    agents: { name: isAdmin ? "Admin Agents" : "Agents", icon: Users },
    upload: { name: isAdmin ? "Admin Upload" : "Upload", icon: Upload },
    reports: { name: isAdmin ? "Admin Reports" : "Reports", icon: FileText },
    offices: { name: "Offices", icon: Building },
    message: { name: "Message", icon: MessageSquare },
    notifications: { name: "Notifications", icon: Bell },
  }[pageName] || {
    name: pageName === "home" ? `Welcome ${firstName}` : isAdmin ? "Admin Dashboard" : "Dashboard",
    icon: Home,
  }

  const Icon = pageInfo.icon

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-white flex items-center gap-4">
        <Icon className="h-6 w-6" />
        {pathname === "/dashboard" || pathname === "/admin/dashboard"
          ? `Welcome ${user.name.split(" ")[0]}`
          : pageInfo.name}
      </h1>
      <div className="flex items-center gap-4">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/APEX%20DASH-5lEKnZU5SRKYFBNTa5oi5fJ9kdT6JB.png"
          alt="Apex Dash Logo"
          className="h-8 w-8 opacity-50"
        />
      </div>
    </div>
  )
}

