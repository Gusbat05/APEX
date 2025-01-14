import { TypeIcon as type, LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  icon: LucideIcon
}

export function PageHeader({ title, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-start h-[44px] pb-[8px] mb-6 border-b border-border">
      <Icon className="mx-4 h-5 w-5" />
      <h1 className="text-2xl font-bold">Home</h1>
    </div>
  )
}

