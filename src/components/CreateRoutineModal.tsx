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

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
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

export function CreateRoutineModal({ isOpen, onClose, onSave }: Props) {
  const [cargos, setCargos] = useState<{ id: string; nome: string }[]>([])
  const [usuarios, setUsuarios] = useState<{ id: string; nome: string }[]>([])

  const [selectedCargo, setSelectedCargo] = useState('')
  const [selectedUsuario, setSelectedUsuario] = useState('geral')
  const [acao, setAcao] = useState('')
  const [horario, setHorario] = useState('')
  const [frequencia, setFrequencia] = useState('diario')
  const [intervaloDias, setIntervaloDias] = useState('1')
  const [diasSemana, setDiasSemana] = useState<string[]>(['seg', 'ter', 'qua', 'qui', 'sex'])
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Load cargos and reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCargo('')
      setSelectedUsuario('geral')
      setAcao('')
      setHorario('')
      setFrequencia('diario')
      setIntervaloDias('1')
      setDiasSemana(['seg', 'ter', 'qua', 'qui', 'sex'])
      setDataInicio(new Date().toISOString().split('T')[0])
      setDataFim('')

      const fetchAllCargos = async () => {
        const { data } = await supabase.from('cargos').select('id, nome').order('nome')
        setCargos(data || [])
      }
      fetchAllCargos()
    }
  }, [isOpen])

  // Fetch users whenever a cargo is selected
  useEffect(() => {
    if (!selectedCargo) {
      setUsuarios([])
      return
    }
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, nome')
        .eq('cargo_id', selectedCargo)
        .order('nome')
      setUsuarios(data || [])
      setSelectedUsuario('geral')
    }
    fetchUsers()
  }, [selectedCargo])

  const handleSave = async () => {
    if (!selectedCargo || !acao || !horario) {
      toast({
        title: 'Erro',
        description: 'Preencha os campos obrigatórios (Cargo, Ação e Horário)',
        variant: 'destructive',
      })
      return
    }
    setLoading(true)

    const payload = {
      cargo_id: selectedCargo,
      colaborador_id: selectedUsuario === 'geral' ? null : selectedUsuario,
      acao,
      horario,
      frequencia,
      dias_semana: diasSemana,
      intervalo_dias: frequencia === 'customizado' ? parseInt(intervaloDias) || 1 : null,
      data_inicio: dataInicio || new Date().toISOString().split('T')[0],
      data_fim: dataFim || null,
    }

    const { error } = await supabase.from('rotinas_config').insert([payload])

    setLoading(false)
    if (error) {
      toast({ title: 'Erro', description: 'Erro ao salvar rotina', variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Rotina criada com sucesso' })
      onSave()
      onClose()
    }
  }

  const toggleDia = (dia: string) => {
    setDiasSemana((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="uppercase font-black text-nuvia-navy tracking-wider text-sm sm:text-base">
            + ADICIONAR ROTINA
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[75vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">SELECIONAR CARGO</Label>
            <Select value={selectedCargo} onValueChange={setSelectedCargo}>
              <SelectTrigger className="uppercase font-bold text-nuvia-navy">
                <SelectValue placeholder="ESCOLHA O CARGO" />
              </SelectTrigger>
              <SelectContent>
                {cargos.map((cargo) => (
                  <SelectItem key={cargo.id} value={cargo.id} className="font-bold uppercase">
                    {cargo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCargo && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                SELECIONAR USUÁRIO
              </Label>
              <Select value={selectedUsuario} onValueChange={setSelectedUsuario}>
                <SelectTrigger className="uppercase font-bold text-nuvia-navy">
                  <SelectValue placeholder="ESCOLHA O USUÁRIO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral" className="font-bold uppercase text-slate-500">
                    GERAL (TODOS DO CARGO)
                  </SelectItem>
                  {usuarios.map((usr) => (
                    <SelectItem key={usr.id} value={usr.id} className="font-bold uppercase">
                      {usr.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
              <Label className="text-xs font-bold text-slate-500 uppercase">RECORRÊNCIA</Label>
              <Select value={frequencia} onValueChange={setFrequencia}>
                <SelectTrigger className="uppercase font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">DIÁRIO</SelectItem>
                  <SelectItem value="semanal">SEMANAL</SelectItem>
                  <SelectItem value="quinzenal">QUINZENAL</SelectItem>
                  <SelectItem value="mensal">MENSAL</SelectItem>
                  <SelectItem value="customizado">CUSTOMIZADO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {frequencia === 'customizado' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                A CADA QUANTOS DIAS?
              </Label>
              <Input
                type="number"
                min="1"
                value={intervaloDias}
                onChange={(e) => setIntervaloDias(e.target.value)}
                placeholder="Ex: 3"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">DATA INÍCIO</Label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                DATA FIM (OPCIONAL)
              </Label>
              <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
          </div>

          {frequencia !== 'mensal' && frequencia !== 'customizado' && (
            <div className="space-y-2 animate-in fade-in">
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
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            CANCELAR
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-widest"
          >
            {loading ? 'SALVANDO...' : 'SALVAR ROTINA'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
