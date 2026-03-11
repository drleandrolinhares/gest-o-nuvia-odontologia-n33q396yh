import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import logoUrl from '@/assets/nuvia_logo__horizontal_by_souza_filho_original-5cc4a.png'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAppStore()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (login(email, password)) {
      navigate('/admin')
    } else {
      setError('CREDENCIAIS INVÁLIDAS. VERIFIQUE SEU EMAIL E SENHA.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 uppercase">
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
              <label className="text-sm font-bold text-muted-foreground">SENHA</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-primary text-white text-md h-12 tracking-widest font-bold"
            >
              ENTRAR NO SISTEMA
            </Button>
            <div className="text-center mt-6">
              <p className="text-xs text-muted-foreground leading-relaxed">
                CREDENCIAIS DE DEMONSTRAÇÃO:
                <br />
                <span className="font-bold text-foreground">ADMIN@NUVIA.COM / ADMIN123</span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
