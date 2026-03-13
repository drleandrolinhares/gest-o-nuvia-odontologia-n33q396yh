import { useState, useMemo } from 'react'
import useAppStore, { AgendaItem } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  Plus,
  Users,
  MapPin,
  Bell,
  Stethoscope,
  User,
  CalendarDays,
  DollarSign,
} from 'lucide-react'
import { isSameDay, isSameWeek, isSameMonth, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
  } = useAppStore()

  const [openAdd, setOpenAdd] = useState(false)
  const [selectedItem, setSelectedItem] = useState<AgendaItem | null>(null)

  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [involvesThirdParty, setInvolvesThirdParty] = useState(false)
  const [thirdPartyDetails, setThirdPartyDetails] = useState('')

  const [filterView, setFilterView] = useState<'DIA' | 'SEMANA' | 'MES'>('DIA')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const [agendaFilterType, setAgendaFilterType] = useState<'TODOS' | 'COLABORADOR' | 'SETOR'>(
    'TODOS',
  )
  const [agendaFilterValue, setAgendaFilterValue] = useState<string>('all')

  const currentUser = employees.find((e) => e.id === currentUserId)

  const activeEmployees = employees.filter((e) => e.status !== 'Desligado')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && date && time && location && type) {
      addAgendaItem({
        title: title.toUpperCase(),
        date,
        time,
        location: location.toUpperCase(),
        type,
        assignedTo,
        involvesThirdParty,
        thirdPartyDetails: involvesThirdParty ? thirdPartyDetails.toUpperCase() : '',
        createdBy: currentUser?.name || 'ADMIN',
        is_completed: false,
      })
      setOpenAdd(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setTitle('')
    setType('')
    setDate('')
    setTime('')
    setLocation('')
    setAssignedTo('')
    setInvolvesThirdParty(false)
    setThirdPartyDetails('')
  }

  const getIcon = (type: string) => {
    const t = type.toUpperCase()
    if (t.includes('REUNIÃO')) return <Users className="h-5 w-5 text-blue-500" />
    if (t.includes('VIAGEM')) return <MapPin className="h-5 w-5 text-emerald-500" />
    if (t.includes('LEMBRETE')) return <Bell className="h-5 w-5 text-amber-500" />
    if (t.includes('CONSULTA')) return <Stethoscope className="h-5 w-5 text-[#D81B84]" />
    if (t.includes('COMISSÃO')) return <DollarSign className="h-5 w-5 text-emerald-600" />
    return <Clock className="h-5 w-5 text-primary" />
  }

  const allAgendaItems = useMemo(() => {
    const dbItems = agenda.filter((a) => !a.is_completed)

    const dbCommissionsMap = new Set(
      agenda
        .filter((a) => a.type.toUpperCase() === 'COMISSÃO')
        .map((a) => `${a.assignedTo}||${a.date}`),
    )

    const virtuals: AgendaItem[] = activeEmployees
      .filter((e) => e.role.toUpperCase().includes('DENTISTA') && e.bonusDueDate)
      .filter((e) => !dbCommissionsMap.has(`${e.id}||${e.bonusDueDate}`))
      .map((e) => ({
        id: `virtual||${e.id}||${e.bonusDueDate}`,
        title: `PAGAMENTO COMISSÃO - ${e.name}`,
        date: e.bonusDueDate as string,
        time: '08:00',
        location: 'FINANCEIRO',
        type: 'Comissão',
        assignedTo: e.id,
        is_completed: false,
        createdBy: 'SISTEMA',
      }))

    return [...dbItems, ...virtuals]
  }, [agenda, activeEmployees])

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
      if (agendaFilterType === 'TODOS' || agendaFilterValue === 'all') return true
      if (agendaFilterType === 'COLABORADOR') return item.assignedTo === agendaFilterValue
      if (agendaFilterType === 'SETOR') {
        const emp = employees.find((e) => e.id === item.assignedTo)
        return emp?.department === agendaFilterValue
      }
      return true
    })
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime(),
    )

  const datesWithEvents = allAgendaItems.map((item) => parseISO(item.date))

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">AGENDA</h1>
          <p className="text-muted-foreground mt-1">
            GERENCIE COMPROMISSOS, REUNIÕES E LEMBRETES DA CLÍNICA.
          </p>
        </div>
        <Button onClick={() => setOpenAdd(true)} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> NOVO COMPROMISSO
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Sidebar */}
        <Card className="lg:col-span-4 p-2 shadow-sm order-2 lg:order-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(day) => day && setSelectedDate(day)}
            locale={ptBR}
            modifiers={{ booked: datesWithEvents }}
            modifiersClassNames={{
              booked: 'font-bold underline decoration-primary decoration-2 underline-offset-4',
            }}
            className={'w-full mx-auto'}
          />
        </Card>

        {/* List View */}
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
              <Select
                value={agendaFilterType}
                onValueChange={(v: any) => {
                  setAgendaFilterType(v)
                  setAgendaFilterValue('all')
                }}
              >
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="FILTRAR POR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">TODOS OS COMPROMISSOS</SelectItem>
                  <SelectItem value="COLABORADOR">FILTRAR POR COLABORADOR</SelectItem>
                  <SelectItem value="SETOR">FILTRAR POR SETOR</SelectItem>
                </SelectContent>
              </Select>

              {agendaFilterType === 'COLABORADOR' && (
                <Select value={agendaFilterValue} onValueChange={setAgendaFilterValue}>
                  <SelectTrigger className="w-full sm:w-[200px]">
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
                  <SelectTrigger className="w-full sm:w-[200px]">
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

            <div className="text-sm font-bold text-primary px-4 py-2 bg-background border rounded-md whitespace-nowrap hidden xl:block">
              {selectedDate?.toLocaleDateString('pt-BR', { dateStyle: 'short' })}
            </div>
          </div>

          <div className="grid gap-3">
            {filteredAgenda.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-lg bg-card/50 uppercase">
                NENHUM COMPROMISSO ENCONTRADO PARA OS FILTROS SELECIONADOS.
              </div>
            ) : (
              filteredAgenda.map((item) => (
                <Card
                  key={item.id}
                  className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer group"
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        {getIcon(item.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg uppercase">
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1 font-medium text-primary">
                            <Clock className="h-3 w-3" /> {item.time}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />{' '}
                            {new Date(item.date).toLocaleDateString('pt-BR')}
                          </span>
                          <span>•</span>
                          <span className="bg-muted px-2 py-0.5 rounded text-xs font-bold uppercase">
                            {item.type}
                          </span>
                          {item.assignedTo && item.assignedTo !== 'none' && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-indigo-600 uppercase">
                                <User className="h-3 w-3" />
                                {employees.find((e) => e.id === item.assignedTo)?.name ||
                                  'DESCONHECIDO'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {item.id.startsWith('virtual||') ? null : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeAgendaItem(item.id)
                        }}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog
        open={openAdd}
        onOpenChange={(o) => {
          setOpenAdd(o)
          if (!o) resetForm()
        }}
      >
        <DialogContent className="max-w-lg uppercase">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="h-5 w-5 text-primary" /> ADICIONAR NOVO COMPROMISSO
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                TÍTULO DO COMPROMISSO *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="EX: REUNIÃO DE RESULTADOS"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  TIPO DE COMPROMISSO *
                </label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="SELECIONE..." />
                  </SelectTrigger>
                  <SelectContent>
                    {agendaTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  ATRIBUIR A UM COLABORADOR
                </label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="GERAL / CLÍNICA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">GERAL / CLÍNICA</SelectItem>
                    {activeEmployees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">DATA *</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">HORÁRIO *</label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">LOCAL *</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="SALA 1, ONLINE, ETC."
              />
            </div>

            <div className="pt-4 border-t border-muted">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-foreground">
                  COMPROMISSO ENVOLVE TERCEIROS?
                </label>
                <Switch checked={involvesThirdParty} onCheckedChange={setInvolvesThirdParty} />
              </div>
              {involvesThirdParty && (
                <div className="mt-3 space-y-2 animate-fade-in-up">
                  <label className="text-xs font-semibold text-muted-foreground">
                    DETALHES DOS TERCEIROS (NOME, EMPRESA, ETC)
                  </label>
                  <Textarea
                    value={thirdPartyDetails}
                    onChange={(e) => setThirdPartyDetails(e.target.value)}
                    placeholder="INFORME OS DADOS DE QUEM ESTARÁ PRESENTE..."
                    required={involvesThirdParty}
                    rows={2}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpenAdd(false)}>
                CANCELAR
              </Button>
              <Button type="submit">SALVAR COMPROMISSO</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(o) => !o && setSelectedItem(null)}>
        <DialogContent className="max-w-md uppercase">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-primary border-b pb-4">
              DETALHES DO COMPROMISSO
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="mt-4 space-y-5">
              <div>
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {selectedItem.title}
                </h3>
                <div className="inline-block mt-2 bg-muted px-2 py-1 rounded text-xs font-bold">
                  {selectedItem.type}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border shadow-sm">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">DATA</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedItem.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">HORÁRIO</p>
                    <p className="text-sm font-medium text-primary">{selectedItem.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 col-span-2">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">LOCAL</p>
                    <p className="text-sm font-medium">{selectedItem.location}</p>
                  </div>
                </div>
                {selectedItem.assignedTo && selectedItem.assignedTo !== 'none' && (
                  <div className="flex items-start gap-3 col-span-2 pt-2 border-t border-muted/50">
                    <User className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">ATRIBUÍDO A</p>
                      <p className="text-sm font-bold text-indigo-700">
                        {employees.find((e) => e.id === selectedItem.assignedTo)?.name ||
                          'DESCONHECIDO'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedItem.involvesThirdParty && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" /> ENVOLVE TERCEIROS
                  </h4>
                  <p className="text-sm text-amber-800 bg-white/50 p-3 rounded border border-amber-100 whitespace-pre-wrap">
                    {selectedItem.thirdPartyDetails}
                  </p>
                </div>
              )}

              <p className="text-xs text-muted-foreground text-right">
                CRIADO POR: {selectedItem.createdBy || 'SISTEMA'}
              </p>

              <div className="flex justify-end pt-4 border-t gap-3 items-center w-full">
                {selectedItem.type.toUpperCase() === 'COMISSÃO' && (
                  <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 mr-auto">
                    <Checkbox
                      id="pagamento-concluido"
                      checked={selectedItem.is_completed}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          if (selectedItem.id.startsWith('virtual||')) {
                            addAgendaItem({
                              title: selectedItem.title,
                              date: selectedItem.date,
                              time: selectedItem.time,
                              location: selectedItem.location,
                              type: selectedItem.type,
                              assignedTo: selectedItem.assignedTo,
                              is_completed: true,
                              createdBy: 'SISTEMA',
                            })
                          } else {
                            updateAgendaItem(selectedItem.id, { is_completed: true })
                          }
                          setSelectedItem(null)
                        }
                      }}
                    />
                    <label
                      htmlFor="pagamento-concluido"
                      className="text-xs font-bold text-emerald-900 cursor-pointer uppercase"
                    >
                      PAGAMENTO CONCLUÍDO
                    </label>
                  </div>
                )}
                <Button variant="outline" onClick={() => setSelectedItem(null)}>
                  FECHAR
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
