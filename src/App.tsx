import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Index from '@/pages/Index'
import RH from '@/pages/RH'
import EmployeeProfile from '@/pages/EmployeeProfile'
import WorkSchedule from '@/pages/WorkSchedule'
import Inventory from '@/pages/Inventory'
import Pricing from '@/pages/Pricing'
import Settings from '@/pages/Settings'
import Permissions from '@/pages/Permissions'
import NotFound from '@/pages/NotFound'
import Agenda from '@/pages/Agenda'
import Acessos from '@/pages/Acessos'
import AcessoManual from '@/pages/AcessoManual'
import Login from '@/pages/Login'
import Chat from '@/pages/Chat'
import ProtectedRoute from '@/components/ProtectedRoute'
import AuditLog from '@/pages/AuditLog'
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
              <Route path="/" element={<Navigate to="/admin/agenda" replace />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <ChatProvider>
                      <Layout />
                    </ChatProvider>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="agenda" replace />} />
                <Route path="agenda" element={<Agenda />} />
                <Route path="dashboard" element={<Index />} />
                <Route path="chat" element={<Chat />} />
                <Route path="acessos" element={<Acessos />} />
                <Route path="acessos/:id" element={<AcessoManual />} />
                <Route path="rh" element={<RH />} />
                <Route path="rh/colaborador/:id" element={<EmployeeProfile />} />
                <Route path="rh/escala" element={<WorkSchedule />} />
                <Route path="estoque" element={<Inventory />} />
                <Route path="precificacao" element={<Pricing />} />
                <Route path="configuracoes" element={<Settings />} />
                <Route path="permissoes" element={<Permissions />} />
                <Route path="auditoria" element={<AuditLog />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
