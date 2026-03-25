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
import ProtectedRoute from '@/components/ProtectedRoute'
import PermissionRoute from '@/components/PermissionRoute'
import AuditLog from '@/pages/AuditLog'
import ForceChangePassword from '@/pages/ForceChangePassword'
import Mural from '@/pages/hub/Mural'
import Feedback from '@/pages/hub/Feedback'
import Ranking from '@/pages/hub/Ranking'
import Performance from '@/pages/hub/Performance'
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
                  path="admin/dashboard"
                  element={
                    <PermissionRoute module="DASHBOARD">
                      <Index />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="admin/agenda"
                  element={
                    <PermissionRoute module="AGENDA">
                      <Agenda />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="admin/chat"
                  element={
                    <PermissionRoute module="MENSAGENS">
                      <Chat />
                    </PermissionRoute>
                  }
                />
                <Route path="admin/sac" element={<SAC />} />
                <Route
                  path="admin/acessos"
                  element={
                    <PermissionRoute module="ACESSOS">
                      <Acessos />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="admin/acessos/:id"
                  element={
                    <PermissionRoute module="ACESSOS">
                      <AcessoManual />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="admin/rh"
                  element={
                    <PermissionRoute module="RH">
                      <RH />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="admin/rh/colaborador/:id"
                  element={
                    <PermissionRoute module="RH">
                      <EmployeeProfile />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="admin/rh/escala"
                  element={
                    <PermissionRoute module="ESCALA DE TRABALHO">
                      <WorkSchedule />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="admin/estoque"
                  element={
                    <PermissionRoute module="ESTOQUE">
                      <Inventory />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="admin/precificacao"
                  element={
                    <PermissionRoute adminOnly>
                      <Pricing />
                    </PermissionRoute>
                  }
                />
                <Route path="admin/operacao/negociacao" element={<Negotiation />} />
                <Route path="admin/operacao/segmentacao" element={<AgendaSegmentation />} />
                <Route
                  path="admin/configuracoes"
                  element={
                    <PermissionRoute module="CONFIGURAÇÕES">
                      <Settings />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="admin/permissoes"
                  element={
                    <PermissionRoute adminOnly>
                      <Permissions />
                    </PermissionRoute>
                  }
                />
                <Route
                  path="admin/auditoria"
                  element={
                    <PermissionRoute module="LOGS">
                      <AuditLog />
                    </PermissionRoute>
                  }
                />

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
