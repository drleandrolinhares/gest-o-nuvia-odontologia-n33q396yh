/* Input Component - A component that displays an input - from shadcn/ui (exposes Input) */
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  disableUppercase?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, disableUppercase, ...props }, ref) => {
    const isEmailOrPassword = type === 'email' || type === 'password'
    const shouldUppercase =
      !disableUppercase &&
      !isEmailOrPassword &&
      type !== 'number' &&
      type !== 'date' &&
      type !== 'time' &&
      type !== 'file'

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (shouldUppercase && typeof e.target.value === 'string') {
        const start = e.target.selectionStart
        const end = e.target.selectionEnd
        e.target.value = e.target.value.toUpperCase()
        try {
          e.target.setSelectionRange(start, end)
        } catch (err) {
          // ignore for types that don't support selection range
        }
      }
      onChange?.(e)
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
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
Input.displayName = 'Input'

export { Input }
