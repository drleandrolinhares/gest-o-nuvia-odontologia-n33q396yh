import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore, { type InventoryItem, type InventoryMovement } from '@/stores/main'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/utils'
import {
  Calculator,
  Barcode as BarcodeIcon,
  ShoppingCart,
  History,
  Info,
  Pencil,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DatePickerInput } from '@/components/ui/date-picker-input'
import { MonthYearInput } from '@/components/ui/month-year-input'
import { supabase } from '@/lib/supabase/client'
import { ExplanationPopover } from '@/components/inventory/ExplanationPopover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  schema,
  formatCurrencyInput,
  parseCurrency,
  type FormSchema,
} from './edit/editInventorySchema'
import { EditInventorySpecialtyDetails } from './edit/EditInventorySpecialtyDetails'
import { EditInventoryPurchaseHistory } from './edit/EditInventoryPurchaseHistory'
import { EditInventoryMovementsTable } from './edit/EditInventoryMovementsTable'

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
    inventoryOptions,
    getInventoryMovements,
    isMaster,
    isAdmin,
  } = useAppStore()
  const { toast } = useToast()

  const canEdit = isMaster || isAdmin

  const [activeTab, setActiveTab] = useState('details')
  const [isEditing, setIsEditing] = useState(false)
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loadingMovements, setLoadingMovements] = useState(false)
  const [localSpecialties, setLocalSpecialties] = useState<string[]>([])
  const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(false)

  const storageRooms = inventoryOptions.filter(
    (o) =>
      o.category.toUpperCase() === 'STORAGE_ROOM' ||
      o.category.toUpperCase() === 'SALA_ARMAZENAMENTO',
  )
  const implantBrands = inventoryOptions.filter((o) => o.category === 'MARCA_IMPLANTE')
  const componentTypes = inventoryOptions.filter((o) => o.category === 'TIPO_COMPONENTE')

  const realStockBefore = item ? item.quantity : 0

  const form = useForm<FormSchema>({
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
      consumptionMode: '',
      consumptionReference: '',
    },
  })

  useEffect(() => {
    if (open) {
      let isMounted = true
      setIsLoadingSpecialties(true)
      supabase
        .from('inventory_settings')
        .select('*')
        .in('category', ['specialty', 'especialidade', 'SPECIALTY', 'ESPECIALIDADE'])
        .then(({ data, error }) => {
          if (isMounted) {
            setIsLoadingSpecialties(false)
            if (!error && data) {
              const specs = data.map((o) => o.label || o.value).sort()
              setLocalSpecialties(specs)
            }
          }
        })
      return () => {
        isMounted = false
      }
    }
  }, [open])

  useEffect(() => {
    if (item && open) {
      setActiveTab('details')
      setIsEditing(false)
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
        consumptionMode: item.consumptionMode || '',
        consumptionReference: item.consumptionReference || '',
      })

      setLoadingMovements(true)
      getInventoryMovements(item.id).then((data) => {
        setMovements(data)
        setLoadingMovements(false)
      })
    }
  }, [item, open, form, getInventoryMovements])

  const pCostRaw = form.watch('packageCost')
  const pCost = parseCurrency(pCostRaw || 0)
  const qtyRaw = form.watch('quantity')
  const itemsPerBoxRaw = form.watch('itemsPerBox')
  const consumptionMode = form.watch('consumptionMode')
  const qty = Number(qtyRaw) || 0
  const totalCost = (qty / (Number(itemsPerBoxRaw) || 1)) * pCost
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

  useEffect(() => {
    const quantity = Number(qtyRaw) || 0
    const itemsPerBox = Number(itemsPerBoxRaw) || 1
    if (consumptionMode === 'QTD_COMPRADA') {
      form.setValue('consumptionReference', String(quantity))
    } else if (consumptionMode === 'ITENS_EMBALAGEM') {
      form.setValue('consumptionReference', String(itemsPerBox))
    }
  }, [consumptionMode, qtyRaw, itemsPerBoxRaw, form])

  const getItemResetValues = () => ({
    name: item?.name || '',
    barcode: item?.barcode || '',
    brand: item?.brand || '',
    specialty: item?.specialty || '',
    packageCost: item?.packageCost || 0,
    packageType: item?.packageType || 'CAIXA',
    itemsPerBox: item?.itemsPerBox || 1,
    quantity: item?.quantity || 0,
    storageRoom: item?.storageRoom || '',
    cabinetNumber: item?.cabinetNumber || '',
    nfeNumber: item?.nfeNumber || '',
    minStock: item?.minStock || 0,
    entryDate: item?.entryDate ? item.entryDate.split('T')[0] : '',
    expirationDate: item?.expirationDate ? item.expirationDate.split('T')[0] : '',
    lastBrand: item?.lastBrand || '',
    lastValue: item?.lastValue || 0,
    notes: item?.notes || '',
    criticalObservations: item?.criticalObservations || '',
    implantBrand: item?.specialtyDetails?.implantBrand || '',
    implantDiameter: item?.specialtyDetails?.implantDiameter || '',
    implantHeight: item?.specialtyDetails?.implantHeight || '',
    isProstheticComponent: !!item?.specialtyDetails?.isProstheticComponent,
    prostheticType: item?.specialtyDetails?.prostheticType || '',
    prostheticAngle: item?.specialtyDetails?.prostheticAngle || '',
    prostheticCollarHeight: item?.specialtyDetails?.prostheticCollarHeight || '',
    prostheticDiameter: item?.specialtyDetails?.prostheticDiameter || '',
    prostheticHeight: item?.specialtyDetails?.prostheticHeight || '',
    consumptionMode: item?.consumptionMode || '',
    consumptionReference: item?.consumptionReference || '',
  })

  const onSubmit = async (v: FormSchema) => {
    if (!item || !canEdit || !isEditing) return
    const specialtyDetails: Record<string, unknown> = {}
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
      consumptionMode: v.consumptionMode || '',
      consumptionReference: v.consumptionReference || '',
      specialtyDetails,
    })

    if (res.success) {
      toast({ title: 'SUCESSO', description: 'PRODUTO ATUALIZADO COM SUCESSO.' })
      setIsEditing(false)
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO ATUALIZAR PRODUTO.' })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) {
          form.reset()
          setIsEditing(false)
        }
      }}
    >
      <DialogContent className="max-w-[95vw] lg:max-w-5xl max-h-[90vh] overflow-y-auto uppercase">
        <DialogHeader className="flex flex-row items-start justify-between pr-8">
          <DialogTitle className="text-2xl font-bold text-[#D81B84] uppercase">
            DETALHES DO PRODUTO
          </DialogTitle>
          <div className="flex items-center gap-2 -mt-2">
            {canEdit && !isEditing && activeTab === 'details' && (
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  setIsEditing(true)
                }}
                className="border-[#D81B84] text-[#D81B84] hover:bg-[#D81B84] hover:text-white font-bold tracking-wider h-10"
              >
                <Pencil className="w-4 h-4 mr-2" /> HABILITAR EDIÇÃO
              </Button>
            )}
            {canEdit && (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  onOpenChange(false)
                  setTimeout(onNewPurchase, 300)
                }}
                className="bg-[#D81B84] hover:bg-[#B71770] text-white tracking-widest font-bold h-10"
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> NOVA COMPRA
              </Button>
            )}
          </div>
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
                            disabled={!canEdit || !isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NOME DO MATERIAL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="EX: MINI PILAR"
                            className="border-[#D81B84] focus-visible:ring-[#D81B84] uppercase"
                            {...field}
                            disabled={!canEdit || !isEditing}
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
                            disabled={!canEdit || !isEditing}
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
                          disabled={!canEdit || !isEditing}
                        >
                          <FormControl>
                            <SelectTrigger className="uppercase">
                              <SelectValue
                                placeholder={isLoadingSpecialties ? 'CARREGANDO...' : 'SELECIONE'}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingSpecialties ? (
                              <SelectItem
                                value={field.value || 'loading'}
                                disabled
                                className="uppercase"
                              >
                                CARREGANDO...
                              </SelectItem>
                            ) : localSpecialties.length === 0 ? (
                              <SelectItem
                                value={field.value || 'empty'}
                                disabled
                                className="uppercase"
                              >
                                NENHUMA ESPECIALIDADE ENCONTRADA
                              </SelectItem>
                            ) : (
                              [
                                ...new Set([
                                  ...localSpecialties,
                                  ...(field.value ? [field.value] : []),
                                ]),
                              ].map((spec) => (
                                <SelectItem key={spec} value={spec} className="uppercase">
                                  {spec}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="packageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EMBALAGEM DE COMPRA</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!canEdit || !isEditing}
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

                <EditInventorySpecialtyDetails
                  form={form}
                  currentSpecialty={currentSpecialty}
                  isProstheticComponent={isProstheticComponent}
                  prostheticType={prostheticType}
                  canEdit={canEdit}
                  isEditing={isEditing}
                  implantBrands={implantBrands}
                  componentTypes={componentTypes}
                />

                <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 grid gap-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                    <Calculator className="w-32 h-32" />
                  </div>
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2 relative z-10 uppercase">
                    INFORMAÇÕES DE ESTOQUE E EMBALAGEM
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 items-end mb-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold text-slate-700 uppercase">
                            NOVO ESTOQUE (UN)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="bg-white uppercase font-bold text-blue-900"
                              {...field}
                              disabled={!canEdit || !isEditing}
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
                          <FormLabel
                            className="text-[11px] font-bold text-slate-700 truncate uppercase"
                            title="ITENS NA EMBALAGEM"
                          >
                            ITENS NA EMBALAGEM
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="bg-white uppercase font-bold"
                              {...field}
                              disabled={!canEdit || !isEditing}
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
                          <FormLabel className="text-[11px] font-bold text-slate-700 uppercase">
                            VALOR ATRIBUIDO
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="numeric"
                              autoComplete="off"
                              data-lpignore="true"
                              data-form-type="other"
                              className="bg-white font-bold"
                              placeholder="R$ 0,00"
                              value={formatCurrencyInput(field.value || 0)}
                              onChange={(e) => field.onChange(e.target.value)}
                              disabled={!canEdit || !isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-full flex flex-col">
                      <span className="text-[11px] font-bold leading-none mb-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#000080] uppercase">
                        VALOR TOTAL
                      </span>
                      <div className="text-sm font-black bg-[#000080] text-[#D4AF37] h-10 px-3 flex items-center justify-end rounded-md shadow-sm border border-[#000080] truncate">
                        {formatCurrency(totalCost)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 items-end">
                    <div className="w-full flex flex-col">
                      <span className="text-[11px] font-bold leading-none mb-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 uppercase text-blue-800">
                        ESTOQUE ANTERIOR
                      </span>
                      <div className="text-sm font-bold bg-blue-50/50 border-blue-200 text-blue-900 h-10 px-3 flex items-center justify-end rounded-md shadow-sm border truncate">
                        {realStockBefore} UN
                      </div>
                    </div>
                    <div className="w-full flex flex-col">
                      <span className="text-[11px] font-bold leading-none mb-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 uppercase text-[#000080]">
                        ESTOQUE PÓS ADIÇÃO
                      </span>
                      <div className="text-sm font-black bg-[#000080] text-[#D4AF37] h-10 px-3 flex items-center justify-end rounded-md shadow-sm border border-[#000080] truncate">
                        {qty} UN
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-2 pt-4 border-t border-slate-200 relative z-10">
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="consumptionReference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center text-xs font-bold text-slate-800 uppercase mb-2">
                              REFERENCIA CONSUMO
                              <ExplanationPopover />
                            </FormLabel>
                            <div className="flex flex-col gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50 shadow-sm md:flex-row md:items-center">
                              <RadioGroup
                                value={form.watch('consumptionMode') || ''}
                                onValueChange={(val) => form.setValue('consumptionMode', val)}
                                className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1"
                                disabled={!canEdit || !isEditing}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="QTD_COMPRADA" id="m1" />
                                  <Label
                                    htmlFor="m1"
                                    className="text-xs cursor-pointer font-bold uppercase"
                                  >
                                    QTD. COMPRADA
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="ITENS_EMBALAGEM" id="m2" />
                                  <Label
                                    htmlFor="m2"
                                    className="text-xs cursor-pointer font-bold uppercase"
                                  >
                                    ITENS NA EMBALAGEM
                                  </Label>
                                </div>
                              </RadioGroup>
                              <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap">
                                  VALOR ATRIBUÍDO:
                                </span>
                                <Input
                                  {...field}
                                  readOnly
                                  placeholder="N/A"
                                  className="bg-muted border-slate-200 text-slate-700 font-black h-9 text-center w-24 cursor-not-allowed"
                                />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                  <FormField
                    control={form.control}
                    name="entryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>DATA DE ENTRADA</FormLabel>
                        <FormControl>
                          <DatePickerInput
                            value={field.value}
                            onChange={(val) => field.onChange(val || '')}
                            disabled={!canEdit || !isEditing}
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
                          <MonthYearInput
                            value={field.value}
                            onChange={(val) => field.onChange(val || '')}
                            disabled={!canEdit || !isEditing}
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
                            disabled={!canEdit || !isEditing}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <FormField
                    control={form.control}
                    name="storageRoom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SALA DE ARMAZENAMENTO</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!canEdit || !isEditing}
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
                            disabled={!canEdit || !isEditing}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-4">
                  <FormField
                    control={form.control}
                    name="minStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ESTOQUE MÍNIMO (UNIDADES)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="uppercase"
                            {...field}
                            disabled={!canEdit || !isEditing}
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
                              disabled={!canEdit || !isEditing}
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
                              inputMode="numeric"
                              autoComplete="off"
                              data-lpignore="true"
                              data-form-type="other"
                              placeholder="R$ 0,00"
                              className="uppercase"
                              value={formatCurrencyInput(field.value || 0)}
                              onChange={(e) => field.onChange(e.target.value)}
                              disabled={!canEdit || !isEditing}
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
                            disabled={!canEdit || !isEditing}
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
                            className="min-h-[80px] uppercase border-amber-200 focus-visible:ring-amber-50 bg-amber-50/30"
                            placeholder="NOTAS CRÍTICAS QUE GERAM ALERTA (EX: PRODUTO FRÁGIL, VERIFICAR LOTE)..."
                            {...field}
                            disabled={!canEdit || !isEditing}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {canEdit && isEditing && (
                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        form.reset(getItemResetValues())
                      }}
                    >
                      CANCELAR EDIÇÃO
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
            <EditInventoryPurchaseHistory item={item} canEdit={canEdit} />
          </TabsContent>

          <TabsContent value="history">
            <EditInventoryMovementsTable movements={movements} loading={loadingMovements} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
