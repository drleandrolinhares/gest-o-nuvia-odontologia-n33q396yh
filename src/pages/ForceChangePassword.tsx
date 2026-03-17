import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import logoImg from '@/assets/img_3243-2f960.jpg'

export default function ForceChangePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    let isMounted = true
    if (!loading && !user) {
      navigate('/login', { replace: true })
    } else if (!loading && user) {
      supabase
        .from('profiles')
        .select('must_change_password')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (isMounted && data && !data.must_change_password) {
            navigate('/admin/dashboard', { replace: true })
          }
        })
    }
    return () => {
      isMounted = false
    }
  }, [user, loading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({ title: 'Erro', description: 'As senhas não conferem.', variant: 'destructive' })
      return
    }
    if (password.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter no mínimo 6 caracteres.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ must_change_password: false })
          .eq('id', user.id)
        if (profileError) throw profileError
      }

      toast({ title: 'Sucesso', description: 'Senha atualizada com sucesso. Bem-vindo!' })
      window.location.href = '/admin/dashboard'
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err.message || 'Falha ao atualizar senha.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const { error } = await signOut()
      if (error) throw error
      navigate('/login', { replace: true })
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err.message || 'Falha ao sair da conta.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0A192F] z-0">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[#D4AF37]/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-[#D4AF37]/10 rounded-full blur-[120px]"></div>
      </div>
      <div className="w-full max-w-md relative z-10 flex flex-col items-center animate-fade-in-up">
        <div className="mb-8 block">
          <img
            src={logoImg}
            alt="Nuvia Odontologia"
            className="h-20 w-auto rounded-lg shadow-xl border border-white/10 object-contain"
          />
        </div>
        <Card className="w-full border-slate-200 shadow-2xl backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-6">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-[#0A192F] uppercase tracking-wider">
              Atualização Obrigatória
            </CardTitle>
            <CardDescription className="text-slate-600 font-medium mt-2 leading-relaxed">
              Sua senha foi redefinida por um administrador. Por favor, crie uma nova senha para
              continuar o acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nova Senha</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10 normal-case bg-white border-slate-300 focus-visible:ring-[#D4AF37]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confirmar Nova Senha</Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="normal-case bg-white border-slate-300 focus-visible:ring-[#D4AF37]"
                  required
                />
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-[#0A192F] hover:bg-[#112240] text-white h-11 text-base transition-colors font-bold uppercase"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Atualizar Senha
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full h-11 text-sm font-bold uppercase text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  SAIR DA CONTA
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
