import { useState, useEffect, useMemo } from 'react'
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
} from 'lucide-react'
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
import { ConfigRotinaModal, Task } from '@/components/ConfigRotinaModal'

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

export default function RotinaDiaria() {
  const { user } = useAuth()
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [selectedCargoId, setSelectedCargoId] = useState<string>('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Ranking state
  const [mockRankings, setMockRankings] = useState<RankingData[]>([])
  const [rankingPeriod, setRankingPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchCargos = async () => {
      const { data } = await supabase.from('cargos').select('id, nome').order('nome')
      if (data) setCargos(data)
    }
    fetchCargos()
  }, [])

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return
      const { data: isAdminData } = await supabase.rpc('is_admin_user', { user_uuid: user.id })
      const { data: isMasterData } = await supabase.rpc('is_master_user', { user_uuid: user.id })
      setIsAdmin(!!isAdminData || !!isMasterData)

      if (!selectedCargoId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('cargo_id')
          .eq('id', user.id)
          .single()
        if (profile?.cargo_id) {
          setSelectedCargoId(profile.cargo_id)
        }
      }
    }
    checkAdmin()
  }, [user, selectedCargoId])

  useEffect(() => {
    if (cargos.length > 0 && tasks.length === 0) {
      const crcCargo = cargos.find((c) => c.nome.toUpperCase().includes('CRC')) || cargos[0]
      const auxCargo = cargos.find((c) => c.nome.toUpperCase().includes('AUXILIAR')) || cargos[0]

      if (!crcCargo) return

      const mockTasks: Task[] = [
        {
          id: '1',
          cargoId: crcCargo.id,
          action: 'Revisar metas e indicadores do dia',
          time: '08:00',
          days: ['seg', 'ter', 'qua', 'qui', 'sex'],
          frequency: 'diario',
          completed: true,
          completedAt: new Date(new Date().setHours(8, 5, 0)).toISOString(),
        },
        {
          id: '2',
          cargoId: crcCargo.id,
          action: 'Follow-up com leads quentes (WhatsApp)',
          time: '10:00',
          days: ['seg', 'ter', 'qua', 'qui', 'sex'],
          frequency: 'diario',
          completed: false,
        },
        {
          id: '3',
          cargoId: crcCargo.id,
          action: 'Atualizar CRM com fechamentos do turno da manhã',
          time: '12:00',
          days: ['seg', 'ter', 'qua', 'qui', 'sex'],
          frequency: 'diario',
          completed: false,
        },
        {
          id: '4',
          cargoId: crcCargo.id,
          action: 'Planejamento da agenda do dia seguinte',
          time: '17:30',
          days: ['seg', 'ter', 'qua', 'qui', 'sex'],
          frequency: 'diario',
          completed: false,
        },
      ]

      if (auxCargo && auxCargo.id !== crcCargo.id) {
        mockTasks.push({
          id: '5',
          cargoId: auxCargo.id,
          action: 'Esterilização dos materiais da manhã',
          time: '12:30',
          days: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
          frequency: 'diario',
          completed: false,
        })
      }

      setTasks(mockTasks)
    }
  }, [cargos, tasks.length])

  // Gerar dados mockados para o ranking
  useEffect(() => {
    if (cargos.length > 0 && mockRankings.length === 0) {
      const generated: RankingData[] = []
      cargos.forEach((cargo) => {
        const names = [
          'Ana Silva',
          'Carlos Santos',
          'Beatriz Costa',
          'Daniel Lima',
          'Fernanda Alves',
        ]
        const count = Math.floor(Math.random() * 3) + 2
        for (let i = 0; i < count; i++) {
          const progressMock = Math.floor(Math.random() * 50) + 40
          const pts = Math.round(progressMock / 10)
          generated.push({
            id: `mock-${cargo.id}-${i}`,
            name: names[i % names.length],
            cargoId: cargo.id,
            progressToday: progressMock,
            points: {
              daily: pts,
              weekly: pts * 4 + Math.floor(Math.random() * 10),
              monthly: pts * 18 + Math.floor(Math.random() * 30),
            },
          })
        }
      })
      setMockRankings(generated)
    }
  }, [cargos, mockRankings.length])

  const selectedCargo = cargos.find((c) => c.id === selectedCargoId)

  const currentDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(currentTime)

  const isTimeReached = (taskTime: string) => {
    if (!taskTime) return true
    const [hours, minutes] = taskTime.split(':').map(Number)
    const taskDate = new Date(currentTime)
    taskDate.setHours(hours, minutes, 0, 0)
    return currentTime >= taskDate
  }

  const WEEKDAYS_MAP = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
  const currentDayId = WEEKDAYS_MAP[currentTime.getDay()]

  // Cálculos de progresso movidos para fora do render para uso no ranking
  const cargoTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (t.cargoId !== selectedCargoId) return false
        if (t.days && t.days.length > 0 && !t.days.includes(currentDayId)) return false
        return true
      })
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [tasks, selectedCargoId, currentDayId])

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

  // Ranking dinâmico incluindo o usuário atual
  const cargoRankings = useMemo(() => {
    let list = mockRankings.filter((r) => r.cargoId === selectedCargoId)

    const currentPointsDaily = Math.round(progress / 10)
    const currentPointsWeekly = currentPointsDaily * 4 + 8
    const currentPointsMonthly = currentPointsDaily * 18 + 25

    const me: RankingData = {
      id: 'me',
      name: 'VOCÊ',
      cargoId: selectedCargoId,
      progressToday: progress,
      points: {
        daily: currentPointsDaily,
        weekly: currentPointsWeekly,
        monthly: currentPointsMonthly,
      },
    }

    list = [...list, me].sort((a, b) => b.points[rankingPeriod] - a.points[rankingPeriod])

    return list
  }, [mockRankings, selectedCargoId, progress, rankingPeriod])

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

        <div className="w-full md:w-72">
          <Select value={selectedCargoId} onValueChange={setSelectedCargoId} disabled={!isAdmin}>
            <SelectTrigger className="w-full bg-white font-bold text-nuvia-navy uppercase tracking-wider h-11">
              <SelectValue placeholder="SELECIONAR CARGO" />
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
      </div>

      {selectedCargoId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-nuvia-navy tracking-wider">
                ROTINA DIÁRIA - {selectedCargo?.nome}
              </h2>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-md">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-bold text-slate-600 capitalize">{currentDate}</span>
              </div>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setIsConfigOpen(true)}
                className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest shadow-md shrink-0 h-11 px-6"
              >
                <Settings className="h-4 w-4 mr-2" /> CONFIGURAR ROTINA
              </Button>
            )}
          </div>

          <Tabs defaultValue="minhas-tarefas" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8 bg-slate-100 h-12 p-1">
              <TabsTrigger
                value="minhas-tarefas"
                className="font-bold tracking-wider text-xs uppercase h-full"
              >
                MINHAS TAREFAS
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
                              disabled={!isReached || task.completed}
                              onCheckedChange={(c) => {
                                if (c && isReached && !task.completed) {
                                  setTasks(
                                    tasks.map((t) =>
                                      t.id === task.id
                                        ? {
                                            ...t,
                                            completed: true,
                                            completedAt: new Date().toISOString(),
                                          }
                                        : t,
                                    ),
                                  )
                                }
                              }}
                              className={cn(
                                'h-6 w-6 mt-0.5 border-slate-300 transition-colors',
                                task.completed
                                  ? 'data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]'
                                  : '',
                                !isReached &&
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
                                  <span className="flex items-center gap-1 text-emerald-600">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    CONCLUÍDO{' '}
                                    {task.completedAt &&
                                      `ÀS ${new Date(task.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                                  </span>
                                ) : (
                                  <span
                                    className={cn(
                                      'flex items-center gap-1',
                                      isReached ? 'text-amber-600' : 'text-slate-400',
                                    )}
                                  >
                                    {isReached
                                      ? 'PENDENTE (HORÁRIO ATINGIDO)'
                                      : 'AGUARDANDO HORÁRIO'}
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
                      ESTE CARGO NÃO POSSUI TAREFAS AGENDADAS PARA O DIA ATUAL NO SISTEMA.
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
                {cargoRankings.map((colab, index) => (
                  <div
                    key={colab.id}
                    className={cn(
                      'flex items-center p-4 border-b border-slate-100 last:border-0 transition-colors',
                      colab.id === 'me'
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
                          colab.id === 'me'
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
                                : 'bg-red-50 text-red-600',
                          )}
                        >
                          {colab.progressToday}% CONCLUÍDO
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-amber-500 flex items-center justify-end">
                        {colab.points[rankingPeriod]}
                        <Star className="h-5 w-5 fill-amber-500 text-amber-500 ml-1 mb-1" />
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        PONTOS
                      </p>
                    </div>
                  </div>
                ))}
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

      {isAdmin && (
        <ConfigRotinaModal
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          cargos={cargos}
          onSave={(task) => setTasks((prev) => [...prev, task])}
          defaultCargoId={selectedCargoId}
        />
      )}
    </div>
  )
}
