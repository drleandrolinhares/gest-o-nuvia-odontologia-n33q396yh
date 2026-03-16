import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import useAppStore from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { Plus, Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().min(1, 'OBRIGATÓRIO'),
  username: z.string().optional(),
  teamCategory: z.array(z.string()).min(1, 'SELECIONE AO MENOS UMA'),
  role: z.string().min(1, 'OBRIGATÓRIO'),
  department: z.string().min(1, 'OBRIGATÓRIO'),
  email: z.string().email('INVÁLIDO').min(1, 'OBRIGATÓRIO'),
  password: z.string().min(6, 'MÍN. 6 CARACTERES'),
  phone: z.string().min(1, 'OBRIGATÓRIO'),
  salary: z.string().min(1, 'OBRIGATÓRIO'),
  hireDate: z.string().min(1, 'OBRIGATÓRIO'),
  vacationDueDate: z.string().min(1, 'OBRIGATÓRIO'),
  contractDetails: z.string().optional(),
})
type FormValues = z.infer<typeof formSchema>

export function AddEmployeeDialog({
  triggerText = 'ADICIONAR COLABORADOR',
  customTrigger,
}: {
  triggerText?: string
  customTrigger?: React.ReactNode
}) {
  const { addEmployee, departments, roles } = useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      teamCategory: ['COLABORADOR'],
      role: '',
      department: '',
      email: '',
      password: '',
      phone: '',
      salary: '',
      hireDate: new Date().toISOString().split('T')[0],
      vacationDueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
      contractDetails: '',
    },
  })

  const onSubmit = async (v: FormValues) => {
    setIsLoading(true)

    // Data Consistency Check: Verify role exists in the database
    const exactRole = roles.find((r) => r.name.toUpperCase() === v.role.toUpperCase())
    if (!exactRole) {
      toast({
        variant: 'destructive',
        title: 'Erro de Validação',
        description:
          'A função selecionada não existe no banco de dados. Adicione-a em Configurações > Permissões primeiro.',
      })
      setIsLoading(false)
      return
    }

    const res = await addEmployee({
      ...v,
      role: exactRole.name, // Ensure exact match with DB for Reference Integrity
      status: 'Ativo',
      vacationDaysTaken: 0,
      vacationDaysTotal: 30,
    })
    setIsLoading(false)

    if (res.success) {
      toast({ title: 'Sucesso', description: 'Colaborador e conta de acesso criados com sucesso!' })
      setOpen(false)
      form.reset()
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: res.error?.message || 'Falha ao registrar colaborador.',
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) form.reset()
      }}
    >
      <DialogTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button className="uppercase">
            <Plus className="h-4 w-4 mr-2" /> {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 flex flex-col max-h-[90vh] overflow-hidden uppercase">
        <DialogHeader className="px-6 py-4 border-b shrink-0 bg-background">
          <DialogTitle>NOVO COLABORADOR / USUÁRIO</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>NOME COMPLETO</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamCategory"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>FUNÇÕES PROFISSIONAIS</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              disabled={isLoading}
                              className={cn(
                                'w-full justify-between',
                                !field.value?.length && 'text-muted-foreground',
                              )}
                            >
                              {field.value?.length > 0 ? field.value.join(', ') : 'SELECIONE...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
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
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FUNÇÃO</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="SELECIONE..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[...roles]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((r) => (
                              <SelectItem key={r.id} value={r.name}>
                                {r.name.toUpperCase()}
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
                      <FormLabel>DEPARTAMENTO</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
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
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SALÁRIO / REMUNERAÇÃO</FormLabel>
                      <FormControl>
                        <Input placeholder="R$" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contractDetails"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>RELAÇÕES E ACORDOS COM A EMPRESA</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="INFORMAÇÕES SOBRE CONTRATOS, COMISSÕES E ACORDOS ESPECÍFICOS..."
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 border-t border-dashed mt-4 space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground">
                  DADOS DE ACESSO E CONTATO
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-MAIL</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} disabled={isLoading} />
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
                        <FormLabel>NOME DE USUÁRIO</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SENHA PROVISÓRIA</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} disabled={isLoading} />
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
                          <Input {...field} disabled={isLoading} />
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
                        <FormLabel>ADMISSÃO / INÍCIO</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-background shrink-0 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                CANCELAR
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                SALVAR COLABORADOR
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
