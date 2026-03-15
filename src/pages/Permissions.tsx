import { useState, useEffect } from 'react'
import useAppStore, { RolePermission } from '@/stores/main'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ShieldCheck, CheckSquare, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Navigate } from 'react-router-dom'

const ROLES = ['SÓCIO', 'RECEPCIONISTA', 'TÉCNICO LAB', 'DENTISTA PARCEIRO']
const MODULES = [
  'DASHBOARD',
  'AGENDA',
  'MENSAGENS',
  'RH',
  'ESCALA DE TRABALHO',
  'ESTOQUE',
  'PRECIFICAÇÃO',
  'CONFIGURAÇÕES',
  'ACESSOS',
  'LOGS',
]

export default function Permissions() {
  const { rolePermissions, updateRolePermissions, isAdmin } = useAppStore()
  const { toast } = useToast()

  const [selectedRole, setSelectedRole] = useState<string>('')
  const [formState, setFormState] = useState<Record<string, RolePermission>>({})
  const [isSaving, setIsSaving] = useState(false)

  if (!isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  useEffect(() => {
    if (selectedRole) {
      const newState: Record<string, RolePermission> = {}
      MODULES.forEach((mod) => {
        const existing = rolePermissions.find((rp) => rp.role === selectedRole && rp.module === mod)
        newState[mod] = existing
          ? { ...existing }
          : {
              role: selectedRole,
              module: mod,
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

  return (
    <div className="animate-fade-in-up pb-10 h-full">
      <div className="bg-[#0A192F] min-h-full rounded-2xl p-6 md:p-8 text-slate-100 shadow-xl border border-[#D4AF37]/20 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#D4AF37]/30 pb-6 gap-6">
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
          <div className="w-full md:w-72 shrink-0">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full h-12 bg-[#112240] border-[#D4AF37]/40 text-[#D4AF37] font-bold tracking-widest uppercase focus:ring-[#D4AF37]">
                <SelectValue placeholder="SELECIONE O CARGO" />
              </SelectTrigger>
              <SelectContent className="bg-[#112240] border-[#D4AF37]/40 text-slate-100">
                {ROLES.map((r) => (
                  <SelectItem
                    key={r}
                    value={r}
                    className="uppercase font-bold tracking-widest focus:bg-[#D4AF37]/20 focus:text-[#D4AF37]"
                  >
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Matrix */}
        {!selectedRole ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <ShieldCheck className="h-20 w-20 text-[#D4AF37] mb-4" />
            <p className="text-lg font-bold tracking-widest uppercase text-[#D4AF37] text-center">
              SELECIONE UM CARGO PARA CONFIGURAR
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-24">
            {MODULES.map((mod) => {
              const state = formState[mod]
              if (!state) return null

              return (
                <div
                  key={mod}
                  className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-4 bg-[#112240] rounded-xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-colors group gap-4"
                >
                  <div className="font-black text-[#D4AF37] tracking-widest w-full xl:w-64 uppercase text-sm">
                    {mod}
                  </div>

                  <div className="flex flex-wrap items-center gap-6 flex-1 bg-[#0A192F]/50 px-6 py-3 rounded-lg border border-white/5 w-full">
                    <label className="flex items-center gap-2 cursor-pointer group/label">
                      <Checkbox
                        checked={state.can_view}
                        onCheckedChange={(c) => handleCheck(mod, 'can_view', !!c)}
                        className="border-[#D4AF37] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:text-[#0A192F] w-5 h-5"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover/label:text-white transition-colors">
                        Visualizar
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group/label">
                      <Checkbox
                        checked={state.can_create}
                        onCheckedChange={(c) => handleCheck(mod, 'can_create', !!c)}
                        className="border-[#D4AF37] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:text-[#0A192F] w-5 h-5"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover/label:text-white transition-colors">
                        Criar Novo
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group/label">
                      <Checkbox
                        checked={state.can_edit}
                        onCheckedChange={(c) => handleCheck(mod, 'can_edit', !!c)}
                        className="border-[#D4AF37] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:text-[#0A192F] w-5 h-5"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover/label:text-white transition-colors">
                        Editar
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group/label">
                      <Checkbox
                        checked={state.can_delete}
                        onCheckedChange={(c) => handleCheck(mod, 'can_delete', !!c)}
                        className="border-red-400 data-[state=checked]:bg-red-500 data-[state=checked]:text-white data-[state=checked]:border-red-500 w-5 h-5"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover/label:text-red-400 transition-colors">
                        Excluir
                      </span>
                    </label>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => handleSelectAll(mod)}
                    className="text-[#D4AF37]/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 uppercase text-[10px] font-black tracking-widest shrink-0 w-full xl:w-auto h-12 xl:h-10 border border-transparent hover:border-[#D4AF37]/30"
                  >
                    <CheckSquare className="w-4 h-4 mr-2" /> Marcar Tudo
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer fixed button */}
        {selectedRole && (
          <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50 animate-fade-in-up">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] font-black uppercase tracking-widest px-6 md:px-8 py-6 rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-transform hover:scale-105 border-2 border-[#D4AF37]"
            >
              <Save className="w-5 h-5 md:mr-3 mr-0" />
              <span className="hidden md:inline">
                {isSaving ? 'Salvando...' : 'Salvar Permissões do Cargo'}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
