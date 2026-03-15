import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Save, Percent } from 'lucide-react'
import useAppStore from '@/stores/main'
import { useToast } from '@/hooks/use-toast'

export function FinancialParameters() {
  const { appSettings, updateAppSettings } = useAppStore()
  const { toast } = useToast()

  const [cardFee, setCardFee] = useState(appSettings?.global_card_fee?.toString() || '0')
  const [commission, setCommission] = useState(appSettings?.global_commission?.toString() || '0')
  const [inadimplency, setInadimplency] = useState(
    appSettings?.global_inadimplency?.toString() || '0',
  )
  const [taxes, setTaxes] = useState(appSettings?.global_taxes?.toString() || '0')

  useEffect(() => {
    if (appSettings) {
      setCardFee(appSettings.global_card_fee.toString())
      setCommission(appSettings.global_commission.toString())
      setInadimplency(appSettings.global_inadimplency.toString())
      setTaxes(appSettings.global_taxes.toString())
    }
  }, [appSettings])

  const handleSave = async () => {
    const res = await updateAppSettings({
      global_card_fee: Number(cardFee) || 0,
      global_commission: Number(commission) || 0,
      global_inadimplency: Number(inadimplency) || 0,
      global_taxes: Number(taxes) || 0,
    })

    if (res.success) {
      toast({ title: 'SUCESSO', description: 'PARÂMETROS FINANCEIROS ATUALIZADOS.' })
    } else {
      toast({
        variant: 'destructive',
        title: 'ERRO',
        description: 'FALHA AO SALVAR PARÂMETROS.',
      })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in uppercase">
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Percent className="h-5 w-5 text-primary" /> PARÂMETROS FINANCEIROS GLOBAIS
          </CardTitle>
          <CardDescription className="uppercase font-semibold">
            TAXAS E IMPOSTOS INCIDENTES SOBRE O FATURAMENTO DA CLÍNICA.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">TAXA DE CARTÃO (%)</label>
              <Input
                type="number"
                step="0.1"
                value={cardFee}
                onChange={(e) => setCardFee(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">COMISSÃO (%)</label>
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
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} className="h-12 px-8 text-sm font-bold shadow-md">
              <Save className="h-4 w-4 mr-2" /> SALVAR PARÂMETROS
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
