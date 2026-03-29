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
import { Loader2, UserCircle, Star, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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

  const isAdmin =
    profile?.isAdmin === true ||
    profile?.user_roles?.some((ur: any) =>
      ['ADMIN', 'MASTER', 'DIRETORIA'].includes(ur?.roles?.name?.toUpperCase()),
    ) === true

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    pix_tipo: '',
    pix_numero: '',
    pix_banco: '',
    data_admissao: '',
    departamento_id: 'none',
    cargos_list: [] as { cargo_id: string; cargo_nome: string; is_principal: boolean }[],
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
        departamento_id: profile?.departamento_id || 'none',
        cargos_list:
          profile?.user_cargos?.map((c: any) => ({
            cargo_id: c.cargo_id,
            cargo_nome: c.cargo,
            is_principal: c.is_principal,
          })) ||
          (profile?.cargo_id && profile?.cargo_id !== 'none'
            ? [
                {
                  cargo_id: profile.cargo_id,
                  cargo_nome: cargos?.find((c: any) => c.id === profile.cargo_id)?.nome || '',
                  is_principal: true,
                },
              ]
            : []),
      })
    }
  }, [open, profile, cargos])

  const addCargo = (cargoId: string) => {
    if (cargoId === 'none' || !cargoId) return
    const cargoObj = cargos.find((c: any) => c.id === cargoId)
    if (!cargoObj) return

    const isFirst = formData.cargos_list.length === 0

    setFormData((prev) => ({
      ...prev,
      cargos_list: [
        ...prev.cargos_list,
        {
          cargo_id: cargoId,
          cargo_nome: cargoObj.nome,
          is_principal: isFirst,
        },
      ],
    }))
  }

  const removeCargo = (cargoId: string) => {
    setFormData((prev) => {
      const newList = prev.cargos_list.filter((c) => c.cargo_id !== cargoId)
      if (newList.length > 0 && !newList.some((c) => c.is_principal)) {
        newList[0].is_principal = true
      }
      return { ...prev, cargos_list: newList }
    })
  }

  const setPrincipalCargo = (cargoId: string) => {
    setFormData((prev) => ({
      ...prev,
      cargos_list: prev.cargos_list.map((c) => ({
        ...c,
        is_principal: c.cargo_id === cargoId,
      })),
    }))
  }

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
        cargos_list: formData.cargos_list,
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

            <div className="space-y-2 md:col-span-2 mt-2">
              <Label className="text-xs font-bold tracking-widest text-muted-foreground">
                CARGOS
              </Label>
              <div className="space-y-2">
                {formData.cargos_list.length === 0 && (
                  <div className="text-xs text-muted-foreground italic p-2 border rounded-md bg-muted/10">
                    Nenhum cargo atribuído.
                  </div>
                )}
                {formData.cargos_list.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 border rounded-md bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm uppercase">{c.cargo_nome}</span>
                      {c.is_principal && (
                        <Badge variant="default" className="text-[10px]">
                          PRINCIPAL
                        </Badge>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        {!c.is_principal && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
                            onClick={() => setPrincipalCargo(c.cargo_id)}
                            title="Tornar Principal"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeCargo(c.cargo_id)}
                          title="Remover Cargo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {isAdmin && (
                  <Select value="none" onValueChange={addCargo}>
                    <SelectTrigger className="font-bold border-dashed text-muted-foreground">
                      <SelectValue placeholder="+ ADICIONAR CARGO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="hidden">
                        SELECIONE...
                      </SelectItem>
                      {cargos
                        .filter(
                          (c: any) => !formData.cargos_list.some((fc) => fc.cargo_id === c.id),
                        )
                        .map((c: any) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nome}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
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
