import { useRef, MutableRefObject } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { Calculator, Barcode as BarcodeIcon } from 'lucide-react'
import { DatePickerInput } from '@/components/ui/date-picker-input'
import { MonthYearInput } from '@/components/ui/month-year-input'
import { ExplanationPopover } from '@/components/inventory/ExplanationPopover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { EditInventorySpecialtyDetails } from '@/components/inventory/edit/EditInventorySpecialtyDetails'
import type { InventoryOption } from '@/types/inventory'

const parseCurrency = (val: string | number | undefined | null) => {
  if (!val) return 0
  if (typeof val === 'number') return val
  return Number(String(val).replace(/\D/g, '')) / 100
}

const formatCurrencyInput = (val: string | number | undefined | null) => {
  if (val === '' || val === undefined || val === null) return ''
  const num = parseCurrency(val)
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

interface AddInventoryFormProps {
  form: UseFormReturn<any>
  baseItemName?: string
  packageTypes: string[]
  storageRooms: InventoryOption[]
  implantBrands: InventoryOption[]
  componentTypes: InventoryOption[]
  localSpecialties: string[]
  isLoadingSpecialties: boolean
  realStockBefore: number
  totalCost: number
  qty: number
  itemsPerBoxRaw: any
  currentSpecialty: string
  isProstheticComponent: boolean
  prostheticType: string
  consumptionMode: string
  keepFields: boolean
  setKeepFields: (v: boolean) => void
  barcodeInputRef: MutableRefObject<HTMLInputElement | null>
  onCancel: () => void
}

export function AddInventoryForm({
  form,
  baseItemName,
  packageTypes,
  storageRooms,
  implantBrands,
  componentTypes,
  localSpecialties,
  isLoadingSpecialties,
  realStockBefore,
  totalCost,
  qty,
  itemsPerBoxRaw,
  currentSpecialty,
  isProstheticComponent,
  prostheticType,
  keepFields,
  setKeepFields,
  barcodeInputRef,
  onCancel,
}: AddInventoryFormProps) {
  return (
    <>
      {/* Barcode Section */}
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
                  autoFocus
                  placeholder="BIPAR OU DIGITAR CÓDIGO..."
                  className="bg-white border-blue-200 shadow-sm h-12 text-lg font-mono tracking-widest uppercase"
                  {...field}
                  ref={(e) => {
                    field.ref(e)
                    barcodeInputRef.current = e
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Basic Info Grid */}
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
                  disabled={!!baseItemName}
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
                    <SelectValue
                      placeholder={isLoadingSpecialties ? 'CARREGANDO...' : 'SELECIONE'}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingSpecialties ? (
                    <SelectItem value={field.value || 'loading'} disabled className="uppercase">
                      CARREGANDO...
                    </SelectItem>
                  ) : (localSpecialties ?? []).length === 0 ? (
                    <SelectItem value={field.value || 'empty'} disabled className="uppercase">
                      NENHUMA ESPECIALIDADE ENCONTRADA
                    </SelectItem>
                  ) : (
                    [
                      ...new Set([
                        ...(localSpecialties ?? []),
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white uppercase">
                    <SelectValue placeholder="SELECIONE" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(packageTypes ?? []).map((pt) => (
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

      {/* Specialty Details (shared component) */}
      <EditInventorySpecialtyDetails
        form={form}
        currentSpecialty={currentSpecialty}
        isProstheticComponent={isProstheticComponent}
        prostheticType={prostheticType}
        canEdit={true}
        isEditing={true}
        implantBrands={implantBrands}
        componentTypes={componentTypes}
      />

      {/* Purchase & Packaging Info */}
      <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 grid gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
          <Calculator className="w-32 h-32" />
        </div>
        <h4 className="font-semibold text-slate-800 flex items-center gap-2 relative z-10 uppercase">
          INFORMAÇÕES DE COMPRA E EMBALAGEM
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 items-end mb-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-slate-700 uppercase">
                  QTD COMPRADA
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-white uppercase font-bold"
                    {...field}
                    value={field.value ?? ''}
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
                    value={field.value ?? ''}
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
                    value={formatCurrencyInput(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
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
              ESTOQUE ATUAL
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
              {realStockBefore + qty * (Number(itemsPerBoxRaw) || 1)} UN
            </div>
          </div>
        </div>

        {/* Consumption Reference */}
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
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="QTD_COMPRADA" id="m1" />
                        <Label htmlFor="m1" className="text-xs cursor-pointer font-bold uppercase">
                          QTD. COMPRADA
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ITENS_EMBALAGEM" id="m2" />
                        <Label htmlFor="m2" className="text-xs cursor-pointer font-bold uppercase">
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
                        value={field.value || ''}
                      />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Dates & NFE */}
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
                <Input placeholder="EX: 123456" className="uppercase" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Storage Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
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
                  {(storageRooms ?? []).length === 0 ? (
                    <SelectItem value="none" disabled className="uppercase">
                      NENHUMA SALA CADASTRADA
                    </SelectItem>
                  ) : (
                    (storageRooms ?? []).map((opt) => (
                      <SelectItem key={opt.id} value={opt.value} className="uppercase">
                        {opt.value}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {(storageRooms ?? []).length === 0 && (
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
                <Input placeholder="EX: A1" className="uppercase" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Min Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-4">
        <FormField
          control={form.control}
          name="minStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ESTOQUE MÍNIMO (UNIDADES)</FormLabel>
              <FormControl>
                <Input type="number" className="uppercase" {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* History & Notes */}
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
                  <Input placeholder="EX: 3M, IVOCLAR..." className="uppercase" {...field} />
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
                    value={formatCurrencyInput(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
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
              <FormLabel className="text-amber-600 font-bold">OBSERVAÇÕES CRÍTICAS</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[80px] uppercase border-amber-200 focus-visible:ring-amber-50 bg-amber-50/30"
                  placeholder="NOTAS CRÍTICAS QUE GERAM ALERTA (EX: PRODUTO FRÁGIL, VERIFICAR LOTE)..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 bg-muted/20 p-4 rounded-xl border border-muted/50">
        <div className="flex items-center gap-3">
          <Switch checked={keepFields} onCheckedChange={setKeepFields} id="keep-fields" />
          <label
            htmlFor="keep-fields"
            className="text-xs font-bold uppercase text-muted-foreground cursor-pointer"
          >
            MANTER CAMPOS PREENCHIDOS (CADASTRO SEQUENCIAL)
          </label>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            CANCELAR
          </Button>
          <Button
            type="submit"
            className="bg-[#D81B84] hover:bg-[#B71770] text-white uppercase font-bold"
          >
            {baseItemName ? 'CADASTRAR COMPRA' : 'CADASTRAR PRODUTO'}
          </Button>
        </div>
      </div>
    </>
  )
}
