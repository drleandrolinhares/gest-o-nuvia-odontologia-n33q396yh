import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAppStore from '@/stores/main'
import { formatCurrency, cn } from '@/lib/utils'
import { Calculator, Percent, DollarSign, ListOrdered, AlertCircle } from 'lucide-react'

export function NegotiationSimulator() {
  const { appSettings } = useAppStore()

  const settings = appSettings?.negotiation_settings
  const defaultPercentage = settings?.defaultEntryPercentage ?? 30
  const discounts = settings?.discounts || { level1: 15, level2: 5, level3: 3, level4: 0 }

  const [totalValueText, setTotalValueText] = useState<string>('')
  const [entryPercentageText, setEntryPercentageText] = useState<string>(
    defaultPercentage.toString(),
  )

  // FIX: Properly handle BRL format (e.g. 3.500,00 -> 3500.00)
  const totalValue = parseFloat(totalValueText.replace(/\./g, '').replace(',', '.')) || 0
  const entryPercentage = parseFloat(entryPercentageText.replace(/\./g, '').replace(',', '.')) || 0

  const activeRange = useMemo(() => {
    const ranges = settings?.ranges || []
    return (
      ranges.find((r) => totalValue >= r.min && totalValue <= r.max) ||
      (totalValue > (ranges[ranges.length - 1]?.max || 0) ? ranges[ranges.length - 1] : null)
    )
  }, [totalValue, settings])

  const maxInstallments = activeRange?.maxInstallments || 0

  const getDiscountPercentage = useCallback(
    (installment: number) => {
      if (installment === 0) return discounts.level1
      if (installment <= 2) return discounts.level2
      if (installment <= 4) return discounts.level3
      return discounts.level4
    },
    [discounts],
  )

  const results = useMemo(() => {
    if (totalValue < 1000) return []

    const options = []

    // À Vista option (installment = 0)
    const aVistaDiscountPct = getDiscountPercentage(0)
    const aVistaDiscountVal = totalValue * (aVistaDiscountPct / 100)
    const aVistaFinalVal = totalValue - aVistaDiscountVal

    options.push({
      installments: 0,
      label: 'À VISTA',
      discountPct: aVistaDiscountPct,
      discountVal: aVistaDiscountVal,
      finalVal: aVistaFinalVal,
      entryVal: aVistaFinalVal,
      installmentVal: 0,
      level: 1,
    })

    // Installment options
    const actualEntryPct = Math.min(100, Math.max(0, entryPercentage))

    for (let i = 1; i <= maxInstallments; i++) {
      const discountPct = getDiscountPercentage(i)
      const discountVal = totalValue * (discountPct / 100)
      const finalVal = totalValue - discountVal
      const entryVal = finalVal * (actualEntryPct / 100)
      const remaining = finalVal - entryVal
      const installmentVal = remaining / i

      let level = 4
      if (i <= 2) level = 2
      else if (i <= 4) level = 3

      options.push({
        installments: i,
        label: `ENTRADA + ${i}X`,
        discountPct,
        discountVal,
        finalVal,
        entryVal,
        installmentVal,
        level,
      })
    }

    return options
  }, [totalValue, entryPercentage, maxInstallments, getDiscountPercentage])

  const groupedResults = useMemo(() => {
    const groups: Record<number, typeof results> = { 1: [], 2: [], 3: [], 4: [] }
    results.forEach((r) => {
      if (!groups[r.level]) groups[r.level] = []
      groups[r.level].push(r)
    })
    return groups
  }, [results])

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 0) {
      value = (parseInt(value) / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }
    setTotalValueText(value)
  }

  const getCardStyle = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-slate-900 text-white border-slate-800'
      case 2:
        return 'bg-blue-700 text-white border-blue-600'
      case 3:
        return 'bg-slate-600 text-white border-slate-500'
      default:
        return 'bg-slate-50 text-slate-900 border-slate-200'
    }
  }

  const getLevelTitleColor = (level: number) => {
    switch (level) {
      case 1:
        return 'text-slate-900'
      case 2:
        return 'text-blue-700'
      case 3:
        return 'text-slate-600'
      default:
        return 'text-slate-500'
    }
  }

  const getLevelDotColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-slate-900'
      case 2:
        return 'bg-blue-700'
      case 3:
        return 'bg-slate-600'
      default:
        return 'bg-slate-400'
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      <Card className="lg:col-span-4 shadow-md border-primary/20 sticky top-6">
        <CardHeader className="bg-slate-50/50 pb-4 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calculator className="h-5 w-5 text-primary" /> DADOS DA NEGOCIAÇÃO
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-wider mt-1">
            INSIRA OS VALORES PARA GERAR AS CONDIÇÕES
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-black text-muted-foreground uppercase flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> VALOR DO TRATAMENTO
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                R$
              </span>
              <Input
                value={totalValueText}
                onChange={handleCurrencyChange}
                placeholder="0,00"
                className="pl-10 h-12 text-lg font-bold bg-white focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-black text-muted-foreground uppercase flex items-center gap-2">
              <Percent className="h-4 w-4" /> ENTRADA BOLETO (%)
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={entryPercentageText}
                onChange={(e) => setEntryPercentageText(e.target.value)}
                min="0"
                max="100"
                className="pr-10 h-12 text-lg font-bold bg-white focus-visible:ring-primary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                %
              </span>
            </div>
          </div>

          {totalValue > 0 && totalValue < 1000 && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-700 mb-1">VALOR MÍNIMO</p>
                <p className="text-xs font-medium text-red-600">
                  O SIMULADOR REQUER UM VALOR DE TRATAMENTO IGUAL OU SUPERIOR A R$ 1.000,00 PARA
                  EXIBIR AS OPÇÕES.
                </p>
              </div>
            </div>
          )}

          {totalValue >= 1000 && activeRange && (
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex items-start gap-3">
              <ListOrdered className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-primary mb-1">REGRA APLICADA</p>
                <p className="text-sm font-medium text-slate-700">
                  FAIXA DE R$ {activeRange.min.toLocaleString('pt-BR')} A{' '}
                  {activeRange.max > 9000000
                    ? 'ILIMITADO'
                    : `R$ ${activeRange.max.toLocaleString('pt-BR')}`}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  MÁXIMO DE {activeRange.maxInstallments} PARCELAS
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="lg:col-span-8">
        <div className="space-y-8">
          {results.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3 bg-white/50 rounded-xl border border-dashed shadow-sm">
              <Calculator className="h-10 w-10 text-slate-300" />
              <p className="font-bold text-sm uppercase">
                {totalValue > 0
                  ? 'INFORME UM VALOR IGUAL OU ACIMA DE R$ 1.000,00'
                  : 'INFORME O VALOR DO TRATAMENTO PARA SIMULAR'}
              </p>
            </div>
          ) : (
            [1, 2, 3, 4].map((level) => {
              const levelResults = groupedResults[level]
              if (!levelResults || levelResults.length === 0) return null

              let title = ''
              switch (level) {
                case 1:
                  title = `PAGAMENTO À VISTA (${discounts.level1}% DESC)`
                  break
                case 2:
                  title = `CURTO PRAZO (${discounts.level2}% DESC)`
                  break
                case 3:
                  title = `MÉDIO PRAZO (${discounts.level3}% DESC)`
                  break
                case 4:
                  title = `LONGO PRAZO (${discounts.level4}% DESC)`
                  break
              }

              return (
                <div key={level} className="space-y-3 animate-fade-in-up">
                  <h3
                    className={cn(
                      'text-sm font-black tracking-widest uppercase flex items-center gap-2',
                      getLevelTitleColor(level),
                    )}
                  >
                    <div className={cn('w-3 h-3 rounded-full', getLevelDotColor(level))} />
                    {title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {levelResults.map((res) => {
                      const isAVista = res.installments === 0
                      return (
                        <Card
                          key={res.installments}
                          className={cn(
                            'shadow-md transition-all hover:scale-[1.02] border-2',
                            getCardStyle(res.level),
                          )}
                        >
                          <CardContent className="p-5 flex flex-col gap-3">
                            <div className="flex justify-between items-center border-b border-current/20 pb-2">
                              <span className="font-bold text-[10px] uppercase opacity-80 tracking-wider">
                                Forma
                              </span>
                              <span className="font-black text-sm">{res.label}</span>
                            </div>

                            <div className="flex justify-between items-center border-b border-current/10 pb-2">
                              <span className="font-bold text-[10px] uppercase opacity-80 tracking-wider">
                                Desconto ({res.discountPct}%)
                              </span>
                              <span className="font-bold text-sm">
                                {formatCurrency(res.discountVal)}
                              </span>
                            </div>

                            <div className="flex justify-between items-center border-b border-current/10 pb-2">
                              <span className="font-bold text-[10px] uppercase opacity-80 tracking-wider">
                                Valor Final
                              </span>
                              <span className="font-black text-lg">
                                {formatCurrency(res.finalVal)}
                              </span>
                            </div>

                            {!isAVista && (
                              <>
                                <div className="flex justify-between items-center border-b border-current/10 pb-2">
                                  <span className="font-bold text-[10px] uppercase opacity-80 tracking-wider">
                                    Entrada Boleto
                                  </span>
                                  <span className="font-bold text-sm">
                                    {formatCurrency(res.entryVal)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                  <span className="font-bold text-[10px] uppercase opacity-80 tracking-wider">
                                    Parcelas
                                  </span>
                                  <span className="font-black text-xl">
                                    {res.installments}X {formatCurrency(res.installmentVal)}
                                  </span>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
