import { useState, useMemo, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import useAppStore from '@/stores/main'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency, cn } from '@/lib/utils'
import {
  Calculator,
  Percent,
  DollarSign,
  ListOrdered,
  AlertCircle,
  Check,
  Info,
} from 'lucide-react'

export function NegotiationSimulator() {
  const { appSettings } = useAppStore()
  const { user } = useAuth()
  const { toast } = useToast()

  const settings = appSettings?.negotiation_settings
  const defaultPercentage = settings?.defaultEntryPercentage ?? 30
  const discounts = settings?.discounts || { level1: 15, level2: 5, level3: 3, level4: 0 }

  const [totalValueText, setTotalValueText] = useState<string>('')
  const [entryPercentageText, setEntryPercentageText] = useState<string>('')

  // Dialog & Sales State
  const [isAdmin, setIsAdmin] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<any>(null)
  const [dentistaId, setDentistaId] = useState('')
  const [saleType, setSaleType] = useState<'AVALIACAO' | 'COMERCIAL' | null>(null)

  // Tooltip State
  const [tooltipAvaliacao, setTooltipAvaliacao] = useState(
    'Comissão apenas para dentista, aplicável quando a venda é fechada na mesma data da avaliação.',
  )
  const [tooltipComercial, setTooltipComercial] = useState(
    'Comissão para dentista + CRC, aplicável quando a venda é fechada na mesma data da avaliação com intervenção do comercial.',
  )
  const [isEditingTooltip, setIsEditingTooltip] = useState<'avaliacao' | 'comercial' | null>(null)
  const [editTooltipValue, setEditTooltipValue] = useState('')

  const mockDentists = [
    { id: 'd1', name: 'Dr. Leandro Linhares' },
    { id: 'd2', name: 'Dra. Ana Costa' },
    { id: 'd3', name: 'Dr. Carlos Mendes' },
  ]

  useEffect(() => {
    if (user?.id) {
      supabase.rpc('is_admin_user', { user_uuid: user.id }).then(({ data }) => {
        if (data) setIsAdmin(true)
      })
    }
  }, [user])

  useEffect(() => {
    if (settings?.tooltips) {
      if (settings.tooltips.avaliacao) setTooltipAvaliacao(settings.tooltips.avaliacao)
      if (settings.tooltips.comercial) setTooltipComercial(settings.tooltips.comercial)
    }
  }, [settings])

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
      if (inst === 2) return 2
      if (inst === 3) return 3
      if (inst >= 4) return 4
    } else if (val >= 3000 && val <= 4999.99) {
      if (inst >= 2 && inst <= 3) return 2
      if (inst === 4) return 3
      if (inst >= 5) return 4
    } else if (val >= 5000 && val <= 7999.99) {
      if (inst >= 2 && inst <= 4) return 2
      if (inst >= 5 && inst <= 8) return 3
      if (inst >= 9) return 4
    } else if (val >= 8000 && val <= 11999.99) {
      if (inst >= 2 && inst <= 5) return 2
      if (inst >= 6 && inst <= 10) return 3
      if (inst >= 11) return 4
    } else if (val >= 12000) {
      if (inst >= 2 && inst <= 6) return 2
      if (inst >= 7 && inst <= 12) return 3
      if (inst >= 13) return 4
    }
    return 4
  }, [])

  const getInstallmentRangeText = useCallback((level: number, val: number, maxInst: number) => {
    if (val < 1000) return ''
    if (val >= 1000 && val <= 2999.99) {
      if (level === 2) return '(2X)'
      if (level === 3) return '(3X)'
      if (level === 4) return `(4X${maxInst > 4 ? ` - ${maxInst}X` : ''})`
    } else if (val >= 3000 && val <= 4999.99) {
      if (level === 2) return '(2X - 3X)'
      if (level === 3) return '(4X)'
      if (level === 4) return `(5X${maxInst > 5 ? ` - ${maxInst}X` : ''})`
    } else if (val >= 5000 && val <= 7999.99) {
      if (level === 2) return '(2X - 4X)'
      if (level === 3) return '(5X - 8X)'
      if (level === 4) return `(9X${maxInst > 9 ? ` - ${maxInst}X` : ''})`
    } else if (val >= 8000 && val <= 11999.99) {
      if (level === 2) return '(2X - 5X)'
      if (level === 3) return '(6X - 10X)'
      if (level === 4) return `(11X${maxInst > 11 ? ` - ${maxInst}X` : ''})`
    } else if (val >= 12000) {
      if (level === 2) return '(2X - 6X)'
      if (level === 3) return '(7X - 12X)'
      if (level === 4) return `(13X${maxInst > 13 ? ` - ${maxInst}X` : ''})`
    }
    return ''
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

  const handleOpenConfirm = (option: any) => {
    setSelectedOption(option)
    setIsConfirmModalOpen(true)
    setDentistaId('')
    setSaleType(null)
  }

  const handleSaveSale = () => {
    console.log('Venda confirmada (mock):', {
      option: selectedOption,
      dentistaId,
      crcComercialId: user?.id,
      saleType,
      dataVenda: new Date().toISOString(),
    })

    toast({
      title: 'Venda registrada com sucesso!',
      description: `Orçamento salvo como fechado no(a) ${saleType === 'AVALIACAO' ? 'AVALIAÇÃO' : 'COMERCIAL'}.`,
    })
    setIsConfirmModalOpen(false)
  }

  const startEditingTooltip = (type: 'avaliacao' | 'comercial') => {
    setEditTooltipValue(type === 'avaliacao' ? tooltipAvaliacao : tooltipComercial)
    setIsEditingTooltip(type)
  }

  const saveTooltip = async (type: 'avaliacao' | 'comercial') => {
    if (type === 'avaliacao') setTooltipAvaliacao(editTooltipValue)
    else setTooltipComercial(editTooltipValue)

    setIsEditingTooltip(null)

    if (appSettings?.id) {
      const currentSettings = (appSettings.negotiation_settings as any) || {}
      const updatedSettings = {
        ...currentSettings,
        tooltips: {
          ...(currentSettings.tooltips || {}),
          [type]: editTooltipValue,
        },
      }
      await supabase
        .from('app_settings')
        .update({ negotiation_settings: updatedSettings })
        .eq('id', appSettings.id)
    }
  }

  const levelColors = {
    1: 'bg-[#3A5693] text-white',
    2: 'bg-[#4B4B4B] text-white',
    3: 'bg-[#767676] text-white',
    4: 'bg-[#F4F4F5] text-black',
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
            <div className="space-y-4 animate-fade-in-up">
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
              <div className="flex rounded-lg overflow-hidden border border-slate-200 shadow-sm h-[140px]">
                <div className="w-[35%] bg-black flex flex-col items-center justify-center p-3 text-center">
                  <span className="text-white font-black text-sm uppercase tracking-widest">
                    Descontos
                  </span>
                  <span className="text-slate-400 font-bold text-[10px] mt-1 uppercase">
                    Por Faixa
                  </span>
                </div>
                <div className="w-[65%] flex flex-col">
                  <div className="flex-1 bg-[#3A5693] text-white flex items-center justify-between px-4 font-black text-xs tracking-widest border-b border-white/10">
                    <span>À VISTA</span>
                    <span>{discounts.level1}%</span>
                  </div>
                  <div className="flex-1 bg-[#4B4B4B] text-white flex items-center justify-between px-4 font-black text-xs tracking-widest border-b border-white/10">
                    <span className="flex items-center gap-1">
                      FAIXA 2{' '}
                      <span className="text-[10px] font-bold text-white/60">
                        {getInstallmentRangeText(2, totalValue, activeRange.maxInstallments)}
                      </span>
                    </span>
                    <span>{discounts.level2}%</span>
                  </div>
                  <div className="flex-1 bg-[#767676] text-white flex items-center justify-between px-4 font-black text-xs tracking-widest border-b border-white/10">
                    <span className="flex items-center gap-1">
                      FAIXA 3{' '}
                      <span className="text-[10px] font-bold text-white/60">
                        {getInstallmentRangeText(3, totalValue, activeRange.maxInstallments)}
                      </span>
                    </span>
                    <span>{discounts.level3}%</span>
                  </div>
                  <div className="flex-1 bg-[#F4F4F5] text-black flex items-center justify-between px-4 font-black text-xs tracking-widest">
                    <span className="flex items-center gap-1">
                      FAIXA 4{' '}
                      <span className="text-[10px] font-bold text-black/40">
                        {getInstallmentRangeText(4, totalValue, activeRange.maxInstallments)}
                      </span>
                    </span>
                    <span>{discounts.level4}%</span>
                  </div>
                </div>
              </div>
            </div>
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
          <div className="w-full max-w-2xl mx-auto font-sans shadow-2xl rounded-sm overflow-hidden border border-slate-300 mb-10 animate-fade-in-up">
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

            <div className="grid grid-cols-[1fr_1.3fr_1fr_110px] bg-[#0A1F54] text-white font-black text-center py-3.5 text-sm tracking-widest border-y-[6px] border-white uppercase items-center px-4 gap-4">
              <div className="text-left">Forma</div>
              <div>Parcela</div>
              <div>Desconto</div>
              <div>Ação</div>
            </div>

            {results.options
              .filter((r) => r.level === 1 && r.installments === 0)
              .map((r) => (
                <div
                  key="avista"
                  className={cn(
                    'grid grid-cols-[1fr_1.3fr_1fr_110px] font-bold text-center py-3 text-base border-b border-white/20 items-center px-4 gap-4',
                    levelColors[1],
                  )}
                >
                  <div className="font-black text-left">À VISTA</div>
                  <div>{formatCurrency(r.finalVal)}</div>
                  <div>{formatCurrency(r.discountVal)}</div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 bg-white/20 hover:bg-white/30 text-white border-0 w-full"
                    onClick={() => handleOpenConfirm(r)}
                  >
                    <Check className="h-4 w-4 mr-1" /> Registrar
                  </Button>
                </div>
              ))}

            <div className="grid grid-cols-[1fr_1.3fr_1fr_110px] bg-black text-white font-bold text-center py-3 text-base border-b border-white/20 items-center px-4 gap-4">
              <div className="font-black text-white/90 text-left">ENTRADA</div>
              <div>{formatCurrency(results.entryVal)}</div>
              <div>-</div>
              <div></div>
            </div>

            {results.options
              .filter((r) => r.installments > 0)
              .map((r) => {
                const colors = levelColors[r.level as keyof typeof levelColors] || levelColors[4]
                const isLight = r.level === 4
                return (
                  <div
                    key={r.installments}
                    className={cn(
                      'grid grid-cols-[1fr_1.3fr_1fr_110px] font-bold text-center py-2 text-base transition-colors border-b border-black/5 items-center px-4 gap-4',
                      colors,
                    )}
                  >
                    <div className="font-black text-left">{r.installments}x</div>
                    <div>{formatCurrency(r.installmentVal)}</div>
                    <div>{r.discountVal > 0 ? formatCurrency(r.discountVal) : '-'}</div>
                    <Button
                      size="sm"
                      variant={isLight ? 'default' : 'secondary'}
                      className={cn(
                        'h-8 w-full',
                        !isLight && 'bg-white/20 hover:bg-white/30 text-white border-0',
                      )}
                      onClick={() => handleOpenConfirm(r)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Registrar
                    </Button>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="max-w-md border-0 shadow-2xl overflow-hidden p-0">
          <DialogHeader className="bg-slate-50 p-6 border-b">
            <DialogTitle className="text-xl font-black uppercase text-slate-800">
              Confirmar Venda
            </DialogTitle>
            <DialogDescription className="font-bold text-primary mt-1">
              {selectedOption?.label === 'À VISTA'
                ? 'PAGAMENTO À VISTA'
                : `${selectedOption?.installments}X COM ENTRADA`}{' '}
              - VALOR FINAL: {formatCurrency(selectedOption?.finalVal || 0)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <Label className="text-xs font-black text-slate-500 uppercase flex items-center gap-1">
                Dentista Avaliador
              </Label>
              <Select value={dentistaId} onValueChange={setDentistaId}>
                <SelectTrigger className="h-12 font-bold bg-white border-slate-200">
                  <SelectValue placeholder="Selecione o dentista..." />
                </SelectTrigger>
                <SelectContent>
                  {mockDentists.map((d) => (
                    <SelectItem key={d.id} value={d.id} className="font-bold cursor-pointer">
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black text-slate-500 uppercase flex items-center gap-1">
                CRC Comercial
              </Label>
              <Input
                value={user?.user_metadata?.name || user?.email || 'Usuário Logado'}
                disabled
                className="h-12 font-bold bg-slate-50 text-slate-500 border-slate-200 opacity-80"
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <Label className="text-xs font-black text-slate-500 uppercase">
                Origem do Fechamento
              </Label>
              <div className="grid grid-cols-1 gap-3">
                {/* Option 1 */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={saleType === 'AVALIACAO' ? 'default' : 'outline'}
                    className={cn(
                      'flex-1 justify-start h-12 font-bold transition-all border-slate-200',
                      saleType === 'AVALIACAO' &&
                        'bg-[#0A1F54] text-white border-[#0A1F54] shadow-md hover:bg-[#0A1F54]/90',
                    )}
                    onClick={() => setSaleType('AVALIACAO')}
                  >
                    <div className="flex items-center w-full">
                      <span className="flex-1 text-left">VENDA FECHADA NA AVALIAÇÃO</span>
                      {saleType === 'AVALIACAO' && <Check className="h-4 w-4 shrink-0" />}
                    </div>
                  </Button>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 shrink-0 border-slate-200 hover:bg-slate-50"
                        >
                          <Info className="h-5 w-5 text-slate-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        className="w-80 p-4 bg-slate-800 text-white border-slate-700 shadow-xl"
                        side="left"
                        sideOffset={10}
                      >
                        {isAdmin && isEditingTooltip === 'avaliacao' ? (
                          <div className="space-y-3 animate-fade-in">
                            <p className="text-xs font-bold text-slate-300 uppercase">
                              Editando Explicação
                            </p>
                            <textarea
                              className="w-full min-h-[80px] p-2 text-sm bg-slate-900 text-white border border-slate-600 rounded-md outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                              value={editTooltipValue}
                              onChange={(e) => setEditTooltipValue(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-300 hover:text-white hover:bg-slate-700"
                                onClick={() => setIsEditingTooltip(null)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                size="sm"
                                className="bg-primary text-white"
                                onClick={() => saveTooltip('avaliacao')}
                              >
                                Salvar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <p className="text-sm font-medium leading-relaxed text-slate-200">
                                {tooltipAvaliacao}
                              </p>
                            </div>
                            {isAdmin && (
                              <div className="flex justify-end pt-2 mt-2 border-t border-slate-700/50">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs text-slate-400 hover:text-white hover:bg-slate-700"
                                  onClick={() => startEditingTooltip('avaliacao')}
                                >
                                  Editar Texto
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Option 2 */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={saleType === 'COMERCIAL' ? 'default' : 'outline'}
                    className={cn(
                      'flex-1 justify-start h-12 font-bold transition-all border-slate-200',
                      saleType === 'COMERCIAL' &&
                        'bg-[#0A1F54] text-white border-[#0A1F54] shadow-md hover:bg-[#0A1F54]/90',
                    )}
                    onClick={() => setSaleType('COMERCIAL')}
                  >
                    <div className="flex items-center w-full">
                      <span className="flex-1 text-left">VENDA FECHADA NO COMERCIAL</span>
                      {saleType === 'COMERCIAL' && <Check className="h-4 w-4 shrink-0" />}
                    </div>
                  </Button>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 shrink-0 border-slate-200 hover:bg-slate-50"
                        >
                          <Info className="h-5 w-5 text-slate-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        className="w-80 p-4 bg-slate-800 text-white border-slate-700 shadow-xl"
                        side="left"
                        sideOffset={10}
                      >
                        {isAdmin && isEditingTooltip === 'comercial' ? (
                          <div className="space-y-3 animate-fade-in">
                            <p className="text-xs font-bold text-slate-300 uppercase">
                              Editando Explicação
                            </p>
                            <textarea
                              className="w-full min-h-[80px] p-2 text-sm bg-slate-900 text-white border border-slate-600 rounded-md outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                              value={editTooltipValue}
                              onChange={(e) => setEditTooltipValue(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-300 hover:text-white hover:bg-slate-700"
                                onClick={() => setIsEditingTooltip(null)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                size="sm"
                                className="bg-primary text-white"
                                onClick={() => saveTooltip('comercial')}
                              >
                                Salvar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <p className="text-sm font-medium leading-relaxed text-slate-200">
                                {tooltipComercial}
                              </p>
                            </div>
                            {isAdmin && (
                              <div className="flex justify-end pt-2 mt-2 border-t border-slate-700/50">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs text-slate-400 hover:text-white hover:bg-slate-700"
                                  onClick={() => startEditingTooltip('comercial')}
                                >
                                  Editar Texto
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-0 sm:justify-between items-center border-t border-slate-100 bg-slate-50/50">
            <Button
              variant="ghost"
              onClick={() => setIsConfirmModalOpen(false)}
              className="text-slate-500 font-bold"
            >
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white font-bold h-11 px-6"
              onClick={handleSaveSale}
              disabled={!dentistaId || !saleType}
            >
              <Check className="h-4 w-4 mr-2" />
              Registrar Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
