import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Save, Calculator, DollarSign, List, Clock, Pencil, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import useAppStore, { FixedExpense, FixedExpenseDetail } from '@/stores/main'
import { formatCurrency, cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { ExpenseDetailsModal } from './ExpenseDetailsModal'
import { ConsultoriosModal } from './ConsultoriosModal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type EditableFixedExpense = FixedExpense & { inputValue: string }

export function HourlyCostCalculator() {
  const { appSettings, updateAppSettings, isMaster, isAdmin } = useAppStore()
  const { toast } = useToast()

  const [monthlyHours, setMonthlyHours] = useState(
    appSettings?.hourly_cost_monthly_hours?.toString() || '160',
  )
  const [predictedLossPct, setPredictedLossPct] = useState(
    appSettings?.predicted_loss_percentage?.toString() ?? '20',
  )
  const [evalFactorPct, setEvalFactorPct] = useState(
    appSettings?.evaluation_factor_percentage?.toString() ?? '15',
  )
  const [fixedItems, setFixedItems] = useState<EditableFixedExpense[]>([])
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null)
  const [isConsultoriosModalOpen, setIsConsultoriosModalOpen] = useState(false)
  const [isLossModalOpen, setIsLossModalOpen] = useState(false)
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false)

  const canEditMetrics = isMaster || isAdmin

  useEffect(() => {
    if (appSettings) {
      setMonthlyHours(appSettings.hourly_cost_monthly_hours.toString())
      setFixedItems(
        (appSettings.hourly_cost_fixed_items || []).map((i) => ({
          ...i,
          inputValue: i.value.toString(),
        })),
      )
      setPredictedLossPct(appSettings.predicted_loss_percentage?.toString() ?? '20')
      setEvalFactorPct(appSettings.evaluation_factor_percentage?.toString() ?? '15')
    }
  }, [appSettings])

  const addFixedItem = () => {
    setFixedItems([
      ...fixedItems,
      { id: crypto.randomUUID(), label: '', value: 0, inputValue: '', details: [] },
    ])
  }

  const removeFixedItem = (id: string) => {
    setFixedItems(fixedItems.filter((i) => i.id !== id))
  }

  const updateFixedItemLabel = (id: string, label: string) => {
    setFixedItems(fixedItems.map((i) => (i.id === id ? { ...i, label } : i)))
  }

  const updateFixedItemValue = (id: string, inputValue: string) => {
    setFixedItems(
      fixedItems.map((i) =>
        i.id === id ? { ...i, inputValue, value: Number(inputValue) || 0 } : i,
      ),
    )
  }

  const handleSaveDetails = (id: string, details: FixedExpenseDetail[], total: number) => {
    setFixedItems((items) =>
      items.map((i) =>
        i.id === id
          ? {
              ...i,
              details,
              inputValue: total.toString(),
              value: total,
            }
          : i,
      ),
    )
  }

  const handleSaveLossPct = async () => {
    setIsLossModalOpen(false)
    const res = await updateAppSettings({
      predicted_loss_percentage: Number(predictedLossPct) || 0,
    })
    if (res.success) {
      toast({ title: 'SUCESSO', description: 'PERCENTUAL ATUALIZADO.' })
    }
  }

  const handleSaveEvalPct = async () => {
    setIsEvalModalOpen(false)
    const res = await updateAppSettings({
      evaluation_factor_percentage: Number(evalFactorPct) || 0,
    })
    if (res.success) {
      toast({ title: 'SUCESSO', description: 'PERCENTUAL ATUALIZADO.' })
    }
  }

  const handleSave = async () => {
    const itemsToSave = fixedItems.map(({ id, label, value, details }) => ({
      id,
      name: label,
      label,
      value,
      details: details || [],
    }))

    const res = await updateAppSettings({
      hourly_cost_monthly_hours: Number(monthlyHours) || 160,
      hourly_cost_fixed_items: itemsToSave,
      predicted_loss_percentage: Number(predictedLossPct) || 0,
      evaluation_factor_percentage: Number(evalFactorPct) || 0,
    })

    if (res.success) {
      toast({ title: 'SUCESSO', description: 'CUSTOS FIXOS ATUALIZADOS.' })
    } else {
      toast({
        variant: 'destructive',
        title: 'ERRO',
        description: 'FALHA AO SALVAR CUSTOS FIXOS.',
      })
    }
  }

  const totalFixedCosts = fixedItems.reduce((acc, curr) => acc + (Number(curr.inputValue) || 0), 0)
  const hours = Number(monthlyHours) || 160
  const lossPct = Number(predictedLossPct) || 0
  const evalPct = Number(evalFactorPct) || 0

  const predictedLossesHours = hours * (lossPct / 100)
  const effectiveHours = Math.max(0.1, hours - predictedLossesHours)
  const baseHourlyCost = totalFixedCosts / effectiveHours
  const finalHourlyCost = baseHourlyCost * (1 + evalPct / 100)
  const costPerMinute = finalHourlyCost / 60

  const activeExpense = fixedItems.find((i) => i.id === selectedExpenseId)

  return (
    <div className="grid gap-6 md:grid-cols-12 uppercase animate-fade-in">
      <div className="md:col-span-8 space-y-6">
        <Card>
          <CardHeader className="pb-4 border-b flex flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" /> CUSTOS FIXOS E OPERACIONAIS
              </CardTitle>
              <CardDescription className="uppercase font-semibold mt-1">
                PREENCHA AS DESPESAS FIXAS PARA CALCULAR O CUSTO POR MINUTO CLÍNICO.
              </CardDescription>
            </div>
            <Button size="sm" onClick={addFixedItem} className="shrink-0 shadow-md">
              <Plus className="h-4 w-4 mr-2" /> ADICIONAR DESPESA
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <TableRow className="hover:bg-slate-50">
                    <TableHead className="font-bold text-slate-600">DESCRIÇÃO DA DESPESA</TableHead>
                    <TableHead className="font-bold text-slate-600 w-[240px]">VALOR (R$)</TableHead>
                    <TableHead className="w-[80px] text-center">AÇÕES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fixedItems.map((item) => {
                    const hasDetails = item.details && item.details.length > 0
                    return (
                      <TableRow key={item.id} className="hover:bg-slate-50/50">
                        <TableCell className="p-3 align-top">
                          <Input
                            placeholder="DESCRIÇÃO DA DESPESA (EX: ALUGUEL)"
                            value={item.label}
                            onChange={(e) => updateFixedItemLabel(item.id, e.target.value)}
                            className="bg-white border-slate-200 shadow-sm"
                          />
                        </TableCell>
                        <TableCell className="p-3 align-top">
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={item.inputValue}
                                onChange={(e) => updateFixedItemValue(item.id, e.target.value)}
                                className={cn(
                                  'pl-9 bg-white border-slate-200 font-medium shadow-sm transition-colors',
                                  hasDetails &&
                                    'bg-slate-50 text-slate-500 cursor-not-allowed border-dashed',
                                )}
                                readOnly={!!hasDetails}
                                title={hasDetails ? 'Valor calculado via detalhamento' : ''}
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSelectedExpenseId(item.id)}
                              className={cn(
                                'shrink-0 shadow-sm transition-all',
                                hasDetails
                                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary'
                                  : 'text-slate-500 border-slate-200 hover:text-primary hover:border-primary/30 hover:bg-primary/5',
                              )}
                              title="Detalhar despesa"
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="p-3 text-center align-top">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFixedItem(item.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-10 w-10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {fixedItems.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-12 text-muted-foreground font-bold"
                      >
                        NENHUMA DESPESA FIXA CADASTRADA. CLIQUE EM "ADICIONAR DESPESA".
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-4 space-y-6">
        <TooltipProvider>
          <Card className="bg-slate-50/50 border-slate-200 sticky top-6">
            <CardHeader>
              <CardTitle className="text-slate-800 text-lg">RESUMO DO CUSTO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 1. TOTAL CUSTOS FIXOS */}
              <div className="bg-[#000080] p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-[10px] font-black text-[#FFD700] tracking-widest uppercase">
                    TOTAL CUSTOS FIXOS
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-[#FFD700] opacity-80 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Soma de todas as despesas fixas e operacionais mensais da clínica.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-black text-[#FFD700] tracking-tight">
                  {formatCurrency(totalFixedCosts)}
                </p>
              </div>

              {/* 2. HORAS TRABALHADAS MÊS */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                      HORAS TRABALHADAS MÊS
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total de horas de funcionamento da clínica projetadas para o mês.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    onClick={() => setIsConsultoriosModalOpen(true)}
                  >
                    <Clock className="h-3 w-3 mr-1" /> DEFINIR HORAS
                  </Button>
                </div>
                <Input
                  type="number"
                  value={monthlyHours}
                  onChange={(e) => setMonthlyHours(e.target.value)}
                  className="font-black text-lg bg-slate-50 border-slate-200"
                />
              </div>

              {/* 3. PERDAS PREVISTAS */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                      PERDAS PREVISTAS
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Percentual estimado de tempo ocioso ou perdido. Reduz as horas produtivas.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {canEditMetrics && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-slate-400 hover:text-primary"
                      onClick={() => setIsLossModalOpen(true)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                  desmarcação, faltas, ociosidade ({lossPct}%)
                </p>
                <p className="text-lg font-black text-slate-800">
                  {effectiveHours.toFixed(1)} HORAS
                </p>
              </div>

              {/* 4. TOTAL CUSTO HORA */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                    TOTAL CUSTO HORA
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Custo por hora considerando apenas as horas efetivamente produtivas (após
                        perdas).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-lg font-black text-slate-800">
                  {formatCurrency(baseHourlyCost)} / h
                </p>
              </div>

              {/* 5. TOTAL CUSTO HORA + FATOR AVALIAÇÃO */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                      TOTAL CUSTO HORA + FATOR AVALIAÇÃO
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Custo por hora acrescido da margem de fator de avaliação.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {canEditMetrics && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-slate-400 hover:text-primary"
                      onClick={() => setIsEvalModalOpen(true)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                  fator avaliação: {evalPct}%
                </p>
                <p className="text-lg font-black text-slate-800">
                  {formatCurrency(finalHourlyCost)} / h
                </p>
              </div>

              {/* 6. CUSTO CLÍNICO POR MINUTO */}
              <div className="bg-[#000080] p-4 rounded-xl shadow-sm mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-[10px] font-black text-[#FFD700] tracking-widest uppercase">
                    CUSTO CLÍNICO POR MINUTO
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-[#FFD700] opacity-80 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Custo final por minuto de cadeira clínica ocupada.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-3xl font-black text-[#FFD700] tracking-tight">
                  {formatCurrency(costPerMinute)}
                  <span className="text-sm font-bold opacity-80 ml-1 tracking-normal">/ MIN</span>
                </p>
              </div>

              <Button onClick={handleSave} className="w-full h-12 text-sm font-bold shadow-md mt-4">
                <Save className="h-4 w-4 mr-2" /> SALVAR CUSTOS FIXOS
              </Button>
            </CardContent>
          </Card>
        </TooltipProvider>
      </div>

      <ExpenseDetailsModal
        open={!!selectedExpenseId}
        onOpenChange={(open) => !open && setSelectedExpenseId(null)}
        expenseLabel={activeExpense?.label || ''}
        details={activeExpense?.details || []}
        onSave={(details, total) => {
          if (selectedExpenseId) {
            handleSaveDetails(selectedExpenseId, details, total)
          }
        }}
      />

      <ConsultoriosModal open={isConsultoriosModalOpen} onOpenChange={setIsConsultoriosModalOpen} />

      <PercentageEditModal
        open={isLossModalOpen}
        onOpenChange={setIsLossModalOpen}
        title="PERDAS PREVISTAS (%)"
        description="Defina a porcentagem de horas perdidas devido a cancelamentos, faltas e ociosidade."
        value={predictedLossPct}
        setValue={setPredictedLossPct}
        onSave={handleSaveLossPct}
      />

      <PercentageEditModal
        open={isEvalModalOpen}
        onOpenChange={setIsEvalModalOpen}
        title="FATOR AVALIAÇÃO (%)"
        description="Defina a margem adicional sobre o custo hora calculada."
        value={evalFactorPct}
        setValue={setEvalFactorPct}
        onSave={handleSaveEvalPct}
      />
    </div>
  )
}

function PercentageEditModal({
  open,
  onOpenChange,
  title,
  description,
  value,
  setValue,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  value: string
  setValue: (val: string) => void
  onSave: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="uppercase text-primary">{title}</DialogTitle>
          <DialogDescription className="uppercase font-semibold">{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pl-4 pr-8 font-black text-lg bg-slate-50"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
              %
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            CANCELAR
          </Button>
          <Button onClick={onSave} className="font-bold shadow-md">
            SALVAR PERCENTUAL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
