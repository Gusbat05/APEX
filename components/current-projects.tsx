import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const projects = [
  {
    id: 1,
    title: "Landing Page with CRM System",
    status: "In Progress",
    dueDate: "Due In 2d 5h",
    type: "success",
  },
  {
    id: 2,
    title: "E-commerce Website Redesign",
    status: "Completed",
    dueDate: "Due In 5d 2h",
    type: "completed",
  },
  {
    id: 3,
    title: "Dashboard Development",
    status: "In Review",
    dueDate: "Due In 1d 4h",
    type: "review",
  },
]

export function CurrentProjects() {
  return (
    <Card className="bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-white">Current Projects</CardTitle>
        <Button variant="ghost" className="text-sm text-white hover:bg-white/10">
          Show All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg bg-white/5 p-4 transition-colors hover:bg-white/10"
            >
              <div>
                <div className="text-sm font-medium text-white">{project.title}</div>
                <div className="mt-1 text-xs text-white/70">{project.dueDate}</div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    project.type === "success"
                      ? "bg-green-500"
                      : project.type === "completed"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                  }`}
                />
                <ChevronRight className="h-4 w-4 text-white/70" />
              </div>
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

