import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import useAppStore, { FixedItem } from '@/stores/main'
import { Save, Plus, Trash2, Clock, Calculator, List, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'

export function HourlyCostTab() {
  const { appSettings, updateAppSettings } = useAppStore()
  const { toast } = useToast()

  const [hours, setHours] = useState('160')
  const [items, setItems] = useState<FixedItem[]>([])

  const [modalOpen, setModalOpen] = useState(false)
  const [draftItems, setDraftItems] = useState<FixedItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingModal, setIsSavingModal] = useState(false)

  useEffect(() => {
    if (appSettings) {
      setHours(appSettings.hourly_cost_monthly_hours.toString())
      setItems(appSettings.hourly_cost_fixed_items || [])
    }
  }, [appSettings])

  const totalFixed = items.reduce(
    (acc, curr) => acc + Number(curr.value ?? curr.calculated_monthly_cost ?? 0),
    0,
  )
  const costPerMinute = Number(hours) > 0 ? totalFixed / (Number(hours) * 60) : 0

  const handleSaveHours = async () => {
    setIsSaving(true)
    const res = await updateAppSettings({
      hourly_cost_monthly_hours: Number(hours) || 160,
    })
    setIsSaving(false)

    if (res.success) {
      toast({ title: 'SUCESSO', description: 'HORAS SALVAS COM SUCESSO.' })
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO SALVAR.' })
    }
  }

  const handleOpenModal = () => {
    const initialized = items.map((item) => ({
      ...item,
      gross_base_value: item.gross_base_value ?? item.value ?? item.calculated_monthly_cost ?? 0,
      periodicity_type: item.periodicity_type ?? 'Mensal',
      calculated_monthly_cost: item.calculated_monthly_cost ?? item.value ?? 0,
    }))
    setDraftItems(initialized)
    setModalOpen(true)
  }

  const handleAddDraft = () => {
    setDraftItems([
      ...draftItems,
      {
        id: crypto.randomUUID(),
        name: '',
        value: 0,
        gross_base_value: 0,
        periodicity_type: 'Mensal',
        calculated_monthly_cost: 0,
      },
    ])
  }

  const handleRemoveDraft = (id: string) => {
    setDraftItems(draftItems.filter((i) => i.id !== id))
  }

  const handleUpdateDraft = (id: string, field: keyof FixedItem, val: any) => {
    setDraftItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: val }

        if (field === 'gross_base_value' || field === 'periodicity_type') {
          const base = Number(updated.gross_base_value) || 0
          const isAnnual = updated.periodicity_type === 'Anual'
          const monthly = isAnnual ? base / 12 : base
          updated.calculated_monthly_cost = monthly
          updated.value = monthly
        }
        return updated
      }),
    )
  }

  const totalDraftRealCost = useMemo(() => {
    return draftItems.reduce((acc, item) => acc + (item.calculated_monthly_cost || 0), 0)
  }, [draftItems])

  const handleSaveAndPersist = async () => {
    setIsSavingModal(true)
    const res = await updateAppSettings({
      hourly_cost_fixed_items: draftItems,
    })
    setIsSavingModal(false)

    if (res.success) {
      setItems(draftItems)
      setModalOpen(false)
      toast({ title: 'SUCESSO', description: 'CUSTOS DETALHADOS SALVOS NO DASHBOARD.' })
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO SALVAR CUSTOS.' })
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      <Card className="lg:col-span-8 shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-nuvia-navy" /> CÁLCULO DE CUSTO HORA
          </CardTitle>
          <CardDescription className="text-xs uppercase font-semibold">
            INFORME AS HORAS TRABALHADAS E OS CUSTOS FIXOS PARA CALCULAR O CUSTO POR MINUTO CLÍNICO.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3 p-5 bg-blue-50/50 rounded-xl border border-blue-100 shadow-inner flex flex-col justify-center">
              <label className="text-sm font-bold text-blue-900 uppercase flex items-center gap-2">
                <Clock className="h-4 w-4" /> HORAS ÚTEIS POR MÊS
              </label>
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="font-extrabold text-2xl h-12 text-center text-blue-900 border-blue-200"
              />
              <p className="text-[10px] text-muted-foreground uppercase font-bold text-center">
                PADRÃO: 160H (8H/DIA X 20 DIAS)
              </p>
              <Button
                onClick={handleSaveHours}
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-md text-xs mt-2 font-bold"
              >
                {isSaving ? 'SALVANDO...' : 'SALVAR HORAS'}
              </Button>
            </div>

            <div className="space-y-3 p-5 bg-slate-50 rounded-xl border shadow-inner flex flex-col justify-center">
              <label className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2 mb-2">
                <List className="h-4 w-4" /> CUSTO FIXO MENSAL
              </label>
              <Input
                readOnly
                value={formatCurrency(totalFixed)}
                placeholder="R$ 0,00"
                className="font-extrabold text-2xl h-12 text-center text-slate-800 bg-slate-200/50 border-slate-300 cursor-not-allowed"
              />
              <Button
                onClick={handleOpenModal}
                className="w-full bg-nuvia-navy hover:bg-slate-800 shadow-md h-12 text-sm mt-2 font-bold whitespace-normal"
              >
                <Settings className="h-4 w-4 mr-2 shrink-0" /> DETALHAR E RATEAR DESPESAS
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-4 h-full">
        <Card className="shadow-md border-primary/20 bg-slate-900 text-white h-full">
          <CardContent className="p-6 space-y-8 flex flex-col justify-center h-full">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                TOTAL DE DESPESAS (MENSAL)
              </p>
              <p className="text-3xl font-black text-slate-100">{formatCurrency(totalFixed)}</p>
            </div>
            <div className="pt-6 border-t border-slate-700">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                CUSTO CALCULADO POR MINUTO
              </p>
              <p className="text-4xl font-black text-[#D4AF37]">{formatCurrency(costPerMinute)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalOpen} onOpenChange={(v) => !v && setModalOpen(false)}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col uppercase overflow-hidden p-0">
          <DialogHeader className="p-6 pb-2 shrink-0 border-b">
            <DialogTitle className="text-xl font-black text-nuvia-navy flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" /> DETALHAMENTO DE CUSTOS
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar p-6 max-h-[55vh]">
            <div className="border rounded-xl shadow-sm bg-white overflow-x-auto">
              <Table className="min-w-[800px] relative">
                <TableHeader className="bg-slate-100 sticky top-0 z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700">DESCRIÇÃO</TableHead>
                    <TableHead className="font-bold text-slate-700 w-[180px]">VALOR</TableHead>
                    <TableHead className="font-bold text-slate-700 w-[240px]">
                      TIPO / FREQUÊNCIA
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 w-[200px]">
                      CUSTO MENSAL REAL
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 w-[80px] text-center">
                      AÇÕES
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {draftItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <Input
                          placeholder="EX: CRO, IPTU..."
                          value={item.name}
                          onChange={(e) => handleUpdateDraft(item.id, 'name', e.target.value)}
                          className="bg-white font-bold"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">
                            R$
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={item.gross_base_value || ''}
                            onChange={(e) =>
                              handleUpdateDraft(item.id, 'gross_base_value', Number(e.target.value))
                            }
                            className="bg-white pl-8 font-bold"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.periodicity_type || 'Mensal'}
                          onValueChange={(val: 'Mensal' | 'Anual') =>
                            handleUpdateDraft(item.id, 'periodicity_type', val)
                          }
                        >
                          <SelectTrigger className="bg-white font-bold h-10 uppercase text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mensal">GASTO MENSAL</SelectItem>
                            <SelectItem value="Anual">GASTO ANUAL RATEADO EM 12X</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                            R$
                          </span>
                          <Input
                            readOnly
                            value={(item.calculated_monthly_cost || 0).toFixed(2)}
                            className="bg-slate-100 text-slate-600 font-bold pl-8 border-transparent cursor-not-allowed"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDraft(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {draftItems.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-muted-foreground font-semibold"
                      >
                        NENHUMA DESPESA ADICIONADA.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="p-6 pt-4 shrink-0 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50">
            <Button
              variant="outline"
              className="font-bold text-primary border-primary/20 hover:bg-primary/5 w-full sm:w-auto shadow-sm"
              onClick={handleAddDraft}
            >
              <Plus className="h-4 w-4 mr-2" /> ADICIONAR NOVA DESPESA
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <div className="text-center sm:text-right bg-white px-4 py-2 rounded-lg border shadow-sm w-full sm:w-auto">
                <span className="text-xs font-bold text-muted-foreground mr-2 uppercase block sm:inline">
                  TOTAL DO MÊS:
                </span>
                <span className="text-xl font-black text-emerald-700">
                  {formatCurrency(totalDraftRealCost)}
                </span>
              </div>
              <Button
                onClick={handleSaveAndPersist}
                disabled={isSavingModal}
                className="font-bold uppercase tracking-wide bg-emerald-600 hover:bg-emerald-700 text-white shadow-md w-full sm:w-auto h-11"
              >
                {isSavingModal ? 'SALVANDO...' : 'SALVAR E ATUALIZAR DASHBOARD'}
                {!isSavingModal && <Save className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
