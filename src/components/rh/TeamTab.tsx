import { EmployeeTable } from '@/components/EmployeeTable'
import { AddEmployeeDialog } from './AddEmployeeDialog'
import useAppStore from '@/stores/main'

export function TeamTab() {
  const { employees } = useAppStore()

  return (
    <div className="space-y-4 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-5 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Quadro de Funcionários</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie a equipe atual da clínica e adicione novos colaboradores.
          </p>
        </div>
        <AddEmployeeDialog />
      </div>

      <EmployeeTable employees={employees} />
    </div>
  )
}
