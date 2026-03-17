import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface MonthYearInputProps {
  value?: string
  onChange: (date?: string) => void
  disabled?: boolean
  className?: string
}

export const MonthYearInput = React.forwardRef<HTMLInputElement, MonthYearInputProps>(
  ({ value, onChange, disabled, className }, ref) => {
    const [inputValue, setInputValue] = React.useState('')

    React.useEffect(() => {
      if (value) {
        const parts = value.split('T')[0].split('-')
        if (parts.length === 3) {
          setInputValue(`${parts[1]}/${parts[0]}`)
        } else {
          setInputValue('')
        }
      } else {
        setInputValue('')
      }
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, '')
      if (val.length > 6) val = val.slice(0, 6)

      if (val.length > 2) {
        val = `${val.slice(0, 2)}/${val.slice(2)}`
      }
      setInputValue(val)

      if (val.length === 6) {
        const m = parseInt(val.slice(0, 2), 10)
        const y = parseInt(val.slice(2), 10)
        if (m >= 1 && m <= 12 && y > 1900) {
          const lastDay = new Date(y, m, 0).getDate()
          onChange(`${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`)
        } else {
          onChange(undefined)
        }
      } else if (val.length === 7) {
        const parts = val.split('/')
        const m = parseInt(parts[0], 10)
        const y = parseInt(parts[1], 10)
        if (m >= 1 && m <= 12 && y > 1900) {
          const lastDay = new Date(y, m, 0).getDate()
          onChange(`${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`)
        } else {
          onChange(undefined)
        }
      } else {
        onChange(undefined)
      }
    }

    return (
      <Input
        ref={ref}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="MM/AAAA"
        className={cn('w-full bg-background', className)}
        disabled={disabled}
        maxLength={7}
      />
    )
  },
)
MonthYearInput.displayName = 'MonthYearInput'
