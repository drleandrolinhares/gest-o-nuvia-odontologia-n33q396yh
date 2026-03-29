import { useState, useMemo, useEffect } from 'react'
import { Users, Target, TrendingUp, DollarSign, Percent, Loader2, Building2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export interface Orcamento {
  id: string
  data: string
  paciente: string
  valor: number
  vendido: boolean
  dentista_id?: string
  crc_comercial_id?: string
  valor_venda?: number
  valor_entrada?: number
  percentual_entrada?: number
  origem_venda?: 'AVALIACAO' | 'COMERCIAL'
}

interface CrmComercialProps {
  cargoId: string
  colaboradorId?: string
  podeEditar?: boolean
}

export function CrmComercial({ cargoId, colaboradorId }: CrmComercialProps) {
  const { user } = useAuth()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [loading, setLoading] = useState(true)

  const [indGoals, setIndGoals] = useState({
    vendasTotais: 0,
    ticketMedio: 0,
    conversao: 0,
    mediaEntrada: 0,
  })
  const [compGoals, setCompGoals] = useState({
    vendasTotais: 0,
    ticketMedio: 0,
    conversao: 0,
    mediaEntrada: 0,
  })

  useEffect(() => {
    if (cargoId) fetchData()
  }, [cargoId, colaboradorId])

  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Get or Create Config
      let { data: config } = await supabase
        .from('kpis_config')
        .select('*')
        .eq('cargo_id', cargoId)
        .eq('nome_kpi', 'CRM_COMERCIAL')
        .maybeSingle()

      if (!config && cargoId && !cargoId.startsWith('mock-')) {
        const { data: newConfig, error } = await supabase
          .from('kpis_config')
          .insert({ cargo_id: cargoId, nome_kpi: 'CRM_COMERCIAL', unidade: 'module' })
          .select()
          .single()
        if (error) throw error
        config = newConfig

        await supabase.from('kpis_permissoes').upsert(
          {
            cargo_id: cargoId,
            kpi_id: config.id,
            pode_visualizar: true,
            pode_editar: true,
          },
          { onConflict: 'cargo_id,kpi_id' },
        )
      }

      // Fetch Goals
      const now = new Date()
      const mes = now.getMonth() + 1
      const ano = now.getFullYear()
      const targetId = colaboradorId || user?.id

      const [cgRes, igRes] = await Promise.all([
        supabase
          .from('metas_comerciais_empresa')
          .select('*')
          .eq('mes', mes)
          .eq('ano', ano)
          .maybeSingle(),
        targetId && !targetId.startsWith('mock-')
          ? supabase
              .from('metas_comerciais_individual')
              .select('*')
              .eq('mes', mes)
              .eq('ano', ano)
              .eq('usuario_id', targetId)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ])

      setCompGoals({
        vendasTotais: cgRes.data?.meta_vendas || 200000,
        ticketMedio: cgRes.data?.meta_ticket || 6000,
        conversao: cgRes.data?.meta_conversao || 35,
        mediaEntrada: cgRes.data?.meta_entrada || 40,
      })

      setIndGoals({
        vendasTotais: igRes.data?.meta_vendas || 50000,
        ticketMedio: igRes.data?.meta_ticket || 5000,
        conversao: igRes.data?.meta_conversao || 30,
        mediaEntrada: igRes.data?.meta_entrada || 30,
      })

      // 2. Fetch Data
      const { data: dados, error: dadosErr } = await supabase
        .from('vendas' as any)
        .select('*')
        .order('data_venda', { ascending: false })

      if (dadosErr) throw dadosErr

      const parsed = (dados || []).map((d: any) => ({
        id: d.id,
        data: d.data_venda,
        paciente: d.paciente || '',
        valor: d.valor_orcamento || 0,
        vendido: d.status === 'VENDIDO',
        dentista_id: d.dentista_id || '',
        crc_comercial_id: d.crc_comercial_id || '',
        valor_venda: d.valor_venda,
        valor_entrada: d.valor_entrada,
        percentual_entrada: d.percentual_entrada,
        origem_venda: d.tipo_venda,
      }))
      setOrcamentos(parsed)
    } catch (e) {
      console.error('Erro ao buscar dados do CRM:', e)
    } finally {
      setLoading(false)
    }
  }

  const targetUserId = colaboradorId || user?.id

  const currentMonthOrcamentos = useMemo(() => {
    if (!orcamentos || !Array.isArray(orcamentos)) return []
    const now = new Date()
    const mesStr = String(now.getMonth() + 1).padStart(2, '0')
    const anoStr = String(now.getFullYear())
    const prefix = `${anoStr}-${mesStr}`
    return orcamentos.filter((o) => o?.data?.startsWith(prefix))
  }, [orcamentos])

  const individualOrcamentos = useMemo(() => {
    if (!currentMonthOrcamentos || !Array.isArray(currentMonthOrcamentos)) return []
    if (!targetUserId) return []
    return currentMonthOrcamentos.filter((o) => o?.crc_comercial_id === targetUserId)
  }, [currentMonthOrcamentos, targetUserId])

  const companyOrcamentos = currentMonthOrcamentos || []

  const calculateKpis = (data: Orcamento[]) => {
    if (!data || !Array.isArray(data)) {
      return { vendasTotais: 0, ticketMedio: 0, conversao: 0, mediaEntrada: 0 }
    }
    const totalOportunidades = data.length
    const valorTotalOportunidades = data.reduce((acc, curr) => acc + (curr?.valor || 0), 0)
    const vendas = data.filter((o) => o?.vendido)
    const totalVendas = vendas.length
    const valorTotalVendas = vendas.reduce(
      (acc, curr) => acc + (curr?.valor_venda || curr?.valor || 0),
      0,
    )

    const totalPercentualEntrada = vendas.reduce(
      (acc, curr) => acc + (curr?.percentual_entrada || 0),
      0,
    )
    const mediaEntrada = totalVendas > 0 ? totalPercentualEntrada / totalVendas : 0

    const ticketMedioOportunidade =
      totalOportunidades > 0 ? valorTotalOportunidades / totalOportunidades : 0
    const conversao = totalOportunidades > 0 ? (totalVendas / totalOportunidades) * 100 : 0
    const ticketMedioVenda = totalVendas > 0 ? valorTotalVendas / totalVendas : 0

    return {
      vendasTotais: valorTotalVendas,
      ticketMedio: ticketMedioVenda,
      conversao,
      mediaEntrada,
    }
  }

  const indKpis = calculateKpis(individualOrcamentos)
  const compKpis = calculateKpis(companyOrcamentos)

  const userAllOrcamentos = useMemo(() => {
    if (!orcamentos || !Array.isArray(orcamentos)) return []
    if (!targetUserId) return []
    return orcamentos.filter((o) => o?.crc_comercial_id === targetUserId)
  }, [orcamentos, targetUserId])

  const monthlyData = useMemo(() => {
    if (!userAllOrcamentos || !Array.isArray(userAllOrcamentos)) return []
    const data = userAllOrcamentos.reduce(
      (acc, curr) => {
        if (!curr || !curr.data) return acc
        const month = new Date(curr.data + 'T00:00:00')
          .toLocaleString('pt-BR', { month: 'short' })
          .toUpperCase()
        if (!acc[month]) acc[month] = { name: month, oportunidades: 0, vendas: 0 }
        acc[month].oportunidades += curr.valor || 0
        if (curr.vendido) acc[month].vendas += curr.valor_venda || curr.valor || 0
        return acc
      },
      {} as Record<string, any>,
    )
    return Object.values(data)
  }, [userAllOrcamentos])

  const getProgressColor = (percent: number) => {
    if (percent < 80) return '#ef4444'
    if (percent < 100) return '#eab308'
    return '#22c55e'
  }

  const renderSimpleCard = (
    label: string,
    value: number,
    format: 'currency' | 'percentage',
    icon: React.ReactNode,
  ) => {
    const formattedValue =
      format === 'currency'
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
        : `${value.toFixed(1)}%`

    return (
      <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
        <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between">
          <CardTitle className="text-[11px] font-black text-slate-500 tracking-widest uppercase">
            {label}
          </CardTitle>
          <div className="text-primary bg-primary/10 p-2 rounded-lg shrink-0">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-black text-nuvia-navy">{formattedValue}</div>
        </CardContent>
      </Card>
    )
  }

  const renderGauge = (
    label: string,
    value: number,
    meta: number,
    format: 'currency' | 'percentage',
  ) => {
    const percentage = meta > 0 ? (value / meta) * 100 : 0
    const displayPercentage = Math.min(Math.round(percentage), 100)
    const color = getProgressColor(percentage)
    const data = [
      { name: 'Atual', value: displayPercentage },
      { name: 'Restante', value: Math.max(100 - displayPercentage, 0) },
    ]

    const formattedValue =
      format === 'currency'
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
        : `${value.toFixed(1)}%`

    const formattedMeta =
      format === 'currency'
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(meta)
        : `${meta.toFixed(1)}%`

    return (
      <Card className="border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }} />
        <CardHeader className="pb-0 pt-4 flex flex-row items-center justify-between">
          <CardTitle
            className="text-[11px] font-black text-nuvia-navy tracking-widest uppercase truncate pr-2"
            title={label}
          >
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-4">
          <div className="flex flex-col items-center justify-center relative h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={50}
                  outerRadius={70}
                  stroke="none"
                  dataKey="value"
                >
                  <Cell fill={color} />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 flex flex-col items-center">
              <span className="text-xl font-black leading-none" style={{ color }}>
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">REALIZADO</span>
              <span className="text-xs sm:text-sm font-black text-nuvia-navy">
                {formattedValue}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block">META</span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-600">
                {formattedMeta}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartConfig = {
    vendas: { label: 'Vendas (R$)', color: 'hsl(var(--primary))' },
    oportunidades: { label: 'Oportunidades (R$)', color: '#94a3b8' },
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 mt-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-8 animate-fade-in-up">
      <div>
        <h3 className="text-sm font-black text-nuvia-navy tracking-widest flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" /> KPIs INDIVIDUAIS (ATUAL)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderSimpleCard(
            'VALOR VENDIDO',
            indKpis.vendasTotais,
            'currency',
            <TrendingUp className="w-4 h-4" />,
          )}
          {renderSimpleCard(
            'TICKET MÉDIO',
            indKpis.ticketMedio,
            'currency',
            <DollarSign className="w-4 h-4" />,
          )}
          {renderSimpleCard(
            'CONVERSÃO',
            indKpis.conversao,
            'percentage',
            <Percent className="w-4 h-4" />,
          )}
          {renderSimpleCard(
            'ENTRADA MÉDIA',
            indKpis.mediaEntrada,
            'percentage',
            <Percent className="w-4 h-4" />,
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-nuvia-navy tracking-widest flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-primary" /> METAS INDIVIDUAIS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderGauge('META DE VENDAS', indKpis.vendasTotais, indGoals.vendasTotais, 'currency')}
          {renderGauge('META DE TICKET', indKpis.ticketMedio, indGoals.ticketMedio, 'currency')}
          {renderGauge('META DE CONVERSÃO', indKpis.conversao, indGoals.conversao, 'percentage')}
          {renderGauge(
            'META DE ENTRADA',
            indKpis.mediaEntrada,
            indGoals.mediaEntrada,
            'percentage',
          )}
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="text-sm font-black text-nuvia-navy tracking-widest flex items-center gap-2 mb-4">
          <Building2 className="h-4 w-4 text-primary" /> METAS DA EMPRESA (CONSOLIDADO)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderGauge('META DE VENDAS', compKpis.vendasTotais, compGoals.vendasTotais, 'currency')}
          {renderGauge('META DE TICKET', compKpis.ticketMedio, compGoals.ticketMedio, 'currency')}
          {renderGauge('META DE CONVERSÃO', compKpis.conversao, compGoals.conversao, 'percentage')}
          {renderGauge(
            'META DE ENTRADA',
            compKpis.mediaEntrada,
            compGoals.mediaEntrada,
            'percentage',
          )}
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm w-full">
        <CardHeader>
          <CardTitle className="text-sm font-black text-nuvia-navy tracking-widest flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> EVOLUÇÃO MENSAL (INDIVIDUAL)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {monthlyData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }} />
                <Bar
                  dataKey="oportunidades"
                  fill="var(--color-oportunidades)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="vendas"
                  fill="var(--color-vendas)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
              SEM DADOS PARA EXIBIR
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
