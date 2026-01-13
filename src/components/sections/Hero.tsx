import { motion } from 'framer-motion'
import { Shield, Building2, Zap } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}

interface HeroProps {
  onOpenModal: () => void
}

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg.jpg"
          alt="Students studying"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="w-full relative z-10">
        <div className="max-w-[1200px] mx-auto px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-16 items-center min-h-screen py-32 lg:py-20">
            
            {/* LEFT SIDE - Text Content */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-7 relative z-20"
              style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)' }}
            >
              {/* Eyebrow Badge */}
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified School Payments
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <h1 className="text-white font-serif text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                  Education Support,<br />
                  <span className="text-accent">Simplified</span>
                </h1>
              </motion.div>
              
              {/* Subheadline */}
              <motion.p 
                variants={fadeInUp}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-xl text-white/90 font-light max-w-xl leading-relaxed"
              >
                Submit your school fee request. We review, verify, and pay directly to your institution.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                variants={fadeInUp}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2"
              >
                <motion.button
                  onClick={onOpenModal}
                  whileHover={{ y: -2, boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  className="h-14 px-10 bg-white hover:bg-white/95 text-primary font-semibold rounded-lg shadow-lg transition-all text-base"
                >
                  Submit a Request
                </motion.button>

                <button
                  onClick={() => {
                    const element = document.querySelector('#how-it-works')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className="text-white/90 hover:text-white font-medium text-base transition-colors underline decoration-white/40 hover:decoration-white underline-offset-4"
                >
                  How it works
                </button>
              </motion.div>
            </motion.div>

            {/* RIGHT SIDE - Glassmorphism Card */}
            <motion.div 
              variants={fadeInRight}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="hidden lg:flex justify-center items-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                className="w-full max-w-[360px] bg-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-2xl p-8"
              >
                <div className="space-y-6">
                  {/* Microproof Item 1 */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/30">
                      <Shield className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Verified Requests</p>
                      <p className="text-xs text-white/70">Document validation</p>
                    </div>
                  </div>

                  {/* Microproof Item 2 */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/30">
                      <Building2 className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Pays Schools Directly</p>
                      <p className="text-xs text-white/70">No cash handling</p>
                    </div>
                  </div>

                  {/* Microproof Item 3 */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/30">
                      <Zap className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Transparent Process</p>
                      <p className="text-xs text-white/70">Track your request</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}