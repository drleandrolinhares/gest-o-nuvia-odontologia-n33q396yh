import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useAppStore from '@/stores/main'
import { Save, Settings2, Percent } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function GlobalSettingsTab() {
  const { appSettings, updateAppSettings } = useAppStore()
  const { toast } = useToast()

  const [cardFee, setCardFee] = useState('')
  const [commission, setCommission] = useState('')
  const [inadimplency, setInadimplency] = useState('')
  const [taxes, setTaxes] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (appSettings) {
      setCardFee(appSettings.global_card_fee.toString())
      setCommission(appSettings.global_commission.toString())
      setInadimplency(appSettings.global_inadimplency.toString())
      setTaxes(appSettings.global_taxes.toString())
    }
  }, [appSettings])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const res = await updateAppSettings({
      global_card_fee: Number(cardFee) || 0,
      global_commission: Number(commission) || 0,
      global_inadimplency: Number(inadimplency) || 0,
      global_taxes: Number(taxes) || 0,
    })
    setIsSaving(false)

    if (res.success) {
      toast({ title: 'SUCESSO', description: 'CONFIGURAÇÕES SALVAS COM SUCESSO.' })
    } else {
      toast({
        variant: 'destructive',
        title: 'ERRO',
        description: 'FALHA AO SALVAR CONFIGURAÇÕES.',
      })
    }
  }

  return (
    <Card className="max-w-2xl border-primary/20 shadow-md">
      <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
        <CardTitle className="text-primary flex items-center gap-2">
          <Settings2 className="h-5 w-5" /> PARÂMETROS GLOBAIS (%)
        </CardTitle>
        <CardDescription className="text-xs font-semibold uppercase">
          ESTAS TAXAS SÃO APLICADAS GLOBALMENTE SOBRE O PREÇO DE VENDA PARA CALCULAR O LUCRO
          LÍQUIDO.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Percent className="h-3 w-3" /> TAXA DE CARTÃO
              </label>
              <Input
                type="number"
                step="0.01"
                value={cardFee}
                onChange={(e) => setCardFee(e.target.value)}
                placeholder="Ex: 3.5"
                className="font-bold bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Percent className="h-3 w-3" /> COMISSÃO (MÉDIA)
              </label>
              <Input
                type="number"
                step="0.01"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                placeholder="Ex: 10"
                className="font-bold bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Percent className="h-3 w-3" /> INADIMPLÊNCIA / PERDAS
              </label>
              <Input
                type="number"
                step="0.01"
                value={inadimplency}
                onChange={(e) => setInadimplency(e.target.value)}
                placeholder="Ex: 2"
                className="font-bold bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Percent className="h-3 w-3" /> IMPOSTOS
              </label>
              <Input
                type="number"
                step="0.01"
                value={taxes}
                onChange={(e) => setTaxes(e.target.value)}
                placeholder="Ex: 6.5"
                className="font-bold bg-slate-50"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button type="submit" disabled={isSaving} className="font-bold uppercase tracking-wide">
              {isSaving ? 'SALVANDO...' : 'SALVAR CONFIGURAÇÕES'}
              {!isSaving && <Save className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
