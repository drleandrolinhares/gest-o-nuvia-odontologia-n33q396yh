import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Index from '@/pages/Index'
import Inventory from '@/pages/Inventory'
import Pricing from '@/pages/Pricing'
import Negotiation from '@/pages/Negotiation'
import AgendaSegmentation from '@/pages/AgendaSegmentation'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'
import Agenda from '@/pages/Agenda'
import Acessos from '@/pages/Acessos'
import AcessoManual from '@/pages/AcessoManual'
import Login from '@/pages/Login'
import Chat from '@/pages/Chat'
import SAC from '@/pages/SAC'
import GestaoFiscal from '@/pages/GestaoFiscal'
import KPIs from '@/pages/KPIs'
import ProtectedRoute from '@/components/ProtectedRoute'
import PermissionRoute from '@/components/PermissionRoute'
import AuditLog from '@/pages/AuditLog'
import ForceChangePassword from '@/pages/ForceChangePassword'
import DebugAccess from '@/pages/DebugAccess'
import AccessDenied from '@/pages/AccessDenied'
import UsuariosPermissoes from '@/pages/UsuariosPermissoes'
import Permissoes from '@/pages/Permissoes'

// Novos Módulos
import Comunicados from '@/pages/Comunicados'
import Performance from '@/pages/Performance'
import AvisosRecados from '@/pages/AvisosRecados'
import EscalaTrabalho from '@/pages/EscalaTrabalho'

import { AppProvider } from '@/stores/main'
import { AuthProvider } from '@/hooks/use-auth'
import { ChatProvider } from '@/stores/chat'
import { HubProvider } from '@/stores/hub'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/force-change-password" element={<ForceChangePassword />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HubProvider>
                      <ChatProvider>
                        <Layout />
                      </ChatProvider>
                    </HubProvider>
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <PermissionRoute module="DASHBOARD">
                      <Index />
                    </PermissionRoute>
                  }
                />

                {/* OPERACIONAL */}
                <Route
                  path="sac"
                  element={
                    <PermissionRoute module="SAC">
                      <SAC />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="rotina-diaria"
                  element={
                    <PermissionRoute module="AGENDA">
                      <Agenda />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="mensagens"
                  element={
                    <PermissionRoute module="MENSAGENS">
                      <Chat />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="performance"
                  element={
                    <PermissionRoute module="PERFORMANCE">
                      <Performance />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="comunicados"
                  element={
                    <PermissionRoute module="COMUNICADOS">
                      <Comunicados />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="avisos-e-recados"
                  element={
                    <PermissionRoute module="AVISOS">
                      <AvisosRecados />
                    </PermissionRoute>
                  }
                />

                {/* COMERCIAL */}
                <Route
                  path="negociacao"
                  element={
                    <PermissionRoute module="NEGOCIAÇÃO">
                      <Negotiation />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="gestao-fiscal"
                  element={
                    <PermissionRoute module="GESTÃO FISCAL">
                      <GestaoFiscal />
                    </PermissionRoute>
                  }
                />

                {/* FINANCEIRO */}
                <Route
                  path="central-de-acessos"
                  element={
                    <PermissionRoute module="ACESSOS">
                      <Acessos />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="central-de-acessos/:id"
                  element={
                    <PermissionRoute module="ACESSOS">
                      <AcessoManual />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="estoque"
                  element={
                    <PermissionRoute module="ESTOQUE">
                      <Inventory />
                    </PermissionRoute>
                  }
                />

                {/* ADMINISTRATIVO */}
                <Route
                  path="dashboard"
                  element={
                    <PermissionRoute module="DASHBOARD">
                      <Index />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="kpis"
                  element={
                    <PermissionRoute module="KPIS">
                      <KPIs />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="usuarios"
                  element={
                    <PermissionRoute module="USUÁRIOS E PERMISSÕES">
                      <UsuariosPermissoes />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="escala-de-trabalho"
                  element={
                    <PermissionRoute module="RH">
                      <EscalaTrabalho />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="precificacao"
                  element={
                    <PermissionRoute module="PRECIFICAÇÃO">
                      <Pricing />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="segmentacao-agenda"
                  element={
                    <PermissionRoute module="SEGMENTAÇÃO">
                      <AgendaSegmentation />
                    </PermissionRoute>
                  }
                />

                {/* SISTEMA */}
                <Route
                  path="configuracoes"
                  element={
                    <PermissionRoute module="CONFIGURAÇÕES">
                      <Settings />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="permissoes"
                  element={
                    <PermissionRoute module="USUÁRIOS E PERMISSÕES">
                      <Permissoes />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="logs"
                  element={
                    <PermissionRoute module="LOGS">
                      <AuditLog />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="debug"
                  element={
                    <PermissionRoute module="LOGS" adminOnly>
                      <DebugAccess />
                    </PermissionRoute>
                  }
                />

                <Route path="acesso-negado" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
          <Toaster />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
