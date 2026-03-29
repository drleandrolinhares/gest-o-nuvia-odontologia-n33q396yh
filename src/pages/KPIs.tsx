import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Plus,
  Target,
  BarChart3,
  Filter,
  Loader2,
  CalendarIcon,
  Pencil,
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

interface Departamento {
  id: string
  nome: string
}

interface Colaborador {
  id: string
  nome: string
  cargo_id: string
  cargo_nome: string
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
  const [isCeo, setIsCeo] = useState(false)
  const [userCargoId, setUserCargoId] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<'MEUS' | 'ADMIN'>('MEUS')

  // Novos estados para Departamentos e Colaboradores
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [selectedColaborador, setSelectedColaborador] = useState('')

  const [period, setPeriod] = useState('mes')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  // Meus KPIs
  const [myGeneralKpis, setMyGeneralKpis] = useState<KpiData[]>([])
  const [myModulesToRender, setMyModulesToRender] = useState<any[]>([])

  // Admin KPIs
  const [adminGeneralKpis, setAdminGeneralKpis] = useState<KpiData[]>([])

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false) // Adicionar Novo
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false) // Atualizar Valor
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // Editar Configuração do KPI

  const [formData, setFormData] = useState<Partial<KpiData>>({})
  const [editFormData, setEditFormData] = useState<Partial<KpiData>>({})
  const [updateFormData, setUpdateFormData] = useState({
    kpi_id: '',
    name: '',
    current: '',
    date: new Date().toISOString().split('T')[0],
  })

  const [loading, setLoading] = useState(true)
  const [loadingKpis, setLoadingKpis] = useState(false)

  // Derived Admin Info
  const selectedColab = colaboradores.find((c) => c.id === selectedColaborador)
  const selectedColabName = selectedColab?.nome || ''
  const selectedColabCargoId = selectedColab?.cargo_id || ''
  const selectedColabCargoName = selectedColab?.cargo_nome || ''

  const isCrcComercialAdmin = selectedColabCargoName.toUpperCase().includes('COMERCIAL')
  const isCrcLeadAdmin =
    selectedColabCargoName.toUpperCase().includes('LEAD') ||
    selectedColabCargoName.toUpperCase().includes('AGENDAMENTO')
  const isCrcFinanceiroAdmin = selectedColabCargoName.toUpperCase().includes('FINANCEIRO')

  useEffect(() => {
    if (user) {
      fetchInitialData()
    }
  }, [user])

  useEffect(() => {
    if (activeTab !== 'ADMIN') return
    if (selectedDepartment) {
      const fetchColabs = async () => {
        setLoadingKpis(true)
        try {
          if (selectedDepartment.startsWith('mock-')) {
            const mockColabs =
              selectedDepartment === 'mock-dept-1'
                ? [
                    {
                      id: 'mock-colab-1',
                      nome: 'João Silva',
                      cargo_id: 'mock-cargo-crc',
                      cargo_nome: 'CRC COMERCIAL',
                    },
                    {
                      id: 'mock-colab-2',
                      nome: 'Dra. Maria',
                      cargo_id: 'mock-cargo-dentista',
                      cargo_nome: 'DENTISTA AVALIADOR',
                    },
                  ]
                : [
                    {
                      id: 'mock-colab-3',
                      nome: 'Ana Costa',
                      cargo_id: 'mock-cargo-fin',
                      cargo_nome: 'FINANCEIRO',
                    },
                  ]
            setColaboradores(mockColabs)
            if (mockColabs.length > 0) setSelectedColaborador(mockColabs[0].id)
            return
          }

          const { data } = await supabase
            .from('profiles')
            .select('id, nome, cargo_id, cargos(nome)')
            .eq('departamento_id', selectedDepartment)
            .order('nome')

          const mapped = (data || []).map((p: any) => ({
            id: p.id,
            nome: p.nome || 'Sem Nome',
            cargo_id: p.cargo_id,
            cargo_nome: p.cargos?.nome || '',
          }))
          setColaboradores(mapped)
          if (mapped.length > 0) {
            setSelectedColaborador(mapped[0].id)
          } else {
            setSelectedColaborador('')
          }
        } finally {
          setLoadingKpis(false)
        }
      }
      fetchColabs()
    } else {
      setColaboradores([])
      setSelectedColaborador('')
    }
  }, [selectedDepartment, activeTab])

  useEffect(() => {
    if (activeTab === 'MEUS' && userCargoId) {
      fetchMyKpis()
    } else if (activeTab === 'ADMIN' && selectedColaborador) {
      fetchAdminKpis()
    }
  }, [activeTab, userCargoId, selectedColaborador, period, customStartDate, customEndDate])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('cargo_id, cargos(nome)')
        .eq('id', user?.id)
        .single()

      const profileCargoName = profile?.cargos?.nome?.toUpperCase() || ''
      const userIsCeo = profileCargoName.includes('CEO')

      const { data: isAdm } = await supabase.rpc('is_admin_user', { user_uuid: user?.id })
      const isManager =
        userIsCeo || profileCargoName.includes('GERENTE') || profileCargoName.includes('DIRETORIA')

      const admin = !!isAdm || isManager
      setIsAdmin(admin)
      setIsCeo(userIsCeo)
      setUserCargoId(profile?.cargo_id || null)

      const { data: deptos } = await supabase.from('departamentos').select('id, nome').order('nome')
      const defaultDeptos = [
        { id: 'mock-dept-1', nome: 'DEPARTAMENTO COMERCIAL' },
        { id: 'mock-dept-2', nome: 'DEPARTAMENTO FINANCEIRO' },
      ]

      if (deptos && deptos.length > 0) {
        setDepartamentos(deptos)
        if (admin && !selectedDepartment) setSelectedDepartment(deptos[0].id)
      } else {
        setDepartamentos(defaultDeptos)
        if (admin && !selectedDepartment) setSelectedDepartment(defaultDeptos[0].id)
      }

      const { data: cargosRes } = await supabase.from('cargos').select('id, nome').order('nome')
      const filteredCargos = (cargosRes || []).filter((r) => !r.nome.toUpperCase().includes('CEO'))
      setCargos(filteredCargos)

      if (userIsCeo) {
        setActiveTab('ADMIN')
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
          .or(`usuario_id.eq.${user?.id},usuario_id.is.null`)
          .order('data', { ascending: false })
          .limit(1)
          .maybeSingle()

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
    if (!selectedColaborador || !selectedColabCargoId) {
      setAdminGeneralKpis([])
      return
    }

    setLoadingKpis(true)
    try {
      let kpiConfigs: any[] = []

      if (!selectedColabCargoId.startsWith('mock-')) {
        const { data: configs } = await supabase
          .from('kpis_config')
          .select('*, cargos(nome)')
          .eq('cargo_id', selectedColabCargoId)
          .neq('unidade', 'module')
        kpiConfigs = configs || []
      }

      if (kpiConfigs.length === 0) {
        kpiConfigs = [
          {
            id: 'mock-kpi-1',
            nome_kpi: 'Taxa de Conversão (%)',
            meta_padrao: 80,
            unidade: 'percentage',
            campos_json: { observacoes: 'Dados mockados de conversão.' },
            cargos: { nome: selectedColabCargoName || 'CARGO' },
          },
          {
            id: 'mock-kpi-2',
            nome_kpi: 'Vendas Fechadas',
            meta_padrao: 50000,
            unidade: 'currency',
            campos_json: { observacoes: 'Total em vendas no período.' },
            cargos: { nome: selectedColabCargoName || 'CARGO' },
          },
        ]
      }

      const kpiDataPromises = kpiConfigs.map(async (conf) => {
        let currentVal = 0
        let latestDate = new Date().toISOString().split('T')[0]

        if (!conf.id.startsWith('mock-')) {
          let query = supabase
            .from('kpis_dados')
            .select('*')
            .eq('kpi_id', conf.id)
            .or(`usuario_id.eq.${selectedColaborador},usuario_id.is.null`)

          const now = new Date()
          if (period === 'dia') {
            const todayStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
              .toISOString()
              .split('T')[0]
            query = query.eq('data', todayStr)
          } else if (period === 'semana') {
            const startOfWeek = new Date(now)
            startOfWeek.setDate(now.getDate() - now.getDay())
            const startStr = new Date(
              startOfWeek.getTime() - startOfWeek.getTimezoneOffset() * 60000,
            )
              .toISOString()
              .split('T')[0]
            query = query.gte('data', startStr)
          } else if (period === 'mes') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const startStr = new Date(
              startOfMonth.getTime() - startOfMonth.getTimezoneOffset() * 60000,
            )
              .toISOString()
              .split('T')[0]
            query = query.gte('data', startStr)
          } else if (period === 'custom' && customStartDate && customEndDate) {
            query = query.gte('data', customStartDate).lte('data', customEndDate)
          }

          const { data: latestData } = await query
            .order('data', { ascending: false })
            .limit(1)
            .maybeSingle()
          currentVal = latestData?.valor_atual || 0
          if (latestData?.data) latestDate = latestData.data
        } else {
          currentVal =
            conf.unidade === 'percentage'
              ? Math.floor(Math.random() * 50) + 40
              : Math.floor(Math.random() * 60000) + 5000
        }

        return {
          id: conf.id,
          name: conf.nome_kpi,
          target: conf.meta_padrao,
          current: currentVal,
          format: conf.unidade as KpiFormat,
          date: latestDate,
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

  const handleOpenEditModal = (kpi: KpiData) => {
    setEditFormData({
      id: kpi.id,
      name: kpi.name,
      target: kpi.target,
      format: kpi.format,
      observacoes: kpi.observacoes,
    })
    setIsEditModalOpen(true)
  }

  const handleSaveNewKpi = async () => {
    const targetCargoId = activeTab === 'MEUS' ? userCargoId : selectedColabCargoId
    const targetUserId = activeTab === 'MEUS' ? user?.id : selectedColaborador

    if (!targetCargoId || targetCargoId.startsWith('mock-') || !formData.name) {
      if (targetCargoId?.startsWith('mock-')) {
        toast({ title: 'Ação não permitida em dados mockados.', variant: 'destructive' })
        setIsModalOpen(false)
      }
      return
    }

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
          usuario_id: targetUserId,
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
    const targetCargoId = activeTab === 'MEUS' ? userCargoId : selectedColabCargoId
    const targetUserId = activeTab === 'MEUS' ? user?.id : selectedColaborador

    if (
      !updateFormData.kpi_id ||
      updateFormData.kpi_id.startsWith('mock-') ||
      !updateFormData.current ||
      !targetCargoId
    ) {
      if (updateFormData.kpi_id?.startsWith('mock-')) {
        toast({ title: 'Ação não permitida em dados mockados.', variant: 'destructive' })
        setIsUpdateModalOpen(false)
      }
      return
    }

    try {
      await supabase.from('kpis_dados').insert({
        kpi_id: updateFormData.kpi_id,
        cargo_id: targetCargoId,
        usuario_id: targetUserId,
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

  const handleSaveEditKpi = async () => {
    if (!editFormData.id || editFormData.id.startsWith('mock-')) {
      toast({ title: 'Ação não permitida em dados mockados.', variant: 'destructive' })
      setIsEditModalOpen(false)
      return
    }

    try {
      const { error } = await supabase
        .from('kpis_config')
        .update({
          nome_kpi: editFormData.name,
          meta_padrao: editFormData.target,
          unidade: editFormData.format,
          campos_json: { observacoes: editFormData.observacoes },
        })
        .eq('id', editFormData.id)

      if (error) throw error

      toast({ title: 'KPI atualizado com sucesso!' })
      setIsEditModalOpen(false)
      if (activeTab === 'MEUS') fetchMyKpis()
      else fetchAdminKpis()
    } catch (e) {
      toast({ title: 'Erro ao atualizar KPI', variant: 'destructive' })
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
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => handleOpenEditModal(kpi)}
                className="text-slate-400 hover:text-nuvia-navy transition-colors bg-slate-50 hover:bg-slate-100 p-1.5 rounded-md"
                title="Editar Configuração do KPI"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            <Badge
              variant="outline"
              className={`font-black px-2.5 py-0.5 rounded-full ${getProgressColor(kpi.current, kpi.target)}`}
            >
              {progress}%
            </Badge>
          </div>
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

      {isAdmin && !isCeo && (
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as any)
            if (v === 'ADMIN' && departamentos.length > 0 && !selectedDepartment) {
              setSelectedDepartment(departamentos[0].id)
            }
          }}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="MEUS" className="font-bold tracking-widest text-xs">
              MEUS KPIs
            </TabsTrigger>
            <TabsTrigger value="ADMIN" className="font-bold tracking-widest text-xs">
              ANÁLISE EXECUTIVA
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {isAdmin && isCeo && (
        <div className="bg-nuvia-navy text-white inline-flex px-4 py-2 rounded-lg items-center gap-2 mb-2 shadow-sm">
          <Target className="w-4 h-4 text-primary" />
          <span className="font-bold tracking-widest text-xs">ANÁLISE EXECUTIVA</span>
        </div>
      )}

      {activeTab === 'ADMIN' && (
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> SELECIONAR DEPARTAMENTO
            </label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full font-bold text-nuvia-navy">
                <SelectValue placeholder="ESCOLHA UM DEPARTAMENTO..." />
              </SelectTrigger>
              <SelectContent>
                {departamentos.map((d) => (
                  <SelectItem key={d.id} value={d.id} className="font-bold">
                    {d.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> SELECIONAR COLABORADOR
            </label>
            <Select
              value={selectedColaborador}
              onValueChange={setSelectedColaborador}
              disabled={colaboradores.length === 0}
            >
              <SelectTrigger className="w-full font-bold text-nuvia-navy">
                <SelectValue placeholder="ESCOLHA UM COLABORADOR..." />
              </SelectTrigger>
              <SelectContent>
                {colaboradores.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="font-bold">
                    {c.nome} - {c.cargo_nome}
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dia" className="font-bold text-[10px] px-1 sm:text-xs">
                  DIA
                </TabsTrigger>
                <TabsTrigger value="semana" className="font-bold text-[10px] px-1 sm:text-xs">
                  SEM
                </TabsTrigger>
                <TabsTrigger value="mes" className="font-bold text-[10px] px-1 sm:text-xs">
                  MÊS
                </TabsTrigger>
                <TabsTrigger value="custom" className="font-bold text-[10px] px-1 sm:text-xs">
                  CUST
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {period === 'custom' && (
              <div className="flex items-center gap-2 mt-2 pt-1 animate-fade-in">
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400">INÍCIO</span>
                  <Input
                    type="date"
                    className="h-8 text-xs font-bold px-2"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400">FIM</span>
                  <Input
                    type="date"
                    className="h-8 text-xs font-bold px-2"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-nuvia-navy/5 p-4 rounded-xl border border-nuvia-navy/10">
          <div>
            <h2 className="text-xl font-black text-nuvia-navy tracking-widest flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />{' '}
              {activeTab === 'MEUS'
                ? 'INDICADORES PERMITIDOS'
                : selectedColaborador
                  ? `KPIs - ${selectedColabName} (${selectedColabCargoName})`
                  : 'ANÁLISE EXECUTIVA'}
            </h2>
          </div>
          {(activeTab === 'ADMIN' || userCargoId) && (
            <Button
              onClick={handleOpenModal}
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black w-full sm:w-auto shadow-md"
              disabled={activeTab === 'ADMIN' && !selectedColabCargoId}
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
                  return (
                    <CrmComercial
                      key={m.key}
                      cargoId={m.cargoId}
                      colaboradorId={user?.id}
                      podeEditar={m.podeEditar}
                    />
                  )
                if (m.type === 'CRC_LEAD')
                  return (
                    <CrcLeadAgendamento key={m.key} cargoId={m.cargoId} podeEditar={m.podeEditar} />
                  )
                if (m.type === 'FINANCEIRO')
                  return <CrcFinanceiro key={m.key} cargoId={m.cargoId} podeEditar={m.podeEditar} />
                return null
              })}

            {activeTab === 'ADMIN' &&
              selectedColabCargoId &&
              !selectedColabCargoId.startsWith('mock-') && (
                <>
                  {isCrcComercialAdmin && (
                    <CrmComercial
                      cargoId={selectedColabCargoId}
                      colaboradorId={selectedColaborador}
                      podeEditar={true}
                    />
                  )}
                  {isCrcLeadAdmin && (
                    <CrcLeadAgendamento cargoId={selectedColabCargoId} podeEditar={true} />
                  )}
                  {isCrcFinanceiroAdmin && (
                    <CrcFinanceiro cargoId={selectedColabCargoId} podeEditar={true} />
                  )}
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

            {activeTab === 'ADMIN' &&
              adminGeneralKpis.length === 0 &&
              !isCrcComercialAdmin &&
              !isCrcLeadAdmin &&
              !isCrcFinanceiroAdmin &&
              selectedColaborador && (
                <div className="flex flex-col items-center justify-center min-h-[30vh] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 text-center">
                  <Target className="h-12 w-12 text-slate-300 mb-2" />
                  <h3 className="text-lg font-black text-slate-500">NENHUM KPI CONFIGURADO</h3>
                  <p className="text-sm font-bold text-slate-400 max-w-sm mt-2">
                    Não existem indicadores ou módulos ativados para este colaborador.
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

      {/* EDITAR KPI MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="uppercase">
          <DialogHeader>
            <DialogTitle className="font-black text-nuvia-navy tracking-widest">
              EDITAR CONFIGURAÇÃO DO KPI
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">NOME DO KPI</Label>
              <Input
                className="font-bold uppercase"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">META</Label>
                <Input
                  className="font-bold"
                  type="number"
                  value={editFormData.target ?? ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, target: Number(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-xs text-slate-500 tracking-wider">UNIDADE</Label>
                <Select
                  value={editFormData.format || 'number'}
                  onValueChange={(v) =>
                    setEditFormData({ ...editFormData, format: v as KpiFormat })
                  }
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
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-xs text-slate-500 tracking-wider">OBSERVAÇÕES</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 font-bold resize-none uppercase"
                value={editFormData.observacoes || ''}
                onChange={(e) => setEditFormData({ ...editFormData, observacoes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="font-bold tracking-widest"
              onClick={() => setIsEditModalOpen(false)}
            >
              CANCELAR
            </Button>
            <Button
              className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest"
              onClick={handleSaveEditKpi}
            >
              SALVAR ALTERAÇÕES
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
