import { useState, useEffect } from 'react'
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
import { format, isBefore, eachDayOfInterval } from 'date-fns'
import { DatePickerInput } from '@/components/ui/date-picker-input'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: any) => void
  employees: Employee[]
  currentUserId: string | null
}

const PERIOD_OPTIONS = [
  { value: 'DIA INTEIRO', label: 'DIA INTEIRO' },
  { value: 'MANHÃ', label: 'MANHÃ (08:00 - 12:00)' },
  { value: 'TARDE', label: 'TARDE (13:00 - 18:00)' },
  { value: 'ESPECÍFICO', label: 'HORÁRIO ESPECÍFICO' },
]

export function DentistAbsenceDialog({
  open,
  onOpenChange,
  onAdd,
  employees,
  currentUserId,
}: Props) {
  const [title, setTitle] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [period, setPeriod] = useState('DIA INTEIRO')
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('18:00')
  const [location, setLocation] = useState('')

  const currentUser = employees.find((e) => e.id === currentUserId)
  // Only dentists (filtering by role/category if needed, but for now we list active)
  const activeEmployees = employees.filter((e) => e.status !== 'Desligado')

  useEffect(() => {
    if (open) {
      const today = format(new Date(), 'yyyy-MM-dd')
      if (!startDate) setStartDate(today)
      if (!endDate) setEndDate(today)
    }
  }, [open, startDate, endDate])

  const resetForm = () => {
    setTitle('')
    setAssignedTo('')
    setStartDate('')
    setEndDate('')
    setPeriod('DIA INTEIRO')
    setStartTime('08:00')
    setEndTime('18:00')
    setLocation('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (assignedTo && startDate && location && period) {
      const finalEndDate = endDate || startDate

      const start = new Date(`${startDate}T00:00:00`)
      const end = new Date(`${finalEndDate}T00:00:00`)

      if (isBefore(end, start)) {
        alert('A data final não pode ser anterior à data de início.')
        return
      }

      let timeString = ''
      if (period === 'DIA INTEIRO') timeString = '08:00 - 18:00'
      else if (period === 'MANHÃ') timeString = '08:00 - 12:00'
      else if (period === 'TARDE') timeString = '13:00 - 18:00'
      else timeString = `${startTime} - ${endTime}`

      const baseTitle = title.trim() ? title.toUpperCase() : 'AUSÊNCIA'
      const finalTitle = `${baseTitle} - ${period}`

      const days = eachDayOfInterval({ start, end })

      days.forEach((day) => {
        onAdd({
          title: finalTitle,
          time: timeString,
          type: 'COMPROMISSO DENTISTA',
          location: location.toUpperCase(),
          assignedTo: assignedTo,
          involvesThirdParty: false,
          thirdPartyDetails: '',
          createdBy: currentUser?.name || 'SISTEMA',
          requester_id: currentUserId,
          is_completed: false,
          periodicity: 'ÚNICO',
          date: format(day, 'yyyy-MM-dd'),
        })
      })

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
            <UserMinus className="h-5 w-5" /> REGISTRAR AUSÊNCIA / COMPROMISSO
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
              <label className="text-xs font-semibold text-muted-foreground">PERÍODO *</label>
              <Select value={period} onValueChange={setPeriod} required>
                <SelectTrigger>
                  <SelectValue placeholder="SELECIONE..." />
                </SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          {period === 'ESPECÍFICO' && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in-down">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  HORÁRIO INICIAL *
                </label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  HORÁRIO FINAL *
                </label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                DATA DE INÍCIO *
              </label>
              <DatePickerInput
                value={startDate}
                onChange={(val) => {
                  const v = (val as string) || ''
                  setStartDate(v)
                  const newStart = v ? new Date(`${v}T00:00:00`) : null
                  const currentEnd = endDate ? new Date(`${endDate}T00:00:00`) : null
                  if (newStart && (!endDate || (currentEnd && isBefore(currentEnd, newStart)))) {
                    setEndDate(v)
                  }
                }}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">DATA FINAL *</label>
              <DatePickerInput
                value={endDate}
                onChange={(val) => setEndDate((val as string) || '')}
                className="uppercase"
              />
            </div>
          </div>

          {startDate && endDate && startDate !== endDate && (
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              NOTA: O SISTEMA IRÁ GERAR UM REGISTRO PARA CADA DIA NO INTERVALO SELECIONADO.
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
