import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Clock } from 'lucide-react'
import useAppStore, { Consultorio, ConsultorioWeeklySchedule } from '@/stores/main'
import { Switch } from '@/components/ui/switch'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const daysOfWeek = [
  { id: 1, label: 'SEGUNDA-FEIRA' },
  { id: 2, label: 'TERÇA-FEIRA' },
  { id: 3, label: 'QUARTA-FEIRA' },
  { id: 4, label: 'QUINTA-FEIRA' },
  { id: 5, label: 'SEXTA-FEIRA' },
  { id: 6, label: 'SÁBADO' },
]

const calcHours = (start?: string | null, end?: string | null) => {
  if (!start || !end) return 0
  const [h1, m1] = start.split(':').map(Number)
  const [h2, m2] = end.split(':').map(Number)
  if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return 0
  const diff = h2 + m2 / 60 - (h1 + m1 / 60)
  return diff > 0 ? diff : 0
}

const getDailyHours = (s: ConsultorioWeeklySchedule) => {
  if (s.is_closed) return 0
  return calcHours(s.morning_start, s.morning_end) + calcHours(s.afternoon_start, s.afternoon_end)
}

const getWeeklyHours = (schedules?: ConsultorioWeeklySchedule[]) => {
  if (!schedules) return 0
  return schedules.reduce((acc, s) => acc + getDailyHours(s), 0)
}

const createDefaultSchedules = (): ConsultorioWeeklySchedule[] => {
  return daysOfWeek.map((d) => ({
    day_of_week: d.id,
    morning_start: '08:00',
    morning_end: '12:00',
    afternoon_start: '13:00',
    afternoon_end: '18:00',
    is_closed: false,
  }))
}

export function ConsultoriosModal({ open, onOpenChange }: Props) {
  const { consultorios, syncConsultorios } = useAppStore()
  const [items, setItems] = useState<Consultorio[]>([])

  useEffect(() => {
    if (open) {
      setItems(
        consultorios.map((c) => {
          const defaultScheds = createDefaultSchedules()
          const schedules = defaultScheds.map((ds) => {
            const existing = c.schedules?.find((s) => s.day_of_week === ds.day_of_week)
            return existing ? { ...existing } : ds
          })
          return { ...c, schedules }
        }),
      )
    }
  }, [open, consultorios])

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `new-${crypto.randomUUID()}`,
        name: `Consultório ${items.length + 1}`,
        schedules: createDefaultSchedules(),
      },
    ])
  }

  const updateItem = (id: string, field: keyof Consultorio, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const updateSchedule = (
    consultorioId: string,
    dayId: number,
    field: keyof ConsultorioWeeklySchedule,
    value: any,
  ) => {
    setItems((prev) =>
      prev.map((c) => {
        if (c.id !== consultorioId) return c
        return {
          ...c,
          schedules: c.schedules?.map((s) =>
            s.day_of_week === dayId ? { ...s, [field]: value } : s,
          ),
        }
      }),
    )
  }

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const totalClinicWeekly = items.reduce((acc, c) => acc + getWeeklyHours(c.schedules), 0)
  const totalMonthly = totalClinicWeekly * 4 // Exactly 4 weeks as per acceptance criteria

  const handleSave = async () => {
    await syncConsultorios(items, Math.round(totalMonthly))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <div className="p-6 pb-4 border-b bg-white">
          <DialogHeader>
            <DialogTitle className="uppercase flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> HORAS TRABALHADAS (CONSULTÓRIOS)
            </DialogTitle>
            <DialogDescription className="uppercase font-semibold">
              DEFINA OS TURNOS DIÁRIOS DE CADA CONSULTÓRIO PARA CALCULAR O TOTAL DE HORAS CLÍNICAS
              DA CLÍNICA (PROJEÇÃO DE 4 SEMANAS/MÊS).
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <Accordion type="multiple" className="w-full">
            {items.map((item) => {
              const weeklyH = getWeeklyHours(item.schedules)
              return (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm px-4 mb-4 data-[state=open]:ring-2 data-[state=open]:ring-primary/20"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-bold text-slate-700 uppercase">{item.name}</span>
                      <span className="text-[10px] md:text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                        {weeklyH.toFixed(1)}h / SEM
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          placeholder="NOME DO CONSULTÓRIO"
                          className="font-bold text-base"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="hidden lg:grid grid-cols-[140px_1fr_80px] gap-4 px-3 mb-2">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">
                          DIA / STATUS
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-muted-foreground text-center uppercase">
                          <span>INÍCIO MANHÃ</span>
                          <span>FIM MANHÃ</span>
                          <span>INÍCIO TARDE</span>
                          <span>FIM TARDE</span>
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground text-right uppercase pr-2">
                          HORAS
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {item.schedules?.map((s) => {
                          const dayLabel = daysOfWeek.find((d) => d.id === s.day_of_week)?.label
                          const dailyH = getDailyHours(s)
                          return (
                            <div
                              key={s.day_of_week}
                              className={cn(
                                'flex flex-col lg:flex-row gap-4 items-start lg:items-center p-3 rounded-lg border transition-colors',
                                s.is_closed
                                  ? 'bg-slate-50 border-slate-200'
                                  : 'bg-white border-slate-200 shadow-sm hover:border-primary/30',
                              )}
                            >
                              <div className="flex items-center justify-between w-full lg:w-[140px]">
                                <span
                                  className={cn(
                                    'font-bold text-xs',
                                    s.is_closed ? 'text-slate-400' : 'text-slate-700',
                                  )}
                                >
                                  {dayLabel}
                                </span>
                                <div className="flex items-center gap-2 lg:hidden">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                    FECHADO
                                  </span>
                                  <Switch
                                    checked={s.is_closed}
                                    onCheckedChange={(v) =>
                                      updateSchedule(item.id, s.day_of_week, 'is_closed', v)
                                    }
                                  />
                                </div>
                                <div className="hidden lg:block shrink-0">
                                  <Switch
                                    checked={s.is_closed}
                                    onCheckedChange={(v) =>
                                      updateSchedule(item.id, s.day_of_week, 'is_closed', v)
                                    }
                                    title="Marcar como fechado"
                                  />
                                </div>
                              </div>

                              {!s.is_closed ? (
                                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-2 w-full">
                                  <div className="space-y-1 lg:space-y-0">
                                    <span className="text-[10px] font-bold text-muted-foreground lg:hidden">
                                      INÍCIO MANHÃ
                                    </span>
                                    <Input
                                      type="time"
                                      value={s.morning_start || ''}
                                      onChange={(e) =>
                                        updateSchedule(
                                          item.id,
                                          s.day_of_week,
                                          'morning_start',
                                          e.target.value,
                                        )
                                      }
                                      className="h-9 text-xs font-medium"
                                    />
                                  </div>
                                  <div className="space-y-1 lg:space-y-0">
                                    <span className="text-[10px] font-bold text-muted-foreground lg:hidden">
                                      FIM MANHÃ
                                    </span>
                                    <Input
                                      type="time"
                                      value={s.morning_end || ''}
                                      onChange={(e) =>
                                        updateSchedule(
                                          item.id,
                                          s.day_of_week,
                                          'morning_end',
                                          e.target.value,
                                        )
                                      }
                                      className="h-9 text-xs font-medium"
                                    />
                                  </div>
                                  <div className="space-y-1 lg:space-y-0">
                                    <span className="text-[10px] font-bold text-muted-foreground lg:hidden">
                                      INÍCIO TARDE
                                    </span>
                                    <Input
                                      type="time"
                                      value={s.afternoon_start || ''}
                                      onChange={(e) =>
                                        updateSchedule(
                                          item.id,
                                          s.day_of_week,
                                          'afternoon_start',
                                          e.target.value,
                                        )
                                      }
                                      className="h-9 text-xs font-medium"
                                    />
                                  </div>
                                  <div className="space-y-1 lg:space-y-0">
                                    <span className="text-[10px] font-bold text-muted-foreground lg:hidden">
                                      FIM TARDE
                                    </span>
                                    <Input
                                      type="time"
                                      value={s.afternoon_end || ''}
                                      onChange={(e) =>
                                        updateSchedule(
                                          item.id,
                                          s.day_of_week,
                                          'afternoon_end',
                                          e.target.value,
                                        )
                                      }
                                      className="h-9 text-xs font-medium"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex-1 text-sm font-bold text-slate-400 uppercase text-center lg:text-left py-2 tracking-widest bg-slate-100/50 rounded-md border border-slate-200 border-dashed lg:pl-4">
                                  FECHADO (SEM EXPEDIENTE)
                                </div>
                              )}

                              <div className="w-full lg:w-[80px] text-right font-black text-slate-600 text-lg lg:pr-2">
                                {dailyH.toFixed(1)}h
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addItem}
              className="w-full border-dashed border-2 h-12 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-colors uppercase font-bold"
            >
              <Plus className="h-4 w-4 mr-2" /> INCLUIR CONSULTÓRIO
            </Button>
          </div>
        </div>

        <div className="p-6 border-t bg-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                  TOTAL SEMANAL DA CLÍNICA
                </p>
                <p className="text-lg font-black text-slate-800">{totalClinicWeekly.toFixed(1)}h</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-black">X</span>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1">
                    SEMANAS / MÊS
                  </label>
                  <div className="w-24 font-black h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-md border border-slate-200 text-sm">
                    4
                  </div>
                </div>
              </div>
              <span className="text-muted-foreground font-black">=</span>
              <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                <p className="text-[10px] font-black tracking-widest text-primary uppercase">
                  TOTAL MENSAL
                </p>
                <p className="text-2xl font-black text-primary tracking-tight">
                  {Math.round(totalMonthly)}h
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => onOpenChange(false)}
              >
                CANCELAR
              </Button>
              <Button onClick={handleSave} className="font-bold w-full md:w-auto shadow-md">
                SALVAR E ATUALIZAR CUSTO
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
