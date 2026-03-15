import { useState, useEffect } from 'react'
import useAppStore, { SacRecord } from '@/stores/main'
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
import { Textarea } from '@/components/ui/textarea'
import { HeadphonesIcon, AlertTriangle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: SacRecord
}

export function SacFormModal({ open, onOpenChange, item }: Props) {
  const { addSacRecord, updateSacRecord, employees, currentUserId } = useAppStore()
  const { toast } = useToast()

  const [type, setType] = useState<'RECLAMAÇÃO' | 'SUGESTÃO'>('RECLAMAÇÃO')
  const [patientName, setPatientName] = useState('')
  const [sector, setSector] = useState('')
  const [receivingEmployee, setReceivingEmployee] = useState(currentUserId || 'none')
  const [responsibleEmployee, setResponsibleEmployee] = useState('none')
  const [description, setDescription] = useState('')

  const [status, setStatus] = useState<
    'OPORTUNIDADE DE SOLUÇÃO' | 'RECEBIDO' | 'SENDO TRATADO' | 'RESOLVIDO'
  >('OPORTUNIDADE DE SOLUÇÃO')
  const [solutionDetails, setSolutionDetails] = useState('')

  const activeEmployees = employees.filter((e) => e.status !== 'Desligado')

  useEffect(() => {
    if (open) {
      if (item) {
        setType(item.type)
        setPatientName(item.patient_name)
        setSector(item.sector)
        setReceivingEmployee(item.receiving_employee_id || 'none')
        setResponsibleEmployee(item.responsible_employee_id || 'none')
        setDescription(item.description)
        setStatus(item.status)
        setSolutionDetails(item.solution_details || '')
      } else {
        setType('RECLAMAÇÃO')
        setPatientName('')
        setSector('')
        setReceivingEmployee(currentUserId || 'none')
        setResponsibleEmployee('none')
        setDescription('')
        setStatus('OPORTUNIDADE DE SOLUÇÃO')
        setSolutionDetails('')
      }
    }
  }, [open, item, currentUserId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status === 'RESOLVIDO' && !solutionDetails.trim()) {
      toast({
        variant: 'destructive',
        title: 'ATENÇÃO',
        description: 'É OBRIGATÓRIO PREENCHER OS DETALHES DA SOLUÇÃO PARA MARCAR COMO RESOLVIDO.',
      })
      return
    }

    const payload = {
      type,
      patient_name: patientName.toUpperCase(),
      sector: sector.toUpperCase(),
      receiving_employee_id: receivingEmployee === 'none' ? undefined : receivingEmployee,
      responsible_employee_id: responsibleEmployee === 'none' ? undefined : responsibleEmployee,
      description: description.toUpperCase(),
      status,
      solution_details: solutionDetails.toUpperCase(),
    }

    let result
    if (item) {
      result = await updateSacRecord(item.id, payload)
    } else {
      result = await addSacRecord(payload)
    }

    if (result.success) {
      toast({ title: 'SUCESSO', description: 'REGISTRO SALVO COM SUCESSO.' })
      onOpenChange(false)
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO SALVAR O REGISTRO.' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl uppercase max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-[#0A192F]">
            <HeadphonesIcon className="h-6 w-6 text-[#D4AF37]" />
            {item ? 'EDITAR OPORTUNIDADE (SAC)' : 'NOVA OPORTUNIDADE (SAC)'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0A192F]">TIPO *</label>
              <Select value={type} onValueChange={(v: any) => setType(v)} disabled={!!item}>
                <SelectTrigger className="border-[#0A192F]/20 focus:ring-[#D4AF37]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RECLAMAÇÃO">RECLAMAÇÃO</SelectItem>
                  <SelectItem value="SUGESTÃO">SUGESTÃO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0A192F]">NOME DO PACIENTE *</label>
              <Input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                className="border-[#0A192F]/20 focus-visible:ring-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0A192F]">RECEPTOR</label>
              <Select value={receivingEmployee} onValueChange={setReceivingEmployee}>
                <SelectTrigger className="border-[#0A192F]/20 focus:ring-[#D4AF37]">
                  <SelectValue placeholder="SELECIONE..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">SISTEMA</SelectItem>
                  {activeEmployees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0A192F]">RESPONSÁVEL PELA SOLUÇÃO *</label>
              <Select value={responsibleEmployee} onValueChange={setResponsibleEmployee} required>
                <SelectTrigger className="border-[#0A192F]/20 focus:ring-[#D4AF37]">
                  <SelectValue placeholder="SELECIONE..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">NENHUM</SelectItem>
                  {activeEmployees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0A192F]">SETOR ENVOLVIDO *</label>
            <Input
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              required
              placeholder="EX: RECEPÇÃO, CLÍNICO, FINANCEIRO..."
              className="border-[#0A192F]/20 focus-visible:ring-[#D4AF37]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0A192F]">
              DESCRIÇÃO DO PROBLEMA / SUGESTÃO *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="border-[#0A192F]/20 focus-visible:ring-[#D4AF37]"
            />
          </div>

          {item && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0A192F]">STATUS DA TRATATIVA</label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger className="border-[#0A192F]/20 focus:ring-[#D4AF37] font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPORTUNIDADE DE SOLUÇÃO" className="text-red-700 font-bold">
                      OPORTUNIDADE DE SOLUÇÃO
                    </SelectItem>
                    <SelectItem value="RECEBIDO" className="text-blue-600 font-bold">
                      RECEBIDO
                    </SelectItem>
                    <SelectItem value="SENDO TRATADO" className="text-amber-600 font-bold">
                      SENDO TRATADO
                    </SelectItem>
                    <SelectItem value="RESOLVIDO" className="text-emerald-600 font-bold">
                      RESOLVIDO
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(status === 'RESOLVIDO' || status === 'SENDO TRATADO') && (
                <div className="space-y-2 animate-fade-in-up">
                  <label className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    DETALHES DA SOLUÇÃO {status === 'RESOLVIDO' && '*'}
                  </label>
                  <Textarea
                    value={solutionDetails}
                    onChange={(e) => setSolutionDetails(e.target.value)}
                    required={status === 'RESOLVIDO'}
                    rows={4}
                    placeholder="COMO O PROBLEMA FOI RESOLVIDO?"
                    className="border-emerald-200 focus-visible:ring-emerald-500 bg-emerald-50/30"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-bold"
            >
              CANCELAR
            </Button>
            <Button
              type="submit"
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-bold shadow-md"
            >
              {item ? 'SALVAR ALTERAÇÕES' : 'REGISTRAR OPORTUNIDADE'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
