import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/public/Home'
import Request from './pages/public/Request'
import Submitted from './pages/public/Submitted'
import DebugPage from './pages/public/DebugPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import RequestDetail from './pages/admin/RequestDetail'
import RequestModal from './components/ui/RequestModal'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public Routes with Header/Footer */}
          <Route path="/*" element={
            <>
              <Header onOpenModal={() => setIsModalOpen(true)} />
              <Routes>
                <Route path="/" element={<Home onOpenModal={() => setIsModalOpen(true)} />} />
                <Route path="/request" element={<Request />} />
                <Route path="/submitted" element={<Submitted />} />
                <Route path="/debug" element={<DebugPage />} />
              </Routes>
              <Footer />
            </>
          } />

          {/* Admin Routes (No Header/Footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/requests/:id" element={
            <ProtectedRoute>
              <RequestDetail />
            </ProtectedRoute>
          } />
        </Routes>
        
        {/* Global Request Modal */}
        <RequestModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </Router>
  )
}

export default App