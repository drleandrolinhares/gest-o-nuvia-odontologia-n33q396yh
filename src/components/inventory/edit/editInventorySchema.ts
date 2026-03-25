import { z } from 'zod'

export const IMPLANT_DIAMETERS = ['3.3', '3.5', '3.75', '4.0', '4.3', '4.5', '5.0', '6.0']

export const parseCurrency = (val: string | number) => {
  if (typeof val === 'number') return val
  return Number(val.replace(/\D/g, '')) / 100
}

export const formatCurrencyInput = (val: string | number) => {
  const num = parseCurrency(val)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

export const schema = z.object({
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
  consumptionMode: z.string().optional(),
  consumptionReference: z.string().optional(),
})

export const editPurchaseSchema = z.object({
  quantity: z.coerce.number().min(1),
  price: z.union([z.string(), z.number()]).transform(parseCurrency),
  supplierId: z.string().optional(),
  nfeNumber: z.string().optional(),
})

export type FormSchema = z.infer<typeof schema>
export type EditPurchaseFormSchema = z.infer<typeof editPurchaseSchema>
