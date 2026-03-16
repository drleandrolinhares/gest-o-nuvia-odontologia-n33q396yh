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
import { isSameDay, isSameWeek, isSameMonth, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { AgendaCard } from '@/components/agenda/AgendaCard'
import { AgendaAddDialog } from '@/components/agenda/AgendaAddDialog'
import { AgendaDetailsDialog } from '@/components/agenda/AgendaDetailsDialog'
import { DentistAbsenceDialog } from '@/components/agenda/DentistAbsenceDialog'

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
  const [taskView, setTaskView] = useState<'PARA MIM' | 'DELEGADOS' | 'DENTISTAS' | 'TUDO'>(
    'PARA MIM',
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())

  const [agendaFilterType, setAgendaFilterType] = useState<'TODOS' | 'COLABORADOR' | 'SETOR'>(
    'TODOS',
  )
  const [agendaFilterValue, setAgendaFilterValue] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState(false)

  const activeEmployees = employees.filter((e) => e.status !== 'Desligado')

  const allAgendaItems = useMemo(() => {
    return agenda.filter((a) => showCompleted || !a.is_completed)
  }, [agenda, showCompleted])

  const filteredAgenda = allAgendaItems
    .filter((item) => {
      if (!selectedDate) return true
      const itemDate = parseISO(item.date)
      if (filterView === 'DIA') return isSameDay(itemDate, selectedDate)
      if (filterView === 'SEMANA') return isSameWeek(itemDate, selectedDate, { weekStartsOn: 0 })
      if (filterView === 'MES') return isSameMonth(itemDate, selectedDate)
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
      if (taskView === 'DENTISTAS') return item.type === 'COMPROMISSO DENTISTA'
      if (taskView === 'TUDO') return true
      if (taskView === 'DELEGADOS') return item.requester_id === currentUserId

      // PARA MIM
      // In PARA MIM, we generally hide COMPROMISSO DENTISTA unless specifically assigned to me,
      // but typically we can exclude them completely to avoid cluttering the personal view,
      // or keep them if they are my own absences. Let's keep them if it's assigned to me.
      if (item.type === 'COMPROMISSO DENTISTA' && item.assignedTo !== currentUserId) return false
      return item.assignedTo === currentUserId || !item.assignedTo || item.assignedTo === 'none'
    })
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime(),
    )

  const datesWithPendingEvents = useMemo(() => {
    return agenda.filter((a) => !a.is_completed).map((item) => parseISO(item.date))
  }, [agenda])

  const goToToday = () => {
    const today = new Date()
    setSelectedDate(today)
    setCalendarMonth(today)
    setFilterView('DIA')
  }

  const handleUpdateItem = (id: string, data: Partial<AgendaItem>) => {
    updateAgendaItem(id, data)
    if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, ...data })
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">AGENDA E PEDIDOS</h1>
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
          <Button onClick={() => setOpenAdd(true)} className="bg-primary text-primary-foreground">
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
              className="h-7 px-3 text-[10px] font-bold tracking-widest text-primary border-primary/30 hover:bg-primary/10"
            >
              HOJE
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(day) => day && setSelectedDate(day)}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            locale={ptBR}
            modifiers={{ booked: datesWithPendingEvents }}
            modifiersClassNames={{
              booked:
                'relative font-bold text-primary after:content-[""] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:h-1.5 after:w-1.5 after:bg-primary after:rounded-full',
            }}
            className="w-full mx-auto pb-4"
          />
        </Card>

        <div className="lg:col-span-8 space-y-4 order-1 lg:order-2">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-muted/30 p-2 rounded-lg border">
            <Tabs
              value={filterView}
              onValueChange={(v) => setFilterView(v as any)}
              className="w-full xl:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full xl:w-[250px]">
                <TabsTrigger value="DIA">DIA</TabsTrigger>
                <TabsTrigger value="SEMANA">SEMANA</TabsTrigger>
                <TabsTrigger value="MES">MÊS</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto flex-1 justify-end">
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

          <div className="flex justify-start overflow-x-auto custom-scrollbar">
            <Tabs
              value={taskView}
              onValueChange={(v) => setTaskView(v as any)}
              className="w-full sm:w-auto min-w-max"
            >
              <TabsList className="bg-transparent border-b rounded-none w-full sm:w-auto justify-start h-12 p-0 gap-6">
                <TabsTrigger
                  value="PARA MIM"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent"
                >
                  PARA MIM
                </TabsTrigger>
                <TabsTrigger
                  value="DELEGADOS"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent"
                >
                  DELEGADOS POR MIM
                </TabsTrigger>
                <TabsTrigger
                  value="DENTISTAS"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-rose-600 data-[state=active]:text-rose-700 data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent"
                >
                  COMPROMISSOS DENTISTAS
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger
                    value="TUDO"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent"
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
                NENHUM REGISTRO ENCONTRADO PARA OS FILTROS SELECIONADOS.
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
