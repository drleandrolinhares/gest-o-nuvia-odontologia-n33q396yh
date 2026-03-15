import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useAppStore from '@/stores/main'
import { History, Plus, Trash2, Calendar as CalendarIcon, ShieldAlert } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function PricingHistoryTab() {
  const { pricingHistory, addPricingHistory, deletePricingHistory, isMaster } = useAppStore()
  const { toast } = useToast()

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSaving, setIsSaving] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const res = await addPricingHistory(date)
    setIsSaving(false)
    if (res.success) {
      toast({ title: 'SUCESSO', description: 'HISTÓRICO REGISTRADO. REVISÃO AGENDADA.' })
    } else {
      toast({ variant: 'destructive', title: 'ERRO', description: 'FALHA AO REGISTRAR.' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!isMaster) return
    const res = await deletePricingHistory(id)
    if (res.success) {
      toast({ title: 'SUCESSO', description: 'REGISTRO REMOVIDO.' })
    }
  }

  return (
    <Card className="max-w-4xl border-primary/20 shadow-md">
      <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
        <CardTitle className="text-primary flex items-center gap-2">
          <History className="h-5 w-5" /> HISTÓRICO DE PRECIFICAÇÃO
        </CardTitle>
        <CardDescription className="text-xs font-semibold uppercase">
          REGISTRE E ACOMPANHE AS REVISÕES DA TABELA DE PREÇOS.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <form
          onSubmit={handleAdd}
          className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg border"
        >
          <div className="space-y-2 flex-1 max-w-sm">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" /> DATA DE EXECUÇÃO
            </label>
            <Input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="font-bold bg-white"
            />
          </div>
          <Button type="submit" disabled={isSaving} className="font-bold uppercase tracking-wide">
            {isSaving ? 'SALVANDO...' : 'REGISTRAR PRECIFICAÇÃO'}
            {!isSaving && <Plus className="h-4 w-4 ml-2" />}
          </Button>
        </form>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {pricingHistory.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-all gap-4"
            >
              <div className="flex flex-wrap gap-6 items-center flex-1">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    EXECUTADO EM
                  </p>
                  <p className="font-black text-slate-800">
                    {new Date(item.execution_date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    RESPONSÁVEL
                  </p>
                  <p className="font-bold text-slate-700">{item.user_name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    PRÓXIMA REVISÃO
                  </p>
                  <p className="font-black text-indigo-600 flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {new Date(item.next_revision_date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {!isMaster && (
                  <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                    <ShieldAlert className="h-3 w-3" /> APENAS MASTER
                  </span>
                )}
                {isMaster && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {pricingHistory.length === 0 && (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50 font-bold text-xs uppercase">
              NENHUM HISTÓRICO DE PRECIFICAÇÃO ENCONTRADO.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
