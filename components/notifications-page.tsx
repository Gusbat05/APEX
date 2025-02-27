import { ArrowLeft, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

const notifications = [
  {
    id: 1,
    title: "New message from John Doe",
    description: "Hey, how's it going?",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Meeting reminder",
    description: "Team standup in 15 minutes",
    time: "15 minutes ago",
  },
  {
    id: 3,
    title: "Task completed",
    description: "Project X has been marked as complete",
    time: "1 day ago",
  },
]

export function NotificationsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-4 pt-4 pb-2 flex flex-col transition-all duration-300 ease-in-out" style={{ height: "520px" }}>
      <div>
        <div className="flex items-center mb-4">
          <Bell className="w-6 h-6 mr-2 text-white" />
          <h3 className="text-xl font-bold text-white mr-3">Notifications</h3>
          <div className="flex-grow h-px bg-white/20"></div>
        </div>
        <div className="space-y-4 h-[420px] overflow-y-auto pr-2">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-white/10 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
              <p className="text-xs text-white/70 mt-1">{notification.description}</p>
              <p className="text-xs text-white/50 mt-2">{notification.time}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <Button
          variant="ghost"
          className="group relative flex w-full items-center justify-start gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors overflow-hidden text-white/70 hover:text-white"
          onClick={onBack}
        >
          <span className="relative z-10 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2 transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:filter group-hover:drop-shadow-glow" />
            Back
          </span>
          <span className="absolute inset-0 z-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
        </Button>
      </div>
    </div>
  )
}

