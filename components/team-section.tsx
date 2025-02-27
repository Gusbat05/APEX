import { ChevronRight } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const team = [
  {
    id: 1,
    name: "Zack Wilson",
    email: "zack@spotifystudio.com",
    department: "Design",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7ABwHXmKaoMnGArBDXxlnToMjg2hto.png",
    initials: "ZW",
  },
  {
    id: 2,
    name: "John Goodman",
    email: "john@spotifystudio.com",
    department: "Development",
    status: "Active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7ABwHXmKaoMnGArBDXxlnToMjg2hto.png",
    initials: "JG",
  },
]

export function TeamSection() {
  return (
    <Card className="bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 shadow-lg rounded-lg overflow-hidden h-[calc(100%+72px)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-white">Team</CardTitle>
            <div className="mt-1 text-sm text-white/70">All members</div>
          </div>
          <div className="flex items-center gap-4">
            <Select>
              <SelectTrigger className="w-32 border-0 bg-white/5 text-white">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-24 border-0 bg-white/5 text-white">
                <SelectValue placeholder="Active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {team.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg bg-white/5 p-4 transition-colors hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-white">{member.name}</div>
                  <div className="mt-1 text-xs text-white/70">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="h-7 rounded-full bg-white/5 px-3 text-xs text-white hover:bg-white/10"
                >
                  {member.department}
                </Button>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-white/70">{member.status}</span>
                </div>
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

