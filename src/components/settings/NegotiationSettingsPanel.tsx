import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAppStore from '@/stores/main'
import { Handshake, Save, Percent } from 'lucide-react'
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

  useEffect(() => {
    if (appSettings?.negotiation_settings?.discounts) {
      setDiscounts(appSettings.negotiation_settings.discounts)
    }
  }, [appSettings])

  const handleSave = async () => {
    setSaving(true)
    const currentSettings = appSettings?.negotiation_settings || {
      ranges: [],
      defaultEntryPercentage: 30,
    }

    const { success } = await updateAppSettings({
      negotiation_settings: {
        ...currentSettings,
        discounts,
      },
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Handshake className="h-5 w-5 text-primary" /> CONFIGURAÇÕES DO SIMULADOR
        </CardTitle>
        <CardDescription className="mt-1">
          DEFINA OS PERCENTUAIS DE DESCONTO PARA AS DIFERENTES CONDIÇÕES DE PAGAMENTO.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-xs font-black text-muted-foreground">
              DESCONTO À VISTA (NÍVEL 1)
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={discounts.level1}
                onChange={(e) => setDiscounts((p) => ({ ...p, level1: Number(e.target.value) }))}
                className="pr-10 bg-blue-50/50 focus-visible:ring-blue-500 font-bold"
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold">
              Aplicado em pagamento único (0x).
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-black text-muted-foreground">
              CURTO PRAZO (NÍVEL 2)
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={discounts.level2}
                onChange={(e) => setDiscounts((p) => ({ ...p, level2: Number(e.target.value) }))}
                className="pr-10 bg-slate-100 focus-visible:ring-slate-500 font-bold"
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold">
              Aplicado em 1x ou 2x no boleto.
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-black text-muted-foreground">
              MÉDIO PRAZO (NÍVEL 3)
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={discounts.level3}
                onChange={(e) => setDiscounts((p) => ({ ...p, level3: Number(e.target.value) }))}
                className="pr-10 bg-amber-50/50 focus-visible:ring-amber-500 font-bold"
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold">
              Aplicado em 3x ou 4x no boleto.
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-black text-muted-foreground">
              LONGO PRAZO (NÍVEL 4)
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={discounts.level4}
                onChange={(e) => setDiscounts((p) => ({ ...p, level4: Number(e.target.value) }))}
                className="pr-10 bg-white font-bold"
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold">
              Aplicado em 5x ou mais.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={saving} className="font-bold tracking-widest">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
