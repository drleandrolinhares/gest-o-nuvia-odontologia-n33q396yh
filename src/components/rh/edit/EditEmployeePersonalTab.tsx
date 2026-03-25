import type { UseFormReturn } from 'react-hook-form'
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
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  User,
  Phone,
  Mail,
  Search,
  Briefcase,
  Check,
  ChevronsUpDown,
  Gift,
  CreditCard,
} from 'lucide-react'
import useAppStore from '@/stores/main'

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType }) => (
  <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0 uppercase">
    {Icon && <Icon className="w-5 h-5 text-nuvia-gold" />}
    <h3 className="text-lg font-semibold text-nuvia-navy">{title}</h3>
  </div>
)

interface EditEmployeePersonalTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
  isEditingData: boolean
}

export function EditEmployeePersonalTab({ form, isEditingData }: EditEmployeePersonalTabProps) {
  const { roles, departments, bonusTypes, isAdmin } = useAppStore()

  return (
    <div className="space-y-8">
      <div id="section-dados" className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
        <SectionTitle title="INFORMAÇÕES BÁSICAS" icon={User} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NOME COMPLETO *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditingData} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EMAIL *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditingData} className="bg-background lowercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TELEFONE *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditingData} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div
        id="section-financeiro"
        className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm"
      >
        <SectionTitle title="DADOS FINANCEIROS (PIX)" icon={CreditCard} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BANCO</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditingData} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pixType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TIPO DE PIX</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!isEditingData}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="SELECIONE..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CPF">CPF</SelectItem>
                    <SelectItem value="CEL">CELULAR</SelectItem>
                    <SelectItem value="EMAIL">E-MAIL</SelectItem>
                    <SelectItem value="CHAVE ALEATÓRIA">ALEATÓRIA</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pixNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NÚMERO DO PIX</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditingData} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div
        id="section-contrato"
        className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm"
      >
        <SectionTitle title="RELAÇÕES E ACORDOS COM A EMPRESA" icon={Briefcase} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CARGO *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!isEditingData || !isAdmin}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="SELECIONE O CARGO" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.name} className="uppercase">
                        {r.name}
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
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DEPARTAMENTO *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!isEditingData || !isAdmin}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="SELECIONE O DEPARTAMENTO" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[...departments].sort().map((d) => (
                      <SelectItem key={d} value={d} className="uppercase">
                        {d.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="teamCategory"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>FUNÇÕES PROFISSIONAIS</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!isEditingData}
                        className={cn(
                          'w-full justify-between bg-background font-normal',
                          !field.value?.length && 'text-muted-foreground',
                        )}
                      >
                        {field.value?.length > 0 ? field.value.join(', ') : 'SELECIONE...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0 uppercase">
                    <Command>
                      <CommandInput placeholder="BUSCAR FUNÇÃO..." />
                      <CommandList>
                        <CommandEmpty>NENHUMA FUNÇÃO ENCONTRADA.</CommandEmpty>
                        <CommandGroup>
                          {['SÓCIO', 'DENTISTA', 'COLABORADOR'].map((cat) => (
                            <CommandItem
                              value={cat}
                              key={cat}
                              onSelect={() => {
                                const current = field.value || []
                                const updated = current.includes(cat)
                                  ? current.filter((val: string) => val !== cat)
                                  : [...current, cat]
                                field.onChange(updated)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value?.includes(cat) ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              {cat}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-3">
            <FormField
              control={form.control}
              name="contractDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DETALHES DE CONTRATO / ACORDOS ESPECÍFICOS</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!isEditingData}
                      className="bg-background min-h-[120px]"
                      placeholder="INFORMAÇÕES SOBRE VÍNCULOS, COMISSÕES E OUTROS..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div id="section-bonus" className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
        <SectionTitle title="BONIFICAÇÃO" icon={Gift} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bonusType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TIPO DE BONIFICAÇÃO</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!isEditingData}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="SELECIONE..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bonusTypes.map((b) => (
                      <SelectItem key={b.id} value={b.name} className="uppercase">
                        {b.name}
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
            name="bonusDueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VENCIMENTO DA BONIFICAÇÃO</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={!isEditingData}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="bonusRules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>REGRAS DA BONIFICAÇÃO</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!isEditingData}
                      className="bg-background min-h-[80px]"
                      placeholder="DESCREVA AS METAS E REGRAS PARA RECEBIMENTO..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
        <SectionTitle title="INFORMAÇÕES PESSOAIS" icon={User} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DATA DE NASCIMENTO</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={!isEditingData}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RG</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditingData} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditingData} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
        <SectionTitle title="ENDEREÇO" icon={User} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input {...field} disabled={!isEditingData} className="bg-background pr-10" />
                    </FormControl>
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-7">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ENDEREÇO</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditingData} className="bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="addressNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NÚMERO</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditingData} className="bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-5">
            <FormField
              control={form.control}
              name="addressComplement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>COMPLEMENTO</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditingData} className="bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-5">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CIDADE</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditingData} className="bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ESTADO</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!isEditingData}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SP">SP</SelectItem>
                      <SelectItem value="RJ">RJ</SelectItem>
                      <SelectItem value="MG">MG</SelectItem>
                      <SelectItem value="ES">ES</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
