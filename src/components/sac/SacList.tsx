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
import {
  Pencil,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquareWarning,
  Lightbulb,
} from 'lucide-react'
import { SacFormModal } from './SacFormModal'

const SlaTimer = ({ limitAt, resolvedAt }: { limitAt: string; resolvedAt?: string }) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    if (resolvedAt) return
    const interval = setInterval(() => setNow(new Date()), 60000)
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

  const timeStr = `${hours}h ${minutes}m`

  if (isExpired) {
    return (
      <Badge variant="destructive" className="animate-pulse flex items-center gap-1 font-bold">
        <AlertTriangle className="w-3 h-3" /> ATRASADO {timeStr}
      </Badge>
    )
  }

  if (hours < 2) {
    return (
      <Badge className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1 font-bold">
        <Clock className="w-3 h-3" /> VENCE EM {timeStr}
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className="bg-slate-100 text-slate-700 flex items-center gap-1 font-bold"
    >
      <Clock className="w-3 h-3" /> {timeStr} RESTANTES
    </Badge>
  )
}

export function SacList({ onEdit }: { onEdit?: (record: SacRecord) => void }) {
  const { sacRecords, deleteSacRecord, employees, isAdmin } = useAppStore()
  const [selectedItem, setSelectedItem] = useState<SacRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    return employees.find((e) => e.id === id)?.name || 'SISTEMA'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECEBIDO':
        return (
          <Badge className="bg-red-600 hover:bg-red-700 font-bold tracking-widest text-[10px]">
            RECEBIDO
          </Badge>
        )
      case 'SENDO TRATADO':
        return (
          <Badge className="bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] font-bold tracking-widest text-[10px]">
            SENDO TRATADO
          </Badge>
        )
      case 'RESOLVIDO':
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 font-bold tracking-widest text-[10px]">
            RESOLVIDO
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <Card className="shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0A192F] hover:bg-[#0A192F]">
              <TableHead className="font-bold text-[#D4AF37] uppercase">TIPO / PACIENTE</TableHead>
              <TableHead className="font-bold text-[#D4AF37] uppercase">SETOR</TableHead>
              <TableHead className="font-bold text-[#D4AF37] uppercase">RESPONSÁVEL</TableHead>
              <TableHead className="font-bold text-[#D4AF37] uppercase">SLA LIMITE</TableHead>
              <TableHead className="font-bold text-[#D4AF37] uppercase">STATUS</TableHead>
              <TableHead className="font-bold text-[#D4AF37] text-center uppercase">
                AÇÕES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sacRecords.map((item) => (
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
                <TableCell className="font-bold text-sm text-slate-600 uppercase">
                  {item.sector}
                </TableCell>
                <TableCell className="text-xs font-bold text-slate-600 uppercase">
                  {getEmpName(item.responsible_employee_id)}
                </TableCell>
                <TableCell>
                  <SlaTimer limitAt={item.limit_at} resolvedAt={item.solved_at} />
                  <div className="text-[10px] text-muted-foreground mt-1 font-bold uppercase">
                    REG: {new Date(item.received_at).toLocaleDateString('pt-BR')}{' '}
                    {new Date(item.received_at).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
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
            ))}
            {sacRecords.length === 0 && (
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
