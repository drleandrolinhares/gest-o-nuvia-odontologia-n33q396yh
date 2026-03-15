import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  TableFooter,
} from '@/components/ui/table'
import useAppStore, { FixedItem } from '@/stores/main'
import { Save, Plus, Trash2, Clock, Calculator, List } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'

export function HourlyCostTab() {
  const { appSettings, updateAppSettings } = useAppStore()
  const { toast } = useToast()

  const [hours, setHours] = useState('160')
  const [items, setItems] = useState<FixedItem[]>([])

  const [modalOpen, setModalOpen] = useState(false)
  const [newDesc, setNewDesc] = useState('')
  const [newGross, setNewGross] = useState('')
  const [newPeriod, setNewPeriod] = useState<'Mensal' | 'Anual'>('Mensal')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (appSettings) {
      setHours(appSettings.hourly_cost_monthly_hours.toString())
      setItems(appSettings.hourly_cost_fixed_items || [])
    }
  }, [appSettings])

  const totalFixed = items.reduce(
    (acc, curr) => acc + Number(curr.calculated_monthly_cost ?? curr.value ?? 0),
    0,
  )
  const costPerMinute = Number(hours) > 0 ? totalFixed / (Number(hours) * 60) : 0

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newDesc.trim() && Number(newGross) >= 0) {
      const gross = Number(newGross)
      const monthly = newPeriod === 'Mensal' ? gross : gross / 12
      setItems([
        ...items,
        {
          id: crypto.randomUUID(),
          description: newDesc.toUpperCase(),
          gross_base_value: gross,
          periodicity_type: newPeriod,
          calculated_monthly_cost: monthly,
          name: newDesc.toUpperCase(),
          value: monthly,
        },
      ])
      setNewDesc('')
      setNewGross('')
      setNewPeriod('Mensal')
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
            <Calculator className="h-5 w-5 text-nuvia-navy" /> CÁLCULO DE CUSTO HORA
          </CardTitle>
          <CardDescription className="text-xs uppercase font-semibold">
            INFORME AS HORAS TRABALHADAS E OS CUSTOS FIXOS (RATEADOS OU INTEGRAIS) PARA CALCULAR O
            CUSTO POR MINUTO CLÍNICO.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3 p-5 bg-blue-50/50 rounded-xl border border-blue-100 shadow-inner">
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
            </div>

            <div className="space-y-3 p-5 bg-slate-50 rounded-xl border shadow-inner flex flex-col justify-center">
              <label className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2 mb-2">
                <List className="h-4 w-4" /> DESPESAS FIXAS DA OPERAÇÃO
              </label>
              <Button
                onClick={() => setModalOpen(true)}
                className="w-full bg-nuvia-navy hover:bg-slate-800 shadow-md h-12 text-sm"
                size="lg"
              >
                GERENCIAR RATEIO ({items.length} ITENS)
              </Button>
              <p className="text-[10px] text-muted-foreground uppercase font-bold text-center">
                ATUALIZE O RATEIO MENSAL E ANUAL
              </p>
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
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] font-black uppercase mt-4 h-12 shadow-lg hover:shadow-xl transition-all"
            >
              {isSaving ? 'SALVANDO...' : 'SALVAR CÁLCULO'}
              {!isSaving && <Save className="h-5 w-5 ml-2" />}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col uppercase">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 font-black text-nuvia-navy">
              <List className="h-5 w-5 text-primary" /> RATEIO DE DESPESAS FIXAS
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleAddItem}
            className="flex flex-col sm:flex-row gap-3 mb-2 mt-4 bg-slate-50 p-4 rounded-xl border"
          >
            <Input
              required
              placeholder="DESCRIÇÃO (EX: CRO, ALUGUEL)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="flex-1 bg-white font-bold"
            />
            <Input
              required
              type="number"
              step="0.01"
              placeholder="VALOR BRUTO (R$)"
              value={newGross}
              onChange={(e) => setNewGross(e.target.value)}
              className="w-full sm:w-40 bg-white font-bold"
            />
            <Select value={newPeriod} onValueChange={(v: any) => setNewPeriod(v)}>
              <SelectTrigger className="w-full sm:w-48 bg-white font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mensal" className="font-bold">
                  MENSAL (INTEGRAL)
                </SelectItem>
                <SelectItem value="Anual" className="font-bold">
                  ANUAL (RATEADO)
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="submit"
              disabled={!newDesc || !newGross}
              className="w-full sm:w-auto font-bold shadow-sm"
            >
              <Plus className="h-4 w-4" /> ADICIONAR
            </Button>
          </form>

          <div className="flex-1 overflow-y-auto border rounded-xl shadow-sm min-h-[300px] bg-white custom-scrollbar">
            <Table>
              <TableHeader className="bg-slate-100 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="font-bold text-slate-700 uppercase">DESCRIÇÃO</TableHead>
                  <TableHead className="font-bold text-slate-700 text-right uppercase">
                    VALOR BRUTO BASE
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 text-center uppercase">
                    TIPO DE LANÇAMENTO
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 text-right uppercase">
                    CUSTO MENSAL
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 text-center w-[80px] uppercase">
                    AÇÃO
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50">
                    <TableCell className="font-bold text-slate-800">
                      {item.description || item.name}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.gross_base_value ?? item.value ?? 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase ${item.periodicity_type === 'Anual' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}
                      >
                        {item.periodicity_type || 'MENSAL'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-black text-emerald-700">
                      {formatCurrency(item.calculated_monthly_cost ?? item.value ?? 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-12 text-muted-foreground font-semibold uppercase tracking-widest"
                    >
                      NENHUMA DESPESA FIXA CADASTRADA.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter className="bg-slate-100 sticky bottom-0">
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-right font-black uppercase tracking-widest text-slate-700"
                  >
                    TOTAL MENSAL (COMPETÊNCIA):
                  </TableCell>
                  <TableCell className="text-right font-black text-lg text-emerald-700">
                    {formatCurrency(totalFixed)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <DialogFooter className="mt-4 pt-4 border-t">
            <Button variant="outline" className="font-bold" onClick={() => setModalOpen(false)}>
              CONCLUÍDO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
