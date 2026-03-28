import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, History } from 'lucide-react'
import type { KpiData } from './types'
import { formatKpiValue } from './utils'

export function KpiDetails({ kpi }: { kpi: KpiData }) {
  if (!kpi.history || kpi.history.length === 0) {
    return (
      <Card className="border-slate-200 mt-6 shadow-sm">
        <CardContent className="p-8 text-center text-slate-400 font-bold tracking-widest">
          NENHUM HISTÓRICO DISPONÍVEL PARA ESTE INDICADOR.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fade-in-up">
      <Card className="col-span-1 lg:col-span-2 border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-sm font-black text-nuvia-navy tracking-widest flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> EVOLUÇÃO MENSAL - {kpi.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-2 pl-0">
          <ChartContainer
            config={{ value: { label: 'Valor', color: 'hsl(var(--primary))' } }}
            className="h-[280px] w-full"
          >
            <LineChart data={kpi.history} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                tickFormatter={(value) => formatKpiValue(value, kpi.format)}
                dx={-10}
                width={80}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-value)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-sm font-black text-nuvia-navy tracking-widest flex items-center gap-2">
            <History className="h-4 w-4 text-primary" /> HISTÓRICO
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-xs">PERÍODO</TableHead>
                <TableHead className="font-black text-xs text-right">VALOR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...kpi.history].reverse().map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-bold text-slate-600">{item.period}</TableCell>
                  <TableCell className="text-right font-black text-nuvia-navy">
                    {formatKpiValue(item.value, kpi.format)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
