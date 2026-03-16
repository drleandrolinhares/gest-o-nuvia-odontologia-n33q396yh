import { useState, useEffect } from 'react'
import useAppStore, { SacRecord } from '@/stores/main'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Pencil,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquareWarning,
  Lightbulb,
  User,
  ArrowRight,
} from 'lucide-react'
import { SacFormModal } from './SacFormModal'
import { SacStatusSelect } from './SacStatusSelect'

const SlaTimer = ({ limitAt, resolvedAt }: { limitAt: string; resolvedAt?: string }) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    if (resolvedAt) return
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [resolvedAt])

  if (resolvedAt) {
    return (
      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
        <CheckCircle className="w-3 h-3 mr-1" /> SLA CUMPRIDO
      </Badge>
    )
  }

  const limit = new Date(limitAt)
  const diffMs = limit.getTime() - now.getTime()
  const isExpired = diffMs < 0

  const absMs = Math.abs(diffMs)
  const hours = Math.floor(absMs / (1000 * 60 * 60))
  const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((absMs % (1000 * 60)) / 1000)

  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  if (isExpired) {
    return (
      <Badge variant="destructive" className="animate-pulse flex items-center gap-1 font-bold">
        <AlertTriangle className="w-3 h-3 shrink-0" /> ATRASADO {timeStr}
      </Badge>
    )
  }

  if (hours < 2) {
    return (
      <Badge className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1 font-bold">
        <Clock className="w-3 h-3 shrink-0" /> VENCE EM {timeStr}
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className="bg-slate-100 text-slate-700 flex items-center gap-1 font-bold border-slate-200"
    >
      <Clock className="w-3 h-3 shrink-0" /> {timeStr}
    </Badge>
  )
}

export function SacList({ onEdit }: { onEdit?: (record: SacRecord) => void }) {
  const { sacRecords, deleteSacRecord, updateSacRecord, employees, isAdmin, currentUserId } =
    useAppStore()
  const [selectedItem, setSelectedItem] = useState<SacRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [view, setView] = useState<'TUDO' | 'PARA MIM' | 'DELEGADOS'>('TUDO')
  const [hideResolved, setHideResolved] = useState(false)

  const handleEdit = (item: SacRecord) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('TEM CERTEZA QUE DESEJA EXCLUIR ESTE REGISTRO?')) {
      deleteSacRecord(id)
    }
  }

  const getEmpName = (id?: string) => {
    if (!id || id === 'none') return 'SISTEMA'
    return employees.find((e) => e.id === id)?.name || 'SISTEMA'
  }

  const filteredRecords = sacRecords
    .filter((r) => {
      if (view === 'TUDO') return true
      if (view === 'PARA MIM') return r.responsible_employee_id === currentUserId
      if (view === 'DELEGADOS') return r.receiving_employee_id === currentUserId
      return true
    })
    .filter((r) => {
      if (hideResolved && r.status === 'RESOLVIDO') return false
      return true
    })

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 w-full">
        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full sm:w-auto">
          <TabsList className="bg-transparent border-b rounded-none w-full sm:w-auto justify-start h-10 p-0 gap-6">
            <TabsTrigger
              value="TUDO"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:shadow-none rounded-none px-0 py-2 data-[state=active]:bg-transparent"
            >
              TUDO
            </TabsTrigger>
            <TabsTrigger
              value="PARA MIM"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:shadow-none rounded-none px-0 py-2 data-[state=active]:bg-transparent"
            >
              PARA MIM
            </TabsTrigger>
            <TabsTrigger
              value="DELEGADOS"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:shadow-none rounded-none px-0 py-2 data-[state=active]:bg-transparent"
            >
              DELEGADOS POR MIM
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-3 bg-white border border-slate-200 px-4 py-2 rounded-md shadow-sm h-10 w-full sm:w-auto justify-between sm:justify-start shrink-0">
          <label
            htmlFor="hide-resolved"
            className="text-[11px] font-extrabold tracking-wide text-[#0A192F] cursor-pointer whitespace-nowrap uppercase"
          >
            MOSTRAR APENAS NÃO RESOLVIDOS
          </label>
          <Switch
            checked={hideResolved}
            onCheckedChange={setHideResolved}
            id="hide-resolved"
            className="data-[state=checked]:bg-[#0A192F]"
          />
        </div>
      </div>

      <Card className="shadow-sm overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-[#0A192F] hover:bg-[#0A192F]">
              <TableHead className="font-bold text-[#D4AF37] uppercase">TIPO / PACIENTE</TableHead>
              <TableHead className="font-bold text-[#D4AF37] uppercase">RESPONSABILIDADE</TableHead>
              <TableHead className="font-bold text-[#D4AF37] uppercase">SETOR</TableHead>
              <TableHead className="font-bold text-[#D4AF37] uppercase">DATAS / SLA</TableHead>
              <TableHead className="font-bold text-[#D4AF37] uppercase">STATUS</TableHead>
              <TableHead className="font-bold text-[#D4AF37] text-center uppercase">
                AÇÕES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((item) => {
              const isAssignee = item.responsible_employee_id === currentUserId
              const canEditStatus = isAssignee || isAdmin
              return (
                <TableRow key={item.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        {item.type === 'RECLAMAÇÃO' ? (
                          <MessageSquareWarning className="h-3.5 w-3.5 text-red-500" />
                        ) : (
                          <Lightbulb className="h-3.5 w-3.5 text-blue-500" />
                        )}
                        {item.type}
                      </div>
                      <span className="font-extrabold text-[#0A192F] uppercase">
                        {item.patient_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-[#D4AF37] bg-[#0A192F] px-2 py-1 rounded-md border border-[#D4AF37]/30 font-bold uppercase tracking-widest text-[9px] w-fit shadow-sm max-w-[200px] overflow-hidden">
                      <User className="h-3 w-3 shrink-0" />
                      <span className="truncate" title={getEmpName(item.receiving_employee_id)}>
                        {getEmpName(item.receiving_employee_id).split(' ')[0]}
                      </span>
                      <ArrowRight className="h-3 w-3 opacity-60 text-[#D4AF37] shrink-0 mx-0.5" />
                      <span className="truncate" title={getEmpName(item.responsible_employee_id)}>
                        {getEmpName(item.responsible_employee_id).split(' ')[0]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-xs text-slate-700 uppercase">
                    {item.sector}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <SlaTimer limitAt={item.limit_at} resolvedAt={item.solved_at} />
                      <div className="text-[10px] text-slate-500 font-bold uppercase flex flex-col">
                        <span>
                          REG: {new Date(item.received_at).toLocaleDateString('pt-BR')}{' '}
                          {new Date(item.received_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="text-slate-400">
                          LIM: {new Date(item.limit_at).toLocaleDateString('pt-BR')}{' '}
                          {new Date(item.limit_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SacStatusSelect
                      value={item.status}
                      onChange={(v) => {
                        if (v === 'RESOLVIDO' && !item.solution_details) {
                          handleEdit(item)
                          return
                        }
                        updateSacRecord(item.id, { status: v as any })
                      }}
                      disabled={!canEditStatus}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#0A192F] hover:text-[#D4AF37] hover:bg-[#0A192F]/5"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {filteredRecords.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-16 text-muted-foreground font-bold uppercase"
                >
                  NENHUM REGISTRO DE SAC ENCONTRADO.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <SacFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setSelectedItem(null)
        }}
        item={selectedItem || undefined}
      />
    </>
  )
}
