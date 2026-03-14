import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-white space-y-6">
          <AlertTriangle className="h-16 w-16 text-red-500" />
          <div className="text-center space-y-2 px-4">
            <h2 className="text-2xl font-bold tracking-widest uppercase text-[#D4AF37]">
              Erro Inesperado
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Ocorreu um problema ao renderizar a interface. Verifique sua conexão e tente
              novamente.
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#D4AF37] hover:bg-[#B3932D] text-[#0A192F] font-bold uppercase"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Recarregar Aplicação
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
