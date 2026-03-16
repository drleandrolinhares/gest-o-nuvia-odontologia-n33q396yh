import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAppStore, { NegotiationSettings } from '@/stores/main'
import { Handshake, Save, Percent, Plus, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export function NegotiationSettingsPanel() {
  const { appSettings, updateAppSettings } = useAppStore()
  const [saving, setSaving] = useState(false)

  const [discounts, setDiscounts] = useState({
    level1: 15,
    level2: 5,
    level3: 3,
    level4: 0,
  })

  const [defaultEntry, setDefaultEntry] = useState(30)

  const [ranges, setRanges] = useState<{ min: number; max: number; maxInstallments: number }[]>([])

  useEffect(() => {
    if (appSettings?.negotiation_settings) {
      const s = appSettings.negotiation_settings
      if (s.discounts) setDiscounts(s.discounts)
      if (s.defaultEntryPercentage !== undefined) setDefaultEntry(s.defaultEntryPercentage)
      if (s.ranges) setRanges(s.ranges)
    }
  }, [appSettings])

  const handleAddRange = () => {
    const lastMax = ranges.length > 0 ? ranges[ranges.length - 1].max + 0.01 : 1000
    setRanges([...ranges, { min: lastMax, max: lastMax + 1999.99, maxInstallments: 12 }])
  }

  const handleRemoveRange = (index: number) => {
    setRanges(ranges.filter((_, i) => i !== index))
  }

  const handleRangeChange = (index: number, field: string, value: number) => {
    const newRanges = [...ranges]
    newRanges[index] = { ...newRanges[index], [field]: value }
    setRanges(newRanges)
  }

  const handleSave = async () => {
    setSaving(true)

    const newSettings: NegotiationSettings = {
      ranges: [...ranges].sort((a, b) => a.min - b.min),
      defaultEntryPercentage: defaultEntry,
      discounts,
    }

    const { success } = await updateAppSettings({
      negotiation_settings: newSettings,
    })

    setSaving(false)
    if (success) {
      toast({ title: 'Configurações salvas com sucesso!' })
    } else {
      toast({ title: 'Erro ao salvar', variant: 'destructive' })
    }
  }

  return (
    <Card className="uppercase animate-fade-in-up border-primary/20">
      <CardHeader className="bg-slate-50/50 border-b pb-6">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Handshake className="h-6 w-6 text-primary" /> CONFIGURAÇÕES DO SIMULADOR
        </CardTitle>
        <CardDescription className="mt-1 font-bold">
          DEFINA OS PERCENTUAIS DE DESCONTO, FAIXAS DE VALORES E REGRAS DE PARCELAMENTO.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10 pt-8">
        {/* Discounts */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-nuvia-navy tracking-widest border-l-4 border-primary pl-3">
            DESCONTOS POR PRAZO
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 p-5 rounded-xl border">
            <div className="space-y-2">
              <Label className="text-xs font-black text-muted-foreground">À VISTA (NÍVEL 1)</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={discounts.level1}
                  onChange={(e) => setDiscounts((p) => ({ ...p, level1: Number(e.target.value) }))}
                  className="pr-10 font-bold bg-white"
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">
                Pagamento único (0x).
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black text-muted-foreground">
                CURTO PRAZO (NÍVEL 2)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={discounts.level2}
                  onChange={(e) => setDiscounts((p) => ({ ...p, level2: Number(e.target.value) }))}
                  className="pr-10 font-bold bg-white"
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">Até 3x no boleto.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black text-muted-foreground">
                MÉDIO PRAZO (NÍVEL 3)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={discounts.level3}
                  onChange={(e) => setDiscounts((p) => ({ ...p, level3: Number(e.target.value) }))}
                  className="pr-10 font-bold bg-white"
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">
                Apenas em 4x no boleto.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black text-muted-foreground">
                LONGO PRAZO (NÍVEL 4)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={discounts.level4}
                  onChange={(e) => setDiscounts((p) => ({ ...p, level4: Number(e.target.value) }))}
                  className="pr-10 font-bold bg-white"
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">5x ou mais.</p>
            </div>
          </div>
        </div>

        {/* Entry */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-nuvia-navy tracking-widest border-l-4 border-primary pl-3">
            ENTRADA PADRÃO
          </h3>
          <div className="max-w-xs space-y-3">
            <Label className="text-xs font-black text-muted-foreground">
              PERCENTUAL DE ENTRADA (%)
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={defaultEntry}
                onChange={(e) => setDefaultEntry(Number(e.target.value))}
                className="pr-10 font-black text-lg h-12"
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Ranges */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h3 className="text-sm font-black text-nuvia-navy tracking-widest border-l-4 border-primary pl-3">
              FAIXAS DE VALORES E MÁXIMO DE PARCELAS
            </h3>
            <Button variant="outline" size="sm" onClick={handleAddRange} className="font-bold">
              <Plus className="h-4 w-4 mr-2" /> NOVA FAIXA
            </Button>
          </div>
          <div className="space-y-3">
            {ranges.map((r, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-4 items-end p-4 border rounded-xl bg-slate-50 shadow-sm transition-all hover:border-primary/40"
              >
                <div className="space-y-2 w-full sm:w-1/3">
                  <Label className="text-[10px] font-black tracking-widest text-muted-foreground">
                    VALOR MÍNIMO (R$)
                  </Label>
                  <Input
                    type="number"
                    value={r.min}
                    onChange={(e) => handleRangeChange(i, 'min', Number(e.target.value))}
                    className="font-bold bg-white"
                  />
                </div>
                <div className="space-y-2 w-full sm:w-1/3">
                  <Label className="text-[10px] font-black tracking-widest text-muted-foreground">
                    VALOR MÁXIMO (R$)
                  </Label>
                  <Input
                    type="number"
                    value={r.max}
                    onChange={(e) => handleRangeChange(i, 'max', Number(e.target.value))}
                    className="font-bold bg-white"
                  />
                </div>
                <div className="space-y-2 w-full sm:w-1/3">
                  <Label className="text-[10px] font-black tracking-widest text-primary">
                    MÁX. PARCELAS
                  </Label>
                  <Input
                    type="number"
                    value={r.maxInstallments}
                    onChange={(e) =>
                      handleRangeChange(i, 'maxInstallments', Number(e.target.value))
                    }
                    className="font-black text-primary border-primary/30 bg-white"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRange(i)}
                  className="text-destructive hover:bg-destructive/10 shrink-0 mb-1 h-10 w-10"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
            {ranges.length === 0 && (
              <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl font-bold">
                NENHUMA FAIXA CONFIGURADA.
              </div>
            )}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-8 border-t mt-8">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="font-black tracking-widest text-xs px-8"
          >
            <Save className="h-5 w-5 mr-3" />
            {saving ? 'SALVANDO...' : 'SALVAR TODAS AS ALTERAÇÕES'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
