import { useState, useEffect, useMemo } from 'react'
import {
  LayoutDashboard,
  Plus,
  Target,
  BarChart3,
  Filter,
  Loader2,
  CalendarIcon,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CrmComercial } from '@/components/kpis/CrmComercial'
import { CrcLeadAgendamento } from '@/components/kpis/CrcLeadAgendamento'
import { CrcFinanceiro } from '@/components/kpis/CrcFinanceiro'

export type KpiFormat = 'currency' | 'number' | 'percentage'

export interface KpiData {
  id: string
  name: string
  target: number
  current: number
  format: KpiFormat
  date?: string
  observacoes?: string
}

interface Cargo {
  id: string
  nome: string
}

export default function KPIs() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [cargos, setCargos] = useState<Cargo[]>([])
  const [selectedRole, setSelectedRole] = useState('')
  const [period, setPeriod] = useState('mes')

  const [generalKpis, setGeneralKpis] = useState<KpiData[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<KpiData>>({})

  const [loading, setLoading] = useState(true)
  const [loadingKpis, setLoadingKpis] = useState(false)

  const currentRoleName = cargos.find((r) => r.id === selectedRole)?.nome || ''

  const isCrcComercial = currentRoleName.toUpperCase().includes('COMERCIAL')
  const isCrcLeadAgendamento =
    currentRoleName.toUpperCase().includes('LEAD') ||
    currentRoleName.toUpperCase().includes('AGENDAMENTO')

  const isCrcFinanceiro = currentRoleName.toUpperCase().includes('FINANCEIRO')

  useEffect(() => {
    if (user) {
      fetchInitialData()
    }
  }, [user])

  useEffect(() => {
    if (selectedRole) {
      fetchKpis()
    }
  }, [selectedRole])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const { data: cargosRes } = await supabase.from('cargos').select('id, nome').order('nome')
      const roles = cargosRes || []
      setCargos(roles)

      if (roles.length > 0) {
        setSelectedRole(roles[0].id)
      }
    } catch (e) {
      console.error('Erro ao inicializar:', e)
    } finally {
      setLoading(false)
    }
  }

  const fetchKpis = async () => {
    setLoadingKpis(true)
    try {
      // Busca as configurações (kpis_cargos) que não são os módulos dinâmicos
      const { data: configs } = await supabase
        .from('kpis_config')
        .select('*')
        .eq('cargo_id', selectedRole)
        .neq('unidade', 'module') // Exclui módulos como CRC Lead, Financeiro

      if (!configs || configs.length === 0) {
        setGeneralKpis([])
        return
      }

      // Busca os últimos valores lançados para cada KPI
      const kpiDataPromises = configs.map(async (conf) => {
        const { data: latestData } = await supabase
          .from('kpis_dados')
          .select('*')
          .eq('kpi_id', conf.id)
          .order('data', { ascending: false })
          .limit(1)
          .single()

        return {
          id: conf.id,
          name: conf.nome_kpi,
          target: conf.meta_padrao,
          current: latestData?.valor_atual || 0,
          format: conf.unidade as KpiFormat,
          date: latestData?.data,
          observacoes: (conf.campos_json as any)?.observacoes || '',
        }
      })

      const results = await Promise.all(kpiDataPromises)
      setGeneralKpis(results)
    } catch (e) {
      console.error('Erro ao buscar KPIs:', e)
    } finally {
      setLoadingKpis(false)
    }
  }

  const handleOpenModal = () => {
    setFormData({
      name: '',
      current: 0,
      target: 0,
      format: 'number',
      date: new Date().toISOString().split('T')[0],
      observacoes: '',
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!selectedRole || !formData.name) return

    try {
      const { data: newConfig, error: configErr } = await supabase
        .from('kpis_config')
        .insert({
          cargo_id: selectedRole,
          nome_kpi: formData.name,
          unidade: formData.format || 'number',
          meta_padrao: formData.target || 0,
          campos_json: { observacoes: formData.observacoes },
        })
        .select()
        .single()

      if (configErr) throw configErr

      if (newConfig) {
        await supabase.from('kpis_dados').insert({
          kpi_id: newConfig.id,
          cargo_id: selectedRole,
          data: formData.date || new Date().toISOString().split('T')[0],
          valor_atual: formData.current || 0,
        })
      }

      toast({ title: 'KPI adicionado com sucesso!' })
      setIsModalOpen(false)
      fetchKpis()
    } catch (e) {
      toast({ title: 'Erro ao salvar KPI', variant: 'destructive' })
    }
  }

  const formatValue = (val: number, format: KpiFormat) => {
    if (format === 'currency')
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    if (format === 'percentage') return `${val.toFixed(1)}%`
    return val.toLocaleString('pt-BR')
  }

  const getProgressColor = (current: number, target: number) => {
    if (target === 0) return 'bg-slate-200 text-slate-800 border-slate-200'
    const perc = (current / target) * 100
    if (perc >= 100) return 'bg-green-100 text-green-800 border-green-200'
    if (perc >= 80) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-primary" /> KPIs E INDICADORES
        </h1>
        <p className="text-muted-foreground mt-1 font-semibold">
          ACOMPANHAMENTO DE METAS E PERFORMANCE SEGMENTADO POR CARGO.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> SELECIONAR CARGO
          </label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full font-bold text-nuvia-navy">
              <SelectValue placeholder="ESCOLHA UM CARGO..." />
            </SelectTrigger>
            <SelectContent>
              {cargos.map((r) => (
                <SelectItem key={r.id} value={r.id} className="font-bold">
                  {r.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:w-80 space-y-1.5">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> PERÍODO
          </label>
          <Tabs value={period} onValueChange={setPeriod} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dia" className="font-bold text-xs">
                DIA
              </TabsTrigger>
              <TabsTrigger value="semana" className="font-bold text-xs">
                SEMANA
              </TabsTrigger>
              <TabsTrigger value="mes" className="font-bold text-xs">
                MÊS
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {selectedRole ? (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-nuvia-navy/5 p-4 rounded-xl border border-nuvia-navy/10">
            <div>
              <h2 className="text-xl font-black text-nuvia-navy tracking-widest flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" /> KPIs - {currentRoleName}
              </h2>
            </div>
            <Button
              onClick={handleOpenModal}
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black w-full sm:w-auto shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" /> ADICIONAR KPI GERAL
            </Button>
          </div>

          {loadingKpis ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generalKpis.length > 0
                ? generalKpis.map((kpi) => {
                    const progress =
                      kpi.target > 0 ? Math.round((kpi.current / kpi.target) * 100) : 0
                    return (
                      <div
                        key={kpi.id}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-nuvia-navy truncate max-w-[70%]">
                            {kpi.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`font-black px-2.5 py-0.5 rounded-full ${getProgressColor(kpi.current, kpi.target)}`}
                          >
                            {progress}%
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-bold mb-1">VALOR ATUAL</p>
                          <p className="text-2xl font-black text-nuvia-navy">
                            {formatValue(kpi.current, kpi.format)}
                          </p>
                        </div>
                        <div className="flex justify-between items-end pt-3 border-t border-slate-100">
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-0.5">META</p>
                            <p className="text-sm font-bold text-slate-700">
                              {formatValue(kpi.target, kpi.format)}
                            </p>
                          </div>
                          {kpi.date && (
                            <div className="flex items-center text-[10px] text-slate-400 font-bold gap-1 bg-slate-50 px-2 py-1 rounded">
                              <CalendarIcon className="w-3 h-3" />{' '}
                              {new Date(kpi.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>
                        {kpi.observacoes && (
                          <p className="text-[10px] text-slate-500 font-medium italic mt-2 line-clamp-2">
                            Obs: {kpi.observacoes}
                          </p>
                        )}
                      </div>
                    )
                  })
                : !isCrcComercial &&
                  !isCrcLeadAgendamento &&
                  !isCrcFinanceiro && (
                    <div className="col-span-full flex flex-col items-center justify-center min-h-[20vh] text-center space-y-4 border-2 border-dashed border-slate-200 rounded-xl bg-white p-8">
                      <BarChart3 className="h-12 w-12 text-slate-300" />
                      <h3 className="text-lg font-black text-slate-600">NENHUM KPI ENCONTRADO</h3>
                      <p className="text-sm text-slate-400 font-bold max-w-md">
                        ESTE CARGO AINDA NÃO POSSUI INDICADORES GERAIS CONFIGURADOS.
                      </p>
                    </div>
                  )}
            </div>
          )}

          {isCrcComercial && <CrmComercial cargoId={selectedRole} />}
          {isCrcLeadAgendamento && <CrcLeadAgendamento cargoId={selectedRole} />}
          {isCrcFinanceiro && <CrcFinanceiro cargoId={selectedRole} />}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[30vh] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 text-center">
          <Target className="h-12 w-12 text-slate-300 mb-2" />
          <h3 className="text-lg font-black text-slate-500">SELECIONE UM CARGO</h3>
          <p className="text-sm font-bold text-slate-400 max-w-sm mt-2">
            ESCOLHA UM CARGO NO MENU ACIMA PARA VISUALIZAR SEUS DASHBOARDS E INDICADORES DE
            PERFORMANCE.
          </p>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="uppercase">
          <DialogHeader>
            <DialogTitle className="font-black text-nuvia-navy tracking-widest">
              ADICIONAR KPI GERAL
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">NOME DO KPI</Label>
              <Input
                className="font-bold uppercase"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">
                  VALOR ATUAL
                </Label>
                <Input
                  className="font-bold"
                  type="number"
                  value={formData.current ?? ''}
                  onChange={(e) => setFormData({ ...formData, current: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">META</Label>
                <Input
                  className="font-bold"
                  type="number"
                  value={formData.target ?? ''}
                  onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">UNIDADE</Label>
                <Select
                  value={formData.format || 'number'}
                  onValueChange={(v) => setFormData({ ...formData, format: v as KpiFormat })}
                >
                  <SelectTrigger className="font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="font-bold" value="percentage">
                      % (PORCENTAGEM)
                    </SelectItem>
                    <SelectItem className="font-bold" value="currency">
                      R$ (MOEDA)
                    </SelectItem>
                    <SelectItem className="font-bold" value="number">
                      UNIDADES
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">DATA</Label>
                <Input
                  className="font-bold"
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">OBSERVAÇÕES</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 font-bold resize-none uppercase"
                value={formData.observacoes || ''}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              />
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
  )
}
