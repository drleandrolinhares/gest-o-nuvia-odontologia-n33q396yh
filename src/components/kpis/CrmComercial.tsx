import { useState, useMemo, useEffect } from 'react'
import {
  Users,
  Plus,
  Target,
  TrendingUp,
  DollarSign,
  Percent,
  Loader2,
  HelpCircle,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  podeEditar?: boolean
}

export function CrmComercial({ cargoId, podeEditar = true }: CrmComercialProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [configId, setConfigId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmVendaItem, setConfirmVendaItem] = useState<Orcamento | null>(null)
  const [form, setForm] = useState<Partial<Orcamento>>({})
  const [filter, setFilter] = useState<'todos' | 'oportunidades' | 'vendas'>('todos')
  const [dentistas, setDentistas] = useState<{ id: string; nome: string }[]>([])
  const [crcComercialNome, setCrcComercialNome] = useState('')

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('id, nome')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setCrcComercialNome(data.nome || user.email || '')
        })
    }

    const fetchDentistas = async () => {
      const { data: cargos } = await supabase
        .from('cargos')
        .select('id')
        .ilike('nome', '%dentista%')
      if (cargos && cargos.length > 0) {
        const ids = cargos.map((c) => c.id)
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, nome')
          .in('cargo_id', ids)
        if (profs && profs.length > 0) {
          setDentistas(profs.map((p) => ({ id: p.id, nome: p.nome || '' })))
          return
        }
      }
      setDentistas([
        { id: 'mock-1', nome: 'Dra. Ana Silva' },
        { id: 'mock-2', nome: 'Dr. Carlos Mendes' },
      ])
    }
    fetchDentistas()
  }, [user])

  useEffect(() => {
    if (cargoId) fetchData()
  }, [cargoId])

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

      if (!config) {
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
      setConfigId(config.id)

      // 2. Fetch Data
      const { data: dados, error: dadosErr } = await supabase
        .from('kpis_dados')
        .select('*')
        .eq('kpi_id', config.id)
        .order('data', { ascending: false })

      if (dadosErr) throw dadosErr

      const parsed = (dados || []).map((d) => ({
        id: d.id,
        data: d.data,
        paciente: (d.valores_json as any)?.paciente || '',
        valor: (d.valores_json as any)?.valor || 0,
        vendido: (d.valores_json as any)?.vendido || false,
        dentista_id: (d.valores_json as any)?.dentista_id || '',
        crc_comercial_id: (d.valores_json as any)?.crc_comercial_id || '',
        valor_venda: (d.valores_json as any)?.valor_venda,
        valor_entrada: (d.valores_json as any)?.valor_entrada,
        percentual_entrada: (d.valores_json as any)?.percentual_entrada,
        origem_venda: (d.valores_json as any)?.origem_venda,
      }))
      setOrcamentos(parsed)
    } catch (e) {
      console.error('Erro ao buscar dados do CRM:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!form.paciente || !form.valor || !form.data || !configId || !podeEditar) return

    try {
      const { data, error } = await supabase
        .from('kpis_dados')
        .insert({
          kpi_id: configId,
          cargo_id: cargoId,
          data: form.data,
          valores_json: {
            paciente: form.paciente,
            valor: form.valor,
            vendido: form.vendido || false,
            dentista_id: form.dentista_id,
            crc_comercial_id: form.crc_comercial_id,
            valor_venda: form.vendido ? form.valor_venda : undefined,
            valor_entrada: form.vendido ? form.valor_entrada : undefined,
            percentual_entrada: form.vendido ? form.percentual_entrada : undefined,
            origem_venda: form.vendido ? form.origem_venda : undefined,
          },
        })
        .select()
        .single()

      if (error) throw error

      const novo: Orcamento = {
        id: data.id,
        data: data.data,
        paciente: form.paciente,
        valor: form.valor,
        vendido: form.vendido || false,
        dentista_id: form.dentista_id,
        crc_comercial_id: form.crc_comercial_id,
        valor_venda: form.vendido ? form.valor_venda : undefined,
        valor_entrada: form.vendido ? form.valor_entrada : undefined,
        percentual_entrada: form.vendido ? form.percentual_entrada : undefined,
        origem_venda: form.vendido ? form.origem_venda : undefined,
      }

      setOrcamentos([novo, ...orcamentos])
      setIsModalOpen(false)
      setForm({})
      toast({ title: 'Orçamento lançado com sucesso!' })
    } catch (e) {
      toast({ title: 'Erro ao lançar orçamento', variant: 'destructive' })
    }
  }

  const toggleVendido = async (id: string) => {
    if (!podeEditar) return
    const current = orcamentos.find((o) => o.id === id)
    if (!current) return

    if (!current.vendido) {
      setConfirmVendaItem(current)
      setForm({
        valor_venda: current.valor,
        valor_entrada: 0,
        percentual_entrada: 0,
        origem_venda: 'COMERCIAL',
      })
      return
    }

    try {
      const { error } = await supabase
        .from('kpis_dados')
        .update({
          valores_json: {
            paciente: current.paciente,
            valor: current.valor,
            vendido: false,
            dentista_id: current.dentista_id,
            crc_comercial_id: current.crc_comercial_id,
          },
        })
        .eq('id', id)

      if (error) throw error

      setOrcamentos(
        orcamentos.map((o) =>
          o.id === id
            ? {
                ...o,
                vendido: false,
                valor_venda: undefined,
                valor_entrada: undefined,
                percentual_entrada: undefined,
                origem_venda: undefined,
              }
            : o,
        ),
      )
    } catch (e) {
      toast({ title: 'Erro ao reverter status', variant: 'destructive' })
    }
  }

  const handleConfirmVendaSubmit = async () => {
    if (!confirmVendaItem || !configId || !podeEditar) return

    try {
      const { error } = await supabase
        .from('kpis_dados')
        .update({
          valores_json: {
            paciente: confirmVendaItem.paciente,
            valor: confirmVendaItem.valor,
            vendido: true,
            dentista_id: confirmVendaItem.dentista_id,
            crc_comercial_id: confirmVendaItem.crc_comercial_id,
            valor_venda: form.valor_venda,
            valor_entrada: form.valor_entrada,
            percentual_entrada: form.percentual_entrada,
            origem_venda: form.origem_venda,
          },
        })
        .eq('id', confirmVendaItem.id)

      if (error) throw error

      setOrcamentos(
        orcamentos.map((o) =>
          o.id === confirmVendaItem.id
            ? {
                ...o,
                vendido: true,
                valor_venda: form.valor_venda,
                valor_entrada: form.valor_entrada,
                percentual_entrada: form.percentual_entrada,
                origem_venda: form.origem_venda,
              }
            : o,
        ),
      )
      setConfirmVendaItem(null)
      setForm({})
      toast({ title: 'Venda confirmada com sucesso!' })
    } catch (e) {
      toast({ title: 'Erro ao confirmar venda', variant: 'destructive' })
    }
  }

  const kpis = useMemo(() => {
    const totalOportunidades = orcamentos.length
    const valorTotalOportunidades = orcamentos.reduce((acc, curr) => acc + curr.valor, 0)
    const vendas = orcamentos.filter((o) => o.vendido)
    const totalVendas = vendas.length
    const valorTotalVendas = vendas.reduce((acc, curr) => acc + (curr.valor_venda || curr.valor), 0)

    const totalPercentualEntrada = vendas.reduce(
      (acc, curr) => acc + (curr.percentual_entrada || 0),
      0,
    )
    const mediaEntrada = totalVendas > 0 ? totalPercentualEntrada / totalVendas : 0

    const ticketMedioOportunidade =
      totalOportunidades > 0 ? valorTotalOportunidades / totalOportunidades : 0
    const conversao = totalOportunidades > 0 ? (totalVendas / totalOportunidades) * 100 : 0
    const ticketMedioVenda = totalVendas > 0 ? valorTotalVendas / totalVendas : 0

    return {
      oportunidadeVenda: { valor: valorTotalOportunidades, meta: 100000, qtd: totalOportunidades },
      ticketMedioOportunidade: { valor: ticketMedioOportunidade, meta: 5000 },
      conversao: { valor: conversao, meta: 30 },
      ticketMedioVenda: { valor: ticketMedioVenda, meta: 6000 },
      valorTotalVendido: { valor: valorTotalVendas, meta: 80000 },
      mediaEntrada: { valor: mediaEntrada, meta: 30 },
    }
  }, [orcamentos])

  const monthlyData = useMemo(() => {
    const data = orcamentos.reduce(
      (acc, curr) => {
        const month = new Date(curr.data + 'T00:00:00')
          .toLocaleString('pt-BR', { month: 'short' })
          .toUpperCase()
        if (!acc[month]) acc[month] = { name: month, oportunidades: 0, vendas: 0 }
        acc[month].oportunidades += curr.valor
        if (curr.vendido) acc[month].vendas += curr.valor
        return acc
      },
      {} as Record<string, any>,
    )
    return Object.values(data)
  }, [orcamentos])

  const filteredOrcamentos = useMemo(() => {
    if (filter === 'oportunidades') return orcamentos.filter((o) => !o.vendido)
    if (filter === 'vendas') return orcamentos.filter((o) => o.vendido)
    return orcamentos
  }, [orcamentos, filter])

  const getColor = (val: number, format: 'currency' | 'percentage') => {
    if (format === 'percentage') {
      if (val < 15) return '#ef4444'
      if (val < 30) return '#eab308'
      return '#22c55e'
    }
    if (val < 2500) return '#ef4444'
    if (val < 10000) return '#eab308'
    return '#22c55e'
  }

  const renderGauge = (
    label: string,
    value: number,
    meta: number,
    format: 'currency' | 'percentage',
    icon: React.ReactNode,
  ) => {
    const percentage = meta > 0 ? Math.min(Math.round((value / meta) * 100), 100) : 0
    const color = getColor(value, format)
    const data = [
      { name: 'Atual', value: percentage },
      { name: 'Restante', value: 100 - percentage },
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
      <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }} />
        <CardHeader className="pb-0 pt-4 flex flex-row items-center justify-between">
          <CardTitle
            className="text-[11px] font-black text-nuvia-navy tracking-widest uppercase truncate pr-2"
            title={label}
          >
            {label}
          </CardTitle>
          <div className="text-slate-400 bg-slate-50 p-1.5 rounded-md shrink-0">{icon}</div>
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
                {percentage}%
              </span>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">ATUAL</span>
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
    <div className="mt-8 space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {renderGauge(
          'OPORTUNIDADE DE VENDA',
          kpis.oportunidadeVenda.valor,
          kpis.oportunidadeVenda.meta,
          'currency',
          <Target className="w-4 h-4" />,
        )}
        {renderGauge(
          'TICKET MÉDIO OPORT.',
          kpis.ticketMedioOportunidade.valor,
          kpis.ticketMedioOportunidade.meta,
          'currency',
          <DollarSign className="w-4 h-4" />,
        )}
        {renderGauge(
          'CONVERSÃO DE VENDA',
          kpis.conversao.valor,
          kpis.conversao.meta,
          'percentage',
          <Percent className="w-4 h-4" />,
        )}
        {renderGauge(
          'VALOR TOTAL VENDIDO',
          kpis.valorTotalVendido.valor,
          kpis.valorTotalVendido.meta,
          'currency',
          <TrendingUp className="w-4 h-4" />,
        )}
        {renderGauge(
          'TICKET MÉDIO VENDA',
          kpis.ticketMedioVenda.valor,
          kpis.ticketMedioVenda.meta,
          'currency',
          <DollarSign className="w-4 h-4" />,
        )}
        {renderGauge(
          '% ENTRADA MÉDIA',
          kpis.mediaEntrada.valor,
          kpis.mediaEntrada.meta,
          'percentage',
          <Percent className="w-4 h-4" />,
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className={`border-slate-200 shadow-sm ${podeEditar ? 'col-span-1 lg:col-span-2' : 'col-span-1 lg:col-span-3'}`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-black text-nuvia-navy tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> EVOLUÇÃO MENSAL
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

        {podeEditar && (
          <Card className="border-slate-200 shadow-sm flex flex-col justify-center p-6 bg-nuvia-navy/5">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-black text-nuvia-navy tracking-widest">
                  LANÇAR ORÇAMENTO
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1">
                  Cadastre novas oportunidades para atualizar indicadores.
                </p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() =>
                      setForm({
                        data: new Date().toISOString().split('T')[0],
                        vendido: false,
                        crc_comercial_id: user?.id,
                      })
                    }
                    className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black w-full shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" /> NOVO ORÇAMENTO
                  </Button>
                </DialogTrigger>
                <DialogContent className="uppercase">
                  <DialogHeader>
                    <DialogTitle className="font-black text-nuvia-navy tracking-widest">
                      LANÇAR ORÇAMENTO
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label className="font-bold text-xs text-slate-500 tracking-wider">
                        DATA
                      </Label>
                      <Input
                        type="date"
                        className="font-bold uppercase"
                        value={form.data || ''}
                        onChange={(e) => setForm({ ...form, data: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-bold text-xs text-slate-500 tracking-wider">
                        PACIENTE
                      </Label>
                      <Input
                        className="font-bold uppercase"
                        placeholder="NOME DO PACIENTE"
                        value={form.paciente || ''}
                        onChange={(e) => setForm({ ...form, paciente: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-bold text-xs text-slate-500 tracking-wider">
                        VALOR (R$)
                      </Label>
                      <Input
                        type="number"
                        className="font-bold uppercase"
                        placeholder="0,00"
                        value={form.valor ?? ''}
                        onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-bold text-xs text-slate-500 tracking-wider">
                        DENTISTA AVALIADOR
                      </Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-bold uppercase"
                        value={form.dentista_id || ''}
                        onChange={(e) => setForm({ ...form, dentista_id: e.target.value })}
                      >
                        <option value="" disabled>
                          SELECIONE O DENTISTA
                        </option>
                        {dentistas.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-bold text-xs text-slate-500 tracking-wider">
                        CRC COMERCIAL
                      </Label>
                      <Input
                        className="font-bold uppercase bg-slate-100"
                        value={crcComercialNome}
                        disabled
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="vendido-switch"
                        checked={form.vendido || false}
                        onCheckedChange={(c) =>
                          setForm({
                            ...form,
                            vendido: c,
                            valor_venda: c ? form.valor : undefined,
                            origem_venda: c ? 'AVALIACAO' : undefined,
                          })
                        }
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Label
                        htmlFor="vendido-switch"
                        className="font-bold text-xs text-slate-500 tracking-wider cursor-pointer"
                      >
                        JÁ FOI VENDIDO?
                      </Label>
                    </div>

                    {form.vendido && (
                      <div className="grid gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <div className="grid gap-2">
                          <Label className="font-bold text-[10px] text-slate-500 tracking-wider flex items-center gap-1">
                            ORIGEM DA VENDA
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3 h-3 text-slate-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs max-w-xs">
                                    <b>NA AVALIAÇÃO:</b> Comissão apenas para dentista.
                                    <br />
                                    <b>NO COMERCIAL:</b> Comissão para dentista + CRC.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={form.origem_venda === 'AVALIACAO' ? 'default' : 'outline'}
                              onClick={() => setForm({ ...form, origem_venda: 'AVALIACAO' })}
                              className={`flex-1 text-[9px] font-bold px-2 ${form.origem_venda === 'AVALIACAO' ? 'bg-primary text-white' : ''}`}
                            >
                              FECHADA NA AVALIAÇÃO
                            </Button>
                            <Button
                              type="button"
                              variant={form.origem_venda === 'COMERCIAL' ? 'default' : 'outline'}
                              onClick={() => setForm({ ...form, origem_venda: 'COMERCIAL' })}
                              className={`flex-1 text-[9px] font-bold px-2 ${form.origem_venda === 'COMERCIAL' ? 'bg-primary text-white' : ''}`}
                            >
                              FECHADA NO COMERCIAL
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label className="font-bold text-[10px] text-slate-500 tracking-wider">
                              VALOR DA VENDA (R$)
                            </Label>
                            <Input
                              type="number"
                              className="h-8 text-xs font-bold"
                              value={form.valor_venda ?? form.valor ?? ''}
                              onChange={(e) => {
                                const v = Number(e.target.value)
                                const p = form.valor_entrada ? (form.valor_entrada / v) * 100 : 0
                                setForm({ ...form, valor_venda: v, percentual_entrada: p || 0 })
                              }}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label className="font-bold text-[10px] text-slate-500 tracking-wider">
                              ENTRADA (R$)
                            </Label>
                            <Input
                              type="number"
                              className="h-8 text-xs font-bold"
                              value={form.valor_entrada ?? ''}
                              onChange={(e) => {
                                const ent = Number(e.target.value)
                                const ven = form.valor_venda || form.valor || 1
                                const p = (ent / ven) * 100
                                setForm({ ...form, valor_entrada: ent, percentual_entrada: p })
                              }}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label className="font-bold text-[10px] text-slate-500 tracking-wider">
                            % DE ENTRADA
                          </Label>
                          <Input
                            type="number"
                            className="h-8 text-xs font-bold bg-slate-100"
                            value={form.percentual_entrada?.toFixed(2) ?? '0.00'}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      className="font-bold tracking-widest"
                      onClick={() => setIsModalOpen(false)}
                    >
                      CANCELAR
                    </Button>
                    <Button
                      className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest"
                      onClick={handleSave}
                    >
                      SALVAR
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
          <h3 className="text-sm font-black text-nuvia-navy tracking-widest flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> REGISTROS
          </h3>
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as any)}
            className="w-full sm:w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="todos" className="font-bold text-[10px]">
                TODOS
              </TabsTrigger>
              <TabsTrigger value="oportunidades" className="font-bold text-[10px]">
                OPORTUNIDADES
              </TabsTrigger>
              <TabsTrigger value="vendas" className="font-bold text-[10px]">
                VENDAS
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead className="font-black text-slate-500 text-xs">DATA</TableHead>
                <TableHead className="font-black text-slate-500 text-xs">PACIENTE</TableHead>
                <TableHead className="font-black text-slate-500 text-xs hidden sm:table-cell">
                  DENTISTA
                </TableHead>
                <TableHead className="font-black text-slate-500 text-xs text-right">
                  VALOR
                </TableHead>
                <TableHead className="font-black text-slate-500 text-xs text-right hidden md:table-cell">
                  % ENTR.
                </TableHead>
                <TableHead className="font-black text-slate-500 text-xs text-center w-32">
                  VENDIDO?
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrcamentos.length > 0 ? (
                filteredOrcamentos.map((orc) => (
                  <TableRow key={orc.id}>
                    <TableCell className="font-bold text-slate-600 text-xs whitespace-nowrap">
                      {new Date(orc.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-bold text-nuvia-navy uppercase text-xs">
                      {orc.paciente}
                    </TableCell>
                    <TableCell className="font-bold text-slate-500 uppercase text-xs hidden sm:table-cell">
                      {dentistas.find((d) => d.id === orc.dentista_id)?.nome || '-'}
                    </TableCell>
                    <TableCell className="font-black text-nuvia-navy text-right text-xs whitespace-nowrap">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(orc.vendido ? orc.valor_venda || orc.valor : orc.valor)}
                    </TableCell>
                    <TableCell className="font-bold text-slate-500 text-right text-xs hidden md:table-cell">
                      {orc.vendido ? `${(orc.percentual_entrada || 0).toFixed(1)}%` : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center">
                        <Switch
                          checked={orc.vendido}
                          onCheckedChange={() => toggleVendido(orc.id)}
                          disabled={!podeEditar}
                          className="data-[state=checked]:bg-green-500 scale-90"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center font-bold text-slate-400 text-xs"
                  >
                    NENHUM REGISTRO ENCONTRADO PARA ESTE FILTRO.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!confirmVendaItem} onOpenChange={(open) => !open && setConfirmVendaItem(null)}>
        <DialogContent className="uppercase">
          <DialogHeader>
            <DialogTitle className="font-black text-nuvia-navy tracking-widest">
              CONFIRMAR VENDA
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">PACIENTE</Label>
              <Input
                className="font-bold uppercase bg-slate-50"
                value={confirmVendaItem?.paciente || ''}
                disabled
              />
            </div>

            <div className="grid gap-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider flex items-center gap-1">
                ORIGEM DA VENDA
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs normal-case">
                        <b>NA AVALIAÇÃO:</b> Comissão apenas para dentista.
                        <br />
                        <b>NO COMERCIAL:</b> Comissão para dentista + CRC.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={form.origem_venda === 'AVALIACAO' ? 'default' : 'outline'}
                  onClick={() => setForm({ ...form, origem_venda: 'AVALIACAO' })}
                  className={`flex-1 text-[10px] font-bold ${form.origem_venda === 'AVALIACAO' ? 'bg-primary text-white' : ''}`}
                >
                  FECHADA NA AVALIAÇÃO
                </Button>
                <Button
                  type="button"
                  variant={form.origem_venda === 'COMERCIAL' ? 'default' : 'outline'}
                  onClick={() => setForm({ ...form, origem_venda: 'COMERCIAL' })}
                  className={`flex-1 text-[10px] font-bold ${form.origem_venda === 'COMERCIAL' ? 'bg-primary text-white' : ''}`}
                >
                  FECHADA NO COMERCIAL
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">
                  VALOR DA VENDA (R$)
                </Label>
                <Input
                  type="number"
                  value={form.valor_venda ?? ''}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    const p = form.valor_entrada ? (form.valor_entrada / v) * 100 : 0
                    setForm({ ...form, valor_venda: v, percentual_entrada: p || 0 })
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">
                  VALOR DA ENTRADA (R$)
                </Label>
                <Input
                  type="number"
                  value={form.valor_entrada ?? ''}
                  onChange={(e) => {
                    const ent = Number(e.target.value)
                    const ven = form.valor_venda || 1
                    const p = (ent / ven) * 100
                    setForm({ ...form, valor_entrada: ent, percentual_entrada: p })
                  }}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">
                % DE ENTRADA
              </Label>
              <Input
                type="number"
                value={form.percentual_entrada?.toFixed(2) ?? '0.00'}
                disabled
                className="bg-slate-50 font-bold"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="font-bold tracking-widest"
              onClick={() => setConfirmVendaItem(null)}
            >
              CANCELAR
            </Button>
            <Button
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest"
              onClick={handleConfirmVendaSubmit}
            >
              CONFIRMAR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
