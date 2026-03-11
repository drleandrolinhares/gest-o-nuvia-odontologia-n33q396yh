import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useAppStore from '@/stores/main'
import { Plus } from 'lucide-react'

export function AddEmployeeDialog() {
  const { addEmployee, departments } = useAppStore()
  const [open, setOpen] = useState(false)

  const defaultState = {
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    salary: '',
    hireDate: new Date().toISOString().split('T')[0],
    vacationDueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split('T')[0],
  }

  const [formData, setFormData] = useState(defaultState)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addEmployee({
      ...formData,
      status: 'Ativo',
      vacationDaysTaken: 0,
      vacationDaysTotal: 30,
    })
    setOpen(false)
    setFormData(defaultState)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Adicionar Colaborador
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Colaborador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Input
                id="role"
                required
                value={formData.role}
                onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select
                required
                value={formData.department}
                onValueChange={(val) => setFormData((p) => ({ ...p, department: val }))}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                  {departments.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Nenhum departamento cadastrado
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salário Bruto</Label>
              <Input
                id="salary"
                required
                placeholder="R$ 0,00"
                value={formData.salary}
                onChange={(e) => setFormData((p) => ({ ...p, salary: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hireDate">Data de Admissão</Label>
              <Input
                id="hireDate"
                type="date"
                required
                value={formData.hireDate}
                onChange={(e) => setFormData((p) => ({ ...p, hireDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vacationDueDate">Venc. de Férias</Label>
              <Input
                id="vacationDueDate"
                type="date"
                required
                value={formData.vacationDueDate}
                onChange={(e) => setFormData((p) => ({ ...p, vacationDueDate: e.target.value }))}
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar e Iniciar Onboarding</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
