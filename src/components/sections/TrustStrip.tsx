import { motion } from 'framer-motion'
import { Shield, Building2, Zap } from 'lucide-react'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function TrustStrip() {
  return (
    <section className="relative z-10 -mt-20 pb-24">
      <div className="max-w-[1200px] mx-auto px-8 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          variants={fadeIn}
          className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg py-6 px-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
            
            {/* Trust Item 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-accent" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground whitespace-nowrap">
                  Verified requests only
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-border/50" />

            {/* Trust Item 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-accent" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground whitespace-nowrap">
                  Paid directly to institutions
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-border/50" />

            {/* Trust Item 3 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-accent" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground whitespace-nowrap">
                  Fast review process
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}