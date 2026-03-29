import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Save, ShieldAlert, Loader2, ChevronRight } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { permissionsService } from '@/services/permissionsService'
import useAppStore from '@/stores/main'

export function PermissoesPorCargo() {
  const { fetchPermissions } = useAppStore()
  const [cargos, setCargos] = useState<any[]>([])
  const [menus, setMenus] = useState<any[]>([])
  const [selectedCargo, setSelectedCargo] = useState<string>('')
  const [perms, setPerms] = useState<
    Record<string, { ver: boolean; criar: boolean; editar: boolean; deletar: boolean }>
  >({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [cData, mData] = await Promise.all([
          permissionsService.fetchCargos(),
          permissionsService.fetchMenus(),
        ])
        setCargos(cData)
        setMenus(mData)
      } catch (error) {
        toast({ title: 'Erro', description: 'Falha ao carregar dados', variant: 'destructive' })
      } finally {
        setLoading(false)
      }
    }
    loadInitial()
  }, [toast])

  const handleCargoChange = async (cargoId: string) => {
    setSelectedCargo(cargoId)
    if (!cargoId) return

    try {
      const cargoPerms = await permissionsService.fetchPermissoesCargo(cargoId)
      const newPerms: any = {}

      menus.forEach((m) => {
        newPerms[m.id] = { ver: false, criar: false, editar: false, deletar: false }
      })

      cargoPerms.forEach((p: any) => {
        if (newPerms[p.menu_id]) {
          newPerms[p.menu_id] = {
            ver: p.pode_ver,
            criar: p.pode_criar,
            editar: p.pode_editar,
            deletar: p.pode_deletar,
          }
        }
      })

      setPerms(newPerms)
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar permissões', variant: 'destructive' })
    }
  }

  const handleToggle = (
    menuId: string,
    field: 'ver' | 'criar' | 'editar' | 'deletar',
    isParent: boolean,
    parentName: string,
  ) => {
    setPerms((prev) => {
      const next = { ...prev }
      const newValue = !next[menuId]?.[field]
      next[menuId] = { ...next[menuId], [field]: newValue }

      if (isParent) {
        // Herança: se alterar o pai, propaga para os filhos do mesmo grupo
        if (menus && Array.isArray(menus)) {
          menus
            .filter((m) => m?.menu_pai === parentName && m?.id !== menuId)
            .forEach((child) => {
              if (child && child.id) {
                next[child.id] = { ...next[child.id], [field]: newValue }
              }
            })
        }
      } else {
        // Validação de hierarquia: se ativou um filho, ativa o pai
        if (newValue === true) {
          const parent = menus.find((m) => m.nome === parentName && !m.menu_filho)
          if (parent) {
            next[parent.id] = { ...next[parent.id], [field]: true }
          }
        }
      }
      return next
    })
  }

  const handleSave = async () => {
    if (!selectedCargo) return
    setSaving(true)

    // Garantir hierarquia no momento do save
    const finalPerms = { ...perms }
    menus.forEach((m) => {
      if (m.menu_filho) {
        const parent = menus.find((p) => p.nome === m.menu_pai && !p.menu_filho)
        if (parent) {
          if (finalPerms[m.id]?.ver && !finalPerms[parent.id]?.ver)
            finalPerms[parent.id] = { ...finalPerms[parent.id], ver: true }
          if (finalPerms[m.id]?.criar && !finalPerms[parent.id]?.criar)
            finalPerms[parent.id] = { ...finalPerms[parent.id], criar: true }
          if (finalPerms[m.id]?.editar && !finalPerms[parent.id]?.editar)
            finalPerms[parent.id] = { ...finalPerms[parent.id], editar: true }
          if (finalPerms[m.id]?.deletar && !finalPerms[parent.id]?.deletar)
            finalPerms[parent.id] = { ...finalPerms[parent.id], deletar: true }
        }
      }
    })

    try {
      const payload = menus.map((m) => ({
        menu_id: m.id,
        pode_ver: finalPerms[m.id]?.ver || false,
        pode_criar: finalPerms[m.id]?.criar || false,
        pode_editar: finalPerms[m.id]?.editar || false,
        pode_deletar: finalPerms[m.id]?.deletar || false,
      }))
      await permissionsService.savePermissoesCargo(selectedCargo, payload)
      await fetchPermissions() // ATUALIZA O SIDEBAR INSTANTANEAMENTE
      toast({ title: 'Sucesso', description: 'Permissões do cargo salvas com sucesso.' })
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const menusByPai = Array.isArray(menus)
    ? menus.reduce(
        (acc, m) => {
          if (!m || !m.menu_pai) return acc // Ignora módulos sem pai na nova estrutura
          if (!acc[m.menu_pai]) acc[m.menu_pai] = []
          acc[m.menu_pai].push(m)
          return acc
        },
        {} as Record<string, any[]>,
      )
    : {}

  const parentOrder = ['OPERACIONAL', 'COMERCIAL', 'FINANCEIRO', 'ADMINISTRATIVO', 'SISTEMA']
  const sortedPais = Object.keys(menusByPai).sort((a, b) => {
    const ia = parentOrder.indexOf(a)
    const ib = parentOrder.indexOf(b)
    if (ia !== -1 && ib !== -1) return ia - ib
    return a.localeCompare(b)
  })

  return (
    <Card className="shadow-sm border-muted rounded-xl overflow-hidden">
      <CardHeader className="bg-white border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-sm font-black flex items-center gap-2 tracking-widest text-slate-800">
            <ShieldAlert className="h-5 w-5 text-[#D81B84]" /> PERMISSÕES POR CARGO
          </CardTitle>
          <p className="text-xs text-muted-foreground font-bold tracking-wider">
            SELECIONE UM CARGO PARA CONFIGURAR SEUS ACESSOS PADRÃO.
          </p>
        </div>
        <div className="w-full md:w-72">
          <Select value={selectedCargo} onValueChange={handleCargoChange} disabled={loading}>
            <SelectTrigger className="font-bold bg-slate-50 border-slate-200">
              <SelectValue placeholder="SELECIONE O CARGO..." />
            </SelectTrigger>
            <SelectContent>
              {cargos.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0 bg-white">
        {loading ? (
          <div className="p-16 text-center text-muted-foreground bg-slate-50/50">
            <Loader2 className="h-10 w-10 mx-auto text-slate-300 mb-4 animate-spin" />
            <p className="font-black tracking-widest text-sm text-slate-400">CARREGANDO DADOS...</p>
          </div>
        ) : selectedCargo ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="font-black text-slate-500 tracking-widest text-xs py-4 pl-6">
                    MENU / MÓDULO
                  </TableHead>
                  <TableHead className="font-black text-slate-500 tracking-widest text-xs text-center w-[110px]">
                    VISUALIZAR
                  </TableHead>
                  <TableHead className="font-black text-slate-500 tracking-widest text-xs text-center w-[110px]">
                    CRIAR
                  </TableHead>
                  <TableHead className="font-black text-slate-500 tracking-widest text-xs text-center w-[110px]">
                    EDITAR
                  </TableHead>
                  <TableHead className="font-black text-slate-500 tracking-widest text-xs text-center w-[110px]">
                    DELETAR
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPais.map((pai) => {
                  const items = menusByPai[pai].sort((a, b) => {
                    if (!a.menu_filho) return -1
                    if (!b.menu_filho) return 1
                    return a.nome.localeCompare(b.nome)
                  })

                  return items.map((m) => {
                    const isParent = !m.menu_filho
                    const p = perms[m.id] || {
                      ver: false,
                      criar: false,
                      editar: false,
                      deletar: false,
                    }
                    return (
                      <TableRow
                        key={m.id}
                        className={`hover:bg-slate-50/50 transition-colors ${isParent ? 'bg-slate-100/60 border-t-2 border-t-slate-200' : ''}`}
                      >
                        <TableCell className="font-black text-slate-700 text-[11px] tracking-wider uppercase">
                          <div
                            className={`flex items-center ${isParent ? 'pl-2' : 'pl-8 text-slate-500'}`}
                          >
                            {!isParent && (
                              <ChevronRight className="w-3 h-3 mr-1 opacity-40 shrink-0" />
                            )}
                            {m.nome}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={p.ver}
                            onCheckedChange={() => handleToggle(m.id, 'ver', isParent, m.menu_pai)}
                            className="data-[state=checked]:bg-[#0A192F] data-[state=checked]:border-[#0A192F]"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={p.criar}
                            onCheckedChange={() =>
                              handleToggle(m.id, 'criar', isParent, m.menu_pai)
                            }
                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={p.editar}
                            onCheckedChange={() =>
                              handleToggle(m.id, 'editar', isParent, m.menu_pai)
                            }
                            className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={p.deletar}
                            onCheckedChange={() =>
                              handleToggle(m.id, 'deletar', isParent, m.menu_pai)
                            }
                            className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })
                })}
              </TableBody>
            </Table>
            <div className="p-4 border-t bg-slate-50 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#0A192F] hover:bg-[#112240] text-[#D4AF37] font-black tracking-widest shadow-md uppercase"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                SALVAR PERMISSÕES DO CARGO
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center text-muted-foreground bg-slate-50/50">
            <ShieldAlert className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="font-black tracking-widest text-sm text-slate-400">
              SELECIONE UM CARGO ACIMA PARA CONTINUAR E EXIBIR A MATRIZ DE PERMISSÕES.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
