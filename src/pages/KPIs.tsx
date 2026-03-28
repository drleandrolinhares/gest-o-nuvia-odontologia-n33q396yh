import { useState, useEffect } from 'react'
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
  pode_editar?: boolean
  owner_cargo_nome?: string
}

interface Cargo {
  id: string
  nome: string
}

export default function KPIs() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [cargos, setCargos] = useState<Cargo[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [userCargoId, setUserCargoId] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<'MEUS' | 'ADMIN'>('MEUS')
  const [selectedRole, setSelectedRole] = useState('')
  const [period, setPeriod] = useState('mes')

  // Meus KPIs
  const [myGeneralKpis, setMyGeneralKpis] = useState<KpiData[]>([])
  const [myModulesToRender, setMyModulesToRender] = useState<any[]>([])

  // Admin KPIs
  const [adminGeneralKpis, setAdminGeneralKpis] = useState<KpiData[]>([])

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false) // Adicionar Novo
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false) // Atualizar Valor
  const [formData, setFormData] = useState<Partial<KpiData>>({})
  const [updateFormData, setUpdateFormData] = useState({
    kpi_id: '',
    name: '',
    current: '',
    date: new Date().toISOString().split('T')[0],
  })

  const [loading, setLoading] = useState(true)
  const [loadingKpis, setLoadingKpis] = useState(false)

  // Derived
  const currentRoleName = cargos.find((r) => r.id === selectedRole)?.nome || ''
  const isCrcComercialAdmin = currentRoleName.toUpperCase().includes('COMERCIAL')
  const isCrcLeadAdmin =
    currentRoleName.toUpperCase().includes('LEAD') ||
    currentRoleName.toUpperCase().includes('AGENDAMENTO')
  const isCrcFinanceiroAdmin = currentRoleName.toUpperCase().includes('FINANCEIRO')

  useEffect(() => {
    if (user) {
      fetchInitialData()
    }
  }, [user])

  useEffect(() => {
    if (activeTab === 'MEUS' && userCargoId) {
      fetchMyKpis()
    } else if (activeTab === 'ADMIN' && selectedRole) {
      fetchAdminKpis()
    }
  }, [activeTab, userCargoId, selectedRole])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('cargo_id, cargos(nome)')
        .eq('id', user?.id)
        .single()

      const { data: isAdm } = await supabase.rpc('is_admin_user', { user_uuid: user?.id })
      const isManager =
        profile?.cargos?.nome?.toUpperCase().includes('CEO') ||
        profile?.cargos?.nome?.toUpperCase().includes('GERENTE') ||
        profile?.cargos?.nome?.toUpperCase().includes('DIRETORIA')

      const admin = !!isAdm || isManager
      setIsAdmin(admin)
      setUserCargoId(profile?.cargo_id || null)

      const { data: cargosRes } = await supabase.from('cargos').select('id, nome').order('nome')
      setCargos(cargosRes || [])

      if (admin && cargosRes && cargosRes.length > 0) {
        setSelectedRole(cargosRes[0].id)
      }
    } catch (e) {
      console.error('Erro ao inicializar:', e)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyKpis = async () => {
    if (!userCargoId) return
    setLoadingKpis(true)
    try {
      const { data: perms } = await supabase
        .from('kpis_permissoes')
        .select('pode_visualizar, pode_editar, kpi_id, kpis_config(*, cargos(nome))')
        .eq('cargo_id', userCargoId)
        .eq('pode_visualizar', true)

      const configs = (perms || [])
        .filter((p) => p.kpis_config)
        .map((p) => ({
          ...p.kpis_config,
          pode_editar: p.pode_editar,
          owner_cargo_nome: p.kpis_config.cargos?.nome,
        }))

      const generalConfigs = configs.filter((c) => c.unidade !== 'module')
      const moduleConfigs = configs.filter((c) => c.unidade === 'module')

      const kpiDataPromises = generalConfigs.map(async (conf) => {
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
          pode_editar: conf.pode_editar,
          owner_cargo_nome: conf.owner_cargo_nome,
        }
      })

      const results = await Promise.all(kpiDataPromises)
      setMyGeneralKpis(results)

      const myRoleName = cargos.find((r) => r.id === userCargoId)?.nome || ''
      const iAmCrcComercial = myRoleName.toUpperCase().includes('COMERCIAL')
      const iAmCrcLead =
        myRoleName.toUpperCase().includes('LEAD') ||
        myRoleName.toUpperCase().includes('AGENDAMENTO')
      const iAmFinanceiro = myRoleName.toUpperCase().includes('FINANCEIRO')

      const modules: any[] = []
      moduleConfigs.forEach((kpi) => {
        modules.push({
          type: kpi.nome_kpi,
          cargoId: kpi.cargo_id,
          podeEditar: kpi.pode_editar,
          key: kpi.id,
          ownerName: kpi.owner_cargo_nome,
        })
      })

      // Add self-owned modules if they don't exist yet in config to allow creation
      if (
        iAmCrcComercial &&
        !modules.some((m) => m.type === 'CRM_COMERCIAL' && m.cargoId === userCargoId)
      ) {
        modules.push({
          type: 'CRM_COMERCIAL',
          cargoId: userCargoId,
          podeEditar: true,
          key: 'auto-com',
          ownerName: myRoleName,
        })
      }
      if (iAmCrcLead && !modules.some((m) => m.type === 'CRC_LEAD' && m.cargoId === userCargoId)) {
        modules.push({
          type: 'CRC_LEAD',
          cargoId: userCargoId,
          podeEditar: true,
          key: 'auto-lead',
          ownerName: myRoleName,
        })
      }
      if (
        iAmFinanceiro &&
        !modules.some((m) => m.type === 'FINANCEIRO' && m.cargoId === userCargoId)
      ) {
        modules.push({
          type: 'FINANCEIRO',
          cargoId: userCargoId,
          podeEditar: true,
          key: 'auto-fin',
          ownerName: myRoleName,
        })
      }

      setMyModulesToRender(modules)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingKpis(false)
    }
  }

  const fetchAdminKpis = async () => {
    if (!selectedRole) return
    setLoadingKpis(true)
    try {
      const { data: configs } = await supabase
        .from('kpis_config')
        .select('*, cargos(nome)')
        .eq('cargo_id', selectedRole)
        .neq('unidade', 'module')

      const kpiDataPromises = (configs || []).map(async (conf) => {
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
          pode_editar: true,
          owner_cargo_nome: conf.cargos?.nome,
        }
      })

      const results = await Promise.all(kpiDataPromises)
      setAdminGeneralKpis(results)
    } catch (e) {
      console.error(e)
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

  const handleOpenUpdateModal = (kpi: KpiData) => {
    setUpdateFormData({
      kpi_id: kpi.id,
      name: kpi.name,
      current: '',
      date: new Date().toISOString().split('T')[0],
    })
    setIsUpdateModalOpen(true)
  }

  const handleSaveNewKpi = async () => {
    const targetCargoId = activeTab === 'MEUS' ? userCargoId : selectedRole
    if (!targetCargoId || !formData.name) return

    try {
      const { data: newConfig, error: configErr } = await supabase
        .from('kpis_config')
        .insert({
          cargo_id: targetCargoId,
          nome_kpi: formData.name,
          unidade: formData.format || 'number',
          meta_padrao: formData.target || 0,
          campos_json: { observacoes: formData.observacoes },
        })
        .select()
        .single()

      if (configErr) throw configErr

      if (newConfig) {
        await supabase.from('kpis_permissoes').insert({
          cargo_id: targetCargoId,
          kpi_id: newConfig.id,
          pode_visualizar: true,
          pode_editar: true,
        })

        await supabase.from('kpis_dados').insert({
          kpi_id: newConfig.id,
          cargo_id: targetCargoId,
          data: formData.date || new Date().toISOString().split('T')[0],
          valor_atual: formData.current || 0,
        })
      }

      toast({ title: 'KPI adicionado com sucesso!' })
      setIsModalOpen(false)
      if (activeTab === 'MEUS') fetchMyKpis()
      else fetchAdminKpis()
    } catch (e) {
      toast({ title: 'Erro ao salvar KPI', variant: 'destructive' })
    }
  }

  const handleUpdateKpi = async () => {
    const targetCargoId = activeTab === 'MEUS' ? userCargoId : selectedRole
    if (!updateFormData.kpi_id || !updateFormData.current || !targetCargoId) return

    try {
      await supabase.from('kpis_dados').insert({
        kpi_id: updateFormData.kpi_id,
        cargo_id: targetCargoId,
        data: updateFormData.date,
        valor_atual: Number(updateFormData.current),
      })
      toast({ title: 'Valor atualizado!' })
      setIsUpdateModalOpen(false)
      if (activeTab === 'MEUS') fetchMyKpis()
      else fetchAdminKpis()
    } catch (e) {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' })
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

  const renderGeneralKpiCard = (kpi: KpiData) => {
    const progress = kpi.target > 0 ? Math.round((kpi.current / kpi.target) * 100) : 0
    return (
      <div
        key={kpi.id}
        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />
        <div className="flex justify-between items-start">
          <div className="max-w-[70%]">
            <h3 className="font-bold text-nuvia-navy truncate" title={kpi.name}>
              {kpi.name}
            </h3>
            {kpi.owner_cargo_nome && activeTab === 'MEUS' && (
              <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate uppercase">
                DE: {kpi.owner_cargo_nome}
              </p>
            )}
          </div>
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
        {kpi.pode_editar && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenUpdateModal(kpi)}
            className="mt-2 w-full text-[10px] font-black tracking-widest uppercase border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            ATUALIZAR VALOR
          </Button>
        )}
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
          ACOMPANHAMENTO DE METAS E PERFORMANCE DOS SETORES.
        </p>
      </div>

      {isAdmin && (
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as any)
            if (v === 'ADMIN' && cargos.length > 0 && !selectedRole) {
              setSelectedRole(cargos[0].id)
            }
          }}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="MEUS" className="font-bold tracking-widest text-xs">
              MEUS KPIs
            </TabsTrigger>
            <TabsTrigger value="ADMIN" className="font-bold tracking-widest text-xs">
              VISÃO ADMIN
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {activeTab === 'ADMIN' && (
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
      )}

      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-nuvia-navy/5 p-4 rounded-xl border border-nuvia-navy/10">
          <div>
            <h2 className="text-xl font-black text-nuvia-navy tracking-widest flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />{' '}
              {activeTab === 'MEUS' ? 'INDICADORES PERMITIDOS' : `KPIs - ${currentRoleName}`}
            </h2>
          </div>
          {(activeTab === 'ADMIN' || userCargoId) && (
            <Button
              onClick={handleOpenModal}
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black w-full sm:w-auto shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" /> ADICIONAR KPI GERAL
            </Button>
          )}
        </div>

        {loadingKpis ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* GENERAL KPIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTab === 'MEUS' && myGeneralKpis.map(renderGeneralKpiCard)}
              {activeTab === 'ADMIN' && adminGeneralKpis.map(renderGeneralKpiCard)}
            </div>

            {/* MODULE KPIS */}
            {activeTab === 'MEUS' &&
              myModulesToRender.map((m) => {
                if (m.type === 'CRM_COMERCIAL')
                  return <CrmComercial key={m.key} cargoId={m.cargoId} podeEditar={m.podeEditar} />
                if (m.type === 'CRC_LEAD')
                  return (
                    <CrcLeadAgendamento key={m.key} cargoId={m.cargoId} podeEditar={m.podeEditar} />
                  )
                if (m.type === 'FINANCEIRO')
                  return <CrcFinanceiro key={m.key} cargoId={m.cargoId} podeEditar={m.podeEditar} />
                return null
              })}

            {activeTab === 'ADMIN' && selectedRole && (
              <>
                {isCrcComercialAdmin && <CrmComercial cargoId={selectedRole} podeEditar={true} />}
                {isCrcLeadAdmin && <CrcLeadAgendamento cargoId={selectedRole} podeEditar={true} />}
                {isCrcFinanceiroAdmin && <CrcFinanceiro cargoId={selectedRole} podeEditar={true} />}
              </>
            )}

            {activeTab === 'MEUS' &&
              myGeneralKpis.length === 0 &&
              myModulesToRender.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[30vh] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 text-center">
                  <Target className="h-12 w-12 text-slate-300 mb-2" />
                  <h3 className="text-lg font-black text-slate-500">NENHUM KPI DISPONÍVEL</h3>
                  <p className="text-sm font-bold text-slate-400 max-w-sm mt-2">
                    Você não possui indicadores configurados ou não tem permissão para visualizar.
                  </p>
                </div>
              )}
          </>
        )}
      </div>

      {/* NOVO KPI MODAL */}
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
              onClick={handleSaveNewKpi}
            >
              SALVAR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ATUALIZAR VALOR MODAL */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="uppercase">
          <DialogHeader>
            <DialogTitle className="font-black text-nuvia-navy tracking-widest">
              ATUALIZAR VALOR DO KPI
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">KPI</Label>
              <Input
                className="font-bold uppercase bg-slate-50"
                value={updateFormData.name}
                readOnly
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">
                  NOVO VALOR
                </Label>
                <Input
                  className="font-bold"
                  type="number"
                  value={updateFormData.current}
                  onChange={(e) =>
                    setUpdateFormData({ ...updateFormData, current: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">DATA</Label>
                <Input
                  className="font-bold"
                  type="date"
                  value={updateFormData.date}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, date: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="font-bold tracking-widest"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              CANCELAR
            </Button>
            <Button
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest"
              onClick={handleUpdateKpi}
            >
              SALVAR NOVO VALOR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
