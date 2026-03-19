import { HubFeedback } from '@/stores/hub'
import { Card, CardContent } from '@/components/ui/card'
import useAppStore from '@/stores/main'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle, TrendingUp, User } from 'lucide-react'

export function FeedbackList({
  items,
  showAuthor = false,
}: {
  items: HubFeedback[]
  showAuthor?: boolean
}) {
  const { employees } = useAppStore()

  const getAuthorName = (userId: string) => {
    return employees.find((e) => e.user_id === userId)?.name || 'USUÁRIO DESCONHECIDO'
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-xl bg-white/50 font-bold tracking-widest">
        NENHUM REGISTRO DE FEEDBACK ENCONTRADO.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="bg-slate-50 p-4 md:w-56 border-r flex flex-col justify-center shrink-0">
                <p className="text-[10px] font-bold text-muted-foreground mb-1 tracking-widest">
                  ENVIADO EM:
                </p>
                <p className="text-sm font-black text-slate-800">
                  {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>

                {showAuthor && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-[10px] font-bold text-muted-foreground mb-1 tracking-widest">
                      COLABORADOR:
                    </p>
                    <p className="text-xs font-bold text-primary flex items-center gap-1.5 line-clamp-2 uppercase">
                      <User className="h-3 w-3 shrink-0" /> {getAuthorName(item.user_id)}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 space-y-4">
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-black tracking-widest text-emerald-600 mb-1">
                    <CheckCircle className="h-3.5 w-3.5" /> PONTOS POSITIVOS
                  </h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap normal-case font-medium">
                    {item.excellent_content}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="flex items-center gap-1.5 text-xs font-black tracking-widest text-amber-600 mb-1">
                    <TrendingUp className="h-3.5 w-3.5" /> PONTOS DE MELHORIA
                  </h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap normal-case font-medium">
                    {item.improvement_content}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
