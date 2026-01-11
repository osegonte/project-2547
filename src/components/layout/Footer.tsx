import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      navigate('/')
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      navigate(href)
      window.scrollTo(0, 0)
    }
  }

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-[1200px] mx-auto px-8 lg:px-12 py-16 lg:py-20">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif font-bold mb-3">
              Hope Catalyst
            </h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Supporting Nigerian students with verified school fee payments.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNavClick('#how-it-works')}
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#transparency')}
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  Transparency
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('/check-status')}
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  Check Status
                </button>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:support@hopecatalyst.com"
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@hopecatalyst.com"
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/50">
              © 2025 Hope Catalyst Scholarship. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}