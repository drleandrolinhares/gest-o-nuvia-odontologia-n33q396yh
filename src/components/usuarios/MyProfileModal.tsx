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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { userService } from '@/services/userService'
import { Loader2, UserCircle } from 'lucide-react'

export function MyProfileModal({
  open,
  onOpenChange,
  profile,
  cargos = [],
  departamentos = [],
  onSuccess,
}: any) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    pix_tipo: '',
    pix_numero: '',
    pix_banco: '',
    data_admissao: '',
    cargo_id: 'none',
    departamento_id: 'none',
  })

  useEffect(() => {
    if (open && profile) {
      setFormData({
        nome: profile?.nome || profile?.user_metadata?.name || '',
        email: profile?.email || '',
        telefone: profile?.telefone || '',
        pix_tipo: profile?.pix_tipo || '',
        pix_numero: profile?.pix_numero || '',
        pix_banco: profile?.pix_banco || '',
        data_admissao: profile?.data_admissao || '',
        cargo_id: profile?.cargo_id || 'none',
        departamento_id: profile?.departamento_id || 'none',
      })
    }
  }, [open, profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.id) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const newEmail = formData.email?.trim() || ''

    if (newEmail && !emailRegex.test(newEmail)) {
      toast({
        title: 'Erro de Validação',
        description: 'Por favor, insira um endereço de e-mail válido.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const currentEmail = profile?.email?.trim() || ''
      let emailError = null
      let finalEmail = currentEmail

      if (newEmail && newEmail !== currentEmail) {
        try {
          await userService.updateMyEmail(newEmail)
          finalEmail = newEmail
        } catch (emailErr: any) {
          console.error('Erro ao atualizar e-mail no Auth:', emailErr)
          if (emailErr?.status === 429 || emailErr?.message?.includes('Rate Limit')) {
            emailError =
              'Limite de tentativas excedido. Aguarde alguns instantes antes de alterar o e-mail novamente.'
          } else if (
            emailErr?.status === 400 ||
            emailErr?.message?.toLowerCase().includes('invalid')
          ) {
            emailError = 'O e-mail informado é considerado inválido pelo sistema.'
          } else {
            emailError = emailErr?.message || 'Erro desconhecido ao atualizar e-mail de acesso.'
          }
        }
      }

      await userService.updateProfile(profile.id, {
        nome: formData.nome,
        email: finalEmail,
        telefone: formData.telefone || null,
        pix_tipo: formData.pix_tipo || null,
        pix_numero: formData.pix_numero || null,
        pix_banco: formData.pix_banco || null,
        data_admissao: formData.data_admissao || null,
        cargo_id: formData.cargo_id !== 'none' ? formData.cargo_id : null,
        departamento_id: formData.departamento_id !== 'none' ? formData.departamento_id : null,
      })

      if (emailError) {
        toast({
          title: 'Perfil salvo parcialmente',
          description: `Seus dados foram atualizados, mas o e-mail não pôde ser alterado: ${emailError}`,
          variant: 'destructive',
        })
      } else {
        toast({ title: 'Sucesso', description: 'Seu perfil foi atualizado com sucesso.' })
      }

      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: 'Erro ao Salvar',
        description: error?.message || 'Ocorreu um erro ao atualizar o perfil.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl uppercase">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-nuvia-navy font-black tracking-widest">
            <UserCircle className="w-5 h-5 text-primary" />
            MEU PERFIL
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
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
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">
                DATA DE ADMISSÃO
              </Label>
              <Input
                type="date"
                value={formData.data_admissao}
                onChange={(e) => setFormData({ ...formData, data_admissao: e.target.value })}
                className="font-bold uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">
                CARGO
              </Label>
              <Select
                value={formData.cargo_id}
                onValueChange={(v) => setFormData({ ...formData, cargo_id: v })}
              >
                <SelectTrigger className="font-bold">
                  <SelectValue placeholder="SELECIONE..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">NENHUM</SelectItem>
                  {(cargos || []).map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">
                DEPARTAMENTO
              </Label>
              <Select
                value={formData.departamento_id}
                onValueChange={(v) => setFormData({ ...formData, departamento_id: v })}
              >
                <SelectTrigger className="font-bold">
                  <SelectValue placeholder="SELECIONE..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">NENHUM</SelectItem>
                  {(departamentos || []).map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 md:col-span-2 mt-4">
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
