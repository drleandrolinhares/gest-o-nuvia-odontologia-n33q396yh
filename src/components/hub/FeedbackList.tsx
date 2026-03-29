import { useState, useEffect } from 'react'
import { HubFeedback, useHubStore } from '@/stores/hub'
import { Card, CardContent } from '@/components/ui/card'
import useAppStore from '@/stores/main'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle, TrendingUp, User, Trash2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function FeedbackList({
  items,
  showAuthor = true,
}: {
  items: HubFeedback[]
  showAuthor?: boolean
}) {
  const { employees, isAdmin } = useAppStore()
  const { deleteFeedback } = useHubStore()
  const { toast } = useToast()

  const [localItems, setLocalItems] = useState(items)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    setLocalItems(items)
  }, [items])

  const getAuthorName = (userId: string) => {
    return employees.find((e) => e.user_id === userId)?.name || 'USUÁRIO DESCONHECIDO'
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    const { success } = await deleteFeedback(id)
    setIsDeleting(null)

    if (success) {
      setLocalItems((prev) => (Array.isArray(prev) ? prev.filter((item) => item?.id !== id) : []))
      toast({
        title: 'Sucesso',
        description: 'Envio apagado com sucesso.',
      })
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível apagar o envio.',
        variant: 'destructive',
      })
    }
  }

  if (localItems.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-xl bg-white/50 font-bold tracking-widest">
        NENHUM REGISTRO DE FEEDBACK ENCONTRADO.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {localItems.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:shadow-md transition-shadow relative group"
        >
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="bg-slate-50 p-4 md:w-56 border-r flex flex-col justify-center shrink-0">
                <p className="text-[10px] font-bold text-muted-foreground mb-1 tracking-widest">
                  ENVIADO EM:
                </p>
                <p className="text-sm font-black text-slate-800">
                  {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>

                {showAuthor && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-[10px] font-bold text-muted-foreground mb-1 tracking-widest">
                      ENVIADO POR:
                    </p>
                    <p className="text-xs font-bold text-primary flex items-center gap-1.5 line-clamp-2 uppercase">
                      <User className="h-3 w-3 shrink-0" /> {getAuthorName(item.user_id)}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 space-y-4 pr-12">
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-black tracking-widest text-emerald-600 mb-1">
                    <CheckCircle className="h-3.5 w-3.5" /> PONTOS POSITIVOS
                  </h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap normal-case font-medium">
                    {item.excellent_content}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="flex items-center gap-1.5 text-xs font-black tracking-widest text-amber-600 mb-1">
                    <TrendingUp className="h-3.5 w-3.5" /> PONTOS DE MELHORIA
                  </h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap normal-case font-medium">
                    {item.improvement_content}
                  </p>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="absolute top-2 right-2 transition-opacity">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                      disabled={isDeleting === item.id}
                    >
                      {isDeleting === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza que deseja apagar este envio?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O registro será removido permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Apagar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
