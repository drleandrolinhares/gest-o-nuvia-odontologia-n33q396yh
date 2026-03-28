import { useState } from 'react'
import {
  LayoutDashboard,
  Plus,
  Target,
  BarChart3,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type KpiFormat = 'currency' | 'number' | 'percentage'
interface KpiData {
  id: string
  name: string
  target: number
  current: number
  format: KpiFormat
  invert?: boolean
  date?: string
}

const MOCK_ROLES = [
  { id: '1', name: 'CRC COMERCIAL' },
  { id: '2', name: 'GERENTE ADM' },
  { id: '3', name: 'RECEPCIONISTA' },
]

const INITIAL_MOCK_KPIS: Record<string, KpiData[]> = {
  '1': [
    {
      id: 'k1',
      name: 'Vendas Convertidas',
      target: 50000,
      current: 35000,
      format: 'currency',
      date: '2026-03-01',
    },
    {
      id: 'k2',
      name: 'Novos Contatos',
      target: 100,
      current: 85,
      format: 'number',
      date: '2026-03-01',
    },
    {
      id: 'k3',
      name: 'Taxa de Conversão',
      target: 30,
      current: 25,
      format: 'percentage',
      date: '2026-03-01',
    },
  ],
  '2': [
    {
      id: 'k4',
      name: 'Redução de Custos',
      target: 10000,
      current: 12000,
      format: 'currency',
      invert: true,
      date: '2026-03-01',
    },
    {
      id: 'k5',
      name: 'Satisfação da Equipe',
      target: 90,
      current: 95,
      format: 'percentage',
      date: '2026-03-01',
    },
  ],
  '3': [
    {
      id: 'k6',
      name: 'Agendamentos Efetuados',
      target: 150,
      current: 120,
      format: 'number',
      date: '2026-03-01',
    },
    {
      id: 'k7',
      name: 'Tempo Médio de Espera',
      target: 15,
      current: 12,
      format: 'number',
      invert: true,
      date: '2026-03-01',
    },
  ],
}

export default function KPIs() {
  const [selectedRole, setSelectedRole] = useState('')
  const [period, setPeriod] = useState('mes')
  const [kpisByRole, setKpisByRole] = useState(INITIAL_MOCK_KPIS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingKpi, setEditingKpi] = useState<KpiData | null>(null)
  const [formData, setFormData] = useState<Partial<KpiData>>({})

  const currentRoleName = MOCK_ROLES.find((r) => r.id === selectedRole)?.name
  const currentKpis = selectedRole ? kpisByRole[selectedRole] || [] : []

  const formatValue = (v: number, format: string) => {
    if (format === 'currency')
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
    if (format === 'percentage') return `${v}%`
    return v.toString()
  }

  const getProgress = (current: number, target: number, invert?: boolean) => {
    const p = invert ? (target / current) * 100 : (current / target) * 100
    return Math.min(Math.max(p, 0), 100)
  }

  const handleOpenModal = (kpi?: KpiData) => {
    setEditingKpi(kpi || null)
    setFormData(
      kpi || {
        name: '',
        current: 0,
        target: 0,
        format: 'number',
        date: new Date().toISOString().split('T')[0],
      },
    )
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!selectedRole || !formData.name) return
    setKpisByRole((prev) => {
      const roleKpis = prev[selectedRole] || []
      return {
        ...prev,
        [selectedRole]: editingKpi
          ? roleKpis.map((k) => (k.id === editingKpi.id ? ({ ...k, ...formData } as KpiData) : k))
          : [...roleKpis, { ...formData, id: `kpi-${Date.now()}` } as KpiData],
      }
    })
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (selectedRole && window.confirm('Deseja realmente excluir este KPI?')) {
      setKpisByRole((p) => ({ ...p, [selectedRole]: p[selectedRole].filter((k) => k.id !== id) }))
    }
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
              {MOCK_ROLES.map((r) => (
                <SelectItem key={r.id} value={r.id} className="font-bold">
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:w-64 space-y-1.5">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> PERÍODO
          </label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="font-bold text-nuvia-navy">
              <SelectValue placeholder="PERÍODO" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana" className="font-bold">
                ESTA SEMANA
              </SelectItem>
              <SelectItem value="mes" className="font-bold">
                ESTE MÊS
              </SelectItem>
              <SelectItem value="trimestre" className="font-bold">
                TRIMESTRE
              </SelectItem>
            </SelectContent>
          </Select>
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
              onClick={() => handleOpenModal()}
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black w-full sm:w-auto shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" /> ADICIONAR KPI
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentKpis.length > 0 ? (
              currentKpis.map((kpi) => {
                const progress = getProgress(kpi.current, kpi.target, kpi.invert)
                const isMet = kpi.invert ? kpi.current <= kpi.target : kpi.current >= kpi.target
                return (
                  <Card
                    key={kpi.id}
                    className="border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div
                      className={cn(
                        'absolute top-0 left-0 w-1 h-full',
                        isMet ? 'bg-green-500' : 'bg-primary',
                      )}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 pr-2">
                          <CardTitle className="text-sm font-black text-nuvia-navy uppercase line-clamp-2">
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
                          <CardDescription className="text-xs font-bold mt-2">
                            META: {formatValue(kpi.target, kpi.format)}
                            {kpi.date && (
                              <span className="ml-1 text-slate-400">
                                (
                                {new Date(kpi.date).toLocaleDateString('pt-BR', {
                                  timeZone: 'UTC',
                                })}
                                )
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 bg-slate-100 text-slate-500 hover:text-nuvia-navy hover:bg-slate-200"
                            onClick={() => handleOpenModal(kpi)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100"
                            onClick={() => handleDelete(kpi.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-end mb-2">
                        <div className="text-2xl font-black text-nuvia-navy">
                          {formatValue(kpi.current, kpi.format)}
                        </div>
                        <div className="text-xs font-bold text-slate-400 mb-1">
                          {progress.toFixed(0)}%
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            isMet ? 'bg-green-500' : 'bg-primary',
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center min-h-[20vh] text-center space-y-4 border-2 border-dashed border-slate-200 rounded-xl bg-white p-8">
                <BarChart3 className="h-12 w-12 text-slate-300" />
                <h3 className="text-lg font-black text-slate-600">NENHUM KPI ENCONTRADO</h3>
                <p className="text-sm text-slate-400 font-bold max-w-md">
                  ESTE CARGO AINDA NÃO POSSUI INDICADORES. CLIQUE EM ADICIONAR KPI PARA COMEÇAR.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[30vh] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 text-center">
          <Target className="h-12 w-12 text-slate-300 mb-2" />
          <h3 className="text-lg font-black text-slate-500">SELECIONE UM CARGO</h3>
          <p className="text-sm font-bold text-slate-400 max-w-sm mt-2">
            ESCOLHA UM CARGO NO MENU ACIMA PARA VISUALIZAR OU GERENCIAR SEUS INDICADORES DE
            PERFORMANCE.
          </p>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="uppercase">
          <DialogHeader>
            <DialogTitle className="font-black text-nuvia-navy tracking-widest">
              {editingKpi ? 'EDITAR KPI' : 'ADICIONAR KPI'}
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
                    <SelectItem className="font-bold" value="currency">
                      R$ (MOEDA)
                    </SelectItem>
                    <SelectItem className="font-bold" value="percentage">
                      % (PORCENTAGEM)
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
