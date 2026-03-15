import { AgendaItem, Employee } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  Users,
  MapPin,
  Bell,
  Stethoscope,
  User,
  CalendarDays,
  DollarSign,
  ClipboardList,
} from 'lucide-react'
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
  const isPedido = item.type.toUpperCase() === 'PEDIDO'
  const isAssignee = item.assignedTo === currentUserId

  const getIcon = (type: string) => {
    const t = type.toUpperCase()
    if (t.includes('PEDIDO')) return <ClipboardList className="h-5 w-5 text-indigo-500" />
    if (t.includes('REUNIÃO')) return <Users className="h-5 w-5 text-blue-500" />
    if (t.includes('VIAGEM')) return <MapPin className="h-5 w-5 text-emerald-500" />
    if (t.includes('LEMBRETE')) return <Bell className="h-5 w-5 text-amber-500" />
    if (t.includes('CONSULTA')) return <Stethoscope className="h-5 w-5 text-[#D81B84]" />
    if (t.includes('COMISSÃO') || t.includes('BÔNUS'))
      return <DollarSign className="h-5 w-5 text-emerald-600" />
    if (t.includes('FÉRIAS')) return <CalendarDays className="h-5 w-5 text-orange-500" />
    return <Clock className="h-5 w-5 text-primary" />
  }

  return (
    <Card
      className={cn(
        'hover:border-primary/50 transition-colors shadow-sm cursor-pointer group',
        item.is_completed && 'opacity-60 bg-muted/20',
      )}
      onClick={() => onSelect(item)}
    >
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-4 flex-1 w-full">
          <div
            className={cn(
              'h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-colors',
              item.is_completed
                ? 'bg-muted text-muted-foreground'
                : 'bg-primary/10 group-hover:bg-primary/20',
            )}
          >
            {getIcon(item.type)}
          </div>
          <div>
            <h3
              className={cn(
                'font-semibold text-lg uppercase leading-tight',
                item.is_completed ? 'text-muted-foreground line-through' : 'text-foreground',
              )}
            >
              {item.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1.5">
              <span className="flex items-center gap-1 font-medium text-primary">
                <Clock className="h-3.5 w-3.5" /> {item.time}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />{' '}
                {new Date(item.date).toLocaleDateString('pt-BR')}
              </span>
              <span>•</span>
              <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold uppercase border">
                {item.type}
              </span>
              {item.assignedTo && item.assignedTo !== 'none' && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-indigo-600 uppercase font-medium text-[11px]">
                    <User className="h-3.5 w-3.5" />
                    {employees.find((e) => e.id === item.assignedTo)?.name || 'DESCONHECIDO'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end pt-3 sm:pt-0 border-t sm:border-0 border-muted"
          onClick={(e) => e.stopPropagation()}
        >
          {isPedido ? (
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
              {item.is_completed ? (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  CONCLUÍDO
                </Badge>
              ) : item.received_at ? (
                <>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 whitespace-nowrap">
                    EM ANDAMENTO
                  </Badge>
                  {isAssignee && (
                    <Button
                      size="sm"
                      className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 uppercase px-2"
                      onClick={() =>
                        onUpdate(item.id, {
                          is_completed: true,
                          completed_at: new Date().toISOString(),
                        })
                      }
                    >
                      RESOLVIDO
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Badge
                    variant="destructive"
                    className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100 whitespace-nowrap"
                  >
                    AGUARDANDO
                  </Badge>
                  {isAssignee && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px] border-primary text-primary uppercase px-2"
                      onClick={() => onUpdate(item.id, { received_at: new Date().toISOString() })}
                    >
                      RECEBI
                    </Button>
                  )}
                </>
              )}
            </div>
          ) : (
            <div
              className={cn(
                'flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer',
                item.is_completed
                  ? 'bg-muted border-muted-foreground/20 hover:bg-muted/80'
                  : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
              )}
              onClick={() => onUpdate(item.id, { is_completed: !item.is_completed })}
            >
              <Checkbox
                checked={item.is_completed}
                onCheckedChange={(c) => onUpdate(item.id, { is_completed: !!c })}
              />
              <label
                className={cn(
                  'text-[10px] font-bold cursor-pointer uppercase whitespace-nowrap',
                  item.is_completed ? 'text-muted-foreground' : 'text-emerald-900',
                )}
              >
                {item.is_completed ? 'CONCLUÍDO' : 'MARCAR CONCLUÍDO'}
              </label>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
