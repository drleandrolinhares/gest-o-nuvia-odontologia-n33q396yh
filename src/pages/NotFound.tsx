import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <h1 className="text-6xl font-bold text-nuvia-navy">404</h1>
      <h2 className="text-2xl font-semibold">Página não encontrada</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        A seção que você tentou acessar não existe ou foi movida. Verifique o link ou retorne ao
        painel inicial.
      </p>
      <Link to="/">
        <Button size="lg">Voltar para o Dashboard</Button>
      </Link>
    </div>
  )
}
