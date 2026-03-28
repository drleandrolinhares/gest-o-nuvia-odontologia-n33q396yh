import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export interface Task {
  id: string
  cargoId: string
  colaboradorId?: string
  action: string
  time: string
  days: string[]
  frequency: string
  completed: boolean
  completedAt?: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  cargos: { id: string; nome: string }[]
  onSave: () => void
  defaultCargoId: string
  defaultColaboradorId?: string
  colaboradorNome?: string
  taskToEdit: Task | null
}

const DAYS = [
  { id: 'dom', label: 'DOM' },
  { id: 'seg', label: 'SEG' },
  { id: 'ter', label: 'TER' },
  { id: 'qua', label: 'QUA' },
  { id: 'qui', label: 'QUI' },
  { id: 'sex', label: 'SEX' },
  { id: 'sab', label: 'SAB' },
]

export function ConfigRotinaModal({
  isOpen,
  onClose,
  cargos,
  onSave,
  defaultCargoId,
  defaultColaboradorId,
  colaboradorNome,
  taskToEdit,
}: Props) {
  const [acao, setAcao] = useState('')
  const [horario, setHorario] = useState('')
  const [frequencia, setFrequencia] = useState('diario')
  const [diasSemana, setDiasSemana] = useState<string[]>(['seg', 'ter', 'qua', 'qui', 'sex'])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (taskToEdit) {
      setAcao(taskToEdit.action)
      setHorario(taskToEdit.time)
      setFrequencia(taskToEdit.frequency)
      setDiasSemana(taskToEdit.days || [])
    } else {
      setAcao('')
      setHorario('')
      setFrequencia('diario')
      setDiasSemana(['seg', 'ter', 'qua', 'qui', 'sex'])
    }
  }, [taskToEdit, isOpen])

  const handleSave = async () => {
    if (!acao || !horario || !defaultCargoId) {
      toast({
        title: 'Erro',
        description: 'Preencha os campos obrigatórios',
        variant: 'destructive',
      })
      return
    }
    setLoading(true)

    // Se estiver editando, mantenha o escopo original da tarefa (seja de usuário ou de cargo)
    // Se for nova tarefa, use o colaborador selecionado (ou null para geral)
    const targetColaboradorId = taskToEdit ? taskToEdit.colaboradorId : defaultColaboradorId || null

    const payload = {
      acao,
      horario,
      frequencia,
      dias_semana: diasSemana,
      cargo_id: defaultCargoId,
      colaborador_id: targetColaboradorId,
    }

    let error
    if (taskToEdit) {
      const { error: err } = await supabase
        .from('rotinas_config')
        .update(payload)
        .eq('id', taskToEdit.id)
      error = err
    } else {
      const { error: err } = await supabase.from('rotinas_config').insert([payload])
      error = err
    }

    setLoading(false)
    if (error) {
      toast({ title: 'Erro', description: 'Erro ao salvar rotina', variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Rotina salva com sucesso' })
      onSave()
      onClose()
    }
  }

  const toggleDia = (dia: string) => {
    setDiasSemana((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="uppercase font-black text-nuvia-navy tracking-wider text-sm sm:text-base">
            {taskToEdit
              ? 'EDITAR ROTINA'
              : colaboradorNome
                ? `+ ADICIONAR TAREFA PARA ${colaboradorNome}`
                : 'CONFIGURAR ROTINA GERAL'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">AÇÃO / TAREFA</Label>
            <Input
              value={acao}
              onChange={(e) => setAcao(e.target.value)}
              placeholder="Ex: CONFERIR CAIXA"
              className="uppercase font-bold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">HORÁRIO LIMITE</Label>
              <Input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">FREQUÊNCIA</Label>
              <Select value={frequencia} onValueChange={setFrequencia}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">DIÁRIO</SelectItem>
                  <SelectItem value="semanal">SEMANAL</SelectItem>
                  <SelectItem value="mensal">MENSAL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">DIAS DA SEMANA</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((dia) => (
                <div
                  key={dia.id}
                  className="flex items-center space-x-1 border border-slate-200 p-2 rounded-md bg-slate-50"
                >
                  <Checkbox
                    id={`dia-${dia.id}`}
                    checked={diasSemana.includes(dia.id)}
                    onCheckedChange={() => toggleDia(dia.id)}
                  />
                  <label
                    htmlFor={`dia-${dia.id}`}
                    className="text-xs font-bold text-slate-600 uppercase cursor-pointer"
                  >
                    {dia.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            CANCELAR
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-nuvia-navy hover:bg-nuvia-navy/90 text-[#D4AF37] font-bold tracking-widest"
          >
            {loading ? 'SALVANDO...' : 'SALVAR'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
