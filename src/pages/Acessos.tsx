import { useState, useMemo } from 'react'
import useAppStore from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Shield, LayoutGrid } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { AcessoFormModal } from '@/components/acessos/AcessoFormModal'

const SECTORS = ['TODOS', 'FINANCEIRO', 'CLÍNICO', 'MARKETING', 'RECEPÇÃO', 'LABORATÓRIO', 'GERAL']

export default function Acessos() {
  const { acessos } = useAppStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('TODOS')
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    return acessos
      .filter((a) => {
        const matchSearch =
          a.platform.toLowerCase().includes(search.toLowerCase()) ||
          a.description?.toLowerCase().includes(search.toLowerCase())
        const matchSector = sector === 'TODOS' || (a.sector?.toUpperCase() || 'GERAL') === sector
        return matchSearch && matchSector
      })
      .sort((a, b) => a.platform.localeCompare(b.platform))
  }, [acessos, search, sector])

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nuvia-navy flex items-center gap-3">
            <LayoutGrid className="h-8 w-8 text-primary" /> CENTRAL DE SISTEMAS
          </h1>
          <p className="text-muted-foreground mt-1">
            ACESSO RÁPIDO, CREDENCIAIS E MANUAIS INTERNOS DA CLÍNICA NUVIA.
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="bg-primary text-primary-foreground shadow-md whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-2" /> NOVO SISTEMA
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full xl:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="BUSCAR POR NOME OU DESCRIÇÃO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200"
          />
        </div>
        <div className="w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
          <Tabs value={sector} onValueChange={setSector} className="w-full">
            <TabsList className="flex h-11 w-max xl:w-auto bg-slate-100 p-1">
              {SECTORS.map((s) => (
                <TabsTrigger
                  key={s}
                  value={s}
                  className="px-4 text-xs font-bold tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {s}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all group overflow-hidden bg-white"
            onClick={() => navigate(`/admin/acessos/${item.id}`)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center gap-4 h-full relative">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border shadow-sm group-hover:scale-105 transition-transform duration-300">
                {item.logo_url ? (
                  <img src={item.logo_url} className="w-full h-full object-cover" />
                ) : (
                  <Shield className="h-8 w-8 text-primary/40" />
                )}
              </div>
              <div className="space-y-1.5 flex-1 w-full">
                <h3
                  className="font-extrabold text-lg text-slate-800 leading-tight truncate px-2"
                  title={item.platform}
                >
                  {item.platform}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 line-clamp-2 px-2 h-8 leading-snug">
                  {item.description || item.instructions || 'SISTEMA DE ACESSO INTERNO DA CLÍNICA.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto w-full justify-center pt-4 border-t border-slate-100">
                <Badge
                  variant="secondary"
                  className="uppercase text-[9px] tracking-widest font-black bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  {item.sector}
                </Badge>
                <Badge
                  variant="outline"
                  className="uppercase text-[9px] tracking-widest font-black bg-primary/5 text-primary border-primary/20"
                >
                  {item.access_level}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-white/50">
            <LayoutGrid className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-sm tracking-widest">
              NENHUM SISTEMA ENCONTRADO PARA ESTES FILTROS.
            </p>
          </div>
        )}
      </div>

      <AcessoFormModal open={open} onOpenChange={setOpen} />
    </div>
  )
}
