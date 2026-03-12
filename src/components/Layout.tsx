import { Link, Outlet } from 'react-router-dom'
import { publicNavigation } from '@/config/navigation'
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-nuvia-blue text-white shadow-sm">
        <div className="container flex h-24 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <svg
                viewBox="0 0 100 60"
                className="h-10 w-16 text-nuvia-gold fill-none stroke-current stroke-[3]"
              >
                <path d="M30 40 C 10 40, 10 10, 30 10 C 45 10, 50 25, 50 25 C 50 25, 55 10, 70 10 C 90 10, 90 40, 70 40 C 55 40, 50 25, 50 25 C 50 25, 45 40, 30 40 Z" />
              </svg>
              <div className="flex flex-col ml-2">
                <span className="text-xl font-serif font-bold tracking-widest text-nuvia-gold">
                  NUVIA
                </span>
                <span className="text-[10px] tracking-widest text-slate-300">ODONTOLOGIA</span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex gap-4">
            {publicNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="bg-nuvia-gold/10 border border-nuvia-gold/30 text-nuvia-gold hover:bg-nuvia-gold hover:text-nuvia-blue px-5 py-2 rounded-sm font-medium transition-all duration-300 text-sm tracking-wide"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <nav className="flex md:hidden overflow-x-auto gap-2 pb-2 -mb-2 no-scrollbar max-w-[50vw]">
            {publicNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="whitespace-nowrap bg-nuvia-gold/10 border border-nuvia-gold/30 text-nuvia-gold px-3 py-1 rounded-sm text-xs transition-all"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <a
        href="https://wa.me/5511952687760"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-50 hover:bg-[#1EBE5D] transition-transform duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="h-8 w-8" />
      </a>

      <footer className="bg-nuvia-dark text-slate-300 pt-16 pb-8 border-t-4 border-nuvia-gold">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="flex flex-col items-center md:items-start space-y-6">
              <div className="flex items-center">
                <svg
                  viewBox="0 0 100 60"
                  className="h-16 w-24 text-nuvia-gold fill-none stroke-current stroke-[2]"
                >
                  <path d="M30 40 C 10 40, 10 10, 30 10 C 45 10, 50 25, 50 25 C 50 25, 55 10, 70 10 C 90 10, 90 40, 70 40 C 55 40, 50 25, 50 25 C 50 25, 45 40, 30 40 Z" />
                </svg>
                <div className="flex flex-col ml-3">
                  <span className="text-3xl font-serif font-bold tracking-widest text-nuvia-gold">
                    NUVIA
                  </span>
                  <span className="text-xs tracking-widest text-slate-400">ODONTOLOGIA</span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-nuvia-gold font-semibold text-lg mb-1">Responsável Técnico</h4>
                <p className="text-sm mb-1">Dr. Roberto Souza Filho</p>
                <div className="inline-block border border-nuvia-gold/40 text-nuvia-gold text-xs px-3 py-1 rounded mt-2">
                  CRO SP 97.044 - CROSP - CL 11.050
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-nuvia-gold font-bold text-lg mb-6 border-b-2 border-nuvia-gold inline-block pb-1">
                MENU
              </h4>
              <ul className="space-y-3">
                {publicNavigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="hover:text-nuvia-gold transition-colors flex items-center gap-2 text-sm"
                    >
                      <span className="text-nuvia-gold text-xs">❯</span> {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-nuvia-gold font-bold text-lg mb-6 border-b-2 border-nuvia-gold inline-block pb-1">
                CONTATO
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-nuvia-gold shrink-0 mt-0.5" />
                  <span>(11) 95268-7760</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-nuvia-gold shrink-0 mt-0.5" />
                  <span>atendimento@clinicanuvia.com.br</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-nuvia-gold shrink-0 mt-0.5" />
                  <span>
                    Av. Pres. Juscelino Kubitschek, 1545 – Conj
                    <br />
                    78 – Vila Nova Conceição
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-nuvia-gold font-bold text-lg mb-6 border-b-2 border-nuvia-gold inline-block pb-1">
                REDES SOCIAIS
              </h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-nuvia-gold/10 p-3 rounded-full hover:bg-nuvia-gold hover:text-nuvia-dark transition-colors text-nuvia-gold"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-nuvia-gold/10 p-3 rounded-full hover:bg-nuvia-gold hover:text-nuvia-dark transition-colors text-nuvia-gold"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-nuvia-gold/10 p-3 rounded-full hover:bg-nuvia-gold hover:text-nuvia-dark transition-colors text-nuvia-gold"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© 2026 Nuvia Odontologia. Todos os direitos reservados.</p>
            <p>Desenvolvido com sofisticação.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
