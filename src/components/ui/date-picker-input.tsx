import * as React from 'react'
import { format, parse, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface DatePickerInputProps {
  value?: Date | string
  onChange: (date?: Date | string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
  valueAsDate?: boolean // If true, onChange gets Date object, else string (YYYY-MM-DD)
}

export function DatePickerInput({
  value,
  onChange,
  disabled,
  className,
  placeholder = 'DD/MM/AAAA',
  valueAsDate = false,
}: DatePickerInputProps) {
  const [inputValue, setInputValue] = React.useState('')
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  const dateValue = React.useMemo(() => {
    if (!value) return undefined
    if (value instanceof Date) return value
    const parsed = new Date(`${value}T00:00:00`)
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
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 8) val = val.slice(0, 8)

    if (val.length >= 5) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`
    } else if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`
    }

    setInputValue(val)

    if (val.length === 10) {
      const parsedDate = parse(val, 'dd/MM/yyyy', new Date())
      if (isValid(parsedDate) && parsedDate.getFullYear() > 1900) {
        if (valueAsDate) onChange(parsedDate)
        else onChange(format(parsedDate, 'yyyy-MM-dd'))
      }
    } else if (val === '') {
      onChange(undefined)
    }
  }

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      if (valueAsDate) onChange(date)
      else onChange(format(date, 'yyyy-MM-dd'))
      setPopoverOpen(false)
    } else {
      onChange(undefined)
    }
  }

  return (
    <div className="flex relative w-full items-center">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
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
}
