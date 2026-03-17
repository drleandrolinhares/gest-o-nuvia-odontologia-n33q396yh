import { useState, useMemo } from 'react'
import useAppStore from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Grid,
  Plus,
  Stethoscope,
  User,
  MapPin,
  Activity,
  CheckSquare,
  ListPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const DAYS = [
  { id: 1, label: 'SEGUNDA' },
  { id: 2, label: 'TERÇA' },
  { id: 3, label: 'QUARTA' },
  { id: 4, label: 'QUINTA' },
  { id: 5, label: 'SEXTA' },
  { id: 6, label: 'SÁBADO' },
]

function Cell({
  consultorioId,
  day,
  shift,
  data,
  specialties,
  dentists,
  onChange,
}: {
  consultorioId: string
  day: number
  shift: 'MANHÃ' | 'TARDE'
  data: any[]
  specialties: any[]
  dentists: any[]
  onChange: (cId: string, dId: number, s: 'MANHÃ' | 'TARDE', field: string, val: string) => void
}) {
  const current = data.find(
    (s) => s.consultorio_id === consultorioId && s.day_of_week === day && s.shift === shift,
  )

  return (
    <div className="flex flex-col gap-1 p-1 h-full min-h-[64px] justify-center relative group">
      <Select
        value={current?.specialty_id || 'none'}
        onValueChange={(v) => onChange(consultorioId, day, shift, 'specialty_id', v)}
      >
        <SelectTrigger className="h-6 min-h-6 text-[9px] px-1.5 py-0 border-transparent hover:border-slate-300 bg-transparent hover:bg-white shadow-none focus:ring-0 uppercase truncate data-[state=open]:border-primary data-[state=open]:bg-white font-bold tracking-wider text-slate-700">
          <SelectValue placeholder="ESPECIALIDADE">
            {current?.specialty_id && current.specialty_id !== 'none' ? (
              <div className="flex items-center gap-1.5 truncate">
                <div
                  className="w-2 h-2 rounded-full shrink-0 border border-black/10"
                  style={{
                    backgroundColor:
                      specialties.find((s) => s.id === current.specialty_id)?.color_hex || '#ccc',
                  }}
                />
                <span className="truncate">
                  {specialties.find((s) => s.id === current.specialty_id)?.name}
                </span>
              </div>
            ) : (
              <span className="text-slate-400 font-medium">ESPECIALIDADE...</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="uppercase">
          <SelectItem value="none" className="text-[10px] font-bold text-slate-500">
            SEM ESPECIALIDADE
          </SelectItem>
          {specialties.map((spec) => (
            <SelectItem key={spec.id} value={spec.id} className="text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full border border-black/10"
                  style={{ backgroundColor: spec.color_hex }}
                />
                {spec.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={current?.dentist_id || 'none'}
        onValueChange={(v) => onChange(consultorioId, day, shift, 'dentist_id', v)}
      >
        <SelectTrigger className="h-6 min-h-6 text-[9px] px-1.5 py-0 border-transparent hover:border-slate-300 bg-transparent hover:bg-white shadow-none focus:ring-0 uppercase truncate data-[state=open]:border-primary data-[state=open]:bg-white font-bold tracking-wider text-blue-800">
          <SelectValue placeholder="DENTISTA">
            {current?.dentist_id && current.dentist_id !== 'none' ? (
              <span className="truncate">
                {dentists.find((d) => d.id === current.dentist_id)?.name.split(' ')[0]}
              </span>
            ) : (
              <span className="text-slate-400 font-medium">DENTISTA...</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="uppercase">
          <SelectItem value="none" className="text-[10px] font-bold text-slate-500">
            SEM DENTISTA
          </SelectItem>
          {dentists.map((dentist) => (
            <SelectItem key={dentist.id} value={dentist.id} className="text-[10px] font-bold">
              {dentist.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function AgendaSegmentation() {
  const {
    consultorios,
    agendaSegmentation,
    specialtyConfigs,
    employees,
    upsertAgendaSegmentation,
    syncConsultorios,
    appSettings,
  } = useAppStore()

  const [openAdd, setOpenAdd] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')

  const activeDentists = useMemo(() => {
    return employees
      .filter((e) => e.status !== 'Desligado' && e.teamCategory?.includes('DENTISTA'))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [employees])

  const sortedConsultorios = useMemo(() => {
    return [...consultorios].sort((a, b) => a.name.localeCompare(b.name))
  }, [consultorios])

  const sortedSpecialties = useMemo(() => {
    return [...specialtyConfigs].sort((a, b) => a.name.localeCompare(b.name))
  }, [specialtyConfigs])

  // Metrics Calculation
  const metrics = useMemo(() => {
    const totalCapacity = sortedConsultorios.length * 6 * 2 // 6 days, 2 shifts

    const allocated = agendaSegmentation.filter((s) => s.specialty_id || s.dentist_id)
    const totalAllocated = allocated.length

    const specCounts: Record<string, number> = {}
    const dentistCounts: Record<string, number> = {}
    const roomCounts: Record<string, number> = {}
    const activeDays = new Set<number>()
    const activeRooms = new Set<string>()

    allocated.forEach((s) => {
      if (s.specialty_id) specCounts[s.specialty_id] = (specCounts[s.specialty_id] || 0) + 1
      if (s.dentist_id) dentistCounts[s.dentist_id] = (dentistCounts[s.dentist_id] || 0) + 1
      roomCounts[s.consultorio_id] = (roomCounts[s.consultorio_id] || 0) + 1
      activeDays.add(s.day_of_week)
      activeRooms.add(s.consultorio_id)
    })

    const topSpecId = Object.entries(specCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const topSpecName = specialtyConfigs.find((s) => s.id === topSpecId)?.name || 'N/A'

    const topDentistId = Object.entries(dentistCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const topDentistName =
      activeDentists.find((d) => d.id === topDentistId)?.name.split(' ')[0] || 'N/A'

    const topRoomId = Object.entries(roomCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const topRoomCount = roomCounts[topRoomId] || 0
    const topRoomPercent = totalCapacity > 0 ? Math.round((topRoomCount / 12) * 100) : 0 // 12 shifts per room

    return {
      totalCapacity,
      totalAllocated,
      topSpecName,
      topDentistName,
      topRoomPercent,
      daysActive: activeDays.size,
      roomsActive: activeRooms.size,
    }
  }, [agendaSegmentation, sortedConsultorios, specialtyConfigs, activeDentists])

  const handleCellChange = (
    consultorioId: string,
    dayId: number,
    shift: 'MANHÃ' | 'TARDE',
    field: string,
    value: string,
  ) => {
    const current = agendaSegmentation.find(
      (s) => s.consultorio_id === consultorioId && s.day_of_week === dayId && s.shift === shift,
    )

    const payload = {
      consultorio_id: consultorioId,
      day_of_week: dayId,
      shift,
      specialty_id: current?.specialty_id,
      dentist_id: current?.dentist_id,
      [field]: value === 'none' ? null : value,
    }

    upsertAgendaSegmentation(payload)
  }

  const handleAddRoom = async () => {
    if (newRoomName.trim()) {
      await syncConsultorios(
        [
          ...consultorios,
          {
            id: `new-${crypto.randomUUID()}`,
            name: newRoomName.trim().toUpperCase(),
            schedules: [],
          },
        ],
        appSettings?.hourly_cost_monthly_hours || 160,
      )
      setOpenAdd(false)
      setNewRoomName('')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0A192F] flex items-center gap-3">
            <Grid className="h-8 w-8 text-[#D4AF37]" /> SEGMENTAÇÃO DA AGENDA
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-semibold">
            DISTRIBUIÇÃO DE SALAS, ESPECIALIDADES E DENTISTAS POR TURNO.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-[#0A192F] text-white border-transparent shadow-md">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <ListPlus className="h-5 w-5 text-[#D4AF37] mb-2" />
            <p className="text-[9px] font-bold text-slate-400 tracking-widest mb-1">CAPACIDADE</p>
            <p className="text-xl font-black text-[#D4AF37]">
              {metrics.totalAllocated} / {metrics.totalCapacity}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <Stethoscope className="h-5 w-5 text-emerald-600 mb-2" />
            <p className="text-[9px] font-bold text-muted-foreground tracking-widest mb-1">
              TOP ESPECIALIDADE
            </p>
            <p
              className="text-sm font-black text-slate-800 truncate w-full px-2"
              title={metrics.topSpecName}
            >
              {metrics.topSpecName}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <User className="h-5 w-5 text-blue-600 mb-2" />
            <p className="text-[9px] font-bold text-muted-foreground tracking-widest mb-1">
              DENTISTA ATIVO
            </p>
            <p className="text-sm font-black text-slate-800 truncate w-full px-2">
              {metrics.topDentistName}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <Activity className="h-5 w-5 text-amber-500 mb-2" />
            <p className="text-[9px] font-bold text-muted-foreground tracking-widest mb-1">
              SALA MAIS USADA
            </p>
            <p className="text-xl font-black text-slate-800">{metrics.topRoomPercent}%</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <CheckSquare className="h-5 w-5 text-indigo-500 mb-2" />
            <p className="text-[9px] font-bold text-muted-foreground tracking-widest mb-1">
              DIAS COM TURNOS
            </p>
            <p className="text-xl font-black text-slate-800">{metrics.daysActive} / 6</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <MapPin className="h-5 w-5 text-rose-500 mb-2" />
            <p className="text-[9px] font-bold text-muted-foreground tracking-widest mb-1">
              SALAS ATIVAS
            </p>
            <p className="text-xl font-black text-slate-800">
              {metrics.roomsActive} / {sortedConsultorios.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-xl shadow-sm bg-white overflow-hidden flex flex-col">
        <div className="bg-[#0A192F] p-3 flex justify-between items-center shrink-0 border-b border-[#D4AF37]/30">
          <h3 className="text-[#D4AF37] font-black tracking-widest text-sm flex items-center gap-2">
            <Grid className="w-4 h-4" /> MATRIZ DE ALOCAÇÃO
          </h3>
          <Button
            size="sm"
            onClick={() => setOpenAdd(true)}
            className="bg-[#D4AF37] text-[#0A192F] hover:bg-[#B3932D] h-8 text-xs font-bold tracking-widest"
          >
            <Plus className="w-4 h-4 mr-1.5" /> ADD CONSULTÓRIO
          </Button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#112240] text-slate-300">
              <tr>
                <th className="p-3 font-black text-xs tracking-widest w-[180px] border-r border-white/10 text-center uppercase sticky left-0 bg-[#112240] z-10">
                  CONSULTÓRIO
                </th>
                <th className="p-3 font-black text-xs tracking-widest w-[50px] border-r border-white/10 text-center uppercase">
                  T
                </th>
                {DAYS.map((d) => (
                  <th
                    key={d.id}
                    className="p-3 font-black text-xs tracking-widest text-center min-w-[150px] border-r border-white/10 last:border-0 uppercase"
                  >
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedConsultorios.map((c, index) => (
                <React.Fragment key={c.id}>
                  {/* MANHÃ */}
                  <tr className="border-b border-slate-200">
                    <td
                      rowSpan={2}
                      className={cn(
                        'p-4 font-black text-slate-800 uppercase border-r text-center text-xs tracking-widest bg-slate-50 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]',
                        index % 2 === 0 ? 'bg-slate-50' : 'bg-white',
                      )}
                    >
                      {c.name}
                    </td>
                    <td className="p-0 font-black text-center border-r bg-slate-100/50 text-slate-400 text-xs w-[50px]">
                      M
                    </td>
                    {DAYS.map((d) => (
                      <td
                        key={`${c.id}-${d.id}-M`}
                        className="p-0 border-r border-slate-200 hover:bg-slate-50 transition-colors align-middle"
                      >
                        <Cell
                          consultorioId={c.id}
                          day={d.id}
                          shift="MANHÃ"
                          data={agendaSegmentation}
                          specialties={sortedSpecialties}
                          dentists={activeDentists}
                          onChange={handleCellChange}
                        />
                      </td>
                    ))}
                  </tr>
                  {/* TARDE */}
                  <tr className="border-b-4 border-b-slate-300/50">
                    <td className="p-0 font-black text-center border-r bg-slate-100/50 text-slate-400 text-xs w-[50px]">
                      T
                    </td>
                    {DAYS.map((d) => (
                      <td
                        key={`${c.id}-${d.id}-T`}
                        className="p-0 border-r border-slate-200 hover:bg-slate-50 transition-colors align-middle"
                      >
                        <Cell
                          consultorioId={c.id}
                          day={d.id}
                          shift="TARDE"
                          data={agendaSegmentation}
                          specialties={sortedSpecialties}
                          dentists={activeDentists}
                          onChange={handleCellChange}
                        />
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}

              {sortedConsultorios.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-12 text-center text-muted-foreground font-bold tracking-widest uppercase bg-slate-50 border-dashed border-2 m-4"
                  >
                    NENHUM CONSULTÓRIO CADASTRADO NO SISTEMA.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="uppercase max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#0A192F] font-black tracking-widest flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#D4AF37]" /> NOVO CONSULTÓRIO
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground tracking-widest">
                NOME DO CONSULTÓRIO / SALA
              </label>
              <Input
                placeholder="EX: SALA 1, CONSULTÓRIO VIP..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="font-bold uppercase"
              />
            </div>
            <Button
              className="w-full bg-[#0A192F] text-[#D4AF37] hover:bg-[#112240] font-black tracking-widest"
              onClick={handleAddRoom}
              disabled={!newRoomName.trim()}
            >
              CRIAR CONSULTÓRIO
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
