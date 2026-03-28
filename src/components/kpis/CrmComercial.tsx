import { useState, useMemo, useEffect } from 'react'
import { Users, Plus, Target, TrendingUp, DollarSign, Percent, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
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
}

interface CrmComercialProps {
  cargoId: string
}

export function CrmComercial({ cargoId }: CrmComercialProps) {
  const { toast } = useToast()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [configId, setConfigId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<Partial<Orcamento>>({})
  const [filter, setFilter] = useState<'todos' | 'oportunidades' | 'vendas'>('todos')

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
        .single()

      if (!config) {
        const { data: newConfig, error } = await supabase
          .from('kpis_config')
          .insert({ cargo_id: cargoId, nome_kpi: 'CRM_COMERCIAL', unidade: 'module' })
          .select()
          .single()
        if (error) throw error
        config = newConfig
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
      }))
      setOrcamentos(parsed)
    } catch (e) {
      console.error('Erro ao buscar dados do CRM:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!form.paciente || !form.valor || !form.data || !configId) return

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
    const current = orcamentos.find((o) => o.id === id)
    if (!current) return

    const newVendido = !current.vendido
    try {
      const { error } = await supabase
        .from('kpis_dados')
        .update({
          valores_json: { paciente: current.paciente, valor: current.valor, vendido: newVendido },
        })
        .eq('id', id)

      if (error) throw error

      setOrcamentos(orcamentos.map((o) => (o.id === id ? { ...o, vendido: newVendido } : o)))
    } catch (e) {
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' })
    }
  }

  const kpis = useMemo(() => {
    const totalOportunidades = orcamentos.length
    const valorTotalOportunidades = orcamentos.reduce((acc, curr) => acc + curr.valor, 0)
    const vendas = orcamentos.filter((o) => o.vendido)
    const totalVendas = vendas.length
    const valorTotalVendas = vendas.reduce((acc, curr) => acc + curr.valor, 0)

    const ticketMedioOportunidade =
      totalOportunidades > 0 ? valorTotalOportunidades / totalOportunidades : 0
    const conversao = totalOportunidades > 0 ? (totalVendas / totalOportunidades) * 100 : 0
    const ticketMedioVenda = totalVendas > 0 ? valorTotalVendas / totalVendas : 0

    return {
      oportunidadeVenda: { valor: valorTotalOportunidades, meta: 100000, qtd: totalOportunidades },
      ticketMedioOportunidade: { valor: ticketMedioOportunidade, meta: 5000 },
      conversao: { valor: conversao, meta: 30 },
      ticketMedioVenda: { valor: ticketMedioVenda, meta: 6000 },
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          'TICKET MÉDIO VENDA',
          kpis.ticketMedioVenda.valor,
          kpis.ticketMedioVenda.meta,
          'currency',
          <TrendingUp className="w-4 h-4" />,
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 border-slate-200 shadow-sm">
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
                    setForm({ data: new Date().toISOString().split('T')[0], vendido: false })
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
                    <Label className="font-bold text-xs text-slate-500 tracking-wider">DATA</Label>
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
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="vendido-switch"
                      checked={form.vendido || false}
                      onCheckedChange={(c) => setForm({ ...form, vendido: c })}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Label
                      htmlFor="vendido-switch"
                      className="font-bold text-xs text-slate-500 tracking-wider cursor-pointer"
                    >
                      JÁ FOI VENDIDO?
                    </Label>
                  </div>
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
                <TableHead className="font-black text-slate-500 text-xs text-right">
                  VALOR
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
                    <TableCell className="font-black text-nuvia-navy text-right text-xs whitespace-nowrap">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(orc.valor)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center">
                        <Switch
                          checked={orc.vendido}
                          onCheckedChange={() => toggleVendido(orc.id)}
                          className="data-[state=checked]:bg-green-500 scale-90"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
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
    </div>
  )
}
