import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@/stores/main'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Switch } from '@/components/ui/switch'
import { formatCurrency, cn } from '@/lib/utils'
import {
  CalendarIcon,
  Calculator,
  PackageSearch,
  Barcode as BarcodeIcon,
  Tag,
  Zap,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { QuickProductSearchModal } from '@/components/inventory/QuickProductSearchModal'

const IMPLANT_DIAMETERS = ['3.3', '3.5', '3.75', '4.0', '4.3', '4.5', '5.0', '6.0']
const IMPLANT_HEIGHTS = ['4', '5', '5.5', '6', '7', '8', '8.5', '9', '10', '11.5', '13', '15']

const parseCurrency = (val: string | number) => {
  if (typeof val === 'number') return val
  return Number(val.replace(/\D/g, '')) / 100
}

const formatCurrencyInput = (val: string | number) => {
  const num = parseCurrency(val)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}

const schema = z.object({
  name: z.string().min(1, 'Obrigatório'),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  specialty: z.string().optional(),
  packageCost: z.union([z.string(), z.number()]).transform(parseCurrency),
  packageType: z.string().min(1, 'Obrigatório'),
  itemsPerBox: z.coerce.number().min(1),
  quantity: z.coerce.number().min(0),
  entryDate: z.date().optional(),
  expirationDate: z.date().optional(),
  storageRoom: z.string().optional(),
  cabinetNumber: z.string().optional(),
  nfeNumber: z.string().optional(),
  minStock: z.coerce.number().min(0),
  lastBrand: z.string().optional(),
  lastValue: z.union([z.string(), z.number()]).optional().transform(parseCurrency),
  notes: z.string().optional(),

  implantBrand: z.string().optional(),
  implantDiameter: z.string().optional(),
  implantHeight: z.string().optional(),
  isProstheticComponent: z.boolean().optional(),
  prostheticType: z.string().optional(),
  prostheticAngle: z.string().optional(),
  prostheticCollarHeight: z.string().optional(),
  prostheticDiameter: z.string().optional(),
  prostheticHeight: z.string().optional(),
})

export function AddInventoryModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
}) {
  const { addInventoryItem, packageTypes, specialties, inventoryOptions } = useAppStore()
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  const storageRooms = inventoryOptions.filter((o) => o.category === 'SALA_ARMAZENAMENTO')
  const implantBrands = inventoryOptions.filter((o) => o.category === 'MARCA_IMPLANTE')
  const componentTypes = inventoryOptions.filter((o) => o.category === 'TIPO_COMPONENTE')

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      barcode: '',
      brand: '',
      specialty: '',
      packageCost: 0,
      packageType: 'CAIXA',
      itemsPerBox: 1,
      quantity: 0,
      storageRoom: '',
      cabinetNumber: '',
      nfeNumber: '',
      minStock: 0,
      lastBrand: '',
      lastValue: 0,
      notes: '',
      implantBrand: '',
      implantDiameter: '',
      implantHeight: '',
      isProstheticComponent: false,
      prostheticType: '',
      prostheticAngle: '',
      prostheticCollarHeight: '',
      prostheticDiameter: '',
      prostheticHeight: '',
    },
  })

  const pCostRaw = form.watch('packageCost')
  const pCost = parseCurrency(pCostRaw || 0)
  const qty = form.watch('quantity') || 0
  const totalCost = qty * pCost

  const currentSpecialty = form.watch('specialty')
  const isProstheticComponent = form.watch('isProstheticComponent')
  const prostheticType = form.watch('prostheticType')

  useEffect(() => {
    if (currentSpecialty !== 'IMPLANTODONTIA') {
      form.setValue('implantBrand', '')
      form.setValue('implantDiameter', '')
      form.setValue('implantHeight', '')
    }
    if (currentSpecialty !== 'PRÓTESE') {
      form.setValue('isProstheticComponent', false)
      form.setValue('prostheticType', '')
      form.setValue('prostheticAngle', '')
      form.setValue('prostheticCollarHeight', '')
      form.setValue('prostheticDiameter', '')
      form.setValue('prostheticHeight', '')
    }
  }, [currentSpecialty, form])

  const onSubmit = (v: z.infer<typeof schema>) => {
    const specialtyDetails: any = {}

    if (v.specialty === 'IMPLANTODONTIA') {
      if (v.implantBrand) specialtyDetails.implantBrand = v.implantBrand
      if (v.implantDiameter) specialtyDetails.implantDiameter = v.implantDiameter
      if (v.implantHeight) specialtyDetails.implantHeight = v.implantHeight
    }

    if (v.specialty === 'PRÓTESE' && v.isProstheticComponent) {
      specialtyDetails.isProstheticComponent = true
      specialtyDetails.prostheticType = v.prostheticType
      if (v.prostheticType === 'MINI PILAR RETO') {
        specialtyDetails.prostheticCollarHeight = v.prostheticCollarHeight
      } else if (v.prostheticType === 'MINI PILAR ANGULADO') {
        specialtyDetails.prostheticAngle = v.prostheticAngle
        specialtyDetails.prostheticCollarHeight = v.prostheticCollarHeight
      } else if (v.prostheticType === 'MUNHÃO UNIVERSAL') {
        specialtyDetails.prostheticDiameter = v.prostheticDiameter
        specialtyDetails.prostheticHeight = v.prostheticHeight
      }
    }

    addInventoryItem({
      name: v.name,
      barcode: v.barcode,
      brand: v.brand || '',
      specialty: v.specialty,
      packageCost: v.packageCost,
      packageType: v.packageType,
      itemsPerBox: v.itemsPerBox,
      quantity: v.quantity,
      storageLocation: `${v.storageRoom || ''} - ${v.cabinetNumber || ''}`,
      storageRoom: v.storageRoom || '',
      cabinetNumber: v.cabinetNumber || '',
      nfeNumber: v.nfeNumber || '',
      minStock: v.minStock,
      entryDate: v.entryDate ? v.entryDate.toISOString() : undefined,
      expirationDate: v.expirationDate ? v.expirationDate.toISOString() : undefined,
      lastBrand: v.lastBrand || '',
      lastValue: v.lastValue || 0,
      notes: v.notes || '',
      specialtyDetails,
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          onOpenChange(val)
          if (!val) form.reset()
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto uppercase">
          <DialogHeader className="flex flex-row items-center justify-between pr-8">
            <DialogTitle className="text-2xl font-bold text-nuvia-navy uppercase">
              NOVO PRODUTO NO ESTOQUE
            </DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-[#D81B84] hover:bg-[#D81B84]/10 -mt-2"
              onClick={(e) => {
                e.preventDefault()
                setIsQuickViewOpen(true)
              }}
              title="CONSULTA RÁPIDA DE PRODUTOS"
            >
              <PackageSearch className="h-5 w-5" />
            </Button>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
              <div className="bg-blue-50/80 p-5 rounded-xl border-2 border-blue-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-end relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none text-blue-600">
                  <BarcodeIcon className="w-40 h-40" />
                </div>
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full relative z-10">
                      <FormLabel className="text-blue-900 font-extrabold flex items-center gap-2 uppercase tracking-widest">
                        <BarcodeIcon className="w-4 h-4" /> CÓDIGO DE BARRAS
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="BIPAR OU DIGITAR CÓDIGO..."
                          className="bg-white border-blue-200 shadow-sm h-12 text-lg font-mono tracking-widest uppercase"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>NOME DO MATERIAL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="EX: MINI PILAR"
                          className="border-[#D81B84] focus-visible:ring-[#D81B84] uppercase"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MARCA DO PRODUTO</FormLabel>
                      <FormControl>
                        <Input placeholder="EX: 3M, FGM..." className="uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ESPECIALIDADE</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="uppercase">
                            <SelectValue placeholder="SELECIONE" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specialties.map((spec) => (
                            <SelectItem key={spec} value={spec} className="uppercase">
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {currentSpecialty === 'IMPLANTODONTIA' && (
                <div className="p-5 bg-blue-50/80 rounded-xl border border-blue-200 shadow-sm animate-fade-in space-y-4">
                  <h4 className="font-extrabold text-blue-900 flex items-center gap-2 text-sm uppercase">
                    <Tag className="w-4 h-4" /> DETALHES TÉCNICOS DE IMPLANTODONTIA
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="implantBrand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-800">MARCA DO IMPLANTE</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="uppercase bg-white border-blue-200 focus:ring-blue-400">
                                <SelectValue placeholder="SELECIONE" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {implantBrands.map((opt) => (
                                <SelectItem key={opt.id} value={opt.value} className="uppercase">
                                  {opt.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="implantDiameter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-800">DIÂMETRO DO IMPLANTE</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="uppercase bg-white border-blue-200 focus:ring-blue-400">
                                <SelectValue placeholder="SELECIONE" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {IMPLANT_DIAMETERS.map((d) => (
                                <SelectItem key={d} value={d} className="uppercase">
                                  {d} MM
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="implantHeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-800">ALTURA DO IMPLANTE</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="uppercase bg-white border-blue-200 focus:ring-blue-400">
                                <SelectValue placeholder="SELECIONE" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {IMPLANT_HEIGHTS.map((h) => (
                                <SelectItem key={h} value={h} className="uppercase">
                                  {h} MM
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {currentSpecialty === 'PRÓTESE' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
                    <h4 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm uppercase">
                      <Zap className="w-4 h-4 text-amber-500" /> COMPONENTE PROTÉTICO
                    </h4>
                    <FormField
                      control={form.control}
                      name="isProstheticComponent"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {isProstheticComponent && (
                    <div className="p-5 bg-blue-50/80 rounded-xl border border-blue-200 shadow-sm animate-fade-in-up space-y-4">
                      <h4 className="font-extrabold text-blue-900 flex items-center gap-2 text-sm uppercase">
                        <Tag className="w-4 h-4" /> ESPECIFICAÇÕES DO COMPONENTE
                      </h4>
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="prostheticType"
                          render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                              <FormLabel className="text-blue-800">TIPO DE COMPONENTE</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="uppercase bg-white border-blue-200 focus:ring-blue-400">
                                    <SelectValue placeholder="SELECIONE O TIPO" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {componentTypes.map((opt) => (
                                    <SelectItem key={opt.id} value={opt.value}>
                                      {opt.value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {prostheticType === 'MINI PILAR RETO' && (
                          <FormField
                            control={form.control}
                            name="prostheticCollarHeight"
                            render={({ field }) => (
                              <FormItem className="w-full md:w-1/3 animate-fade-in">
                                <FormLabel className="text-blue-800">ALTURA DA CINTA</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="uppercase bg-white border-blue-200">
                                      <SelectValue placeholder="SELECIONE" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {[
                                      '0,8 MM',
                                      '1,5 MM',
                                      '2,5 MM',
                                      '3,5 MM',
                                      '4,5 MM',
                                      '5,0 MM',
                                    ].map((opt) => (
                                      <SelectItem key={opt} value={opt}>
                                        {opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {prostheticType === 'MINI PILAR ANGULADO' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                            <FormField
                              control={form.control}
                              name="prostheticAngle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-blue-800">ÂNGULO</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="uppercase bg-white border-blue-200 focus:ring-blue-400">
                                        <SelectValue placeholder="SELECIONE" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="17 GRAUS">17 GRAUS</SelectItem>
                                      <SelectItem value="30 GRAUS">30 GRAUS</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {form.watch('prostheticAngle') && (
                              <FormField
                                control={form.control}
                                name="prostheticCollarHeight"
                                render={({ field }) => (
                                  <FormItem className="animate-fade-in">
                                    <FormLabel className="text-blue-800">ALTURA DA CINTA</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="uppercase bg-white border-blue-200">
                                          <SelectValue placeholder="SELECIONE" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {['1,5 MM', '2,5 MM', '3,5 MM'].map((opt) => (
                                          <SelectItem key={opt} value={opt}>
                                            {opt}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        )}

                        {prostheticType === 'MUNHÃO UNIVERSAL' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                            <FormField
                              control={form.control}
                              name="prostheticDiameter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-blue-800">DIÂMETRO</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="uppercase bg-white border-blue-200 focus:ring-blue-400">
                                        <SelectValue placeholder="SELECIONE" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="3,3 MM">3,3 MM</SelectItem>
                                      <SelectItem value="4,5 MM">4,5 MM</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {form.watch('prostheticDiameter') && (
                              <FormField
                                control={form.control}
                                name="prostheticHeight"
                                render={({ field }) => (
                                  <FormItem className="animate-fade-in">
                                    <FormLabel className="text-blue-800">ALTURA</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="uppercase bg-white border-blue-200">
                                          <SelectValue placeholder="SELECIONE" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {['4 MM', '6 MM'].map((opt) => (
                                          <SelectItem key={opt} value={opt}>
                                            {opt}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 grid gap-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                  <Calculator className="w-32 h-32" />
                </div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 relative z-10 uppercase">
                  INFORMAÇÕES DE COMPRA E EMBALAGEM
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QTD. COMPRADA</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="bg-white uppercase"
                            placeholder="EX: 10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="itemsPerBox"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ITENS NA EMBALAGEM</FormLabel>
                        <FormControl>
                          <Input type="number" className="bg-white uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="packageCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VALOR EMB. FECHADA</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            className="bg-white"
                            placeholder="R$ 0,00"
                            value={formatCurrencyInput(field.value)}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="packageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TIPO EMBALAGEM</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white uppercase">
                              <SelectValue placeholder="SELECIONE" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {packageTypes.map((pt) => (
                              <SelectItem key={pt} value={pt} className="uppercase">
                                {pt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center relative z-10">
                  <span className="text-sm font-semibold text-slate-600 uppercase">
                    VALOR TOTAL DA COMPRA
                  </span>
                  <div className="text-2xl font-black text-slate-800">
                    {formatCurrency(totalCost)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                <FormField
                  control={form.control}
                  name="entryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>DATA DE ENTRADA</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal uppercase',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: ptBR })
                              ) : (
                                <span>SELECIONE A DATA</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 uppercase" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>DATA DE VALIDADE</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal uppercase',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: ptBR })
                              ) : (
                                <span>SELECIONE A DATA</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 uppercase" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nfeNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NÚMERO DA NFE</FormLabel>
                      <FormControl>
                        <Input placeholder="EX: 123456" className="uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                <FormField
                  control={form.control}
                  name="storageRoom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SALA DE ARMAZENAMENTO</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="uppercase">
                            <SelectValue placeholder="SELECIONE" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {storageRooms.map((opt) => (
                            <SelectItem key={opt.id} value={opt.value} className="uppercase">
                              {opt.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cabinetNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NÚMERO DO ARMÁRIO</FormLabel>
                      <FormControl>
                        <Input placeholder="EX: A1" className="uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ESTOQUE MÍNIMO</FormLabel>
                      <FormControl>
                        <Input type="number" className="uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="font-semibold text-muted-foreground text-sm uppercase">
                  HISTÓRICO & NOTAS (OPCIONAL)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lastBrand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MARCA DA ÚLTIMA COMPRA</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="EX: 3M, IVOCLAR..."
                            className="uppercase"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VALOR DA ÚLTIMA COMPRA</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="R$ 0,00"
                            className="uppercase"
                            value={formatCurrencyInput(field.value || 0)}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OBSERVAÇÕES</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[100px] uppercase"
                          placeholder="ADICIONE NOTAS, LINKS DE FORNECEDORES OU DETALHES..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  className="bg-[#D81B84] hover:bg-[#B71770] text-white uppercase font-bold"
                >
                  CADASTRAR PRODUTO
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <QuickProductSearchModal open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen} />
    </>
  )
}
