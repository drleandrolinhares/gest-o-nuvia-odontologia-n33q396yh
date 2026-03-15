import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAppStore, { PriceItem } from '@/stores/main'
import { calculateProfitability, getMarginColor, getCostPerMinute } from '@/lib/pricing'
import { formatCurrency, cn } from '@/lib/utils'
import { DollarSign, Clock, Calculator, PieChart, Plus, Trash2, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

interface PricingEditModalProps {
  item: PriceItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Stage {
  id: string
  name: string
  percentage: number
}

export function PricingEditModal({ item, open, onOpenChange }: PricingEditModalProps) {
  const { appSettings, addPriceItem, updatePriceItem } = useAppStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<PriceItem>>({})
  const [stages, setStages] = useState<Stage[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      if (item) {
        setFormData({ ...item })
        fetchStages(item.id)
      } else {
        setFormData({
          work_type: '',
          category: 'GERAL',
          price: 0,
          execution_time: 0,
          material_cost: 0,
          cadista_cost: 0,
          sector: '',
          material: '',
        })
        setStages([])
      }
    }
  }, [item, open])

  const fetchStages = async (priceListId: string) => {
    try {
      const { data } = await supabase
        .from('price_stages')
        .select('*')
        .eq('price_list_id', priceListId)
      if (data) {
        setStages(
          data.map((d: any) => ({
            id: d.id,
            name: d.name,
            percentage: Number(d.percentage) || 0,
          })),
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddStage = () => {
    setStages([...stages, { id: crypto.randomUUID(), name: '', percentage: 0 }])
  }

  const handleRemoveStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id))
  }

  const handleUpdateStage = (id: string, field: 'name' | 'percentage', value: string | number) => {
    setStages(stages.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const stats = calculateProfitability(formData, appSettings)
  const marginColor = getMarginColor(stats.marginPct)

  const costPerMinute = getCostPerMinute(appSettings)
  const monthlyHours = Number(appSettings?.hourly_cost_monthly_hours) || 160
  const totalFixedCosts = costPerMinute * (monthlyHours * 60)

  const handleSave = async () => {
    if (!formData.work_type) {
      toast({
        variant: 'destructive',
        title: 'Atenção',
        description: 'Preencha o nome do procedimento.',
      })
      return
    }
    setIsSaving(true)

    try {
      let res
      let procedureId = item?.id

      if (item?.id) {
        res = await updatePriceItem(item.id, formData)
      } else {
        res = await addPriceItem(formData as Omit<PriceItem, 'id'>)
        procedureId = res.id
      }

      if (res.success && procedureId) {
        await supabase.from('price_stages').delete().eq('price_list_id', procedureId)
        if (stages.length > 0) {
          const stagesToInsert = stages
            .filter((s) => s.name.trim())
            .map((s) => ({
              price_list_id: procedureId,
              name: s.name.toUpperCase(),
              percentage: s.percentage,
            }))
          if (stagesToInsert.length > 0) {
            await supabase.from('price_stages').insert(stagesToInsert)
          }
        }
        toast({ title: 'SUCESSO', description: 'PROCEDIMENTO SALVO COM SUCESSO.' })
        onOpenChange(false)
      } else {
        throw new Error('Falha ao salvar')
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO SALVAR.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] w-[95vw] uppercase p-0 overflow-hidden bg-slate-50 gap-0 border-0 rounded-2xl shadow-2xl h-[90vh] flex flex-col">
        <DialogHeader className="p-6 bg-white border-b shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-extrabold text-slate-800 tracking-tight">
            {item ? 'EDITAR PROCEDIMENTO' : 'NOVO PROCEDIMENTO'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Top Summary Cards */}
          <div className="p-6 bg-slate-50 border-b flex flex-wrap gap-4 shrink-0">
            <div className="flex-1 min-w-[200px] bg-white rounded-xl border-l-4 border-l-slate-400 border-y border-r border-slate-200 p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <DollarSign className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-xs font-black text-slate-500 tracking-widest mb-1">
                TOTAL DE CUSTOS FIXOS
              </p>
              <p className="text-2xl font-black text-slate-700">
                {formatCurrency(totalFixedCosts)}
              </p>
            </div>
            <div className="flex-1 min-w-[200px] bg-blue-50/50 rounded-xl border-l-4 border-l-blue-400 border-y border-r border-blue-100 p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-xs font-black text-blue-600 tracking-widest mb-1">
                TOTAL CUSTO HORA
              </p>
              <p className="text-2xl font-black text-blue-700">
                {formatCurrency(costPerMinute * 60)}
              </p>
            </div>
            <div className="flex-1 min-w-[200px] bg-emerald-50/50 rounded-xl border-l-4 border-l-emerald-400 border-y border-r border-emerald-100 p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <Calculator className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-xs font-black text-emerald-600 tracking-widest mb-1">
                TOTAL CUSTO POR MINUTO
              </p>
              <p className="text-2xl font-black text-emerald-700">
                {formatCurrency(costPerMinute)}
              </p>
            </div>
          </div>

          {/* Split Content */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Left Side - Form Inputs */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-white border-r custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">NOME DO PROCEDIMENTO *</Label>
                  <Input
                    value={formData.work_type || ''}
                    onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                    placeholder="EX: COROA IMPRESSA"
                    className="font-semibold bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">CATEGORIA</Label>
                  <Input
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="EX: PRÓTESE FIXA"
                    className="font-semibold bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">SETOR</Label>
                  <Input
                    value={formData.sector || ''}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    placeholder="EX: SOLUÇÕES CERÂMICAS"
                    className="font-semibold bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">MATERIAL</Label>
                  <Input
                    value={formData.material || ''}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="SELECIONE OU DIGITE..."
                    className="font-semibold bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-slate-700">
                    VALOR DE VENDA FINAL (R$) *
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="font-black text-lg bg-white border-slate-300 focus-visible:ring-[#D81B84]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">
                    TEMPO DE EXECUÇÃO (MINUTOS)
                  </Label>
                  <Input
                    type="number"
                    value={formData.execution_time || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, execution_time: Number(e.target.value) })
                    }
                    className="font-bold text-lg bg-white border-slate-300 focus-visible:ring-[#D81B84]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-500 tracking-widest">
                  CUSTO FIXO ESPECÍFICO DESTE PROCEDIMENTO (TEMPO × CUSTO/MIN)
                </Label>
                <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-[#D81B84]">
                  {formatCurrency(stats.fixedCost)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">CUSTO LABORATÓRIO (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cadista_cost || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, cadista_cost: Number(e.target.value) })
                    }
                    className="font-bold bg-white border-slate-300 focus-visible:ring-[#D81B84]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">CUSTO DE MATERIAL (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.material_cost || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, material_cost: Number(e.target.value) })
                    }
                    className="font-bold bg-white border-slate-300 focus-visible:ring-[#D81B84]"
                  />
                </div>
              </div>

              <div className="pt-6 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      ETAPAS DE FATURAMENTO (OPCIONAL)
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium normal-case mt-0.5">
                      Divida o valor por etapas do Kanban (não interfere no cálculo de lucro).
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddStage}
                    className="h-8 text-xs font-bold bg-white border-slate-300 hover:bg-slate-50"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> ADD ETAPA
                  </Button>
                </div>

                {stages.length > 0 && (
                  <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {stages.map((stage) => (
                      <div key={stage.id} className="flex items-center gap-2">
                        <Input
                          placeholder="NOME DA ETAPA"
                          value={stage.name}
                          onChange={(e) => handleUpdateStage(stage.id, 'name', e.target.value)}
                          className="h-9 text-xs font-bold bg-white flex-1"
                        />
                        <div className="relative w-24">
                          <Input
                            type="number"
                            placeholder="%"
                            value={stage.percentage || ''}
                            onChange={(e) =>
                              handleUpdateStage(stage.id, 'percentage', e.target.value)
                            }
                            className="h-9 text-xs font-bold bg-white pr-6"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            %
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStage(stage.id)}
                          className="h-9 w-9 text-slate-400 hover:text-red-500 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Analysis */}
            <div className="w-full md:w-[380px] lg:w-[420px] bg-slate-50 flex flex-col shrink-0">
              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <h3 className="flex items-center gap-2 font-black text-[#D81B84] mb-6 text-lg tracking-tight">
                  <PieChart className="h-5 w-5" /> ANÁLISE DE RENTABILIDADE
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-end pb-3 border-b-2 border-slate-200">
                    <span className="text-sm font-bold text-slate-700">Preço de Venda Final</span>
                    <span className="text-2xl font-black text-slate-900">
                      {formatCurrency(Number(formData.price))}
                    </span>
                  </div>

                  <div className="space-y-3 py-2 text-sm">
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Custo Fixo</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">- {formatCurrency(stats.fixedCost)}</span>
                        <span className="text-[10px] w-12 text-right">
                          ({((stats.fixedCost / (Number(formData.price) || 1)) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Custo Laboratório</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">- {formatCurrency(stats.cadistaCost)}</span>
                        <span className="text-[10px] w-12 text-right">
                          ({((stats.cadistaCost / (Number(formData.price) || 1)) * 100).toFixed(1)}
                          %)
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Custo de Material</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          - {formatCurrency(stats.materialCost)}
                        </span>
                        <span className="text-[10px] w-12 text-right">
                          ({((stats.materialCost / (Number(formData.price) || 1)) * 100).toFixed(1)}
                          %)
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-slate-200 my-2"></div>

                    <div className="flex justify-between items-center text-slate-500">
                      <span>
                        Taxa de Cartão <span className="text-[10px]">({stats.cardFeePct}%)</span>
                      </span>
                      <span className="font-semibold">- {formatCurrency(stats.cardFee)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>
                        Comissões <span className="text-[10px]">({stats.commissionPct}%)</span>
                      </span>
                      <span className="font-semibold">- {formatCurrency(stats.commission)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>
                        Impostos <span className="text-[10px]">({stats.taxesPct}%)</span>
                      </span>
                      <span className="font-semibold">- {formatCurrency(stats.taxes)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>
                        Inadimplência <span className="text-[10px]">({stats.defaultPct}%)</span>
                      </span>
                      <span className="font-semibold">- {formatCurrency(stats.defaultFee)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200">
                    <span className="text-sm font-bold text-[#D81B84]">Custo Total Estimado</span>
                    <span className="text-lg font-black text-[#D81B84]">
                      {formatCurrency(stats.totalCost)}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'mt-6 p-5 rounded-xl text-white shadow-md flex justify-between items-end',
                      marginColor.bg,
                    )}
                  >
                    <div>
                      <p className="text-[10px] font-bold tracking-widest mb-1 opacity-90 uppercase">
                        LUCRO LÍQUIDO ESTIMADO
                      </p>
                      <p className="text-3xl font-black tracking-tight">
                        {formatCurrency(stats.netProfit)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold tracking-widest mb-1 opacity-90 uppercase">
                        MARGEM
                      </p>
                      <p className="text-2xl font-black tracking-tight flex items-center justify-end gap-1">
                        <span className="text-sm">↗</span> {stats.marginPct.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t flex justify-end gap-3 shrink-0">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="font-bold uppercase w-full md:w-auto h-11"
                >
                  CANCELAR
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#D81B84] hover:bg-[#B71770] text-white font-bold uppercase w-full md:w-auto h-11"
                  disabled={isSaving}
                >
                  {isSaving ? 'SALVANDO...' : 'SALVAR PROCEDIMENTO'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
