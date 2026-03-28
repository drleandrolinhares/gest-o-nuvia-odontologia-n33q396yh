import { useState, useEffect } from 'react'
import { LayoutDashboard, Plus, Target, BarChart3, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type { KpiData, KpiFormat } from '@/components/kpis/types'
import { KpiGaugeCard } from '@/components/kpis/KpiGaugeCard'
import { KpiDetails } from '@/components/kpis/KpiDetails'

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
      history: [
        { period: 'Out', value: 28000 },
        { period: 'Nov', value: 31000 },
        { period: 'Dez', value: 45000 },
        { period: 'Jan', value: 32000 },
        { period: 'Fev', value: 34000 },
        { period: 'Mar', value: 35000 },
      ],
    },
    {
      id: 'k2',
      name: 'Novos Contatos',
      target: 100,
      current: 85,
      format: 'number',
      date: '2026-03-01',
      history: [
        { period: 'Out', value: 60 },
        { period: 'Nov', value: 75 },
        { period: 'Dez', value: 90 },
        { period: 'Jan', value: 80 },
        { period: 'Fev', value: 82 },
        { period: 'Mar', value: 85 },
      ],
    },
    {
      id: 'k3',
      name: 'Taxa de Conversão',
      target: 30,
      current: 25,
      format: 'percentage',
      date: '2026-03-01',
      history: [
        { period: 'Out', value: 18 },
        { period: 'Nov', value: 22 },
        { period: 'Dez', value: 28 },
        { period: 'Jan', value: 20 },
        { period: 'Fev', value: 24 },
        { period: 'Mar', value: 25 },
      ],
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
      history: [
        { period: 'Out', value: 15000 },
        { period: 'Nov', value: 14500 },
        { period: 'Dez', value: 16000 },
        { period: 'Jan', value: 13500 },
        { period: 'Fev', value: 12500 },
        { period: 'Mar', value: 12000 },
      ],
    },
    {
      id: 'k5',
      name: 'Satisfação da Equipe',
      target: 90,
      current: 95,
      format: 'percentage',
      date: '2026-03-01',
      history: [
        { period: 'Out', value: 80 },
        { period: 'Nov', value: 85 },
        { period: 'Dez', value: 88 },
        { period: 'Jan', value: 92 },
        { period: 'Fev', value: 94 },
        { period: 'Mar', value: 95 },
      ],
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
      history: [
        { period: 'Out', value: 90 },
        { period: 'Nov', value: 105 },
        { period: 'Dez', value: 140 },
        { period: 'Jan', value: 110 },
        { period: 'Fev', value: 115 },
        { period: 'Mar', value: 120 },
      ],
    },
    {
      id: 'k7',
      name: 'Tempo Médio de Espera',
      target: 15,
      current: 12,
      format: 'number',
      invert: true,
      date: '2026-03-01',
      history: [
        { period: 'Out', value: 22 },
        { period: 'Nov', value: 20 },
        { period: 'Dez', value: 25 },
        { period: 'Jan', value: 18 },
        { period: 'Fev', value: 15 },
        { period: 'Mar', value: 12 },
      ],
    },
  ],
}

export default function KPIs() {
  const [selectedRole, setSelectedRole] = useState('')
  const [period, setPeriod] = useState('mes')
  const [kpisByRole, setKpisByRole] = useState(INITIAL_MOCK_KPIS)
  const [activeKpiId, setActiveKpiId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingKpi, setEditingKpi] = useState<KpiData | null>(null)
  const [formData, setFormData] = useState<Partial<KpiData>>({})

  const currentRoleName = MOCK_ROLES.find((r) => r.id === selectedRole)?.name
  const currentKpis = selectedRole ? kpisByRole[selectedRole] || [] : []
  const activeKpi = currentKpis.find((k) => k.id === activeKpiId) || currentKpis[0]

  useEffect(() => {
    if (currentKpis.length > 0 && !currentKpis.find((k) => k.id === activeKpiId)) {
      setActiveKpiId(currentKpis[0].id)
    }
  }, [selectedRole, currentKpis, activeKpiId])

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

      if (editingKpi) {
        return {
          ...prev,
          [selectedRole]: roleKpis.map((k) =>
            k.id === editingKpi.id ? ({ ...k, ...formData } as KpiData) : k,
          ),
        }
      } else {
        const val = formData.current || 0
        const newHistory = [
          { period: 'Nov', value: val * 0.7 },
          { period: 'Dez', value: val * 0.8 },
          { period: 'Jan', value: val * 0.85 },
          { period: 'Fev', value: val * 0.9 },
          { period: 'Mar', value: val },
        ]
        const newKpi: KpiData = {
          ...formData,
          id: `kpi-${Date.now()}`,
          history: newHistory,
        } as KpiData
        return { ...prev, [selectedRole]: [...roleKpis, newKpi] }
      }
    })
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (selectedRole && window.confirm('Deseja realmente excluir este KPI?')) {
      setKpisByRole((p) => ({ ...p, [selectedRole]: p[selectedRole].filter((k) => k.id !== id) }))
      if (activeKpiId === id) setActiveKpiId(null)
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
              currentKpis.map((kpi) => (
                <KpiGaugeCard
                  key={kpi.id}
                  kpi={kpi}
                  isActive={activeKpi?.id === kpi.id}
                  onClick={() => setActiveKpiId(kpi.id)}
                  onEdit={() => handleOpenModal(kpi)}
                  onDelete={() => handleDelete(kpi.id)}
                />
              ))
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

          {activeKpi && currentKpis.length > 0 && <KpiDetails kpi={activeKpi} />}
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
