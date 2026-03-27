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
import { Save, ShieldAlert, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { permissionsService } from '@/services/permissionsService'

export function PermissoesPorCargo() {
  const [cargos, setCargos] = useState<any[]>([])
  const [menus, setMenus] = useState<any[]>([])
  const [selectedCargo, setSelectedCargo] = useState<string>('')
  const [perms, setPerms] = useState<
    Record<string, { ver: boolean; editar: boolean; deletar: boolean }>
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
        newPerms[m.id] = { ver: false, editar: false, deletar: false }
      })

      cargoPerms.forEach((p: any) => {
        if (newPerms[p.menu_id]) {
          newPerms[p.menu_id] = {
            ver: p.pode_ver,
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

  const handleToggle = (menuId: string, field: 'ver' | 'editar' | 'deletar') => {
    setPerms((prev) => ({
      ...prev,
      [menuId]: {
        ...prev[menuId],
        [field]: !prev[menuId]?.[field],
      },
    }))
  }

  const handleSave = async () => {
    if (!selectedCargo) return
    setSaving(true)
    try {
      const payload = menus.map((m) => ({
        menu_id: m.id,
        pode_ver: perms[m.id]?.ver || false,
        pode_editar: perms[m.id]?.editar || false,
        pode_deletar: perms[m.id]?.deletar || false,
      }))
      await permissionsService.savePermissoesCargo(selectedCargo, payload)
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
                  <TableHead className="font-black text-slate-500 tracking-widest text-xs text-center w-[120px]">
                    VISUALIZAR
                  </TableHead>
                  <TableHead className="font-black text-slate-500 tracking-widest text-xs text-center w-[120px]">
                    EDITAR
                  </TableHead>
                  <TableHead className="font-black text-slate-500 tracking-widest text-xs text-center w-[120px]">
                    DELETAR
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menus.map((m) => {
                  const p = perms[m.id] || { ver: false, editar: false, deletar: false }
                  return (
                    <TableRow key={m.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-black text-slate-700 text-xs pl-6 uppercase">
                        {m.nome}
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={p.ver}
                          onCheckedChange={() => handleToggle(m.id, 'ver')}
                          className="data-[state=checked]:bg-[#0A192F] data-[state=checked]:border-[#0A192F]"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={p.editar}
                          onCheckedChange={() => handleToggle(m.id, 'editar')}
                          className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={p.deletar}
                          onCheckedChange={() => handleToggle(m.id, 'deletar')}
                          className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                        />
                      </TableCell>
                    </TableRow>
                  )
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
