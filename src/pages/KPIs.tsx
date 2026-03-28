import { useState, useEffect } from 'react'
import { LayoutDashboard, Plus, Target, BarChart3, Filter, Loader2 } from 'lucide-react'
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

import type { KpiData, KpiFormat } from '@/components/kpis/types'
import { KpiGaugeCard } from '@/components/kpis/KpiGaugeCard'
import { KpiDetails } from '@/components/kpis/KpiDetails'

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
  const [currentKpis, setCurrentKpis] = useState<KpiData[]>([])

  const [activeKpiId, setActiveKpiId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingKpi, setEditingKpi] = useState<KpiData | null>(null)
  const [formData, setFormData] = useState<Partial<KpiData>>({})

  const [loading, setLoading] = useState(true)
  const [userCargoId, setUserCargoId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const currentRoleName = cargos.find((r) => r.id === selectedRole)?.nome
  const activeKpi = currentKpis.find((k) => k.id === activeKpiId) || currentKpis[0]

  useEffect(() => {
    if (user) {
      fetchInitialData()
    }
  }, [user])

  useEffect(() => {
    if (selectedRole) {
      fetchKpisForRole(selectedRole)
    }
  }, [selectedRole, userCargoId, isAdmin])

  useEffect(() => {
    if (currentKpis.length > 0 && !currentKpis.find((k) => k.id === activeKpiId)) {
      setActiveKpiId(currentKpis[0].id)
    }
  }, [currentKpis, activeKpiId])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const [profileRes, adminRes, masterRes, cargosRes] = await Promise.all([
        supabase.from('profiles').select('cargo_id').eq('id', user!.id).single(),
        supabase.rpc('is_admin_user', { user_uuid: user!.id }),
        supabase.rpc('is_master_user', { user_uuid: user!.id }),
        supabase.from('cargos').select('id, nome').order('nome'),
      ])

      setUserCargoId(profileRes.data?.cargo_id || null)
      setIsAdmin(adminRes.data || masterRes.data || false)

      const roles = cargosRes.data || []
      setCargos(roles)

      // Auto-select logged user's role if available
      if (profileRes.data?.cargo_id && roles.find((r) => r.id === profileRes.data?.cargo_id)) {
        setSelectedRole(profileRes.data.cargo_id)
      } else if (roles.length > 0) {
        setSelectedRole(roles[0].id)
      }
    } catch (e) {
      console.error('Erro ao inicializar:', e)
    } finally {
      setLoading(false)
    }
  }

  const fetchKpisForRole = async (roleId: string) => {
    try {
      // Fetch Configs
      const { data: configs, error: configsErr } = await supabase
        .from('kpis_config')
        .select('*')
        .eq('cargo_id', roleId)

      if (configsErr) throw configsErr
      if (!configs || configs.length === 0) {
        setCurrentKpis([])
        return
      }

      const kpiIds = configs.map((c) => c.id)

      // Fetch Dados (History)
      const { data: dados, error: dadosErr } = await supabase
        .from('kpis_dados')
        .select('*')
        .in('kpi_id', kpiIds)
        .order('data', { ascending: true })

      if (dadosErr) throw dadosErr

      // Fetch Permissions
      let perms: any[] = []
      if (!isAdmin && userCargoId) {
        const { data: p } = await supabase
          .from('kpis_permissoes')
          .select('*')
          .eq('cargo_id', userCargoId)
          .in('kpi_id', kpiIds)
        perms = p || []
      }

      // Map Data
      const mapped: KpiData[] = configs
        .map((config) => {
          const historyData = (dados || []).filter((d) => d.kpi_id === config.id)
          const currentData = historyData.length > 0 ? historyData[historyData.length - 1] : null

          const pode_visualizar =
            isAdmin || perms.some((p) => p.kpi_id === config.id && p.pode_visualizar)
          const pode_editar = isAdmin || perms.some((p) => p.kpi_id === config.id && p.pode_editar)

          const history = historyData.map((h) => {
            const d = new Date(h.data + 'T00:00:00') // ignore timezones
            const month = d.toLocaleString('pt-BR', { month: 'short' })
            return {
              period: month.charAt(0).toUpperCase() + month.slice(1),
              value: Number(h.valor_atual),
            }
          })

          return {
            id: config.id,
            name: config.nome_kpi,
            target: Number(config.meta_padrao),
            current: currentData ? Number(currentData.valor_atual) : 0,
            format: config.unidade as KpiFormat,
            date: currentData ? currentData.data : '',
            history,
            pode_visualizar,
            pode_editar,
          }
        })
        .filter((k) => k.pode_visualizar) // Ensure strict visibility rule

      setCurrentKpis(mapped)
    } catch (e: any) {
      console.error(e)
      toast({ title: 'Erro ao carregar KPIs', description: e.message, variant: 'destructive' })
    }
  }

  const handleOpenModal = (kpi?: KpiData) => {
    if (kpi && !kpi.pode_editar) {
      toast({
        title: 'Acesso Negado',
        description: 'Você não tem permissão para editar este indicador.',
        variant: 'destructive',
      })
      return
    }

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

  const handleSave = async () => {
    if (!selectedRole || !formData.name) return

    try {
      if (editingKpi) {
        // Atualiza Config
        await supabase
          .from('kpis_config')
          .update({
            nome_kpi: formData.name,
            unidade: formData.format,
            meta_padrao: formData.target,
          })
          .eq('id', editingKpi.id)

        // Se houve alteração nos dados numéricos, salva novo histórico
        if (formData.current !== editingKpi.current || formData.date !== editingKpi.date) {
          await supabase.from('kpis_dados').insert({
            kpi_id: editingKpi.id,
            cargo_id: selectedRole,
            valor_atual: formData.current,
            data: formData.date || new Date().toISOString().split('T')[0],
            usuario_id: user?.id,
          })
        }
        toast({ title: 'KPI atualizado com sucesso!' })
      } else {
        // Cria novo KPI
        const { data: newConfig, error: configError } = await supabase
          .from('kpis_config')
          .insert({
            cargo_id: selectedRole,
            nome_kpi: formData.name,
            unidade: formData.format || 'number',
            meta_padrao: formData.target || 0,
          })
          .select()
          .single()

        if (configError) throw configError

        if (newConfig) {
          // Insere dados iniciais
          await supabase.from('kpis_dados').insert({
            kpi_id: newConfig.id,
            cargo_id: selectedRole,
            valor_atual: formData.current || 0,
            data: formData.date || new Date().toISOString().split('T')[0],
            usuario_id: user?.id,
          })

          // Libera permissão automaticamente para o cargo do criador
          if (userCargoId && !isAdmin) {
            await supabase.from('kpis_permissoes').insert({
              cargo_id: userCargoId,
              kpi_id: newConfig.id,
              pode_visualizar: true,
              pode_editar: true,
            })
          }
        }
        toast({ title: 'KPI criado com sucesso!' })
      }
      setIsModalOpen(false)
      fetchKpisForRole(selectedRole)
    } catch (e: any) {
      toast({ title: 'Erro ao salvar KPI', description: e.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    const kpi = currentKpis.find((k) => k.id === id)
    if (kpi && !kpi.pode_editar) {
      toast({
        title: 'Acesso Negado',
        description: 'Você não tem permissão para excluir este indicador.',
        variant: 'destructive',
      })
      return
    }

    if (
      selectedRole &&
      window.confirm('Deseja realmente excluir este KPI e todo o seu histórico de dados?')
    ) {
      try {
        const { error } = await supabase.from('kpis_config').delete().eq('id', id)
        if (error) throw error
        toast({ title: 'KPI excluído com sucesso!' })
        if (activeKpiId === id) setActiveKpiId(null)
        fetchKpisForRole(selectedRole)
      } catch (e: any) {
        toast({ title: 'Erro ao excluir KPI', description: e.message, variant: 'destructive' })
      }
    }
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
                  onEdit={() => {
                    if (!kpi.pode_editar) {
                      toast({ title: 'Acesso Negado', variant: 'destructive' })
                      return
                    }
                    handleOpenModal(kpi)
                  }}
                  onDelete={() => {
                    if (!kpi.pode_editar) {
                      toast({ title: 'Acesso Negado', variant: 'destructive' })
                      return
                    }
                    handleDelete(kpi.id)
                  }}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center min-h-[20vh] text-center space-y-4 border-2 border-dashed border-slate-200 rounded-xl bg-white p-8">
                <BarChart3 className="h-12 w-12 text-slate-300" />
                <h3 className="text-lg font-black text-slate-600">NENHUM KPI ENCONTRADO</h3>
                <p className="text-sm text-slate-400 font-bold max-w-md">
                  ESTE CARGO AINDA NÃO POSSUI INDICADORES VISÍVEIS PARA O SEU PERFIL.
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
                  VALOR ATUAL (ATUALIZAR DADO)
                </Label>
                <Input
                  className="font-bold"
                  type="number"
                  value={formData.current ?? ''}
                  onChange={(e) => setFormData({ ...formData, current: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">
                  META PADRÃO
                </Label>
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
                <Label className="font-bold text-xs text-slate-500 tracking-wider">
                  DATA DO DADO
                </Label>
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
