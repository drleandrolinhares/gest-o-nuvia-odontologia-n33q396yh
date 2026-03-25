import { useState } from 'react'
import type { Control } from 'react-hook-form'
import { TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Key, Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import useAppStore, { type Employee } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType }) => (
  <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0 uppercase">
    {Icon && <Icon className="w-5 h-5 text-nuvia-gold" />}
    <h3 className="text-lg font-semibold text-nuvia-navy">{title}</h3>
  </div>
)

interface SecurityTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  isEditingData: boolean
  employee: Employee | null
}

export function SecurityTab({ control, isEditingData, employee }: SecurityTabProps) {
  const { generateEmployeeAccess } = useAppStore()
  const { toast } = useToast()
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isGenerateAccessMode, setIsGenerateAccessMode] = useState(false)
  const [genEmail, setGenEmail] = useState(employee?.email || '')
  const [genPass, setGenPass] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateAccess = async () => {
    if (!employee) return
    setIsGenerating(true)
    const res = await generateEmployeeAccess(employee.id, genEmail, genPass, employee.name)
    setIsGenerating(false)
    if (res.success) {
      toast({ title: 'Sucesso', description: 'Acesso criado com sucesso!' })
      setIsGenerateAccessMode(false)
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: res.error?.message || 'Erro ao gerar acesso.',
      })
    }
  }

  return (
    <TabsContent value="seguranca" className="m-0 space-y-8 max-w-4xl">
      {!employee?.user_id ? (
        <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
          <SectionTitle title="CONTA DE ACESSO" icon={Key} />
          {!isGenerateAccessMode ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-nuvia-navy mb-2">CONTA NÃO VINCULADA</h3>
              <p className="text-muted-foreground text-sm text-center max-w-md mb-6">
                ESTE COLABORADOR NÃO POSSUI ACESSO AO SISTEMA VINCULADO.
              </p>
              <Button
                type="button"
                onClick={() => setIsGenerateAccessMode(true)}
                className="bg-nuvia-gold hover:bg-nuvia-gold/90 text-nuvia-navy font-bold"
              >
                <Key className="w-4 h-4 mr-2" /> GERAR ACESSO
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">E-MAIL (LOGIN) *</label>
                <Input
                  value={genEmail}
                  onChange={(e) => setGenEmail(e.target.value)}
                  disabled={isGenerating}
                  type="email"
                  className="lowercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SENHA PROVISÓRIA *</label>
                <Input
                  value={genPass}
                  onChange={(e) => setGenPass(e.target.value)}
                  disabled={isGenerating}
                  type="text"
                  minLength={6}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsGenerateAccessMode(false)}
                  disabled={isGenerating}
                >
                  CANCELAR
                </Button>
                <Button
                  type="button"
                  onClick={handleGenerateAccess}
                  disabled={isGenerating || !genEmail || !genPass}
                  className="bg-nuvia-gold hover:bg-nuvia-gold/90 text-nuvia-navy font-bold"
                >
                  {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} CONFIRMAR
                  GERAÇÃO DE ACESSO
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
            <SectionTitle title="CONTROLE MESTRE" icon={Shield} />
            <FormField
              control={control}
              name="noSystemAccess"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-red-50/50 border-red-200">
                  <div className="space-y-0.5">
                    <FormLabel className="font-bold text-red-900">SEM ACESSO AO SISTEMA</FormLabel>
                    <FormDescription className="text-xs text-red-700">
                      BLOQUEIA O LOGIN E OCULTA O USUÁRIO DAS LISTAS DE SELEÇÃO E AGENDAMENTOS.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isEditingData}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="bg-white p-6 rounded-xl border border-muted/50 shadow-sm">
            <SectionTitle title="CREDENCIAIS DE ACESSO" icon={Key} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="username"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>USERNAME DE ACESSO</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-background"
                        placeholder="EX: JOAO.SILVA"
                        disabled={!isEditingData}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NOVA SENHA</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          {...field}
                          className="bg-background pr-10"
                          placeholder="••••••••"
                          disabled={!isEditingData}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={!isEditingData}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CONFIRMAR NOVA SENHA</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                          className="bg-background pr-10"
                          placeholder="••••••••"
                          disabled={!isEditingData}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={!isEditingData}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <Shield className="w-4 h-4 inline-block mr-1 mb-0.5" />
              AS ALTERAÇÕES DE SENHA REFLETIRÃO NO PRÓXIMO LOGIN DO COLABORADOR.
            </p>
          </div>
        </div>
      )}
    </TabsContent>
  )
}
