import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useHubStore, HubAnnouncement } from '@/stores/hub'
import { useToast } from '@/hooks/use-toast'
import { Megaphone, Save } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  item?: HubAnnouncement | null
}

export function AddAnnouncementDialog({ open, onOpenChange, item }: Props) {
  const { createAnnouncement, updateAnnouncement } = useHubStore()
  const { toast } = useToast()

  const [title, setTitle] = useState(item?.title || '')
  const [content, setContent] = useState(item?.content || '')
  const [active, setActive] = useState(item ? item.active : true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return
    setIsSaving(true)
    let res
    if (item) {
      res = await updateAnnouncement(item.id, {
        title: title.trim(),
        content: content.trim(),
        active,
      })
    } else {
      res = await createAnnouncement(title.trim(), content.trim())
    }

    setIsSaving(false)
    if (res.success) {
      toast({ title: 'SUCESSO', description: 'COMUNICADO SALVO COM SUCESSO.' })
      onOpenChange(false)
    } else {
      toast({ title: 'ERRO', description: 'FALHA AO SALVAR COMUNICADO.', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="uppercase max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-nuvia-navy">
            <Megaphone className="h-5 w-5 text-primary" />
            {item ? 'EDITAR COMUNICADO' : 'NOVO COMUNICADO'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">TÍTULO *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="TÍTULO DO COMUNICADO"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">CONTEÚDO *</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="DETALHES DO COMUNICADO..."
              className="min-h-[150px] resize-none"
              disableUppercase
            />
          </div>
          {item && (
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
              <label className="text-xs font-bold text-slate-700">COMUNICADO ATIVO</label>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          )}
          <Button
            className="w-full font-bold tracking-widest mt-4"
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !content.trim()}
          >
            <Save className="h-4 w-4 mr-2" /> {isSaving ? 'SALVANDO...' : 'SALVAR COMUNICADO'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
