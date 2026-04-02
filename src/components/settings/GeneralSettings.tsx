import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  Trash2,
  Loader2,
  Briefcase,
  Building2,
  Stethoscope,
  CircleDollarSign,
  Edit2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMainStore } from '@/stores/main'

export function GeneralSettings() {
  const [newAgendaType, setNewAgendaType] = useState('')
  const [newCargo, setNewCargo] = useState('')
  const [newDept, setNewDept] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [formCargo, setFormCargo] = useState('')
  const [formCriterio, setFormCriterio] = useState('')
  const [formValRef, setFormValRef] = useState('')
  const [formValRem, setFormValRem] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCriterio, setEditingCriterio] = useState(null)
  const [isCargoLoading, setIsCargoLoading] = useState(false)
  const [isDeptLoading, setIsDeptLoading] = useState(false)
  const [isAvaliadorLoading, setIsAvaliadorLoading] = useState(false)
  const [removingCargo, setRemovingCargo] = useState(null)
  const [removingDept, setRemovingDept] = useState(null)
  const [removingAvaliador, setRemovingAvaliador] = useState(null)

  const {
    agendaTypes,
    cargos,
    departamentos,
    users,
    avaliadores,
    criterios,
    addAgendaType,
    removeAgendaType,
    addCargo,
    removeCargo,
    addDept,
    removeDept,
    addAvaliador,
    removeAvaliador,
    addCriterio,
    updateCriterio,
    deleteCriterio,
    loadSettings,
  } = useMainStore()

  useEffect(() => {
    loadSettings()
  }, [])

  const handleAddAgendaType = async (e) => {
    e.preventDefault()
    if (!newAgendaType.trim()) return
    await addAgendaType(newAgendaType.trim())
    setNewAgendaType('')
  }

  const handleAddCargo = async (e) => {
    e.preventDefault()
    if (!newCargo.trim()) return
    setIsCargoLoading(true)
    await addCargo(newCargo.trim())
    setNewCargo('')
    setIsCargoLoading(false)
  }

  const handleAddDept = async (e) => {
    e.preventDefault()
    if (!newDept.trim()) return
    setIsDeptLoading(true)
    await addDept(newDept.trim())
    setNewDept('')
    setIsDeptLoading(false)
  }

  const handleAddAvaliador = async (e) => {
    e.preventDefault()
    if (!selectedUser) return
    setIsAvaliadorLoading(true)
    await addAvaliador(selectedUser)
    setSelectedUser('')
    setIsAvaliadorLoading(false)
  }

  const handleRemoveCargo = async (id) => {
    setRemovingCargo(id)
    await removeCargo(id)
    setRemovingCargo(null)
  }

  const handleRemoveDept = async (id) => {
    setRemovingDept(id)
    await removeDept(id)
    setRemovingDept(null)
  }

  const handleRemoveAvaliador = async (id) => {
    setRemovingAvaliador(id)
    await removeAvaliador(id)
    setRemovingAvaliador(null)
  }

  const handleOpenModal = (criterio = null) => {
    setEditingCriterio(criterio)
    setFormCargo(criterio ? criterio.cargo : '')
    setFormCriterio(criterio ? criterio.criterio : '')
    setFormValRef(criterio ? criterio.valorRef.toString() : '')
    setFormValRem(criterio ? criterio.valorRem.toString() : '')
    setIsModalOpen(true)
  }

  const handleSaveCriterio = async () => {
    const valorRef = parseFloat(formValRef) || 0
    const valorRem = parseFloat(formValRem) || 0
    if (!formCargo || !formCriterio || valorRef <= 0 || valorRem <= 0) return

    const criterioData = {
      cargo: formCargo,
      criterio: formCriterio,
      valorRef,
      valorRem,
    }

    if (editingCriterio) {
      await updateCriterio(editingCriterio.id, criterioData)
    } else {
      await addCriterio(criterioData)
    }

    setIsModalOpen(false)
  }

  const handleDeleteCriterio = async (id) => {
    await deleteCriterio(id)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-nuvia-navy">
            <Stethoscope className="h-5 w-5 text-[#D4AF37]" />
            TIPOS DE COMPROMISSO
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
            {Array.isArray(agendaTypes) &&
              agendaTypes.length > 0 &&
              agendaTypes.map((type) => (
                <div
                  key={String(type.id || type.name || `type-${Math.random()}`)}
                  className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors shadow-sm"
                >
                  <span className="font-medium text-sm text-nuvia-navy uppercase">
                    {typeof type === 'object' && type !== null && type !== undefined
                      ? String(type.name || 'Sem nome')
                      : String(type || 'Sem tipo')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => {
                      const idToRemove =
                        typeof type === 'object' && type !== null && type !== undefined
                          ? type.id
                          : type
                      if (
                        idToRemove &&
                        (typeof idToRemove === 'string' || typeof idToRemove === 'number')
                      )
                        removeAgendaType(idToRemove)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            {(!Array.isArray(agendaTypes) || agendaTypes.length === 0) && (
              <div className="text-center p-4 text-sm text-muted-foreground">
                Nenhum tipo de compromisso configurado.
              </div>
            )}
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
            {cargos.length === 0 && (
              <div className="text-center p-4 text-sm text-muted-foreground">
                Nenhum cargo configurado.
              </div>
            )}
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
            {departamentos.length === 0 && (
              <div className="text-center p-4 text-sm text-muted-foreground">
                Nenhum departamento configurado.
              </div>
            )}
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
              disabled={!selectedUser || isAvaliadorLoading}
              className="w-24 bg-[#D4AF37] hover:bg-[#B3932F] text-white"
            >
              {isAvaliadorLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> ADD
                </>
              )}
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

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-nuvia-navy">
              <CircleDollarSign className="h-5 w-5 text-[#D4AF37]" /> CRITÉRIOS DE BONIFICAÇÃO
            </CardTitle>
            <CardDescription>CONFIGURE CRITÉRIOS DE BONIFICAÇÃO POR CARGO.</CardDescription>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-[#D4AF37] hover:bg-[#B3932F] text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Critério
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">CARGO</th>
                  <th className="px-4 py-3">CRITÉRIO</th>
                  <th className="px-4 py-3 text-right">VALOR REFERÊNCIA</th>
                  <th className="px-4 py-3 text-right">VALOR REMUNERAÇÃO</th>
                  <th className="px-4 py-3 text-right rounded-tr-md">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {criterios.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-nuvia-navy">{c.cargo}</td>
                    <td className="px-4 py-3">{c.criterio}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(c.valorRef)}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(c.valorRem)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleOpenModal(c)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteCriterio(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {criterios.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhum critério configurado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-nuvia-navy">
              {editingCriterio ? 'Editar Critério' : 'Novo Critério'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cargo" className="text-xs uppercase text-muted-foreground">
                Cargo
              </Label>
              <select
                id="cargo"
                value={formCargo}
                onChange={(e) => setFormCargo(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>
                  Selecione um cargo
                </option>
                {cargos.map((c) => (
                  <option key={c.id} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
                {cargos.length === 0 && (
                  <option value="DENTISTA CLÍNICA">DENTISTA CLÍNICA (mock)</option>
                )}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="criterio" className="text-xs uppercase text-muted-foreground">
                Critério
              </Label>
              <Input
                id="criterio"
                placeholder="Ex: AVALIAÇÃO"
                value={formCriterio}
                onChange={(e) => setFormCriterio(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valRef" className="text-xs uppercase text-muted-foreground">
                  Valor Referência (R$)
                </Label>
                <Input
                  id="valRef"
                  type="number"
                  placeholder="0.00"
                  value={formValRef}
                  onChange={(e) => setFormValRef(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valRem" className="text-xs uppercase text-muted-foreground">
                  Valor Remuneração (R$)
                </Label>
                <Input
                  id="valRem"
                  type="number"
                  placeholder="0.00"
                  value={formValRem}
                  onChange={(e) => setFormValRem(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveCriterio}
              className="bg-[#D4AF37] hover:bg-[#B3932F] text-white"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
