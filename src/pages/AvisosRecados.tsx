import { useState, useMemo } from 'react'
import useAppStore, { AgendaItem } from '@/stores/main'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Filter, Check } from 'lucide-react'
import { isSameWeek, isSameMonth, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { AgendaCard } from '@/components/agenda/AgendaCard'
import { AgendaAddDialog } from '@/components/agenda/AgendaAddDialog'
import { AgendaDetailsDialog } from '@/components/agenda/AgendaDetailsDialog'
import { ABSENCE_TYPES } from '@/lib/constants'

const getLocalDate = (dStr: string) => {
  if (!dStr) return new Date()
  return new Date(`${dStr}T00:00:00`)
}

export default function AvisosRecados() {
  const {
    agenda,
    addAgendaItem,
    removeAgendaItem,
    updateAgendaItem,
    currentUserId,
    agendaTypes,
    isAdmin,
  } = useAppStore()

  const [openAdd, setOpenAdd] = useState(false)
  const [selectedItem, setSelectedItem] = useState<AgendaItem | null>(null)

  const [filterView, setFilterView] = useState<'DIA' | 'SEMANA' | 'MES'>('DIA')
  const [taskView, setTaskView] = useState<
    | 'PARA MIM'
    | 'AUSÊNCIAS'
    | 'COMPROMISSOS'
    | 'ALERTAS DO SISTEMA'
    | 'DELEGADOS POR MIM'
    | 'VISÃO GERAL (ADMIN)'
  >('PARA MIM')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())

  const [showOpen, setShowOpen] = useState(true)
  const [showCompleted, setShowCompleted] = useState(false)
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set())

  const toggleTypeFilter = (type: string) => {
    setHiddenTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const filteredAgenda =
    agenda ||
    []
      .filter((item) => {
        if (!showOpen && !item.is_completed) return false
        if (!showCompleted && item.is_completed) return false
        if (hiddenTypes.has(item.type)) return false
        return true
      })
      .filter((item) => {
        if (!selectedDate) return true
        const startD = getLocalDate(item.date)
        const endD = getLocalDate(item.end_date || item.date)

        if (filterView === 'DIA') {
          return selectedDate >= startOfDay(startD) && selectedDate <= endOfDay(endD)
        }
        if (filterView === 'SEMANA') {
          return (
            isSameWeek(startD, selectedDate, { weekStartsOn: 0 }) ||
            isSameWeek(endD, selectedDate, { weekStartsOn: 0 }) ||
            (startD <= selectedDate && endD >= selectedDate)
          )
        }
        if (filterView === 'MES') {
          return (
            isSameMonth(startD, selectedDate) ||
            isSameMonth(endD, selectedDate) ||
            (startD <= selectedDate && endD >= selectedDate)
          )
        }
        return true
      })
      .filter((item) => {
        if (taskView === 'VISÃO GERAL (ADMIN)') return true
        if (taskView === 'DELEGADOS POR MIM') return item.requester_id === currentUserId

        const isAlert = ['BÔNUS', 'FÉRIAS', 'SAC'].includes(item.type.toUpperCase())

        if (taskView === 'ALERTAS DO SISTEMA') {
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
        return true
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
            // ignore invalid interval errors
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
  }

  const handleUpdateItem = (id: string, data: Partial<AgendaItem>) => {
    updateAgendaItem(id, data)
    if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, ...data } as AgendaItem)
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0A192F]">AVISOS E RECADOS</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            MENSAGENS RÁPIDAS E NOTIFICAÇÕES INTERNAS PARA A EQUIPE.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            onSelect={(day) => day && setSelectedDate(day)}
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-amber-200 text-amber-900 bg-amber-50 h-10 w-full sm:w-auto shadow-sm"
                  >
                    <Filter className="h-4 w-4 mr-2" /> VISIBILIDADE
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 uppercase" align="end">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-muted-foreground border-b pb-1">
                        STATUS DOS REGISTROS
                      </h4>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold cursor-pointer" htmlFor="showOpen">
                          EM ABERTO
                        </label>
                        <Switch
                          id="showOpen"
                          checked={showOpen}
                          onCheckedChange={setShowOpen}
                          className="data-[state=checked]:bg-amber-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold cursor-pointer" htmlFor="showCompleted">
                          CONCLUÍDOS
                        </label>
                        <Switch
                          id="showCompleted"
                          checked={showCompleted}
                          onCheckedChange={setShowCompleted}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-muted-foreground border-b pb-1">
                        CATEGORIAS
                      </h4>
                      <div className="max-h-[200px] overflow-y-auto space-y-1.5 pr-2">
                        {agendaTypes.map((type) => (
                          <div
                            key={type}
                            className="flex items-center gap-2"
                            onClick={() => toggleTypeFilter(type)}
                          >
                            <div
                              className={cn(
                                'w-4 h-4 border rounded flex items-center justify-center cursor-pointer transition-colors',
                                !hiddenTypes.has(type)
                                  ? 'bg-[#0A192F] border-[#0A192F]'
                                  : 'border-muted-foreground',
                              )}
                            >
                              {!hiddenTypes.has(type) && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-xs font-medium cursor-pointer">{type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-start overflow-x-auto custom-scrollbar border-b border-muted">
            <Tabs
              value={taskView}
              onValueChange={(v) => setTaskView(v as any)}
              className="w-full sm:w-auto min-w-max"
            >
              <TabsList className="bg-transparent rounded-none w-full sm:w-auto justify-start h-12 p-0 gap-6">
                {['PARA MIM', 'COMPROMISSOS', 'ALERTAS DO SISTEMA'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#0A192F] data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent font-bold"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
                {isAdmin && (
                  <TabsTrigger
                    value="VISÃO GERAL (ADMIN)"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none rounded-none px-0 py-3 data-[state=active]:bg-transparent font-bold ml-6"
                  >
                    VISÃO GERAL (ADMIN)
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-3 pt-2">
            {filteredAgenda.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-lg bg-card/50 font-bold">
                NENHUM REGISTRO ENCONTRADO PARA OS FILTROS SELECIONADOS.
              </div>
            ) : (
              filteredAgenda.map((item) => (
                <AgendaCard
                  key={item.id}
                  item={item}
                  currentUserId={currentUserId}
                  employees={[]}
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
        employees={[]}
        agendaTypes={agendaTypes}
        currentUserId={currentUserId}
      />
      <AgendaDetailsDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onUpdate={handleUpdateItem}
        employees={[]}
        currentUserId={currentUserId}
      />
    </div>
  )
}
