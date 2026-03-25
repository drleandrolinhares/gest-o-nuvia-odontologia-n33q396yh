import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@/stores/main'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { PackageSearch } from 'lucide-react'
import { QuickProductSearchModal } from '@/components/inventory/QuickProductSearchModal'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { AddInventoryForm } from './add/AddInventoryForm'

const parseCurrency = (val: string | number | undefined | null) => {
  if (!val) return 0
  if (typeof val === 'number') return val
  return Number(String(val).replace(/\D/g, '')) / 100
}

const schema = z.object({
  name: z.string().min(1, 'Obrigatório'),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  specialty: z.string().optional(),
  packageCost: z.union([z.string(), z.number()]).optional().transform(parseCurrency),
  packageType: z.string().min(1, 'Obrigatório'),
  itemsPerBox: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      const n = Number(v)
      return n > 0 ? n : 1
    }),
  quantity: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => Number(v) || 0),
  entryDate: z.string().optional(),
  expirationDate: z.string().optional(),
  storageRoom: z.string().optional(),
  cabinetNumber: z.string().optional(),
  nfeNumber: z.string().optional(),
  minStock: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => Number(v) || 0),
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
  consumptionMode: z.string().optional(),
  consumptionReference: z.string().optional(),
})

export function AddInventoryModal({
  open,
  onOpenChange,
  baseItemName,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
  baseItemName?: string
}) {
  const { addInventoryItem, packageTypes, inventoryOptions, inventory } = useAppStore()
  const { toast } = useToast()

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [keepFields, setKeepFields] = useState(false)
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  const [localSpecialties, setLocalSpecialties] = useState<string[]>([])
  const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(false)

  const storageRooms = inventoryOptions.filter(
    (o) =>
      o.category.toUpperCase() === 'STORAGE_ROOM' ||
      o.category.toUpperCase() === 'SALA_ARMAZENAMENTO',
  )
  const implantBrands = inventoryOptions.filter((o) => o.category === 'MARCA_IMPLANTE')
  const componentTypes = inventoryOptions.filter((o) => o.category === 'TIPO_COMPONENTE')

  const existingItem = baseItemName ? inventory.find((i) => i.name === baseItemName) : null
  const realStockBefore = existingItem ? existingItem.quantity : 0

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      barcode: '',
      brand: '',
      specialty: '',
      packageCost: '' as any,
      packageType: 'CAIXA',
      itemsPerBox: '' as any,
      quantity: '' as any,
      entryDate: '',
      expirationDate: '',
      storageRoom: '',
      cabinetNumber: '',
      nfeNumber: '',
      minStock: '' as any,
      lastBrand: '',
      lastValue: '' as any,
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
      if (baseItemName) {
        form.setValue('name', baseItemName)
      } else if (!keepFields) {
        form.reset()
      }

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
  }, [open, baseItemName, form, keepFields])

  const pCostRaw = form.watch('packageCost')
  const pCost = parseCurrency(pCostRaw || 0)
  const qtyRaw = form.watch('quantity')
  const itemsPerBoxRaw = form.watch('itemsPerBox')
  const consumptionMode = form.watch('consumptionMode')
  const qty = Number(qtyRaw) || 0
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

  useEffect(() => {
    const quantity = Number(qtyRaw) || 0
    const itemsPerBox = Number(itemsPerBoxRaw) || 1

    if (consumptionMode === 'QTD_COMPRADA') {
      form.setValue('consumptionReference', String(quantity))
    } else if (consumptionMode === 'ITENS_EMBALAGEM') {
      form.setValue('consumptionReference', String(itemsPerBox))
    }
  }, [consumptionMode, qtyRaw, itemsPerBoxRaw, form])

  const onSubmit = (v: z.infer<typeof schema>) => {
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

    addInventoryItem({
      name: v.name,
      barcode: v.barcode,
      brand: v.brand || '',
      specialty: v.specialty,
      packageCost: v.packageCost || 0,
      packageType: v.packageType,
      itemsPerBox: v.itemsPerBox || 1,
      quantity: (v.quantity || 0) * (v.itemsPerBox || 1),
      storageLocation: `${v.storageRoom || ''} - ${v.cabinetNumber || ''}`,
      storageRoom: v.storageRoom === 'none' ? '' : v.storageRoom || '',
      cabinetNumber: v.cabinetNumber || '',
      nfeNumber: v.nfeNumber || '',
      minStock: v.minStock || 0,
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

    toast({
      title: 'SUCESSO',
      description: 'PRODUTO CADASTRADO COM SUCESSO.',
    })

    if (keepFields) {
      form.setValue('barcode', '')
      form.setValue('quantity', '' as any)
      form.setValue('entryDate', '')
      form.setValue('expirationDate', '')
      form.setValue('nfeNumber', '')
      form.setValue('implantDiameter', '')
      form.setValue('implantHeight', '')
      form.setValue('prostheticDiameter', '')
      form.setValue('prostheticHeight', '')
      form.setValue('prostheticCollarHeight', '')
      form.setValue('prostheticAngle', '')

      setTimeout(() => {
        barcodeInputRef.current?.focus()
      }, 150)
    } else {
      form.reset()
      onOpenChange(false)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          onOpenChange(val)
          if (!val && !keepFields && !baseItemName) form.reset()
        }}
      >
        <DialogContent className="max-w-[95vw] lg:max-w-5xl max-h-[90vh] overflow-y-auto uppercase">
          <DialogHeader className="flex flex-row items-center justify-between pr-8">
            <DialogTitle className="text-2xl font-bold text-nuvia-navy uppercase">
              {baseItemName ? 'NOVA COMPRA (MESMO PRODUTO)' : 'NOVO PRODUTO NO ESTOQUE'}
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
              <AddInventoryForm
                form={form}
                baseItemName={baseItemName}
                packageTypes={packageTypes}
                storageRooms={storageRooms}
                implantBrands={implantBrands}
                componentTypes={componentTypes}
                localSpecialties={localSpecialties}
                isLoadingSpecialties={isLoadingSpecialties}
                realStockBefore={realStockBefore}
                totalCost={totalCost}
                qty={qty}
                itemsPerBoxRaw={itemsPerBoxRaw}
                currentSpecialty={currentSpecialty || ''}
                isProstheticComponent={isProstheticComponent || false}
                prostheticType={prostheticType || ''}
                consumptionMode={consumptionMode || ''}
                keepFields={keepFields}
                setKeepFields={setKeepFields}
                barcodeInputRef={barcodeInputRef}
                onCancel={() => onOpenChange(false)}
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <QuickProductSearchModal open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen} />
    </>
  )
}
