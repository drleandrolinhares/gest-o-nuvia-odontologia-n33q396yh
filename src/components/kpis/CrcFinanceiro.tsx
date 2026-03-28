import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export interface FinanceiroEntry {
  id: string
  date: string
  type: 'receita_pagamento' | 'receita_boleto' | 'receita_cheque' | 'receita_cartao' | 'despesa'
  value: number
  observation?: string
}

const TYPE_LABELS: Record<string, string> = {
  receita_pagamento: 'RECEITA - PAGAMENTO',
  receita_boleto: 'RECEITA - BOLETO',
  receita_cheque: 'RECEITA - CHEQUE',
  receita_cartao: 'RECEITA - CARTÃO',
  despesa: 'DESPESA',
}

interface CrcFinanceiroProps {
  cargoId: string
  podeEditar?: boolean
}

export function CrcFinanceiro({ cargoId, podeEditar = true }: CrcFinanceiroProps) {
  const { toast } = useToast()
  const [entries, setEntries] = useState<FinanceiroEntry[]>([])
  const [configId, setConfigId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [type, setType] = useState<FinanceiroEntry['type']>('receita_pagamento')
  const [value, setValue] = useState('')
  const [observation, setObservation] = useState('')

  useEffect(() => {
    if (cargoId) fetchData()
  }, [cargoId])

  const fetchData = async () => {
    setLoading(true)
    try {
      let { data: config } = await supabase
        .from('kpis_config')
        .select('*')
        .eq('cargo_id', cargoId)
        .eq('nome_kpi', 'FINANCEIRO')
        .single()

      if (!config) {
        const { data: newConfig, error } = await supabase
          .from('kpis_config')
          .insert({ cargo_id: cargoId, nome_kpi: 'FINANCEIRO', unidade: 'module' })
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

      const { data: dados, error: dadosErr } = await supabase
        .from('kpis_dados')
        .select('*')
        .eq('kpi_id', config.id)
        .order('data', { ascending: false })

      if (dadosErr) throw dadosErr

      const parsed = (dados || []).map((d) => ({
        id: d.id,
        date: d.data,
        type: (d.valores_json as any)?.type || 'receita_pagamento',
        value: (d.valores_json as any)?.value || 0,
        observation: (d.valores_json as any)?.observation || '',
      }))
      setEntries(parsed)
    } catch (e) {
      console.error('Erro ao buscar dados Financeiros:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEntry = async () => {
    if (!value || isNaN(Number(value)) || !configId || !podeEditar) return

    try {
      const payload = {
        type,
        value: Number(value),
        observation,
      }

      const { data, error } = await supabase
        .from('kpis_dados')
        .insert({
          kpi_id: configId,
          cargo_id: cargoId,
          data: date,
          valores_json: payload,
        })
        .select()
        .single()

      if (error) throw error

      setEntries([
        {
          id: data.id,
          date: data.data,
          ...payload,
        },
        ...entries,
      ])
      setValue('')
      setObservation('')
      toast({ title: 'Lançamento registrado!' })
    } catch (e) {
      toast({ title: 'Erro ao registrar', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!podeEditar) return
    try {
      const { error } = await supabase.from('kpis_dados').delete().eq('id', id)
      if (error) throw error
      setEntries(entries.filter((e) => e.id !== id))
      toast({ title: 'Lançamento removido.' })
    } catch (e) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  const receita = entries
    .filter((e) => e.type.startsWith('receita_'))
    .reduce((acc, curr) => acc + curr.value, 0)
  const despesa = entries
    .filter((e) => e.type === 'despesa')
    .reduce((acc, curr) => acc + curr.value, 0)
  const lucro = receita - despesa
  const lucratividade = receita > 0 ? (lucro / receita) * 100 : 0

  const lucratividadeMet = lucratividade >= 20
  const receitaMet = receita > 1.2 * despesa
  const despesaMet = despesa <= 0.8 * receita

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  const formatPercent = (val: number) => `${val.toFixed(1)}%`

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 mt-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in uppercase">
      {podeEditar && (
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-black text-nuvia-navy flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              NOVO LANÇAMENTO FINANCEIRO
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">DATA</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">TIPO DE MOVIMENTAÇÃO</Label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger className="font-bold uppercase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="font-bold uppercase" value="receita_pagamento">
                      RECEITA - PAGAMENTO
                    </SelectItem>
                    <SelectItem className="font-bold uppercase" value="receita_boleto">
                      RECEITA - BOLETO
                    </SelectItem>
                    <SelectItem className="font-bold uppercase" value="receita_cheque">
                      RECEITA - CHEQUE
                    </SelectItem>
                    <SelectItem className="font-bold uppercase" value="receita_cartao">
                      RECEITA - CARTÃO
                    </SelectItem>
                    <SelectItem className="font-bold uppercase" value="despesa">
                      DESPESA
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">VALOR (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="font-bold"
                  placeholder="0,00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">OBSERVAÇÃO</Label>
                <Input
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="font-bold uppercase"
                  placeholder="EX: MENSALIDADE"
                />
              </div>
              <Button
                onClick={handleAddEntry}
                className="w-full bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" /> LANÇAR
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className={`border-l-4 shadow-sm ${receitaMet ? 'border-l-green-500' : 'border-l-red-500'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase">
              RECEITA TOTAL
            </CardTitle>
            <TrendingUp className={`w-4 h-4 ${receitaMet ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-black ${receitaMet ? 'text-green-600' : 'text-red-600'}`}
            >
              {formatCurrency(receita)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {receitaMet ? (
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              ) : (
                <AlertCircle className="w-3 h-3 text-red-500" />
              )}
              <p className="text-xs text-slate-400 font-semibold">Meta: &gt; 120% das Despesas</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 shadow-sm ${despesaMet ? 'border-l-green-500' : 'border-l-red-500'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase">DESPESAS</CardTitle>
            <TrendingDown className={`w-4 h-4 ${despesaMet ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-black ${despesaMet ? 'text-green-600' : 'text-red-600'}`}
            >
              {formatCurrency(despesa)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {despesaMet ? (
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              ) : (
                <AlertCircle className="w-3 h-3 text-red-500" />
              )}
              <p className="text-xs text-slate-400 font-semibold">Meta: &le; 80% da Receita</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 shadow-sm ${lucro > 0 ? 'border-l-green-500' : 'border-l-red-500'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase">LUCRO</CardTitle>
            <DollarSign className={`w-4 h-4 ${lucro > 0 ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-black ${lucro > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(lucro)}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-semibold flex items-center gap-1">
              <Activity className="w-3 h-3" /> Receita - Despesas
            </p>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 shadow-sm ${lucratividadeMet ? 'border-l-green-500' : 'border-l-red-500'}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase">
              LUCRATIVIDADE
            </CardTitle>
            <Activity
              className={`w-4 h-4 ${lucratividadeMet ? 'text-green-500' : 'text-red-500'}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-black ${lucratividadeMet ? 'text-green-600' : 'text-red-600'}`}
            >
              {formatPercent(lucratividade)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {lucratividadeMet ? (
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              ) : (
                <AlertCircle className="w-3 h-3 text-red-500" />
              )}
              <p className="text-xs text-slate-400 font-semibold">Meta: &ge; 20%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-lg font-black text-nuvia-navy uppercase flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> HISTÓRICO DE LANÇAMENTOS
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 p-0">
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="font-black text-slate-600 text-xs tracking-wider">
                    DATA
                  </TableHead>
                  <TableHead className="font-black text-slate-600 text-xs tracking-wider">
                    TIPO
                  </TableHead>
                  <TableHead className="font-black text-slate-600 text-xs tracking-wider">
                    OBSERVAÇÃO
                  </TableHead>
                  <TableHead className="font-black text-slate-600 text-xs tracking-wider text-right">
                    VALOR
                  </TableHead>
                  {podeEditar && <TableHead className="w-12"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={podeEditar ? 5 : 4}
                      className="text-center py-8 text-slate-400 font-bold"
                    >
                      NENHUM LANÇAMENTO REGISTRADO
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-bold text-slate-600">
                        {new Date(e.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={e.type === 'despesa' ? 'destructive' : 'default'}
                          className={`font-black text-[10px] ${
                            e.type !== 'despesa'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : ''
                          }`}
                        >
                          {TYPE_LABELS[e.type] || e.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-slate-600">
                        {e.observation || '-'}
                      </TableCell>
                      <TableCell
                        className={`font-black text-right whitespace-nowrap ${
                          e.type === 'despesa' ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {e.type === 'despesa' ? '-' : '+'} {formatCurrency(e.value)}
                      </TableCell>
                      {podeEditar && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(e.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
