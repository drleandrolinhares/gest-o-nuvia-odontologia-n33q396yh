import React, { Component, ErrorInfo, ReactNode, useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Menu,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'

const NuviaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 350 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M95 65 C95 85, 75 95, 55 90 C30 80, 25 50, 45 35 C65 20, 95 30, 105 50 C115 70, 95 90, 80 90"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M45 45 C35 55, 35 75, 55 80"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <text
      x="130"
      y="45"
      fontFamily="sans-serif"
      fontSize="38"
      fontWeight="300"
      letterSpacing="0.05em"
      fill="currentColor"
    >
      N U V I Λ
    </text>
    <text x="130" y="75" fontFamily="serif" fontSize="24" fill="currentColor">
      Odontologia
    </text>
    <text
      x="130"
      y="95"
      fontFamily="sans-serif"
      fontSize="10"
      letterSpacing="0.1em"
      fill="currentColor"
    >
      BY SOUZA FILHO
    </text>
  </svg>
)

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('PublicHome ErrorBoundary caught an error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center p-4">
          <div className="space-y-4 bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 uppercase">Erro na Aplicação</h2>
            <p className="text-slate-600">
              Ocorreu um erro inesperado ao carregar esta página. Por favor, tente recarregar.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#C69B56] hover:bg-[#b58c49] text-white w-full uppercase tracking-widest font-bold"
            >
              Recarregar Página
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const NAV_ITEMS = [
  { label: 'HOME', href: '#' },
  { label: 'ATELIÊ ORAL', href: '#' },
  { label: 'LENTES DE CONTATO', href: '#' },
  { label: 'TRATAMENTOS', href: '#' },
  { label: 'CLIENTES', href: '#' },
  { label: 'MAIS SOBRE NÓS', href: '#' },
  { label: 'CONTATO', href: '#' },
]

const HERO_IMAGES = [
  'https://img.usecurling.com/p/1600/900?q=smiling%20older%20man',
  'https://img.usecurling.com/p/1600/900?q=dentist%20office',
  'https://img.usecurling.com/p/1600/900?q=perfect%20smile',
]

function PublicHomeContent() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Ensure authenticated users can quickly access the dashboard without being trapped
  const handleAccessClick = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.preventDefault()
      if (authLoading) return

      if (!user) {
        navigate('/login')
      } else {
        navigate('/admin')
      }
    },
    [user, authLoading, navigate],
  )

  const nextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
  }, [])

  const prevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextImage, 6000)
    return () => clearInterval(timer)
  }, [nextImage])

  // AC: Route Protection & Route Synchronization
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A192F]">
        <Loader2 className="h-10 w-10 text-[#C69B56] animate-spin mb-4" />
        <p className="text-[#C69B56] text-sm uppercase tracking-widest font-semibold">
          Carregando...
        </p>
      </div>
    )
  }

  // Prevents the routing engine from defaulting to public view if logged in
  if (user) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-[#0A192F]/90 to-transparent pb-10">
        <div className="container mx-auto px-4 lg:px-8 h-24 flex items-center justify-between">
          <div className="w-auto lg:w-1/4 flex justify-start">
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity text-[#C69B56]"
            >
              <NuviaLogo className="h-12 md:h-14 lg:h-16" />
            </Link>
          </div>

          <div className="hidden xl:flex flex-1 justify-center">
            <nav className="flex gap-6 lg:gap-8 items-center mt-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[10px] lg:text-[11px] font-semibold tracking-[0.15em] text-white hover:text-[#C69B56] transition-colors uppercase"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="w-auto xl:w-1/4 flex justify-end">
            <div className="hidden xl:flex items-center mt-2">
              <Button
                onClick={handleAccessClick}
                disabled={authLoading}
                className="bg-transparent border border-white/30 text-white hover:bg-[#C69B56] hover:border-[#C69B56] hover:text-white tracking-widest uppercase text-[10px] font-bold h-10 px-6 rounded-none transition-all"
              >
                Acesso Restrito
              </Button>
            </div>

            <div className="xl:hidden flex items-center mt-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="h-8 w-8" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#0A192F] border-l-slate-800 p-0 w-80">
                  <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                  <div className="flex flex-col h-full py-8">
                    <div className="px-8 mb-12 flex justify-center text-[#C69B56]">
                      <NuviaLogo className="h-16" />
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 space-y-1">
                      {NAV_ITEMS.map((item) => (
                        <SheetClose asChild key={item.label}>
                          <a
                            href={item.href}
                            className="flex items-center justify-between w-full p-4 text-xs font-semibold tracking-[0.2em] text-slate-300 hover:text-[#C69B56] hover:bg-white/5 rounded-lg transition-colors uppercase"
                          >
                            {item.label}
                            <ChevronRight className="h-4 w-4 opacity-50" />
                          </a>
                        </SheetClose>
                      ))}
                    </div>
                    <div className="p-8 border-t border-slate-800 mt-auto">
                      <SheetClose asChild>
                        <Button
                          onClick={handleAccessClick}
                          disabled={authLoading}
                          className="w-full bg-[#C69B56] text-white hover:bg-[#b58c49] font-bold tracking-widest uppercase text-xs h-12 rounded-none transition-colors"
                        >
                          Acesso Restrito
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full pt-40 pb-56 md:pt-48 md:pb-64 flex items-center bg-[#0A192F] min-h-[700px] lg:min-h-[850px] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              key={activeImageIndex}
              src={HERO_IMAGES[activeImageIndex]}
              alt="Cliente sorrindo"
              className="w-full h-full object-cover object-center opacity-70 animate-fade-in"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F]/95 via-[#0A192F]/70 to-[#0A192F]/20"></div>
          </div>

          <button
            onClick={prevImage}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/70 text-white rounded-full items-center justify-center backdrop-blur-sm transition-colors z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/70 text-white rounded-full items-center justify-center backdrop-blur-sm transition-colors z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="container mx-auto px-4 md:px-16 lg:px-24 relative z-10 text-white w-full">
            <div className="max-w-2xl animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-[1.1] drop-shadow-xl">
                CONHEÇA ALGUNS DE
                <br />
                <span className="text-[#C69B56]">NOSSOS CLIENTES</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-200 mb-10 font-light drop-shadow-md leading-relaxed max-w-xl">
                Descubra por eles sobre a durabilidade das nossas porcelanas e qual impacto este
                tratamento pode causar na sua vida
              </p>
              <Button className="bg-[#C69B56] hover:bg-[#b58c49] text-white text-base font-semibold px-10 py-6 rounded-none tracking-widest transition-all shadow-xl uppercase">
                Saiba Mais
              </Button>
            </div>
          </div>
        </section>

        <section
          className="relative z-20 -mt-24 md:-mt-32 px-4 mb-20 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="container mx-auto max-w-6xl">
            <div className="bg-white/95 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-stretch border border-slate-100/50">
              <div className="flex-1 p-6 md:p-8 lg:p-10 flex items-start gap-4 md:border-r border-b md:border-b-0 border-slate-200">
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 md:w-12 h-12 rounded-full border border-[#C69B56]/60 flex items-center justify-center bg-white text-[#C69B56]">
                    <Clock className="w-5 h-5 md:w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base md:text-lg lg:text-xl font-serif text-slate-800 leading-snug mb-2">
                    Segunda - Sexta:
                    <br className="hidden md:block" /> 08h - 18h
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-light">
                    Sábado e Domingo - Fechado
                  </p>
                </div>
              </div>

              <div className="flex-1 p-6 md:p-8 lg:p-10 flex items-start gap-4 md:border-r border-b md:border-b-0 border-slate-200">
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 md:w-12 h-12 rounded-full border border-[#C69B56]/60 flex items-center justify-center bg-white text-[#C69B56]">
                    <Phone className="w-5 h-5 md:w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base md:text-lg lg:text-xl font-serif text-slate-800 leading-snug mb-2">
                    (11) 96172-9130
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-light">(11) 3040-8884</p>
                </div>
              </div>

              <div className="flex-1 p-6 md:p-8 lg:p-10 flex items-start gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 md:w-12 h-12 rounded-full border border-[#C69B56]/60 flex items-center justify-center bg-white text-[#C69B56]">
                    <MapPin className="w-5 h-5 md:w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base md:text-lg lg:text-xl font-serif text-slate-800 leading-snug mb-2">
                    Endereço
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-light leading-relaxed">
                    Rua Tabapuã, 50 – Cj. 302 – 3º andar
                    <br />
                    Itaim Bibi, São Paulo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0A192F] text-slate-300 py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link
                to="/"
                className="inline-block hover:opacity-80 transition-opacity text-[#C69B56] mb-6"
              >
                <NuviaLogo className="h-12" />
              </Link>
              <p className="text-slate-400 max-w-sm mb-6 font-light leading-relaxed text-sm">
                Referência em odontologia estética e reabilitadora. Trazendo o que há de mais
                moderno para o seu sorriso.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#C69B56] hover:border-[#C69B56] hover:text-[#0A192F] transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#C69B56] hover:border-[#C69B56] hover:text-[#0A192F] transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-serif mb-6 text-lg tracking-wider">Links Rápidos</h4>
              <ul className="space-y-3 font-light text-sm">
                {NAV_ITEMS.slice(0, 4).map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="hover:text-[#C69B56] transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="pt-4 mt-4 border-t border-white/10">
                  <button
                    onClick={handleAccessClick}
                    className="text-[#C69B56] font-semibold hover:text-white transition-colors tracking-widest uppercase text-xs"
                  >
                    Acesso ao Sistema
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif mb-6 text-lg tracking-wider">Contato</h4>
              <ul className="space-y-4 font-light text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C69B56] shrink-0 mt-1" />
                  <span>
                    Rua Tabapuã, 50 – Cj. 302
                    <br />
                    Itaim Bibi, São Paulo
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C69B56] shrink-0" />
                  <span>(11) 96172-9130</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-light">
            <p>
              &copy; {new Date().getFullYear()} Nuvia Odontologia. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#C69B56] transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-[#C69B56] transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function PublicHome() {
  return (
    <ErrorBoundary>
      <PublicHomeContent />
    </ErrorBoundary>
  )
}
