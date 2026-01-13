import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { User, Mail } from 'lucide-react'
import MobileMenu from '../ui/MobileMenu'

interface HeaderProps {
  onOpenModal: () => void
}

export default function Header({ onOpenModal }: HeaderProps) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      navigate(href)
      window.scrollTo(0, 0)
    }
  }

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/15 backdrop-blur-2xl border-b border-white/30"
      >
        <div className="max-w-[1200px] mx-auto px-8 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center -ml-1"
          >
            <div className="text-2xl font-serif font-bold text-white transition-colors duration-300">
              Hope Catalyst
            </div>
          </a>
          
          {/* Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-12">
            <a 
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, '#how-it-works')}
              className="relative text-sm font-medium text-white/90 hover:text-white transition-colors duration-200 group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
            </a>
            
            <a 
              href="#transparency"
              onClick={(e) => handleNavClick(e, '#transparency')}
              className="relative text-sm font-medium text-white/90 hover:text-white transition-colors duration-200 group"
            >
              Transparency
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>
          
          {/* Right Side - Icon Actions (Desktop) + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Icon Actions - Desktop Only */}
            <div className="hidden md:flex items-center gap-2">
              {/* Account/User Icon */}
              <button
                onClick={() => navigate('/check-status')}
                className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/10 text-white"
                aria-label="Check request status"
                title="Check Status"
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Contact/Submit Icon */}
              <button
                onClick={onOpenModal}
                className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/10 text-white"
                aria-label="Submit request"
                title="Submit Request"
              >
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors text-white hover:bg-white/10"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenModal={onOpenModal}
      />
    </>
  )
}