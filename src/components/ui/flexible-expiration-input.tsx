import * as React from 'react'
import { format, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FlexibleExpirationInputProps {
  value?: string
  onChange: (date?: string) => void
  disabled?: boolean
  className?: string
}

export const FlexibleExpirationInput = React.forwardRef<
  HTMLInputElement,
  FlexibleExpirationInputProps
>(({ value, onChange, disabled, className }, ref) => {
  const [inputValue, setInputValue] = React.useState('')
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  const dateValue = React.useMemo(() => {
    if (!value) return undefined
    const parsed = new Date(`${value.split('T')[0]}T00:00:00`)
    return isValid(parsed) ? parsed : undefined
  }, [value])

  React.useEffect(() => {
    if (dateValue && isValid(dateValue)) {
      setInputValue(format(dateValue, 'dd/MM/yyyy'))
    } else {
      setInputValue('')
    }
  }, [dateValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d/]/g, '')
    setInputValue(val)

    const parts = val.split('/')
    if (parts.length === 2 && parts[0].length === 2 && parts[1].length === 4) {
      const m = parseInt(parts[0], 10)
      const y = parseInt(parts[1], 10)
      if (m >= 1 && m <= 12 && y > 1900) {
        const lastDay = new Date(y, m, 0).getDate()
        onChange(`${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`)
        return
      }
    } else if (
      parts.length === 3 &&
      parts[0].length === 2 &&
      parts[1].length === 2 &&
      parts[2].length === 4
    ) {
      const d = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10)
      const y = parseInt(parts[2], 10)
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31 && y > 1900) {
        onChange(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
        return
      }
    }
    if (val === '') onChange(undefined)
  }

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'))
      setPopoverOpen(false)
    } else {
      onChange(undefined)
    }
  }

  return (
    <div className="flex relative w-full items-center">
      <Input
        ref={ref}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="MM/AAAA ou DD/MM/AAAA"
        className={cn('w-full pr-10 bg-background', className)}
        disabled={disabled}
        maxLength={10}
      />
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            type="button"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
})
FlexibleExpirationInput.displayName = 'FlexibleExpirationInput'
