import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

interface CollapsibleTriggerProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

interface CollapsibleContentProps {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
}

const CollapsibleContext = React.createContext<{
  open: boolean
  toggle: () => void
}>({ open: false, toggle: () => {} })

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ open: controlledOpen, onOpenChange, children, className }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen

    const toggle = React.useCallback(() => {
      if (isControlled) {
        onOpenChange?.(!open)
      } else {
        setInternalOpen(!open)
      }
    }, [isControlled, open, onOpenChange])

    return (
      <CollapsibleContext.Provider value={{ open, toggle }}>
        <div ref={ref} className={className}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = 'Collapsible'

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(({ children, className, onClick }, ref) => {
  const { open, toggle } = React.useContext(CollapsibleContext)

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        toggle()
        onClick?.()
      }}
      className={cn(
        'flex w-full items-center justify-between py-2 font-medium transition-all',
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
          open && 'rotate-180'
        )}
      />
    </button>
  )
})
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ children, className }, ref) => {
  const { open } = React.useContext(CollapsibleContext)

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden transition-all duration-200',
        open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
        className
      )}
    >
      {children}
    </div>
  )
})
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
