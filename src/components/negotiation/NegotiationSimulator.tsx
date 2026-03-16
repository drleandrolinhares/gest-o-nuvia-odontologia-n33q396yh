import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

  const totalValue = parseFloat(totalValueText.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
  const entryPercentage =
    parseFloat(entryPercentageText.replace(/[^\d.,]/g, '').replace(',', '.')) || 0

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

  const getRowStyle = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-blue-100 hover:bg-blue-100/80 font-bold border-b-blue-200'
      case 2:
        return 'bg-slate-700 hover:bg-slate-800 text-white border-b-slate-600'
      case 3:
        return 'bg-amber-100 hover:bg-amber-200/80 font-semibold border-b-amber-200 text-amber-950'
      default:
        return 'bg-white hover:bg-slate-50'
    }
  }

  const getBadgeStyle = (level: number, pct: number) => {
    if (pct === 0) return 'bg-slate-100 text-slate-500'
    switch (level) {
      case 1:
        return 'bg-blue-200 text-blue-900'
      case 2:
        return 'bg-slate-600 text-white'
      case 3:
        return 'bg-amber-200 text-amber-900'
      default:
        return 'bg-emerald-100 text-emerald-800'
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      <Card className="lg:col-span-4 shadow-md border-primary/20">
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

      <Card className="lg:col-span-8 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-lg">OPÇÕES DE PAGAMENTO</CardTitle>
          {results.length > 0 && (
            <span className="text-xs font-bold text-muted-foreground tracking-widest bg-slate-100 px-3 py-1 rounded-full">
              BASE: {formatCurrency(totalValue)}
            </span>
          )}
        </CardHeader>
        <div className="overflow-x-auto">
          {results.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3">
              <Calculator className="h-10 w-10 text-slate-300" />
              <p className="font-bold text-sm">
                {totalValue > 0
                  ? 'INFORME UM VALOR ACIMA DE R$ 1.000,00'
                  : 'INFORME O VALOR DO TRATAMENTO PARA SIMULAR'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-black text-slate-700 w-[160px]">FORMA</TableHead>
                  <TableHead className="font-black text-slate-700 text-center w-[100px]">
                    DESC. %
                  </TableHead>
                  <TableHead className="font-black text-slate-700 text-right">DESCONTO</TableHead>
                  <TableHead className="font-black text-slate-700 text-right">
                    VALOR FINAL
                  </TableHead>
                  <TableHead className="font-black text-slate-700 text-right">ENTRADA</TableHead>
                  <TableHead className="font-black text-slate-700 text-right">PARCELA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((res) => {
                  const isAVista = res.installments === 0

                  return (
                    <TableRow
                      key={res.installments}
                      className={cn('transition-colors', getRowStyle(res.level))}
                    >
                      <TableCell className="font-black whitespace-nowrap">{res.label}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            'inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-black',
                            getBadgeStyle(res.level, res.discountPct),
                          )}
                        >
                          {res.discountPct}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(res.discountVal)}
                      </TableCell>
                      <TableCell
                        className={cn('text-right font-black', res.level === 4 && 'text-primary')}
                      >
                        {formatCurrency(res.finalVal)}
                      </TableCell>
                      <TableCell className="text-right font-bold opacity-90">
                        {isAVista ? '-' : formatCurrency(res.entryVal)}
                      </TableCell>
                      <TableCell className="text-right font-black">
                        {isAVista
                          ? '-'
                          : `${res.installments}X ${formatCurrency(res.installmentVal)}`}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  )
}
