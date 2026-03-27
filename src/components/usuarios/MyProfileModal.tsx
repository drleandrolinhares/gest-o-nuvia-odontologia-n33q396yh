import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { userService } from '@/services/userService'
import { Loader2, UserCircle } from 'lucide-react'

export function MyProfileModal({ open, onOpenChange, profile, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    pix_tipo: '',
    pix_numero: '',
    pix_banco: '',
  })

  useEffect(() => {
    if (open && profile) {
      setFormData({
        nome: profile.nome || '',
        email: profile.email || '',
        telefone: profile.telefone || '',
        pix_tipo: profile.pix_tipo || '',
        pix_numero: profile.pix_numero || '',
        pix_banco: profile.pix_banco || '',
      })
    }
  }, [open, profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (formData.email !== profile.email) {
        await userService.updateMyEmail(formData.email)
      }

      await userService.updateProfile(profile.id, {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        pix_tipo: formData.pix_tipo,
        pix_numero: formData.pix_numero,
        pix_banco: formData.pix_banco,
      })

      toast({ title: 'Sucesso', description: 'Seu perfil foi atualizado com sucesso.' })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao atualizar o perfil.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md uppercase">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-nuvia-navy font-black tracking-widest">
            <UserCircle className="w-5 h-5 text-primary" />
            MEU PERFIL
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">
                NOME DE EXIBIÇÃO
              </Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                className="font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">
                E-MAIL (ACESSO)
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="font-bold lowercase"
                disableUppercase
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">
                TELEFONE CONTATO
              </Label>
              <Input
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="font-bold"
              />
            </div>

            <div className="space-y-3 mt-4">
              <h4 className="font-black text-xs tracking-widest border-b pb-1 text-slate-500">
                DADOS BANCÁRIOS (PIX)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold">TIPO</Label>
                  <Input
                    value={formData.pix_tipo}
                    onChange={(e) => setFormData({ ...formData, pix_tipo: e.target.value })}
                    placeholder="EX: CPF"
                    className="font-bold text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold">CHAVE</Label>
                  <Input
                    value={formData.pix_numero}
                    onChange={(e) => setFormData({ ...formData, pix_numero: e.target.value })}
                    placeholder="CHAVE PIX"
                    className="font-bold text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold">BANCO</Label>
                  <Input
                    value={formData.pix_banco}
                    onChange={(e) => setFormData({ ...formData, pix_banco: e.target.value })}
                    placeholder="BANCO"
                    className="font-bold text-xs h-9"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="font-bold tracking-widest"
            >
              CANCELAR
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-widest shadow-md"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              SALVAR PERFIL
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
