import * as React from "react"
import { cn } from "@/lib/utils"
import { Alert as AlertPrimitive } from "react-alert"

const Alert = React.forwardRef<
  React.ElementRef<typeof AlertPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AlertPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <AlertPrimitive.Root
    ref={ref}
    className={cn(
      "relative w-full rounded-md border border-border bg-background p-4 text-sm [&>[svg]]:h-4 [&>[svg]]:w-4",
      className,
    )}
    {...props}
  >
    {children}
  </AlertPrimitive.Root>
))
Alert.displayName = AlertPrimitive.Root.displayName

const AlertTitle = React.forwardRef<
  React.ElementRef<typeof AlertPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertPrimitive.Title ref={ref} className={cn("font-semibold text-foreground", className)} {...props} />
))
AlertTitle.displayName = AlertPrimitive.Title.displayName

const AlertDescription = React.forwardRef<
  React.ElementRef<typeof AlertPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertPrimitive.Description ref={ref} className={cn("text-sm [&:not(:first-child)]:mt-1", className)} {...props} />
))
AlertDescription.displayName = AlertPrimitive.Description.displayName

export { Alert, AlertTitle, AlertDescription }

