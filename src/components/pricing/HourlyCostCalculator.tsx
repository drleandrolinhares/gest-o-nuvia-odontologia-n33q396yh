import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Save, Calculator, DollarSign } from 'lucide-react'
import useAppStore, { FixedExpense } from '@/stores/main'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export function HourlyCostCalculator() {
  const { appSettings, updateAppSettings } = useAppStore()
  const { toast } = useToast()

  const [cardFee, setCardFee] = useState(appSettings?.global_card_fee?.toString() || '0')
  const [commission, setCommission] = useState(appSettings?.global_commission?.toString() || '0')
  const [inadimplency, setInadimplency] = useState(
    appSettings?.global_inadimplency?.toString() || '0',
  )
  const [taxes, setTaxes] = useState(appSettings?.global_taxes?.toString() || '0')
  const [monthlyHours, setMonthlyHours] = useState(
    appSettings?.hourly_cost_monthly_hours?.toString() || '160',
  )
  const [fixedItems, setFixedItems] = useState<FixedExpense[]>(
    appSettings?.hourly_cost_fixed_items || [],
  )

  useEffect(() => {
    if (appSettings) {
      setCardFee(appSettings.global_card_fee.toString())
      setCommission(appSettings.global_commission.toString())
      setInadimplency(appSettings.global_inadimplency.toString())
      setTaxes(appSettings.global_taxes.toString())
      setMonthlyHours(appSettings.hourly_cost_monthly_hours.toString())
      setFixedItems(appSettings.hourly_cost_fixed_items || [])
    }
  }, [appSettings])

  const addFixedItem = () => {
    setFixedItems([...fixedItems, { id: crypto.randomUUID(), name: '', value: 0 }])
  }

  const removeFixedItem = (id: string) => {
    setFixedItems(fixedItems.filter((i) => i.id !== id))
  }

  const updateFixedItem = (id: string, field: 'name' | 'value', val: string | number) => {
    setFixedItems(fixedItems.map((i) => (i.id === id ? { ...i, [field]: val } : i)))
  }

  const handleSave = async () => {
    const res = await updateAppSettings({
      global_card_fee: Number(cardFee) || 0,
      global_commission: Number(commission) || 0,
      global_inadimplency: Number(inadimplency) || 0,
      global_taxes: Number(taxes) || 0,
      hourly_cost_monthly_hours: Number(monthlyHours) || 160,
      hourly_cost_fixed_items: fixedItems,
    })

    if (res.success) {
      toast({ title: 'SUCESSO', description: 'CONFIGURAÇÕES DE CUSTO ATUALIZADAS.' })
    } else {
      toast({
        variant: 'destructive',
        title: 'ERRO',
        description: 'FALHA AO SALVAR CONFIGURAÇÕES.',
      })
    }
  }

  const totalFixedCosts = fixedItems.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0)
  const hours = Number(monthlyHours) || 160
  const costPerMinute = totalFixedCosts / (hours * 60)

  return (
    <div className="grid gap-6 md:grid-cols-12 uppercase animate-fade-in">
      <div className="md:col-span-8 space-y-6">
        <Card>
          <CardHeader className="pb-4 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-primary" /> CUSTOS FIXOS E OPERACIONAIS
            </CardTitle>
            <CardDescription className="uppercase font-semibold">
              PREENCHA AS DESPESAS FIXAS PARA CALCULAR O CUSTO POR MINUTO CLÍNICO.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">TAXA CARTÃO (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={cardFee}
                  onChange={(e) => setCardFee(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">COMISSÃO MÁQ (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">INADIMPLÊNCIA (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={inadimplency}
                  onChange={(e) => setInadimplency(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground">IMPOSTOS (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={taxes}
                  onChange={(e) => setTaxes(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">LISTA DE DESPESAS FIXAS (MENSAL)</h3>
                <Button variant="outline" size="sm" onClick={addFixedItem}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> ADICIONAR
                </Button>
              </div>
              <div className="space-y-3 bg-muted/20 p-4 rounded-xl border">
                {fixedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Input
                      placeholder="DESCRIÇÃO DA DESPESA (EX: ALUGUEL)"
                      value={item.name}
                      onChange={(e) => updateFixedItem(item.id, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <div className="relative w-[180px]">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={item.value || ''}
                        onChange={(e) => updateFixedItem(item.id, 'value', Number(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFixedItem(item.id)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {fixedItems.length === 0 && (
                  <p className="text-center py-4 text-xs font-bold text-muted-foreground">
                    NENHUMA DESPESA FIXA CADASTRADA.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-4 space-y-6">
        <Card className="bg-primary/5 border-primary/20">
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
                className="font-black text-lg bg-white"
              />
            </div>

            <div className="pt-4 border-t border-primary/10 space-y-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1">
                  TOTAL DE DESPESAS FIXAS
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {formatCurrency(totalFixedCosts)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-primary/20 shadow-sm">
                <p className="text-xs font-black text-primary mb-1 tracking-widest uppercase">
                  CUSTO CLÍNICO POR MINUTO
                </p>
                <p className="text-3xl font-black text-primary">
                  {formatCurrency(costPerMinute)}
                  <span className="text-sm font-bold text-muted-foreground ml-1">/ MIN</span>
                </p>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full h-12 text-sm font-bold shadow-md">
              <Save className="h-4 w-4 mr-2" /> SALVAR CONFIGURAÇÕES
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
