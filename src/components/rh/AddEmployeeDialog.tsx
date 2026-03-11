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
import useAppStore from '@/stores/main'
import { Plus } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, 'OBRIGATÓRIO'),
  username: z.string().optional(),
  role: z.string().min(1, 'OBRIGATÓRIO'),
  department: z.string().min(1, 'OBRIGATÓRIO'),
  email: z.string().email('INVÁLIDO').min(1, 'OBRIGATÓRIO'),
  password: z.string().min(6, 'MÍN. 6 CARACTERES'),
  phone: z.string().min(1, 'OBRIGATÓRIO'),
  salary: z.string().min(1, 'OBRIGATÓRIO'),
  hireDate: z.string().min(1, 'OBRIGATÓRIO'),
  vacationDueDate: z.string().min(1, 'OBRIGATÓRIO'),
  accessLevel: z.enum(['OPERACIONAL', 'GERENCIAL', 'ESTRATEGICO']),
})
type FormValues = z.infer<typeof formSchema>

export function AddEmployeeDialog({
  triggerText = 'ADICIONAR COLABORADOR',
  customTrigger,
}: {
  triggerText?: string
  customTrigger?: React.ReactNode
}) {
  const { addEmployee, departments } = useAppStore()
  const [open, setOpen] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      role: '',
      department: '',
      email: '',
      password: '',
      phone: '',
      salary: '',
      accessLevel: 'OPERACIONAL',
      hireDate: new Date().toISOString().split('T')[0],
      vacationDueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
    },
  })

  const onSubmit = (v: FormValues) => {
    addEmployee({
      ...v,
      status: 'Ativo',
      vacationDaysTaken: 0,
      vacationDaysTotal: 30,
      agendaAccess: 'VIEW_ONLY',
      permissions: {},
      systemProfiles: [],
    })
    setOpen(false)
    form.reset()
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
      <DialogContent className="max-w-lg uppercase">
        <DialogHeader>
          <DialogTitle>NOVO COLABORADOR / USUÁRIO</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
          >
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NOME DE USUÁRIO</FormLabel>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SENHA PROVISÓRIA</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NÍVEL DE ACESSO</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </div>
            <FormField
              control={form.control}
              name="hireDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ADMISSÃO</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                CANCELAR
              </Button>
              <Button type="submit">SALVAR COLABORADOR</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
