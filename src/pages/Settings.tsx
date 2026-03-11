import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Building2, Plus, ShieldAlert, Package, Stethoscope } from 'lucide-react'
import useAppStore from '@/stores/main'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie as parametrizações do sistema.</p>
        </div>
        <Alert variant="destructive" className="bg-destructive/5 max-w-2xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Acesso Restrito</AlertTitle>
          <AlertDescription>
            Você precisa de privilégios de Administrador para acessar as configurações do sistema.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie as parametrizações do sistema.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Departamentos
            </CardTitle>
            <CardDescription>
              Gerencie os departamentos disponíveis para alocação de colaboradores.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddDept} className="flex gap-2">
              <Input
                placeholder="Novo departamento..."
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
              />
              <Button type="submit" disabled={!newDept.trim()}>
                <Plus className="h-4 w-4 mr-2" /> Adicionar
              </Button>
            </form>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
              {departments.map((dept) => (
                <div
                  key={dept}
                  className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
                >
                  <span className="font-medium text-sm text-foreground">{dept}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                    onClick={() => removeDepartment(dept)}
                    title={`Remover departamento ${dept}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {departments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-md">
                  Nenhum departamento cadastrado.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" /> Tipos de Embalagem
            </CardTitle>
            <CardDescription>
              Gerencie as opções de embalagem para o controle de estoque.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddPkg} className="flex gap-2">
              <Input
                placeholder="Novo tipo de embalagem..."
                value={newPkg}
                onChange={(e) => setNewPkg(e.target.value)}
              />
              <Button type="submit" disabled={!newPkg.trim()}>
                <Plus className="h-4 w-4 mr-2" /> Adicionar
              </Button>
            </form>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
              {packageTypes.map((pkg) => (
                <div
                  key={pkg}
                  className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
                >
                  <span className="font-medium text-sm text-foreground">{pkg}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                    onClick={() => removePackageType(pkg)}
                    title={`Remover embalagem ${pkg}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {packageTypes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-md">
                  Nenhum tipo de embalagem cadastrado.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-[#D81B84]" /> Especialidades
            </CardTitle>
            <CardDescription>
              Gerencie as especialidades para categorizar o estoque.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddSpec} className="flex gap-2">
              <Input
                placeholder="Nova especialidade..."
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
              />
              <Button
                type="submit"
                disabled={!newSpec.trim()}
                className="bg-[#D81B84] hover:bg-[#B71770] text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar
              </Button>
            </form>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
              {specialties.map((spec) => (
                <div
                  key={spec}
                  className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
                >
                  <span className="font-medium text-sm text-foreground">{spec}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                    onClick={() => removeSpecialty(spec)}
                    title={`Remover especialidade ${spec}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {specialties.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-md">
                  Nenhuma especialidade cadastrada.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
