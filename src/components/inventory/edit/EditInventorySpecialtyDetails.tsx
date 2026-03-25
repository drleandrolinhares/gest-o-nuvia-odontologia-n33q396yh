import type { UseFormReturn } from 'react-hook-form'
import { Tag, Zap } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { InlineImplantHeightSelect } from '@/components/inventory/InlineImplantHeightSelect'
import type { InventoryOption } from '@/stores/main'
import { IMPLANT_DIAMETERS } from './editInventorySchema'

interface EditInventorySpecialtyDetailsProps {
  // Accepts any react-hook-form instance — specialty field names are identical across forms
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
  currentSpecialty: string | undefined
  isProstheticComponent: boolean | undefined
  prostheticType: string | undefined
  canEdit: boolean
  isEditing: boolean
  implantBrands: InventoryOption[]
  componentTypes: InventoryOption[]
}

export function EditInventorySpecialtyDetails({
  form,
  currentSpecialty,
  isProstheticComponent,
  prostheticType,
  canEdit,
  isEditing,
  implantBrands,
  componentTypes,
}: EditInventorySpecialtyDetailsProps) {
  if (currentSpecialty === 'IMPLANTODONTIA') {
    return (
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
                  disabled={!canEdit || !isEditing}
                >
                  <FormControl>
                    <SelectTrigger className="uppercase bg-white border-blue-200">
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
                  disabled={!canEdit || !isEditing}
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
                <FormControl>
                  <InlineImplantHeightSelect
                    value={field.value || ''}
                    onChange={field.onChange}
                    disabled={!canEdit || !isEditing}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    )
  }

  if (currentSpecialty === 'PRÓTESE') {
    return (
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
                    disabled={!canEdit || !isEditing}
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
                    <FormLabel className="text-blue-800">TIPO DE COMPONENTE</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!canEdit || !isEditing}
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
                        disabled={!canEdit || !isEditing}
                      >
                        <FormControl>
                          <SelectTrigger className="uppercase bg-white border-blue-200">
                            <SelectValue placeholder="SELECIONE" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['0,8 MM', '1,5 MM', '2,5 MM', '3,5 MM', '4,5 MM', '5,0 MM'].map(
                            (opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ),
                          )}
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
                          disabled={!canEdit || !isEditing}
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
                          <FormLabel className="text-blue-800">ALTURA DA CINTA</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!canEdit || !isEditing}
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
                          disabled={!canEdit || !isEditing}
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
                            disabled={!canEdit || !isEditing}
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
    )
  }

  return null
}
