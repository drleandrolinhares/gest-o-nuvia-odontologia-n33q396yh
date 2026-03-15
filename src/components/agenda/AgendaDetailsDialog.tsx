import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon, Clock, MapPin, User, Users, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AgendaItem, Employee } from '@/stores/main'

interface Props {
  item: AgendaItem | null
  onClose: () => void
  onUpdate: (id: string, data: Partial<AgendaItem>) => void
  employees: Employee[]
  currentUserId: string | null
}

export function AgendaDetailsDialog({ item, onClose, onUpdate, employees, currentUserId }: Props) {
  if (!item) return null

  const isPedido = item.type.toUpperCase() === 'PEDIDO'
  const isAssignee = item.assignedTo === currentUserId

  const getEmpName = (id?: string) => {
    if (!id) return 'SISTEMA'
    return employees.find((e) => e.id === id)?.name || 'SISTEMA'
  }

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return ''
    const d = new Date(isoString)
    return `${d.toLocaleDateString('pt-BR')} ÀS ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  }

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md uppercase">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-primary border-b pb-4">
            DETALHES DO COMPROMISSO
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-5">
          <div>
            <h3 className="text-xl font-bold text-foreground leading-tight">{item.title}</h3>
            <div className="inline-block mt-2 bg-muted px-2 py-1 rounded text-xs font-bold">
              {item.type}
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
            {item.assignedTo && item.assignedTo !== 'none' && (
              <div className="flex items-start gap-3 col-span-2 pt-2 border-t border-muted/50">
                <User className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground">ATRIBUÍDO A</p>
                  <p className="text-sm font-bold text-indigo-700">{getEmpName(item.assignedTo)}</p>
                </div>
              </div>
            )}
          </div>

          {isPedido && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Activity className="h-4 w-4" /> HISTÓRICO DO PEDIDO
              </h4>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex items-start gap-3 text-slate-600">
                  <div className="h-2 w-2 rounded-full bg-slate-400 mt-1 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">SOLICITADO POR: </span>
                    {getEmpName(item.requester_id)} <br />
                    <span className="text-[10px] opacity-80 mt-0.5 block">
                      EM{' '}
                      {item.created_at
                        ? formatDateTime(item.created_at)
                        : new Date(item.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {item.received_at && (
                  <div className="flex items-start gap-3 text-blue-700">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                    <div>
                      <span className="font-bold">RECEBIDO POR: </span>
                      {getEmpName(item.assignedTo)} <br />
                      <span className="text-[10px] opacity-80 mt-0.5 block">
                        EM {formatDateTime(item.received_at)}
                      </span>
                    </div>
                  </div>
                )}

                {item.completed_at && (
                  <div className="flex items-start gap-3 text-emerald-700">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <div>
                      <span className="font-bold">RESOLVIDO POR: </span>
                      {getEmpName(item.assignedTo)} <br />
                      <span className="text-[10px] opacity-80 mt-0.5 block">
                        EM {formatDateTime(item.completed_at)}
                      </span>
                    </div>
                  </div>
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
            {!isPedido && (
              <div
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg border mr-auto transition-colors',
                  item.is_completed
                    ? 'bg-muted border-muted-foreground/20'
                    : 'bg-emerald-50 border-emerald-200',
                )}
              >
                <Checkbox
                  id="modal-concluido"
                  checked={item.is_completed}
                  onCheckedChange={(checked) => {
                    onUpdate(item.id, { is_completed: !!checked })
                  }}
                />
                <label
                  htmlFor="modal-concluido"
                  className={cn(
                    'text-xs font-bold cursor-pointer uppercase',
                    item.is_completed ? 'text-muted-foreground' : 'text-emerald-900',
                  )}
                >
                  {item.is_completed ? 'CONCLUÍDO' : 'MARCAR COMO CONCLUÍDO'}
                </label>
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
