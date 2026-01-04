import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/public/Home'
import Request from './pages/public/Request'
import Submitted from './pages/public/Submitted'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request" element={<Request />} />
          <Route path="/submitted" element={<Submitted />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
