import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function SacStatusSelect({ value, onChange, disabled, className }: Props) {
  const getColor = (v: string) => {
    switch (v) {
      case 'OPORTUNIDADE DE SOLUÇÃO':
        return 'bg-red-600 hover:bg-red-700 text-white border-red-700'
      case 'RECEBIDO':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700'
      case 'SENDO TRATADO':
        return 'bg-amber-500 hover:bg-amber-600 text-amber-950 border-amber-600'
      case 'RESOLVIDO':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
      default:
        return 'bg-slate-200 text-slate-800'
    }
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          `h-7 w-[130px] text-[9px] font-bold tracking-widest uppercase shadow-sm border-0`,
          getColor(value),
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="OPORTUNIDADE DE SOLUÇÃO" className="text-red-700 font-bold text-[10px]">
          OPORTUNIDADE
        </SelectItem>
        <SelectItem value="RECEBIDO" className="text-blue-600 font-bold text-[10px]">
          RECEBIDO
        </SelectItem>
        <SelectItem value="SENDO TRATADO" className="text-amber-600 font-bold text-[10px]">
          SENDO TRATADO
        </SelectItem>
        <SelectItem value="RESOLVIDO" className="text-emerald-600 font-bold text-[10px]">
          RESOLVIDO
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
