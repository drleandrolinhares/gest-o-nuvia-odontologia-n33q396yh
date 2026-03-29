import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Trash2,
  Plus,
  Package,
  Stethoscope,
  CalendarDays,
  Loader2,
  Palette,
  Briefcase,
  Building2,
} from 'lucide-react'
import useAppStore from '@/stores/main'
import { userService } from '@/services/userService'
import { supabase } from '@/lib/supabase/client'

export function GeneralSettings() {
  const {
    packageTypes,
    addPackageType,
    removePackageType,
    specialties,
    addSpecialty,
    removeSpecialty,
    agendaTypes,
    addAgendaType,
    removeAgendaType,
    specialtyConfigs,
    addSpecialtyConfig,
    deleteSpecialtyConfig,
  } = useAppStore()

  const [newPkg, setNewPkg] = useState('')
  const [newSpec, setNewSpec] = useState('')
  const [newAgendaType, setNewAgendaType] = useState('')
  const [isSpecLoading, setIsSpecLoading] = useState(false)
  const [removingSpec, setRemovingSpec] = useState<string | null>(null)

  const [newAgendaSpec, setNewAgendaSpec] = useState('')
  const [newAgendaSpecColor, setNewAgendaSpecColor] = useState('#D4AF37')
  const [isAgendaSpecLoading, setIsAgendaSpecLoading] = useState(false)

  // New state for Cargos & Departamentos
  const [cargos, setCargos] = useState<any[]>([])
  const [departamentos, setDepartamentos] = useState<any[]>([])
  const [newCargo, setNewCargo] = useState('')
  const [newDept, setNewDept] = useState('')
  const [isCargoLoading, setIsCargoLoading] = useState(false)
  const [isDeptLoading, setIsDeptLoading] = useState(false)
  const [removingCargo, setRemovingCargo] = useState<string | null>(null)
  const [removingDept, setRemovingDept] = useState<string | null>(null)

  // Dentistas Avaliadores state
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState('')
  const [avaliadores, setAvaliadores] = useState<any[]>([
    { id: 'mock-1', nome: 'Dra. Ana Silva', cargo: 'DENTISTA CLÍNICA' },
    { id: 'mock-2', nome: 'Dr. Carlos Santos', cargo: 'ORTODONTISTA' },
  ])

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, nome, email, cargos(nome)')
        if (!error && data) {
          // Filtrar CEO
          const filtered = data.filter((u) => u.cargos?.nome?.toUpperCase() !== 'CEO')
          setUsers(filtered)
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadUsers()
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [c, d] = await Promise.all([
          userService.fetchCargos(),
          userService.fetchDepartamentos(),
        ])
        setCargos(c)
        setDepartamentos(d)
      } catch (err) {
        console.error(err)
      }
    }
    loadData()
  }, [])

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

  const handleAddAgendaSpec = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newAgendaSpec.trim()) {
      setIsAgendaSpecLoading(true)
      await addSpecialtyConfig(newAgendaSpec.trim(), newAgendaSpecColor)
      setIsAgendaSpecLoading(false)
      setNewAgendaSpec('')
      setNewAgendaSpecColor('#D4AF37')
    }
  }

  // Handlers for Cargos & Departamentos
  const handleAddCargo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCargo.trim()) return
    setIsCargoLoading(true)
    try {
      const data = await userService.createCargo(newCargo.trim().toUpperCase())
      setCargos((prev) => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)))
      setNewCargo('')
    } catch (err) {
      console.error(err)
    } finally {
      setIsCargoLoading(false)
    }
  }

  const handleRemoveCargo = async (id: string) => {
    setRemovingCargo(id)
    try {
      await userService.deleteCargo(id)
      setCargos((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setRemovingCargo(null)
    }
  }

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDept.trim()) return
    setIsDeptLoading(true)
    try {
      const data = await userService.createDepartamento(newDept.trim().toUpperCase())
      setDepartamentos((prev) => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)))
      setNewDept('')
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeptLoading(false)
    }
  }

  const handleRemoveDept = async (id: string) => {
    setRemovingDept(id)
    try {
      await userService.deleteDepartamento(id)
      setDepartamentos((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setRemovingDept(null)
    }
  }

  const handleAddAvaliador = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    const userToAdd = users.find((u) => u.id === selectedUser)
    if (!userToAdd) return

    if (avaliadores.some((a) => a.id === userToAdd.id)) {
      setSelectedUser('')
      return
    }

    setAvaliadores((prev) => [
      ...prev,
      {
        id: userToAdd.id,
        nome: userToAdd.nome || userToAdd.email,
        cargo: userToAdd.cargos?.nome || 'Sem Cargo',
      },
    ])
    setSelectedUser('')
  }

  const handleRemoveAvaliador = (id: string) => {
    setAvaliadores((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <Stethoscope className="h-5 w-5 text-[#D81B84]" /> ESPECIALIDADES (ESTOQUE)
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
            <Palette className="h-5 w-5 text-emerald-600" /> ESPECIALIDADES (AGENDA)
          </CardTitle>
          <CardDescription>GERENCIE CORES E NOMES PARA A MATRIZ DE AGENDA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddAgendaSpec} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="ESPECIALIDADE..."
                value={newAgendaSpec}
                onChange={(e) => setNewAgendaSpec(e.target.value)}
                disabled={isAgendaSpecLoading}
                className="pl-12"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded overflow-hidden shadow-sm border border-slate-200">
                <input
                  type="color"
                  value={newAgendaSpecColor}
                  onChange={(e) => setNewAgendaSpecColor(e.target.value)}
                  className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={!newAgendaSpec.trim() || isAgendaSpecLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-24"
            >
              {isAgendaSpecLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> ADD
                </>
              )}
            </Button>
          </form>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {[...specialtyConfigs]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((spec) => (
                <div
                  key={spec.id}
                  className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shadow-inner border border-black/10"
                      style={{ backgroundColor: spec.color_hex }}
                    />
                    <span className="font-bold text-sm text-nuvia-navy uppercase">{spec.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => deleteSpecialtyConfig(spec.id)}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-nuvia-navy">
            <Briefcase className="h-5 w-5 text-amber-600" /> CARGOS (RH)
          </CardTitle>
          <CardDescription>GERENCIE OS CARGOS DA CLÍNICA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddCargo} className="flex gap-2">
            <Input
              placeholder="NOVO CARGO..."
              value={newCargo}
              onChange={(e) => setNewCargo(e.target.value)}
              disabled={isCargoLoading}
            />
            <Button
              type="submit"
              disabled={!newCargo.trim() || isCargoLoading}
              className="w-24 bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isCargoLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> ADD
                </>
              )}
            </Button>
          </form>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {cargos.map((cargo) => (
              <div
                key={cargo.id}
                className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
              >
                <span className="font-medium text-sm text-nuvia-navy uppercase">{cargo.nome}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={removingCargo === cargo.id}
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                  onClick={() => handleRemoveCargo(cargo.id)}
                >
                  {removingCargo === cargo.id ? (
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
            <Building2 className="h-5 w-5 text-blue-600" /> DEPARTAMENTOS
          </CardTitle>
          <CardDescription>GERENCIE OS DEPARTAMENTOS / SETORES.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddDept} className="flex gap-2">
            <Input
              placeholder="NOVO DEPARTAMENTO..."
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              disabled={isDeptLoading}
            />
            <Button
              type="submit"
              disabled={!newDept.trim() || isDeptLoading}
              className="w-24 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isDeptLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> ADD
                </>
              )}
            </Button>
          </form>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {departamentos.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
              >
                <span className="font-medium text-sm text-nuvia-navy uppercase">{dept.nome}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={removingDept === dept.id}
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                  onClick={() => handleRemoveDept(dept.id)}
                >
                  {removingDept === dept.id ? (
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
            <Stethoscope className="h-5 w-5 text-[#D4AF37]" /> DENTISTAS AVALIADORES
          </CardTitle>
          <CardDescription>
            SELECIONE USUÁRIOS PARA ATUAR COMO DENTISTAS AVALIADORES.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddAvaliador} className="flex gap-2">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>
                Selecionar Usuário
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome || u.email} {u.cargos?.nome ? `- ${u.cargos.nome}` : ''}
                </option>
              ))}
            </select>
            <Button
              type="submit"
              disabled={!selectedUser}
              className="w-24 bg-[#D4AF37] hover:bg-[#B3932F] text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> ADD
            </Button>
          </form>
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {avaliadores.map((avaliador) => (
              <div
                key={avaliador.id}
                className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-nuvia-navy uppercase">
                    {avaliador.nome}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase">{avaliador.cargo}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                  onClick={() => handleRemoveAvaliador(avaliador.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {avaliadores.length === 0 && (
              <div className="text-center p-4 text-sm text-muted-foreground">
                Nenhum dentista avaliador selecionado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
