import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAppStore, { PriceItem } from '@/stores/main'
import { calculateProfitability, getMarginColor } from '@/lib/pricing'
import { formatCurrency, cn } from '@/lib/utils'
import { TrendingUp, Activity, Save, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PricingEditModalProps {
  item: PriceItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PricingEditModal({ item, open, onOpenChange }: PricingEditModalProps) {
  const { appSettings, addPriceItem, updatePriceItem, removePriceItem } = useAppStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<PriceItem>>({})

  useEffect(() => {
    if (open) {
      if (item) {
        setFormData({ ...item })
      } else {
        setFormData({
          work_type: '',
          category: 'GERAL',
          price: 0,
          execution_time: 30,
          material_cost: 0,
          cadista_cost: 0,
          sector: '',
          material: '',
        })
      }
    }
  }, [item, open])

  const stats = calculateProfitability(formData, appSettings)
  const marginColor = getMarginColor(stats.marginPct)

  const handleSave = async () => {
    if (!formData.work_type) return

    let res
    if (item?.id) {
      res = await updatePriceItem(item.id, formData)
    } else {
      res = await addPriceItem(formData as Omit<PriceItem, 'id'>)
    }

    if (res.success) {
      toast({ title: 'SUCESSO', description: 'SERVIÇO SALVO COM SUCESSO.' })
      onOpenChange(false)
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO SALVAR.' })
    }
  }

  const handleDelete = async () => {
    if (item?.id && window.confirm('TEM CERTEZA QUE DESEJA EXCLUIR ESTE SERVIÇO?')) {
      const res = await removePriceItem(item.id)
      if (res.success) {
        toast({ title: 'SUCESSO', description: 'SERVIÇO EXCLUÍDO.' })
        onOpenChange(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl uppercase p-0 overflow-hidden bg-slate-50 gap-0">
        <DialogHeader className="p-6 bg-white border-b">
          <DialogTitle className="flex items-center gap-2 text-xl text-nuvia-navy">
            <Activity className="h-5 w-5 text-primary" />{' '}
            {item ? 'EDITAR PRECIFICAÇÃO' : 'NOVO SERVIÇO'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 h-full max-h-[70vh] overflow-y-auto">
          {/* Left Side - Form */}
          <div className="p-6 space-y-5 bg-white">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground">NOME DO SERVIÇO *</Label>
              <Input
                value={formData.work_type || ''}
                onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                placeholder="EX: LENTE DE CONTATO"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">CATEGORIA *</Label>
                <Input
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="EX: PRÓTESE"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">SETOR</Label>
                <Input
                  value={formData.sector || ''}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-2">
                <Label className="text-xs font-black text-primary">PREÇO DE VENDA (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="font-bold bg-primary/5 border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">
                  TEMPO CLÍNICO (MIN)
                </Label>
                <Input
                  type="number"
                  value={formData.execution_time || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, execution_time: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">CUSTO MATERIAL</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.material_cost || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, material_cost: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">CUSTO CADISTA/LAB</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.cadista_cost || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, cadista_cost: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>

          {/* Right Side - Analysis */}
          <div className="p-6 bg-slate-50 border-l flex flex-col justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-black text-nuvia-navy mb-6 tracking-widest text-sm">
                <TrendingUp className="h-4 w-4" /> ANÁLISE DE RENTABILIDADE
              </h3>

              <div className="space-y-3 text-sm font-semibold">
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-muted-foreground">PREÇO BRUTO</span>
                  <span className="text-slate-800">{formatCurrency(Number(formData.price))}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 text-red-500">
                  <span>(-) TAXAS E IMPOSTOS</span>
                  <span>{formatCurrency(stats.taxesAndFees)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 text-red-500">
                  <div className="flex flex-col">
                    <span>(-) CUSTO FIXO CLÍNICO</span>
                    <span className="text-[9px] font-bold text-muted-foreground">
                      {formData.execution_time || 0} MIN × {formatCurrency(stats.costPerMinute)}
                    </span>
                  </div>
                  <span>{formatCurrency(stats.fixedCost)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 text-red-500">
                  <span>(-) MATERIAIS</span>
                  <span>{formatCurrency(Number(formData.material_cost))}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 text-red-500">
                  <span>(-) LABORATÓRIO / CAD</span>
                  <span>{formatCurrency(Number(formData.cadista_cost))}</span>
                </div>
              </div>

              <div className="mt-8 bg-white p-5 rounded-xl border shadow-sm">
                <p className="text-xs font-black text-muted-foreground mb-1 tracking-widest">
                  LUCRO LÍQUIDO ESTIMADO
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-3xl font-black',
                      stats.netProfit > 0 ? 'text-emerald-600' : 'text-red-600',
                    )}
                  >
                    {formatCurrency(stats.netProfit)}
                  </span>
                  <div
                    className={`px-3 py-1 rounded-lg text-sm font-black tracking-wider border ${marginColor.bg} ${marginColor.text} ${marginColor.border}`}
                  >
                    {stats.marginPct.toFixed(1)}% MARGEM
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-200">
              {item?.id && (
                <Button variant="ghost" className="text-red-600 mr-auto" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" /> EXCLUIR
                </Button>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                CANCELAR
              </Button>
              <Button onClick={handleSave} className="font-bold">
                <Save className="h-4 w-4 mr-2" /> SALVAR
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
