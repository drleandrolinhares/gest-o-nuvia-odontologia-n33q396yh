import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Save, Calculator, DollarSign } from 'lucide-react'
import useAppStore, { FixedExpense } from '@/stores/main'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type EditableFixedExpense = FixedExpense & { inputValue: string }

export function HourlyCostCalculator() {
  const { appSettings, updateAppSettings } = useAppStore()
  const { toast } = useToast()

  const [monthlyHours, setMonthlyHours] = useState(
    appSettings?.hourly_cost_monthly_hours?.toString() || '160',
  )
  const [fixedItems, setFixedItems] = useState<EditableFixedExpense[]>([])

  useEffect(() => {
    if (appSettings) {
      setMonthlyHours(appSettings.hourly_cost_monthly_hours.toString())
      setFixedItems(
        (appSettings.hourly_cost_fixed_items || []).map((i) => ({
          ...i,
          inputValue: i.value.toString(),
        })),
      )
    }
  }, [appSettings])

  const addFixedItem = () => {
    setFixedItems([...fixedItems, { id: crypto.randomUUID(), label: '', value: 0, inputValue: '' }])
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

  const handleSave = async () => {
    const itemsToSave = fixedItems.map(({ id, label, value }) => ({
      id,
      name: label,
      label,
      value,
    }))

    const res = await updateAppSettings({
      hourly_cost_monthly_hours: Number(monthlyHours) || 160,
      hourly_cost_fixed_items: itemsToSave,
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
  const costPerMinute = hours > 0 ? totalFixedCosts / (hours * 60) : 0

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
            <Button size="sm" onClick={addFixedItem} className="shrink-0">
              <Plus className="h-4 w-4 mr-2" /> ADICIONAR DESPESA
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <TableRow className="hover:bg-slate-50">
                    <TableHead className="font-bold text-slate-600">DESCRIÇÃO DA DESPESA</TableHead>
                    <TableHead className="font-bold text-slate-600 w-[200px]">VALOR (R$)</TableHead>
                    <TableHead className="w-[80px] text-center">AÇÕES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fixedItems.map((item) => (
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
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={item.inputValue}
                            onChange={(e) => updateFixedItemValue(item.id, e.target.value)}
                            className="pl-9 bg-white border-slate-200 font-medium shadow-sm"
                          />
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
                  ))}
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
        <Card className="bg-primary/5 border-primary/20 sticky top-6">
          <CardHeader>
            <CardTitle className="text-primary text-lg">RESUMO DO CUSTO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">
                HORAS TRABALHADAS (MÊS)
              </label>
              <Input
                type="number"
                value={monthlyHours}
                onChange={(e) => setMonthlyHours(e.target.value)}
                className="font-black text-lg bg-white border-primary/20 shadow-sm"
              />
            </div>

            <div className="pt-4 border-t border-primary/10 space-y-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1">
                  TOTAL DE CUSTOS FIXOS DO MÊS
                </p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">
                  {formatCurrency(totalFixedCosts)}
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-primary/20 shadow-sm">
                <p className="text-[10px] font-black text-primary mb-1 tracking-widest uppercase">
                  CUSTO CLÍNICO POR MINUTO
                </p>
                <p className="text-3xl font-black text-primary tracking-tight">
                  {formatCurrency(costPerMinute)}
                  <span className="text-sm font-bold text-muted-foreground ml-1 tracking-normal">
                    / MIN
                  </span>
                </p>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full h-12 text-sm font-bold shadow-md">
              <Save className="h-4 w-4 mr-2" /> SALVAR CUSTOS FIXOS
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
