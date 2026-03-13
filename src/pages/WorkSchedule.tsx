import { useState, useEffect, useMemo } from 'react'
import useAppStore, { WorkSchedule as TWorkSchedule } from '@/stores/main'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Clock, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { startOfWeek, endOfWeek, format, addDays, subDays } from 'date-fns'
import { cn } from '@/lib/utils'

const timeToMin = (t?: string | null) => {
  if (!t) return 0
  const [h, m] = t.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

const formatMinutes = (mins: number) => {
  const h = Math.floor(mins / 60)
  const m = Math.floor(mins % 60)
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

const calculateMinutes = (schedule: Partial<TWorkSchedule>) => {
  let mStart = timeToMin(schedule.start_time)
  let mEnd = timeToMin(schedule.morning_end_time)
  if (mEnd < mStart && mEnd !== 0) mEnd += 24 * 60

  let aStart = timeToMin(schedule.afternoon_start_time)
  let aEnd = timeToMin(schedule.end_time)
  if (aEnd < aStart && aEnd !== 0) aEnd += 24 * 60

  let total = Math.max(0, mEnd - mStart) + Math.max(0, aEnd - aStart)
  return total
}

export default function WorkSchedule() {
  const { employees, departments, fetchWorkSchedules, workSchedules, upsertWorkSchedule } =
    useAppStore()

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const saved = localStorage.getItem('workScheduleDate')
    return saved ? new Date(saved) : new Date()
  })

  const [department, setDepartment] = useState<string>('all')
  const [drafts, setDrafts] = useState<Record<string, Partial<TWorkSchedule>>>({})

  const activeEmployees = employees.filter((e) => e.status !== 'Desligado')

  useEffect(() => {
    localStorage.setItem('workScheduleDate', selectedDate.toISOString())
    const start = format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd')
    const end = format(endOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd')
    fetchWorkSchedules(start, end)
  }, [selectedDate, fetchWorkSchedules])

  const getScheduleForDay = (empId: string, dateStr: string) => {
    const saved = workSchedules.find(
      (ws) => ws.employee_id === empId && ws.work_date === dateStr,
    ) || { employee_id: empId, work_date: dateStr }
    const draft = drafts[`${empId}-${dateStr}`] || {}
    return { ...saved, ...draft } as Partial<TWorkSchedule>
  }

  const updateDraft = (empId: string, field: string, value: string) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const key = `${empId}-${dateStr}`
    setDrafts((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  const handleBlur = (empId: string) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const key = `${empId}-${dateStr}`
    const draft = drafts[key]
    if (!draft) return

    const merged = getScheduleForDay(empId, dateStr)
    const dailyMinutes = calculateMinutes(merged)

    upsertWorkSchedule({
      ...merged,
      employee_id: empId,
      work_date: dateStr,
      total_daily_hours: dailyMinutes,
    })
  }

  const getWeeklyTotal = (empId: string) => {
    let total = 0
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    for (let i = 0; i < 7; i++) {
      const dStr = format(addDays(start, i), 'yyyy-MM-dd')
      const merged = getScheduleForDay(empId, dStr)
      if (drafts[`${empId}-${dStr}`]) {
        total += calculateMinutes(merged)
      } else {
        total += merged.total_daily_hours || 0
      }
    }
    return total
  }

  const conflicts = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const points: { time: number; type: 'start' | 'end'; id: string; breakType: string }[] = []

    employees.forEach((emp) => {
      if (department !== 'all' && emp.department !== department) return
      const s = getScheduleForDay(emp.id, dateStr)

      if (s.morning_snack_start && s.morning_snack_end) {
        points.push({
          time: timeToMin(s.morning_snack_start),
          type: 'start',
          id: emp.id,
          breakType: 'morning',
        })
        points.push({
          time: timeToMin(s.morning_snack_end),
          type: 'end',
          id: emp.id,
          breakType: 'morning',
        })
      }
      if (s.afternoon_snack_start && s.afternoon_snack_end) {
        points.push({
          time: timeToMin(s.afternoon_snack_start),
          type: 'start',
          id: emp.id,
          breakType: 'afternoon',
        })
        points.push({
          time: timeToMin(s.afternoon_snack_end),
          type: 'end',
          id: emp.id,
          breakType: 'afternoon',
        })
      }
    })

    points.sort((a, b) => (a.time === b.time ? (a.type === 'end' ? -1 : 1) : a.time - b.time))

    const active = new Set<string>()
    const overlaps = new Set<string>()

    points.forEach((p) => {
      if (p.type === 'start') {
        active.add(`${p.id}-${p.breakType}`)
        if (active.size > 2) {
          active.forEach((item) => overlaps.add(item))
        }
      } else {
        active.delete(`${p.id}-${p.breakType}`)
      }
    })

    return overlaps
  }, [drafts, workSchedules, selectedDate, department, employees])

  const dateStr = format(selectedDate, 'yyyy-MM-dd')

  const employeesByDepartment = useMemo(() => {
    const groups: Record<string, typeof activeEmployees> = {}
    const filtered = activeEmployees.filter(
      (e) => department === 'all' || e.department === department,
    )
    filtered.forEach((emp) => {
      if (!groups[emp.department]) groups[emp.department] = []
      groups[emp.department].push(emp)
    })
    Object.keys(groups).forEach((k) => {
      groups[k].sort((a, b) => a.name.localeCompare(b.name))
    })
    return groups
  }, [activeEmployees, department])

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" /> ESCALA DE TRABALHO
          </h1>
          <p className="text-muted-foreground mt-1">
            CONTROLE DE EXPEDIENTES E COORDENAÇÃO DE HORÁRIOS DE COPA.
          </p>
        </div>
      </div>

      {conflicts.size > 0 && (
        <Alert variant="destructive" className="animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>CAPACIDADE DA COPA EXCEDIDA!</AlertTitle>
          <AlertDescription>
            EXISTEM MAIS DE 2 COLABORADORES AGENDADOS PARA O LANCHE NO MESMO HORÁRIO. POR FAVOR,
            REAJUSTE A ESCALA.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedDate((d) => subDays(d, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Input
            type="date"
            value={dateStr}
            onChange={(e) => {
              if (e.target.value) setSelectedDate(new Date(e.target.value + 'T12:00:00'))
            }}
            className="w-[160px] font-bold text-center"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="SELECIONE O SETOR" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">TODOS OS SETORES</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {Object.entries(employeesByDepartment).map(([dept, emps]) => (
          <Card key={dept} className="shadow-sm border-muted overflow-hidden">
            <div className="bg-primary/5 px-4 py-3 border-b border-primary/10">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="w-1.5 h-5 bg-primary rounded-full inline-block"></span>
                SETOR: {dept}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold w-[200px]">COLABORADOR</TableHead>
                    <TableHead className="font-semibold text-center w-[180px]">
                      MANHÃ (ENTRADA-SAÍDA)
                    </TableHead>
                    <TableHead className="font-semibold text-center w-[180px]">
                      TARDE (ENTRADA-SAÍDA)
                    </TableHead>
                    <TableHead className="font-semibold text-center w-[150px]">
                      LANCHE MANHÃ
                    </TableHead>
                    <TableHead className="font-semibold text-center w-[150px]">
                      LANCHE TARDE
                    </TableHead>
                    <TableHead className="font-semibold text-center w-[110px]">TOTAL DIA</TableHead>
                    <TableHead className="font-semibold text-center w-[110px]">
                      TOTAL SEMANA
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emps.map((emp) => {
                    const s = getScheduleForDay(emp.id, dateStr)
                    const dailyMins = calculateMinutes(s)
                    const weeklyMins = getWeeklyTotal(emp.id)

                    const hasMorningConflict = conflicts.has(`${emp.id}-morning`)
                    const hasAfternoonConflict = conflicts.has(`${emp.id}-afternoon`)

                    const dailyTarget = 8 * 60 + 48 // 528
                    const weeklyTarget = 44 * 60 // 2640

                    return (
                      <TableRow key={emp.id} className="hover:bg-muted/10">
                        <TableCell className="font-bold text-nuvia-navy">{emp.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 justify-center">
                            <Input
                              type="time"
                              value={s.start_time || ''}
                              onChange={(e) => updateDraft(emp.id, 'start_time', e.target.value)}
                              onBlur={() => handleBlur(emp.id)}
                              className="h-8 w-[75px] text-xs px-1.5 text-center"
                            />
                            <span className="text-muted-foreground text-xs font-bold">-</span>
                            <Input
                              type="time"
                              value={s.morning_end_time || ''}
                              onChange={(e) =>
                                updateDraft(emp.id, 'morning_end_time', e.target.value)
                              }
                              onBlur={() => handleBlur(emp.id)}
                              className="h-8 w-[75px] text-xs px-1.5 text-center"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 justify-center">
                            <Input
                              type="time"
                              value={s.afternoon_start_time || ''}
                              onChange={(e) =>
                                updateDraft(emp.id, 'afternoon_start_time', e.target.value)
                              }
                              onBlur={() => handleBlur(emp.id)}
                              className="h-8 w-[75px] text-xs px-1.5 text-center"
                            />
                            <span className="text-muted-foreground text-xs font-bold">-</span>
                            <Input
                              type="time"
                              value={s.end_time || ''}
                              onChange={(e) => updateDraft(emp.id, 'end_time', e.target.value)}
                              onBlur={() => handleBlur(emp.id)}
                              className="h-8 w-[75px] text-xs px-1.5 text-center"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 justify-center">
                            <Input
                              type="time"
                              value={s.morning_snack_start || ''}
                              onChange={(e) =>
                                updateDraft(emp.id, 'morning_snack_start', e.target.value)
                              }
                              onBlur={() => handleBlur(emp.id)}
                              className={cn(
                                'h-8 w-[70px] text-xs px-1.5 text-center',
                                hasMorningConflict && 'border-red-500 bg-red-50 text-red-900',
                              )}
                            />
                            <span className="text-muted-foreground text-xs font-bold">-</span>
                            <Input
                              type="time"
                              value={s.morning_snack_end || ''}
                              onChange={(e) =>
                                updateDraft(emp.id, 'morning_snack_end', e.target.value)
                              }
                              onBlur={() => handleBlur(emp.id)}
                              className={cn(
                                'h-8 w-[70px] text-xs px-1.5 text-center',
                                hasMorningConflict && 'border-red-500 bg-red-50 text-red-900',
                              )}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 justify-center">
                            <Input
                              type="time"
                              value={s.afternoon_snack_start || ''}
                              onChange={(e) =>
                                updateDraft(emp.id, 'afternoon_snack_start', e.target.value)
                              }
                              onBlur={() => handleBlur(emp.id)}
                              className={cn(
                                'h-8 w-[70px] text-xs px-1.5 text-center',
                                hasAfternoonConflict && 'border-red-500 bg-red-50 text-red-900',
                              )}
                            />
                            <span className="text-muted-foreground text-xs font-bold">-</span>
                            <Input
                              type="time"
                              value={s.afternoon_snack_end || ''}
                              onChange={(e) =>
                                updateDraft(emp.id, 'afternoon_snack_end', e.target.value)
                              }
                              onBlur={() => handleBlur(emp.id)}
                              className={cn(
                                'h-8 w-[70px] text-xs px-1.5 text-center',
                                hasAfternoonConflict && 'border-red-500 bg-red-50 text-red-900',
                              )}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={cn(
                              'font-bold text-xs bg-muted px-2.5 py-1 rounded',
                              dailyMins > 0 && dailyMins !== dailyTarget
                                ? 'text-amber-600 bg-amber-50'
                                : dailyMins === dailyTarget
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : 'text-muted-foreground',
                            )}
                          >
                            {formatMinutes(dailyMins)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={cn(
                              'font-bold text-xs bg-muted px-2.5 py-1 rounded',
                              weeklyMins > 0 && weeklyMins !== weeklyTarget
                                ? 'text-amber-600 bg-amber-50'
                                : weeklyMins === weeklyTarget
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : 'text-muted-foreground',
                            )}
                          >
                            {formatMinutes(weeklyMins)}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        ))}

        {Object.keys(employeesByDepartment).length === 0 && (
          <Card className="shadow-sm border-muted overflow-hidden p-10 text-center flex flex-col items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-muted-foreground font-bold">
              NENHUM COLABORADOR ENCONTRADO PARA O SETOR SELECIONADO.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
