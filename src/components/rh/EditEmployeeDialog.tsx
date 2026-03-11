import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import useAppStore, { Employee } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'

const PERMISSIONS_DEF = [
  {
    module: 'agenda',
    label: 'AGENDA',
    actions: [
      { id: 'incluir_compromisso', label: 'INCLUIR NOVO COMPROMISSO' },
      { id: 'selecionar_filtro', label: 'SELECIONAR FILTRO' },
      { id: 'clicar_calendario', label: 'CLICAR NO CALENDARIO' },
      { id: 'editar_compromisso', label: 'EDITAR COMPROMISSO' },
      { id: 'excluir_compromisso', label: 'EXCLUIR COMPROMISSO' },
    ],
  },
  {
    module: 'estoque',
    label: 'ESTOQUE',
    actions: [
      { id: 'adicionar_item', label: 'ADICIONAR ITEM' },
      { id: 'editar_item', label: 'EDITAR ITEM' },
      { id: 'remover_item', label: 'REMOVER ITEM' },
      { id: 'registrar_movimentacao', label: 'REGISTRAR ENTRADA/SAIDA' },
      { id: 'visualizar_custos', label: 'VISUALIZAR NOTAS E CUSTOS' },
    ],
  },
  {
    module: 'colaboradores',
    label: 'COLABORADORES',
    actions: [
      { id: 'visualizar_lista', label: 'VISUALIZAR LISTA' },
      { id: 'editar_colaborador', label: 'EDITAR COLABORADOR' },
      { id: 'criar_colaborador', label: 'CRIAR NOVO COLABORADOR' },
      { id: 'gerenciar_permissoes', label: 'GERENCIAR PERMISSÕES' },
      { id: 'excluir_colaborador', label: 'EXCLUIR COLABORADOR' },
    ],
  },
  {
    module: 'fornecedores',
    label: 'FORNECEDORES',
    actions: [
      { id: 'visualizar_fornecedores', label: 'VISUALIZAR FORNECEDORES' },
      { id: 'criar_fornecedor', label: 'CRIAR FORNECEDOR' },
      { id: 'editar_fornecedor', label: 'EDITAR FORNECEDOR' },
      { id: 'ver_notas', label: 'VER NOTAS DE NEGOCIAÇÃO' },
    ],
  },
  {
    module: 'acessos',
    label: 'ACESSOS',
    actions: [
      { id: 'visualizar_logins', label: 'VISUALIZAR LOGINS/SENHAS' },
      { id: 'criar_acesso', label: 'CRIAR NOVO ACESSO' },
      { id: 'editar_acesso', label: 'EDITAR ACESSO' },
    ],
  },
  {
    module: 'documentos',
    label: 'DOCUMENTOS',
    actions: [
      { id: 'visualizar_documentos', label: 'VISUALIZAR DOCUMENTOS' },
      { id: 'adicionar_documento', label: 'ADICIONAR DOCUMENTO' },
    ],
  },
]

const formSchema = z.object({
  name: z.string().min(1, 'OBRIGATÓRIO'),
  role: z.string().min(1, 'OBRIGATÓRIO'),
  department: z.string().min(1, 'OBRIGATÓRIO'),
  email: z.string().email('INVÁLIDO').or(z.literal('')),
  phone: z.string().optional(),
  salary: z.string().optional(),
  hireDate: z.string().optional(),
  status: z.enum(['Ativo', 'Férias', 'Aviso Prévio', 'Desligado']),
  accessLevel: z.enum(['OPERACIONAL', 'GERENCIAL', 'ESTRATEGICO']),
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
  const { updateEmployee, departments, can, isAdmin } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const canManagePerms = isAdmin || can('colaboradores', 'gerenciar_permissoes')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
      department: '',
      email: '',
      phone: '',
      salary: '',
      hireDate: '',
      status: 'Ativo',
      accessLevel: 'OPERACIONAL',
      permissions: {},
    },
  })

  useEffect(() => {
    if (open && employee) {
      form.reset({
        name: employee.name || '',
        role: employee.role || '',
        department: employee.department || '',
        email: employee.email || '',
        phone: employee.phone || '',
        salary: employee.salary || '',
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
        status: employee.status || 'Ativo',
        accessLevel: employee.accessLevel || 'OPERACIONAL',
        permissions: employee.permissions || {},
      })
    }
  }, [open, employee, form])

  const onSubmit = async (v: FormValues) => {
    if (!employee) return
    setIsLoading(true)

    try {
      const res = await updateEmployee(employee.id, {
        name: v.name,
        role: v.role,
        department: v.department,
        email: v.email,
        phone: v.phone,
        salary: v.salary,
        hireDate: v.hireDate ? new Date(v.hireDate).toISOString() : undefined,
        status: v.status,
        accessLevel: v.accessLevel,
        permissions: v.permissions,
      })

      if (res.success) {
        toast({
          title: 'Sucesso',
          description: 'Colaborador atualizado com sucesso.',
        })
        onOpenChange(false)
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao atualizar colaborador.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
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
      <DialogContent className="max-w-2xl uppercase">
        <DialogHeader>
          <DialogTitle>EDITAR COLABORADOR</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="dados" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="dados" className="uppercase">
                  DADOS GERAIS
                </TabsTrigger>
                {canManagePerms && (
                  <TabsTrigger value="permissoes" className="uppercase">
                    PERMISSÕES
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="dados" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NOME COMPLETO</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FUNÇÃO</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DEPARTAMENTO</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="SELECIONE..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...departments].sort().map((d) => (
                              <SelectItem key={d} value={d}>
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>STATUS</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="SELECIONE..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Ativo">ATIVO</SelectItem>
                            <SelectItem value="Férias">FÉRIAS</SelectItem>
                            <SelectItem value="Aviso Prévio">AVISO PRÉVIO</SelectItem>
                            <SelectItem value="Desligado">DESLIGADO</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accessLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NÍVEL DE ACESSO SISTEMA</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="SELECIONE..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="OPERACIONAL">OPERACIONAL</SelectItem>
                            <SelectItem value="GERENCIAL">GERENCIAL</SelectItem>
                            <SelectItem value="ESTRATEGICO">ESTRATEGICO</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-MAIL</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
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
                        <FormLabel>TELEFONE</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SALÁRIO</FormLabel>
                        <FormControl>
                          <Input placeholder="R$" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hireDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DATA ADMISSÃO</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {canManagePerms && (
                <TabsContent value="permissoes">
                  <div className="grid gap-4 sm:grid-cols-2 max-h-[50vh] overflow-y-auto pr-2 pb-2">
                    {PERMISSIONS_DEF.map((mod) => (
                      <Card key={mod.module} className="shadow-sm">
                        <CardHeader className="py-3 px-4 bg-muted/30 border-b">
                          <CardTitle className="text-sm uppercase font-bold text-primary">
                            {mod.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
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
                                    form.setValue(`permissions.${mod.module}`, [...current, act.id])
                                  } else {
                                    form.setValue(
                                      `permissions.${mod.module}`,
                                      current.filter((id) => id !== act.id),
                                    )
                                  }
                                }}
                              />
                              <label
                                htmlFor={`perm-${mod.module}-${act.id}`}
                                className="text-xs font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 uppercase cursor-pointer"
                              >
                                {act.label}
                              </label>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>

            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                CANCELAR
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
