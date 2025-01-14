"use client"

import { useState } from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  type: 'update' | 'maintenance' | 'message'
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'System Update',
    message: 'We have released a new version with improved features. Please refresh your browser.',
    date: '2023-06-15T10:00:00Z',
    read: false,
    type: 'update'
  },
  {
    id: '2',
    title: 'Scheduled Maintenance',
    message: 'The system will be undergoing maintenance on June 20th from 2 AM to 4 AM UTC.',
    date: '2023-06-14T15:30:00Z',
    read: true,
    type: 'maintenance'
  },
  {
    id: '3',
    title: 'New Feature Announcement',
    message: 'We\'ve added a new data visualization tool. Check it out in the Analytics section!',
    date: '2023-06-13T09:15:00Z',
    read: false,
    type: 'message'
  },
]

export function NotificationInbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 text-[10px] font-bold flex items-center justify-center bg-red-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
        <span className="sr-only">Open notifications</span>
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                {index > 0 && <Separator className="my-2" />}
                <div className={`p-2 rounded-md ${notification.read ? 'bg-background' : 'bg-accent'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-semibold">{notification.title}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-muted-foreground"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(notification.date)}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}

