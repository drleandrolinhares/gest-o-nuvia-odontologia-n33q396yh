import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Shield } from 'lucide-react'
import useAppStore from '@/stores/main'
import { navItems } from '@/config/navigation'

export function PermissionsControl() {
  const { employees, updateEmployeePermissions } = useAppStore()
  const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name))

  const togglePermission = (empId: string, currentPerms: string[] = [], modId: string) => {
    const newPerms = currentPerms.includes(modId)
      ? currentPerms.filter((id) => id !== modId)
      : [...currentPerms, modId]
    updateEmployeePermissions(empId, newPerms)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 uppercase">
          <Shield className="h-5 w-5 text-primary" /> CONTROLE DE PERMISSÕES
        </CardTitle>
        <CardDescription className="uppercase">
          GERENCIE QUAIS MÓDULOS CADA COLABORADOR PODE ACESSAR NO SISTEMA.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedEmployees.map((emp) => (
          <div key={emp.id} className="p-4 border rounded-lg bg-muted/10 space-y-4">
            <div className="font-bold text-lg uppercase flex items-center gap-3 border-b pb-2 border-muted">
              {emp.name}
              <span className="text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded">
                {emp.role}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {navItems.map((mod) => (
                <div
                  key={mod.id}
                  className="flex items-center justify-between bg-background p-3 rounded-md border shadow-sm hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <mod.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-bold uppercase">{mod.label}</span>
                  </div>
                  <Switch
                    checked={emp.permissions?.includes(mod.id) || false}
                    onCheckedChange={() => togglePermission(emp.id, emp.permissions, mod.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        {sortedEmployees.length === 0 && (
          <div className="text-center py-10 text-muted-foreground uppercase">
            NENHUM COLABORADOR CADASTRADO PARA GERENCIAR PERMISSÕES.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
