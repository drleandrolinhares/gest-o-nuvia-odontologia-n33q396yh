import { useState, useEffect } from 'react'
import useAppStore, { RolePermission, SystemRole } from '@/stores/main'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  ShieldCheck,
  CheckSquare,
  Save,
  Plus,
  Pencil,
  Trash2,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Users,
  CalendarClock,
  Package,
  DollarSign,
  Key,
  ScrollText,
  Settings,
  Copy,
  ShieldAlert,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const MODULES = [
  { id: 'DASHBOARD', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'AGENDA', name: 'Agenda', icon: Calendar },
  { id: 'MENSAGENS', name: 'Mensagens', icon: MessageSquare },
  { id: 'RH', name: 'RH', icon: Users },
  { id: 'ESCALA DE TRABALHO', name: 'Escala', icon: CalendarClock },
  { id: 'ESTOQUE', name: 'Estoque', icon: Package },
  { id: 'PRECIFICAÇÃO', name: 'Precificação', icon: DollarSign },
  { id: 'ACESSOS', name: 'Acessos', icon: Key },
  { id: 'LOGS', name: 'Logs', icon: ScrollText },
  { id: 'CONFIGURAÇÕES', name: 'Configurações', icon: Settings },
]

export default function Permissions() {
  const {
    rolePermissions,
    roles,
    updateRolePermissions,
    addRole,
    updateRole,
    deleteRole,
    isAdmin,
  } = useAppStore()
  const { toast } = useToast()

  const [selectedRole, setSelectedRole] = useState<string>('')
  const [copyFromRole, setCopyFromRole] = useState<string>('')
  const [formState, setFormState] = useState<Record<string, RolePermission>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Manage Roles State
  const [isManageRolesOpen, setIsManageRolesOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [editRoleName, setEditRoleName] = useState('')
  const [roleToDelete, setRoleToDelete] = useState<SystemRole | null>(null)

  useEffect(() => {
    if (selectedRole) {
      const newState: Record<string, RolePermission> = {}
      MODULES.forEach((mod) => {
        const existing = rolePermissions.find(
          (rp) => rp.role === selectedRole && rp.module === mod.id,
        )
        newState[mod.id] = existing
          ? { ...existing }
          : {
              role: selectedRole,
              module: mod.id,
              can_view: false,
              can_create: false,
              can_edit: false,
              can_delete: false,
            }
      })
      setFormState(newState)
    } else {
      setFormState({})
    }
  }, [selectedRole, rolePermissions])

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] py-20 uppercase animate-fade-in">
        <ShieldAlert className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-black text-muted-foreground tracking-widest">
          Acesso Restrito
        </h2>
        <p className="text-sm font-medium text-muted-foreground mt-2">
          Esta página é exclusiva para administradores.
        </p>
      </div>
    )
  }

  const handleCheck = (module: string, field: keyof RolePermission, checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [field]: checked,
      },
    }))
  }

  const handleSelectAll = (module: string) => {
    setFormState((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        can_view: true,
        can_create: true,
        can_edit: true,
        can_delete: true,
      },
    }))
  }

  const handleCopyPermissions = () => {
    if (!copyFromRole || !selectedRole) return
    const sourcePermissions = rolePermissions.filter((rp) => rp.role === copyFromRole)
    const newState = { ...formState }
    MODULES.forEach((mod) => {
      const sourcePerm = sourcePermissions.find((rp) => rp.module === mod.id)
      if (sourcePerm) {
        newState[mod.id] = {
          ...newState[mod.id],
          can_view: sourcePerm.can_view,
          can_create: sourcePerm.can_create,
          can_edit: sourcePerm.can_edit,
          can_delete: sourcePerm.can_delete,
        }
      } else {
        newState[mod.id] = {
          ...newState[mod.id],
          can_view: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
        }
      }
    })
    setFormState(newState)
    toast({
      title: 'SUCESSO',
      description: `Permissões copiadas de ${copyFromRole}. Clique em Salvar para aplicar.`,
    })
    setCopyFromRole('')
  }

  const handleSave = async () => {
    if (!selectedRole) return
    setIsSaving(true)
    const payload = Object.values(formState)
    const res = await updateRolePermissions(payload)
    setIsSaving(false)

    if (res.success) {
      toast({
        title: 'SUCESSO',
        description: `PERMISSÕES DO CARGO ${selectedRole} SALVAS COM SUCESSO.`,
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'ERRO',
        description: 'FALHA AO SALVAR PERMISSÕES.',
      })
    }
  }

  const handleAddRole = async () => {
    if (!newRoleName.trim()) return
    const res = await addRole(newRoleName.trim().toUpperCase())
    if (res.success) {
      setNewRoleName('')
      toast({ title: 'SUCESSO', description: 'CARGO CRIADO COM SUCESSO.' })
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO CRIAR CARGO.' })
    }
  }

  const handleSaveRoleEdit = async (id: string) => {
    if (!editRoleName.trim()) return
    const formatted = editRoleName.trim().toUpperCase()
    const currentName = roles.find((r) => r.id === id)?.name

    const res = await updateRole(id, formatted)
    if (res.success) {
      setEditingRoleId(null)
      if (selectedRole === currentName) setSelectedRole(formatted)
      toast({ title: 'SUCESSO', description: 'CARGO ATUALIZADO COM SUCESSO.' })
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO ATUALIZAR CARGO.' })
    }
  }

  const handleConfirmDeleteRole = async () => {
    if (!roleToDelete) return
    const res = await deleteRole(roleToDelete.id)
    if (res.success) {
      if (selectedRole === roleToDelete.name) setSelectedRole('')
      setRoleToDelete(null)
      toast({ title: 'SUCESSO', description: 'CARGO REMOVIDO COM SUCESSO.' })
    } else {
      toast({
        variant: 'destructive',
        title: 'ERRO',
        description: 'FALHA AO REMOVER CARGO. PODE ESTAR EM USO.',
      })
      setRoleToDelete(null)
    }
  }

  return (
    <div className="animate-fade-in-up pb-10 h-full">
      <div className="bg-[#0A192F] min-h-full rounded-2xl p-6 md:p-8 text-slate-100 shadow-xl border border-[#D4AF37]/20 relative">
        {/* Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 border-b border-[#D4AF37]/30 pb-6 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 shrink-0">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#D4AF37] uppercase">
                Permissões de Acesso
              </h1>
              <p className="text-[#D4AF37]/70 mt-1 text-xs uppercase tracking-wider font-bold">
                GESTÃO GRANULAR DE MÓDULOS E FUNÇÕES
              </p>
            </div>
          </div>

          <div className="w-full xl:w-auto flex flex-col sm:flex-row items-center gap-4 shrink-0">
            {selectedRole && (
              <div className="flex items-center gap-2 bg-[#112240]/50 p-1 rounded-lg border border-dashed border-[#D4AF37]/40 w-full sm:w-auto">
                <Select value={copyFromRole} onValueChange={setCopyFromRole}>
                  <SelectTrigger className="w-full sm:w-40 h-10 bg-transparent border-none text-[#D4AF37]/80 font-bold tracking-widest uppercase focus:ring-0 text-xs">
                    <SelectValue placeholder="COPIAR DE..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#112240] border-[#D4AF37]/40 text-slate-100">
                    {roles
                      .filter((r) => r.name !== selectedRole)
                      .map((r) => (
                        <SelectItem
                          key={r.id}
                          value={r.name}
                          className="uppercase font-bold tracking-widest focus:bg-[#D4AF37]/20 focus:text-[#D4AF37]"
                        >
                          {r.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  onClick={handleCopyPermissions}
                  disabled={!copyFromRole}
                  className="h-10 px-3 text-[#D4AF37] hover:bg-[#D4AF37]/20 disabled:opacity-30"
                  title="Espelhar permissões"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="w-full sm:w-72">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full h-12 bg-[#112240] border-[#D4AF37]/40 text-[#D4AF37] font-bold tracking-widest uppercase focus:ring-[#D4AF37]">
                  <SelectValue placeholder="SELECIONE O CARGO" />
                </SelectTrigger>
                <SelectContent className="bg-[#112240] border-[#D4AF37]/40 text-slate-100">
                  {roles.map((r) => (
                    <SelectItem
                      key={r.id}
                      value={r.name}
                      className="uppercase font-bold tracking-widest focus:bg-[#D4AF37]/20 focus:text-[#D4AF37]"
                    >
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isManageRolesOpen} onOpenChange={setIsManageRolesOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto h-12 bg-[#112240] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/20 tracking-widest font-bold uppercase">
                  Gerenciar Cargos
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0A192F] border-[#D4AF37]/20 text-slate-100 max-w-md w-11/12">
                <DialogHeader>
                  <DialogTitle className="text-[#D4AF37] uppercase tracking-widest">
                    Cargos do Sistema
                  </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                  {roleToDelete ? (
                    <div className="space-y-4 bg-red-500/10 p-4 rounded-lg border border-red-500/30">
                      <p className="text-center font-medium">
                        Tem certeza que deseja excluir o cargo{' '}
                        <strong className="text-red-400">{roleToDelete.name}</strong>?
                      </p>
                      <p className="text-xs text-red-400/80 text-center uppercase tracking-wider">
                        Esta ação removerá todas as permissões associadas a ele. Se o cargo estiver
                        em uso por colaboradores, a exclusão poderá falhar.
                      </p>
                      <div className="flex justify-center gap-4 pt-2">
                        <Button
                          variant="outline"
                          className="bg-transparent border-slate-600 text-slate-300 hover:text-white"
                          onClick={() => setRoleToDelete(null)}
                        >
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDeleteRole}>
                          Confirmar Exclusão
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex gap-2">
                        <Input
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          placeholder="NOME DO NOVO CARGO"
                          className="uppercase bg-[#112240] border-white/10 text-white placeholder:text-slate-500 h-10 focus-visible:ring-[#D4AF37]"
                        />
                        <Button
                          onClick={handleAddRole}
                          className="bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] h-10 px-4"
                          disabled={!newRoleName.trim()}
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="max-h-[50vh] overflow-y-auto space-y-2 custom-scrollbar pr-2">
                        {roles.length === 0 ? (
                          <p className="text-center text-slate-500 py-4 text-sm uppercase">
                            Nenhum cargo cadastrado
                          </p>
                        ) : (
                          roles.map((r) => (
                            <div
                              key={r.id}
                              className="flex items-center justify-between p-3 bg-[#112240] rounded-lg border border-white/5 group hover:border-white/10 transition-colors"
                            >
                              {editingRoleId === r.id ? (
                                <div className="flex items-center gap-2 w-full">
                                  <Input
                                    value={editRoleName}
                                    onChange={(e) => setEditRoleName(e.target.value)}
                                    className="uppercase h-8 bg-[#0A192F] border-white/10 focus-visible:ring-[#D4AF37]"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveRoleEdit(r.id)
                                      if (e.key === 'Escape') setEditingRoleId(null)
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveRoleEdit(r.id)}
                                    className="bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] h-8 px-3 text-xs"
                                  >
                                    Salvar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingRoleId(null)}
                                    className="h-8 px-2 text-slate-400 hover:text-white"
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <span className="font-bold text-sm tracking-wide text-slate-200 uppercase truncate pr-4">
                                    {r.name}
                                  </span>
                                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/5"
                                      onClick={() => {
                                        setEditingRoleId(r.id)
                                        setEditRoleName(r.name)
                                      }}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                      onClick={() => setRoleToDelete(r)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Matrix */}
        {!selectedRole ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
            <ShieldCheck className="h-20 w-20 text-[#D4AF37] mb-4" />
            <p className="text-lg font-bold tracking-widest uppercase text-[#D4AF37] text-center">
              Selecione um cargo para configurar
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="hidden xl:grid grid-cols-12 gap-4 pb-4 border-b border-[#D4AF37]/30 mb-4 px-4">
              <div className="col-span-3 text-[#D4AF37] font-bold tracking-widest uppercase text-xs">
                Módulo do Sistema
              </div>
              <div className="col-span-9 text-[#D4AF37] font-bold tracking-widest uppercase text-xs pl-2">
                Níveis de Permissão
              </div>
            </div>

            <div className="space-y-3">
              {MODULES.map((mod) => {
                const state = formState[mod.id]
                if (!state) return null

                return (
                  <div
                    key={mod.id}
                    className="flex flex-col xl:grid xl:grid-cols-12 gap-4 items-start xl:items-center p-4 bg-[#112240] rounded-xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-colors group"
                  >
                    <div className="xl:col-span-3 flex items-center gap-3 w-full">
                      <mod.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                      <span className="font-black text-[#D4AF37] tracking-widest uppercase text-sm truncate">
                        {mod.name}
                      </span>
                    </div>

                    <div className="xl:col-span-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                      <div className="flex flex-wrap items-center gap-6 bg-[#0A192F]/50 px-6 py-3 rounded-lg border border-white/5 flex-1 w-full sm:w-auto">
                        <label className="flex items-center gap-2 cursor-pointer group/label">
                          <Checkbox
                            checked={state.can_view}
                            onCheckedChange={(c) => handleCheck(mod.id, 'can_view', !!c)}
                            className="border-[#D4AF37] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:text-[#0A192F] w-5 h-5 focus-visible:ring-[#D4AF37]"
                          />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover/label:text-white transition-colors">
                            Visualizar
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group/label">
                          <Checkbox
                            checked={state.can_create}
                            onCheckedChange={(c) => handleCheck(mod.id, 'can_create', !!c)}
                            className="border-[#D4AF37] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:text-[#0A192F] w-5 h-5 focus-visible:ring-[#D4AF37]"
                          />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover/label:text-white transition-colors">
                            Criar
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group/label">
                          <Checkbox
                            checked={state.can_edit}
                            onCheckedChange={(c) => handleCheck(mod.id, 'can_edit', !!c)}
                            className="border-[#D4AF37] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:text-[#0A192F] w-5 h-5 focus-visible:ring-[#D4AF37]"
                          />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover/label:text-white transition-colors">
                            Editar
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group/label">
                          <Checkbox
                            checked={state.can_delete}
                            onCheckedChange={(c) => handleCheck(mod.id, 'can_delete', !!c)}
                            className="border-red-400 data-[state=checked]:bg-red-500 data-[state=checked]:text-white data-[state=checked]:border-red-500 w-5 h-5 focus-visible:ring-red-400"
                          />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover/label:text-red-400 transition-colors">
                            Excluir
                          </span>
                        </label>
                      </div>

                      <Button
                        variant="ghost"
                        onClick={() => handleSelectAll(mod.id)}
                        className="text-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 uppercase text-[10px] font-black tracking-widest shrink-0 w-full sm:w-auto h-10 border border-transparent hover:border-[#D4AF37]/30"
                      >
                        <CheckSquare className="w-4 h-4 mr-2" /> Marcar Tudo
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer with Save Action */}
            <div className="mt-8 border-t border-[#D4AF37]/20 pt-8 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black uppercase tracking-widest px-8 py-6 rounded-md shadow-lg transition-all hover:scale-[1.02] border border-[#D4AF37]"
              >
                <Save className="w-5 h-5 mr-3" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Permissões do Cargo'}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
