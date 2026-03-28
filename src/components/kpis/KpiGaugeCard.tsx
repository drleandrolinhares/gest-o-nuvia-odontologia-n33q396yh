import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Edit2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KpiData } from './types'
import { formatKpiValue, getKpiProgress, isKpiMet } from './utils'

interface Props {
  kpi: KpiData
  isActive: boolean
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
}

export function KpiGaugeCard({ kpi, isActive, onClick, onEdit, onDelete }: Props) {
  const progress = getKpiProgress(kpi.current, kpi.target, kpi.invert)
  const isMet = isKpiMet(kpi.current, kpi.target, kpi.invert)

  const gaugeData = [
    { name: 'Atual', value: progress },
    { name: 'Faltante', value: 100 - progress },
  ]

  return (
    <Card
      className={cn(
        'border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer',
        isActive ? 'ring-2 ring-primary border-transparent' : '',
      )}
      onClick={onClick}
    >
      <div
        className={cn('absolute top-0 left-0 w-1 h-full', isMet ? 'bg-green-500' : 'bg-primary')}
      />
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 pr-2">
            <CardTitle
              className="text-sm font-black text-nuvia-navy uppercase line-clamp-2"
              title={kpi.name}
            >
              {kpi.name}
            </CardTitle>
            <Badge
              variant="secondary"
              className={cn(
                'mt-2 text-[10px] font-bold',
                isMet ? 'bg-green-100 text-green-800' : 'bg-primary/10 text-primary',
              )}
            >
              {isMet ? (
                <CheckCircle2 className="w-3 h-3 mr-1" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1" />
              )}
              {isMet ? 'ATINGIDO' : 'PENDENTE'}
            </Badge>
          </div>
          <div className="flex flex-col gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-slate-100 text-slate-500 hover:text-nuvia-navy hover:bg-slate-200"
              onClick={onEdit}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-center justify-center relative h-[100px] w-full">
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                stroke="none"
                dataKey="value"
              >
                <Cell fill={isMet ? '#22c55e' : 'hsl(var(--primary))'} />
                <Cell fill="#f1f5f9" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-2 flex flex-col items-center">
            <span className="text-2xl font-black text-nuvia-navy leading-none">
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="flex justify-between items-end mt-4 text-xs">
          <div>
            <span className="text-slate-400 block font-bold">ATUAL</span>
            <span className="font-black text-nuvia-navy">
              {formatKpiValue(kpi.current, kpi.format)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block font-bold">META</span>
            <span className="font-black text-slate-600">
              {formatKpiValue(kpi.target, kpi.format)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
