import { useState } from 'react'
import {
  LayoutDashboard,
  Plus,
  Target,
  BarChart3,
  Filter,
  CheckCircle2,
  AlertCircle,
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
import { cn } from '@/lib/utils'

const MOCK_ROLES = [
  { id: '1', name: 'CRC COMERCIAL' },
  { id: '2', name: 'GERENTE ADM' },
  { id: '3', name: 'RECEPCIONISTA' },
]

const MOCK_KPIS: Record<string, any[]> = {
  '1': [
    { id: 'k1', name: 'Vendas Convertidas', target: 50000, current: 35000, format: 'currency' },
    { id: 'k2', name: 'Novos Contatos', target: 100, current: 85, format: 'number' },
    { id: 'k3', name: 'Taxa de Conversão', target: 30, current: 25, format: 'percentage' },
  ],
  '2': [
    {
      id: 'k4',
      name: 'Redução de Custos',
      target: 10000,
      current: 12000,
      format: 'currency',
      invert: true,
    },
    { id: 'k5', name: 'Satisfação da Equipe', target: 90, current: 95, format: 'percentage' },
  ],
  '3': [
    { id: 'k6', name: 'Agendamentos Efetuados', target: 150, current: 120, format: 'number' },
    {
      id: 'k7',
      name: 'Tempo Médio de Espera (min)',
      target: 15,
      current: 12,
      format: 'number',
      invert: true,
    },
  ],
}

export default function KPIs() {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [period, setPeriod] = useState<string>('mes')

  const currentRoleName = MOCK_ROLES.find((r) => r.id === selectedRole)?.name
  const currentKpis = selectedRole ? MOCK_KPIS[selectedRole] || [] : []

  const formatValue = (value: number, format: string) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    }
    if (format === 'percentage') {
      return `${value}%`
    }
    return value.toString()
  }

  const getProgress = (current: number, target: number, invert?: boolean) => {
    if (invert) {
      const p = (target / current) * 100
      return Math.min(Math.max(p, 0), 100)
    }
    const p = (current / target) * 100
    return Math.min(Math.max(p, 0), 100)
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
            <SelectTrigger className="w-full sm:max-w-md font-bold text-nuvia-navy border-slate-200">
              <SelectValue placeholder="ESCOLHA UM CARGO..." />
            </SelectTrigger>
            <SelectContent>
              {MOCK_ROLES.map((role) => (
                <SelectItem key={role.id} value={role.id} className="font-bold">
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:w-64 space-y-1.5">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> FILTRAR POR PERÍODO
          </label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full font-bold text-nuvia-navy border-slate-200">
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
                ESTE TRIMESTRE
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
                <BarChart3 className="h-6 w-6 text-primary" />
                KPIs - {currentRoleName}
              </h2>
              <p className="text-xs font-bold text-slate-500 mt-1">
                EXIBINDO INDICADORES PARA O PERÍODO SELECIONADO
              </p>
            </div>
            <Button className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest w-full sm:w-auto shadow-md">
              <Plus className="h-4 w-4 mr-2" /> ADICIONAR KPI
            </Button>
          </div>

          {currentKpis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentKpis.map((kpi) => {
                const progress = getProgress(kpi.current, kpi.target, kpi.invert)
                const isMet = kpi.invert ? kpi.current <= kpi.target : kpi.current >= kpi.target

                return (
                  <Card
                    key={kpi.id}
                    className="border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div
                      className={cn(
                        'absolute top-0 left-0 w-1 h-full',
                        isMet ? 'bg-green-500' : 'bg-primary',
                      )}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-sm font-black text-nuvia-navy uppercase leading-tight line-clamp-2">
                          {kpi.name}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'shrink-0 font-bold',
                            isMet
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-primary/10 text-primary hover:bg-primary/20',
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
                      <CardDescription className="text-xs font-bold mt-1">
                        META: {formatValue(kpi.target, kpi.format)}
                      </CardDescription>
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
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[30vh] text-center space-y-4 border-2 border-dashed border-slate-200 rounded-xl bg-white p-8">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                <BarChart3 className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-black text-slate-600">NENHUM KPI ENCONTRADO</h3>
              <p className="text-sm font-bold text-slate-400 max-w-sm leading-relaxed">
                ESTE CARGO AINDA NÃO POSSUI INDICADORES CONFIGURADOS. CLIQUE NO BOTÃO ACIMA PARA
                ADICIONAR O PRIMEIRO KPI.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 animate-fade-in">
          <Target className="h-12 w-12 text-slate-300 mb-2" />
          <h3 className="text-lg font-black text-slate-500">SELECIONE UM CARGO</h3>
          <p className="text-sm font-bold text-slate-400 max-w-sm leading-relaxed">
            ESCOLHA UM CARGO NO MENU ACIMA PARA VISUALIZAR OU GERENCIAR SEUS INDICADORES DE
            PERFORMANCE.
          </p>
        </div>
      )}
    </div>
  )
}
