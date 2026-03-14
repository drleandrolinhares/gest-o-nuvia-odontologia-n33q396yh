import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, Users, Clock } from 'lucide-react'
import { AccessItem } from '@/stores/main'

export function VisaoGeral({ item }: { item: AccessItem }) {
  return (
    <Card className="shadow-sm border-muted h-full">
      <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
        <CardTitle className="text-primary text-lg flex items-center gap-2">
          <Info className="h-5 w-5" /> VISÃO GERAL
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div>
          <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">
            PARA QUE SERVE ESTE SISTEMA?
          </p>
          <p className="text-sm font-semibold leading-relaxed text-slate-800 line-clamp-3 uppercase">
            {item.description || item.instructions || 'NENHUMA DESCRIÇÃO FORNECIDA.'}
          </p>
        </div>
        <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border">
          <Users className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">QUEM DEVE USAR?</p>
            <p className="text-sm font-bold text-indigo-900 mt-0.5 uppercase">
              {item.target_users || 'TODOS'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border">
          <Clock className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">FREQUÊNCIA DE USO</p>
            <p className="text-sm font-bold text-emerald-900 mt-0.5 uppercase">
              {item.frequency || 'DIÁRIO'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
