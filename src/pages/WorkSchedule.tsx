import React, { useState, useEffect, useMemo } from 'react'
import useAppStore, { WorkSchedule as TWorkSchedule, Employee } from '@/stores/main'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Clock, ChevronLeft, ChevronRight, AlertTriangle, Plus, Pencil, Trash2 } from 'lucide-react'
import { startOfWeek, endOfWeek, format, addDays, subDays } from 'date-fns'
import { cn } from '@/lib/utils'

const timeToMin = (t?: string | null) => {
  if (!t) return 0
  const [h, m] = t.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

const calculateMinutes = (schedule: Partial<TWorkSchedule>) => {
  let mStart = timeToMin(schedule.morning_start)
  let mEnd = timeToMin(schedule.morning_end)
  if (mEnd < mStart && mEnd !== 0) mEnd += 24 * 60

  let aStart = timeToMin(schedule.afternoon_start)
  let aEnd = timeToMin(schedule.afternoon_end)
  if (aEnd < aStart && aEnd !== 0) aEnd += 24 * 60

  let total = Math.max(0, mEnd - mStart) + Math.max(0, aEnd - aStart)
  return total
}

export default function WorkSchedule() {
  const {
    employees,
    departments,
    fetchWorkSchedules,
    workSchedules,
    upsertWorkSchedule,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useAppStore()

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const saved = localStorage.getItem('workScheduleDate')
    return saved ? new Date(saved) : new Date()
  })

  const [department, setDepartment] = useState<string>('all')
  const [drafts, setDrafts] = useState<Record<string, Partial<TWorkSchedule>>>({})

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedSector, setSelectedSector] = useState<string>('')
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  // Form states
  const [empName, setEmpName] = useState('')
  const [empRole, setEmpRole] = useState('')
  const [empDepartment, setEmpDepartment] = useState('')

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

  const displayDepartments = useMemo(() => {
    if (department !== 'all') return [department]
    return departments.filter((d) => activeEmployees.some((e) => e.department === d))
  }, [departments, activeEmployees, department])

  const handleOpenAdd = (dept: string) => {
    setSelectedSector(dept)
    setEmpName('')
    setEmpRole('Colaborador')
    setEmpDepartment(dept)
    setIsAddModalOpen(true)
  }

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!empName) return
    await addEmployee({
      name: empName.toUpperCase(),
      role: empRole.toUpperCase(),
      department: empDepartment,
      status: 'Ativo',
      hireDate: new Date().toISOString(),
      salary: '',
      vacationDaysTaken: 0,
      vacationDaysTotal: 30,
      vacationDueDate: '',
      email: '',
      phone: '',
      teamCategory: ['COLABORADOR'],
    })
    setIsAddModalOpen(false)
  }

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp)
    setEmpName(emp.name)
    setEmpRole(emp.role)
    setEmpDepartment(emp.department)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEmployee || !empName) return
    await updateEmployee(editingEmployee.id, {
      name: empName.toUpperCase(),
      role: empRole.toUpperCase(),
      department: empDepartment,
    })
    setIsEditModalOpen(false)
  }

  const handleDelete = (emp: Employee) => {
    if (
      window.confirm(
        `Tem certeza que deseja remover o colaborador ${emp.name}? Todos os registros de escala serão perdidos.`,
      )
    ) {
      deleteEmployee(emp.id)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" /> ESCALA DE TRABALHO
          </h1>
          <p className="text-muted-foreground mt-1">
            CONTROLE DE EXPEDIENTES, HORÁRIOS DE COPA E GESTÃO POR SETOR.
          </p>
        </div>
      </div>

      {conflicts.size > 0 && (
        <Alert variant="destructive" className="animate-pulse shadow-md border-red-500 bg-red-50">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">CAPACIDADE DA COPA EXCEDIDA!</AlertTitle>
          <AlertDescription className="font-semibold text-red-800">
            EXISTEM MAIS DE 2 COLABORADORES AGENDADOS PARA O LANCHE NO MESMO HORÁRIO. POR FAVOR,
            REAJUSTE A ESCALA.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-lg border">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedDate((d) => subDays(d, 1))}
            className="bg-white hover:bg-slate-100 hover:text-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Input
            type="date"
            value={dateStr}
            onChange={(e) => {
              if (e.target.value) setSelectedDate(new Date(e.target.value + 'T12:00:00'))
            }}
            className="w-[180px] font-bold text-center bg-white border-0 shadow-none focus-visible:ring-0 text-base"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
            className="bg-white hover:bg-slate-100 hover:text-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-full md:w-[280px] h-11 bg-slate-50 border-slate-200">
            <SelectValue placeholder="FILTRAR POR SETOR" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-bold">
              TODOS OS SETORES
            </SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d} className="font-medium">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {displayDepartments.length === 0 ? (
          <Card className="shadow-sm border-muted overflow-hidden p-10 text-center flex flex-col items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-muted-foreground font-bold">
              NENHUM SETOR ENCONTRADO COM COLABORADORES ATIVOS.
            </p>
          </Card>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100/50">
                    <TableHead className="font-bold text-slate-700 w-[250px]">
                      COLABORADOR
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 text-center w-[200px]">
                      MANHÃ (ENTRADA-SAÍDA)
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 text-center w-[200px]">
                      TARDE (ENTRADA-SAÍDA)
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 text-center w-[160px]">
                      LANCHE MANHÃ
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 text-center w-[160px]">
                      LANCHE TARDE
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 text-center w-[100px]">
                      AÇÕES
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayDepartments.map((dept) => {
                    const emps = activeEmployees
                      .filter((e) => e.department === dept)
                      .sort((a, b) => a.name.localeCompare(b.name))
                    return (
                      <React.Fragment key={dept}>
                        {/* Sector Header (DRE Style) */}
                        <TableRow className="bg-[#0A192F] hover:bg-[#0A192F] border-b-0">
                          <TableCell colSpan={6} className="p-0">
                            <div className="px-4 py-2.5 flex items-center justify-between">
                              <h3 className="font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                                {dept}
                              </h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-[#D4AF37] hover:bg-white/10 hover:text-white transition-colors text-[10px] font-bold tracking-widest"
                                onClick={() => handleOpenAdd(dept)}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" /> ADICIONAR
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                        {emps.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-6 text-muted-foreground bg-slate-50/50 text-xs font-bold"
                            >
                              NENHUM COLABORADOR NESTE SETOR
                            </TableCell>
                          </TableRow>
                        )}

                        {emps.map((emp) => {
                          const s = getScheduleForDay(emp.id, dateStr)
                          const hasMorningConflict = conflicts.has(`${emp.id}-morning`)
                          const hasAfternoonConflict = conflicts.has(`${emp.id}-afternoon`)

                          return (
                            <TableRow
                              key={emp.id}
                              className="hover:bg-slate-50 border-b border-slate-100 group"
                            >
                              <TableCell className="font-bold text-[#0A192F] py-3">
                                <div className="flex flex-col">
                                  <span>{emp.name}</span>
                                  <span className="text-[10px] text-muted-foreground font-semibold">
                                    {emp.role}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-1.5 justify-center">
                                  <Input
                                    type="time"
                                    value={s.morning_start || ''}
                                    onChange={(e) =>
                                      updateDraft(emp.id, 'morning_start', e.target.value)
                                    }
                                    onBlur={() => handleBlur(emp.id)}
                                    className="h-8 w-[85px] text-xs px-1.5 text-center bg-white"
                                  />
                                  <span className="text-slate-400 text-xs font-bold">-</span>
                                  <Input
                                    type="time"
                                    value={s.morning_end || ''}
                                    onChange={(e) =>
                                      updateDraft(emp.id, 'morning_end', e.target.value)
                                    }
                                    onBlur={() => handleBlur(emp.id)}
                                    className="h-8 w-[85px] text-xs px-1.5 text-center bg-white"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-1.5 justify-center">
                                  <Input
                                    type="time"
                                    value={s.afternoon_start || ''}
                                    onChange={(e) =>
                                      updateDraft(emp.id, 'afternoon_start', e.target.value)
                                    }
                                    onBlur={() => handleBlur(emp.id)}
                                    className="h-8 w-[85px] text-xs px-1.5 text-center bg-white"
                                  />
                                  <span className="text-slate-400 text-xs font-bold">-</span>
                                  <Input
                                    type="time"
                                    value={s.afternoon_end || ''}
                                    onChange={(e) =>
                                      updateDraft(emp.id, 'afternoon_end', e.target.value)
                                    }
                                    onBlur={() => handleBlur(emp.id)}
                                    className="h-8 w-[85px] text-xs px-1.5 text-center bg-white"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-1.5 justify-center">
                                  <Input
                                    type="time"
                                    value={s.morning_snack_start || ''}
                                    onChange={(e) =>
                                      updateDraft(emp.id, 'morning_snack_start', e.target.value)
                                    }
                                    onBlur={() => handleBlur(emp.id)}
                                    className={cn(
                                      'h-8 w-[75px] text-xs px-1.5 text-center bg-white',
                                      hasMorningConflict && 'border-red-500 bg-red-50 text-red-900',
                                    )}
                                  />
                                  <span className="text-slate-400 text-xs font-bold">-</span>
                                  <Input
                                    type="time"
                                    value={s.morning_snack_end || ''}
                                    onChange={(e) =>
                                      updateDraft(emp.id, 'morning_snack_end', e.target.value)
                                    }
                                    onBlur={() => handleBlur(emp.id)}
                                    className={cn(
                                      'h-8 w-[75px] text-xs px-1.5 text-center bg-white',
                                      hasMorningConflict && 'border-red-500 bg-red-50 text-red-900',
                                    )}
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-1.5 justify-center">
                                  <Input
                                    type="time"
                                    value={s.afternoon_snack_start || ''}
                                    onChange={(e) =>
                                      updateDraft(emp.id, 'afternoon_snack_start', e.target.value)
                                    }
                                    onBlur={() => handleBlur(emp.id)}
                                    className={cn(
                                      'h-8 w-[75px] text-xs px-1.5 text-center bg-white',
                                      hasAfternoonConflict &&
                                        'border-red-500 bg-red-50 text-red-900',
                                    )}
                                  />
                                  <span className="text-slate-400 text-xs font-bold">-</span>
                                  <Input
                                    type="time"
                                    value={s.afternoon_snack_end || ''}
                                    onChange={(e) =>
                                      updateDraft(emp.id, 'afternoon_snack_end', e.target.value)
                                    }
                                    onBlur={() => handleBlur(emp.id)}
                                    className={cn(
                                      'h-8 w-[75px] text-xs px-1.5 text-center bg-white',
                                      hasAfternoonConflict &&
                                        'border-red-500 bg-red-50 text-red-900',
                                    )}
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="text-center py-3">
                                <div className="flex items-center justify-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                                    onClick={() => handleOpenEdit(emp)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(emp)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </React.Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="uppercase">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> ADICIONAR COLABORADOR ({selectedSector})
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveNew} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">NOME COMPLETO *</label>
              <Input
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                required
                placeholder="NOME DO COLABORADOR"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                CARGO / FUNÇÃO *
              </label>
              <Input
                value={empRole}
                onChange={(e) => setEmpRole(e.target.value)}
                required
                placeholder="EX: RECEPCIONISTA"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">SETOR *</label>
              <Select value={empDepartment} onValueChange={setEmpDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                CANCELAR
              </Button>
              <Button type="submit">SALVAR COLABORADOR</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="uppercase">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" /> EDITAR COLABORADOR
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">NOME COMPLETO *</label>
              <Input value={empName} onChange={(e) => setEmpName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                CARGO / FUNÇÃO *
              </label>
              <Input value={empRole} onChange={(e) => setEmpRole(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">SETOR *</label>
              <Select value={empDepartment} onValueChange={setEmpDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                CANCELAR
              </Button>
              <Button type="submit">SALVAR ALTERAÇÕES</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
