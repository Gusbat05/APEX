"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "./components/page-header"
import { Home } from 'lucide-react'
import dynamic from 'next/dynamic'

const Overview = dynamic(() => import('./components/overview').then(mod => mod.Overview), {
  ssr: false,
  loading: () => <p>Loading overview...</p>
})

const RecentUploads = dynamic(() => import('./components/recent-uploads').then(mod => mod.RecentUploads), {
  ssr: false,
  loading: () => <p>Loading recent uploads...</p>
})

export default function HomePage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const role = localStorage.getItem('userRole')
    
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      setUserRole(role)
    }
  }, [router])


  const renderStatCard = useCallback((title: string, value: string) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  ), [])

  if (!userRole) {
    return null // or a loading spinner
  }

  return (
    <div className="pt-[25px] px-8 pb-8">
      <div>
        <PageHeader title={userRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'} icon={Home} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {renderStatCard("Total Uploads", "24")}
        {renderStatCard("Analyzed Files", "12")}
        {renderStatCard("Active Users", userRole === 'admin' ? '5' : '1')}
        {renderStatCard("Data Points", "1,234")}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentUploads />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

