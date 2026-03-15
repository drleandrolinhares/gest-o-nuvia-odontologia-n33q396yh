import { AgendaItem, Employee } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, Trash2, CalendarIcon, User, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const isAssignee =
    item.assignedTo === currentUserId || !item.assignedTo || item.assignedTo === 'none'
  const isRequester = item.requester_id === currentUserId
  const needsFollowUp =
    isRequester &&
    item.assignedTo &&
    item.assignedTo !== currentUserId &&
    !item.received_at &&
    !item.is_completed

  const getEmpName = (id?: string) => {
    if (!id || id === 'none') return 'GERAL'
    return employees.find((e) => e.id === id)?.name?.split(' ')[0] || 'SISTEMA'
  }

  const getRequesterName = () => {
    if (item.requester_id) return getEmpName(item.requester_id)
    return item.createdBy || 'SISTEMA'
  }

  const formatDt = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  }

  return (
    <Card
      className={cn(
        'relative transition-all shadow-sm group border',
        item.is_completed
          ? 'opacity-60 bg-muted/40 border-muted'
          : 'hover:border-primary/40 cursor-pointer',
        needsFollowUp && 'border-amber-300 bg-amber-50/40',
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
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] uppercase font-bold bg-background">
                {item.type}
              </Badge>
              {item.is_completed && (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                  CONCLUÍDO
                </Badge>
              )}
            </div>
            <h3
              className={cn(
                'font-bold text-base uppercase leading-tight',
                item.is_completed && 'line-through text-muted-foreground',
              )}
            >
              {item.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1 text-primary">
                <Clock className="h-3.5 w-3.5" /> {item.time}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />{' '}
                {new Date(item.date).toLocaleDateString('pt-BR')}
              </span>
              <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                <User className="h-3 w-3" />
                {getRequesterName()} <ArrowRight className="h-3 w-3 mx-0.5 opacity-50" />{' '}
                {getEmpName(item.assignedTo)}
              </span>
            </div>
          </div>

          <div
            className="flex flex-col items-end gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {isAssignee && !item.is_completed ? (
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
      </CardContent>
    </Card>
  )
}
