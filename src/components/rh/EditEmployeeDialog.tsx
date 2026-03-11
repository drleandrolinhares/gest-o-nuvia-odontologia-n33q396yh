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
import { User, Phone, Mail, Search } from 'lucide-react'
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
    desc: 'Este perfil é responsável por coordenar as operações diárias da clínica, organizando a equipe e configurando o sistema. Possui permissões para gerenciar usuários, agendas, fluxos internos e relatórios operacionais.',
  },
  {
    id: 'Auxiliar Técnico',
    title: 'Auxiliar Técnico',
    desc: 'Este perfil é voltado para apoiar os profissionais durante os atendimentos, organizar materiais, gerenciar o estoque e preparar o ambiente clínico. Possui acesso restrito a informações de pacientes.',
  },
  {
    id: 'Financeiro',
    title: 'Financeiro',
    desc: 'Este perfil é responsável por controlar as receitas, despesas e o faturamento da clínica. Com foco nas operações financeiras, tem acesso exclusivo a relatórios financeiros e monitoramento de cobranças.',
  },
  {
    id: 'Gestor de Relacionamento',
    title: 'Gestor de Relacionamento',
    desc: 'Este perfil é responsável por monitorar a experiência dos pacientes, promovendo ações de engajamento e fidelização. Possui acesso a ferramentas de comunicação e indicadores de satisfação.',
  },
  {
    id: 'Profissional',
    title: 'Profissional',
    desc: 'Este perfil é voltado para os responsáveis pelos atendimentos clínicos, elaboração de diagnósticos e acompanhamento da evolução dos pacientes. Possui acesso a prontuários e agenda.',
  },
  {
    id: 'Recepcionista',
    title: 'Recepcionista',
    desc: 'Este perfil é responsável por recepcionar pacientes, organizar agendas e realizar confirmações de consultas. Possui acesso às funcionalidades administrativas básicas.',
  },
]

const formSchema = z.object({
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
})

type FormValues = z.infer<typeof formSchema>

export function EditEmployeeDialog({
  employee,
  open,
  onOpenChange,
}: {
  employee: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { updateEmployee, can, isAdmin } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditingData, setIsEditingData] = useState(false)

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
      })
      setIsEditingData(false)
    } else {
      setIsEditingData(true)
    }
  }, [open, employee, form])

  const onSubmit = async (v: FormValues) => {
    if (!employee) return
    setIsLoading(true)
    try {
      const res = await updateEmployee(employee.id, v)
      if (res.success) {
        toast({ title: 'Sucesso', description: 'Dados atualizados com sucesso.' })
        onOpenChange(false)
      } else {
        toast({ title: 'Erro', description: 'Erro ao atualizar dados.', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Erro', description: 'Ocorreu um erro inesperado.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
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
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-[#f9fafb]">
        <DialogHeader className="p-6 pb-0 sr-only">
          <DialogTitle>Editar Colaborador</DialogTitle>
        </DialogHeader>

        {employee && (
          <div className="bg-white border-b px-8 py-6 flex items-center gap-6">
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
            className="flex flex-col h-[calc(100vh-200px)] max-h-[800px]"
          >
            <Tabs defaultValue="dados" className="flex-1 flex flex-col">
              <div className="px-8 bg-white border-b pt-2">
                <TabsList className="bg-transparent h-auto p-0 flex gap-6">
                  <TabsTrigger
                    value="dados"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#f26522] data-[state=active]:text-[#f26522] rounded-none px-0 pb-3 text-base font-semibold"
                  >
                    Dados Pessoais
                  </TabsTrigger>
                  <TabsTrigger
                    value="perfil"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#f26522] data-[state=active]:text-[#f26522] rounded-none px-0 pb-3 text-base font-semibold"
                  >
                    Perfil de Usuário
                  </TabsTrigger>
                  {canManagePerms && (
                    <TabsTrigger
                      value="permissoes"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#f26522] data-[state=active]:text-[#f26522] rounded-none px-0 pb-3 text-base font-semibold"
                    >
                      Configurações de permissão
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <TabsContent value="dados" className="m-0 space-y-0 relative">
                  <div className="absolute right-0 top-0">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#f26522] text-[#f26522] hover:bg-[#f26522]/10"
                      onClick={() => setIsEditingData(!isEditingData)}
                    >
                      {isEditingData ? 'Bloquear Edição' : 'Editar'}
                    </Button>
                  </div>

                  <div className="space-y-8 max-w-4xl">
                    <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
                      <SectionTitle title="Informações Básicas" icon={User} />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Usuário *</FormLabel>
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

                    <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
                      <SectionTitle title="Controle de Horário de Acesso no Sistema" icon={User} />
                      <FormField
                        control={form.control}
                        name="accessSchedule"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Definir horário de acesso ao sistema
                              </FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!isEditingData}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="perfil" className="m-0">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold">Perfil de Usuário</h3>
                    <p className="text-muted-foreground text-sm">
                      Selecione o perfil que melhor se enquadra às responsabilidades para este novo
                      usuário:
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <span className="text-xs font-semibold text-[#f26522] flex items-center gap-1 hover:underline">
                              <User className="w-3 h-3" /> Permissões padrão do sistema
                            </span>
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

                {canManagePerms && (
                  <TabsContent value="permissoes" className="m-0 space-y-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold">Permissões Específicas</h3>
                      <p className="text-muted-foreground text-sm">
                        Ajuste os acessos pontuais para cada módulo do sistema.
                      </p>
                    </div>
                    {PERMISSIONS_DEF.map((mod) => (
                      <div key={mod.module} className="bg-white border rounded-xl overflow-hidden">
                        <div className="bg-muted/30 px-6 py-3 border-b font-bold text-foreground">
                          {mod.label}
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mod.actions.map((act) => (
                            <div key={act.id} className="flex items-center space-x-3">
                              <Checkbox
                                id={`perm-${mod.module}-${act.id}`}
                                checked={
                                  form.watch(`permissions.${mod.module}`)?.includes(act.id) || false
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
