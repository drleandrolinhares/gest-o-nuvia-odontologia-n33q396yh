import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import RH from '@/pages/RH'
import EmployeeProfile from '@/pages/EmployeeProfile'
import Inventory from '@/pages/Inventory'
import NotFound from '@/pages/NotFound'
import { AppProvider } from '@/stores/main'

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="rh" element={<RH />} />
            <Route path="rh/colaborador/:id" element={<EmployeeProfile />} />
            <Route path="estoque" element={<Inventory />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  )
}
