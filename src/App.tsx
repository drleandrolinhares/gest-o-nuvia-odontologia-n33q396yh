import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import Index from '@/pages/Index'
import RH from '@/pages/RH'
import EmployeeProfile from '@/pages/EmployeeProfile'
import WorkSchedule from '@/pages/WorkSchedule'
import Inventory from '@/pages/Inventory'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'
import Agenda from '@/pages/Agenda'
import Acessos from '@/pages/Acessos'
import PublicHome from '@/pages/PublicHome'
import Login from '@/pages/Login'
import Chat from '@/pages/Chat'
import ProtectedRoute from '@/components/ProtectedRoute'
import AuditLog from '@/pages/AuditLog'
import { AppProvider } from '@/stores/main'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { ChatProvider } from '@/stores/chat'
import { Toaster } from '@/components/ui/toaster'

function RootRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-[#0A192F]" />
  if (user) return <Navigate to="/admin/dashboard" replace />
  return <PublicHome />
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RootRoute />} />
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
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Index />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="chat" element={<Chat />} />
              <Route path="acessos" element={<Acessos />} />
              <Route path="rh" element={<RH />} />
              <Route path="rh/colaborador/:id" element={<EmployeeProfile />} />
              <Route path="rh/escala" element={<WorkSchedule />} />
              <Route path="estoque" element={<Inventory />} />
              <Route path="configuracoes" element={<Settings />} />
              <Route path="auditoria" element={<AuditLog />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AppProvider>
    </AuthProvider>
  )
}
