import { useState, useMemo } from 'react'
import useAppStore, { AgendaItem } from '@/stores/main'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, UserMinus } from 'lucide-react'
import { isSameWeek, isSameMonth, startOfDay, endOfDay, eachDayOfInterval, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { AgendaCard } from '@/components/agenda/AgendaCard'
import { AgendaAddDialog } from '@/components/agenda/AgendaAddDialog'
import { AgendaDetailsDialog } from '@/components/agenda/AgendaDetailsDialog'
import { DentistAbsenceDialog } from '@/components/agenda/DentistAbsenceDialog'
import { ABSENCE_TYPES } from '@/lib/constants'

const getLocalDate = (dStr: string) => {
  if (!dStr) return new Date()
  return new Date(`${dStr}T00:00:00`)
}

export default function Agenda() {
  const {
    agenda,
    addAgendaItem,
    removeAgendaItem,
    updateAgendaItem,
    currentUserId,
    employees,
    departments,
    agendaTypes,
    isAdmin,
  } = useAppStore()

  const [openAdd, setOpenAdd] = useState(false)
  const [openDentistAdd, setOpenDentistAdd] = useState(false)
  const [selectedItem, setSelectedItem] = useState<AgendaItem | null>(null)

  const [filterView, setFilterView] = useState<'DIA' | 'SEMANA' | 'MES'>('DIA')
  const [taskView, setTaskView] = useState<
    'PARA MIM' | 'DELEGADOS' | 'COMPROMISSOS' | 'AUSÊNCIAS' | 'ALERTAS' | 'TUDO'
  >('PARA MIM')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())

  const [agendaFilterType, setAgendaFilterType] = useState<'TODOS' | 'COLABORADOR' | 'SETOR'>(
    'TODOS',
  )
  const [agendaFilterValue, setAgendaFilterValue] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState(false)
  const [showOpenOnly, setShowOpenOnly] = useState(false)

  const activeEmployees = employees.filter((e) => e.status !== 'Desligado')

  const allAgendaItems = useMemo(() => {
    return agenda.filter((a) => showCompleted || !a.is_completed)
  }, [agenda, showCompleted])

  const filteredAgenda = allAgendaItems
    .filter((item) => {
      if (showOpenOnly) {
        if (item.is_completed) return false
        if (!isAdmin && item.assignedTo !== currentUserId) return false
        return true
      }

      // If COMPROMISSOS or AUSÊNCIAS or ALERTAS, we ignore calendar selection entirely for indefinite future display
      if (taskView === 'COMPROMISSOS' || taskView === 'AUSÊNCIAS' || taskView === 'ALERTAS')
        return true

      if (!selectedDate) return true
      const startD = getLocalDate(item.date)
      const endD = getLocalDate(item.end_date || item.date)

      if (filterView === 'DIA') {
        return selectedDate >= startOfDay(startD) && selectedDate <= endOfDay(endD)
      }
      if (filterView === 'SEMANA')
        return (
          isSameWeek(startD, selectedDate, { weekStartsOn: 0 }) ||
          isSameWeek(endD, selectedDate, { weekStartsOn: 0 }) ||
          (startD <= selectedDate && endD >= selectedDate)
        )
      if (filterView === 'MES')
        return (
          isSameMonth(startD, selectedDate) ||
          isSameMonth(endD, selectedDate) ||
          (startD <= selectedDate && endD >= selectedDate)
        )
      return true
    })
    .filter((item) => {
      if (showOpenOnly) return true

      // Enforce date >= today for these tab views
      if (taskView === 'COMPROMISSOS' || taskView === 'AUSÊNCIAS' || taskView === 'ALERTAS') {
        const todayStr = format(new Date(), 'yyyy-MM-dd')
        return item.date >= todayStr || (item.end_date && item.end_date >= todayStr)
      }
      return true
    })
    .filter((item) => {
      // General filters still apply in all views
      if (agendaFilterType === 'TODOS' || agendaFilterValue === 'all') return true
      if (agendaFilterType === 'COLABORADOR') return item.assignedTo === agendaFilterValue
      if (agendaFilterType === 'SETOR') {
        const emp = employees.find((e) => e.id === item.assignedTo)
        return emp?.department === agendaFilterValue
      }
      return true
    })
    .filter((item) => {
      if (showOpenOnly) return true

      if (taskView === 'TUDO') return true
      if (taskView === 'DELEGADOS') return item.requester_id === currentUserId

      const isAlert = ['BÔNUS', 'FÉRIAS', 'SAC'].includes(item.type.toUpperCase())

      if (taskView === 'ALERTAS') {
        return isAlert
      }

      if (taskView === 'COMPROMISSOS') {
        return (
          !ABSENCE_TYPES.includes(item.type.toLowerCase()) &&
          item.type !== 'manual_absence' &&
          !isAlert
        )
      }

      if (taskView === 'AUSÊNCIAS') {
        return item.type === 'manual_absence' || ABSENCE_TYPES.includes(item.type.toLowerCase())
      }

      // PARA MIM
      if (isAlert && item.assignedTo !== currentUserId) return false
      if (
        (item.type === 'manual_absence' || ABSENCE_TYPES.includes(item.type.toLowerCase())) &&
        item.assignedTo !== currentUserId
      )
        return false
      return item.assignedTo === currentUserId || !item.assignedTo || item.assignedTo === 'none'
    })
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime(),
    )

  const datesWithPendingEvents = useMemo(() => {
    return agenda
      .filter((a) => !a.is_completed && a.date === (a.end_date || a.date))
      .map((item) => getLocalDate(item.date))
  }, [agenda])

  const multiDayDates = useMemo(() => {
    const dates: Date[] = []
    agenda
      .filter((a) => !a.is_completed)
      .forEach((item) => {
        const start = getLocalDate(item.date)
        const end = getLocalDate(item.end_date || item.date)
        if (start < end) {
          try {
            const interval = eachDayOfInterval({ start, end })
            dates.push(...interval)
          } catch (e) {
            // Ignore invalid intervals
          }
        }
      })
    return dates
  }, [agenda])

  const goToToday = () => {
    const today = new Date()
    setSelectedDate(today)
    setCalendarMonth(today)
    setFilterView('DIA')
    setShowOpenOnly(false)
  }

  const handleUpdateItem = (id: string, data: Partial<AgendaItem>) => {
    updateAgendaItem(id, data)
    if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, ...data } as AgendaItem)
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0A192F]">AGENDA E PEDIDOS</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            GERENCIE COMPROMISSOS E ACOMPANHE PEDIDOS DELEGADOS.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setOpenDentistAdd(true)}
            className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
          >
            <UserMinus className="h-4 w-4 mr-2" /> NOVA AUSÊNCIA
          </Button>
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-[#0A192F] text-[#D4AF37] hover:bg-[#112240] font-bold shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" /> NOVO REGISTRO
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <Card className="lg:col-span-4 p-2 shadow-sm order-2 lg:order-1 flex flex-col gap-1">
          <div className="flex justify-between items-center px-4 pt-3 pb-2 border-b border-muted/60">
            <span className="text-xs font-bold text-muted-foreground tracking-widest">
              NAVEGAÇÃO
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="h-7 px-3 text-[10px] font-bold tracking-widest text-[#0A192F] border-[#0A192F]/30 hover:bg-[#0A192F]/10"
            >
              HOJE
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(day) => {
              if (day) {
                setSelectedDate(day)
                setShowOpenOnly(false)
              }
            }}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            locale={ptBR}
            modifiers={{ booked: datesWithPendingEvents, multiDay: multiDayDates }}
            modifiersClassNames={{
              booked:
                'relative font-bold text-[#0A192F] after:content-[""] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[3px] after:bg-[#0A192F] after:rounded-full',
              multiDay:
                'relative font-bold text-[#D4AF37] after:content-[""] after:absolute after:bottom-0.5 after:left-0 after:right-0 after:h-[3px] after:bg-[#D4AF37]',
            }}
            className="w-full mx-auto pb-4"
          />
        </Card>

        <div className="lg:col-span-8 space-y-4 order-1 lg:order-2">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-muted/30 p-2 rounded-lg border">
            <Tabs
              value={filterView}
              onValueChange={(v) => {
                setFilterView(v as any)
                setShowOpenOnly(false)
              }}
              className="w-full xl:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full xl:w-[250px]">
                <TabsTrigger value="DIA">DIA</TabsTrigger>
                <TabsTrigger value="SEMANA">SEMANA</TabsTrigger>
                <TabsTrigger value="MES">MÊS</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto flex-1 justify-end">
              <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-md h-10 transition-colors">
                <Switch
                  checked={showOpenOnly}
                  onCheckedChange={setShowOpenOnly}
                  id="show-open"
                  className="data-[state=checked]:bg-amber-500"
                />
                <label
                  htmlFor="show-open"
                  className="text-xs font-bold cursor-pointer whitespace-nowrap uppercase"
                >
                  EM ABERTO
                </label>
              </div>

              <div className="flex items-center space-x-2 bg-background border px-3 py-2 rounded-md h-10">
                <Switch
                  checked={showCompleted}
                  onCheckedChange={setShowCompleted}
                  id="show-completed"
                />
                <label
                  htmlFor="show-completed"
                  className="text-xs font-bold cursor-pointer whitespace-nowrap"
                >
                  CONCLUÍDOS
                </label>
              </div>

              <Select
                value={agendaFilterType}
                onValueChange={(v: any) => {
                  setAgendaFilterType(v)
                  setAgendaFilterValue('all')
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="FILTRAR POR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">GERAL</SelectItem>
                  <SelectItem value="COLABORADOR">POR COLABORADOR</SelectItem>
                  <SelectItem value="SETOR">POR SETOR</SelectItem>
                </SelectContent>
              </Select>

              {agendaFilterType === 'COLABORADOR' && (
                <Select value={agendaFilterValue} onValueChange={setAgendaFilterValue}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="SELECIONE..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">TODOS</SelectItem>
                    {activeEmployees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {agendaFilterType === 'SETOR' && (
                <Select value={agendaFilterValue} onValueChange={setAgendaFilterValue}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="SELECIONE..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">TODOS</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="flex justify-start overflow-x-auto custom-scrollbar border-b">
            <Tabs
              value={showOpenOnly ? 'TUDO' : taskView}
              onValueChange={(v) => {
                setTaskView(v as any)
                setShowOpenOnly(false)
              }}
              className="w-full sm:w-auto min-w-max"
            >
              <TabsList className="bg-transparent rounded-none w-full sm:w-auto justify-start h-12 p-0 gap-6">
                <TabsTrigger
                  value="PARA MIM"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#0A192F] data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent"
                >
                  PARA MIM
                </TabsTrigger>
                <TabsTrigger
                  value="DELEGADOS"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#0A192F] data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent"
                >
                  DELEGADOS POR MIM
                </TabsTrigger>
                <TabsTrigger
                  value="COMPROMISSOS"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#0A192F] data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent"
                >
                  COMPROMISSOS
                </TabsTrigger>
                <TabsTrigger
                  value="AUSÊNCIAS"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-rose-600 data-[state=active]:text-rose-700 data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent"
                >
                  AUSÊNCIAS
                </TabsTrigger>
                <TabsTrigger
                  value="ALERTAS"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-600 data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent"
                >
                  ALERTAS DE SISTEMA
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger
                    value="TUDO"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#0A192F] data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent"
                  >
                    VISÃO GERAL (ADMIN)
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-3 pt-2">
            {filteredAgenda.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-lg bg-card/50">
                {showOpenOnly
                  ? 'NENHUMA TAREFA PENDENTE ENCONTRADA.'
                  : taskView === 'COMPROMISSOS'
                    ? 'NENHUM COMPROMISSO ENCONTRADO PARA OS FILTROS SELECIONADOS.'
                    : taskView === 'AUSÊNCIAS'
                      ? 'NENHUMA AUSÊNCIA AGENDADA PARA OS FILTROS SELECIONADOS.'
                      : taskView === 'ALERTAS'
                        ? 'NENHUM ALERTA DE SISTEMA ENCONTRADO PARA OS FILTROS SELECIONADOS.'
                        : 'NENHUM REGISTRO ENCONTRADO PARA OS FILTROS SELECIONADOS.'}
              </div>
            ) : (
              filteredAgenda.map((item) => (
                <AgendaCard
                  key={item.id}
                  item={item}
                  currentUserId={currentUserId}
                  employees={employees}
                  onSelect={setSelectedItem}
                  onUpdate={handleUpdateItem}
                  onRemove={removeAgendaItem}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <AgendaAddDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onAdd={addAgendaItem}
        employees={employees}
        agendaTypes={agendaTypes}
        currentUserId={currentUserId}
      />
      <DentistAbsenceDialog
        open={openDentistAdd}
        onOpenChange={setOpenDentistAdd}
        onAdd={addAgendaItem}
        employees={employees}
        currentUserId={currentUserId}
      />
      <AgendaDetailsDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onUpdate={handleUpdateItem}
        employees={employees}
        currentUserId={currentUserId}
      />
    </div>
  )
}
