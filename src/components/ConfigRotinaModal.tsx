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
  onSave: (task: Task) => void
  defaultCargoId?: string
}

export function ConfigRotinaModal({
  isOpen,
  onClose,
  cargos,
  onSave,
  defaultCargoId,
}: ConfigRotinaModalProps) {
  const [cargoId, setCargoId] = useState(defaultCargoId || '')
  const [action, setAction] = useState('')
  const [time, setTime] = useState('08:00')
  const [days, setDays] = useState<string[]>(['seg', 'ter', 'qua', 'qui', 'sex'])
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && defaultCargoId) setCargoId(defaultCargoId)
  }, [isOpen, defaultCargoId])

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
    const { data, error } = await supabase
      .from('rotinas_config')
      .insert({
        cargo_id: cargoId,
        acao: action,
        horario: time,
        dias_semana: days,
        frequencia: 'diario',
      })
      .select()
      .single()

    setLoading(false)

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else if (data) {
      toast({ title: 'Sucesso', description: 'Rotina configurada com sucesso!' })
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
      setAction('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-nuvia-navy uppercase">
            Configurar Nova Rotina
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
