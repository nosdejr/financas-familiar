import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface DropdownMenuProps {
  children: React.ReactNode
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DropdownMenu({ children, trigger, open, onOpenChange }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(open || false)

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <div className="relative inline-block text-left">
      <div onClick={() => handleOpenChange(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => handleOpenChange(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-md bg-popover text-popover-foreground shadow-lg border border-border">
            <div className="py-1">
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child as any, {
                    onClose: () => handleOpenChange(false),
                  })
                }
                return child
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  onClose?: () => void
}

export function DropdownMenuItem({ children, onClick, className, onClose }: DropdownMenuItemProps) {
  return (
    <button
      onClick={() => {
        onClick?.()
        onClose?.()
      }}
      className={cn(
        "block w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

export interface DropdownMenuSeparatorProps {
  className?: string
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
  return (
    <div className={cn("my-1 h-px bg-border", className)} />
  )
}
