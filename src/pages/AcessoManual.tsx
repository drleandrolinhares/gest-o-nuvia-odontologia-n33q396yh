import { useParams, useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, Trash2, Home } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AcessoRapido } from '@/components/acessos/AcessoRapido'
import { VisaoGeral } from '@/components/acessos/VisaoGeral'
import { GrandeManual } from '@/components/acessos/GrandeManual'
import { Troubleshooting } from '@/components/acessos/Troubleshooting'
import { AcessoFormModal } from '@/components/acessos/AcessoFormModal'
import { useState } from 'react'

export default function AcessoManual() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { acessos, removeAccess } = useAppStore()
  const item = acessos.find((a) => a.id === id)
  const [editOpen, setEditOpen] = useState(false)

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 uppercase space-y-4">
        <h2 className="text-2xl font-bold text-nuvia-navy">SISTEMA NÃO ENCONTRADO</h2>
        <Button variant="outline" onClick={() => navigate('/admin/financeiro/central-acessos')}>
          <Home className="mr-2 h-4 w-4" /> VOLTAR
        </Button>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm('TEM CERTEZA QUE DESEJA REMOVER ESTE SISTEMA E SEU MANUAL?')) {
      removeAccess(item.id)
      navigate('/admin/financeiro/central-acessos')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up uppercase pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/admin/financeiro/central-acessos')}
            className="shrink-0 bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            {item.logo_url && (
              <img
                src={item.logo_url}
                className="h-12 w-12 rounded-lg border object-cover bg-white shadow-sm"
              />
            )}
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-extrabold text-nuvia-navy leading-tight">
                {item.platform}
              </h1>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px] tracking-widest">
                  {item.sector}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[10px] tracking-widest bg-primary/5 text-primary border-primary/20"
                >
                  {item.access_level}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
          <Button
            variant="outline"
            className="flex-1 md:flex-none border-primary/50 text-primary hover:bg-primary/10"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-2" /> EDITAR MANUAL
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-red-500 hover:bg-red-50 hover:text-red-600 shrink-0"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-6">
          <AcessoRapido item={item} />
          <VisaoGeral item={item} />
        </div>
        <div className="lg:col-span-8 space-y-6">
          <GrandeManual item={item} />
          <Troubleshooting item={item} />
        </div>
      </div>

      <AcessoFormModal open={editOpen} onOpenChange={setEditOpen} item={item} />
    </div>
  )
}
