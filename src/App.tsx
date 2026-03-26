import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Index from '@/pages/Index'
import RH from '@/pages/RH'
import EmployeeProfile from '@/pages/EmployeeProfile'
import WorkSchedule from '@/pages/WorkSchedule'
import Inventory from '@/pages/Inventory'
import Pricing from '@/pages/Pricing'
import Negotiation from '@/pages/Negotiation'
import AgendaSegmentation from '@/pages/AgendaSegmentation'
import Settings from '@/pages/Settings'
import Permissions from '@/pages/Permissions'
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
import Mural from '@/pages/hub/Mural'
import Feedback from '@/pages/hub/Feedback'
import Ranking from '@/pages/hub/Ranking'
import Performance from '@/pages/hub/Performance'
import TestRoutes from '@/pages/TestRoutes'
import DebugAccess from '@/pages/DebugAccess'
import AccessDenied from '@/pages/AccessDenied'
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

                <Route
                  path="dashboard"
                  element={
                    <PermissionRoute module="DASHBOARD">
                      <Index />
                    </PermissionRoute>
                  }
                />

                {/* Visão Diária */}
                <Route
                  path="agenda"
                  element={
                    <PermissionRoute module="AGENDA">
                      <Agenda />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="chat"
                  element={
                    <PermissionRoute module="MENSAGENS">
                      <Chat />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="sac"
                  element={
                    <PermissionRoute module="SAC">
                      <SAC />
                    </PermissionRoute>
                  }
                />

                {/* Comercial */}
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

                {/* Financeiro */}
                <Route
                  path="acessos"
                  element={
                    <PermissionRoute module="ACESSOS">
                      <Acessos />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="acessos/:id"
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

                {/* Administrativo */}
                <Route
                  path="kpis"
                  element={
                    <PermissionRoute module="KPIS">
                      <KPIs />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="rh"
                  element={
                    <PermissionRoute module="RH">
                      <RH />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="rh/colaborador/:id"
                  element={
                    <PermissionRoute module="RH">
                      <EmployeeProfile />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="rh/escala"
                  element={
                    <PermissionRoute module="ESCALA DE TRABALHO">
                      <WorkSchedule />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="precificacao"
                  element={
                    <PermissionRoute adminOnly>
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

                {/* Sistema */}
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
                    <PermissionRoute adminOnly>
                      <Permissions />
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
                  path="auditoria-rotas"
                  element={
                    <PermissionRoute adminOnly>
                      <TestRoutes />
                    </PermissionRoute>
                  }
                />

                {/* Debug / Diagnóstico de Acesso */}
                <Route
                  path="debug"
                  element={
                    <PermissionRoute adminOnly>
                      <DebugAccess />
                    </PermissionRoute>
                  }
                />

                <Route path="acesso-negado" element={<AccessDenied />} />

                {/* Hub */}
                <Route path="hub/mural" element={<Mural />} />
                <Route path="hub/feedback" element={<Feedback />} />
                <Route path="hub/performance" element={<Performance />} />
                <Route path="hub/ranking" element={<Ranking />} />

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
