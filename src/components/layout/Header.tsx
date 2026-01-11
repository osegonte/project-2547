import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { User, Mail } from 'lucide-react'
import MobileMenu from '../ui/MobileMenu'

interface HeaderProps {
  onOpenModal: () => void
}

export default function Header({ onOpenModal }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isInHero, setIsInHero] = useState(true)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const heroHeight = window.innerHeight
    const isStillInHero = latest < heroHeight - 100
    
    setIsInHero(isStillInHero)
  })

  useEffect(() => {
    setIsInHero(location.pathname === '/')
  }, [location.pathname])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const element = document.querySelector(href)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      } else {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    } else {
      navigate(href)
      window.scrollTo(0, 0)
    }
  }

  const showTransparent = isInHero && location.pathname === '/'

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          backgroundColor: showTransparent ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0.95)',
          borderBottomColor: showTransparent ? 'rgba(255, 255, 255, 0)' : 'rgba(214, 219, 226, 0.3)'
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ backdropFilter: showTransparent ? 'none' : 'blur(12px)' }}
      >
        <div className="max-w-[1200px] mx-auto px-8 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo - Closer to edge */}
          <a 
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center -ml-1"
          >
            <div 
              className="text-2xl font-serif font-bold transition-colors duration-300" 
              style={{ color: showTransparent ? 'white' : 'hsl(215, 70%, 42%)' }}
            >
              Hope Catalyst
            </div>
          </a>
          
          {/* Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-12">
            <a 
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, '#how-it-works')}
              className="relative text-sm font-medium transition-colors duration-200 group"
              style={{ color: showTransparent ? 'rgba(255, 255, 255, 0.9)' : 'hsl(220, 25%, 18%)' }}
            >
              How It Works
              <span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: showTransparent ? 'white' : 'hsl(210, 65%, 55%)' }}
              />
            </a>
            
            <a 
              href="#transparency"
              onClick={(e) => handleNavClick(e, '#transparency')}
              className="relative text-sm font-medium transition-colors duration-200 group"
              style={{ color: showTransparent ? 'rgba(255, 255, 255, 0.9)' : 'hsl(220, 25%, 18%)' }}
            >
              Transparency
              <span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: showTransparent ? 'white' : 'hsl(210, 65%, 55%)' }}
              />
            </a>
          </nav>
          
          {/* Right Side - Icon Actions (Desktop) + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Icon Actions - Desktop Only */}
            <div className="hidden md:flex items-center gap-2">
              {/* Account/User Icon */}
              <button
                onClick={() => navigate('/check-status')}
                className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/10"
                style={{ color: showTransparent ? 'white' : 'hsl(220, 25%, 18%)' }}
                aria-label="Check request status"
                title="Check Status"
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Contact/Submit Icon */}
              <button
                onClick={onOpenModal}
                className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/10"
                style={{ color: showTransparent ? 'white' : 'hsl(220, 25%, 18%)' }}
                aria-label="Submit request"
                title="Submit Request"
              >
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: showTransparent ? 'white' : 'hsl(220, 25%, 18%)' }}
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