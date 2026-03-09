import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import Department from '@/pages/Department'
import Onboarding from '@/pages/Onboarding'
import NotFound from '@/pages/NotFound'
import { AppProvider } from '@/stores/main'

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="departamento/:id" element={<Department />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  )
}
