import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface Task {
  id: string
  cargoId: string
  action: string
  time: string
  days: string[]
  frequency: string
  startDate?: string
  endDate?: string
  completed: boolean
  completedAt?: string
}

const WEEKDAYS = [
  { id: 'seg', label: 'Seg' },
  { id: 'ter', label: 'Ter' },
  { id: 'qua', label: 'Qua' },
  { id: 'qui', label: 'Qui' },
  { id: 'sex', label: 'Sex' },
  { id: 'sab', label: 'Sáb' },
  { id: 'dom', label: 'Dom' },
]

export function ConfigRotinaModal({
  isOpen,
  onClose,
  cargos,
  onSave,
  defaultCargoId,
}: {
  isOpen: boolean
  onClose: () => void
  cargos: { id: string; nome: string }[]
  onSave: (task: Task) => void
  defaultCargoId?: string
}) {
  const [newTask, setNewTask] = useState<Partial<Task>>({})

  useEffect(() => {
    if (isOpen) {
      setNewTask({
        days: [],
        frequency: 'diario',
        cargoId: defaultCargoId || '',
        action: '',
        time: '',
        startDate: '',
        endDate: '',
      })
    }
  }, [isOpen, defaultCargoId])

  const handleSave = () => {
    if (!newTask.cargoId || !newTask.action || !newTask.time) return
    onSave({
      id: crypto.randomUUID(),
      cargoId: newTask.cargoId,
      action: newTask.action,
      time: newTask.time,
      days: newTask.days || [],
      frequency: newTask.frequency || 'diario',
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      completed: false,
    } as Task)
    onClose()
  }

  const toggleDay = (dayId: string, checked: boolean) => {
    const days = newTask.days || []
    setNewTask({
      ...newTask,
      days: checked ? [...days, dayId] : days.filter((d) => d !== dayId),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-nuvia-navy uppercase tracking-wider">
            Configurar Rotina
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label className="uppercase text-xs font-bold text-slate-500">Cargo</Label>
            <Select
              value={newTask.cargoId}
              onValueChange={(val) => setNewTask({ ...newTask, cargoId: val })}
            >
              <SelectTrigger className="font-bold text-nuvia-navy uppercase">
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                {cargos.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="font-bold uppercase">
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label className="uppercase text-xs font-bold text-slate-500">Ação</Label>
            <Input
              value={newTask.action || ''}
              onChange={(e) => setNewTask({ ...newTask, action: e.target.value })}
              placeholder="Ex: Conferir agendas"
              className="font-semibold text-nuvia-navy uppercase"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="uppercase text-xs font-bold text-slate-500">Horário</Label>
              <Input
                type="time"
                value={newTask.time || ''}
                onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                className="font-semibold text-nuvia-navy"
              />
            </div>
            <div className="grid gap-2">
              <Label className="uppercase text-xs font-bold text-slate-500">Frequência</Label>
              <Select
                value={newTask.frequency}
                onValueChange={(val) => setNewTask({ ...newTask, frequency: val })}
              >
                <SelectTrigger className="font-bold text-nuvia-navy uppercase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario" className="font-bold uppercase">
                    Diário
                  </SelectItem>
                  <SelectItem value="semanal" className="font-bold uppercase">
                    Semanal
                  </SelectItem>
                  <SelectItem value="quinzenal" className="font-bold uppercase">
                    Quinzenal
                  </SelectItem>
                  <SelectItem value="mensal" className="font-bold uppercase">
                    Mensal
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="uppercase text-xs font-bold text-slate-500">Dias da Semana</Label>
            <div className="flex flex-wrap gap-3 mt-1">
              {WEEKDAYS.map((day) => (
                <div key={day.id} className="flex items-center space-x-1.5">
                  <Checkbox
                    id={day.id}
                    checked={newTask.days?.includes(day.id)}
                    onCheckedChange={(c) => toggleDay(day.id, !!c)}
                  />
                  <Label
                    htmlFor={day.id}
                    className="text-sm font-semibold cursor-pointer uppercase"
                  >
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="uppercase text-xs font-bold text-slate-500">
                Início (Opcional)
              </Label>
              <Input
                type="date"
                value={newTask.startDate || ''}
                onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                className="font-semibold text-slate-600 uppercase"
              />
            </div>
            <div className="grid gap-2">
              <Label className="uppercase text-xs font-bold text-slate-500">Fim (Opcional)</Label>
              <Input
                type="date"
                value={newTask.endDate || ''}
                onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                className="font-semibold text-slate-600 uppercase"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="font-bold uppercase tracking-wider"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!newTask.cargoId || !newTask.action || !newTask.time}
            className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black uppercase tracking-widest"
          >
            Salvar Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
