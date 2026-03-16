import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserMinus } from 'lucide-react'
import { Employee } from '@/stores/main'
import { addWeeks, addMonths, addYears, format, parseISO } from 'date-fns'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: any) => void
  employees: Employee[]
  currentUserId: string | null
}

const PERIODICITY_OPTIONS = ['ÚNICO', 'SEMANAL', 'MENSAL', 'ANUAL', 'PROGRAMADA']

export function DentistAbsenceDialog({
  open,
  onOpenChange,
  onAdd,
  employees,
  currentUserId,
}: Props) {
  const [title, setTitle] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [periodicity, setPeriodicity] = useState('ÚNICO')

  const currentUser = employees.find((e) => e.id === currentUserId)
  // Only dentists (filtering by role/category if needed, but for now we list active)
  const activeEmployees = employees.filter((e) => e.status !== 'Desligado')

  const resetForm = () => {
    setTitle('')
    setAssignedTo('')
    setDate('')
    setTime('')
    setLocation('')
    setPeriodicity('ÚNICO')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && date && time && location && assignedTo && periodicity) {
      const basePayload = {
        title: title.toUpperCase(),
        time,
        type: 'COMPROMISSO DENTISTA',
        location: location.toUpperCase(),
        assignedTo: assignedTo,
        involvesThirdParty: false,
        thirdPartyDetails: '',
        createdBy: currentUser?.name || 'SISTEMA',
        requester_id: currentUserId,
        is_completed: false,
        periodicity: periodicity,
      }

      const baseDate = parseISO(date)

      if (periodicity === 'PROGRAMADA' || periodicity === 'ÚNICO') {
        // For programmed, we could potentially accept multiple dates, but keeping it to single base for simplicity
        // in this interface, unless specifically requesting a multiple date picker.
        onAdd({ ...basePayload, date })
      } else if (periodicity === 'SEMANAL') {
        for (let i = 0; i < 12; i++) {
          onAdd({ ...basePayload, date: format(addWeeks(baseDate, i), 'yyyy-MM-dd') })
        }
      } else if (periodicity === 'MENSAL') {
        for (let i = 0; i < 12; i++) {
          onAdd({ ...basePayload, date: format(addMonths(baseDate, i), 'yyyy-MM-dd') })
        }
      } else if (periodicity === 'ANUAL') {
        for (let i = 0; i < 5; i++) {
          onAdd({ ...basePayload, date: format(addYears(baseDate, i), 'yyyy-MM-dd') })
        }
      }

      onOpenChange(false)
      resetForm()
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) resetForm()
      }}
    >
      <DialogContent className="max-w-lg uppercase">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-rose-700">
            <UserMinus className="h-5 w-5" /> REGISTRAR AUSÊNCIA / COMPROMISSO (DENTISTA)
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">PROFISSIONAL *</label>
            <Select value={assignedTo} onValueChange={setAssignedTo} required>
              <SelectTrigger>
                <SelectValue placeholder="SELECIONE O PROFISSIONAL..." />
              </SelectTrigger>
              <SelectContent>
                {activeEmployees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">
              MOTIVO DA AUSÊNCIA *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="EX: CURSO DE ESPECIALIZAÇÃO, FÉRIAS, ASSUNTOS PESSOAIS..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">PERIODICIDADE *</label>
              <Select value={periodicity} onValueChange={setPeriodicity} required>
                <SelectTrigger>
                  <SelectValue placeholder="SELECIONE..." />
                </SelectTrigger>
                <SelectContent>
                  {PERIODICITY_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                {periodicity !== 'ÚNICO' && periodicity !== 'PROGRAMADA'
                  ? 'DATA INICIAL *'
                  : 'DATA *'}
              </label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">HORÁRIO *</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">LOCAL *</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="EX: EXTERNO, SÃO PAULO..."
              />
            </div>
          </div>

          {periodicity !== 'ÚNICO' && periodicity !== 'PROGRAMADA' && (
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              NOTA: O SISTEMA IRÁ GERAR AUTOMATICAMENTE AS OCORRÊNCIAS FUTURAS BASEADAS NA DATA
              INICIAL.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              CANCELAR
            </Button>
            <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white">
              SALVAR REGISTRO
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
