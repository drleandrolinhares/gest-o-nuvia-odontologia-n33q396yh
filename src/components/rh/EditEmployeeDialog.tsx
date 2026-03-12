import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import useAppStore, { Employee } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Phone, Mail, Search, Key, Shield, Eye, EyeOff } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PERMISSIONS_DEF = [
  {
    module: 'agenda',
    label: 'Agenda',
    actions: [
      { id: 'incluir_compromisso', label: 'Incluir novo compromisso' },
      { id: 'selecionar_filtro', label: 'Selecionar filtro' },
      { id: 'clicar_calendario', label: 'Clicar no calendário' },
      { id: 'editar_compromisso', label: 'Editar compromisso' },
      { id: 'excluir_compromisso', label: 'Excluir compromisso' },
    ],
  },
  {
    module: 'estoque',
    label: 'Estoque',
    actions: [
      { id: 'adicionar_item', label: 'Adicionar item' },
      { id: 'editar_quantidade', label: 'Editar quantidade' },
      { id: 'baixar_material', label: 'Baixar material' },
      { id: 'visualizar_custos', label: 'Visualizar notas e custos' },
    ],
  },
  {
    module: 'colaboradores',
    label: 'Colaboradores',
    actions: [
      { id: 'visualizar_lista', label: 'Visualizar lista' },
      { id: 'editar_cadastro', label: 'Editar cadastro' },
      { id: 'gerir_permissoes', label: 'Gerir permissões' },
    ],
  },
  {
    module: 'fornecedores',
    label: 'Fornecedores',
    actions: [
      { id: 'visualizar_fornecedores', label: 'Visualizar fornecedores' },
      { id: 'criar_fornecedor', label: 'Criar fornecedor' },
      { id: 'editar_fornecedor', label: 'Editar fornecedor' },
      { id: 'ver_notas', label: 'Ver notas de negociação' },
    ],
  },
  {
    module: 'acessos',
    label: 'Acessos',
    actions: [
      { id: 'visualizar_logins', label: 'Visualizar logins/senhas' },
      { id: 'criar_acesso', label: 'Criar novo acesso' },
      { id: 'editar_acesso', label: 'Editar acesso' },
    ],
  },
]

const PROFILES_DEF = [
  {
    id: 'Administrador',
    title: 'Administrador',
    desc: 'Coordenar as operações diárias da clínica, organizando a equipe e configurando o sistema. Gerenciar usuários, agendas, fluxos e relatórios.',
  },
  {
    id: 'Auxiliar Técnico',
    title: 'Auxiliar Técnico',
    desc: 'Apoiar os profissionais, organizar materiais, gerenciar o estoque e preparar o ambiente clínico. Acesso restrito a informações de pacientes.',
  },
  {
    id: 'Financeiro',
    title: 'Financeiro',
    desc: 'Controlar as receitas, despesas e o faturamento. Acesso exclusivo a relatórios financeiros e monitoramento de cobranças.',
  },
  {
    id: 'Gestor de Relacionamento',
    title: 'Gestor de Relacionamento',
    desc: 'Monitorar a experiência dos pacientes e promover ações de engajamento. Acesso a ferramentas de comunicação e indicadores.',
  },
  {
    id: 'Profissional',
    title: 'Profissional',
    desc: 'Responsáveis pelos atendimentos clínicos, elaboração de diagnósticos e acompanhamento. Possui acesso a prontuários e agenda.',
  },
  {
    id: 'Recepcionista',
    title: 'Recepcionista',
    desc: 'Recepcionar pacientes, organizar agendas e realizar confirmações de consultas. Acesso às funcionalidades administrativas básicas.',
  },
]

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
    accessSchedule: z.boolean().default(false),
    systemProfiles: z.array(z.string()).default([]),
    permissions: z.record(z.array(z.string())).optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
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

export function EditEmployeeDialog({
  employee,
  open,
  onOpenChange,
  defaultTab = 'dados',
}: {
  employee: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: string
}) {
  const { updateEmployee, updateEmployeePassword, can, isAdmin } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditingData, setIsEditingData] = useState(false)
  const [activeTab, setActiveTab] = useState(defaultTab)

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const canManagePerms = isAdmin || can('colaboradores', 'gerir_permissoes')

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
      accessSchedule: false,
      systemProfiles: [],
      permissions: {},
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (open && employee) {
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
        accessSchedule: employee.accessSchedule || false,
        systemProfiles: employee.systemProfiles || [],
        permissions: employee.permissions || {},
        newPassword: '',
        confirmPassword: '',
      })
      setIsEditingData(false)
      setActiveTab(defaultTab)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } else {
      setIsEditingData(true)
    }
  }, [open, employee, form, defaultTab])

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
          description: passRes.error?.message || 'Erro ao atualizar dados.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Ocorreu um erro inesperado.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAllProfiles = () => {
    form.setValue(
      'systemProfiles',
      PROFILES_DEF.map((p) => p.id),
      { shouldDirty: true },
    )
  }

  const handleSelectAllPermissions = (module: string, actions: any[]) => {
    form.setValue(
      `permissions.${module}`,
      actions.map((a) => a.id),
      { shouldDirty: true },
    )
  }

  const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: any }) => (
    <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0">
      {Icon && <Icon className="w-5 h-5 text-[#f26522]" />}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) form.reset()
      }}
    >
      <DialogContent className="max-w-5xl p-0 max-h-[90vh] flex flex-col overflow-hidden bg-[#f9fafb]">
        <DialogHeader className="p-6 pb-0 sr-only shrink-0">
          <DialogTitle>Editar Colaborador</DialogTitle>
        </DialogHeader>

        {employee && (
          <div className="bg-white border-b px-8 py-6 flex items-center gap-6 shrink-0">
            <Avatar className="h-20 w-20 bg-muted">
              <AvatarFallback className="text-2xl text-muted-foreground">
                <User className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {employee.username || 'Não informado'}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {employee.phone || 'Não informado'}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {employee.email || 'Não informado'}
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
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#f26522] data-[state=active]:text-[#f26522] rounded-none px-0 pb-3 text-base font-semibold"
                  >
                    Dados Pessoais
                  </TabsTrigger>
                  {canManagePerms && (
                    <TabsTrigger
                      value="seguranca"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#f26522] data-[state=active]:text-[#f26522] rounded-none px-0 pb-3 text-base font-semibold"
                    >
                      Segurança e Acesso
                    </TabsTrigger>
                  )}
                  {canManagePerms && (
                    <TabsTrigger
                      value="perfil"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#f26522] data-[state=active]:text-[#f26522] rounded-none px-0 pb-3 text-base font-semibold"
                    >
                      Perfil de Usuário
                    </TabsTrigger>
                  )}
                  {canManagePerms && (
                    <TabsTrigger
                      value="permissoes"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#f26522] data-[state=active]:text-[#f26522] rounded-none px-0 pb-3 text-base font-semibold"
                    >
                      Config. de permissão
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-8 relative">
                {activeTab === 'dados' && (
                  <div className="absolute right-8 top-8 z-10">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#f26522] text-[#f26522] hover:bg-[#f26522]/10"
                      onClick={() => setIsEditingData(!isEditingData)}
                    >
                      {isEditingData ? 'Bloquear Edição' : 'Editar'}
                    </Button>
                  </div>
                )}

                <TabsContent value="dados" className="m-0 space-y-0">
                  <div className="space-y-8 max-w-4xl">
                    <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
                      <SectionTitle title="Informações Básicas" icon={User} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo *</FormLabel>
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
                              <FormLabel>Email *</FormLabel>
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
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone *</FormLabel>
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
                      <SectionTitle title="Informações Pessoais" icon={User} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Nascimento</FormLabel>
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
                      <SectionTitle title="Endereço" icon={User} />
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
                                <FormLabel>Endereço</FormLabel>
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
                                <FormLabel>Número</FormLabel>
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
                                <FormLabel>Complemento</FormLabel>
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
                                <FormLabel>Cidade</FormLabel>
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
                                <FormLabel>Estado</FormLabel>
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

                {canManagePerms && (
                  <TabsContent value="seguranca" className="m-0 space-y-8 max-w-4xl">
                    <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
                      <SectionTitle title="Credenciais de Acesso" icon={Key} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Username de Acesso</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="bg-background"
                                  placeholder="Ex: joao.silva"
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
                              <FormLabel>Nova Senha</FormLabel>
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
                              <FormLabel>Confirmar Nova Senha</FormLabel>
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
                        As alterações de senha refletirão no próximo login do colaborador.
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
                      <SectionTitle title="Controle de Horário de Acesso" icon={Key} />
                      <FormField
                        control={form.control}
                        name="accessSchedule"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/10">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base font-semibold">
                                Restringir acesso ao sistema fora do expediente
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Quando ativado, o usuário não conseguirá logar na plataforma fora do
                                horário de trabalho configurado.
                              </p>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                )}

                {canManagePerms && (
                  <TabsContent value="perfil" className="m-0">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold">Perfil de Usuário</h3>
                        <p className="text-muted-foreground text-sm">
                          Selecione o perfil que melhor se enquadra às responsabilidades para este
                          usuário.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAllProfiles}
                        className="shrink-0 border-[#f26522] text-[#f26522] hover:bg-[#f26522]/10"
                      >
                        MARCAR TODAS
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {PROFILES_DEF.map((profile) => (
                        <Card
                          key={profile.id}
                          className={`cursor-pointer transition-colors ${form.watch('systemProfiles').includes(profile.id) ? 'border-[#f26522] bg-[#f26522]/5' : 'hover:border-muted-foreground/30'}`}
                          onClick={() => {
                            const current = form.getValues('systemProfiles')
                            if (current.includes(profile.id)) {
                              form.setValue(
                                'systemProfiles',
                                current.filter((id) => id !== profile.id),
                                { shouldDirty: true },
                              )
                            } else {
                              form.setValue('systemProfiles', [...current, profile.id], {
                                shouldDirty: true,
                              })
                            }
                          }}
                        >
                          <CardContent className="p-6 flex gap-4 relative">
                            <div className="mt-1">
                              <User
                                className={`w-6 h-6 ${form.watch('systemProfiles').includes(profile.id) ? 'text-[#f26522]' : 'text-muted-foreground'}`}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-foreground mb-1">{profile.title}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                                {profile.desc}
                              </p>
                            </div>
                            <div className="absolute right-6 top-6">
                              <Checkbox
                                checked={form.watch('systemProfiles').includes(profile.id)}
                                onCheckedChange={() => {}}
                                className="data-[state=checked]:bg-[#f26522] data-[state=checked]:border-[#f26522]"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {canManagePerms && (
                  <TabsContent value="permissoes" className="m-0 space-y-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold">Permissões Específicas</h3>
                      <p className="text-muted-foreground text-sm">
                        Ajuste os acessos pontuais para cada módulo do sistema.
                      </p>
                    </div>
                    <div className="columns-1 xl:columns-2 gap-6 space-y-6">
                      {PERMISSIONS_DEF.map((mod) => (
                        <div
                          key={mod.module}
                          className="bg-white border rounded-xl overflow-hidden break-inside-avoid"
                        >
                          <div className="bg-muted/30 px-6 py-3 border-b font-bold text-foreground flex justify-between items-center">
                            <span>{mod.label}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs px-2 hover:text-[#f26522]"
                              onClick={() => handleSelectAllPermissions(mod.module, mod.actions)}
                            >
                              MARCAR TODAS
                            </Button>
                          </div>
                          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {mod.actions.map((act) => (
                              <div key={act.id} className="flex items-center space-x-3">
                                <Checkbox
                                  id={`perm-${mod.module}-${act.id}`}
                                  checked={
                                    form.watch(`permissions.${mod.module}`)?.includes(act.id) ||
                                    false
                                  }
                                  onCheckedChange={(checked) => {
                                    const current = form.watch(`permissions.${mod.module}`) || []
                                    if (checked) {
                                      form.setValue(
                                        `permissions.${mod.module}`,
                                        [...current, act.id],
                                        { shouldDirty: true },
                                      )
                                    } else {
                                      form.setValue(
                                        `permissions.${mod.module}`,
                                        current.filter((id) => id !== act.id),
                                        { shouldDirty: true },
                                      )
                                    }
                                  }}
                                  className="data-[state=checked]:bg-[#f26522] data-[state=checked]:border-[#f26522]"
                                />
                                <label
                                  htmlFor={`perm-${mod.module}-${act.id}`}
                                  className="text-sm font-medium leading-none cursor-pointer"
                                >
                                  {act.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </div>

              <div className="p-6 bg-white border-t flex justify-end gap-3 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || (!isEditingData && !form.formState.isDirty)}
                  className="bg-[#f26522] hover:bg-[#d9531e] text-white"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
