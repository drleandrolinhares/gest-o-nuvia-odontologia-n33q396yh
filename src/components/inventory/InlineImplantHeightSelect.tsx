import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import useAppStore from '@/stores/main'
import { cn } from '@/lib/utils'

export interface InlineImplantHeightSelectProps {
  value: string
  onChange: (val: string) => void
  disabled?: boolean
}

export const InlineImplantHeightSelect = React.forwardRef<
  HTMLDivElement,
  InlineImplantHeightSelectProps
>(({ value, onChange, disabled }, ref) => {
  const { inventoryOptions, addInventoryOption, removeInventoryOption } = useAppStore()
  const [open, setOpen] = React.useState(false)
  const [newVal, setNewVal] = React.useState('')

  const heights = inventoryOptions
    .filter((o) => o.category === 'ALTURA_IMPLANTE')
    .sort((a, b) => parseFloat(a.value) - parseFloat(b.value))

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (newVal.trim()) {
      addInventoryOption('ALTURA_IMPLANTE', newVal.trim().toUpperCase())
      setNewVal('')
    }
  }

  return (
    <div ref={ref} className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between uppercase bg-white border-blue-200',
              !value && 'text-muted-foreground',
            )}
          >
            {value ? `${value} MM` : 'SELECIONE'}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start">
          <form onSubmit={handleAdd} className="flex gap-2 mb-2">
            <Input
              placeholder="NOVA ALTURA"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              className="h-8 text-xs uppercase"
            />
            <Button type="submit" size="sm" className="h-8 px-2" disabled={!newVal.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>
          <div className="max-h-[200px] overflow-y-auto space-y-1">
            {heights.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between group rounded-md hover:bg-muted/50"
              >
                <button
                  type="button"
                  className="flex-1 text-left px-2 py-1.5 text-sm uppercase font-medium"
                  onClick={() => {
                    onChange(h.value)
                    setOpen(false)
                  }}
                >
                  {h.value} MM
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault()
                    removeInventoryOption(h.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {heights.length === 0 && (
              <div className="text-center text-xs text-muted-foreground py-2 font-medium">
                NENHUMA OPÇÃO
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
})
InlineImplantHeightSelect.displayName = 'InlineImplantHeightSelect'
