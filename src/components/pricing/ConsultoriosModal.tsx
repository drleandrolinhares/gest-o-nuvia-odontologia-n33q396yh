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
import useAppStore, { Consultorio } from '@/stores/main'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConsultoriosModal({ open, onOpenChange }: Props) {
  const { consultorios, syncConsultorios } = useAppStore()
  const [items, setItems] = useState<Consultorio[]>([])
  const [workingDays, setWorkingDays] = useState(22)

  useEffect(() => {
    if (open) {
      setItems(consultorios.map((c) => ({ ...c })))
    }
  }, [open, consultorios])

  const calcHours = (start?: string | null, end?: string | null) => {
    if (!start || !end) return 0
    const [h1, m1] = start.split(':').map(Number)
    const [h2, m2] = end.split(':').map(Number)
    if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return 0
    const diff = h2 + m2 / 60 - (h1 + m1 / 60)
    return diff > 0 ? diff : 0
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `new-${crypto.randomUUID()}`,
        name: `Consultório ${items.length + 1}`,
        morning_start: '08:00',
        morning_end: '12:00',
        afternoon_start: '13:00',
        afternoon_end: '18:00',
      },
    ])
  }

  const updateItem = (id: string, field: keyof Consultorio, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const totalDaily = items.reduce((acc, curr) => {
    return (
      acc +
      calcHours(curr.morning_start, curr.morning_end) +
      calcHours(curr.afternoon_start, curr.afternoon_end)
    )
  }, 0)

  const totalMonthly = totalDaily * workingDays

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
              DEFINA OS TURNOS DE CADA CADEIRA/CONSULTÓRIO PARA CALCULAR O TOTAL DE HORAS CLÍNICAS
              DA CLÍNICA.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-600 w-[200px]">
                      CONSULTÓRIO
                    </TableHead>
                    <TableHead className="font-bold text-slate-600 text-center">
                      MANHÃ (INÍCIO - FIM)
                    </TableHead>
                    <TableHead className="font-bold text-slate-600 text-center">
                      TARDE (INÍCIO - FIM)
                    </TableHead>
                    <TableHead className="font-bold text-slate-600 text-center w-[100px]">
                      HORAS/DIA
                    </TableHead>
                    <TableHead className="w-[60px] text-center">AÇÕES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const dailyHours =
                      calcHours(item.morning_start, item.morning_end) +
                      calcHours(item.afternoon_start, item.afternoon_end)
                    return (
                      <TableRow key={item.id} className="hover:bg-slate-50/50">
                        <TableCell className="p-3">
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            placeholder="Ex: Consultório 1"
                            className="bg-white shadow-sm border-slate-200"
                          />
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Input
                              type="time"
                              value={item.morning_start || ''}
                              onChange={(e) => updateItem(item.id, 'morning_start', e.target.value)}
                              className="w-24 text-center"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                              type="time"
                              value={item.morning_end || ''}
                              onChange={(e) => updateItem(item.id, 'morning_end', e.target.value)}
                              className="w-24 text-center"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Input
                              type="time"
                              value={item.afternoon_start || ''}
                              onChange={(e) =>
                                updateItem(item.id, 'afternoon_start', e.target.value)
                              }
                              className="w-24 text-center"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                              type="time"
                              value={item.afternoon_end || ''}
                              onChange={(e) => updateItem(item.id, 'afternoon_end', e.target.value)}
                              className="w-24 text-center"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="p-3 text-center font-bold text-slate-600">
                          {dailyHours.toFixed(1)}h
                        </TableCell>
                        <TableCell className="p-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-muted-foreground font-bold"
                      >
                        NENHUM CONSULTÓRIO CADASTRADO. CLIQUE ABAIXO PARA ADICIONAR.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mt-4">
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
                  HORAS / DIA
                </p>
                <p className="text-lg font-black text-slate-800">{totalDaily.toFixed(1)}h</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-black">X</span>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1">
                    DIAS ÚTEIS
                  </label>
                  <Input
                    type="number"
                    value={workingDays}
                    onChange={(e) => setWorkingDays(Number(e.target.value) || 0)}
                    className="w-20 font-black h-8"
                  />
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

            <div className="flex items-center gap-3 w-full md:w-auto">
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
