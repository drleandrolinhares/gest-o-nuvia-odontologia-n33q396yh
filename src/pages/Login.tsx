import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'
import logoImg from '@/assets/img_3243-2f960.jpg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const from = location.state?.from?.pathname || '/admin'

  useEffect(() => {
    // Prevent infinite loops or showing login to already authenticated users
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(email.trim().toLowerCase(), password, keepSignedIn)

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Credenciais inválidas',
          description: 'Erro ao acessar: E-mail ou senha incorretos.',
        })
        return
      }

      // Successful login automatically navigates to DASH NUVIA or requested route
      navigate(from, { replace: true })
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Ocorreu um erro inesperado ao tentar acessar.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[#0A192F] z-0">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[#D4AF37]/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-[#D4AF37]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        <Link to="/" className="mb-8 block hover:opacity-90 transition-opacity">
          <img
            src={logoImg}
            alt="Nuvia Odontologia"
            className="h-20 w-auto rounded-lg shadow-xl border border-white/10 object-contain"
          />
        </Link>

        <Card className="w-full border-slate-200 shadow-2xl backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-[#0A192F]">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-slate-500">
              Insira seu e-mail e senha para acessar a plataforma de gestão Nuvia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white border-slate-300 focus-visible:ring-[#D4AF37] normal-case disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700">
                    Senha
                  </Label>
                  <a
                    href="#"
                    className="text-xs text-[#0A192F] hover:text-[#D4AF37] font-medium transition-colors"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white border-slate-300 focus-visible:ring-[#D4AF37] pr-10 normal-case disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none transition-colors disabled:opacity-50"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="keepSignedIn"
                  checked={keepSignedIn}
                  onCheckedChange={(checked) => setKeepSignedIn(checked as boolean)}
                  disabled={isLoading}
                  className="data-[state=checked]:bg-[#0A192F] data-[state=checked]:border-[#0A192F]"
                />
                <Label
                  htmlFor="keepSignedIn"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 cursor-pointer"
                >
                  Permanecer conectado
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0A192F] hover:bg-[#112240] text-white mt-6 h-11 text-base transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  'Entrar no Dash Nuvia'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4 text-sm text-slate-500">
            <p>
              Precisa de acesso?{' '}
              <a
                href="#"
                className="text-[#0A192F] font-semibold hover:text-[#D4AF37] transition-colors"
              >
                Fale com o administrador
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
