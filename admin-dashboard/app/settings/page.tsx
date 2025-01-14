"use client"

import { useState, useCallback } from 'react'
import { PageHeader } from '../components/page-header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    username: 'admin',
    email: 'admin@example.com',
    password: '',
  })

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
  }, [formData])

  return (
    <div className="pt-[25px] px-8 pb-8">
      <PageHeader title="Settings" icon={Settings} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            name="username"
            value={formData.username} 
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            value={formData.email} 
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input 
            id="password" 
            name="password"
            type="password" 
            value={formData.password} 
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  )
}

