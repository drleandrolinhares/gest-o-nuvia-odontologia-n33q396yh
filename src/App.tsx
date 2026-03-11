import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import RH from '@/pages/RH'
import EmployeeProfile from '@/pages/EmployeeProfile'
import Inventory from '@/pages/Inventory'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'
import Agenda from '@/pages/Agenda'
import Acessos from '@/pages/Acessos'
import PublicHome from '@/pages/PublicHome'
import Login from '@/pages/Login'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AppProvider } from '@/stores/main'

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Index />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="acessos" element={<Acessos />} />
            <Route path="rh" element={<RH />} />
            <Route path="rh/colaborador/:id" element={<EmployeeProfile />} />
            <Route path="estoque" element={<Inventory />} />
            <Route path="configuracoes" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}
