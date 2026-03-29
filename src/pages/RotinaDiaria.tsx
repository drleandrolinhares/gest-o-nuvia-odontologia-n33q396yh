import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  CalendarDays,
  Settings,
  CheckCircle2,
  ChevronDown,
  ListTodo,
  Clock,
  CheckSquare,
  Clock3,
  Percent,
  Trophy,
  Star,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  parseISO,
  startOfDay,
} from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Task } from '@/components/ConfigRotinaModal'
import { AllRoutinesModal } from '@/components/AllRoutinesModal'
import { useToast } from '@/components/ui/use-toast'

interface Cargo {
  id: string
  nome: string
}

interface RankingData {
  id: string
  name: string
  cargoId: string
  progressToday: number
  points: {
    daily: number
    weekly: number
    monthly: number
  }
}

const isTaskActiveOnDate = (task: Task | any, targetDate: Date) => {
  const target = startOfDay(targetDate)
  const baseDateStr = task.dataInicio || task.data_inicio
  const baseDate = baseDateStr ? startOfDay(parseISO(baseDateStr)) : target

  if (target < baseDate) return false

  const endDateStr = task.dataFim || task.data_fim
  if (endDateStr) {
    const endDate = startOfDay(parseISO(endDateStr))
    if (target > endDate) return false
  }

  const taskDays = task.days || task.dias_semana || []
  const WEEKDAYS_MAP = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
  const targetDayId = WEEKDAYS_MAP[targetDate.getDay()]

  const diffDays = differenceInDays(target, baseDate)
  const freq = task.frequency || task.frequencia

  switch (freq) {
    case 'diario':
      return taskDays.length === 0 || taskDays.includes(targetDayId)
    case 'semanal':
      return taskDays.includes(targetDayId)
    case 'quinzenal': {
      const weeksDiff = Math.floor(diffDays / 7)
      if (weeksDiff % 2 !== 0) return false
      return taskDays.includes(targetDayId)
    }
    case 'mensal': {
      return target.getDate() === baseDate.getDate()
    }
    case 'customizado': {
      const interval = task.intervaloDias || task.intervalo_dias
      if (!interval) return false
      return diffDays % interval === 0
    }
    default:
      return taskDays.includes(targetDayId)
  }
}

export default function RotinaDiaria() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [selectedCargoId, setSelectedCargoId] = useState<string>('')
  const [isCEO, setIsCEO] = useState(false)

  const [colaboradores, setColaboradores] = useState<{ id: string; nome: string }[]>([])
  const [selectedColaboradorId, setSelectedColaboradorId] = useState<string>('')
  const [currentUserProfile, setCurrentUserProfile] = useState<{ id: string; nome: string } | null>(
    null,
  )

  const [isAdmin, setIsAdmin] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [rankings, setRankings] = useState<RankingData[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [rankingPeriod, setRankingPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [isAllRoutinesModalOpen, setIsAllRoutinesModalOpen] = useState(false)

  const isToday = useMemo(() => {
    return format(selectedDate, 'yyyy-MM-dd') === format(currentTime, 'yyyy-MM-dd')
  }, [selectedDate, currentTime])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchCargos = async () => {
      const { data: rotinas } = await supabase.from('rotinas_config').select('cargo_id')
      const rotinaCargoIds = new Set(rotinas?.map((r) => r.cargo_id) || [])

      const { data } = await supabase.from('cargos').select('id, nome').order('nome')
      if (data) {
        setCargos(data.filter((c) => c.nome.toUpperCase() !== 'CEO' && rotinaCargoIds.has(c.id)))
      }
    }
    fetchCargos()
  }, [])

  useEffect(() => {
    const checkAdminAndUser = async () => {
      if (!user) return
      const { data: isAdminData } = await supabase.rpc('is_admin_user', { user_uuid: user.id })
      const { data: isMasterData } = await supabase.rpc('is_master_user', { user_uuid: user.id })
      const isAdm = !!isAdminData || !!isMasterData
      setIsAdmin(isAdm)

      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          id,
          nome,
          cargo_id,
          cargos (
            nome
          )
        `)
        .eq('id', user.id)
        .single()

      const cargoNome = (profile?.cargos as any)?.nome?.toUpperCase() || ''
      if (profile)
        setCurrentUserProfile({ id: profile.id, nome: profile.nome || 'Admin', cargoNome } as any)

      const userIsCEO = cargoNome === 'CEO'
      setIsCEO(userIsCEO)

      if (profile?.cargo_id) {
        if (!isAdm) {
          setSelectedCargoId(userIsCEO ? '' : profile.cargo_id)
        } else {
          setSelectedCargoId((prev) => prev || (userIsCEO ? '' : profile.cargo_id))
        }
      }
    }
    checkAdminAndUser()
  }, [user])

  useEffect(() => {
    if (!isAdmin || !selectedCargoId) return
    const fetchColabs = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, nome')
        .eq('cargo_id', selectedCargoId)
        .order('nome')

      if (data) {
        setColaboradores(data)
        if (!selectedColaboradorId || selectedColaboradorId === 'todos') {
          setSelectedColaboradorId('todos')
        }
      }
    }
    fetchColabs()
  }, [isAdmin, selectedCargoId])

  const fetchTasks = useCallback(async () => {
    if (!selectedCargoId || !user) return
    const targetDateStr = format(selectedDate, 'yyyy-MM-dd')

    let query = supabase.from('rotinas_config').select('*').eq('cargo_id', selectedCargoId)

    let activeUserId = user.id
    if (isAdmin) {
      if (selectedColaboradorId && selectedColaboradorId !== 'todos') {
        query = query.or(`colaborador_id.eq.${selectedColaboradorId},colaborador_id.is.null`)
        activeUserId = selectedColaboradorId
      } else {
        query = query.is('colaborador_id', null)
      }
    } else {
      query = query.or(`colaborador_id.eq.${user.id},colaborador_id.is.null`)
    }

    const { data: configData } = await query
    if (!configData) return

    let execData: any[] = []
    if (isAdmin && (!selectedColaboradorId || selectedColaboradorId === 'todos')) {
      // General view doesn't process specific execution easily per generic task
    } else {
      const { data: ed } = await supabase
        .from('rotinas_execucao')
        .select(`*, marcado_por:marcado_por_id (nome)`)
        .eq('usuario_id', activeUserId)
        .eq('data', targetDateStr)
      execData = ed || []
    }

    const mappedTasks: Task[] = configData.map((c: any) => {
      const exec = execData?.find((e: any) => e.rotina_id === c.id)
      return {
        id: c.id,
        cargoId: c.cargo_id,
        colaboradorId: c.colaborador_id,
        action: c.acao,
        time: c.horario,
        days: c.dias_semana || [],
        frequency: c.frequencia,
        dataInicio: c.data_inicio,
        dataFim: c.data_fim,
        intervaloDias: c.intervalo_dias,
        completed: !!exec?.concluido,
        completedAt: exec?.timestamp_conclusao,
        marcadoPorNome: exec?.marcado_por?.nome,
        tipoMarcacao: exec?.tipo_marcacao,
      } as any
    })

    setTasks(mappedTasks)
  }, [selectedCargoId, selectedColaboradorId, user, selectedDate, isAdmin])

  const fetchRanking = useCallback(async () => {
    if (!selectedCargoId) return
    const now = new Date()
    const startM = format(startOfMonth(now), 'yyyy-MM-dd')
    const endM = format(endOfMonth(now), 'yyyy-MM-dd')
    const startW = format(startOfWeek(now, { weekStartsOn: 0 }), 'yyyy-MM-dd')
    const endW = format(endOfWeek(now, { weekStartsOn: 0 }), 'yyyy-MM-dd')
    const targetDateStr = format(selectedDate, 'yyyy-MM-dd')

    const { data: usersData } = await supabase
      .from('profiles')
      .select('id, nome, cargo_id')
      .eq('cargo_id', selectedCargoId)

    if (!usersData || usersData.length === 0) {
      setRankings([])
      return
    }

    const userIds = usersData.map((u) => u.id)

    // Histórico para semanal e mensal
    const { data: pontosData } = await supabase
      .from('rotinas_pontos')
      .select('*')
      .in('usuario_id', userIds)
      .gte('data', startM)
      .lte('data', endM)

    // Dados dinâmicos para Hoje (respeita recorrencia customizada em tempo real)
    const { data: allConfigs } = await supabase
      .from('rotinas_config')
      .select('*')
      .eq('cargo_id', selectedCargoId)

    const { data: allExecsToday } = await supabase
      .from('rotinas_execucao')
      .select('*')
      .in('usuario_id', userIds)
      .eq('data', targetDateStr)

    const aggregated = usersData.map((u) => {
      // Histórico
      const userPontos = (pontosData || []).filter((p: any) => p.usuario_id === u.id)
      const weekly = userPontos.filter((p: any) => p.data >= startW && p.data <= endW)
      const monthly = userPontos.filter((p: any) => p.data >= startM && p.data <= endM)

      // Cálculo Dinâmico do Dia
      const userConfigs = (allConfigs || []).filter(
        (c: any) => c.colaborador_id === u.id || !c.colaborador_id,
      )
      const activeTasks = userConfigs.filter((c: any) => isTaskActiveOnDate(c, selectedDate))
      const totalTasks = activeTasks.length

      const userExecs = (allExecsToday || []).filter(
        (e: any) => e.usuario_id === u.id && e.concluido,
      )
      const completedTasks = activeTasks.filter((t: any) =>
        userExecs.some((e: any) => e.rotina_id === t.id),
      ).length

      const progressToday = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
      const pointsToday = Math.round(progressToday / 10)

      return {
        id: u.id,
        name: u.nome || 'Colaborador',
        cargoId: u.cargo_id,
        progressToday: progressToday,
        points: {
          daily: pointsToday,
          weekly: weekly.reduce((sum: number, p: any) => sum + p.pontos, 0),
          monthly: monthly.reduce((sum: number, p: any) => sum + p.pontos, 0),
        },
      }
    })

    setRankings(
      aggregated.sort((a, b) => {
        if (rankingPeriod === 'daily') return b.progressToday - a.progressToday
        return b.points[rankingPeriod] - a.points[rankingPeriod]
      }),
    )
  }, [selectedCargoId, rankingPeriod, selectedDate])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    fetchRanking()
  }, [fetchRanking])

  const selectedCargo = cargos.find((c) => c.id === selectedCargoId)
  const selectedColaborador = colaboradores.find((c) => c.id === selectedColaboradorId)

  const currentDateFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(selectedDate)

  const isTimeReached = (taskTime: string) => {
    if (!taskTime) return true
    const [hours, minutes] = taskTime.split(':').map(Number)
    const taskDate = new Date(currentTime)
    taskDate.setHours(hours, minutes, 0, 0)
    return currentTime >= taskDate
  }

  const cargoTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (t.cargoId !== selectedCargoId) return false
        return isTaskActiveOnDate(t, selectedDate)
      })
      .sort((a, b) => {
        if (!a.time) return 1
        if (!b.time) return -1
        return a.time.localeCompare(b.time)
      })
  }, [tasks, selectedCargoId, selectedDate])

  const completedCount = cargoTasks.filter((t) => t.completed).length
  const totalCount = cargoTasks.length
  const pendingCount = totalCount - completedCount
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  const getProgressColorClass = (p: number) => {
    if (p < 50) return 'text-red-500'
    if (p <= 80) return 'text-amber-500'
    return 'text-emerald-500'
  }

  const getProgressBgClass = (p: number) => {
    if (p < 50) return 'bg-red-500'
    if (p <= 80) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const handleTaskComplete = async (taskId: string) => {
    if (!user || !isToday) return
    const targetDateStr = format(selectedDate, 'yyyy-MM-dd')
    const targetUserId =
      isAdmin && selectedColaboradorId && selectedColaboradorId !== 'todos'
        ? selectedColaboradorId
        : user.id

    const marcadoPorId = user.id
    const tipoMarcacao = targetUserId === user.id ? 'colaborador' : 'admin'

    const nowStr = new Date().toISOString()
    let newProgress = 0
    let newPoints = 0

    // Otimista
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === taskId
          ? ({
              ...t,
              completed: true,
              completedAt: nowStr,
              marcadoPorNome: currentUserProfile?.nome,
              tipoMarcacao,
            } as any)
          : t,
      )

      const active = updated.filter(
        (t) => t.cargoId === selectedCargoId && isTaskActiveOnDate(t, selectedDate),
      )
      const comp = active.filter((t) => t.completed).length
      newProgress = active.length === 0 ? 0 : Math.round((comp / active.length) * 100)
      newPoints = Math.round(newProgress / 10)

      return updated
    })

    // Atualiza Ranking Localmente
    setRankings((prev) => {
      const updated = prev.map((r) =>
        r.id === targetUserId
          ? {
              ...r,
              progressToday: newProgress,
              points: { ...r.points, daily: newPoints },
            }
          : r,
      )
      return updated.sort((a, b) =>
        rankingPeriod === 'daily'
          ? b.progressToday - a.progressToday
          : b.points[rankingPeriod] - a.points[rankingPeriod],
      )
    })

    // Comunica Backend com nova RPC
    const { error } = await supabase.rpc('registrar_execucao_rotina', {
      p_rotina_id: taskId,
      p_usuario_id: targetUserId,
      p_data: targetDateStr,
      p_percentual: newProgress,
      p_pontos: newPoints,
      p_marcado_por_id: marcadoPorId,
      p_tipo_marcacao: tipoMarcacao,
    })

    if (error) {
      console.error(error)
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível registrar a conclusão da tarefa.',
        variant: 'destructive',
      })
      fetchTasks()
      fetchRanking()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-primary" /> ROTINA DIÁRIA
          </h1>
          <p className="text-muted-foreground mt-1 font-semibold">
            ACOMPANHAMENTO DE TAREFAS E ROTINAS DA CLÍNICA.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              max={format(currentTime, 'yyyy-MM-dd')}
              onChange={(e) => {
                const parts = e.target.value.split('-')
                if (parts.length === 3) {
                  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
                  setSelectedDate(date)
                }
              }}
              className="h-11 px-4 py-2 bg-white border border-slate-200 rounded-md font-bold text-nuvia-navy uppercase tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-44 cursor-pointer"
            />
          </div>

          {isAdmin && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="w-full sm:w-56">
                <Select
                  value={selectedCargoId}
                  onValueChange={(val) => {
                    setSelectedCargoId(val)
                    setSelectedColaboradorId('todos')
                  }}
                >
                  <SelectTrigger className="w-full bg-white font-bold text-nuvia-navy uppercase tracking-wider h-11">
                    <SelectValue placeholder="CARGO" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.map((cargo) => (
                      <SelectItem
                        key={cargo.id}
                        value={cargo.id}
                        className="font-bold uppercase tracking-wider"
                      >
                        {cargo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCargoId && (
                <div className="w-full sm:w-64 relative">
                  <Select value={selectedColaboradorId} onValueChange={setSelectedColaboradorId}>
                    <SelectTrigger
                      className={cn(
                        'w-full font-black uppercase tracking-wider h-11 transition-all',
                        selectedColaboradorId && selectedColaboradorId !== 'todos'
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-sm'
                          : 'bg-white text-nuvia-navy',
                      )}
                    >
                      <SelectValue placeholder="SIMULAR COLABORADOR" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="todos"
                        className="font-bold uppercase tracking-wider text-slate-500"
                      >
                        VISÃO GERAL DO CARGO
                      </SelectItem>
                      {colaboradores.map((colab) => (
                        <SelectItem
                          key={colab.id}
                          value={colab.id}
                          className="font-bold uppercase tracking-wider"
                        >
                          {colab.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedColaboradorId && selectedColaboradorId !== 'todos' && (
                    <div className="absolute -top-2.5 -right-2 bg-indigo-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm animate-in zoom-in duration-300 border border-white">
                      SIMULANDO
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isCEO && !isAdmin && !selectedCargoId ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-6 border-2 border-dashed border-slate-200 rounded-xl bg-white/50 p-8 animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-2 shadow-sm">
            <CheckCircle2 className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-400 tracking-widest">PERFIL CEO</h2>
          <p className="text-sm font-bold text-slate-400 max-w-md leading-relaxed">
            O PERFIL CEO NÃO POSSUI ROTINA DIÁRIA CONFIGURADA PARA ACOMPANHAMENTO NO SISTEMA.
          </p>
        </div>
      ) : selectedCargoId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-2">
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h2 className="text-2xl md:text-3xl font-black text-nuvia-navy tracking-wider flex items-center gap-2">
                  ROTINA DIÁRIA -{' '}
                  {selectedColaboradorId && selectedColaboradorId !== 'todos'
                    ? selectedColaborador?.nome
                    : selectedCargo?.nome || (currentUserProfile as any)?.cargoNome}
                </h2>
                {isAdmin && selectedColaboradorId && selectedColaboradorId !== 'todos' && (
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-1 rounded-md border border-indigo-200 shadow-sm uppercase tracking-widest flex items-center gap-1 h-6">
                    <ShieldCheck className="h-3 w-3" />
                    MODO SIMULAÇÃO
                  </span>
                )}
                <Button
                  onClick={() => setIsAllRoutinesModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold uppercase tracking-widest text-[10px] h-6 px-2 shadow-sm flex items-center gap-1"
                >
                  <ListTodo className="h-3 w-3" />
                  TODAS AS ROTINAS
                </Button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-md">
                  <CalendarDays className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-bold text-slate-600 capitalize">
                    {currentDateFormatted}
                  </span>
                </div>
                {!isToday && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase rounded-md tracking-wider border border-amber-200">
                    HISTÓRICO
                  </span>
                )}
              </div>
            </div>
            {isAdmin && (
              <Button
                asChild
                className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest shadow-md shrink-0 h-11 px-4 sm:px-6 text-xs sm:text-sm cursor-pointer"
              >
                <Link to="/rotina-diaria/configurar-rotina">
                  <Settings className="h-4 w-4 mr-2" />
                  CONFIGURAR ROTINAS
                </Link>
              </Button>
            )}
          </div>

          <Tabs defaultValue="minhas-tarefas" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8 bg-slate-100 h-12 p-1">
              <TabsTrigger
                value="minhas-tarefas"
                className="font-bold tracking-wider text-xs uppercase h-full"
              >
                TAREFAS
              </TabsTrigger>
              <TabsTrigger
                value="ranking"
                className="font-bold tracking-wider text-xs uppercase flex items-center gap-2 h-full data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
              >
                <Trophy className="h-4 w-4 text-amber-500" /> RANKING
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="minhas-tarefas"
              className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-200 shadow-sm bg-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                    <CardTitle className="text-xs font-black tracking-widest text-slate-500 uppercase">
                      TAREFAS HOJE
                    </CardTitle>
                    <ListTodo className="h-4 w-4 text-slate-400" />
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="text-2xl font-bold text-nuvia-navy">{totalCount}</div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                    <CardTitle className="text-xs font-black tracking-widest text-slate-500 uppercase">
                      CONCLUÍDAS
                    </CardTitle>
                    <CheckSquare className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="text-2xl font-bold text-emerald-500">{completedCount}</div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                    <CardTitle className="text-xs font-black tracking-widest text-slate-500 uppercase">
                      PENDENTES
                    </CardTitle>
                    <Clock3 className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="text-2xl font-bold text-amber-500">{pendingCount}</div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                    <CardTitle className="text-xs font-black tracking-widest text-slate-500 uppercase">
                      % PROGRESSO
                    </CardTitle>
                    <Percent className={`h-4 w-4 ${getProgressColorClass(progress)}`} />
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className={`text-2xl font-bold ${getProgressColorClass(progress)}`}>
                      {progress}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-slate-50 p-5 rounded-lg border border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-sm font-black text-nuvia-navy tracking-wider">
                  <span className="flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-primary" /> PROGRESSO DA ROTINA
                  </span>
                  <span className={`text-base font-bold ${getProgressColorClass(progress)}`}>
                    {progress}% CONCLUÍDO
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-3 bg-slate-200"
                  indicatorClassName={cn(
                    'transition-all duration-500 ease-out',
                    getProgressBgClass(progress),
                  )}
                />
              </div>

              {isToday && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center justify-center gap-2 shadow-sm animate-in fade-in duration-500">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-800 text-xs font-bold uppercase tracking-wider text-center">
                    Você pode marcar tarefas até às 23:59 de hoje
                  </span>
                </div>
              )}

              <div className="pt-2">
                {cargoTasks.length > 0 ? (
                  <div className="space-y-3">
                    {cargoTasks.map((task) => {
                      const isReached = isTimeReached(task.time)

                      return (
                        <div
                          key={task.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-[#D4AF37]/50 transition-colors"
                        >
                          <div className="flex items-start gap-4 w-full">
                            <Checkbox
                              checked={task.completed}
                              disabled={
                                !isReached ||
                                task.completed ||
                                !isToday ||
                                (isAdmin &&
                                  (!selectedColaboradorId || selectedColaboradorId === 'todos'))
                              }
                              onCheckedChange={(c) => {
                                if (c && isReached && !task.completed && isToday) {
                                  handleTaskComplete(task.id)
                                }
                              }}
                              className={cn(
                                'h-6 w-6 mt-0.5 border-slate-300 transition-colors',
                                task.completed
                                  ? 'data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]'
                                  : '',
                                (!isReached ||
                                  !isToday ||
                                  (isAdmin &&
                                    (!selectedColaboradorId ||
                                      selectedColaboradorId === 'todos'))) &&
                                  !task.completed &&
                                  'opacity-50 cursor-not-allowed bg-slate-100',
                              )}
                            />
                            <div className="flex-1">
                              <p
                                className={cn(
                                  'font-bold text-nuvia-navy tracking-wide text-sm sm:text-base',
                                  task.completed &&
                                    'text-slate-400 line-through decoration-slate-300',
                                )}
                              >
                                {task.action}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-semibold uppercase tracking-wider">
                                <span
                                  className={cn(
                                    'flex items-center gap-1 px-2 py-0.5 rounded',
                                    task.completed
                                      ? 'bg-emerald-50 text-emerald-600'
                                      : isReached
                                        ? 'bg-amber-50 text-amber-600'
                                        : 'bg-slate-100 text-slate-500',
                                  )}
                                >
                                  <Clock className="h-3 w-3" /> {task.time}
                                </span>

                                {task.completed ? (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={cn(
                                        'px-2 py-1 rounded text-[10px] sm:text-xs font-black uppercase tracking-widest border shadow-sm flex items-center gap-1.5',
                                        (task as any).tipoMarcacao === 'admin'
                                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                          : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                      )}
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                      {task.completedAt &&
                                        `${new Date(task.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                                      {' - MARCADO POR: '}
                                      {(task as any).tipoMarcacao === 'admin' && 'ADMIN '}
                                      {(task as any).marcadoPorNome?.split(' ')[0] || 'SISTEMA'}
                                    </span>
                                  </div>
                                ) : (
                                  <span
                                    className={cn(
                                      'flex items-center gap-1',
                                      !isToday
                                        ? 'text-slate-400'
                                        : isReached
                                          ? 'text-amber-600'
                                          : 'text-slate-400',
                                    )}
                                  >
                                    {!isToday
                                      ? 'NÃO CONCLUÍDA'
                                      : isReached
                                        ? 'PENDENTE (HORÁRIO ATINGIDO)'
                                        : 'AGUARDANDO HORÁRIO'}
                                  </span>
                                )}

                                {isAdmin && (
                                  <span
                                    className={cn(
                                      'px-2 py-0.5 rounded text-[10px] font-black',
                                      task.colaboradorId
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'bg-slate-100 text-slate-500',
                                    )}
                                  >
                                    {task.colaboradorId ? 'ESPECÍFICA' : 'GERAL (CARGO)'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 transition-colors hover:bg-slate-50">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <CheckCircle2 className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-black text-slate-400 tracking-widest mb-2 text-center">
                      NENHUMA TAREFA PARA HOJE
                    </h3>
                    <p className="text-sm font-bold text-slate-400 tracking-wider text-center max-w-md leading-relaxed">
                      ESTE PERFIL NÃO POSSUI TAREFAS AGENDADAS PARA A DATA ATUAL NO SISTEMA.
                    </p>
                    {isAdmin && (
                      <p className="text-xs font-black text-[#D4AF37] text-center mt-4 bg-[#D4AF37]/10 px-4 py-2 rounded-md tracking-widest">
                        CLIQUE EM "CONFIGURAR ROTINA" PARA ADICIONAR TAREFAS
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="ranking"
              className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="flex justify-end mb-4">
                <Select value={rankingPeriod} onValueChange={(v: any) => setRankingPeriod(v)}>
                  <SelectTrigger className="w-[180px] bg-white border-slate-200 font-bold uppercase tracking-wider text-xs h-10">
                    <SelectValue placeholder="PERÍODO" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="daily"
                      className="font-bold text-xs uppercase tracking-wider"
                    >
                      HOJE
                    </SelectItem>
                    <SelectItem
                      value="weekly"
                      className="font-bold text-xs uppercase tracking-wider"
                    >
                      ESTA SEMANA
                    </SelectItem>
                    <SelectItem
                      value="monthly"
                      className="font-bold text-xs uppercase tracking-wider"
                    >
                      ESTE MÊS
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {rankings.map((colab, index) => (
                  <div
                    key={colab.id}
                    className={cn(
                      'flex items-center p-4 border-b border-slate-100 last:border-0 transition-colors',
                      colab.id === user?.id
                        ? 'bg-amber-50/40 hover:bg-amber-50/60'
                        : 'hover:bg-slate-50',
                    )}
                  >
                    <div className="w-12 text-center font-black text-2xl flex justify-center items-center">
                      {index === 0 ? (
                        '🥇'
                      ) : index === 1 ? (
                        '🥈'
                      ) : index === 2 ? (
                        '🥉'
                      ) : (
                        <span className="text-slate-400 text-lg">{index + 1}º</span>
                      )}
                    </div>
                    <Avatar className="h-10 w-10 mr-4 border border-slate-200 shadow-sm">
                      <AvatarFallback
                        className={cn(
                          'font-bold text-sm tracking-wider',
                          colab.id === user?.id
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-primary/10 text-primary',
                        )}
                      >
                        {colab.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-nuvia-navy tracking-wide">{colab.name}</p>
                      <div className="flex items-center gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1.5">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded',
                            colab.progressToday >= 80
                              ? 'bg-emerald-50 text-emerald-600'
                              : colab.progressToday >= 50
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-slate-100 text-slate-500',
                          )}
                        >
                          {colab.progressToday}% CONCLUÍDO (HOJE)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-2xl font-black flex items-center justify-end',
                          rankingPeriod === 'daily' ? 'text-nuvia-navy' : 'text-amber-500',
                        )}
                      >
                        {rankingPeriod === 'daily'
                          ? `${colab.progressToday}%`
                          : colab.points[rankingPeriod]}
                        {rankingPeriod !== 'daily' && (
                          <Star className="h-5 w-5 fill-amber-500 text-amber-500 ml-1 mb-1" />
                        )}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        {rankingPeriod === 'daily' ? 'CONCLUÍDO' : 'PONTOS'}
                      </p>
                    </div>
                  </div>
                ))}
                {rankings.length === 0 && (
                  <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                    NENHUM DADO DE RANKING ENCONTRADO PARA ESTE CARGO.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-6 border-2 border-dashed border-slate-200 rounded-xl bg-white/50 p-8 animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-2 shadow-sm">
            <ChevronDown className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-400 tracking-widest">SELECIONE UM CARGO</h2>
          <p className="text-sm font-bold text-slate-400 max-w-md leading-relaxed">
            ESCOLHA UM CARGO NO MENU ACIMA PARA VISUALIZAR OU GERENCIAR SUA ROTINA DIÁRIA E
            ACOMPANHAR O PROGRESSO DAS TAREFAS.
          </p>
        </div>
      )}

      <AllRoutinesModal
        isOpen={isAllRoutinesModalOpen}
        onClose={() => setIsAllRoutinesModalOpen(false)}
        cargoId={selectedCargoId}
        colaboradorId={selectedColaboradorId}
        colaboradorNome={selectedColaborador?.nome}
        isAdmin={isAdmin}
        cargos={cargos}
        onRoutinesChanged={() => {
          fetchTasks()
          fetchRanking()
        }}
      />
    </div>
  )
}
