import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Index from '@/pages/Index'
import RH from '@/pages/RH'
import EmployeeProfile from '@/pages/EmployeeProfile'
import WorkSchedule from '@/pages/WorkSchedule'
import Inventory from '@/pages/Inventory'
import Pricing from '@/pages/Pricing'
import Negotiation from '@/pages/Negotiation'
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
import AuditLog from '@/pages/AuditLog'
import ForceChangePassword from '@/pages/ForceChangePassword'
import { AppProvider } from '@/stores/main'
import { AuthProvider } from '@/hooks/use-auth'
import { ChatProvider } from '@/stores/chat'
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
                    <ChatProvider>
                      <Layout />
                    </ChatProvider>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Index />} />
                <Route path="admin/dashboard" element={<Index />} />
                <Route path="admin/agenda" element={<Agenda />} />
                <Route path="admin/chat" element={<Chat />} />
                <Route path="admin/sac" element={<SAC />} />
                <Route path="admin/acessos" element={<Acessos />} />
                <Route path="admin/acessos/:id" element={<AcessoManual />} />
                <Route path="admin/rh" element={<RH />} />
                <Route path="admin/rh/colaborador/:id" element={<EmployeeProfile />} />
                <Route path="admin/rh/escala" element={<WorkSchedule />} />
                <Route path="admin/estoque" element={<Inventory />} />
                <Route path="admin/precificacao" element={<Pricing />} />
                <Route path="admin/operacao/negociacao" element={<Negotiation />} />
                <Route path="admin/configuracoes" element={<Settings />} />
                <Route path="admin/permissoes" element={<Permissions />} />
                <Route path="admin/auditoria" element={<AuditLog />} />
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
