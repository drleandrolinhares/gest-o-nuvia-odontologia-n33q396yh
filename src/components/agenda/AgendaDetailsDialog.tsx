import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  ArrowRight,
  Activity,
  Users,
  History,
} from 'lucide-react'
import { AgendaItem, Employee } from '@/stores/main'
import useAppStore from '@/stores/main'

interface Props {
  item: AgendaItem | null
  onClose: () => void
  onUpdate: (id: string, data: Partial<AgendaItem>) => void
  employees: Employee[]
  currentUserId: string | null
}

export function AgendaDetailsDialog({ item, onClose, onUpdate, employees, currentUserId }: Props) {
  const { sacRecords } = useAppStore()

  if (!item) return null

  const isAssignee =
    item.assignedTo === currentUserId || !item.assignedTo || item.assignedTo === 'none'

  const isSac = item.type === 'SAC'
  const sacRecord =
    isSac && item.sac_record_id ? sacRecords.find((s) => s.id === item.sac_record_id) : null

  const getEmpName = (id?: string) => {
    if (!id || id === 'none') return 'GERAL'
    return employees.find((e) => e.id === id)?.name || 'SISTEMA'
  }

  const getRequesterName = () => {
    if (item.requester_id) return getEmpName(item.requester_id)
    return item.createdBy || 'SISTEMA'
  }

  const formatDt = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    return `${d.toLocaleDateString('pt-BR')} ÀS ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  }

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md uppercase max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-primary border-b pb-4">
            DETALHES DO REGISTRO
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-5">
          <div>
            <h3 className="text-xl font-bold text-foreground leading-tight">{item.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{item.type}</Badge>
              {item.is_completed && (
                <Badge className="bg-emerald-100 text-emerald-800">CONCLUÍDO</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border shadow-sm">
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-muted-foreground">DATA</p>
                <p className="text-sm font-medium">
                  {new Date(item.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-muted-foreground">HORÁRIO</p>
                <p className="text-sm font-medium text-primary">{item.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 col-span-2">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-muted-foreground">LOCAL</p>
                <p className="text-sm font-medium">{item.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 col-span-2 pt-2 border-t border-muted/50">
              <User className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-muted-foreground">FLUXO DE RESPONSABILIDADE</p>
                <p className="text-xs font-bold flex items-center gap-1.5 text-indigo-700 mt-1 bg-indigo-50 px-2 py-1 rounded w-fit border border-indigo-100">
                  DE: {getRequesterName()} <ArrowRight className="h-3 w-3 opacity-50" /> PARA:{' '}
                  {getEmpName(item.assignedTo)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Activity className="h-4 w-4" /> HISTÓRICO GERAL
            </h4>
            <div className="space-y-3 text-xs font-medium">
              <div className="flex items-start gap-3 text-slate-600">
                <div className="h-2 w-2 rounded-full bg-slate-400 mt-1 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800">SOLICITADO POR: </span>
                  {getRequesterName()}
                  <br />
                  <span className="text-[10px] opacity-80 mt-0.5 block">
                    EM {formatDt(item.created_at || item.date)}
                  </span>
                </div>
              </div>
              {item.received_at && (
                <div className="flex items-start gap-3 text-blue-700">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <div>
                    <span className="font-bold">RECEBIDO: </span>CONFIRMADO
                    <br />
                    <span className="text-[10px] opacity-80 mt-0.5 block">
                      EM {formatDt(item.received_at)}
                    </span>
                  </div>
                </div>
              )}
              {item.completed_at && (
                <div className="flex items-start gap-3 text-emerald-700">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <span className="font-bold">RESOLVIDO: </span>CONFIRMADO
                    <br />
                    <span className="text-[10px] opacity-80 mt-0.5 block">
                      EM {formatDt(item.completed_at)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isSac && sacRecord && (
            <div className="bg-[#0A192F]/5 p-4 rounded-lg border border-[#0A192F]/10 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-[#0A192F] flex items-center gap-2 border-b border-[#0A192F]/10 pb-2">
                <History className="h-4 w-4 text-[#D4AF37]" /> HISTÓRICO DE AÇÕES (SAC)
              </h4>
              <div className="space-y-3">
                {!sacRecord.action_history || sacRecord.action_history.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Nenhuma ação registrada</p>
                ) : (
                  sacRecord.action_history.map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-xs font-bold text-[#0A192F]">{h.action}</span>
                          <span className="text-[10px] font-medium text-slate-500 shrink-0">
                            {new Date(h.timestamp).toLocaleString('pt-BR', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                          <User className="h-3 w-3" /> {h.employeeName}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {item.involvesThirdParty && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" /> ENVOLVE TERCEIROS
              </h4>
              <p className="text-sm text-amber-800 bg-white/50 p-3 rounded border border-amber-100 whitespace-pre-wrap">
                {item.thirdPartyDetails}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t gap-3 items-center w-full">
            {isAssignee && !item.is_completed && !isSac && (
              <div className="mr-auto flex gap-2">
                {!item.received_at ? (
                  <Button
                    onClick={() => onUpdate(item.id, { received_at: new Date().toISOString() })}
                    className="bg-blue-600 hover:bg-blue-700 h-9"
                  >
                    RECEBI E VOU RESOLVER
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      onUpdate(item.id, {
                        is_completed: true,
                        completed_at: new Date().toISOString(),
                      })
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 h-9"
                  >
                    MARCAR RESOLVIDO
                  </Button>
                )}
              </div>
            )}
            <Button variant="outline" onClick={onClose}>
              FECHAR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
