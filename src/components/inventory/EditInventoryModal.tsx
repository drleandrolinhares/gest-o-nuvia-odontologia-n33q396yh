import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore, {
  type InventoryItem,
  type InventoryMovement,
  type PurchaseRecord,
} from '@/stores/main'
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
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, cn } from '@/lib/utils'
import {
  Calculator,
  Barcode as BarcodeIcon,
  Tag,
  Zap,
  ShoppingCart,
  History,
  Info,
  Pencil,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { DatePickerInput } from '@/components/ui/date-picker-input'

const IMPLANT_DIAMETERS = ['3.3', '3.5', '3.75', '4.0', '4.3', '4.5', '5.0', '6.0']
const IMPLANT_HEIGHTS = ['4', '5', '5.5', '6', '7', '8', '8.5', '9', '10', '11.5', '13', '15']

const parseCurrency = (val: string | number) => {
  if (typeof val === 'number') return val
  return Number(val.replace(/\D/g, '')) / 100
}

const formatCurrencyInput = (val: string | number) => {
  const num = parseCurrency(val)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
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
  entryDate: z.string().optional(),
  expirationDate: z.string().optional(),
  storageRoom: z.string().optional(),
  cabinetNumber: z.string().optional(),
  nfeNumber: z.string().optional(),
  minStock: z.coerce.number().min(0),
  lastBrand: z.string().optional(),
  lastValue: z.union([z.string(), z.number()]).optional().transform(parseCurrency),
  notes: z.string().optional(),
  criticalObservations: z.string().optional(),
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

const editPurchaseSchema = z.object({
  quantity: z.coerce.number().min(1),
  price: z.union([z.string(), z.number()]).transform(parseCurrency),
  supplierId: z.string().optional(),
  nfeNumber: z.string().optional(),
})

export function EditInventoryModal({
  item,
  open,
  onOpenChange,
  onNewPurchase,
}: {
  item: InventoryItem | null
  open: boolean
  onOpenChange: (val: boolean) => void
  onNewPurchase: () => void
}) {
  const {
    updateInventoryItemDetails,
    packageTypes,
    specialties,
    inventoryOptions,
    getInventoryMovements,
    suppliers,
    isMaster,
    removePurchaseHistory,
    updatePurchaseHistory,
  } = useAppStore()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState('details')
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loadingMovements, setLoadingMovements] = useState(false)

  const [editingPurchase, setEditingPurchase] = useState<PurchaseRecord | null>(null)

  const storageRooms = inventoryOptions.filter(
    (o) =>
      o.category.toUpperCase() === 'STORAGE_ROOM' ||
      o.category.toUpperCase() === 'SALA_ARMAZENAMENTO',
  )
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
      entryDate: '',
      expirationDate: '',
      lastBrand: '',
      lastValue: 0,
      notes: '',
      criticalObservations: '',
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

  const editPurchaseForm = useForm<z.infer<typeof editPurchaseSchema>>({
    resolver: zodResolver(editPurchaseSchema),
    defaultValues: {
      quantity: 1,
      price: 0,
      supplierId: '',
      nfeNumber: '',
    },
  })

  useEffect(() => {
    if (item && open) {
      setActiveTab('details')
      form.reset({
        name: item.name || '',
        barcode: item.barcode || '',
        brand: item.brand || '',
        specialty: item.specialty || '',
        packageCost: item.packageCost || 0,
        packageType: item.packageType || 'CAIXA',
        itemsPerBox: item.itemsPerBox || 1,
        quantity: item.quantity || 0,
        storageRoom: item.storageRoom || '',
        cabinetNumber: item.cabinetNumber || '',
        nfeNumber: item.nfeNumber || '',
        minStock: item.minStock || 0,
        entryDate: item.entryDate ? item.entryDate.split('T')[0] : '',
        expirationDate: item.expirationDate ? item.expirationDate.split('T')[0] : '',
        lastBrand: item.lastBrand || '',
        lastValue: item.lastValue || 0,
        notes: item.notes || '',
        criticalObservations: item.criticalObservations || '',
        implantBrand: item.specialtyDetails?.implantBrand || '',
        implantDiameter: item.specialtyDetails?.implantDiameter || '',
        implantHeight: item.specialtyDetails?.implantHeight || '',
        isProstheticComponent: !!item.specialtyDetails?.isProstheticComponent,
        prostheticType: item.specialtyDetails?.prostheticType || '',
        prostheticAngle: item.specialtyDetails?.prostheticAngle || '',
        prostheticCollarHeight: item.specialtyDetails?.prostheticCollarHeight || '',
        prostheticDiameter: item.specialtyDetails?.prostheticDiameter || '',
        prostheticHeight: item.specialtyDetails?.prostheticHeight || '',
      })

      setLoadingMovements(true)
      getInventoryMovements(item.id).then((data) => {
        setMovements(data)
        setLoadingMovements(false)
      })
    }
  }, [item, open, form, getInventoryMovements])

  useEffect(() => {
    if (editingPurchase) {
      editPurchaseForm.reset({
        quantity: editingPurchase.quantity,
        price: editingPurchase.price,
        supplierId: editingPurchase.supplierId || '',
        nfeNumber: editingPurchase.nfeNumber || '',
      })
    }
  }, [editingPurchase, editPurchaseForm])

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

  const onSubmit = async (v: z.infer<typeof schema>) => {
    if (!item || !isMaster) return
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

    const res = await updateInventoryItemDetails(item.id, {
      name: v.name,
      barcode: v.barcode,
      brand: v.brand || '',
      specialty: v.specialty,
      packageCost: v.packageCost,
      packageType: v.packageType,
      itemsPerBox: v.itemsPerBox,
      quantity: v.quantity,
      storageLocation: `${v.storageRoom || ''} - ${v.cabinetNumber || ''}`,
      storageRoom: v.storageRoom === 'none' ? '' : v.storageRoom || '',
      cabinetNumber: v.cabinetNumber || '',
      nfeNumber: v.nfeNumber || '',
      minStock: v.minStock,
      entryDate: v.entryDate ? new Date(`${v.entryDate}T12:00:00Z`).toISOString() : undefined,
      expirationDate: v.expirationDate
        ? new Date(`${v.expirationDate}T12:00:00Z`).toISOString()
        : undefined,
      lastBrand: v.lastBrand || '',
      lastValue: v.lastValue || 0,
      notes: v.notes || '',
      criticalObservations: v.criticalObservations || '',
      specialtyDetails,
    })

    if (res.success) {
      toast({ title: 'SUCESSO', description: 'PRODUTO ATUALIZADO COM SUCESSO.' })
      onOpenChange(false)
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO ATUALIZAR PRODUTO.' })
    }
  }

  const onEditPurchaseSubmit = async (v: z.infer<typeof editPurchaseSchema>) => {
    if (!item || !editingPurchase) return
    const res = await updatePurchaseHistory(item.id, editingPurchase.id, {
      quantity: v.quantity,
      price: v.price,
      supplierId: v.supplierId === 'none' ? undefined : v.supplierId,
      nfeNumber: v.nfeNumber || '',
    })
    if (res.success) {
      toast({ title: 'SUCESSO', description: 'Registro de compra atualizado.' })
      setEditingPurchase(null)
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'Falha ao atualizar.' })
    }
  }

  const handleRemovePurchase = async (purchaseId: string) => {
    if (!item) return
    if (!window.confirm('Tem certeza que deseja excluir este registro de compra?')) return
    const res = await removePurchaseHistory(item.id, purchaseId)
    if (res.success) {
      toast({ title: 'SUCESSO', description: 'Registro de compra excluído.' })
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'Falha ao excluir registro.' })
    }
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
          <DialogHeader className="flex flex-row items-start justify-between pr-8">
            <DialogTitle className="text-2xl font-bold text-[#D81B84] uppercase">
              DETALHES DO PRODUTO
            </DialogTitle>
            {isMaster && (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  onOpenChange(false)
                  setTimeout(onNewPurchase, 300)
                }}
                className="bg-[#D81B84] hover:bg-[#B71770] text-white tracking-widest font-bold h-10 -mt-2"
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> NOVA COMPRA
              </Button>
            )}
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="details" className="font-bold tracking-wider">
                <Info className="w-4 h-4 mr-2" /> DETALHES
              </TabsTrigger>
              <TabsTrigger value="purchases" className="font-bold tracking-wider">
                <ShoppingCart className="w-4 h-4 mr-2" /> COMPRAS
              </TabsTrigger>
              <TabsTrigger value="history" className="font-bold tracking-wider">
                <History className="w-4 h-4 mr-2" /> MOVIMENTAÇÕES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-2">
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
                              disabled={!isMaster}
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
                              disabled={!isMaster}
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
                            <Input
                              placeholder="EX: 3M, FGM..."
                              className="uppercase"
                              {...field}
                              disabled={!isMaster}
                            />
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!isMaster}
                          >
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
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!isMaster}
                              >
                                <FormControl>
                                  <SelectTrigger className="uppercase bg-white border-blue-200">
                                    <SelectValue placeholder="SELECIONE" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {implantBrands.map((opt) => (
                                    <SelectItem
                                      key={opt.id}
                                      value={opt.value}
                                      className="uppercase"
                                    >
                                      {opt.value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="implantDiameter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-800">DIÂMETRO DO IMPLANTE</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!isMaster}
                              >
                                <FormControl>
                                  <SelectTrigger className="uppercase bg-white border-blue-200">
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
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="implantHeight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-800">ALTURA DO IMPLANTE</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!isMaster}
                              >
                                <FormControl>
                                  <SelectTrigger className="uppercase bg-white border-blue-200">
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
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!isMaster}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {isProstheticComponent && (
                        <div className="p-5 bg-blue-50/80 rounded-xl border-blue-200 shadow-sm animate-fade-in-up space-y-4 border">
                          <h4 className="font-extrabold text-blue-900 flex items-center gap-2 text-sm uppercase">
                            <Tag className="w-4 h-4" /> ESPECIFICAÇÕES DO COMPONENTE
                          </h4>
                          <div className="grid gap-4">
                            <FormField
                              control={form.control}
                              name="prostheticType"
                              render={({ field }) => (
                                <FormItem className="w-full md:w-1/2">
                                  <FormLabel className="text-blue-800">
                                    TIPO DE COMPONENTE
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={!isMaster}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="uppercase bg-white border-blue-200">
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
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      disabled={!isMaster}
                                    >
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
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={!isMaster}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="uppercase bg-white border-blue-200">
                                            <SelectValue placeholder="SELECIONE" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="17 GRAUS">17 GRAUS</SelectItem>
                                          <SelectItem value="30 GRAUS">30 GRAUS</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />
                                {form.watch('prostheticAngle') && (
                                  <FormField
                                    control={form.control}
                                    name="prostheticCollarHeight"
                                    render={({ field }) => (
                                      <FormItem className="animate-fade-in">
                                        <FormLabel className="text-blue-800">
                                          ALTURA DA CINTA
                                        </FormLabel>
                                        <Select
                                          onValueChange={field.onChange}
                                          value={field.value}
                                          disabled={!isMaster}
                                        >
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
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={!isMaster}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="uppercase bg-white border-blue-200">
                                            <SelectValue placeholder="SELECIONE" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="3,3 MM">3,3 MM</SelectItem>
                                          <SelectItem value="4,5 MM">4,5 MM</SelectItem>
                                        </SelectContent>
                                      </Select>
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
                                        <Select
                                          onValueChange={field.onChange}
                                          value={field.value}
                                          disabled={!isMaster}
                                        >
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
                            <FormLabel>QTD. ESTOQUE</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                className="bg-white uppercase"
                                {...field}
                                disabled={!isMaster}
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
                              <Input
                                type="number"
                                className="bg-white uppercase"
                                {...field}
                                disabled={!isMaster}
                              />
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
                                disabled={!isMaster}
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
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!isMaster}
                            >
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
                        VALOR TOTAL EM ESTOQUE
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
                          <FormControl>
                            <DatePickerInput
                              value={field.value}
                              onChange={(val) => field.onChange((val as string) || '')}
                              disabled={!isMaster}
                              className="uppercase"
                            />
                          </FormControl>
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
                          <FormControl>
                            <DatePickerInput
                              value={field.value}
                              onChange={(val) => field.onChange((val as string) || '')}
                              disabled={!isMaster}
                              className="uppercase"
                            />
                          </FormControl>
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
                            <Input
                              placeholder="EX: 123456"
                              className="uppercase"
                              {...field}
                              disabled={!isMaster}
                            />
                          </FormControl>
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!isMaster}
                          >
                            <FormControl>
                              <SelectTrigger className="uppercase">
                                <SelectValue placeholder="SELECIONE" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {storageRooms.length === 0 ? (
                                <SelectItem value="none" disabled className="uppercase">
                                  NENHUMA SALA CADASTRADA
                                </SelectItem>
                              ) : (
                                storageRooms.map((opt) => (
                                  <SelectItem key={opt.id} value={opt.value} className="uppercase">
                                    {opt.value}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          {storageRooms.length === 0 && (
                            <p className="text-[10px] text-amber-600 font-bold mt-1.5 uppercase">
                              Nenhuma sala cadastrada. Adicione em Configurações.
                            </p>
                          )}
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
                            <Input
                              placeholder="EX: A1"
                              className="uppercase"
                              {...field}
                              disabled={!isMaster}
                            />
                          </FormControl>
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
                            <Input
                              type="number"
                              className="uppercase"
                              {...field}
                              disabled={!isMaster}
                            />
                          </FormControl>
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
                                disabled={!isMaster}
                              />
                            </FormControl>
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
                                disabled={!isMaster}
                              />
                            </FormControl>
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
                              disabled={!isMaster}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="criticalObservations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-600 font-bold">
                            OBSERVAÇÕES CRÍTICAS
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="min-h-[80px] uppercase border-amber-200 focus-visible:ring-amber-500 bg-amber-50/30"
                              placeholder="NOTAS CRÍTICAS QUE GERAM ALERTA (EX: PRODUTO FRÁGIL, VERIFICAR LOTE)..."
                              {...field}
                              disabled={!isMaster}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {isMaster && (
                    <div className="flex justify-end gap-3 mt-4">
                      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        CANCELAR
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white uppercase font-bold"
                      >
                        SALVAR ALTERAÇÕES
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="purchases">
              <div className="border rounded-xl shadow-sm bg-white overflow-hidden mt-2">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground w-32">
                        DATA
                      </TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">
                        FORNECEDOR
                      </TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground text-center">
                        QTD
                      </TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">
                        VALOR (EMB)
                      </TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground text-center w-24">
                        AÇÕES
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!item?.purchaseHistory || item.purchaseHistory.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-10 text-muted-foreground uppercase font-semibold text-xs"
                        >
                          NENHUMA COMPRA REGISTRADA.
                        </TableCell>
                      </TableRow>
                    ) : (
                      item.purchaseHistory.map((ph) => {
                        const supplier = suppliers.find((s) => s.id === ph.supplierId)
                        return (
                          <TableRow key={ph.id}>
                            <TableCell className="font-medium text-xs">
                              {format(new Date(ph.date), 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell className="text-xs font-bold uppercase text-slate-700">
                              {supplier ? supplier.name : 'NÃO INFORMADO'}
                            </TableCell>
                            <TableCell className="text-center font-black text-sm">
                              {ph.quantity}
                            </TableCell>
                            <TableCell className="font-bold text-sm text-emerald-600">
                              {formatCurrency(ph.price)}
                            </TableCell>
                            <TableCell className="text-center">
                              {isMaster ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      setEditingPurchase(ph)
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-red-500 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleRemovePurchase(ph.id)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="border rounded-xl shadow-sm bg-white overflow-hidden mt-2">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground w-40">
                        DATA/HORA
                      </TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">
                        RESPONSÁVEL
                      </TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground w-40 text-center">
                        TIPO
                      </TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground w-20 text-center">
                        QTD
                      </TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">
                        DESTINATÁRIO/DESTINO
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingMovements ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          <div className="animate-pulse flex space-x-4 justify-center">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : movements.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-10 text-muted-foreground uppercase font-semibold text-xs"
                        >
                          NENHUMA MOVIMENTAÇÃO REGISTRADA.
                        </TableCell>
                      </TableRow>
                    ) : (
                      movements.map((mov) => (
                        <TableRow key={mov.id}>
                          <TableCell className="font-medium text-xs">
                            {format(new Date(mov.created_at), 'dd/MM/yyyy HH:mm')}
                          </TableCell>
                          <TableCell className="text-xs font-bold uppercase text-slate-700">
                            {mov.profiles?.name || 'SISTEMA'}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={cn(
                                'text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider',
                                mov.type === 'SAÍDA'
                                  ? 'bg-red-100 text-red-700'
                                  : mov.type === 'RETORNO'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700',
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-black text-sm">
                            {mov.quantity}
                          </TableCell>
                          <TableCell className="text-xs font-semibold uppercase text-muted-foreground max-w-[200px] truncate">
                            {mov.recipient || '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingPurchase} onOpenChange={(val) => !val && setEditingPurchase(null)}>
        <DialogContent className="max-w-md uppercase">
          <DialogHeader>
            <DialogTitle>EDITAR COMPRA</DialogTitle>
          </DialogHeader>
          <Form {...editPurchaseForm}>
            <form
              onSubmit={editPurchaseForm.handleSubmit(onEditPurchaseSubmit)}
              className="space-y-4 pt-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editPurchaseForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>QUANTIDADE</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="uppercase" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editPurchaseForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VALOR DA EMBALAGEM (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={formatCurrencyInput(field.value)}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="uppercase"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editPurchaseForm.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FORNECEDOR</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="uppercase">
                          <SelectValue placeholder="SELECIONE" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">NENHUM</SelectItem>
                        {suppliers.map((s) => (
                          <SelectItem key={s.id} value={s.id} className="uppercase">
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editPurchaseForm.control}
                name="nfeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NÚMERO DA NFE</FormLabel>
                    <FormControl>
                      <Input {...field} className="uppercase" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setEditingPurchase(null)}>
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  SALVAR ALTERAÇÕES
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
