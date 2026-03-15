import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useAppStore, { PriceList, PriceStage } from '@/stores/main'
import { calculateProfitability, getMarginColorHex } from '@/lib/finance'
import { formatCurrency } from '@/lib/utils'
import { Save, AlertTriangle, CheckCircle, Percent, Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Props {
  item: PriceList | null
  open: boolean
  onOpenChange: (val: boolean) => void
}

export function PriceListModal({ item, open, onOpenChange }: Props) {
  const { appSettings, savePriceList, priceStages } = useAppStore()
  const { toast } = useToast()

  const [workType, setWorkType] = useState('')
  const [category, setCategory] = useState('')
  const [material, setMaterial] = useState('')
  const [sector, setSector] = useState('')
  const [price, setPrice] = useState('')
  const [execTime, setExecTime] = useState('')
  const [cadistaCost, setCadistaCost] = useState('')
  const [materialCost, setMaterialCost] = useState('')
  const [stages, setStages] = useState<{ id: string; name: string; percentage: string }[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      if (item) {
        setWorkType(item.work_type)
        setCategory(item.category)
        setMaterial(item.material || '')
        setSector(item.sector || '')
        setPrice(item.price.toString())
        setExecTime(item.execution_time.toString())
        setCadistaCost(item.cadista_cost.toString())
        setMaterialCost(item.material_cost.toString())

        const st = priceStages.filter((s) => s.price_list_id === item.id)
        setStages(
          st.map((s) => ({
            id: crypto.randomUUID(),
            name: s.name,
            percentage: s.percentage.toString(),
          })),
        )
      } else {
        setWorkType('')
        setCategory('')
        setMaterial('')
        setSector('')
        setPrice('')
        setExecTime('')
        setCadistaCost('')
        setMaterialCost('')
        setStages([])
      }
    }
  }, [open, item, priceStages])

  const stats = calculateProfitability(
    {
      price: Number(price),
      execution_time: Number(execTime),
      cadista_cost: Number(cadistaCost),
      material_cost: Number(materialCost),
    },
    appSettings,
  )

  const handleAddStage = () => {
    setStages([...stages, { id: crypto.randomUUID(), name: '', percentage: '' }])
  }

  const removeStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id))
  }

  const updateStage = (id: string, field: 'name' | 'percentage', value: string) => {
    setStages(stages.map((s) => (s.id === id ? { ...s, [field]: value.toUpperCase() } : s)))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const totalPerc = stages.reduce((acc, s) => acc + Number(s.percentage), 0)
    if (stages.length > 0 && totalPerc !== 100) {
      toast({
        variant: 'destructive',
        title: 'ATENÇÃO',
        description: 'A SOMA DAS PORCENTAGENS DAS ETAPAS DEVE SER EXATAMENTE 100%.',
      })
      return
    }

    setIsSaving(true)
    const res = await savePriceList(
      {
        work_type: workType.toUpperCase(),
        category: category.toUpperCase(),
        material: material.toUpperCase(),
        sector: sector.toUpperCase(),
        price: Number(price),
        execution_time: Number(execTime),
        cadista_cost: Number(cadistaCost),
        material_cost: Number(materialCost),
        fixed_cost: stats.fixedCost,
      },
      stages.map((s) => ({ name: s.name, percentage: Number(s.percentage) })),
      item?.id,
    )
    setIsSaving(false)

    if (res.success) {
      toast({ title: 'SUCESSO', description: 'SERVIÇO SALVO COM SUCESSO.' })
      onOpenChange(false)
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO SALVAR SERVIÇO.' })
    }
  }

  const marginColor = getMarginColorHex(stats.margin)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-slate-50 border-0 shadow-2xl">
        <DialogHeader className="p-6 bg-white border-b sticky top-0 z-10">
          <DialogTitle className="text-xl font-black text-nuvia-navy uppercase">
            {item ? 'EDITAR SERVIÇO / PRODUTO' : 'NOVO SERVIÇO / PRODUTO'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 h-full max-h-[80vh] overflow-y-auto">
          {/* LEFT SIDE - FORM */}
          <div className="p-6 bg-white space-y-6">
            <form id="price-form" onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest border-b pb-2">
                  DADOS PRINCIPAIS
                </h3>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase">TIPO DE SERVIÇO *</Label>
                  <Input
                    required
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    placeholder="EX: COROA EMAX"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">CATEGORIA *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="SELECIONE..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRÓTESE">PRÓTESE</SelectItem>
                        <SelectItem value="ALINHADORES">ALINHADORES</SelectItem>
                        <SelectItem value="IMPLANTES">IMPLANTES</SelectItem>
                        <SelectItem value="CLÍNICO">CLÍNICO</SelectItem>
                        <SelectItem value="OUTROS">OUTROS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">MATERIAL</Label>
                    <Input value={material} onChange={(e) => setMaterial(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">PREÇO DE VENDA (R$) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="font-bold text-emerald-700 bg-emerald-50 border-emerald-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">TEMPO EXECUÇÃO (MIN) *</Label>
                    <Input
                      type="number"
                      required
                      value={execTime}
                      onChange={(e) => setExecTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest border-b pb-2">
                  CUSTOS DIRETOS
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">CUSTO CADISTA (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={cadistaCost}
                      onChange={(e) => setCadistaCost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">CUSTO MATERIAL (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={materialCost}
                      onChange={(e) => setMaterialCost(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest">
                    ETAPAS DE COBRANÇA (OPCIONAL)
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStage}
                    className="h-7 text-xs font-bold"
                  >
                    <Plus className="h-3 w-3 mr-1" /> ADICIONAR ETAPA
                  </Button>
                </div>
                {stages.length > 0 && (
                  <div className="space-y-2">
                    {stages.map((stage) => (
                      <div key={stage.id} className="flex items-center gap-2">
                        <Input
                          placeholder="NOME DA ETAPA"
                          value={stage.name}
                          onChange={(e) => updateStage(stage.id, 'name', e.target.value)}
                          className="flex-1 text-xs"
                          required
                        />
                        <div className="relative w-24">
                          <Input
                            type="number"
                            placeholder="%"
                            value={stage.percentage}
                            onChange={(e) => updateStage(stage.id, 'percentage', e.target.value)}
                            className="pr-6 text-xs text-right font-bold"
                            required
                          />
                          <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStage(stage.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-red-500 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="text-[10px] font-bold text-right text-muted-foreground uppercase pt-1">
                      SOMA TOTAL: {stages.reduce((acc, s) => acc + Number(s.percentage), 0)}%
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT SIDE - ANALYSIS */}
          <div className="bg-slate-900 p-6 text-white flex flex-col">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-700 pb-4 mb-6 flex items-center justify-between">
              <span>ANÁLISE DE RENTABILIDADE</span>
              {stats.margin < 10 && (
                <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
              )}
              {stats.margin >= 20 && <CheckCircle className="h-5 w-5 text-emerald-500" />}
            </h3>

            <div className="space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    CUSTO FIXO ({execTime || 0}m)
                  </p>
                  <p className="text-lg font-bold">{formatCurrency(stats.fixedCost)}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    CUSTO VARIÁVEL (CAD+MAT)
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(stats.totalCost - stats.fixedCost - stats.globalFeesVal)}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between items-end mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    TAXAS GLOBAIS ({stats.globalFeesPerc}%)
                  </p>
                  <p className="text-xs text-slate-500 font-medium">Cartão + Comis. + Impostos</p>
                </div>
                <p className="text-lg font-bold text-amber-500">
                  {formatCurrency(stats.globalFeesVal)}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold text-slate-300 uppercase">
                    CUSTO TOTAL CALCULADO
                  </p>
                  <p className="text-xl font-black text-red-400">
                    {formatCurrency(stats.totalCost)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-slate-300 uppercase">PREÇO DE VENDA</p>
                  <p className="text-xl font-black text-emerald-400">
                    {formatCurrency(Number(price) || 0)}
                  </p>
                </div>
              </div>

              <div
                className="mt-8 bg-slate-800 p-6 rounded-2xl border-2 shadow-xl flex flex-col items-center justify-center relative overflow-hidden"
                style={{ borderColor: marginColor }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundColor: marginColor }}
                ></div>
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2 z-10">
                  LUCRO LÍQUIDO
                </p>
                <p className="text-4xl font-black mb-1 z-10" style={{ color: marginColor }}>
                  {formatCurrency(stats.netProfit)}
                </p>
                <div className="bg-slate-900 px-4 py-1.5 rounded-full border border-slate-700 mt-3 z-10 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">MARGEM:</span>
                  <span className="text-lg font-black" style={{ color: marginColor }}>
                    {stats.margin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white uppercase font-bold"
              >
                CANCELAR
              </Button>
              <Button
                type="submit"
                form="price-form"
                disabled={isSaving}
                className="bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] uppercase font-black"
              >
                {isSaving ? 'SALVANDO...' : 'SALVAR E APLICAR'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
