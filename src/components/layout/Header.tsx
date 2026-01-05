import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
          borderBottomColor: showTransparent ? 'rgba(255, 255, 255, 0)' : 'rgba(214, 219, 226, 0.5)'
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ backdropFilter: showTransparent ? 'none' : 'blur(8px)' }}
      >
        <div className="container-custom h-20 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center"
          >
            <div className="text-2xl font-serif font-bold" style={{ color: showTransparent ? 'white' : 'hsl(215, 70%, 42%)' }}>
              Hope Catalyst
            </div>
          </a>
          
          {/* Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-10">
            <a 
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, '#how-it-works')}
              className="relative text-sm font-medium transition-colors group"
              style={{ color: showTransparent ? 'white' : 'hsl(220, 25%, 18%)' }}
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
            
            <a 
              href="#transparency"
              onClick={(e) => handleNavClick(e, '#transparency')}
              className="relative text-sm font-medium transition-colors group"
              style={{ color: showTransparent ? 'white' : 'hsl(220, 25%, 18%)' }}
            >
              Transparency
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>
          
          {/* Right Side - Submit Button + Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenModal}
              className="hidden md:flex items-center gap-2 h-10 px-6 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg shadow-medium transition-all"
            >
              Submit Request
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: showTransparent ? 'white' : 'hsl(220, 25%, 18%)' }}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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