import { useState, useMemo, useEffect, useCallback } from 'react'
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
  const [entryPercentageText, setEntryPercentageText] = useState<string>('')

  useEffect(() => {
    setEntryPercentageText(defaultPercentage.toString())
  }, [defaultPercentage])

  const totalValue = parseFloat(totalValueText.replace(/\./g, '').replace(',', '.')) || 0
  const entryPercentage = parseFloat(entryPercentageText.replace(/\./g, '').replace(',', '.')) || 0

  const activeRange = useMemo(() => {
    const ranges = settings?.ranges || []
    if (!ranges.length) return null
    return (
      ranges.find((r) => totalValue >= r.min && totalValue <= r.max) ||
      (totalValue > (ranges[ranges.length - 1]?.max || 0) ? ranges[ranges.length - 1] : null)
    )
  }, [totalValue, settings])

  const maxInstallments = activeRange?.maxInstallments || 0

  const getDiscountLevel = useCallback((val: number, inst: number) => {
    if (inst === 0) return 1
    if (val >= 1000 && val <= 2999.99) {
      if (inst === 2) return 1
      if (inst === 3) return 2
      if (inst === 4) return 3
    } else if (val >= 3000 && val <= 4999.99) {
      if (inst >= 2 && inst <= 3) return 1
      if (inst === 4) return 2
      if (inst >= 5 && inst <= 8) return 3
    } else if (val >= 5000 && val <= 7999.99) {
      if (inst >= 2 && inst <= 3) return 1
      if (inst === 4) return 2
      if (inst >= 5 && inst <= 12) return 3
    } else if (val >= 8000 && val <= 11999.99) {
      if (inst >= 2 && inst <= 3) return 1
      if (inst === 4) return 2
      if (inst >= 5 && inst <= 20) return 3
    } else if (val >= 12000) {
      if (inst >= 2 && inst <= 3) return 1
      if (inst === 4) return 2
      if (inst >= 5 && inst <= 24) return 3
    }
    return 4
  }, [])

  const results = useMemo(() => {
    if (totalValue < 1000) return { options: [], entryVal: 0 }

    const options = []
    const aVistaLevel = 1
    const aVistaDiscountPct = discounts.level1
    const aVistaDiscountVal = totalValue * (aVistaDiscountPct / 100)
    const aVistaFinalVal = totalValue - aVistaDiscountVal

    options.push({
      installments: 0,
      label: 'À VISTA',
      discountPct: aVistaDiscountPct,
      discountVal: aVistaDiscountVal,
      finalVal: aVistaFinalVal,
      installmentVal: aVistaFinalVal,
      level: aVistaLevel,
    })

    const actualEntryPct = Math.min(100, Math.max(0, entryPercentage))
    const entryVal = totalValue * (actualEntryPct / 100)

    for (let i = 2; i <= maxInstallments; i++) {
      const level = getDiscountLevel(totalValue, i)
      let discountPct = 0
      if (level === 1) discountPct = discounts.level1
      else if (level === 2) discountPct = discounts.level2
      else if (level === 3) discountPct = discounts.level3
      else if (level === 4) discountPct = discounts.level4

      const discountVal = totalValue * (discountPct / 100)
      const finalVal = totalValue - discountVal
      const remaining = finalVal - entryVal
      const installmentVal = remaining / i

      options.push({
        installments: i,
        label: i.toString(),
        discountPct,
        discountVal,
        finalVal,
        installmentVal,
        level,
      })
    }

    return { options, entryVal }
  }, [totalValue, entryPercentage, maxInstallments, discounts, getDiscountLevel])

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

  const levelColors = {
    1: 'bg-[#3A5693] text-white',
    2: 'bg-[#4B4B4B] text-white',
    3: 'bg-[#767676] text-white',
    4: 'bg-[#B0B0B0] text-black',
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      <Card className="lg:col-span-5 shadow-lg border-primary/10 sticky top-6">
        <CardHeader className="bg-slate-50/50 pb-5 border-b">
          <CardTitle className="flex items-center gap-2 text-xl font-black">
            <Calculator className="h-6 w-6 text-primary" /> DADOS DA NEGOCIAÇÃO
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-wider mt-1">
            INSIRA OS VALORES PARA GERAR AS CONDIÇÕES
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-7">
          <div className="space-y-3">
            <Label className="text-xs font-black text-muted-foreground uppercase flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> VALOR DO TRATAMENTO
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                R$
              </span>
              <Input
                value={totalValueText}
                onChange={handleCurrencyChange}
                placeholder="0,00"
                className="pl-12 h-14 text-2xl font-black bg-slate-50 focus-visible:ring-primary shadow-inner border-slate-200"
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
                className="pr-12 h-14 text-2xl font-black bg-slate-50 focus-visible:ring-primary shadow-inner border-slate-200"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                %
              </span>
            </div>
          </div>

          {totalValue > 0 && totalValue < 1000 && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-red-700 mb-1">VALOR MÍNIMO</p>
                <p className="text-xs font-bold text-red-600">
                  O SIMULADOR REQUER UM VALOR IGUAL OU SUPERIOR A R$ 1.000,00.
                </p>
              </div>
            </div>
          )}

          {totalValue >= 1000 && activeRange && (
            <>
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
                <ListOrdered className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-primary mb-1">REGRA APLICADA</p>
                  <p className="text-sm font-bold text-slate-700">
                    MÁXIMO DE {activeRange.maxInstallments} PARCELAS
                  </p>
                </div>
              </div>

              {/* Discount Summary Mini-Dash */}
              <div className="flex rounded-lg overflow-hidden border border-slate-200 shadow-sm h-[120px] animate-fade-in-up">
                <div className="w-[35%] bg-black flex items-center justify-center p-3">
                  <span className="text-white font-black text-sm uppercase tracking-widest">
                    Descontos
                  </span>
                </div>
                <div className="w-[65%] flex flex-col">
                  <div className="flex-1 bg-[#3A5693] text-white flex items-center justify-center font-black text-sm tracking-widest">
                    {discounts.level1}%
                  </div>
                  <div className="flex-1 bg-[#4B4B4B] text-white flex items-center justify-center font-black text-sm tracking-widest">
                    {discounts.level2}%
                  </div>
                  <div className="flex-1 bg-[#767676] text-white flex items-center justify-center font-black text-sm tracking-widest">
                    {discounts.level3}%
                  </div>
                  <div className="flex-1 bg-[#B0B0B0] text-black flex items-center justify-center font-black text-sm tracking-widest">
                    {discounts.level4}%
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="lg:col-span-7">
        {results.options.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground flex flex-col items-center gap-4 bg-white/50 rounded-2xl border-2 border-dashed shadow-sm">
            <Calculator className="h-12 w-12 text-slate-300" />
            <p className="font-black text-sm uppercase tracking-widest px-6">
              {totalValue > 0
                ? 'INFORME UM VALOR A PARTIR DE R$ 1.000,00'
                : 'INFORME O VALOR DO TRATAMENTO'}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-lg mx-auto font-sans shadow-2xl rounded-sm overflow-hidden border border-slate-300 mb-10 animate-fade-in-up">
            <div className="flex w-full items-stretch">
              <div className="w-[30%] bg-[#F6C85F] text-black font-black text-center flex items-center justify-center p-3 text-lg uppercase tracking-wider border-b border-r border-[#e5ba55]">
                Entre
              </div>
              <div className="w-[70%] bg-[#FAE29F] text-black font-black text-center py-2 text-xl tracking-wide flex flex-col justify-center border-b border-[#e5ba55]">
                <span>
                  R$ {activeRange?.min.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span>
                  {activeRange && activeRange.max > 9000000
                    ? 'Ilimitado'
                    : `R$ ${activeRange?.max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_1.3fr_1fr] bg-[#0A1F54] text-white font-black text-center py-3.5 text-sm tracking-widest border-y-[6px] border-white uppercase">
              <div>Forma</div>
              <div>Parcela</div>
              <div>Desconto</div>
            </div>

            {results.options
              .filter((r) => r.level === 1 && r.installments === 0)
              .map((r) => (
                <div
                  key="avista"
                  className={cn(
                    'grid grid-cols-[1fr_1.3fr_1fr] font-bold text-center py-3 text-base border-b border-white/20',
                    levelColors[1],
                  )}
                >
                  <div className="font-black">A Vista</div>
                  <div>{formatCurrency(r.finalVal)}</div>
                  <div>{formatCurrency(r.discountVal)}</div>
                </div>
              ))}

            <div className="grid grid-cols-[1fr_1.3fr_1fr] bg-black text-white font-bold text-center py-3 text-base border-b border-white/20">
              <div className="font-black text-white/90">Entrada</div>
              <div>{formatCurrency(results.entryVal)}</div>
              <div></div>
            </div>

            {results.options
              .filter((r) => r.installments > 0)
              .map((r) => {
                const colors = levelColors[r.level as keyof typeof levelColors] || levelColors[4]
                return (
                  <div
                    key={r.installments}
                    className={cn(
                      'grid grid-cols-[1fr_1.3fr_1fr] font-bold text-center py-2 text-base transition-colors border-b border-white/10',
                      colors,
                    )}
                  >
                    <div className="font-black">{r.installments}</div>
                    <div>{formatCurrency(r.installmentVal)}</div>
                    <div>{r.discountVal > 0 ? formatCurrency(r.discountVal) : '-'}</div>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
