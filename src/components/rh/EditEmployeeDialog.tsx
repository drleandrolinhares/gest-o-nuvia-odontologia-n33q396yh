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
import useAppStore, { Employee } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  name: z.string().min(1, 'OBRIGATÓRIO'),
  role: z.string().min(1, 'OBRIGATÓRIO'),
  department: z.string().min(1, 'OBRIGATÓRIO'),
  email: z.string().email('INVÁLIDO').or(z.literal('')),
  phone: z.string().optional(),
  salary: z.string().optional(),
  hireDate: z.string().optional(),
  status: z.enum(['Ativo', 'Férias', 'Aviso Prévio', 'Desligado']),
  accessLevel: z.enum(['OPERACIONAL', 'ADMINISTRATIVO']),
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
  const { updateEmployee, departments } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

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
                        <SelectItem value="ADMINISTRATIVO">ADMINISTRATIVO</SelectItem>
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

            <div className="flex justify-end gap-3 pt-4">
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
