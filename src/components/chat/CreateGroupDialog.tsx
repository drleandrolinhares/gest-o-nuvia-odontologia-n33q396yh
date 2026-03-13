import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/stores/chat'

export function CreateGroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const [name, setName] = useState('')
  const { createGroupRoom, isLoadingRoom } = useChatStore()

  const handleCreate = async () => {
    if (!name.trim()) return
    await createGroupRoom(name.trim())
    onOpenChange(false)
    setName('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wide text-nuvia-navy font-bold">
            Novo Grupo
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="NOME DO GRUPO..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="uppercase"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoadingRoom}>
            CANCELAR
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim() || isLoadingRoom}>
            CRIAR GRUPO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
