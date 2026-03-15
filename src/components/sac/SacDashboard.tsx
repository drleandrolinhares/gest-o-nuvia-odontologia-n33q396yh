import { useMemo } from 'react'
import useAppStore from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquareWarning, Lightbulb, Activity, Clock } from 'lucide-react'

export function SacDashboard() {
  const { sacRecords } = useAppStore()

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthRecords = useMemo(() => {
    return sacRecords.filter((r) => {
      const d = new Date(r.received_at)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
  }, [sacRecords, currentMonth, currentYear])

  const stats = useMemo(() => {
    const reclamacoes = monthRecords.filter((r) => r.type === 'RECLAMAÇÃO').length
    const sugestoes = monthRecords.filter((r) => r.type === 'SUGESTÃO').length
    const total = monthRecords.length

    const oportunidade = monthRecords.filter((r) => r.status === 'OPORTUNIDADE DE SOLUÇÃO').length
    const recebido = monthRecords.filter((r) => r.status === 'RECEBIDO').length
    const tratando = monthRecords.filter((r) => r.status === 'SENDO TRATADO').length
    const resolvido = monthRecords.filter((r) => r.status === 'RESOLVIDO').length

    const pctOportunidade = total > 0 ? Math.round((oportunidade / total) * 100) : 0
    const pctRecebido = total > 0 ? Math.round((recebido / total) * 100) : 0
    const pctTratando = total > 0 ? Math.round((tratando / total) * 100) : 0
    const pctResolvido = total > 0 ? Math.round((resolvido / total) * 100) : 0

    const resolvedRecords = monthRecords.filter((r) => r.status === 'RESOLVIDO' && r.solved_at)
    let avgHours = 0
    if (resolvedRecords.length > 0) {
      const totalMs = resolvedRecords.reduce((acc, curr) => {
        return acc + (new Date(curr.solved_at!).getTime() - new Date(curr.received_at).getTime())
      }, 0)
      avgHours = totalMs / resolvedRecords.length / (1000 * 60 * 60)
    }

    return {
      reclamacoes,
      sugestoes,
      total,
      pctOportunidade,
      pctRecebido,
      pctTratando,
      pctResolvido,
      avgHours,
    }
  }, [monthRecords])

  const formatAvgTime = (hours: number) => {
    if (hours === 0) return 'N/A'
    if (hours < 24) return `${hours.toFixed(1)} HORAS`
    const days = hours / 24
    return `${days.toFixed(1)} DIAS`
  }

  const monthNames = [
    'JANEIRO',
    'FEVEREIRO',
    'MARÇO',
    'ABRIL',
    'MAIO',
    'JUNHO',
    'JULHO',
    'AGOSTO',
    'SETEMBRO',
    'OUTUBRO',
    'NOVEMBRO',
    'DEZEMBRO',
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-black tracking-widest text-[#0A192F]">
          MÉTRICAS DE <span className="text-[#D4AF37]">{monthNames[currentMonth]}</span>
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-[#0A192F] shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground tracking-wider mb-1">
                TOTAL OPORTUNIDADES
              </p>
              <div className="text-3xl font-extrabold text-[#0A192F]">{stats.total}</div>
            </div>
            <div className="w-12 h-12 bg-[#0A192F]/10 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-[#0A192F]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground tracking-wider mb-1">
                RECLAMAÇÕES
              </p>
              <div className="text-3xl font-extrabold text-red-600">{stats.reclamacoes}</div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <MessageSquareWarning className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground tracking-wider mb-1">
                SUGESTÕES
              </p>
              <div className="text-3xl font-extrabold text-blue-600">{stats.sugestoes}</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#D4AF37] shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground tracking-wider mb-1">
                TEMPO MÉDIO (RES.)
              </p>
              <div className="text-xl font-extrabold text-[#D4AF37]">
                {formatAvgTime(stats.avgHours)}
              </div>
            </div>
            <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-[#B3932D]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-600 shrink-0"></div>
              <p className="text-xs font-bold text-slate-700">OPORTUNIDADE DE SOLUÇÃO</p>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-red-600">{stats.pctOportunidade}%</span>
              <span className="text-[10px] font-bold text-muted-foreground mb-1">DO TOTAL</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-600 shrink-0"></div>
              <p className="text-xs font-bold text-slate-700">RECEBIDO</p>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-blue-600">{stats.pctRecebido}%</span>
              <span className="text-[10px] font-bold text-muted-foreground mb-1">DO TOTAL</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></div>
              <p className="text-xs font-bold text-slate-700">SENDO TRATADO</p>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-amber-600">{stats.pctTratando}%</span>
              <span className="text-[10px] font-bold text-muted-foreground mb-1">DO TOTAL</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-600 shrink-0"></div>
              <p className="text-xs font-bold text-slate-700">RESOLVIDO</p>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-emerald-600">{stats.pctResolvido}%</span>
              <span className="text-[10px] font-bold text-muted-foreground mb-1">DO TOTAL</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
