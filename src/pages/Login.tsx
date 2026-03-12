import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import logoUrl from '@/assets/nuvia_logo__horizontal_by_souza_filho_original-5cc4a.png'
import { AlertCircle, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error: signInError } = await signIn(email, password)
    if (!signInError) {
      navigate('/admin')
    } else {
      setError('CREDENCIAIS INVÁLIDAS. VERIFIQUE SEU EMAIL E SENHA.')
    }
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setResetSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 uppercase relative">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'uppercase text-xs font-bold tracking-wider text-muted-foreground hover:text-foreground',
          )}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ACESSAR PORTAL
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="space-y-4 items-center text-center">
          <img src={logoUrl} alt="Nuvia" className="h-10 mb-2" />
          <CardTitle className="text-2xl text-nuvia-navy">ÁREA RESTRITA</CardTitle>
          <CardDescription>ACESSO EXCLUSIVO PARA COLABORADORES DA CLÍNICA.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-bold">{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">E-MAIL</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="SEU@EMAIL.COM"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-muted-foreground">SENHA</label>
                <Dialog onOpenChange={(open) => !open && setResetSent(false)}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      ESQUECI MINHA SENHA
                    </button>
                  </DialogTrigger>
                  <DialogContent className="uppercase">
                    <DialogHeader>
                      <DialogTitle>RECUPERAR SENHA</DialogTitle>
                      <DialogDescription>
                        INFORME SEU E-MAIL CADASTRADO PARA RECEBER AS INSTRUÇÕES DE REDEFINIÇÃO DE
                        SENHA.
                      </DialogDescription>
                    </DialogHeader>
                    {!resetSent ? (
                      <form onSubmit={handleResetPassword} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-muted-foreground">E-MAIL</label>
                          <Input
                            type="email"
                            required
                            placeholder="SEU@EMAIL.COM"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                          />
                        </div>
                        <Button type="submit" className="w-full font-bold tracking-widest">
                          ENVIAR INSTRUÇÕES
                        </Button>
                      </form>
                    ) : (
                      <div className="pt-4 space-y-4">
                        <Alert className="bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription className="font-bold text-xs">
                            INSTRUÇÕES ENVIADAS PARA {resetEmail} COM SUCESSO!
                          </AlertDescription>
                        </Alert>
                        <Button
                          type="button"
                          className="w-full font-bold"
                          variant="outline"
                          onClick={() => setResetSent(false)}
                        >
                          ENVIAR NOVAMENTE
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-primary text-white text-md h-12 tracking-widest font-bold"
            >
              ENTRAR NO SISTEMA
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
