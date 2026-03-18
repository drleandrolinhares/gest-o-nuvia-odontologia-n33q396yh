import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  disableUppercase?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, disableUppercase, ...props }, ref) => {
    const shouldUppercase = !disableUppercase

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (shouldUppercase && typeof e.target.value === 'string') {
        const start = e.target.selectionStart
        const end = e.target.selectionEnd
        e.target.value = e.target.value.toUpperCase()
        try {
          e.target.setSelectionRange(start, end)
        } catch (err) {
          // Ignore for types that don't support selection range
        }
      }
      onChange?.(e)
    }

    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          shouldUppercase && 'uppercase',
          className,
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
