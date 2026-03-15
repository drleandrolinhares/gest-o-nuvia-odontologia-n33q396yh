import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useAppStore, { Employee } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  User,
  Phone,
  Mail,
  Search,
  Key,
  Shield,
  Eye,
  EyeOff,
  Briefcase,
  Check,
  ChevronsUpDown,
  Loader2,
  Gift,
  CreditCard,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const formSchema = z
  .object({
    name: z.string().min(1, 'Obrigatório'),
    username: z.string().optional(),
    email: z.string().email('Inválido').or(z.literal('')),
    phone: z.string().optional(),
    birthDate: z.string().optional(),
    rg: z.string().optional(),
    cpf: z.string().optional(),
    cep: z.string().optional(),
    address: z.string().optional(),
    addressNumber: z.string().optional(),
    addressComplement: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    teamCategory: z.array(z.string()).min(1, 'Obrigatório'),
    contractDetails: z.string().optional(),
    bonusType: z.string().optional(),
    bonusRules: z.string().optional(),
    bonusDueDate: z.string().optional(),
    pixKey: z.string().optional(),
    pixType: z.string().optional(),
    bankName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        return data.newPassword === data.confirmPassword
      }
      return true
    },
    {
      message: 'As senhas não conferem',
      path: ['confirmPassword'],
    },
  )

type FormValues = z.infer<typeof formSchema>

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: any }) => (
  <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0 uppercase">
    {Icon && <Icon className="w-5 h-5 text-nuvia-gold" />}
    <h3 className="text-lg font-semibold text-nuvia-navy">{title}</h3>
  </div>
)

export function EditEmployeeDialog({
  employee,
  open,
  onOpenChange,
  defaultTab = 'dados',
  startInEditMode = false,
  focusSection = null,
}: {
  employee: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: string
  startInEditMode?: boolean
  focusSection?: string | null
}) {
  const { updateEmployee, updateEmployeePassword, generateEmployeeAccess, bonusTypes } =
    useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditingData, setIsEditingData] = useState(false)
  const [activeTab, setActiveTab] = useState(defaultTab)

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isGenerateAccessMode, setIsGenerateAccessMode] = useState(false)
  const [genEmail, setGenEmail] = useState('')
  const [genPass, setGenPass] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phone: '',
      birthDate: '',
      rg: '',
      cpf: '',
      cep: '',
      address: '',
      addressNumber: '',
      addressComplement: '',
      city: '',
      state: '',
      newPassword: '',
      confirmPassword: '',
      teamCategory: ['COLABORADOR'],
      contractDetails: '',
      bonusType: '',
      bonusRules: '',
      bonusDueDate: '',
      pixKey: '',
      pixType: '',
      bankName: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (employee) {
        form.reset({
          name: employee.name || '',
          username: employee.username || '',
          email: employee.email || '',
          phone: employee.phone || '',
          birthDate: employee.birthDate || '',
          rg: employee.rg || '',
          cpf: employee.cpf || '',
          cep: employee.cep || '',
          address: employee.address || '',
          addressNumber: employee.addressNumber || '',
          addressComplement: employee.addressComplement || '',
          city: employee.city || '',
          state: employee.state || '',
          newPassword: '',
          confirmPassword: '',
          teamCategory: employee.teamCategory || ['COLABORADOR'],
          contractDetails: employee.contractDetails || '',
          bonusType: employee.bonusType || '',
          bonusRules: employee.bonusRules || '',
          bonusDueDate: employee.bonusDueDate || '',
          pixKey: employee.pixKey || '',
          pixType: employee.pixType || '',
          bankName: employee.bankName || '',
        })
        setIsEditingData(startInEditMode)
        setActiveTab(defaultTab)
        setShowNewPassword(false)
        setShowConfirmPassword(false)
        setGenEmail(employee.email || '')
        setGenPass('')
        setIsGenerateAccessMode(false)
      }
      if (focusSection) {
        setTimeout(() => {
          const el = document.getElementById(`section-${focusSection}`)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 100)
      }
    }
  }, [open, employee, defaultTab, form, startInEditMode, focusSection])

  const onSubmit = async (v: FormValues) => {
    if (!employee) return
    setIsLoading(true)
    try {
      const res = await updateEmployee(employee.id, v)
      let passRes = { success: true, error: null }

      if (v.newPassword && employee.user_id) {
        passRes = await updateEmployeePassword(employee.user_id, v.newPassword)
      } else if (v.newPassword && !employee.user_id) {
        toast({
          title: 'Aviso',
          description: 'Usuário não possui conta de acesso vinculada. A senha não foi alterada.',
          variant: 'destructive',
        })
      }

      if (res.success && passRes.success) {
        toast({ title: 'Sucesso', description: 'Dados atualizados com sucesso.' })
        onOpenChange(false)
      } else {
        toast({
          title: 'Erro',
          description: passRes.error?.message || res.error?.message || 'Erro ao atualizar dados.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Ocorreu um erro inesperado.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateAccess = async () => {
    if (!employee) return
    setIsGenerating(true)
    const res = await generateEmployeeAccess(employee.id, genEmail, genPass, employee.name)
    setIsGenerating(false)
    if (res.success) {
      toast({ title: 'Sucesso', description: 'Acesso criado com sucesso!' })
      setIsGenerateAccessMode(false)
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: res.error?.message || 'Erro ao gerar acesso.',
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) form.reset()
      }}
    >
      <DialogContent className="max-w-5xl p-0 max-h-[90vh] flex flex-col overflow-hidden bg-[#f9fafb] uppercase">
        <DialogHeader className="p-6 pb-0 sr-only shrink-0">
          <DialogTitle>EDITAR COLABORADOR</DialogTitle>
        </DialogHeader>

        {employee && (
          <div className="bg-white border-b px-8 py-6 flex items-center gap-6 shrink-0">
            <Avatar className="h-20 w-20 bg-muted">
              <AvatarFallback className="text-2xl text-muted-foreground">
                <User className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-nuvia-navy">{employee.name}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {employee.username || 'NÃO INFORMADO'}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {employee.phone || 'NÃO INFORMADO'}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {employee.email || 'NÃO INFORMADO'}
                </span>
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="px-8 bg-white border-b pt-2 shrink-0">
                <TabsList className="bg-transparent h-auto p-0 flex gap-6 overflow-x-auto w-full justify-start">
                  <TabsTrigger
                    value="dados"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-nuvia-gold data-[state=active]:text-nuvia-gold rounded-none px-0 pb-3 text-base font-semibold"
                  >
                    DADOS PESSOAIS E CONTRATO
                  </TabsTrigger>
                  <TabsTrigger
                    value="seguranca"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-nuvia-gold data-[state=active]:text-nuvia-gold rounded-none px-0 pb-3 text-base font-semibold"
                  >
                    SEGURANÇA E ACESSO
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-8 relative">
                {activeTab === 'dados' && (
                  <div className="absolute right-8 top-8 z-10">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-nuvia-gold text-nuvia-gold hover:bg-nuvia-gold/10"
                      onClick={() => setIsEditingData(!isEditingData)}
                    >
                      {isEditingData ? 'BLOQUEAR EDIÇÃO' : 'EDITAR'}
                    </Button>
                  </div>
                )}

                <TabsContent value="dados" className="m-0 space-y-8 max-w-4xl">
                  <div className="space-y-8">
                    <div
                      id="section-dados"
                      className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm"
                    >
                      <SectionTitle title="INFORMAÇÕES BÁSICAS" icon={User} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>NOME COMPLETO *</FormLabel>
                              <FormControl>
                                <Input
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
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>EMAIL *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditingData}
                                  className="bg-background lowercase"
                                />
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
                                <Input
                                  {...field}
                                  disabled={!isEditingData}
                                  className="bg-background"
                                />
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
                                <Input
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
                          name="pixKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CHAVE PIX</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditingData}
                                  className="bg-background"
                                />
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
                                      {field.value?.length > 0
                                        ? field.value.join(', ')
                                        : 'SELECIONE...'}
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
                                                ? current.filter((val) => val !== cat)
                                                : [...current, cat]
                                              field.onChange(updated)
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                'mr-2 h-4 w-4',
                                                field.value?.includes(cat)
                                                  ? 'opacity-100'
                                                  : 'opacity-0',
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

                    <div
                      id="section-bonus"
                      className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm"
                    >
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
                                <Input
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
                          name="cpf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditingData}
                                  className="bg-background"
                                />
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
                                    <Input
                                      {...field}
                                      disabled={!isEditingData}
                                      className="bg-background pr-10"
                                    />
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
                                  <Input
                                    {...field}
                                    disabled={!isEditingData}
                                    className="bg-background"
                                  />
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
                                  <Input
                                    {...field}
                                    disabled={!isEditingData}
                                    className="bg-background"
                                  />
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
                                  <Input
                                    {...field}
                                    disabled={!isEditingData}
                                    className="bg-background"
                                  />
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
                                  <Input
                                    {...field}
                                    disabled={!isEditingData}
                                    className="bg-background"
                                  />
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
                </TabsContent>

                <TabsContent value="seguranca" className="m-0 space-y-8 max-w-4xl">
                  {!employee?.user_id ? (
                    <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
                      <SectionTitle title="CONTA DE ACESSO" icon={Key} />
                      {!isGenerateAccessMode ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Shield className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                          <h3 className="text-lg font-bold text-nuvia-navy mb-2">
                            CONTA NÃO VINCULADA
                          </h3>
                          <p className="text-muted-foreground text-sm text-center max-w-md mb-6">
                            ESTE COLABORADOR NÃO POSSUI ACESSO AO SISTEMA VINCULADO.
                          </p>
                          <Button
                            type="button"
                            onClick={() => setIsGenerateAccessMode(true)}
                            className="bg-nuvia-gold hover:bg-nuvia-gold/90 text-nuvia-navy font-bold"
                          >
                            <Key className="w-4 h-4 mr-2" /> GERAR ACESSO
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">E-MAIL (LOGIN) *</label>
                            <Input
                              value={genEmail}
                              onChange={(e) => setGenEmail(e.target.value)}
                              disabled={isGenerating}
                              type="email"
                              className="lowercase"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">SENHA PROVISÓRIA *</label>
                            <Input
                              value={genPass}
                              onChange={(e) => setGenPass(e.target.value)}
                              disabled={isGenerating}
                              type="text"
                              minLength={6}
                            />
                          </div>
                          <div className="flex justify-end gap-3 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsGenerateAccessMode(false)}
                              disabled={isGenerating}
                            >
                              CANCELAR
                            </Button>
                            <Button
                              type="button"
                              onClick={handleGenerateAccess}
                              disabled={isGenerating || !genEmail || !genPass}
                              className="bg-nuvia-gold hover:bg-nuvia-gold/90 text-nuvia-navy font-bold"
                            >
                              {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{' '}
                              CONFIRMAR GERAÇÃO DE ACESSO
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
                      <SectionTitle title="CREDENCIAIS DE ACESSO" icon={Key} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>USERNAME DE ACESSO</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="bg-background"
                                  placeholder="EX: JOAO.SILVA"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>NOVA SENHA</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    type={showNewPassword ? 'text' : 'password'}
                                    {...field}
                                    className="bg-background pr-10"
                                    placeholder="••••••••"
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CONFIRMAR NOVA SENHA</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...field}
                                    className="bg-background pr-10"
                                    placeholder="••••••••"
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        <Shield className="w-4 h-4 inline-block mr-1 mb-0.5" />
                        AS ALTERAÇÕES DE SENHA REFLETIRÃO NO PRÓXIMO LOGIN DO COLABORADOR.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </div>

              <div className="p-6 bg-white border-t flex justify-end gap-3 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || (!isEditingData && !form.formState.isDirty)}
                  className="bg-nuvia-gold hover:bg-nuvia-gold/90 text-nuvia-navy font-bold"
                >
                  {isLoading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                </Button>
              </div>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
