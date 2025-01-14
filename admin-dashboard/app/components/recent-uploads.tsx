"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentUploads = [
  {
    id: "1",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    avatar: "/placeholder.svg",
    file: "sales_q2.xlsx",
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    avatar: "/placeholder.svg",
    file: "inventory.xlsx",
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "/placeholder.svg",
    file: "financial_report.xlsx",
  },
  {
    id: "4",
    name: "William Kim",
    email: "will@email.com",
    avatar: "/placeholder.svg",
    file: "customer_data.xlsx",
  },
  {
    id: "5",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    avatar: "/placeholder.svg",
    file: "marketing_metrics.xlsx",
  },
]

export function RecentUploads() {
  const [visibleUploads, setVisibleUploads] = useState<string[]>([])

  useEffect(() => {
    recentUploads.forEach((upload, index) => {
      setTimeout(() => {
        setVisibleUploads(prev => [...prev, upload.id])
      }, index * 100)
    })
  }, [])

  return (
    <div className="space-y-8">
      {recentUploads.map((upload) => (
        <div 
          key={upload.id} 
          className={`flex items-center transition-opacity duration-500 ease-in-out ${
            visibleUploads.includes(upload.id) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={upload.avatar} alt="Avatar" />
            <AvatarFallback>{upload.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{upload.name}</p>
            <p className="text-sm text-muted-foreground">
              {upload.email}
            </p>
          </div>
          <div className="ml-auto font-medium">{upload.file}</div>
        </div>
      ))}
    </div>
  )
}

