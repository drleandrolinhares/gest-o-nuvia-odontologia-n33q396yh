import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { parseISO, format, subDays } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Lightbulb, Download, Activity, FileText } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { toast } from '@/components/ui/use-toast'

interface UserProfile {
  id: string
  nome: string | null
  email: string
  cargo_id: string | null
}

interface Cargo {
  id: string
  nome: string
}

interface RotinaPonto {
  id: string
  usuario_id: string
  data: string
  percentual: number
  pontos: number
}

interface Execucao {
  concluido: boolean
  data: string
  usuario_id: string
  rotinas_config: {
    horario: string
    acao: string
  } | null
}

export default function RotinaRelatorio() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7d')
  const [selectedCargo, setSelectedCargo] = useState('all')

  const [cargos, setCargos] = useState<Cargo[]>([])
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [rotinasPontos, setRotinasPontos] = useState<RotinaPonto[]>([])
  const [execucoes, setExecucoes] = useState<Execucao[]>([])
  const [rotinasConfig, setRotinasConfig] = useState<any[]>([])
  const [hasAnyRoutine, setHasAnyRoutine] = useState(true)

  const fetchData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // 1. Validar permissões (Cargo = CEO ou role = ADMIN/MASTER)
      const [{ data: profileData }, { data: roleData }] = await Promise.all([
        supabase.from('profiles').select('cargos(nome)').eq('id', user.id).single(),
        supabase.from('user_roles').select('roles(name)').eq('user_id', user.id),
      ])

      const cargoNome = (profileData?.cargos as any)?.nome?.toUpperCase() || ''
      const roles = roleData?.map((r: any) => r.roles?.name?.toUpperCase()) || []

      const isCEO = cargoNome.includes('CEO')
      const isAdmin = roles.includes('ADMIN') || roles.includes('MASTER')

      if (!isCEO && !isAdmin) {
        toast({
          title: 'Acesso restrito',
          description: 'Acesso restrito - apenas administrador',
          variant: 'destructive',
        })
        navigate(-1)
        return
      }

      const endDate = new Date()
      let startDate = new Date()
      if (period === '7d') startDate = subDays(endDate, 7)
      if (period === '15d') startDate = subDays(endDate, 15)
      if (period === '30d') startDate = subDays(endDate, 30)

      const startStr = format(startDate, 'yyyy-MM-dd')
      const endStr = format(endDate, 'yyyy-MM-dd')

      const [
        { data: cargosData },
        { data: profilesData },
        { data: pontosData },
        { data: execData },
        { data: rotinasConfigData },
      ] = await Promise.all([
        supabase.from('cargos').select('*'),
        supabase.from('profiles').select('id, nome, email, cargo_id'),
        supabase.from('rotinas_pontos').select('*').gte('data', startStr).lte('data', endStr),
        supabase
          .from('rotinas_execucao')
          .select(`
            concluido,
            data,
            usuario_id,
            rotinas_config ( horario, acao )
          `)
          .gte('data', startStr)
          .lte('data', endStr),
        supabase.from('rotinas_config').select('cargo_id, colaborador_id'),
      ])

      if (pontosData) setRotinasPontos(pontosData)
      if (rotinasConfigData) setRotinasConfig(rotinasConfigData)

      if (profilesData && rotinasConfigData) {
        const ceoCargos = cargosData
          ? cargosData
              .filter(
                (c) =>
                  c.nome.toUpperCase().includes('CEO') || c.nome.toUpperCase().includes('ADMIN'),
              )
              .map((c) => c.id)
          : []

        const activeProfiles = profilesData.filter((user) => {
          if (ceoCargos.includes(user.cargo_id)) return false

          return rotinasConfigData.some(
            (r) =>
              r.colaborador_id === user.id || (!r.colaborador_id && r.cargo_id === user.cargo_id),
          )
        })

        setProfiles(activeProfiles)
        setHasAnyRoutine(activeProfiles.length > 0)

        if (cargosData) {
          const activeCargoIds = new Set(activeProfiles.map((p) => p.cargo_id))
          setCargos(cargosData.filter((c) => activeCargoIds.has(c.id)))
        }
      } else {
        if (profilesData) setProfiles(profilesData)
        if (cargosData) setCargos(cargosData)
      }

      if (execData) {
        const normalized = execData.map((ex: any) => ({
          ...ex,
          rotinas_config: Array.isArray(ex.rotinas_config)
            ? ex.rotinas_config[0]
            : ex.rotinas_config,
        }))
        setExecucoes(normalized as Execucao[])
      }
    } catch (e: any) {
      console.error(e)
      toast({
        title: 'Erro ao carregar dados',
        description: e.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [period, user])

  const filteredUsers = useMemo(() => {
    if (selectedCargo === 'all') return profiles
    return profiles.filter((p) => p.cargo_id === selectedCargo)
  }, [profiles, selectedCargo])

  const safeId = (id: string) => `u_${id.replace(/-/g, '_')}`

  const chartData = useMemo(() => {
    const datesSet = new Set(rotinasPontos.map((rp) => rp.data))
    const dates = Array.from(datesSet).sort()

    return dates.map((date) => {
      const entry: any = { date }
      filteredUsers.forEach((user) => {
        const point = rotinasPontos.find((rp) => rp.data === date && rp.usuario_id === user.id)
        entry[safeId(user.id)] = point ? point.percentual : null
      })
      return entry
    })
  }, [rotinasPontos, filteredUsers])

  const chartConfig = useMemo(() => {
    const config: Record<string, any> = {}
    filteredUsers.forEach((user, index) => {
      config[safeId(user.id)] = {
        label: user.nome || user.email,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      }
    })
    return config
  }, [filteredUsers])

  const tableData = useMemo(() => {
    return filteredUsers
      .map((user) => {
        const userPoints = rotinasPontos.filter((rp) => rp.usuario_id === user.id)
        const avg =
          userPoints.length > 0
            ? userPoints.reduce((acc, curr) => acc + curr.percentual, 0) / userPoints.length
            : 0
        const cargo = cargos.find((c) => c.id === user.cargo_id)
        return {
          id: user.id,
          nome: user.nome || user.email,
          cargo: cargo?.nome || 'Sem cargo',
          media: avg,
          tarefasFeitas: userPoints.length,
        }
      })
      .sort((a, b) => b.media - a.media)
  }, [filteredUsers, rotinasPontos, cargos])

  const insights = useMemo(() => {
    const suggestions: { user: string; text: string; type: 'warning' | 'info' }[] = []

    filteredUsers.forEach((user) => {
      // Garantir explicitamente que usuários sem rotina não gerem insights (redundância por segurança e consistência)
      const hasRoutine = rotinasConfig.some(
        (r) => r.colaborador_id === user.id || (!r.colaborador_id && r.cargo_id === user.cargo_id),
      )
      if (!hasRoutine) return

      const userPoints = rotinasPontos.filter((rp) => rp.usuario_id === user.id)
      if (userPoints.length > 0) {
        const avg = userPoints.reduce((acc, curr) => acc + curr.percentual, 0) / userPoints.length
        if (avg < 70) {
          suggestions.push({
            user: user.nome || user.email || 'Colaborador',
            text: `Média de conclusão baixa (${avg.toFixed(1)}%). Considere revisar a carga de tarefas ou realizar um alinhamento.`,
            type: 'warning',
          })
        } else if (avg === 100 && userPoints.length >= 3) {
          suggestions.push({
            user: user.nome || user.email || 'Colaborador',
            text: `Excelente desempenho! Mantendo 100% de média consistentemente.`,
            type: 'info',
          })
        }
      }

      const userExecs = execucoes.filter((ex) => ex.usuario_id === user.id)
      if (userExecs.length > 0) {
        const missed = userExecs.filter((ex) => !ex.concluido)

        let missedMorning = 0
        let missedAfternoon = 0
        let totalMorning = 0
        let totalAfternoon = 0

        userExecs.forEach((ex) => {
          if (!ex.rotinas_config || !ex.rotinas_config.horario) return
          const hour = parseInt(ex.rotinas_config.horario.split(':')[0])
          if (isNaN(hour)) return

          if (hour < 12) {
            totalMorning++
            if (!ex.concluido) missedMorning++
          } else {
            totalAfternoon++
            if (!ex.concluido) missedAfternoon++
          }
        })

        if (totalMorning > 3 && missedMorning / totalMorning >= 0.5) {
          suggestions.push({
            user: user.nome || user.email || 'Colaborador',
            text: `Frequentemente falha em tarefas no período da manhã (${Math.round((missedMorning / totalMorning) * 100)}% de não conclusão).`,
            type: 'warning',
          })
        }
        if (totalAfternoon > 3 && missedAfternoon / totalAfternoon >= 0.5) {
          suggestions.push({
            user: user.nome || user.email || 'Colaborador',
            text: `Frequentemente falha em tarefas no período da tarde (${Math.round((missedAfternoon / totalAfternoon) * 100)}% de não conclusão).`,
            type: 'warning',
          })
        }
      }
    })

    return suggestions
  }, [filteredUsers, rotinasPontos, execucoes, rotinasConfig])

  const exportToCsv = () => {
    const headers = ['Data', 'Colaborador', 'Cargo', 'Percentual', 'Pontos']
    const rows = rotinasPontos
      .filter(
        (rp) =>
          selectedCargo === 'all' ||
          profiles.find((p) => p.id === rp.usuario_id)?.cargo_id === selectedCargo,
      )
      .map((rp) => {
        const user = profiles.find((u) => u.id === rp.usuario_id)
        const cargo = cargos.find((c) => c.id === user?.cargo_id)
        return [
          rp.data,
          `"${user?.nome || user?.email || 'Desconhecido'}"`,
          `"${cargo?.nome || 'Sem Cargo'}"`,
          rp.percentual,
          rp.pontos,
        ].join(',')
      })

    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `relatorio_rotinas_${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 space-y-6 bg-[#060D18] min-h-full text-slate-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
            <FileText className="mr-3 h-6 w-6 text-[#D4AF37]" />
            Relatório de Rotinas
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Análise gerencial de performance e conclusão de tarefas da equipe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] bg-[#0A192F] border-white/10 text-white">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A192F] border-white/10 text-white">
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="15d">Últimos 15 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCargo} onValueChange={setSelectedCargo}>
            <SelectTrigger className="w-[180px] bg-[#0A192F] border-white/10 text-white">
              <SelectValue placeholder="Cargo" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A192F] border-white/10 text-white">
              <SelectItem value="all">Todos os Cargos</SelectItem>
              {cargos.map((cargo) => (
                <SelectItem key={cargo.id} value={cargo.id}>
                  {cargo.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={exportToCsv}
            variant="outline"
            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#060D18] transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Skeleton className="h-[400px] lg:col-span-2 bg-white/5 rounded-xl" />
          <Skeleton className="h-[400px] bg-white/5 rounded-xl" />
        </div>
      ) : !hasAnyRoutine ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
            <FileText className="h-8 w-8 text-slate-500" />
          </div>
          <h2 className="text-xl font-medium text-white">Nenhuma rotina cadastrada no sistema</h2>
          <p className="text-slate-400 max-w-md">
            Você ainda não possui rotinas configuradas para serem analisadas no relatório.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          <Card className="xl:col-span-2 bg-[#0A192F] border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white">
                Evolução de Produtividade (%)
              </CardTitle>
              <CardDescription className="text-slate-400">
                Acompanhamento diário da taxa de conclusão de rotinas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-slate-500 text-sm">
                  Sem dados para o período selecionado.
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(255,255,255,0.1)"
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(val) => format(parseISO(val), 'dd/MM')}
                        stroke="rgba(255,255,255,0.5)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `${val}%`}
                        domain={[0, 100]}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      {filteredUsers.map((user) => (
                        <Line
                          key={user.id}
                          type="monotone"
                          dataKey={safeId(user.id)}
                          name={user.nome || user.email}
                          stroke={`var(--color-${safeId(user.id)})`}
                          strokeWidth={2}
                          connectNulls
                          dot={{ r: 3, fill: `var(--color-${safeId(user.id)})`, strokeWidth: 0 }}
                          activeDot={{ r: 5 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#0A192F] border-white/10 flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                Inteligência Analítica
              </CardTitle>
              <CardDescription className="text-slate-400">
                Padrões identificados pelo sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto custom-scrollbar max-h-[300px] xl:max-h-[300px] pr-2 space-y-3">
              {insights.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm py-10">
                  Nenhum padrão crítico identificado no período.
                </div>
              ) : (
                insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 shadow-sm"
                  >
                    {insight.type === 'warning' ? (
                      <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    ) : (
                      <Activity className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{insight.user}</p>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{insight.text}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="xl:col-span-3 bg-[#0A192F] border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white">
                Desempenho Consolidado
              </CardTitle>
              <CardDescription className="text-slate-400">
                Média de conclusão de tarefas no período selecionado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-slate-300">Colaborador</TableHead>
                      <TableHead className="text-slate-300 hidden md:table-cell">Cargo</TableHead>
                      <TableHead className="text-slate-300 text-center">Dias Avaliados</TableHead>
                      <TableHead className="text-slate-300 text-right">Desempenho Médio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.length === 0 ? (
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell colSpan={4} className="text-center text-slate-500 py-6">
                          Nenhum colaborador encontrado para este filtro.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tableData.map((row) => (
                        <TableRow
                          key={row.id}
                          className="border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <TableCell className="font-medium text-white">{row.nome}</TableCell>
                          <TableCell className="text-slate-400 hidden md:table-cell">
                            {row.cargo}
                          </TableCell>
                          <TableCell className="text-slate-400 text-center">
                            {row.tarefasFeitas} dias
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className={
                                row.media >= 90
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : row.media >= 70
                                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }
                            >
                              {row.media.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
