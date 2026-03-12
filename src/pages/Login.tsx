import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    <div className="min-h-screen w-full flex bg-background font-sans">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 lg:px-24 bg-nuvia-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nuvia-gold to-transparent"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl lg:text-5xl font-serif text-nuvia-gold leading-tight">
            Porque sorrir, para Nuvia, é mais que mostrar dentes é revelar quem se é, com verdade e
            elegância.
          </h1>
        </div>
      </div>

      {/* Right panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 relative bg-white">
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'uppercase text-xs font-bold tracking-wider text-muted-foreground hover:text-nuvia-navy',
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            ACESSAR PORTAL
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-8 animate-fade-in-up">
          <div className="flex flex-col items-center text-center space-y-6">
            <img src={logoUrl} alt="Nuvia Odontologia" className="h-16 object-contain" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-nuvia-navy uppercase tracking-widest">
                ÁREA RESTRITA
              </h2>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                ACESSO EXCLUSIVO PARA COLABORADORES.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-bold uppercase">{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label className="text-xs font-bold text-nuvia-navy uppercase tracking-widest">
                E-MAIL
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="SEU@EMAIL.COM"
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-nuvia-navy uppercase tracking-widest">
                  SENHA
                </label>
                <Dialog onOpenChange={(open) => !open && setResetSent(false)}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-[10px] font-bold text-nuvia-gold hover:underline uppercase tracking-widest"
                    >
                      ESQUECI MINHA SENHA
                    </button>
                  </DialogTrigger>
                  <DialogContent className="uppercase border-nuvia-navy/10">
                    <DialogHeader>
                      <DialogTitle className="text-nuvia-navy">RECUPERAR SENHA</DialogTitle>
                      <DialogDescription>
                        INFORME SEU E-MAIL CADASTRADO PARA RECEBER AS INSTRUÇÕES DE REDEFINIÇÃO DE
                        SENHA.
                      </DialogDescription>
                    </DialogHeader>
                    {!resetSent ? (
                      <form onSubmit={handleResetPassword} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-nuvia-navy">E-MAIL</label>
                          <Input
                            type="email"
                            required
                            placeholder="SEU@EMAIL.COM"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full font-bold tracking-widest bg-nuvia-navy hover:bg-nuvia-navy/90 text-white"
                        >
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-nuvia-navy transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-6 bg-nuvia-gold hover:bg-nuvia-gold/90 text-nuvia-navy text-sm h-12 tracking-widest font-black uppercase transition-colors"
            >
              ENTRAR NO SISTEMA
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
