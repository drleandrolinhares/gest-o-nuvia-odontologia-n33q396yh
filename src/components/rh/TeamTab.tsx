import { useState } from 'react'
import { EmployeeTable } from '@/components/EmployeeTable'
import { FinancialTable } from '@/components/rh/FinancialTable'
import { AddEmployeeDialog } from './AddEmployeeDialog'
import useAppStore from '@/stores/main'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TeamTab() {
  const { employees } = useAppStore()
  const [statusFilter, setStatusFilter] = useState('ATIVOS')
  const [categoryFilter, setCategoryFilter] = useState('TIME TOTAL')

  const filteredEmployees = employees.filter((e) => {
    const matchStatus =
      statusFilter === 'TODOS' ||
      (statusFilter === 'ATIVOS' && e.status !== 'Desligado') ||
      (statusFilter === 'DESLIGADOS' && e.status === 'Desligado')

    const matchCategory =
      categoryFilter === 'TIME TOTAL' ||
      categoryFilter === 'DADOS FINANCEIROS' ||
      (categoryFilter === 'COLABORADOR' &&
        (!e.teamCategory ||
          e.teamCategory.length === 0 ||
          e.teamCategory.includes('COLABORADOR'))) ||
      (e.teamCategory && e.teamCategory.includes(categoryFilter))

    return matchStatus && matchCategory
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
                TODOS OS REGISTROS
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

      <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="w-full">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex md:grid-cols-5 mb-4">
          <TabsTrigger value="TIME TOTAL">TIME TOTAL</TabsTrigger>
          <TabsTrigger value="SÓCIO">SÓCIOS</TabsTrigger>
          <TabsTrigger value="DENTISTA">DENTISTAS</TabsTrigger>
          <TabsTrigger value="COLABORADOR">COLABORADORES</TabsTrigger>
          <TabsTrigger value="DADOS FINANCEIROS">DADOS FINANCEIROS</TabsTrigger>
        </TabsList>
      </Tabs>

      {categoryFilter === 'DADOS FINANCEIROS' ? (
        <FinancialTable employees={filteredEmployees} />
      ) : (
        <EmployeeTable employees={filteredEmployees} />
      )}
    </div>
  )
}
