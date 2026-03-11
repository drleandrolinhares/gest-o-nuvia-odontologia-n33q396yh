import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 uppercase">
      <h1 className="text-6xl font-bold text-nuvia-navy">404</h1>
      <h2 className="text-2xl font-semibold">PÁGINA NÃO ENCONTRADA</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        A SEÇÃO QUE VOCÊ TENTOU ACESSAR NÃO EXISTE OU FOI MOVIDA. VERIFIQUE O LINK OU RETORNE AO
        PAINEL INICIAL.
      </p>
      <Link to="/admin">
        <Button size="lg">VOLTAR PARA O DASHBOARD</Button>
      </Link>
    </div>
  )
}
