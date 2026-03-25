import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useAppStore, { type Employee } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Phone, Mail } from 'lucide-react'
import { SecurityTab } from './edit/SecurityTab'
import { EditEmployeePersonalTab } from './edit/EditEmployeePersonalTab'

const formSchema = z
  .object({
    name: z.string().min(1, 'Obrigatório'),
    username: z.string().optional(),
    role: z.string().min(1, 'Obrigatório'),
    department: z.string().min(1, 'Obrigatório'),
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
    pixNumber: z.string().optional(),
    pixType: z.string().optional(),
    bankName: z.string().optional(),
    noSystemAccess: z.boolean().default(false),
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
  const { updateEmployee, updateEmployeePassword, bonusTypes, roles, departments, isAdmin } =
    useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditingData, setIsEditingData] = useState(false)
  const [activeTab, setActiveTab] = useState(defaultTab)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      role: '',
      department: '',
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
      pixNumber: '',
      pixType: '',
      bankName: '',
      noSystemAccess: false,
    },
  })

  useEffect(() => {
    if (open) {
      if (employee) {
        form.reset({
          name: employee.name || '',
          username: employee.username || '',
          role: employee.role || '',
          department: employee.department || '',
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
          pixNumber: employee.pixNumber || '',
          pixType: employee.pixType || '',
          bankName: employee.bankName || '',
          noSystemAccess: employee.noSystemAccess || false,
        })
        setIsEditingData(startInEditMode)
        setActiveTab(defaultTab)
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
                  <EditEmployeePersonalTab form={form} isEditingData={isEditingData} />
                </TabsContent>

                <SecurityTab
                  control={form.control}
                  isEditingData={isEditingData}
                  employee={employee}
                />
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
