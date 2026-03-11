import { useState } from 'react'
import { EmployeeTable } from '@/components/EmployeeTable'
import { AddEmployeeDialog } from './AddEmployeeDialog'
import useAppStore from '@/stores/main'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TeamTab() {
  const { employees } = useAppStore()
  const [statusFilter, setStatusFilter] = useState('TODOS')

  const filteredEmployees = employees.filter((e) => {
    if (statusFilter === 'ATIVOS') return e.status !== 'Desligado'
    if (statusFilter === 'DESLIGADOS') return e.status === 'Desligado'
    return true
  })

  return (
    <div className="space-y-4 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-5 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-foreground uppercase">
            QUADRO DE FUNCIONÁRIOS
          </h2>
          <p className="text-sm text-muted-foreground uppercase">
            GERENCIE A EQUIPE ATUAL DA CLÍNICA E ADICIONE NOVOS COLABORADORES.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[220px] uppercase">
              <SelectValue placeholder="FILTRAR POR STATUS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS" className="uppercase">
                TODOS OS COLABORADORES
              </SelectItem>
              <SelectItem value="ATIVOS" className="uppercase">
                SOMENTE ATIVOS
              </SelectItem>
              <SelectItem value="DESLIGADOS" className="uppercase">
                DESLIGADOS DA EMPRESA
              </SelectItem>
            </SelectContent>
          </Select>
          <AddEmployeeDialog />
        </div>
      </div>

      <EmployeeTable employees={filteredEmployees} />
    </div>
  )
}
