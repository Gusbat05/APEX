import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const events = [
  {
    id: 1,
    title: "Landing Page Overview",
    time: "09:00 - 10:00",
    type: "meeting",
  },
  {
    id: 2,
    title: "Microsoft Student Session",
    time: "10:00 - 11:00",
    type: "session",
  },
  {
    id: 3,
    title: "Introduction Meeting",
    time: "11:00 - 12:00",
    type: "meeting",
  },
]

export function Calendar() {
  return (
    <Card className="bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-white">Calendar</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-sm text-white hover:bg-white/10">
            Jun 28, 2024
          </Button>
          <Button variant="ghost" className="text-sm text-white hover:bg-white/10">
            Show All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="rounded-lg bg-white/5 p-4 transition-colors hover:bg-white/10">
              <div className="text-sm font-medium text-white">{event.title}</div>
              <div className="mt-1 text-xs text-white/70">{event.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <style jsx>{`
        .bg-white\\/10 {
          box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.03);
        }
      `}</style>
    </Card>
  )
}

