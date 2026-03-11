import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Shield, Users, Briefcase } from 'lucide-react'
import useAppStore from '@/stores/main'
import { navItems } from '@/config/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function PermissionsControl() {
  const {
    employees,
    updateEmployeePermissions,
    updateEmployeeLevel,
    levelPermissions,
    updateLevelPermissions,
  } = useAppStore()
  const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name))

  const toggleUserPermission = (empId: string, currentPerms: string[] = [], modId: string) => {
    const newPerms = currentPerms.includes(modId)
      ? currentPerms.filter((id) => id !== modId)
      : [...currentPerms, modId]
    updateEmployeePermissions(empId, newPerms)
  }

  const toggleLevelPermission = (level: string, currentPerms: string[] = [], modId: string) => {
    const newPerms = currentPerms.includes(modId)
      ? currentPerms.filter((id) => id !== modId)
      : [...currentPerms, modId]
    updateLevelPermissions(level, newPerms)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 uppercase">
          <Shield className="h-5 w-5 text-primary" /> CONTROLE DE PERMISSÕES
        </CardTitle>
        <CardDescription className="uppercase">
          GERENCIE QUAIS MÓDULOS PODEM SER ACESSADOS POR NÍVEL DE CARGO OU POR COLABORADOR
          ESPECÍFICO.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="niveis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="niveis" className="uppercase">
              POR NÍVEL DE ACESSO
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="uppercase">
              POR COLABORADOR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="niveis" className="space-y-6">
            {['OPERACIONAL', 'ADMINISTRATIVO'].map((level) => (
              <div key={level} className="p-4 border rounded-lg bg-muted/10 space-y-4">
                <div className="font-bold text-lg uppercase flex items-center gap-3 border-b pb-2 border-muted text-primary">
                  <Briefcase className="h-5 w-5" /> NÍVEL: {level}
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
                        checked={levelPermissions[level]?.includes(mod.id) || false}
                        onCheckedChange={() =>
                          toggleLevelPermission(level, levelPermissions[level], mod.id)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-6">
            {sortedEmployees.map((emp) => (
              <div key={emp.id} className="p-4 border rounded-lg bg-muted/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3 border-muted">
                  <div className="font-bold text-lg uppercase flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" /> {emp.name}
                    <span className="text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded">
                      {emp.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-muted-foreground">
                      NÍVEL:
                    </span>
                    <Select
                      value={emp.accessLevel || 'OPERACIONAL'}
                      onValueChange={(v: any) => updateEmployeeLevel(emp.id, v)}
                    >
                      <SelectTrigger className="w-[180px] h-8 text-xs">
                        <SelectValue placeholder="SELECIONE..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPERACIONAL">OPERACIONAL</SelectItem>
                        <SelectItem value="ADMINISTRATIVO">ADMINISTRATIVO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                        onCheckedChange={() =>
                          toggleUserPermission(emp.id, emp.permissions, mod.id)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {sortedEmployees.length === 0 && (
              <div className="text-center py-10 text-muted-foreground uppercase border border-dashed rounded-lg bg-muted/5">
                NENHUM COLABORADOR CADASTRADO PARA GERENCIAR PERMISSÕES.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
