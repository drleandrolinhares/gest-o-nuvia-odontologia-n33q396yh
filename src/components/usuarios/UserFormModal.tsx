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
import { Loader2, UserPlus, Pencil } from 'lucide-react'

export function UserFormModal({ open, onOpenChange, user, cargos, departamentos, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    cpf: '',
    telefone: '',
    data_nascimento: '',
    data_admissao: '',
    cargo_id: 'none',
    departamento_id: 'none',
    pix_tipo: '',
    pix_numero: '',
    pix_banco: '',
  })

  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          nome: user?.nome || '',
          email: user?.email || '',
          password: '',
          cpf: user?.cpf || '',
          telefone: user?.telefone || '',
          data_nascimento: user?.data_nascimento || '',
          data_admissao: user?.data_admissao || '',
          cargo_id: user?.cargo_id || 'none',
          departamento_id: user?.departamento_id || 'none',
          pix_tipo: user?.pix_tipo || '',
          pix_numero: user?.pix_numero || '',
          pix_banco: user?.pix_banco || '',
        })
      } else {
        setFormData({
          nome: '',
          email: '',
          password: '',
          cpf: '',
          telefone: '',
          data_nascimento: '',
          data_admissao: '',
          cargo_id: 'none',
          departamento_id: 'none',
          pix_tipo: '',
          pix_numero: '',
          pix_banco: '',
        })
      }
    }
  }, [open, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let profileId = user?.id

      if (!user) {
        if (!formData.email || !formData.password || !formData.nome) {
          throw new Error('Nome, E-mail e Senha são obrigatórios para novos usuários.')
        }
        profileId = await userService.createUser(formData.email, formData.password, formData.nome)
      }

      if (profileId) {
        await userService.updateProfile(profileId, {
          nome: formData.nome,
          cpf: formData.cpf || null,
          telefone: formData.telefone || null,
          data_nascimento: formData.data_nascimento || null,
          data_admissao: formData.data_admissao || null,
          cargo_id: formData.cargo_id !== 'none' ? formData.cargo_id : null,
          departamento_id: formData.departamento_id !== 'none' ? formData.departamento_id : null,
          pix_tipo: formData.pix_tipo || null,
          pix_numero: formData.pix_numero || null,
          pix_banco: formData.pix_banco || null,
        })
      }

      toast({
        title: 'Sucesso',
        description: `Usuário ${user ? 'atualizado' : 'criado'} com sucesso.`,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro.',
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
            {user ? (
              <Pencil className="w-5 h-5 text-primary" />
            ) : (
              <UserPlus className="w-5 h-5 text-primary" />
            )}
            {user ? 'EDITAR USUÁRIO' : 'NOVO USUÁRIO'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">
                NOME COMPLETO
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
                E-MAIL
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!!user}
                required
                className="font-bold lowercase"
                disableUppercase
              />
            </div>
            {!user && (
              <div className="space-y-2">
                <Label className="text-xs font-bold tracking-widest text-muted-foreground">
                  SENHA TEMPORÁRIA
                </Label>
                <Input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="font-bold normal-case"
                  disableUppercase
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">CPF</Label>
              <Input
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className="font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">
                TELEFONE
              </Label>
              <Input
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">
                DATA DE NASCIMENTO
              </Label>
              <Input
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                className="font-bold uppercase"
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
                  {cargos.map((c: any) => (
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
                  {departamentos.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 md:col-span-2 mt-2">
              <h4 className="font-black text-xs tracking-widest border-b pb-1 text-slate-500">
                DADOS BANCÁRIOS (PIX)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold">TIPO DE CHAVE</Label>
                  <Input
                    value={formData.pix_tipo}
                    onChange={(e) => setFormData({ ...formData, pix_tipo: e.target.value })}
                    placeholder="CPF, EMAIL, CELULAR..."
                    className="font-bold text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold">CHAVE PIX</Label>
                  <Input
                    value={formData.pix_numero}
                    onChange={(e) => setFormData({ ...formData, pix_numero: e.target.value })}
                    placeholder="000.000.000-00"
                    className="font-bold text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold">BANCO</Label>
                  <Input
                    value={formData.pix_banco}
                    onChange={(e) => setFormData({ ...formData, pix_banco: e.target.value })}
                    placeholder="NUBANK, ITAÚ..."
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
              {user ? 'SALVAR ALTERAÇÕES' : 'CRIAR USUÁRIO'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
