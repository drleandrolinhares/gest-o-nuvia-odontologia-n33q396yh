import { AgendaItem, Employee } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  Clock,
  Trash2,
  CalendarIcon,
  User,
  ArrowRight,
  History,
  RefreshCw,
  UserMinus,
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import useAppStore from '@/stores/main'
import { SacStatusSelect } from '@/components/sac/SacStatusSelect'
import { ABSENCE_TYPES } from '@/lib/constants'

interface Props {
  item: AgendaItem
  currentUserId: string | null
  employees: Employee[]
  onSelect: (item: AgendaItem) => void
  onUpdate: (id: string, data: Partial<AgendaItem>) => void
  onRemove: (id: string) => void
}

export function AgendaCard({
  item,
  currentUserId,
  employees,
  onSelect,
  onUpdate,
  onRemove,
}: Props) {
  const { sacRecords, updateSacRecord, isAdmin } = useAppStore()

  const isAssignee =
    item.assignedTo === currentUserId || !item.assignedTo || item.assignedTo === 'none'
  const isRequester = item.requester_id === currentUserId

  const isSac = item.type === 'SAC'
  const isAbsence =
    ABSENCE_TYPES.includes(item.type.toLowerCase()) || item.type === 'manual_absence'
  const sacRecord =
    isSac && item.sac_record_id ? sacRecords.find((s) => s.id === item.sac_record_id) : null

  const needsFollowUp =
    isRequester &&
    item.assignedTo &&
    item.assignedTo !== currentUserId &&
    !item.received_at &&
    !item.is_completed &&
    !isSac &&
    !isAbsence

  const getEmpName = (id?: string) => {
    if (!id || id === 'none') return 'GERAL'
    return employees.find((e) => e.id === id)?.name?.split(' ')[0] || 'SISTEMA'
  }

  const getRequesterName = () => {
    if (item.requester_id) return getEmpName(item.requester_id)
    return item.createdBy || 'SISTEMA'
  }

  const formatDt = (iso?: string, justDate = false) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (justDate) return d.toLocaleDateString('pt-BR')
    return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  }

  const isMultiDay = item.date !== item.end_date

  return (
    <Card
      className={cn(
        'relative transition-all shadow-sm group border',
        item.is_completed
          ? 'opacity-60 bg-muted/40 border-muted'
          : 'hover:border-primary/40 cursor-pointer',
        needsFollowUp && 'border-amber-300 bg-amber-50/40',
        isAbsence && !item.is_completed && 'border-rose-200 bg-rose-50/40 hover:border-rose-400',
        isMultiDay && !item.is_completed && !isAbsence
          ? 'border-l-4 border-l-[#D4AF37] border-y-2 border-y-[#D4AF37]/30 bg-[#D4AF37]/5'
          : '',
      )}
      onClick={() => !item.is_completed && onSelect(item)}
    >
      {needsFollowUp && (
        <div className="absolute -top-2.5 right-2 bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-sm animate-pulse">
          <AlertTriangle className="h-3 w-3" /> AGUARDANDO RESPONSÁVEL
        </div>
      )}
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {!isAbsence ? (
                <Badge variant="outline" className="text-[10px] uppercase font-bold bg-background">
                  {item.type}
                </Badge>
              ) : (
                <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[10px] uppercase font-bold hover:bg-rose-200">
                  <UserMinus className="h-3 w-3 mr-1" /> AUSÊNCIA
                </Badge>
              )}

              {item.periodicity && item.periodicity !== 'ÚNICO' && (
                <Badge variant="outline" className="text-[9px] bg-background">
                  <RefreshCw className="h-2.5 w-2.5 mr-1" /> {item.periodicity}
                </Badge>
              )}

              {item.is_completed && (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                  CONCLUÍDO
                </Badge>
              )}
            </div>
            <h3
              className={cn(
                'font-bold text-base uppercase leading-tight mt-1',
                item.is_completed && 'line-through text-muted-foreground',
                isAbsence && !item.is_completed && 'text-rose-950',
              )}
            >
              {item.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1 text-primary">
                <Clock className="h-3.5 w-3.5" /> {item.time}
              </span>
              <span
                className={cn('flex items-center gap-1', isMultiDay && 'text-[#0A192F] font-bold')}
              >
                <CalendarIcon className="h-3.5 w-3.5" />{' '}
                {isMultiDay
                  ? `${formatDt(item.date, true)} ATÉ ${formatDt(item.end_date, true)}`
                  : formatDt(item.date, true)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {item.location}
              </span>
              <span className="flex items-center gap-1 text-[#D4AF37] bg-[#0A192F] px-2 py-1 rounded border border-[#D4AF37]/30 font-bold uppercase tracking-widest text-[10px] shadow-sm">
                <User className="h-3 w-3" />
                {getRequesterName()}{' '}
                <ArrowRight className="h-3 w-3 mx-0.5 opacity-60 text-[#D4AF37]" />{' '}
                {getEmpName(item.assignedTo)}
              </span>
            </div>
          </div>

          <div
            className="flex flex-col items-end gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {isSac && sacRecord ? (
              <SacStatusSelect
                value={sacRecord.status}
                onChange={async (v) => {
                  if (v === 'RESOLVIDO' && !sacRecord.solution_details) {
                    const details = window.prompt(
                      'É obrigatório preencher os detalhes da solução para finalizar. Digite abaixo:',
                    )
                    if (!details || !details.trim()) {
                      alert('Detalhes da solução são obrigatórios.')
                      return
                    }
                    await updateSacRecord(sacRecord.id, {
                      status: v as any,
                      solution_details: details.toUpperCase(),
                    })
                  } else {
                    await updateSacRecord(sacRecord.id, { status: v as any })
                  }
                }}
                disabled={!isAssignee && !isAdmin}
              />
            ) : isAssignee && !item.is_completed ? (
              !isAbsence ? (
                !item.received_at ? (
                  <Button
                    size="sm"
                    onClick={() => onUpdate(item.id, { received_at: new Date().toISOString() })}
                    className="bg-blue-600 hover:bg-blue-700 h-8 text-[11px] px-3 uppercase shadow-sm"
                  >
                    Recebi e vou resolver
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() =>
                      onUpdate(item.id, {
                        is_completed: true,
                        completed_at: new Date().toISOString(),
                      })
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 h-8 text-[11px] px-3 uppercase shadow-sm"
                  >
                    Resolvido
                  </Button>
                )
              ) : (
                <Button
                  size="sm"
                  onClick={() =>
                    onUpdate(item.id, {
                      is_completed: true,
                      completed_at: new Date().toISOString(),
                    })
                  }
                  className="bg-rose-600 hover:bg-rose-700 h-8 text-[11px] px-3 uppercase shadow-sm"
                >
                  Marcar Passado
                </Button>
              )
            ) : (
              !item.is_completed &&
              (item.received_at ? (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 border-blue-200 uppercase text-[10px]"
                >
                  Recebido / Em Andamento
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-muted-foreground uppercase text-[10px] bg-background"
                >
                  Pendente
                </Badge>
              ))
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-1 pt-2 border-t border-muted/50 flex flex-wrap gap-x-6 gap-y-1.5 text-[10px] text-muted-foreground uppercase bg-slate-50/50 px-3 py-2 rounded-md">
          <div>
            <span className="font-bold text-slate-500">SOLICITADO EM:</span>{' '}
            {formatDt(item.created_at || item.date)}
          </div>
          {item.received_at && (
            <div>
              <span className="font-bold text-blue-600/70">RECEBIDO EM:</span>{' '}
              {formatDt(item.received_at)}
            </div>
          )}
          {item.completed_at && (
            <div>
              <span className="font-bold text-emerald-600/70">RESOLVIDO EM:</span>{' '}
              {formatDt(item.completed_at)}
            </div>
          )}
        </div>

        {isSac && sacRecord && (
          <div className="mt-1 pt-2 border-t border-muted/50">
            <h4 className="text-[10px] font-bold text-[#0A192F] mb-1.5 flex items-center gap-1.5">
              <History className="h-3 w-3 text-[#D4AF37]" /> HISTÓRICO DE AÇÕES (SAC)
            </h4>
            {!sacRecord.action_history || sacRecord.action_history.length === 0 ? (
              <p className="text-[9px] text-muted-foreground italic">Nenhuma ação registrada</p>
            ) : (
              <div className="space-y-1.5 max-h-[90px] overflow-y-auto pr-1">
                {sacRecord.action_history.map((h, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start gap-2 bg-[#0A192F]/5 p-1.5 rounded border border-[#0A192F]/10"
                  >
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-[#0A192F]">{h.action}</span>
                      <span className="text-[8px] font-semibold text-slate-500 flex items-center gap-1">
                        <User className="h-2 w-2" /> {h.employeeName}
                      </span>
                    </div>
                    <span className="text-[8px] font-medium text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
                      {new Date(h.timestamp).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
