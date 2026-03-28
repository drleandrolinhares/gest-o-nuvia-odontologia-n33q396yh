import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Clock } from 'lucide-react'

export interface Task {
  id: string
  cargoId: string
  action: string
  time: string
  days: string[]
  frequency: string
  completed?: boolean
  completedAt?: string
}

interface ConfigRotinaModalProps {
  isOpen: boolean
  onClose: () => void
  cargos: { id: string; nome: string }[]
  onSave: (task?: Task) => void
  defaultCargoId?: string
  taskToEdit?: Task | null
}

export function ConfigRotinaModal({
  isOpen,
  onClose,
  cargos,
  onSave,
  defaultCargoId,
  taskToEdit,
}: ConfigRotinaModalProps) {
  const [cargoId, setCargoId] = useState(defaultCargoId || '')
  const [action, setAction] = useState('')
  const [time, setTime] = useState('08:00')
  const [days, setDays] = useState<string[]>(['seg', 'ter', 'qua', 'qui', 'sex'])
  const [frequency, setFrequency] = useState('diario')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setCargoId(taskToEdit.cargoId)
        setAction(taskToEdit.action)
        setTime(taskToEdit.time)
        setDays(taskToEdit.days || [])
        setFrequency(taskToEdit.frequency || 'diario')
      } else {
        setCargoId(defaultCargoId || '')
        setAction('')
        setTime('08:00')
        setDays(['seg', 'ter', 'qua', 'qui', 'sex'])
        setFrequency('diario')
      }
    }
  }, [isOpen, taskToEdit, defaultCargoId])

  const toggleDay = (day: string) => {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleSave = async () => {
    if (!cargoId || !action || !time || days.length === 0) {
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    const payload = {
      cargo_id: cargoId,
      acao: action,
      horario: time,
      dias_semana: days,
      frequencia: frequency,
    }

    let result
    if (taskToEdit) {
      result = await supabase
        .from('rotinas_config')
        .update(payload)
        .eq('id', taskToEdit.id)
        .select()
        .single()
    } else {
      result = await supabase.from('rotinas_config').insert(payload).select().single()
    }

    const { data, error } = result

    setLoading(false)

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else if (data) {
      toast({
        title: 'Sucesso',
        description: taskToEdit
          ? 'Rotina atualizada com sucesso!'
          : 'Rotina configurada com sucesso!',
      })
      onSave({
        id: data.id,
        cargoId: data.cargo_id,
        action: data.acao,
        time: data.horario,
        days: data.dias_semana,
        frequency: data.frequencia,
        completed: false,
      })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-nuvia-navy uppercase">
            {taskToEdit ? 'Editar Rotina' : 'Configurar Nova Rotina'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cargo
            </Label>
            <Select value={cargoId} onValueChange={setCargoId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                {cargos.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ação / Tarefa
            </Label>
            <Input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Ex: Revisar metas"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Horário Limite
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Frequência
            </Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Diário</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Dias da Semana
            </Label>
            <div className="flex flex-wrap gap-2">
              {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map((d) => (
                <Button
                  key={d}
                  type="button"
                  variant={days.includes(d) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleDay(d)}
                  className="w-12 uppercase text-xs"
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37]"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Rotina'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
