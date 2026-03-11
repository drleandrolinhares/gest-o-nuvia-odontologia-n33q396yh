import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash2, Building2, Plus, ShieldAlert, Package, Stethoscope, Users } from 'lucide-react'
import useAppStore from '@/stores/main'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AddEmployeeDialog } from '@/components/rh/AddEmployeeDialog'

export default function Settings() {
  const {
    isAdmin,
    departments,
    addDepartment,
    removeDepartment,
    packageTypes,
    addPackageType,
    removePackageType,
    specialties,
    addSpecialty,
    removeSpecialty,
    employees,
    updateEmployeeAgendaAccess,
  } = useAppStore()

  const [newDept, setNewDept] = useState('')
  const [newPkg, setNewPkg] = useState('')
  const [newSpec, setNewSpec] = useState('')

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault()
    if (newDept.trim() && !departments.includes(newDept.trim())) {
      addDepartment(newDept.trim())
      setNewDept('')
    }
  }
  const handleAddPkg = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPkg.trim() && !packageTypes.includes(newPkg.trim())) {
      addPackageType(newPkg.trim())
      setNewPkg('')
    }
  }
  const handleAddSpec = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSpec.trim() && !specialties.includes(newSpec.trim())) {
      addSpecialty(newSpec.trim())
      setNewSpec('')
    }
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6 animate-fade-in-up uppercase">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">CONFIGURAÇÕES</h1>
          <p className="text-muted-foreground mt-1">GERENCIE AS PARAMETRIZAÇÕES DO SISTEMA.</p>
        </div>
        <Alert variant="destructive" className="bg-destructive/5 max-w-2xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>ACESSO RESTRITO</AlertTitle>
          <AlertDescription>
            VOCÊ PRECISA DE PRIVILÉGIOS DE ADMINISTRADOR PARA ACESSAR AS CONFIGURAÇÕES DO SISTEMA.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-6 animate-fade-in-up pb-10 uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">CONFIGURAÇÕES</h1>
        <p className="text-muted-foreground mt-1">
          GERENCIE AS PARAMETRIZAÇÕES E PERMISSÕES DO SISTEMA.
        </p>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="geral">GERAL</TabsTrigger>
          <TabsTrigger value="usuarios">USUÁRIOS & PERMISSÕES</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> DEPARTAMENTOS
                </CardTitle>
                <CardDescription>
                  GERENCIE OS DEPARTAMENTOS DISPONÍVEIS PARA ALOCAÇÃO DE COLABORADORES.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddDept} className="flex gap-2">
                  <Input
                    placeholder="NOVO DEPARTAMENTO..."
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                  />
                  <Button type="submit" disabled={!newDept.trim()}>
                    <Plus className="h-4 w-4 mr-2" /> ADD
                  </Button>
                </form>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                  {[...departments].sort().map((dept) => (
                    <div
                      key={dept}
                      className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
                    >
                      <span className="font-medium text-sm text-foreground uppercase">{dept}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={() => removeDepartment(dept)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> TIPOS DE EMBALAGEM
                </CardTitle>
                <CardDescription>
                  GERENCIE AS OPÇÕES DE EMBALAGEM PARA O CONTROLE DE ESTOQUE.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddPkg} className="flex gap-2">
                  <Input
                    placeholder="NOVO TIPO..."
                    value={newPkg}
                    onChange={(e) => setNewPkg(e.target.value)}
                  />
                  <Button type="submit" disabled={!newPkg.trim()}>
                    <Plus className="h-4 w-4 mr-2" /> ADD
                  </Button>
                </form>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                  {[...packageTypes].sort().map((pkg) => (
                    <div
                      key={pkg}
                      className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
                    >
                      <span className="font-medium text-sm text-foreground uppercase">{pkg}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={() => removePackageType(pkg)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-[#D81B84]" /> ESPECIALIDADES
                </CardTitle>
                <CardDescription>
                  GERENCIE AS ESPECIALIDADES PARA CATEGORIZAR O ESTOQUE.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddSpec} className="flex gap-2">
                  <Input
                    placeholder="NOVA ESPECIALIDADE..."
                    value={newSpec}
                    onChange={(e) => setNewSpec(e.target.value)}
                  />
                  <Button
                    type="submit"
                    disabled={!newSpec.trim()}
                    className="bg-[#D81B84] hover:bg-[#B71770] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" /> ADD
                  </Button>
                </form>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                  {[...specialties].sort().map((spec) => (
                    <div
                      key={spec}
                      className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
                    >
                      <span className="font-medium text-sm text-foreground uppercase">{spec}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={() => removeSpecialty(spec)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usuarios">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> PERMISSÕES DE ACESSO
                </CardTitle>
                <CardDescription className="mt-1">
                  DEFINA O NÍVEL DE ACESSO DE CADA COLABORADOR AOS MÓDULOS DO SISTEMA.
                </CardDescription>
              </div>
              <AddEmployeeDialog triggerText="INCLUIR USUÁRIOS" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NOME DO COLABORADOR</TableHead>
                    <TableHead>FUNÇÃO</TableHead>
                    <TableHead className="w-[300px]">PERMISSÃO DA AGENDA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium uppercase">{emp.name}</TableCell>
                      <TableCell className="text-muted-foreground uppercase">{emp.role}</TableCell>
                      <TableCell>
                        <Select
                          value={emp.agendaAccess || 'VIEW_ONLY'}
                          onValueChange={(v) => updateEmployeeAgendaAccess(emp.id, v as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VIEW_ONLY">APENAS VISUALIZAR A AGENDA</SelectItem>
                            <SelectItem value="ADD_EDIT">PODE ADD ITENS A AGENDA</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedEmployees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 uppercase">
                        NENHUM COLABORADOR CADASTRADO.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
