import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useAppStore, { FixedItem } from '@/stores/main'
import { Save, Plus, Trash2, Clock, Calculator } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'

export function HourlyCostTab() {
  const { appSettings, updateAppSettings } = useAppStore()
  const { toast } = useToast()

  const [hours, setHours] = useState('160')
  const [items, setItems] = useState<FixedItem[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemValue, setNewItemValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (appSettings) {
      setHours(appSettings.hourly_cost_monthly_hours.toString())
      setItems(appSettings.hourly_cost_fixed_items || [])
    }
  }, [appSettings])

  const totalFixed = items.reduce((acc, curr) => acc + Number(curr.value || 0), 0)
  const costPerMinute = Number(hours) > 0 ? totalFixed / (Number(hours) * 60) : 0

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItemName.trim() && Number(newItemValue) >= 0) {
      setItems([
        ...items,
        { id: crypto.randomUUID(), name: newItemName.toUpperCase(), value: Number(newItemValue) },
      ])
      setNewItemName('')
      setNewItemValue('')
    }
  }

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const res = await updateAppSettings({
      hourly_cost_monthly_hours: Number(hours) || 160,
      hourly_cost_fixed_items: items,
    })
    setIsSaving(false)

    if (res.success) {
      toast({ title: 'SUCESSO', description: 'CUSTO HORA SALVO COM SUCESSO.' })
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO SALVAR.' })
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      <Card className="lg:col-span-8 shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-nuvia-navy" /> DESPESAS FIXAS MENSAIS
          </CardTitle>
          <CardDescription className="text-xs uppercase font-semibold">
            ADICIONE ALUGUEL, FOLHA, ENERGIA E OUTROS CUSTOS FIXOS DA OPERAÇÃO.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <form onSubmit={handleAddItem} className="flex gap-3">
            <Input
              placeholder="NOME DA DESPESA (EX: ALUGUEL)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 bg-slate-50"
            />
            <Input
              type="number"
              step="0.01"
              placeholder="VALOR (R$)"
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
              className="w-32 bg-slate-50"
            />
            <Button type="submit" disabled={!newItemName.trim() || !newItemValue}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-card hover:border-primary/30 transition-colors"
              >
                <span className="font-bold text-sm text-slate-700 uppercase">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-extrabold text-muted-foreground">
                    {formatCurrency(item.value)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50 font-bold text-xs uppercase">
                NENHUMA DESPESA FIXA CADASTRADA.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-4 space-y-6">
        <Card className="shadow-sm border-blue-200">
          <CardHeader className="bg-blue-50/50 pb-4 border-b border-blue-100">
            <CardTitle className="text-blue-900 flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" /> HORAS TRABALHADAS
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">
                HORAS ÚTEIS POR MÊS
              </label>
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="font-extrabold text-lg"
              />
              <p className="text-[10px] text-muted-foreground uppercase font-medium">
                Padrão: 160h (8h/dia x 20 dias)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-primary/20 bg-slate-900 text-white">
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                TOTAL DE DESPESAS FIXAS
              </p>
              <p className="text-2xl font-black text-slate-100">{formatCurrency(totalFixed)}</p>
            </div>
            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                CUSTO CALCULADO POR MINUTO
              </p>
              <p className="text-3xl font-black text-[#D4AF37]">{formatCurrency(costPerMinute)}</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] font-bold uppercase mt-4"
            >
              {isSaving ? 'SALVANDO...' : 'SALVAR CÁLCULO'}
              {!isSaving && <Save className="h-4 w-4 ml-2" />}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
