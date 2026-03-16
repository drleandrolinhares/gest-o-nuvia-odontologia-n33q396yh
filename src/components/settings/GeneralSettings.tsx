import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Building2, Plus, Package, Stethoscope, CalendarDays, Loader2 } from 'lucide-react'
import useAppStore from '@/stores/main'

export function GeneralSettings() {
  const {
    departments,
    addDepartment,
    removeDepartment,
    packageTypes,
    addPackageType,
    removePackageType,
    specialties,
    addSpecialty,
    removeSpecialty,
    agendaTypes,
    addAgendaType,
    removeAgendaType,
  } = useAppStore()

  const [newDept, setNewDept] = useState('')
  const [newPkg, setNewPkg] = useState('')
  const [newSpec, setNewSpec] = useState('')
  const [newAgendaType, setNewAgendaType] = useState('')
  const [isSpecLoading, setIsSpecLoading] = useState(false)
  const [removingSpec, setRemovingSpec] = useState<string | null>(null)

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault()
    if (newDept.trim() && !departments.includes(newDept.trim().toUpperCase())) {
      addDepartment(newDept.trim())
      setNewDept('')
    }
  }

  const handleAddPkg = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPkg.trim() && !packageTypes.includes(newPkg.trim().toUpperCase())) {
      addPackageType(newPkg.trim())
      setNewPkg('')
    }
  }

  const handleAddSpec = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newSpec.trim() && !specialties.includes(newSpec.trim().toUpperCase())) {
      setIsSpecLoading(true)
      await addSpecialty(newSpec.trim())
      setIsSpecLoading(false)
      setNewSpec('')
    }
  }

  const handleRemoveSpec = async (spec: string) => {
    setRemovingSpec(spec)
    await removeSpecialty(spec)
    setRemovingSpec(null)
  }

  const handleAddAgendaType = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAgendaType.trim() && !agendaTypes.includes(newAgendaType.trim().toUpperCase())) {
      addAgendaType(newAgendaType.trim())
      setNewAgendaType('')
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-nuvia-navy">
            <Building2 className="h-5 w-5 text-nuvia-gold" /> DEPARTAMENTOS
          </CardTitle>
          <CardDescription>GERENCIE OS DEPARTAMENTOS DO SISTEMA.</CardDescription>
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
                <span className="font-medium text-sm text-nuvia-navy uppercase">{dept}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
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
          <CardTitle className="flex items-center gap-2 text-nuvia-navy">
            <Package className="h-5 w-5 text-nuvia-gold" /> TIPOS DE EMBALAGEM
          </CardTitle>
          <CardDescription>GERENCIE AS OPÇÕES DE EMBALAGEM.</CardDescription>
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
                <span className="font-medium text-sm text-nuvia-navy uppercase">{pkg}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
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
          <CardTitle className="flex items-center gap-2 text-nuvia-navy">
            <Stethoscope className="h-5 w-5 text-[#D81B84]" /> ESPECIALIDADES
          </CardTitle>
          <CardDescription>GERENCIE AS ESPECIALIDADES PARA O ESTOQUE.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddSpec} className="flex gap-2">
            <Input
              placeholder="NOVA ESPECIALIDADE..."
              value={newSpec}
              onChange={(e) => setNewSpec(e.target.value)}
              disabled={isSpecLoading}
            />
            <Button
              type="submit"
              disabled={!newSpec.trim() || isSpecLoading}
              className="bg-[#D81B84] hover:bg-[#B71770] text-white w-24"
            >
              {isSpecLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> ADD
                </>
              )}
            </Button>
          </form>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {[...specialties].sort().map((spec) => (
              <div
                key={spec}
                className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
              >
                <span className="font-medium text-sm text-nuvia-navy uppercase">{spec}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={removingSpec === spec}
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                  onClick={() => handleRemoveSpec(spec)}
                >
                  {removingSpec === spec ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-nuvia-navy">
            <CalendarDays className="h-5 w-5 text-indigo-500" /> TIPOS DE COMPROMISSO
          </CardTitle>
          <CardDescription>CATEGORIAS DISPONÍVEIS NA AGENDA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddAgendaType} className="flex gap-2">
            <Input
              placeholder="NOVO TIPO..."
              value={newAgendaType}
              onChange={(e) => setNewAgendaType(e.target.value)}
            />
            <Button type="submit" disabled={!newAgendaType.trim()}>
              <Plus className="h-4 w-4 mr-2" /> ADD
            </Button>
          </form>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {[...agendaTypes].sort().map((type) => (
              <div
                key={type}
                className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
              >
                <span className="font-medium text-sm text-nuvia-navy uppercase">{type}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                  onClick={() => removeAgendaType(type)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
