import React, { useState, useMemo } from 'react'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import {
  Grid,
  Plus,
  Stethoscope,
  MapPin,
  Activity,
  CheckSquare,
  ListPlus,
  Trash2,
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

function hexToRgba(hex: string, opacity: number) {
  if (!hex || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
    return `rgba(148, 163, 184, ${opacity})`
  }
  let c = hex.substring(1)
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

function Cell({
  consultorioId,
  day,
  shift,
  data,
  specialties,
  onChange,
  onClear,
}: {
  consultorioId: string
  day: number
  shift: 'MANHÃ' | 'TARDE'
  data: any[]
  specialties: any[]
  onChange: (cId: string, dId: number, s: 'MANHÃ' | 'TARDE', field: string, val: string) => void
  onClear: (cId: string, dId: number, s: 'MANHÃ' | 'TARDE') => void
}) {
  const [open, setOpen] = useState(false)
  const current = data.find(
    (s) => s.consultorio_id === consultorioId && s.day_of_week === day && s.shift === shift,
  )

  const hasData = !!current?.specialty_id
  const spec = specialties.find((s) => s.id === current?.specialty_id)

  const baseColor = spec?.color_hex || '#94a3b8'
  const bgColor = hexToRgba(baseColor, 0.15)
  const borderColor = hexToRgba(baseColor, 0.4)
  const textColor = hexToRgba(baseColor, 1)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full h-full min-h-[76px] p-1.5 cursor-pointer transition-all group">
          {hasData ? (
            <div
              className="w-full h-full rounded-lg border p-2 flex flex-col justify-center items-start shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
              style={{ backgroundColor: bgColor, borderColor: borderColor }}
            >
              <span
                className="font-black text-[11px] uppercase leading-tight truncate w-full"
                style={{ color: textColor }}
              >
                {spec?.name || 'S/ ESPECIALIDADE'}
              </span>
            </div>
          ) : (
            <div className="w-full h-full rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100 flex flex-col items-center justify-center text-slate-400 group-hover:text-slate-600 group-hover:border-slate-300 transition-colors">
              <Plus className="w-5 h-5 mb-0.5 opacity-50 group-hover:opacity-100" />
              <span className="text-[9px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Adicionar
              </span>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4 space-y-4 shadow-xl border-slate-200" align="center">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Especialidade
          </label>
          <Select
            value={current?.specialty_id || 'none'}
            onValueChange={(v) => onChange(consultorioId, day, shift, 'specialty_id', v)}
          >
            <SelectTrigger className="uppercase font-bold text-xs h-9">
              <SelectValue placeholder="SELECIONE..." />
            </SelectTrigger>
            <SelectContent className="uppercase">
              <SelectItem value="none" className="text-xs font-bold text-slate-500">
                SEM ESPECIALIDADE
              </SelectItem>
              {specialties.map((spec) => (
                <SelectItem key={spec.id} value={spec.id} className="text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: spec.color_hex }}
                    />
                    {spec.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasData && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 h-9 mt-2 font-bold tracking-widest text-[10px]"
            onClick={() => {
              onClear(consultorioId, day, shift)
              setOpen(false)
            }}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> LIMPAR TURNO
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default function AgendaSegmentation() {
  const {
    consultorios = [],
    agendaSegmentation = [],
    specialtyConfigs = [],
    upsertAgendaSegmentation,
    syncConsultorios,
    appSettings,
  } = useAppStore()

  const [openAdd, setOpenAdd] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')

  const sortedConsultorios = useMemo(() => {
    return [...consultorios].sort((a, b) => a.name.localeCompare(b.name))
  }, [consultorios])

  const sortedSpecialties = useMemo(() => {
    return [...specialtyConfigs].sort((a, b) => a.name.localeCompare(b.name))
  }, [specialtyConfigs])

  // Metrics Calculation
  const metrics = useMemo(() => {
    const totalCapacity = sortedConsultorios.length * 6 * 2 // 6 days, 2 shifts

    const allocated = agendaSegmentation.filter((s) => s.specialty_id)
    const totalAllocated = allocated.length
    const turnosDisponiveis = totalCapacity - totalAllocated

    const specCounts: Record<string, number> = {}
    const roomCounts: Record<string, number> = {}

    allocated.forEach((s) => {
      if (s.specialty_id) specCounts[s.specialty_id] = (specCounts[s.specialty_id] || 0) + 1
      roomCounts[s.consultorio_id] = (roomCounts[s.consultorio_id] || 0) + 1
    })

    const topSpecId = Object.entries(specCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const topSpecName = specialtyConfigs.find((s) => s.id === topSpecId)?.name || 'N/A'

    const topRoomId = Object.entries(roomCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const topRoomCount = roomCounts[topRoomId] || 0
    const topRoomPercent = totalCapacity > 0 ? Math.round((topRoomCount / 12) * 100) : 0

    const freeSlots: { room: string; day: number }[] = []
    sortedConsultorios.forEach((c) => {
      DAYS.forEach((d) => {
        ;['MANHÃ', 'TARDE'].forEach((shift) => {
          const isFilled = agendaSegmentation.some(
            (s) =>
              s.consultorio_id === c.id &&
              s.day_of_week === d.id &&
              s.shift === shift &&
              s.specialty_id,
          )
          if (!isFilled) {
            freeSlots.push({ room: c.id, day: d.id })
          }
        })
      })
    })

    const daysWithFree = new Set(freeSlots.map((f) => f.day)).size
    const roomsWithFree = new Set(freeSlots.map((f) => f.room)).size

    return {
      totalCapacity,
      turnosDisponiveis,
      topSpecName,
      topRoomPercent,
      topRoomName: sortedConsultorios.find((c) => c.id === topRoomId)?.name || 'N/A',
      daysWithFree,
      roomsWithFree,
      totalRooms: sortedConsultorios.length,
    }
  }, [agendaSegmentation, sortedConsultorios, specialtyConfigs])

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
      [field]: value === 'none' ? null : value,
    }

    upsertAgendaSegmentation(payload)
  }

  const handleCellClear = (consultorioId: string, dayId: number, shift: 'MANHÃ' | 'TARDE') => {
    upsertAgendaSegmentation({
      consultorio_id: consultorioId,
      day_of_week: dayId,
      shift,
      specialty_id: undefined,
    })
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
      {/* Identity Header */}
      <div className="bg-[#0A192F] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#D4AF37] flex items-center gap-3">
            <Grid className="h-7 w-7 text-white" /> SEGMENTAÇÃO DA AGENDA
          </h1>
          <p className="text-slate-300 mt-1.5 text-xs font-bold tracking-widest uppercase">
            MATRIZ DE DISTRIBUIÇÃO DE SALAS E ESPECIALIDADES
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full gap-2">
            <ListPlus className="h-6 w-6 text-blue-600" />
            <p className="text-[10px] font-black text-slate-500 tracking-widest leading-tight">
              TURNOS DISPONÍVEIS
            </p>
            <p className="text-xl font-black text-slate-800">
              {metrics.turnosDisponiveis}{' '}
              <span className="text-sm text-slate-400">/ {metrics.totalCapacity}</span>
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full gap-2">
            <Stethoscope className="h-6 w-6 text-emerald-600" />
            <p className="text-[10px] font-black text-slate-500 tracking-widest leading-tight">
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
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full gap-2">
            <Activity className="h-6 w-6 text-amber-500" />
            <p className="text-[10px] font-black text-slate-500 tracking-widest leading-tight">
              SALA MAIS USADA
            </p>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 truncate px-2">
                {metrics.topRoomName}
              </span>
              <span className="text-xs font-bold text-amber-600">{metrics.topRoomPercent}%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full gap-2">
            <CheckSquare className="h-6 w-6 text-rose-500" />
            <p className="text-[10px] font-black text-slate-500 tracking-widest leading-tight">
              DIAS C/ DISP.
            </p>
            <p className="text-xl font-black text-slate-800">
              {metrics.daysWithFree} <span className="text-sm text-slate-400">/ 6</span>
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full gap-2">
            <MapPin className="h-6 w-6 text-[#D4AF37]" />
            <p className="text-[10px] font-black text-slate-500 tracking-widest leading-tight">
              SALAS C/ DISP.
            </p>
            <p className="text-xl font-black text-slate-800">
              {metrics.roomsWithFree}{' '}
              <span className="text-sm text-slate-400">/ {metrics.totalRooms}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border border-slate-200 rounded-xl shadow-md bg-white overflow-hidden flex flex-col">
        <div className="bg-[#0A192F] p-4 flex justify-between items-center shrink-0 border-b border-[#D4AF37]/30">
          <h3 className="text-white font-black tracking-widest text-sm flex items-center gap-2">
            <Grid className="w-5 h-5 text-[#D4AF37]" /> MATRIZ DE ALOCAÇÃO
          </h3>
          <Button
            size="sm"
            onClick={() => setOpenAdd(true)}
            className="bg-[#D4AF37] text-[#0A192F] hover:bg-[#B3932D] h-9 text-xs font-black tracking-widest shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5" /> ADD CONSULTÓRIO
          </Button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left border-collapse min-w-[1200px]">
            <thead className="bg-[#112240] text-slate-300">
              <tr>
                <th className="p-3 font-black text-xs tracking-widest w-[200px] border-r border-white/10 text-center uppercase sticky left-0 bg-[#112240] z-20">
                  CONSULTÓRIO
                </th>
                <th className="p-3 font-black text-[10px] tracking-widest w-[40px] border-r border-white/10 text-center uppercase">
                  T.
                </th>
                {DAYS.map((d) => (
                  <th
                    key={d.id}
                    className="p-3 font-black text-[11px] tracking-widest text-center min-w-[160px] border-r border-white/10 last:border-0 uppercase text-[#D4AF37]"
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
                  <tr className="border-b border-slate-200 group/row">
                    <td
                      rowSpan={2}
                      className={cn(
                        'p-4 font-black text-slate-800 uppercase border-r text-center text-xs tracking-widest sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] transition-colors',
                        index % 2 === 0
                          ? 'bg-slate-50 group-hover/row:bg-slate-100/50'
                          : 'bg-white group-hover/row:bg-slate-50',
                      )}
                    >
                      {c.name}
                    </td>
                    <td className="p-0 font-black text-center border-r bg-slate-100 text-slate-400 text-[10px] w-[40px] h-[76px]">
                      M
                    </td>
                    {DAYS.map((d) => (
                      <td
                        key={`${c.id}-${d.id}-M`}
                        className="p-0 border-r border-slate-200 align-middle hover:bg-slate-50/50 transition-colors"
                      >
                        <Cell
                          consultorioId={c.id}
                          day={d.id}
                          shift="MANHÃ"
                          data={agendaSegmentation}
                          specialties={sortedSpecialties}
                          onChange={handleCellChange}
                          onClear={handleCellClear}
                        />
                      </td>
                    ))}
                  </tr>
                  {/* TARDE */}
                  <tr className="border-b-[6px] border-b-slate-200/60 group/row">
                    <td className="p-0 font-black text-center border-r bg-slate-100 text-slate-400 text-[10px] w-[40px] h-[76px]">
                      T
                    </td>
                    {DAYS.map((d) => (
                      <td
                        key={`${c.id}-${d.id}-T`}
                        className="p-0 border-r border-slate-200 align-middle hover:bg-slate-50/50 transition-colors"
                      >
                        <Cell
                          consultorioId={c.id}
                          day={d.id}
                          shift="TARDE"
                          data={agendaSegmentation}
                          specialties={sortedSpecialties}
                          onChange={handleCellChange}
                          onClear={handleCellClear}
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
                    className="p-16 text-center text-muted-foreground font-black tracking-widest uppercase bg-slate-50 border-dashed border-2 m-4"
                  >
                    <Grid className="w-12 h-12 mx-auto mb-4 text-slate-300" />
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
                className="font-bold uppercase h-11"
              />
            </div>
            <Button
              className="w-full bg-[#0A192F] text-[#D4AF37] hover:bg-[#112240] font-black tracking-widest h-11"
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
