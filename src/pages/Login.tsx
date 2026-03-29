import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, session, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || '/'

  // Segurança extra: Limpar cache residual se a URL contiver '?clear=1'
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('clear') === '1') {
      localStorage.clear()
      sessionStorage.clear()
      signOut().then(() => {
        window.location.replace('/login')
      })
    }
  }, [location, signOut])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (session && searchParams.get('clear') !== '1') {
      navigate(from, { replace: true })
    }
  }, [session, navigate, from, location.search])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        toast({
          title: 'Erro ao entrar',
          description: error.message,
          variant: 'destructive',
        })
        return
      }

      // Validação inicial do perfil após login - Atualizado para usar user_cargos e evitar erro 400
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .select('id,nome,user_cargos(cargo_id,cargo)')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Falha ao carregar perfil:', profileError.message)
        }
      }

      toast({
        title: 'Bem-vindo!',
        description: 'Login realizado com sucesso.',
      })

      navigate(from, { replace: true })
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Acesso ao Sistema</CardTitle>
          <CardDescription>Digite suas credenciais para acessar a plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
