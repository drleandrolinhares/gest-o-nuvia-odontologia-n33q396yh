import { useState, useEffect } from 'react'
import { ShieldCheck, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

interface Cargo {
  id: string
  nome: string
}

interface Kpi {
  id: string
  name: string
  sector: string
}

interface PermissionMap {
  [key: string]: {
    pode_visualizar: boolean
    pode_editar: boolean
  }
}

export default function KpiPermissions() {
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [kpis, setKpis] = useState<Kpi[]>([])
  const [permissions, setPermissions] = useState<PermissionMap>({})
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [cargosRes, kpisRes, permsRes] = await Promise.all([
        supabase.from('cargos').select('id, nome').order('nome'),
        supabase.from('kpis').select('id, name, sector').order('name'),
        (supabase as any).from('kpis_permissoes').select('*'),
      ])

      if (cargosRes.error) throw cargosRes.error
      if (kpisRes.error) throw kpisRes.error
      if (permsRes.error) throw permsRes.error

      setCargos(cargosRes.data || [])
      setKpis(kpisRes.data || [])

      const permMap: PermissionMap = {}
      ;(permsRes.data || []).forEach((p: any) => {
        permMap[`${p.cargo_id}_${p.kpi_id}`] = {
          pode_visualizar: p.pode_visualizar,
          pode_editar: p.pode_editar,
        }
      })
      setPermissions(permMap)
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
      toast({
        title: 'Erro ao carregar permissões',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (
    cargoId: string,
    kpiId: string,
    field: 'pode_visualizar' | 'pode_editar',
    value: boolean,
  ) => {
    const key = `${cargoId}_${kpiId}`
    const current = permissions[key] || { pode_visualizar: false, pode_editar: false }
    const updated = { ...current, [field]: value }

    // Atualização otimista
    setPermissions((prev) => ({ ...prev, [key]: updated }))

    try {
      const { error } = await (supabase as any).from('kpis_permissoes').upsert(
        {
          cargo_id: cargoId,
          kpi_id: kpiId,
          pode_visualizar: updated.pode_visualizar,
          pode_editar: updated.pode_editar,
        },
        {
          onConflict: 'cargo_id,kpi_id',
        },
      )

      if (error) throw error
    } catch (error: any) {
      console.error('Erro ao salvar permissão:', error)
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível atualizar a permissão.',
        variant: 'destructive',
      })
      // Reverter em caso de erro
      setPermissions((prev) => ({ ...prev, [key]: current }))
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" /> PERMISSÕES DE KPIs
        </h1>
        <p className="text-muted-foreground mt-1 font-semibold">
          GERENCIE QUEM PODE VISUALIZAR E EDITAR OS INDICADORES DE PERFORMANCE.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {cargos.length === 0 || kpis.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-bold">
            NENHUM CARGO OU KPI ENCONTRADO NO SISTEMA.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[250px] font-black text-nuvia-navy">CARGO</TableHead>
                  <TableHead className="font-black text-nuvia-navy">KPI</TableHead>
                  <TableHead className="w-[150px] text-center font-black text-nuvia-navy">
                    VISUALIZAR
                  </TableHead>
                  <TableHead className="w-[150px] text-center font-black text-nuvia-navy">
                    EDITAR
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cargos.map((cargo, i) =>
                  kpis.map((kpi, j) => {
                    const key = `${cargo.id}_${kpi.id}`
                    const perm = permissions[key] || {
                      pode_visualizar: false,
                      pode_editar: false,
                    }
                    const isLastKpi = j === kpis.length - 1

                    return (
                      <TableRow
                        key={key}
                        className={`hover:bg-slate-50/50 ${isLastKpi ? 'border-b-4 border-slate-100' : ''}`}
                      >
                        <TableCell className="font-bold text-nuvia-navy align-top">
                          {j === 0 ? cargo.nome : ''}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-600">
                          {kpi.name}
                          <span className="ml-2 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {kpi.sector}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={perm.pode_visualizar}
                            onCheckedChange={(val) =>
                              handleToggle(cargo.id, kpi.id, 'pode_visualizar', !!val)
                            }
                            className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={perm.pode_editar}
                            onCheckedChange={(val) =>
                              handleToggle(cargo.id, kpi.id, 'pode_editar', !!val)
                            }
                            className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  }),
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
