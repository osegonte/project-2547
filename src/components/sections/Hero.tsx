import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3
    }
  }
}

interface HeroProps {
  onOpenModal: () => void
}

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80">
      {/* Subtle pattern overlay (optional) */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Content */}
      <div className="w-full relative z-10 container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified School Payments
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={fadeInUp}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-white font-serif"
            >
              Education Support,<br />
              <span className="text-accent">Simplified & Transparent</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              variants={fadeInUp}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed"
            >
              Submit your school fee request. We review, verify, and pay directly to your institution.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div 
              variants={fadeInUp}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="pt-4"
            >
              <motion.button
                onClick={onOpenModal}
                whileHover={{ 
                  y: -2, 
                  boxShadow: '0 10px 25px rgba(79, 134, 198, 0.35)' 
                }}
                whileTap={{ scale: 0.98 }}
                className="h-14 px-12 bg-white hover:bg-white/95 text-primary font-semibold rounded-lg shadow-medium transition-all text-base"
              >
                Submit a Request
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="pt-8 flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Verified Requests Only</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Direct to Institution</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Fast Review Process</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}