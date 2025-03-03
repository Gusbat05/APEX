import * as React from "react"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted", className)}
      {...props}
    />
  ),
)
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img ref={ref} className={cn("aspect-square h-full w-full object-cover", className)} {...props} />
  ),
)
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-medium", className)}
      {...props}
    />
  ),
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }

